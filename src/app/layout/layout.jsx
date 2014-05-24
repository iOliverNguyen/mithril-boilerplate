function layout(contentModule) {

  function controller() {
    this.contentCtrl = new contentModule.controller();

    this.tabActive = function(r) {
      return m.route() === r? 'active': '';
    };
  }

  function view(ctrl) {
    return INCLUDE('layout/layout.tpl');
  }

  return {
    controller: controller,
    view: view
  };
}

module.exports = layout;
