/** index.js ******************************************************************************************************** */
;($ => {
  const ssg = {
    DATE_FORMAT: 'YYYYMMDD',
    DEVICE: navigator.userAgent
  }
  window.SSG = $.extend(window.SSG || {}, ssg)

  // pinch zoom prevent
  document.addEventListener('touchmove', e => {
    if (e.scale !== 1 && e.scale !== undefined) {
      e.preventDefault()
    }
  }, {passive: false})

  // double tab prevent
  let lastTouchEnd = 0
  document.documentElement.addEventListener('touchend', e => {
    let now = new Date().getTime()
    if (now - lastTouchEnd <= 200) {
      e.preventDefault()
    }
    lastTouchEnd = now
  }, {passive: false})

  // before unload
  // window.onbeforeunload = () => window.scrollTo(0, 0)

  /** Initialize common */
  $(document).ready(function () {
    $.header.init($.depth1Index, $.depth2Index)
    $.footer.init()
    $.scrollSection.init()
    $(window).on('load', function () {
      $.scrollSection.scroll()
      $('header.header').show().animate({'opacity': 1}, 300)
    })
  })
})(window.jQuery)
/** ***************************************************************************************************************** */
