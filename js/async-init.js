// Defer loading of non-critical scripts based on user intent or visibility
(function() {
  function load(src, cb) {
    var s = document.createElement('script');
    s.src = src; s.async = true;
    if (cb) s.onload = cb;
    document.head.appendChild(s);
  }
  function onIdle(fn){ ('requestIdleCallback' in window) ? requestIdleCallback(fn) : setTimeout(fn, 150); }

  // Load search bundle only when user opens search
  var searchOpen = document.querySelector('.search-icon');
  if (searchOpen) {
    searchOpen.addEventListener('click', function once() {
      searchOpen.removeEventListener('click', once);
      load('/js/simple-calder-search.min.js', function(){
        if (typeof initSimpleCalderSearch === 'function') initSimpleCalderSearch();
      });
    });
  }

  // Load tag cloud/archive only if tag cloud element exists and after idle
  onIdle(function(){
    var tagCloud = document.getElementById('tag_cloud');
    if (tagCloud) {
      load('/js/jquery.tagcloud.js', function(){
        if (window.$) {
          $.fn.tagcloud.defaults = { color: { start: '#bbbbee', end: '#2f93b4' } };
          $('#tag_cloud a').tagcloud();
        }
      });
      load('/js/archive.js');
    }
  });
})();
