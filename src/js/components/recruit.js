/** Recruit.js ****************************************************************************************************** */
window.SSG.Recruit = (($, $moment) => {
  let $recruit = $('.contents')
  let $paging = $recruit.find('.paging.js-paging')
  let $page = null

  let listLength = 0

  const VIEW_LIST_LENGTH = 5

  let _this = {
    init () {
      this.loadList()
    },
    loadList () {
      $.ajax({
        url: '/file/recruitList.json',
        success: (result) => {
          this.appendList(result)
          this.setPaging()
        }
      })
    },
    appendList (data) {
      let html = ''
      for (let i = 0; i < data.length; ++i) {
        html += `${(i % VIEW_LIST_LENGTH) === 0 ? '<tbody style="display: none">' : ''}
                  <tr>
                    <td class="left">
                      <a href="#none" data-notino="${data[i].NOTINO}" data-recrtp="${data[i].RECRTP}")>
                        ${data[i].NOTINM}
                      </a>
                    </td>
                    <td class="date">${$moment(data[i].RECSTDT).format('YYYY.MM.DD')} ~ ${$moment(data[i].RECCLDT).format('YYYY.MM.DD')}</td>
                    <td><span class="state">접수중</span></td>
                  </tr>
                ${(i % VIEW_LIST_LENGTH) === 4 ? '</tbody>' : ''}`

        if (i === data.length - 1 && (i % VIEW_LIST_LENGTH) < 4) {
          html += '</tbody>'
        }
      }
      $recruit.find('table.tbl-list').html('').html(html)
      listLength = $recruit.find('table.tbl-list').find('tr').length

      $recruit.find('table.tbl-list').find('tr a').on('click', e => {
        let notino = $(e.target).data('notino')
        let recrtp = $(e.target).data('recrtp')

        this.moveView(notino, recrtp)
        return false
      })
    },
    setPaging () {
      $page = $recruit.find('table tbody')
      $page.eq(0).show()

      $paging.paging({
        offset: 0,            // 현재 페이지 (default: 0)
        limit: 5,             // 한 화면에 보여지는 리스트(게시글) 갯수
        total: listLength     // 전체 리스트 갯수
      }).on('change', e => {
        $page.hide()
        $page.eq(e.offset).show()
      })
    },
    moveView (notino, recrtpnm) {
      $('input[name="notino"]').val(notino);
      $('input[name="recrtpnm"]').val(encodeURIComponent(recrtpnm));
      $('form').submit();
    }
  }

  return _this
})(window.jQuery, window.moment)
/** ***************************************************************************************************************** */
