/** preventScroll.js ****************************************************************************************************** */
;($ => {
  let _plugin = null
  $.extend({
    preventScroll: function (isPrevent) {
      _plugin = _plugin || new PreventScroll()

      let method = isPrevent ? 'add' : 'remove'
      _plugin[method]()

      return _plugin
    }
  })

  class PreventScroll {
    constructor () {
      if ($.util.isMobile()) {
        this.scrollEvent = 'touchmove'
      } else {
        this.scrollEvent = 'wheel'
      }
    }

    preventScrollEventHandler (e) {
      e.preventDefault()
      return false
    }

    add () {
      window.addEventListener(this.scrollEvent, this.preventScrollEventHandler, {passive: false})
      $('body').addClass('prevent-scroll')
    }

    remove () {
      window.removeEventListener(this.scrollEvent, this.preventScrollEventHandler)
      $('body').removeClass('prevent-scroll')
    }
  }
})(window.jQuery)
/** ***************************************************************************************************************** */
