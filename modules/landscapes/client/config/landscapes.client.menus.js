(function () {
  'use strict';

  angular
    .module('landscapes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Landscapes',
      state: 'landscapes.list'
    });

    menuService.addMenuItem('topbar', {
      title: 'Settings',
      state: 'landscapes.admin'
    });

  }
}());
