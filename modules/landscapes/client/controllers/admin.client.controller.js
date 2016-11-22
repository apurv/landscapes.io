(function () {
  'use strict';

  angular
        .module('landscapes')
        .controller('AdminController', AdminController);

  AdminController.$inject = ['$scope', '$state', 'LandscapesService', 'UserService', 'RoleService','GroupService','PermissionService','CloudAccountService', 'AppSettingsService','GlobalTagService', 'Authentication'];

  function AdminController($scope, $state, LandscapesService, UserService, RoleService, GroupService, PermissionService,CloudAccountService, AppSettingsService, GlobalTagService, Authentication) {

    console.log('AdminController')

    var vm = this;

    vm.menu = [
            // 'Users',
            // 'Roles',
            // 'Groups',
      'AWS Accounts',
      'Global Tags',
      'System'
    ];

    vm.selected = vm.menu[0];

    vm.buttonClick = function(text){
      console.log(text)
      vm.selected = text;
    };

    vm.errors = {};

    vm.landscapes = LandscapesService.query();

    vm.permissions = PermissionService.retrieveAll();

    vm.globalTags = GlobalTagService.query();

        //TODO condolidate under users
    vm.users = UserService.query();
    vm.roles = RoleService.query();
    vm.groups = GroupService.query();


    CloudAccountService.retrieve()
            .then(function(data){
              vm.accounts = data;
            });

    AppSettingsService.retrieve()
            .then(function(data){
              vm.appSettings = data;
            });

  }
})();
