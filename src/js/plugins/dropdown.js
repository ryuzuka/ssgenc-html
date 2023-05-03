/** dropdown.js ****************************************************************************************************** */
;($ => {
  let pluginName = 'dropdown'

  $.fn.extend({
    dropdown: function (options = {}, value) {
      if (typeof options === 'string') {
        $.plugin.call(this, options, value)
      } else {
        this.each((index, el) => {
          if (!$(el).attr('applied-plugin')) {
            $.plugin.add($(el), pluginName, new Dropdown($(el), options))
          }
        })
      }
      return this
    }
  })

  class Dropdown {
    constructor ($this, options) {
      let _this = this

      this.$dropdown = $this
      this.$button = this.$dropdown.find('.dropdown-btn')

      this.options = options

      let defaultIndex = 0
      this.placeholder = this.$dropdown.attr('placeholder')
      if (this.placeholder) {
        defaultIndex = -1
        this.$button.text(this.$dropdown.attr('placeholder'))
        this.$dropdown.find('.dropdown-list li').each(function (index) {
          if (_this.placeholder === $(this).find('button, a').text()) {
            defaultIndex = index
          }
        })
      } else {
        defaultIndex = 0
      }
      this.activeIndex = (this.options.activeIndex >= 0) ? this.options.activeIndex : defaultIndex
      this.disableIndex = this.options.disableIndex

      this.init()
    }

    init () {
      if (typeof this.activeIndex === 'number') {
        this.active(this.activeIndex)
      }
      if (typeof this.disableIndex === 'number') {
        this.disable([this.disableIndex])
      } else if (typeof this.disableIndex === 'object') {
        this.disable(this.disableIndex)
      }

      this.$button.on('click', e => {
        if (this.$dropdown.find('.dropdown-list').hasClass('active')) {
          this.toggle(false)
        } else {
          this.toggle(true)
        }
      })
      this.$dropdown.find('.dropdown-list li button').on('click', e => {
        if ($(e.currentTarget).hasClass('disabled')) {
          return false
        }
        let idx = $(e.currentTarget).parent().index()
        if (idx !== this.activeIndex) {
          this.active(idx)
        }
        this.toggle(false)
      })
      this.$dropdown.find('.dropdown-btn, .dropdown-list').on('focusout', e => {
        if (e.relatedTarget === null || $(e.relatedTarget).closest('.js-dropdown').length < 1) {
          this.toggle(false)
        }
      })
    }

    toggle (isOpen) {
      if (isOpen) {
        this.$dropdown.find('.dropdown-list').addClass('active')
      } else {
        this.$dropdown.find('.dropdown-list').removeClass('active')
      }
      this.$button.attr('aria-expanded', isOpen)

      return this.$dropdown
    }

    active (idx) {
      this.$dropdown.find('.dropdown-list li').each((index, el) => {
        if (idx === index) {
          this.activeIndex = index
          $(el).addClass('active').attr('aria-selected', true)
          this.$button.text($(el).find('button, a').text()).addClass('active')

          let value = $(el).find('button, a').data('value')
          this.$dropdown.triggerHandler({type: 'change', activeIndex: this.activeIndex, value: value})
        } else {
          $(el).removeClass('active').attr('aria-selected', false)
        }
      })
    }

    disable (index) {
      // index[type: Number or Array]
      if (typeof (index) === 'number') {
        // Number
        this.$dropdown.find('.dropdown-list li').eq(index).find('button, a').addClass('disabled', true)
      } else {
        // Array
        index.forEach(val => {
          this.$dropdown.find('.dropdown-list li').eq(val).find('button, a').addClass('disabled', true)
        })
      }
    }

    clear () {
      this.$dropdown.find('.dropdown-list li button').removeClass('disabled').off('click')
      this.$button.removeAttr('aria-expanded').off('click')
    }
  }
})(window.jQuery)
/** ****************************************************************************************************************** */
