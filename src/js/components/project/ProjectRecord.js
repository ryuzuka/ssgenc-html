/** ProjectRecord.js ************************************************************************************************ */
window.SSG.ProjectRecord = ($ => {
  let $content = $('.contents.section')
  let $viewBtn = $content.find('.project .sub-header a.result')
  let $resultModal = $content.find('.project-modal')

  let pageIndex = 0

  let _this = {
    init () {
      this.loadList(pageIndex)

      $viewBtn.on('click', e => {
        e.preventDefault()
        this.openModal()
      })
    },
    openModal () {
      $resultModal.modal({clickToClose: false, closedFocus: '.modalBtn.modal'}, (e, $modal) => {
        if (e.type === 'open') {
        } else if (e.type === 'before-close') {
        }
      })
    },
    setPaging (totalLength) {
      if ($resultModal.find('.paging.js-paging').attr('applied-plugin')) {
        return false
      }

      /** paging setting */
      $resultModal.find('.paging.js-paging').paging({
        offset: 0,
        total: totalLength
      }).on('change', e => {
        pageIndex = e.offset
        this.loadList(pageIndex)
      })
    },
    loadList (pageIndex) {
      $.ajax({
        url: '/file/recordList.json',
        data: {
          page: pageIndex
        },
        success: (result) => {
          this.appendList(result.list)
          this.setPaging(result.totalLength)
        }
      })
    },
    appendList (data) {
      let html = ''
      for (let i = 0; i < data.length; ++i) {
        let from = data[i].from.substring(0, 7)
        let to = data[i].to.substring(0, 7)

        html += `<tr>
                  <td>${data[i].type}</td>
                  <td><span class="name">${data[i].name}</span></td>
                  <td class="pc-only">${data[i].address}</td>
                  <td class="pc-only">${data[i].scale}</td>
                  <td>${from} ~ ${to}</td>
                </tr>`
      }

      $resultModal.find('.project table tbody').html('').html(html)
    }
  }

  return _this
})(window.jQuery)
/** ***************************************************************************************************************** */
