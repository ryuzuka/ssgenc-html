/** attachFile.js ********************************************************************************************************** */
;($ => {
  let pluginName = 'attachFile'

  $.fn.extend({
    attachFile: function (options = {}, value) {
      if (typeof options === 'string') {
        $.plugin.call(this, opions, value)
      } else {
        this.each((index, el) => {
          if (!$(el).attr('applied-plugin')) {
            $.plugin.add($(el), pluginName, new AttachFile($(el), options))
          }
        })
      }
      return this
    }
  })

  class AttachFile {
    constructor ($this, options) {
      this.$text = $this.find('.attach-text')
      this.$file = $this.find('.attach-file')

      this.$file.on('change', e => {
        let fileName = this.$file.val().replace(/C:\\fakepath\\/i, '')
        this.$text.val(fileName)
      })
    }
  }
})(window.jQuery)
/** ****************************************************************************************************************** */
