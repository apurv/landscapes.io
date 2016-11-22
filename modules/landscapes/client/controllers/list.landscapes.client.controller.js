(function () {
  'use strict';

  angular
        .module('landscapes')
        .controller('LandscapesListController', LandscapesListController);

  LandscapesListController.$inject = ['$scope', '$rootScope', '$state','LandscapesService','PermissionService','Authentication'];

  function LandscapesListController($scope, $rootScope, $state,LandscapesService,PermissionService,Authentication) {

    console.log('LandscapesListController')

    var vm = this;
    vm.currentUser = Authentication.user;
    vm.hasPermission = PermissionService.hasPermission;
    vm.landscapes = LandscapesService.query();
    for(var i = 0; i < vm.landscapes.length; i++) {
      if(vm.landscapes[i]['description'].length > 160){
        vm.landscapes[i]['description'] = vm.landscapes[i]['description'].substring(0,157) + '...';
      }

            // AH - why random string ?
      vm.landscapes[i]['imageUri'] = '/api/landscapes/' + vm.landscapes[i]._id + '/image' + $rootScope.randomQueryString();
    }
  }
})();



