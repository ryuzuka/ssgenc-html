/** Project.js ******************************************************************************************************** */
window.SSG.Project = ($ => {
  let $content = $('.contents.section')
  let $tab = $content.find('.tab.js-tab')
  let $dropdown = $content.find('.dropdown.js-dropdown')
  let $projectList = $content.find('.project .content')

  let projectList = []
  let projectListIndex = []

  let _this = {
    init () {
      this.typeIndex = 0

      this.setProject()
      this.setProjectList()
    },
    setProject () {
      $.switchUI.init($.viewType)
      $tab.on('change-tab', (e, activeIdx) => this.changeProjectType(activeIdx))
      $dropdown.on('change-dropdown', (e, activeIdx) => this.changeProjectType(activeIdx))
    },
    changeProjectType (typeIndex) {
      this.typeIndex = typeIndex

      // change
      // console.log('typeIndex: ', this.typeIndex)
    },
    setProjectList () {
      $projectList.each(function (index) {
        projectList[index] = []
        projectListIndex[index] = 0

        let $project = $(this).find('.list > li')
        $project.each(function (idx) {
          projectList[index][idx] = $(this)
        })
      })

      $projectList.find('.btn.more').on('click', function (e) {
        let idx = $(this).closest('.content').index()
        projectListIndex[idx]++

        for (let i = 0; i < 9; ++i) {
          $projectList.eq(idx).find('.list > li').eq(projectListIndex[idx]* 9 + i).show()
          if (projectListIndex[idx]* 9 + i >= projectList[idx].length - 1) {
            $(this).hide()
          }
        }
      })
    }
  }

  return _this
})(window.jQuery)
/** ***************************************************************************************************************** */
