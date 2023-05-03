/** common.js ******************************************************************************************************** */
;($ => {
  $.extend({
    depth1Index: -1,
    depth2Index: -1,

    /** header */
    header: (function () {
      let $header = $('header.header')
      let $open = $header.find('.menu-open')
      let $layer = $header.find('.menu-layer')
      let $close = $layer.find('.menu-close')
      let $menuList = $layer.find('.in-group > .list-menu')
      let $menu = $menuList.find('> li > ul.list > li')
      let $arrow = $menuList.find('.mobile')

      return {
        init () {
          this.activeDepth1('pc', $.depth1Index)
          this.activeDepth1('mobile', $.depth1Index)
          this.activeDepth2($.depth1Index, $.depth2Index)

          $open.on('click', e => this.layerToggle('open'))
          $close.on('click', e => this.layerToggle('close'))

          let menuTimer = null
          $menuList.find('> li').on('mouseenter mouseleave', e => {
            let idx = $(e.currentTarget).index()
            if (e.type === 'mouseenter') {
              this.activeDepth1('pc', idx)
              if (menuTimer) {
                clearTimeout(menuTimer)
                menuTimer = null
              }
            } else if(e.type === 'mouseleave') {
              if (menuTimer === null) {
                menuTimer = setTimeout(() => {
                  this.activeDepth1('pc', $.depth1Index)
                  clearTimeout(menuTimer)
                  menuTimer = null
                }, 300)
              }
            }
          })

          $menu.find('a').on('mouseenter mouseleave', e => {
            if (e.type === 'mouseenter') {
              $(e.target).parent().addClass('current')
            } else if (e.type === 'mouseleave') {
              $(e.target).parent().removeClass('current')
            }
          })

          $arrow.on('click', e => {
            let idx = $(e.currentTarget).parent().index()
            this.activeDepth1('mobile', idx)
          })

          return $header
        },
        layerToggle (type) {
          if (type === 'open') {
            $.blockBodyScroll(true)
            $layer.show()
          } else if (type === 'close') {
            $.blockBodyScroll(false)
            $layer.hide()
          }
          return $header
        },
        activeDepth1 (type, depth1Index) {
          if (type === 'pc') {
            $menuList.find('> li').each(function (index) {
              if (index === depth1Index) {
                $(this).addClass('current')
              } else {
                $(this).removeClass('current')
              }
            })
          } else if (type === 'mobile') {
            $menuList.find('> li').each(function (index) {
              if (index === depth1Index) {
                $(this).addClass('active')
              } else {
                $(this).removeClass('active')
              }
            })
          }
          return $header
        },
        activeDepth2 (depth1Index, depth2Index) {
          if (depth1Index === -1) return
          if (depth2Index === -1) return
          $menuList.find('> li').eq(depth1Index).find('> .list').find('> li').eq(depth2Index).addClass('active')

          return $header
        },
        black () {
          if (!$header.hasClass('header-black')) {
            $header.addClass('header-black')
          }
        },
        white () {
          if ($header.hasClass('header-black')) {
            $header.removeClass('header-black')
          }
        },
        active (isActive) {
          if (isActive) {
            if (!$header.hasClass('active')) {
              $header.addClass('active')
            }
          } else {
            if ($header.hasClass('active')) {
              $header.removeClass('active')
            }
          }
        },
        getHeight () {
          return $header.height()
        }
      }
    })(),

    /** footer */
    footer: (function () {
      let $footer = $('footer.footer')
      let $familySite = $footer.find('.family-site')

      return {
        init () {
          $familySite.find('> button').on( 'click', e => {
            $familySite.toggleClass( 'active' )
          })
          $familySite.find('ul a').on('click', e => {
            $familySite.removeClass( 'active' )
          })
          $(window).on('resize', e => {
            $familySite.removeClass( 'active' )
          })
          return $footer
        }
      }
    })(),

    /** viewType */
    viewType: (function () {
      let $window = $(window)
      let viewType = 'pc'

      $window.on('resize', getViewType)
      function getViewType () {
        if ($window.width() >= 1024) {
          if (viewType !== 'pc') {
            viewType = 'pc'
            $window.triggerHandler('resize-view-type', viewType)
          }

        } else if ($window.width() < 1024) {
          if (viewType !== 'mobile') {
            viewType = 'mobile'
            $window.triggerHandler('resize-view-type', viewType)
          }
        }
      }
      getViewType()

      return viewType
    })(),

    /** scrollSection */
    scrollSection: (function () {
      let $window = $(window)
      let $section = $('.section')
      let sectionOffsetTop = []
      let sectionBlack = []
      let headerHeight = null

      return {
        init () {
          $window.on('resize scroll', e => this.scroll())
          setTimeout(() => {
            this.scroll()
          }, 1)
        },
        resize () {
          headerHeight = $.header.getHeight()
          $section.each(function (index) {
            sectionBlack[index] = $(this).hasClass('header-black')
            sectionOffsetTop[index] = parseInt($(this).offset().top)
          })
        },
        scroll () {
          this.resize()
          let winScrollTop = $window.scrollTop() + headerHeight

          if (winScrollTop > headerHeight) {
            $.header.active(true)
          } else {
            $.header.active(false)
          }

          sectionOffsetTop.forEach((offsetTop, index) => {
            if (index < sectionOffsetTop.length) {
              if (sectionOffsetTop[index] < winScrollTop && winScrollTop < sectionOffsetTop[index + 1]) {
                if (sectionBlack[index] === true) {
                  $.header.black()
                } else {
                  $.header.white()
                }
              }
            }
          })
        }
      }
    })(),

    /** switchUI */
    switchUI: (function () {
      let $tab = $('.js-tab.tab')
      let $dropdown = $('.js-dropdown.dropdown')

      function switchUI (type) {
        $dropdown.off('change')
        $tab.off('change')
        if (type === 'pc') {
          $tab.on('change', changeEventListener)
        } else if (type === 'mobile') {
          $dropdown.on('change', changeEventListener)
        }
      }

      function changeEventListener (e) {
        let activeIdx = e.activeIndex
        let $target = $(e.target)

        if ($target.hasClass('js-tab')) {
          $dropdown.dropdown('active', activeIdx).triggerHandler('change-dropdown', activeIdx)
        } else if ($target.hasClass('js-dropdown')) {
          $tab.tab('active', activeIdx).triggerHandler('change-tab', activeIdx)
        }
      }

      return {
        init (viewType) {
          $tab.tab('clear').tab()
          $dropdown.dropdown('clear').dropdown()
          switchUI(viewType)

          $(window).on('resize-view-type', (e, viewType) => {
            switchUI(viewType)
          })
        }
      }
    })(),

    /** util */
    util: {
      isMobile: function () {
        let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)
        if (!isMobile && navigator.userAgent.indexOf('Safari') > -1) {
          if (navigator.maxTouchPoints > 0) {
            isMobile = true
          }
        }
        return isMobile
      },

      /**
       * url parameter
       *
       */
      urlParam: function (_name) {
        let results = new RegExp('[?&]' + _name + '=([^&#]*)').exec(window.location.href)
        if (results==null) {
          return null
        } else {
          return results[1] || 0
        }
      },

      /**
       * ex) 00-000-0000, 000-0000-0000
       * @param   {String}    number
       * @returns {String}
       */
      telNumberFormat: function (number) {
        return number
          .replace(/[^0-9]/g, '')
          .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
          .replace('--', '-')
      },

      commaNumberFormat: function (number) {
        let regexp = /\B(?=(\d{3})+(?!\d))/g
        return number.toString().replace(regexp, ',')
      },

      /**
       * set localStorage
       * @param {String}    key
       * @param {*}         value
       * @param {Number}    expireMinutes     30 sec = 0.5
       */
      setLocalStorage: function (key, value, expireMinutes) {
        let json = false

        if (expireMinutes) {
          let today = new Date()
          today.setSeconds(today.getSeconds() + expireMinutes * 60)
          expireMinutes = today.getTime()
        }

        if (typeof value === 'object') {
          value = JSON.stringify(value)
          json = true
        }

        localStorage.setItem(
          key,
          JSON.stringify({
            expires: expireMinutes || -1,
            origin: value,
            json: json
          })
        )
      },

      /**
       * get localStorage
       * @param {String}    key
       * @return  {*}
       */
      getLocalStorage: function (key) {
        let value = localStorage.getItem(key)
        let now = new Date().getTime()

        if (value) {
          value = JSON.parse(value)

          if (value.expires === -1 || value.expires >= now) {
            if (value.json) {
              value = JSON.parse(value.origin)
            } else {
              value = value.origin
            }
          } else {
            this.clearLocalStorage(key)
            value = undefined
          }
        } else {
          value = undefined
        }

        return value
      },

      /**
       * LocalStorage Item clear
       * @param    {String}    key
       */
      clearLocalStorage: function (key) {
        localStorage.removeItem(key)
      },

      /**
       * set SessionStorage
       * @param {String}    key
       * @param {*}         value
       * @param {Number}    expireMinutes     30 sec = 0.5
       */
      setSessionStorage: function (key, value, expireMinutes) {
        let json = false

        if (expireMinutes) {
          let today = new Date()
          today.setSeconds(today.getSeconds() + expireMinutes * 60)
          expireMinutes = today.getTime()
        }

        if (typeof value === 'object') {
          value = JSON.stringify(value)
          json = true
        }

        sessionStorage.setItem(
          key,
          JSON.stringify({
            expires: expireMinutes || -1,
            origin: value,
            json: json
          })
        )
      },

      /**
       * get SessionStorage
       * @param {String}    key
       * @return  {*}
       */
      getSessionStorage: function (key) {
        let value = sessionStorage.getItem(key)
        let now = new Date().getTime()

        if (value) {
          value = JSON.parse(value)

          if (value.expires === -1 || value.expires >= now) {
            if (value.json) {
              value = JSON.parse(value.origin)
            } else {
              value = value.origin
            }
          } else {
            this.clearSessionStorage(key)
            value = undefined
          }
        } else {
          value = undefined
        }

        return value
      },

      /**
       * SessionStorage Item clear
       * @param    {String}    key
       */
      clearSessionStorage: function (key) {
        sessionStorage.removeItem(key)
      },

      /**
       * 가로모드 인지 체크하여 반환
       * @returns {Boolean}
       */
      isLandscape: function () {
        return window.innerWidth > window.innerHeight
      },

      setCookie: function (name, value, day) {
        let today_date = new Date()
        today_date.setDate(today_date.getDate() + day)
        let here_cookie = ''
        here_cookie += `${name}=${value};`
        here_cookie += `Expires=${today_date.toUTCString()}`
        document.cookie = here_cookie
      },

      getCookie: function (name) {
        let cookies = document.cookie.split(';')
        for (let i in cookies) {
          if (cookies[i].indexOf(name) > -1) {
            return 1
          }
        }
        return 0
      },

      validateEmail: function (email) {
        let exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/
        if (exptext.test(email)==false) {
          //이메일 형식이 알파벳+숫자@알파벳+숫자.알파벳+숫자 형식이 아닐경우
          alert("이메일형식이 올바르지 않습니다.")
          return false
        }
        return true
      }
    }
  })
})(window.jQuery)
/** ****************************************************************************************************************** */
