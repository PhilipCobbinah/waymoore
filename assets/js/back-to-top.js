/* Back to top button (injects styles and button) */
(function(){
  if (window.__waymoore_back_to_top_loaded) return;
  window.__waymoore_back_to_top_loaded = true;

  var css = `
#backToTop {
  position: fixed;
  right: 18px;
  bottom: 80px;
  min-width: 56px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(180deg, #065a45, #0f8f72);
  color: #fff;
  border: 2px solid rgba(209, 250, 229, .95);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  box-shadow: 0 14px 36px rgba(0, 0, 0, .22);
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: opacity .24s ease, transform .24s ease, visibility .24s;
  z-index: 2001;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  touch-action: manipulation;
}
@media (max-width: 640px) {
  #backToTop {
    right: 16px;
    bottom: 90px;
    min-width: 52px;
    height: 48px;
    padding: 0 10px;
    font-size: 11px;
  }
}
@media (max-width: 420px) {
  #backToTop {
    right: 12px;
    bottom: 82px;
  }
}
#backToTop::before {
  content: 'TOP';
  font-size: 10px;
  color: #d1fae5;
  letter-spacing: .18em;
  display: inline-block;
}
#backToTop:focus {
  outline: 3px solid rgba(134, 239, 172, .95);
  outline-offset: 4px;
}
#backToTop.show, body.admin-body #backToTop {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
#backToTop svg {
  width: 20px;
  height: 20px;
  display: block;
  fill: currentColor;
  position: relative;
  z-index: 1;
}
@media (prefers-reduced-motion:reduce) {
  #backToTop {
    transition: none;
  }
}
`;

  var style = document.createElement('style');
  style.setAttribute('data-wm-back-to-top','');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.setAttribute('aria-label','Back to top');
  btn.setAttribute('title','Back to top');
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4l-8 8h5v8h6v-8h5z"></path></svg>';
  btn.addEventListener('click', function(e){
    e.preventDefault();
    try{
      window.scrollTo({top:0,behavior:'smooth'});
    }catch(err){
      window.scrollTo(0,0);
    }
  });

  document.addEventListener('DOMContentLoaded', function(){
    document.body.appendChild(btn);
    var showAt = 240;

    // Prefer admin main panel if present and scrollable; otherwise use window.
    var panel = document.querySelector('.main-panel');
    var container = panel && panel.scrollHeight > panel.clientHeight ? panel : window;

    function getScrollY() {
      if (container === window) return window.pageYOffset || document.documentElement.scrollTop;
      return container.scrollTop || 0;
    }

    function scrollToTop() {
      try {
        if (container === window) {
          window.scrollTo({top:0,behavior:'smooth'});
        } else {
          container.scrollTo({top:0,behavior:'smooth'});
        }
      } catch (err) {
        if (container === window) window.scrollTo(0,0); else container.scrollTop = 0;
      }
    }

    // update click to scroll the proper container
    btn.removeEventListener('click', btn._wm_click);
    btn._wm_click = function(e){ e.preventDefault(); scrollToTop(); };
    btn.addEventListener('click', btn._wm_click);

    function onScroll(){
      var y = getScrollY();
      if(y > showAt){
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }

    onScroll();
    if (container === window) {
      window.addEventListener('scroll', onScroll, {passive:true});
    } else {
      container.addEventListener('scroll', onScroll, {passive:true});
    }
  });
})();
