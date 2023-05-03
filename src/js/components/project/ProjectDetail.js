/** ProjectDetail.js ******************************************************************************************************** */
window.SSG.ProjectDetail = ($ => {
  let $detail = $('.contents')

  let _this = {
    init () {
      this.setVisual()
      this.setMoreProject()
    },
    setVisual () {
      if ($detail.find('.detail-swiper .swiper-slide').length === 1) return

      let visualSwiper = new Swiper('.detail-swiper .swiper-container', {
        pagination: {
          el: '.detail-swiper .swiper-pagination',
          clickable: true
        },
        speed: 300,
        loop: true
      })
    },
    setMoreProject () {
      if ($detail.find('.detail-view .swiper-slide').length === 1) return

      let projectSwiper = new Swiper('.detail-view .swiper-container', {
        navigation: {
          nextEl: '.detail-view .swiper-button-next',
          prevEl: '.detail-view .swiper-button-prev'
        },
        speed: 300,
        loop: true,
        slidesPerView : 'auto'
      })
    }
  }

  return _this
})(window.jQuery)
/** ***************************************************************************************************************** */
