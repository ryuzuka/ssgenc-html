/** Main.js ******************************************************************************************************** */
window.SSG.Main = ($ => {
  let $main = $('.contents')
  let $notice = $('.notice-box')
  let $indexPop = $('.index-popup')

  let mainVisualSwiper = null
  let csrSwiper = null

  let _this = {
    init () {
      this.setPopup()
      this.setNotice()
      this.setVisual()
      this.setCSR()
      this.setProject()
    },
    setPopup () {
      if ($indexPop.length === 0) return

      if ($.util.getCookie('checked_popup') < 1) {
        $indexPop.modal({clickToClose: false, blockBodyScroll: true}, e => {
          if (e.type === 'before-close') {
            if ($indexPop.find('input').prop('checked')) {
              $.util.setCookie('checked_popup', 'checked', 1)
            }
          } else if (e.type === 'close') {
            mainVisualSwiper.update()
            csrSwiper.update()
          }
        })
      }
    },
    setNotice () {
      if ($notice.length === 0) return

      if ($.util.getCookie('checked_notice') < 1) {
        $notice.addClass('active')
        $notice.find('.close').on('click', e => {
          $notice.removeClass('active').addClass('closed')
          if ($notice.find('input').prop('checked')) {
            $.util.setCookie('checked_notice', 'checked', 1)
          }
        })
        new Swiper('.notice-box .swiper-container', {
          pagination: {
            el: '.notice-box .swiper-pagination',
            clickable: true
          },
          speed: 300,
          loop: true,
          autoplay: {
            delay: 6000,
            disableOnInteraction: false
          }
        })
      } else {
        $notice.removeClass('active').addClass('closed')
      }
    },
    setVisual () {
      mainVisualSwiper = new Swiper('.main-visual .swiper-container', {
        speed: 300,
        loop: true,
        slidesPerView : 'auto',
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.main-visual .swiper-pagination',
          clickable: true
        },
        on: {
          init () {},
          transitionEnd () {},
          slideChange () {},
          resize () {}
        }
      })
    },
    setCSR () {
      csrSwiper = new Swiper('.csr-index .swiper-container', {
        speed: 300,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        slidesPerView : 'auto',
        on: {
          init () {},
          transitionEnd () {},
          slideChange () {},
          resize () {}
        }
      })
    },
    setProject () {
      let $project = $main.find('.project-index .tab-content .content')
      let $listBtn = $main.find('.project-index .tab-list button')

      let projectSwiper = new Swiper(".project-index .swiper-container", {
        effect: 'fade',
        allowTouchMove: false
      })

      $listBtn.on('click', function (e) {
        let idx = $(e.target).parent().index()
        $listBtn.attr('aria-selected', false)
        $(e.target).attr('aria-selected', true)

        projectIndex = idx
        clearInterval(timer)
        gsap.killTweensOf('.project-index .txt', 'opacity')
        activeContent(idx)
      })

      function activeContent (idx) {
        projectSwiper.slideTo(idx, 600)
        $project.each(function (index) {
          if (index === idx) {
            gsap.to($(this).find('.txt'), 0.5, {opacity: 1, ease: Cubic.easeInOut, onComplete: function () {
              startTimer()
            }})
          } else {
            gsap.to($(this).find('.txt'), 0.2, {opacity: 0})
          }
        })
      }

      activeContent(0)

      let projectIndex = 0
      let timer = null

      function startTimer () {
        timer = setInterval(function () {
          projectIndex++
          if (projectIndex > 3) {
            projectIndex = 0
          }
          $listBtn.parent().eq(projectIndex).find('button').trigger('click')
        }, 5000)
      }
    }
  }

  return _this
})(window.jQuery)
/** ***************************************************************************************************************** */
