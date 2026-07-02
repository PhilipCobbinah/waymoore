const STORAGE_KEYS = {
    products: 'waymooreAdminProducts',
    session: 'waymooreAdminSession',
    categories: 'waymooreAdminCategories',
    orders: 'waymooreAdminOrders',
    customers: 'waymooreAdminCustomers',
    messages: 'waymooreAdminMessages',
    reviews: 'waymooreAdminReviews',
    settings: 'waymooreAdminSettings',
    currency: 'waymooreAdminCurrency',
    media: 'waymooreMediaLibrary'
};

// Currency configuration with African currencies and USD exchange rates
const CURRENCIES = {
    NGN: { name: 'Nigerian Naira', symbol: '₦', rate: 1550 },
    GHS: { name: 'Ghanaian Cedi', symbol: '₵', rate: 12.5 },
    USD: { name: 'US Dollar', symbol: '$', rate: 1 },
    KES: { name: 'Kenyan Shilling', symbol: 'KSh', rate: 147 },
    ZAR: { name: 'South African Rand', symbol: 'R', rate: 18.5 },
    EGP: { name: 'Egyptian Pound', symbol: 'E£', rate: 48 },
    UGX: { name: 'Ugandan Shilling', symbol: 'USh', rate: 3800 },
    TZS: { name: 'Tanzanian Shilling', symbol: 'TSh', rate: 2650 },
    RWF: { name: 'Rwandan Franc', symbol: 'Fr', rate: 1310 },
    XOF: { name: 'West African CFA Franc', symbol: 'Fr', rate: 615 }
};

// Currency Management Functions
function getCurrentCurrency() {
    return localStorage.getItem(STORAGE_KEYS.currency) || 'NGN';
}

function setCurrentCurrency(currency) {
    if (CURRENCIES[currency]) {
        localStorage.setItem(STORAGE_KEYS.currency, currency);
        window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency } }));
        return true;
    }
    return false;
}

function convertPrice(price, fromCurrency = 'NGN', toCurrency = 'NGN') {
    if (!price) return '0';
    
    // Extract numeric value from price string
    const numericValue = parseFloat(String(price).replace(/[^\d.]/g, ''));
    if (isNaN(numericValue)) return '0';
    
    const fromRate = CURRENCIES[fromCurrency]?.rate || 1;
    const toRate = CURRENCIES[toCurrency]?.rate || 1;
    
    // Convert to USD first, then to target currency
    const usdValue = numericValue / fromRate;
    const convertedValue = usdValue * toRate;
    
    return convertedValue.toFixed(2);
}

function formatPrice(amount, currency = 'NGN') {
    const currencyInfo = CURRENCIES[currency];
    if (!currencyInfo) return amount;
    
    const numericValue = parseFloat(amount);
    if (isNaN(numericValue)) return amount;
    
    const isLargeNumber = numericValue >= 1000;
    const formatted = isLargeNumber 
        ? numericValue.toLocaleString('en-US', { maximumFractionDigits: 0 })
        : numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    return `${currencyInfo.symbol}${formatted}`;
}

function formatPriceDisplay(amount, currency = 'NGN') {
    const currencyInfo = CURRENCIES[currency];
    if (!currencyInfo) return amount;
    
    const numericValue = parseFloat(String(amount).replace(/[^\d.]/g, ''));
    if (isNaN(numericValue)) return amount;
    
    const isLargeNumber = numericValue >= 1000;
    const formatted = isLargeNumber 
        ? numericValue.toLocaleString('en-US', { maximumFractionDigits: 0 })
        : numericValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    
    return `${currencyInfo.symbol}${formatted}`;
}

function formatPriceInCurrency(amount, targetCurrency = 'NGN', sourceCurrency = 'NGN') {
    const currencyInfo = CURRENCIES[targetCurrency];
    if (!currencyInfo) return amount;

    const numericValue = parseFloat(String(amount).replace(/[^\d.]/g, ''));
    if (isNaN(numericValue)) {
        return `${currencyInfo.symbol}0`;
    }

    const convertedAmount = convertPrice(numericValue, sourceCurrency, targetCurrency);
    return formatPrice(convertedAmount, targetCurrency);
}

function updatePriceDisplay(element, rawPrice, sourceCurrency = 'NGN') {
    if (!element || !rawPrice) return;
    
    const targetCurrency = getCurrentCurrency();
    const convertedAmount = convertPrice(rawPrice, sourceCurrency, targetCurrency);
    const formatted = formatPrice(convertedAmount, targetCurrency);
    element.textContent = formatted;
}

// Media Library Management
const MediaLibrary = {
    getAll() {
        const data = localStorage.getItem(STORAGE_KEYS.media);
        return data ? JSON.parse(data) : {};
    },

    save(library) {
        localStorage.setItem(STORAGE_KEYS.media, JSON.stringify(library));
        window.dispatchEvent(new CustomEvent('mediaLibraryUpdated', { detail: { library } }));
    },

    addMedia(file, dataUrl) {
        const library = this.getAll();
        const mediaId = `media-${Date.now()}`;
        library[mediaId] = {
            id: mediaId,
            name: file.name,
            size: file.size,
            type: file.type,
            data: dataUrl,
            path: `admin/media/${mediaId}.jpg`,
            uploadedAt: new Date().toISOString()
        };
        this.save(library);
        return mediaId;
    },

    getMedia(mediaId) {
        const library = this.getAll();
        return library[mediaId] || null;
    },

    getMediaUrl(mediaId) {
        const media = this.getMedia(mediaId);
        return media ? media.data : null;
    },

    deleteMedia(mediaId) {
        const library = this.getAll();
        delete library[mediaId];
        this.save(library);
        return true;
    },

    getMediaList() {
        const library = this.getAll();
        return Object.values(library).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    }
};

const defaultProducts = [
    {
        id: 1,
        name: 'Body Butter',
        category: 'Skin Care',
        subcategory: 'Body Care',
        price: '₦10,000',
        discountPrice: '',
        sku: 'WB-001',
        quantity: 18,
        weight: '250g',
        shortDescription: 'Botanical body butter that nourishes and brightens.',
        description: 'A luxurious body butter made for radiant skin and deep hydration.',
        ingredients: 'Shea butter, cocoa butter, aloe vera',
        benefits: 'Hydrates, brightens, softens',
        directions: 'Apply generously after bathing.',
        warnings: 'For external use only.',
        tags: 'body butter, botanical, glow',
        status: 'Published',
        featured: true,
        bestseller: true,
        newArrival: false,
        trending: true,
        thumbnail: '/assets/img/products/repair_brightening_body_butter.jpeg',
        images: ['/assets/img/products/repair_brightening_body_butter.jpeg'],
        videoUrl: '',
        seoTitle: 'Body Butter',
        seoDescription: 'Natural body butter for deep hydration and skin glow.',
        slug: 'body-butter',
        createdAt: '2024-04-12',
        updatedAt: '2024-04-12'
    },
    {
        id: 2,
        name: 'African Black Shampoo',
        category: 'Hair Care',
        subcategory: 'Hair Cleanse',
        price: '₦60',
        discountPrice: '',
        sku: 'HC-002',
        quantity: 8,
        weight: '250ml',
        shortDescription: 'Detoxifying shampoo with botanical extracts.',
        description: 'A cleansing shampoo for scalp nourishment and hair strength.',
        ingredients: 'Black soap, rosemary, tea tree',
        benefits: 'Cleanses, strengthens, refreshes',
        directions: 'Massage into scalp and rinse.',
        warnings: 'Patch test before use.',
        tags: 'shampoo, haircare, natural',
        status: 'Draft',
        featured: false,
        bestseller: false,
        newArrival: true,
        trending: false,
        thumbnail: '/assets/img/products/waymoore_black_soap.jpg',
        images: ['/assets/img/products/waymoore_black_soap.jpg'],
        videoUrl: '',
        seoTitle: 'African Black Shampoo',
        seoDescription: 'Botanical shampoo for healthy natural hair.',
        slug: 'african-black-shampoo',
        createdAt: '2024-06-01',
        updatedAt: '2024-06-04'
    },
    {
        id: 3,
        name: 'Organic Stimulating Hair Growth Butter',
        category: 'Hair Care',
        subcategory: 'Hair Butter',
        price: '₦6,000',
        discountPrice: '',
        sku: 'HC-003',
        quantity: 12,
        weight: '250g',
        shortDescription: 'Stimulating hair growth butter for healthy scalp nourishment.',
        description: 'A rich botanical treatment designed to support stronger, healthier-looking hair.',
        ingredients: 'Shea butter, rosemary, peppermint',
        benefits: 'Moisturizes, strengthens, stimulates',
        directions: 'Apply to scalp and hair as needed.',
        warnings: 'For external use only.',
        tags: 'hair butter, growth, stimulation',
        status: 'Published',
        featured: false,
        bestseller: false,
        newArrival: true,
        trending: false,
        thumbnail: '/assets/img/products/hair_growth_butter.jpeg',
        images: ['/assets/img/products/hair_growth_butter.jpeg'],
        videoUrl: '',
        seoTitle: 'Organic Stimulating Hair Growth Butter',
        seoDescription: 'Stimulating hair growth butter for stronger, healthier hair.',
        slug: 'organic-stimulating-hair-growth-butter',
        createdAt: '2024-06-20',
        updatedAt: '2024-06-20'
    },
    {
        id: 4,
        name: 'Organic Stimulating Hair Pomade',
        category: 'Hair Care',
        subcategory: 'Hair Pomade',
        price: '₦6,000',
        discountPrice: '',
        sku: 'HC-004',
        quantity: 10,
        weight: '250g',
        shortDescription: 'Nourishing pomade for scalp comfort and hair control.',
        description: 'A soothing hair pomade crafted to support scalp comfort and keep hair looking polished.',
        ingredients: 'Natural butters, oils, herbs',
        benefits: 'Controls hair, nourishes, softens',
        directions: 'Apply a small amount to hair and scalp.',
        warnings: 'For external use only.',
        tags: 'pomade, haircare, natural',
        status: 'Published',
        featured: false,
        bestseller: false,
        newArrival: true,
        trending: false,
        thumbnail: '/assets/img/products/hair-care.jpg',
        images: ['/assets/img/products/hair-care.jpg'],
        videoUrl: '',
        seoTitle: 'Organic Stimulating Hair Pomade',
        seoDescription: 'Organic stimulating hair pomade for nourished and controlled hair.',
        slug: 'organic-stimulating-hair-pomade',
        createdAt: '2024-06-20',
        updatedAt: '2024-06-20'
    },
    {
        id: 5,
        name: 'Vital Seed Blend',
        category: 'Health & Wellness',
        subcategory: 'Wellness',
        price: '₦25,000',
        discountPrice: '',
        sku: 'HW-005',
        quantity: 7,
        weight: '250g',
        shortDescription: 'A nutrient-rich blend for overall vitality.',
        description: 'A carefully formulated wellness blend designed to support daily vitality and balance.',
        ingredients: 'Seeds, herbs, botanicals',
        benefits: 'Supports wellness, vitality, balance',
        directions: 'Take as directed on label.',
        warnings: 'Consult a physician if pregnant or nursing.',
        tags: 'wellness, seed blend, vitality',
        status: 'Published',
        featured: true,
        bestseller: false,
        newArrival: true,
        trending: false,
        thumbnail: '/assets/img/products/health-wellness2.jpeg',
        images: ['/assets/img/products/health-wellness2.jpeg'],
        videoUrl: '',
        seoTitle: 'Vital Seed Blend',
        seoDescription: 'Nutrient-rich vital seed blend for daily wellness support.',
        slug: 'vital-seed-blend',
        createdAt: '2024-06-20',
        updatedAt: '2024-06-20'
    },
    {
        id: 6,
        name: 'Leave-In Conditioner',
        category: 'Hair Care',
        subcategory: 'Hair Care',
        price: '₦6,000',
        discountPrice: '',
        sku: 'HC-006',
        quantity: 15,
        weight: '250ml',
        shortDescription: 'Detangles and hydrates hair without weighing it down.',
        description: 'A lightweight conditioner that leaves hair smooth, soft, and manageable.',
        ingredients: 'Natural oils, herbal extracts',
        benefits: 'Hydrates, detangles, softens',
        directions: 'Spray or apply to damp hair and style.',
        warnings: 'For external use only.',
        tags: 'leave-in, conditioner, haircare',
        status: 'Published',
        featured: false,
        bestseller: false,
        newArrival: false,
        trending: true,
        thumbnail: '/assets/img/products/waymoore_leave_in_conditioner.jpeg',
        images: ['/assets/img/products/waymoore_leave_in_conditioner.jpeg'],
        videoUrl: '',
        seoTitle: 'Leave-In Conditioner',
        seoDescription: 'Leave-in conditioner for soft, hydrated, and manageable hair.',
        slug: 'leave-in-conditioner',
        createdAt: '2024-05-10',
        updatedAt: '2024-05-10'
    },
    {
        id: 7,
        name: 'Anti-Aging Glyceric Soap',
        category: 'Skin Care',
        subcategory: 'Soap',
        price: '₦35,000',
        discountPrice: '',
        sku: 'SC-007',
        quantity: 9,
        weight: '120g',
        shortDescription: 'Hydrating soap that helps smooth and soften the skin.',
        description: 'An anti-aging glyceric soap formulated to nourish skin while helping reduce signs of dryness.',
        ingredients: 'Glycerin, aloe, botanical extracts',
        benefits: 'Hydrates, smooths, softens',
        directions: 'Use on wet skin and rinse thoroughly.',
        warnings: 'For external use only.',
        tags: 'soap, anti-aging, glyceric',
        status: 'Published',
        featured: false,
        bestseller: false,
        newArrival: true,
        trending: false,
        thumbnail: '/assets/img/products/waymore_Glysolin soap.jpg',
        images: ['/assets/img/products/waymore_Glysolin soap.jpg'],
        videoUrl: '',
        seoTitle: 'Anti-Aging Glyceric Soap',
        seoDescription: 'Anti-aging glyceric soap for smoother, softer skin.',
        slug: 'anti-aging-glyceric-soap',
        createdAt: '2024-06-20',
        updatedAt: '2024-06-20'
    },
    {
        id: 8,
        name: 'Protein Mix Without Nuts (600g)',
        category: 'Health & Wellness',
        subcategory: 'Protein',
        price: '₦40,000',
        discountPrice: '',
        sku: 'HW-008',
        quantity: 6,
        weight: '600g',
        shortDescription: 'A 600g protein mix made without nuts.',
        description: 'A nut-free protein mix for daily nourishment and support.',
        ingredients: 'Plant proteins, herbs',
        benefits: 'Supports nutrition, easy to mix',
        directions: 'Mix with water or your favorite drink.',
        warnings: 'Store in a cool dry place.',
        tags: 'protein, nut-free, wellness',
        status: 'Published',
        featured: false,
        bestseller: true,
        newArrival: true,
        trending: false,
        thumbnail: '/assets/img/products/waymore_protein_without_nuts.jpg',
        images: ['/assets/img/products/waymore_protein_without_nuts.jpg'],
        videoUrl: '',
        seoTitle: 'Protein Mix Without Nuts (600g)',
        seoDescription: 'Nut-free plant protein mix in a 600g pack.',
        slug: 'protein-mix-without-nuts-600g',
        createdAt: '2024-06-20',
        updatedAt: '2024-06-20'
    },
    {
        id: 9,
        name: 'Protein Mix Without Nuts (250g)',
        category: 'Health & Wellness',
        subcategory: 'Protein',
        price: '₦15,000',
        discountPrice: '',
        sku: 'HW-009',
        quantity: 6,
        weight: '250g',
        shortDescription: 'A 250g protein mix made without nuts.',
        description: 'A smaller nut-free protein mix for light daily support.',
        ingredients: 'Plant proteins, herbs',
        benefits: 'Supports nutrition, easy to mix',
        directions: 'Mix with water or your favorite drink.',
        warnings: 'Store in a cool dry place.',
        tags: 'protein, nut-free, wellness',
        status: 'Published',
        featured: false,
        bestseller: false,
        newArrival: true,
        trending: false,
        thumbnail: '/assets/img/products/waymore_protein_without_nuts.jpg',
        images: ['/assets/img/products/waymore_protein_without_nuts.jpg'],
        videoUrl: '',
        seoTitle: 'Protein Mix Without Nuts (250g)',
        seoDescription: 'Nut-free plant protein mix in a 250g pack.',
        slug: 'protein-mix-without-nuts-250g',
        createdAt: '2024-06-20',
        updatedAt: '2024-06-20'
    },
    {
        id: 10,
        name: 'Protein Mix Without Nuts (1kg)',
        category: 'Health & Wellness',
        subcategory: 'Protein',
        price: '₦50,000',
        discountPrice: '',
        sku: 'HW-010',
        quantity: 4,
        weight: '1kg',
        shortDescription: 'A 1kg protein mix made without nuts.',
        description: 'A large nut-free protein mix for regular daily use.',
        ingredients: 'Plant proteins, herbs',
        benefits: 'Supports nutrition, easy to mix',
        directions: 'Mix with water or your favorite drink.',
        warnings: 'Store in a cool dry place.',
        tags: 'protein, nut-free, wellness',
        status: 'Published',
        featured: false,
        bestseller: false,
        newArrival: true,
        trending: false,
        thumbnail: '/assets/img/products/waymore_protein_without_nuts.jpg',
        images: ['/assets/img/products/waymore_protein_without_nuts.jpg'],
        videoUrl: '',
        seoTitle: 'Protein Mix Without Nuts (1kg)',
        seoDescription: 'Nut-free plant protein mix in a 1kg pack.',
        slug: 'protein-mix-without-nuts-1kg',
        createdAt: '2024-06-20',
        updatedAt: '2024-06-20'
    },
    {
        id: 11,
        name: 'Herbal Drink',
        category: 'Health & Wellness',
        subcategory: 'Wellness',
        price: '₦20,000',
        discountPrice: '',
        sku: 'HW-011',
        quantity: 8,
        weight: '500ml',
        shortDescription: 'A natural herbal drink for everyday wellness support.',
        description: 'A refreshing herbal drink crafted to support balance and daily wellness.',
        ingredients: 'Herbs, botanicals',
        benefits: 'Supports balance, wellness, refreshment',
        directions: 'Consume as directed on label.',
        warnings: 'Store in a cool dry place.',
        tags: 'herbal, wellness, drink',
        status: 'Published',
        featured: false,
        bestseller: false,
        newArrival: true,
        trending: false,
        thumbnail: '/assets/img/products/health-wellness.jpg',
        images: ['/assets/img/products/health-wellness.jpg'],
        videoUrl: '',
        seoTitle: 'Herbal Drink',
        seoDescription: 'Natural herbal drink for everyday wellness support.',
        slug: 'herbal-drink',
        createdAt: '2024-06-20',
        updatedAt: '2024-06-20'
    },
    {
        id: 12,
        name: 'Harmony Bloom',
        category: 'Health & Wellness',
        subcategory: 'Wellness',
        price: '₦25,000',
        discountPrice: '',
        sku: 'HW-012',
        quantity: 5,
        weight: '250g',
        shortDescription: 'A wellness blend created to promote balance and vitality.',
        description: 'Harmony Bloom is a premium wellness blend created to support calm, balance, and everyday vitality.',
        ingredients: 'Botanicals, herbs, natural extracts',
        benefits: 'Supports balance, calm, vitality',
        directions: 'Take as directed on label.',
        warnings: 'Consult a physician if pregnant or nursing.',
        tags: 'harmony bloom, wellness, balance',
        status: 'Published',
        featured: false,
        bestseller: false,
        newArrival: true,
        trending: false,
        thumbnail: '/assets/img/products/health-wellness1.jpeg',
        images: ['/assets/img/products/health-wellness1.jpeg'],
        videoUrl: '',
        seoTitle: 'Harmony Bloom',
        seoDescription: 'Wellness blend for calm, balance, and vitality.',
        slug: 'harmony-bloom',
        createdAt: '2024-06-20',
        updatedAt: '2024-06-20'
    }
];

const storefrontSeedProducts = [
    { id: 1, name: 'Waymoore Man Power', category: 'Health & Wellness', price: '₦150', image: '/assets/img/products/waymoore_man_power.jpg', description: 'Supports male wellness, boosts energy and vitality.' },
    { id: 6, name: 'Plant Protein Mix Without Nuts (13)', category: 'Health & Wellness', price: '₦80', image: '/assets/img/products/waymore_protein_without_nuts1.jpeg', description: 'Allergy friendly version of the plant-based protein mix.' },
    { id: 10, name: 'Hair Growth Oil', category: 'Hair Care', price: '₦75', image: '/assets/img/products/hair-care1.jpeg', description: 'Stimulates scalp and boosts hair growth.' },
    { id: 11, name: 'Leave-In Conditioner', category: 'Hair Care', price: '₦6,000', image: '/assets/img/products/waymoore_leave_in_conditioner.jpeg', description: 'Hydrates, detangles, and protects hair all day.' },
    { id: 13, name: 'African Black Shampoo', category: 'Hair Care', price: '₦60', image: '/assets/img/products/waymore_repair_black_soap.jpeg', description: 'Detoxifying shampoo made with African black soap.' },
    { id: 24, name: 'Organic Stimulating Hair Growth Butter', category: 'Hair Care', price: '₦6,000', image: '/assets/img/products/ayurvedic_hair_growth_butter.jpeg', detailUrl: 'product-hair-butter.html', showGridPrice: true, description: 'A rich herbal hair treatment specially formulated with powerful Ayurvedic herbs, natural butters, and nourishing oils that help strengthen hair from roots to tips.' },
    { id: 25, name: 'Organic Stimulating Hair Pomade', category: 'Hair Care', price: '₦6,000', image: '/assets/img/products/hair-care.jpg', description: 'A nourishing pomade that supports hair strength and scalp comfort.' },
    { id: 15, name: 'Anti-Aging Glyceric Soap', category: 'Skin Care', price: '₦35,000', image: '/assets/img/products/waymore_Glysolin soap.jpg', description: 'Hydrating soap that reduces fine lines and smooths skin.' },
    { id: 18, name: 'Waymoore Shower Gel', category: 'Skin Care', price: '₦45', image: '/assets/img/products/shower_gel.jpeg', description: 'Refreshing, chemical-free, luxurious shower experience.' },
    { id: 19, name: 'Waymoore Hand Wash', category: 'Skin Care', price: '₦30', image: '/assets/img/products/waymoore_hand_wash(liquid soap).jpeg', description: 'Moisturizing and gentle germ-removing hand wash.' },
    { id: 22, name: 'Body Butter', category: 'Skin Care', price: '₦10,000', image: '/assets/img/products/repair_brightening_body_butter.jpeg', detailUrl: 'product-body-butter.html', description: 'A luxurious, deeply moisturizing skincare treatment specially formulated to repair dry, damaged skin while promoting a brighter, smoother, and more radiant complexion.' },
    { id: 23, name: 'Waymoore Repair Black Soap', category: 'Skin Care', price: '₦35,000', image: '/assets/img/products/waymore_repair_black_soap.jpeg', detailUrl: 'product-black-soap.html', showGridPrice: true, description: 'A powerful herbal cleansing soap specially crafted to help repair damaged skin, deeply cleanse impurities, and restore healthy-looking skin naturally. Enriched with African black soap and botanical ingredients.' },
    { id: 26, name: 'Vital Seed Blend', category: 'Health & Wellness', price: '₦25,000', image: '/assets/img/products/health-wellness2.jpeg', description: 'A nutrient-rich blend designed to support overall wellness and vitality.' },
    { id: 27, name: 'Protein Mix Without Nuts (600g)', category: 'Health & Wellness', price: '₦40,000', image: '/assets/img/products/waymore_protein_without_nuts.jpg', description: 'A 600g protein mix formulated without nuts for easy daily nutrition.' },
    { id: 28, name: 'Protein Mix Without Nuts (250g)', category: 'Health & Wellness', price: '₦15,000', image: '/assets/img/products/waymore_protein_without_nuts.jpg', description: 'A 250g protein mix formulated without nuts for easy daily nutrition.' },
    { id: 29, name: 'Protein Mix Without Nuts (1kg)', category: 'Health & Wellness', price: '₦50,000', image: '/assets/img/products/waymore_protein_without_nuts.jpg', description: 'A 1kg protein mix formulated without nuts for easy daily nutrition.' },
    { id: 30, name: 'Herbal Drink', category: 'Health & Wellness', price: '₦20,000', image: '/assets/img/products/health-wellness.jpg', description: 'A natural herbal drink made for everyday wellness support.' },
    { id: 31, name: 'Harmony Bloom', category: 'Health & Wellness', price: '₦25,000', image: '/assets/img/products/health-wellness1.jpeg', description: 'A wellness blend created to promote balance, calm, and vitality.' },
    { id: 20, name: 'Dishwasher Liquid', category: 'Household', price: '₦25', image: '/assets/img/products/dish_wash.png', description: 'Plant-based grease-cutting dish cleaning liquid.' },
    { id: 21, name: 'Heavy Duty Car Wash', category: 'Household', price: '₦35', image: '/assets/img/products/car_wash.jpeg', description: 'Strong yet safe formula for sparkling clean cars.' }
];

function normalizeProductRecord(product, fallbackId = Date.now()) {
    const image = product.image || product.thumbnail || (Array.isArray(product.images) ? product.images[0] : '') || '/assets/img/products/waymoore_logo.jpg';
    const isDataUrl = String(image).startsWith('data:') || String(image).startsWith('blob:');
    const normalizedImage = isDataUrl ? String(image) : String(image).replace(/^\.\//, '').replace(/^\.\.\//, '').replace(/^\//, '/');
    
    // Process images array, preserving data URLs
    let processedImages = [];
    if (Array.isArray(product.images) && product.images.length) {
        processedImages = product.images.map((imagePath) => {
            const isDataImg = String(imagePath).startsWith('data:') || String(imagePath).startsWith('blob:');
            if (isDataImg) return String(imagePath);
            const cleaned = String(imagePath).replace(/^\.\//, '').replace(/^\.\.\//, '').replace(/^\//, '/');
            return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
        });
    } else {
        processedImages = [isDataUrl ? normalizedImage : (normalizedImage.startsWith('/') ? normalizedImage : `/${normalizedImage}`)];
    }
    
    return {
        ...product,
        id: Number(product.id || fallbackId),
        name: product.name || 'Untitled Product',
        category: product.category || 'Uncategorized',
        subcategory: product.subcategory || '',
        price: product.price || product.discountPrice || '₵0',
        discountPrice: product.discountPrice || '',
        sku: product.sku || `WP-${Number(product.id || fallbackId)}`,
        quantity: Number(product.quantity || 10),
        weight: product.weight || '',
        shortDescription: product.shortDescription || product.description || '',
        description: product.description || product.shortDescription || '',
        ingredients: product.ingredients || '',
        benefits: product.benefits || '',
        directions: product.directions || '',
        warnings: product.warnings || '',
        tags: product.tags || '',
        status: product.status || 'Published',
        featured: Boolean(product.featured),
        bestseller: Boolean(product.bestseller),
        newArrival: Boolean(product.newArrival),
        trending: Boolean(product.trending),
        thumbnail: isDataUrl ? normalizedImage : (normalizedImage.startsWith('/') ? normalizedImage : `/${normalizedImage}`),
        images: processedImages,
        videoUrl: product.videoUrl || '',
        seoTitle: product.seoTitle || product.name || 'Product',
        seoDescription: product.seoDescription || product.description || product.shortDescription || '',
        slug: product.slug || String(product.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        createdAt: product.createdAt || new Date().toISOString().slice(0, 10),
        updatedAt: product.updatedAt || new Date().toISOString().slice(0, 10)
    };
}

function getInitialProducts() {
    const merged = [...defaultProducts];
    const seen = new Set(merged.map((product) => product.id));
    storefrontSeedProducts.forEach((product) => {
        if (!seen.has(product.id)) {
            merged.push(normalizeProductRecord(product, product.id));
            seen.add(product.id);
        }
    });
    return merged.map((product) => normalizeProductRecord(product, product.id));
}

let products = loadProducts();
let editingProductId = null;

function getSidebarStateKey() {
    return 'waymooreAdminSidebarCollapsed';
}

function resolveAssetPath(imagePath) {
    if (!imagePath) {
        return 'assets/img/products/waymoore_logo.jpg';
    }

    const value = String(imagePath);
    if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
        return value;
    }

    const cleaned = value.replace(/^\.\//, '').replace(/^\.\.\//, '').replace(/^\/+/, '');
    const pathname = window.location.pathname || '';
    const segments = pathname.split('/').filter(Boolean);
    const adminIndex = segments.indexOf('admin');
    const depth = adminIndex === -1 ? 0 : Math.max(0, segments.length - adminIndex - 1);
    const prefix = depth > 0 ? '../'.repeat(depth) : '';

    if (cleaned.startsWith('assets/')) {
        return `${prefix}${cleaned}`;
    }

    if (cleaned.startsWith('img/')) {
        return `${prefix}assets/${cleaned}`;
    }

    return cleaned;
}

function applySidebarState() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar) return;
    const isCollapsed = localStorage.getItem(getSidebarStateKey()) === 'true';
    sidebar.classList.toggle('collapsed', isCollapsed);
    sidebar.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sidebar-open');
    if (toggle) {
        toggle.classList.toggle('is-open', isCollapsed);
        toggle.setAttribute('aria-expanded', String(isCollapsed));
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
}

function toggleSidebar(force) {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar) return;

    const isDesktop = window.innerWidth > 768;
    if (isDesktop) {
        const shouldCollapse = typeof force === 'boolean' ? force : !sidebar.classList.contains('collapsed');
        sidebar.classList.toggle('collapsed', shouldCollapse);
        localStorage.setItem(getSidebarStateKey(), String(shouldCollapse));
        if (toggle) toggle.classList.toggle('is-open', shouldCollapse);
        return;
    }

    const shouldOpen = typeof force === 'boolean' ? force : !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', shouldOpen);
    sidebar.classList.toggle('collapsed', false);
    sidebar.setAttribute('aria-hidden', String(!shouldOpen));
    if (overlay) overlay.classList.toggle('active', shouldOpen);
    if (toggle) {
        toggle.classList.toggle('is-open', shouldOpen);
        toggle.setAttribute('aria-expanded', String(shouldOpen));
    }
    document.body.classList.toggle('sidebar-open', shouldOpen);
}

function loadProducts() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.products);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) {
                const existingProducts = parsed.map((product, index) => normalizeProductRecord(product, product.id || index + 1));
                const mergedProducts = [...existingProducts];
                const byId = new Map(mergedProducts.map((product) => [String(product.id), product]));

                getInitialProducts().forEach((seedProduct) => {
                    const seedKey = String(seedProduct.id);
                    if (byId.has(seedKey)) {
                        byId.set(seedKey, { ...byId.get(seedKey), ...seedProduct });
                    } else {
                        byId.set(seedKey, seedProduct);
                    }
                });

                return Array.from(byId.values());
            }
        }
        const catalogRaw = localStorage.getItem('waymooreProductsCatalog');
        if (catalogRaw) {
            const parsedCatalog = JSON.parse(catalogRaw);
            if (Array.isArray(parsedCatalog) && parsedCatalog.length) {
                const existingProducts = parsedCatalog.map((product, index) => normalizeProductRecord(product, product.id || index + 1));
                const mergedProducts = [...existingProducts];
                const byId = new Map(mergedProducts.map((product) => [String(product.id), product]));

                getInitialProducts().forEach((seedProduct) => {
                    const seedKey = String(seedProduct.id);
                    if (byId.has(seedKey)) {
                        byId.set(seedKey, { ...byId.get(seedKey), ...seedProduct });
                    } else {
                        byId.set(seedKey, seedProduct);
                    }
                });

                return Array.from(byId.values());
            }
        }
        return getInitialProducts();
    } catch (error) {
        console.warn('Unable to load admin products', error);
        return getInitialProducts();
    }
}

function saveProducts() {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    syncCustomerCatalog();
}

function syncCustomerCatalog() {
    const payload = JSON.stringify(products.map((product) => normalizeProductRecord(product, product.id)));
    localStorage.setItem('waymooreProductsCatalog', payload);
    window.dispatchEvent(new CustomEvent('waymooreCatalogUpdated', { detail: products }));
}

function ensureSession() {
    const session = localStorage.getItem(STORAGE_KEYS.session);
    if (window.location.pathname.includes('/admin/login.html')) return;
    if (!session) {
        window.location.href = 'login.html';
    }
}

function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast-container');
    if (!existing) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2600);
}

let confirmationCallback = null;
let cancellationCallback = null;
let confirmationResolved = false;
let confirmationCancelMessage = '';

function initConfirmationModal() {
    if (document.getElementById('confirmation-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'confirmation-modal';
    modal.className = 'modal hidden';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="modal__content confirmation-modal-content">
            <div class="modal__header">
                <div>
                    <p class="eyebrow">CONFIRM ACTION</p>
                    <h2 id="confirmation-title">Please confirm</h2>
                </div>
                <button class="icon-btn" id="confirmation-close" type="button" aria-label="Close confirmation"><i class="fas fa-times"></i></button>
            </div>
            <div class="confirmation-body">
                <p id="confirmation-message">Are you sure?</p>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" type="button" id="confirmation-cancel">Cancel</button>
                <button class="btn btn-primary" type="button" id="confirmation-confirm">Confirm</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('confirmation-close')?.addEventListener('click', closeConfirmationModal);
    document.getElementById('confirmation-cancel')?.addEventListener('click', closeConfirmationModal);
    document.getElementById('confirmation-confirm')?.addEventListener('click', () => {
        confirmationResolved = true;
        if (confirmationCallback) confirmationCallback();
        closeConfirmationModal();
    });
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeConfirmationModal();
    });
}

function showConfirmationModal(message, onConfirm, onCancel, cancelMessage = 'Action cancelled') {
    initConfirmationModal();

    const modal = document.getElementById('confirmation-modal');
    const messageEl = document.getElementById('confirmation-message');
    if (!modal || !messageEl) return;

    messageEl.textContent = message;
    confirmationCallback = typeof onConfirm === 'function' ? onConfirm : null;
    cancellationCallback = typeof onCancel === 'function' ? onCancel : null;
    confirmationCancelMessage = cancelMessage;
    confirmationResolved = false;

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (!modal) return;

    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (!confirmationResolved) {
        if (cancellationCallback) {
            cancellationCallback();
        }
        if (confirmationCancelMessage) {
            showToast(confirmationCancelMessage, 'error');
        }
    }
    confirmationCallback = null;
    cancellationCallback = null;
    confirmationResolved = false;
    confirmationCancelMessage = '';
}

function getRegisteredUsers() {
    try {
        return JSON.parse(localStorage.getItem('waymoreUsers') || '[]');
    } catch (error) {
        return [];
    }
}

function getAllCustomerOrders() {
    return getRegisteredUsers().flatMap((user) => Array.isArray(user.orders) ? user.orders : []);
}

function getTotalRevenue() {
    return getAllCustomerOrders().reduce((total, order) => {
        const orderTotal = parseFloat(order.total);
        return total + (isNaN(orderTotal) ? 0 : orderTotal);
    }, 0);
}

function getPendingOrderCount() {
    return getAllCustomerOrders().filter((order) => String(order.status || '').toLowerCase() === 'pending').length;
}

function handleLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const emailInput = document.getElementById('admin-email');
    const passwordInput = document.getElementById('admin-password');
    const email = emailInput?.value.trim() || '';
    const password = passwordInput?.value || '';
    const isValid = email === 'admin123@waymoore' && password === 'waymoore@admin123';
    if (!isValid) {
        showToast('Invalid admin credentials', 'error');
        return;
    }
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ email, role: 'admin' }));
    showToast('Welcome back, admin');
    window.location.href = 'dashboard.html';
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.session);
    window.location.href = 'login.html';
}

function populateStats() {
    const totalProducts = products.length;
    const publishedProducts = products.filter((product) => product.status === 'Published').length;
    const lowStock = products.filter((product) => Number(product.quantity) < 10).length;
    const allOrders = getAllCustomerOrders();
    const totalOrders = allOrders.length;
    const totalCustomers = getRegisteredUsers().length;
    const revenue = getTotalRevenue();
    const pendingOrders = getPendingOrderCount();
    const currentCurrency = getCurrentCurrency();

    const statProducts = document.getElementById('stat-products');
    const statOrders = document.getElementById('stat-orders');
    const statRevenue = document.getElementById('stat-revenue');
    const statCustomers = document.getElementById('stat-customers');
    const statLowStock = document.getElementById('stat-low-stock');
    const statPendingOrders = document.getElementById('stat-pending-orders');

    if (statProducts) statProducts.textContent = totalProducts;
    if (statOrders) statOrders.textContent = totalOrders;
    if (statRevenue) statRevenue.textContent = formatPriceInCurrency(revenue, currentCurrency, 'NGN');
    if (statCustomers) statCustomers.textContent = totalCustomers;
    if (statLowStock) statLowStock.textContent = lowStock;
    if (statPendingOrders) statPendingOrders.textContent = pendingOrders;
    document.querySelector('#product-table-body')?.setAttribute('data-count', String(totalProducts));
    document.querySelector('#product-search')?.setAttribute('data-published', String(publishedProducts));
    document.querySelector('#product-search')?.setAttribute('data-low-stock', String(lowStock));
}

function renderProductsTable() {
    const tbody = document.getElementById('product-table-body');
    if (!tbody) return;

    const search = document.getElementById('product-search')?.value.toLowerCase() || '';
    const filter = document.getElementById('product-filter')?.value || 'all';
    const sort = document.getElementById('product-sort')?.value || 'created-desc';

    const filtered = products.filter((product) => {
        const matchesSearch = !search || [product.name, product.category, product.status, product.tags].join(' ').toLowerCase().includes(search);
        const matchesFilter = filter === 'all' || product.category === filter;
        return matchesSearch && matchesFilter;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sort === 'name-asc') return a.name.localeCompare(b.name);
        if (sort === 'price-desc') return Number((b.price || '0').replace(/[^\d]/g, '')) - Number((a.price || '0').replace(/[^\d]/g, ''));
        return 0;
    });

    if (!sorted.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No products match your current view.</td></tr>';
        return;
    }

    tbody.innerHTML = sorted.map((product) => `
        <tr>
            <td><img class="table-thumb" src="${resolveAssetPath(product.thumbnail || '/assets/img/products/waymoore_logo.jpg')}" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${formatPriceInCurrency(product.basePriceInNaira || product.price, getCurrentCurrency(), 'NGN')}</td>
            <td>${product.quantity}</td>
            <td><span class="badge ${product.status.toLowerCase()}">${product.status}</span></td>
            <td>${product.updatedAt || product.createdAt}</td>
            <td>
                <div class="stack-list compact">
                    <button class="action-card" type="button" data-action="edit" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-card" type="button" data-action="duplicate" data-id="${product.id}"><i class="fas fa-copy"></i></button>
                    <button class="action-card" type="button" data-action="toggle" data-id="${product.id}"><i class="fas fa-eye"></i></button>
                    <button class="action-card" type="button" data-action="delete" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openModal(product = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    if (!modal || !form) return;

    editingProductId = product?.id || null;
    title.textContent = product ? 'Edit Product' : 'Add Product';
    form.reset();
    document.getElementById('product-id').value = product?.id || '';
    document.getElementById('product-name').value = product?.name || '';
    document.getElementById('product-category').value = product?.category || '';
    document.getElementById('product-subcategory').value = product?.subcategory || '';
    document.getElementById('product-price').value = product?.price || '';
    document.getElementById('product-discount').value = product?.discountPrice || '';
    document.getElementById('product-sku').value = product?.sku || '';
    document.getElementById('product-quantity').value = product?.quantity || 10;
    document.getElementById('product-weight').value = product?.weight || '';
    document.getElementById('product-short-description').value = product?.shortDescription || '';
    document.getElementById('product-description').value = product?.description || '';
    document.getElementById('product-ingredients').value = product?.ingredients || '';
    document.getElementById('product-benefits').value = product?.benefits || '';
    document.getElementById('product-directions').value = product?.directions || '';
    document.getElementById('product-warnings').value = product?.warnings || '';
    document.getElementById('product-tags').value = product?.tags || '';
    document.getElementById('product-status').value = product?.status || 'Published';
    document.getElementById('product-slug').value = product?.slug || '';
    document.getElementById('product-seo-title').value = product?.seoTitle || '';
    document.getElementById('product-seo-description').value = product?.seoDescription || '';
    document.getElementById('product-video').value = product?.videoUrl || '';
    document.getElementById('product-featured').checked = Boolean(product?.featured);
    document.getElementById('product-bestseller').checked = Boolean(product?.bestseller);
    document.getElementById('product-new-arrival').checked = Boolean(product?.newArrival);
    document.getElementById('product-trending').checked = Boolean(product?.trending);
    document.getElementById('preview-name').textContent = product?.name || 'Product Name';
    document.getElementById('preview-description').textContent = product?.shortDescription || 'Short description will appear here.';
    document.getElementById('preview-price').textContent = product?.price || '₵0';
    document.getElementById('preview-image').src = resolveAssetPath(product?.thumbnail || '/assets/img/products/waymoore_logo.jpg');

    const previewList = document.getElementById('media-preview-list');
    if (previewList) {
        previewList.innerHTML = '';
        const images = Array.isArray(product?.images) && product.images.length ? product.images : [product?.thumbnail || '/assets/img/products/waymoore_logo.jpg'];
        previewList.innerHTML = images.map((image, index) => `
            <div class="media-preview-item ${index === 0 ? 'active' : ''}">
                <img src="${resolveAssetPath(image)}" alt="${product?.name || 'Preview image'}">
            </div>
        `).join('');
    }

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

async function handleProductSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const thumbnailFile = document.getElementById('product-thumbnail').files[0];
    const imageFiles = Array.from(document.getElementById('product-images').files || []);

    const submitProduct = async () => {
        const productPayload = {
        id: editingProductId || Date.now(),
        name: payload.name,
        category: payload.category,
        subcategory: payload.subcategory,
        price: payload.price,
        discountPrice: payload.discountPrice,
        sku: payload.sku,
        quantity: Number(payload.quantity || 0),
        weight: payload.weight,
        shortDescription: payload.shortDescription,
        description: payload.description,
        ingredients: payload.ingredients,
        benefits: payload.benefits,
        directions: payload.directions,
        warnings: payload.warnings,
        tags: payload.tags,
        status: payload.status,
        featured: document.getElementById('product-featured').checked,
        bestseller: document.getElementById('product-bestseller').checked,
        newArrival: document.getElementById('product-new-arrival').checked,
        trending: document.getElementById('product-trending').checked,
        thumbnail: payload.thumbnail || '',
        images: [],
        videoUrl: payload.videoUrl,
        seoTitle: payload.seoTitle,
        seoDescription: payload.seoDescription,
        slug: payload.slug,
        createdAt: editingProductId ? products.find((item) => item.id === editingProductId)?.createdAt || new Date().toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10)
    };

    try {
        if (thumbnailFile) {
            productPayload.thumbnail = await readFileAsDataURL(thumbnailFile);
        }
        if (imageFiles.length) {
            productPayload.images = await Promise.all(imageFiles.map((file) => readFileAsDataURL(file)));
        }
        commitProduct(productPayload);
    } catch (error) {
        console.error(error);
        showToast('Unable to process uploaded files', 'error');
    }
};

    showConfirmationModal(
        editingProductId ? 'Save changes to this product?' : 'Add this new product?',
        submitProduct,
        null,
        editingProductId ? 'Product update cancelled' : 'Product creation cancelled'
    );
}

function commitProduct(productPayload) {
    if (editingProductId) {
        products = products.map((product) => product.id === editingProductId ? { ...product, ...productPayload } : product);
    } else {
        products.unshift(productPayload);
    }
    saveProducts();
    renderProductsTable();
    populateStats();
    closeModal();
    showToast(editingProductId ? 'Product updated successfully' : 'Product added successfully');
}

function handleTableActions(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    const id = Number(button.dataset.id);

    if (action === 'edit') {
        const product = products.find((entry) => entry.id === id);
        if (product) openModal(product);
    }
    if (action === 'duplicate') {
        showConfirmationModal('Duplicate this product?', () => {
            const product = products.find((entry) => entry.id === id);
            if (product) {
                const copy = { ...product, id: Date.now(), name: `${product.name} Copy`, slug: `${product.slug || 'product'}-copy` };
                products.unshift(copy);
                saveProducts();
                renderProductsTable();
                populateStats();
                showToast('Product duplicated');
            }
        }, null, 'Product duplication cancelled');
        return;
    }
    if (action === 'toggle') {
        showConfirmationModal('Change this product visibility status?', () => {
            products = products.map((product) => product.id === id ? { ...product, status: product.status === 'Hidden' ? 'Published' : 'Hidden' } : product);
            saveProducts();
            renderProductsTable();
            populateStats();
        }, null, 'Product visibility update cancelled');
        return;
    }
    if (action === 'delete') {
        showConfirmationModal('Delete this product? This cannot be undone.', () => {
            products = products.filter((product) => product.id !== id);
            saveProducts();
            renderProductsTable();
            populateStats();
            showToast('Product removed');
        }, null, 'Product deletion cancelled');
        return;
    }
}

function bindDashboardEvents() {
    document.getElementById('open-product-modal')?.addEventListener('click', () => {
        window.location.href = 'add-product.html';
    });
    document.getElementById('close-modal')?.addEventListener('click', closeModal);
    document.getElementById('cancel-product')?.addEventListener('click', closeModal);
    document.getElementById('product-form')?.addEventListener('submit', handleProductSubmit);
    document.getElementById('product-table-body')?.addEventListener('click', handleTableActions);
    document.getElementById('product-search')?.addEventListener('input', renderProductsTable);
    document.getElementById('product-filter')?.addEventListener('change', renderProductsTable);
    document.getElementById('product-sort')?.addEventListener('change', renderProductsTable);
    document.getElementById('bulk-publish-btn')?.addEventListener('click', () => {
        showConfirmationModal('Publish all products now?', () => {
            products = products.map((product) => ({ ...product, status: 'Published' }));
            saveProducts();
            renderProductsTable();
            populateStats();
            showToast('Products published');
        }, null, 'Publish all products cancelled');
    });
    document.getElementById('bulk-hide-btn')?.addEventListener('click', () => {
        showConfirmationModal('Hide all products now?', () => {
            products = products.map((product) => ({ ...product, status: 'Hidden' }));
            saveProducts();
            renderProductsTable();
            populateStats();
            showToast('Products hidden');
        }, null, 'Hide all products cancelled');
    });
    document.getElementById('bulk-delete-btn')?.addEventListener('click', () => {
        showConfirmationModal('Delete all products? This cannot be undone.', () => {
            products = [];
            saveProducts();
            renderProductsTable();
            populateStats();
            showToast('Products removed');
        }, null, 'Delete all products cancelled');
    });
    document.getElementById('logout-btn')?.addEventListener('click', logout);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            toggleSidebar(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            applySidebarState();
        } else {
            document.body.classList.remove('sidebar-open');
            sidebar?.classList.remove('open');
            sidebarOverlay?.classList.remove('active');
        }
    });
    document.getElementById('global-search')?.addEventListener('input', (event) => {
        const target = document.getElementById('product-search');
        if (target) target.value = event.target.value;
        renderProductsTable();
    });

    const previewFields = ['product-name', 'product-price', 'product-short-description'];
    previewFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (!field) return;
        field.addEventListener('input', updatePreview);
        field.addEventListener('change', updatePreview);
    });
    document.getElementById('product-thumbnail')?.addEventListener('change', updatePreview);
    document.getElementById('product-images')?.addEventListener('change', updatePreview);

    document.getElementById('drop-zone')?.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.currentTarget.classList.add('drag-active');
    });
    document.getElementById('drop-zone')?.addEventListener('dragleave', (event) => {
        event.currentTarget.classList.remove('drag-active');
    });
    document.getElementById('drop-zone')?.addEventListener('drop', (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files || []);
        const input = document.getElementById('product-images');
        if (input) {
            const dataTransfer = new DataTransfer();
            files.forEach((file) => dataTransfer.items.add(file));
            input.files = dataTransfer.files;
        }
        event.currentTarget.classList.remove('drag-active');
        updatePreview();
    });
}

function updatePreview() {
    const name = document.getElementById('product-name')?.value || 'Product Name';
    const priceValue = document.getElementById('product-price')?.value || '0';
    const shortDescription = document.getElementById('product-short-description')?.value || 'Short description will appear here.';
    const previewImage = document.getElementById('preview-image');
    const thumbnailInput = document.getElementById('product-thumbnail');
    const thumbnailFile = thumbnailInput?.files?.[0];

    document.getElementById('preview-name').textContent = name;
    document.getElementById('preview-description').textContent = shortDescription;
    const formattedPrice = priceValue ? formatPriceInCurrency(priceValue, getCurrentCurrency(), 'NGN') : `${CURRENCIES[getCurrentCurrency()]?.symbol || '₦'}0`;
    document.getElementById('preview-price').textContent = formattedPrice;

    const previewList = document.getElementById('media-preview-list');
    if (previewList) {
        const files = Array.from(document.getElementById('product-images').files || []);
        const previewItems = [];
        if (thumbnailFile) {
            const reader = new FileReader();
            reader.onload = () => {
                previewItems.push(`<div class="media-preview-item active"><img src="${reader.result}" alt="Thumbnail"></div>`);
                files.forEach((file) => {
                    const imageReader = new FileReader();
                    imageReader.onload = () => {
                        previewItems.push(`<div class="media-preview-item"><img src="${imageReader.result}" alt="Gallery"></div>`);
                        previewList.innerHTML = previewItems.join('');
                    };
                    imageReader.readAsDataURL(file);
                });
                if (!files.length) {
                    previewList.innerHTML = previewItems.join('');
                }
            };
            reader.readAsDataURL(thumbnailFile);
            return;
        }
        if (files.length) {
            previewList.innerHTML = files.slice(0, 4).map(() => '<div class="media-preview-item active"><img src="" alt="Gallery"></div>').join('');
        }
    }

    if (thumbnailFile && previewImage) {
        const reader = new FileReader();
        reader.onload = function () {
            previewImage.src = reader.result;
        };
        reader.readAsDataURL(thumbnailFile);
    }
}

async function handleAddProductSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitter = event.submitter;
    const mode = submitter?.dataset.mode || 'publish';
    const confirmMessage = mode === 'draft'
        ? 'Save this product as a draft?'
        : 'Publish this product?';

    const proceedSubmit = async () => {
        const name = form.querySelector('#product-name')?.value?.trim() || 'New Product';
        const category = form.querySelector('#product-category')?.value || 'Uncategorized';
        const subcategory = form.querySelector('#product-subcategory')?.value || '';
        const currentCurrency = getCurrentCurrency();
        const priceInput = form.querySelector('#product-price')?.value || '0';
        const discountPriceInput = form.querySelector('#product-discount')?.value || '';
        const priceInNaira = convertPrice(priceInput, currentCurrency, 'NGN');
        const discountPriceInNaira = discountPriceInput ? convertPrice(discountPriceInput, currentCurrency, 'NGN') : '';
        const price = formatPrice(priceInNaira, 'NGN');
        const discountPrice = discountPriceInNaira ? formatPrice(discountPriceInNaira, 'NGN') : '';
        const sku = form.querySelector('#product-sku')?.value || `WP-${Date.now()}`;
        const quantity = Number(form.querySelector('#product-quantity')?.value || 0);
        const weight = form.querySelector('#product-weight')?.value || '';
        const shortDescription = form.querySelector('#product-short-description')?.value || '';
        const description = form.querySelector('#product-description')?.value || '';
        const tags = form.querySelector('#product-tags')?.value || '';
        const status = mode === 'draft' ? 'Draft' : (form.querySelector('#product-status')?.value || 'Published');
        const featured = form.querySelector('#product-featured')?.checked || false;
        const bestseller = form.querySelector('#product-bestseller')?.checked || false;
        const newArrival = form.querySelector('#product-new-arrival')?.checked || false;
        const trending = form.querySelector('#product-trending')?.checked || false;
        const videoUrl = form.querySelector('#product-video')?.value || '';
        const seoTitle = form.querySelector('#product-seo-title')?.value || name;
        const seoDescription = form.querySelector('#product-seo-description')?.value || shortDescription;
        const slug = form.querySelector('#product-slug')?.value || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        let thumbnail = 'assets/img/products/waymoore_logo.jpg';
        let images = [];
        let mediaIds = [];
        const imageFiles = Array.from(form.querySelector('#product-images')?.files || []);
        try {
            if (imageFiles.length > 0) {
                const imageDataUrls = await Promise.all(imageFiles.map((file) => readFileAsDataURL(file)));
                mediaIds = imageDataUrls.map((dataUrl, index) => MediaLibrary.addMedia(imageFiles[index], dataUrl));
                images = imageDataUrls;
                thumbnail = imageDataUrls[0];
            }
        } catch (error) {
            console.error('Error processing images:', error);
            showToast('Error processing images. Proceeding without images.', 'error');
        }
        const productPayload = {
            id: Date.now(),
            name,
            category,
            subcategory,
            price,
            discountPrice,
            sku,
            quantity,
            weight,
            shortDescription,
            description,
            ingredients: '',
            benefits: '',
            directions: '',
            warnings: '',
            tags,
            status,
            featured,
            bestseller,
            newArrival,
            trending,
            thumbnail,
            images,
            mediaIds,
            videoUrl,
            seoTitle,
            seoDescription,
            slug,
            createdAt: new Date().toISOString().slice(0, 10),
            updatedAt: new Date().toISOString().slice(0, 10),
            baseCurrency: 'NGN',
            basePriceInNaira: priceInNaira
        };
        products.unshift(productPayload);
        saveProducts();
        showToast(mode === 'draft' ? 'Product saved as draft' : 'Product published successfully');
        window.location.href = 'products/products.html';
    };

    showConfirmationModal(confirmMessage, proceedSubmit, null, 'Product action cancelled');
}

function initializeDashboard() {
    ensureSession();
    applySidebarState();
    populateStats();
    renderProductsTable();
    bindDashboardEvents();
}

function initializeLogin() {
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function initializeSharedAdminShell() {
    applySidebarState();
    const sidebarToggle = document.getElementById('sidebar-toggle');
    sidebarToggle?.addEventListener('click', () => toggleSidebar());
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => toggleSidebar(false));
    document.getElementById('logout-btn')?.addEventListener('click', (event) => {
        event.preventDefault();
        logout();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            toggleSidebar(false);
        }
    });
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    document.addEventListener('click', (event) => {
        if (!sidebar || !sidebar.classList.contains('open')) return;
        if (window.innerWidth > 768) return;
        if (sidebarToggle?.contains(event.target) || sidebar.contains(event.target)) return;
        toggleSidebar(false);
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            applySidebarState();
        } else {
            document.getElementById('sidebar')?.classList.remove('collapsed');
            document.getElementById('sidebar-overlay')?.classList.remove('active');
            document.getElementById('sidebar')?.classList.remove('open');
            document.body.classList.remove('sidebar-open');
        }
    });
}

function populateAddProductFormFromQuery() {
    try {
        const params = new URLSearchParams(window.location.search);
        const idParam = params.get('id') || params.get('productId') || params.get('edit');
        if (!idParam) return;
        const id = Number(idParam);
        const product = products.find((p) => p.id === id);
        if (!product) return;

        // Set editing state to allow update on submit
        window.editingProductId = product.id;

        // Fill fields on add-product form
        const setVal = (sel, val) => { const el = document.getElementById(sel); if (el) el.value = val; };
        setVal('product-name', product.name || '');
        setVal('product-short-description', product.shortDescription || '');
        setVal('product-description', product.description || '');
        setVal('product-category', product.category || '');
        setVal('product-subcategory', product.subcategory || '');
        setVal('product-price', String(product.basePriceInNaira || product.price || '').replace(/[^\d.]/g, ''));
        setVal('product-discount', String(product.discountPrice || '').replace(/[^\d.]/g, ''));
        setVal('product-sku', product.sku || '');
        setVal('product-quantity', product.quantity || 0);
        setVal('product-weight', product.weight || '');
        setVal('product-tags', product.tags || '');
        setVal('product-video', product.videoUrl || '');
        setVal('product-seo-title', product.seoTitle || '');
        setVal('product-seo-description', product.seoDescription || '');
        setVal('product-slug', product.slug || '');
        const statusEl = document.getElementById('product-status'); if (statusEl) statusEl.value = product.status || 'Published';
        const setCheck = (sel, v) => { const el = document.getElementById(sel); if (el) el.checked = Boolean(v); };
        setCheck('product-featured', product.featured);
        setCheck('product-bestseller', product.bestseller);
        setCheck('product-new-arrival', product.newArrival);
        setCheck('product-trending', product.trending);

        // Preview updates
        const previewName = document.getElementById('preview-name'); if (previewName) previewName.textContent = product.name || 'Product Name';
        const previewDesc = document.getElementById('preview-description'); if (previewDesc) previewDesc.textContent = product.shortDescription || 'Short description will appear here.';
        const previewPrice = document.getElementById('preview-price'); if (previewPrice) previewPrice.textContent = formatPriceInCurrency(product.basePriceInNaira || product.price || 0, getCurrentCurrency(), 'NGN');
        const previewImage = document.querySelector('.preview-card img') || document.getElementById('preview-image');
        if (previewImage) previewImage.src = resolveAssetPath(product.thumbnail || (Array.isArray(product.images) && product.images[0]) || 'assets/img/products/waymoore_logo.jpg');

        const previewList = document.getElementById('media-preview-list');
        if (previewList) {
            const imgs = (product.images && product.images.length) ? product.images : (product.thumbnail ? [product.thumbnail] : []);
            previewList.innerHTML = imgs.map((img, i) => `<div class="media-preview-item ${i===0? 'active':''}"><img src="${resolveAssetPath(img)}" alt="Preview"></div>`).join('');
        }
    } catch (err) {
        console.error('populateAddProductFormFromQuery error', err);
    }
}

function initializeCurrencySelector() {
    const currencySelect = document.getElementById('currency-select');
    if (!currencySelect) return;
    
    // Set initial value to current currency
    const currentCurrency = getCurrentCurrency();
    currencySelect.value = currentCurrency;
    updateAllPriceDisplays(currentCurrency);
    
    // Update price displays when currency changes
    currencySelect.addEventListener('change', (event) => {
        const newCurrency = event.target.value;
        setCurrentCurrency(newCurrency);
        updateAllPriceDisplays(newCurrency);
    });
    
    // Listen for currency changes from other tabs/windows
    window.addEventListener('currencyChanged', (event) => {
        currencySelect.value = event.detail.currency;
        updateAllPriceDisplays(event.detail.currency);
    });
}

function formatPriceInput(value) {
    // Remove any non-numeric characters except decimal point
    const numeric = String(value).replace(/[^\d.]/g, '');
    if (!numeric) return '';
    
    const num = parseFloat(numeric);
    if (isNaN(num)) return '';
    
    const currency = getCurrentCurrency();
    const formatted = num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return `${CURRENCIES[currency]?.symbol || CURRENCIES.NGN.symbol}${formatted}`;
}

function addPriceInputFormatting() {
    const priceFields = ['product-price', 'product-discount'];
    
    priceFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        field.addEventListener('blur', (event) => {
            const value = event.target.value;
            if (value) {
                const numeric = parseFloat(String(value).replace(/[^\d.]/g, ''));
                event.target.value = numeric || '';
                updatePreview();
            }
        });
    });
}

function updateAllPriceDisplays(currency) {
    const priceInput = document.getElementById('product-price');
    const discountInput = document.getElementById('product-discount');
    const previewPrice = document.getElementById('preview-price');
    const statRevenue = document.getElementById('stat-revenue');

    if (priceInput && priceInput.value) {
        const convertedPrice = convertPrice(priceInput.value, 'NGN', currency);
        const formatted = formatPrice(convertedPrice, currency);
        priceInput.value = convertedPrice;
        if (previewPrice) {
            previewPrice.dataset.priceNgn = priceInput.value;
            previewPrice.textContent = formatted;
        }
    }

    if (discountInput && discountInput.value) {
        const convertedDiscount = convertPrice(discountInput.value, 'NGN', currency);
        discountInput.value = convertedDiscount;
    }

    if (previewPrice && previewPrice.dataset.priceNgn) {
        previewPrice.textContent = formatPrice(convertPrice(previewPrice.dataset.priceNgn, 'NGN', currency), currency);
    }

    if (statRevenue) {
        statRevenue.textContent = formatPriceInCurrency(getTotalRevenue(), currency, 'NGN');
    }

    if (typeof renderProductsTable === 'function') {
        renderProductsTable();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeSharedAdminShell();
    initializeCurrencySelector();
    addPriceInputFormatting();
    if (document.getElementById('admin-login-form')) {
        initializeLogin();
    }
    if (document.getElementById('product-modal')) {
        initializeDashboard();
    }
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProductSubmit);
        // Prefill when editing via query param: add-product.html?id=123
        populateAddProductFormFromQuery();
    }
});
