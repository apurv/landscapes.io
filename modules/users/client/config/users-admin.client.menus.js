(function () {
  'use strict';

  angular
    .module('users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Users',
      state: 'admin.users'
    });
    
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Roles',
      state: 'admin.users'
    });
    
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Groups',
      state: 'admin.users'
    });

  }
}());
