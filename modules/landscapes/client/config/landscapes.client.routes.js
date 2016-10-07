(function () {
  'use strict';

  angular
    .module('landscapes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('landscapes', {
        abstract: true,
        url: '/landscapes',
        template: '<ui-view/>'
      })
      .state('landscapes.admin', {
        url: '/admin',
        templateUrl: 'modules/landscapes/client/views/admin-main.client.view.html',
        controller: 'AdminController',
        controllerAs: 'vm'
      })
      .state('landscapes.list', {
      url: '',
      templateUrl: 'modules/landscapes/client/views/list-landscapes.client.view.html',
      controller: 'LandscapesListController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Landscapes List'
      }
    })
      .state('landscapes.view', {
        url: '/:landscapeId',
        templateUrl: 'modules/landscapes/client/views/view-landscape.client.view.html',
        controller: 'LandscapesViewController',
        controllerAs: 'vm',
        resolve: {
          landscapesResolve: getLandscape
        },
        data: {
          pageTitle: 'Landscape {{ landscapesResolve.title }}'
        }
      })

      .state('landscapes.create', {
        url: '/create',
        templateUrl: 'modules/landscapes/client/views/form-landscape.client.view.html',
        controller: 'LandscapesController',
        controllerAs: 'vm',
        resolve: {
          landscapesResolve: newLandscape
        }
      })

      .state('landscapes.edit', {
        url: '/:landscapeId/edit',
        templateUrl: 'modules/landscapes/client/views/edit-landscape.client.view.html',
        controller: 'LandscapeEditController',
        controllerAs: 'vm',
        resolve: {
          landscapesResolve: getLandscape
        }
      })
      .state('landscapes.createdeploy', {
        url: '/deploy/:landscapeId',
        templateUrl: 'modules/landscapes/client/views/create-deployment.client.view.html',
        controller: 'CreateDeploymentController',
        controllerAs: 'vm',
        resolve: {
          landscapesResolve: getLandscape
        }
      })
      .state('landscapes.settings', {
        url: '/settings',
        templateUrl: 'modules/landscapes/client/views/settings.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm'

      })
  }

  getLandscape.$inject = ['$stateParams', 'LandscapesService'];

  function getLandscape($stateParams, LandscapeService) {
    return LandscapeService.get({ landscapeId: $stateParams.landscapeId }).$promise
  }

  newLandscape.$inject = ['LandscapesService'];

  function newLandscape(LandscapesService) {
    return new LandscapesService();
  }
})();
