(function (window) {
  'use strict';

  angular.module('lodash', []).constant('_', window._);

  var applicationModuleName = 'mean';

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: [
      'ngResource',
      'ngAnimate',
      'ngMessages',
      'ui.router',
      'ui.bootstrap',
      'ngFileUpload',
      'ngImgCrop',
      'lodash'
    ],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  function registerModule(moduleName, dependencies) {    
    angular.module(moduleName, dependencies || []);
    angular.module(applicationModuleName).requires.push(moduleName);
  }
} (window));