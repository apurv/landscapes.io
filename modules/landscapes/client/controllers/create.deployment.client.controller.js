(function () {
  'use strict';

  angular
        .module('landscapes')
        .controller('CreateDeploymentController', CreateDeploymentController);

  CreateDeploymentController.$inject = ['$scope', '$state', 'landscapesResolve', 'DeploymentService', 'GlobalTagService', 'CloudAccountService',
    'PermissionService', 'ValidationService', 'Authentication'
  ];

  function CreateDeploymentController($scope, $state, landscape, DeploymentService, GlobalTagService, CloudAccountService, PermissionService,
        ValidationService, Authentication) {

    var vm = this;
    vm.form = {};
    vm.landscapeId = $state.params.landscapeId;
    vm.deployment = {
      'isOtherRegion': false,
      'rejectUnauthorizedSsl': true
    };
    vm.error = null;
    vm.keys = [];
    vm.accounts = [];

    CloudAccountService.retrieve()
            .then(function (data) {
              vm.accounts = data;
              vm.accounts.splice(0, 0, {
                'name': 'None',
                'id': '-',
                'isOtherRegion': false,
                'rejectUnauthorizedSsl': true
              });

              console.log('accounts:', data)
              if (data.length > 0) {
                vm.deployment.account = vm.accounts[0].id;

                vm.deployment.location = vm.accounts[0].region;
                vm.deployment.location = vm.accounts[0].region;
                vm.deployment.isOtherRegion = vm.accounts[0].isOtherRegion;

                vm.deployment.secretAccessKey = vm.accounts[0].secretAccessKey;
                vm.deployment.accessKeyId = vm.accounts[0].accessKeyId;

                vm.deployment.caBundlePath = vm.accounts[0].caBundlePath;
                vm.deployment.endpoint = vm.accounts[0].endpoint;
                vm.deployment.rejectUnauthorizedSsl = vm.accounts[0].rejectUnauthorizedSsl;
                vm.deployment.signatureBlock = vm.accounts[0].signatureBlock;
              }
            });

    GlobalTagService.query()
            .$promise
            .then(function (data) {
              vm.globalTags = data;
              if (vm.globalTags) {
                vm.deployment.tags = {}; //set default
              }
                // set default values
              for (var i = 0; i < vm.globalTags.length; i++) {
                if (vm.globalTags[i].defaultValue) {
                  vm.deployment.tags[vm.globalTags[i].key] = vm.globalTags[i].defaultValue;
                }
              }
            });

    vm.landscape = landscape;
    vm.template = JSON.parse(vm.landscape.cloudFormationTemplate);
    vm.keys = Object.keys(vm.template.Parameters);

    console.log('PARAMETERS...');
    for (var i = 0; i < vm.keys.length; i++) {
      console.log(vm.keys[i] + ': ' + JSON.stringify(vm.template.Parameters[vm.keys[i]]));
      vm.deployment[vm.keys[i]] = '';

            // add AllowedValues
            // This isn't used; the view uses $scope.template.Parameters.AllowedValues
            //if($scope.template.Parameters[$scope.keys[i]].hasOwnProperty('AllowedValues')){
            //    $scope.deployment[$scope.keys[i]].AllowedValues = $scope.template.Parameters[$scope.keys[i]].AllowedValues;
            //    console.log('AllowedValues: ' + $scope.template.Parameters[$scope.keys[i]].AllowedValues);
            //}

            // set Default
      if (vm.template.Parameters[vm.keys[i]].hasOwnProperty('Default')) {
        vm.deployment[vm.keys[i]] = vm.template.Parameters[vm.keys[i]].Default;
        console.log('Default: ' + vm.template.Parameters[vm.keys[i]].Default);
      }
    }

    vm.resetRegion = function () {
      vm.deployment.location = undefined;
      vm.deployment.isOtherRegion = false;

      console.log('vm.deployment.isOtherRegion', vm.deployment.isOtherRegion)
      console.log('vm.deployment.location', vm.deployment.location)
    }

    vm.changeRegion = function () {
      if (vm.deployment.location === '-') {
        vm.deployment.isOtherRegion = true;
      } else {
        vm.deployment.isOtherRegion = false;
      }
      console.log('vm.deployment.isOtherRegion', vm.deployment.isOtherRegion)
      console.log('vm.deployment.location', vm.deployment.location)
    }

    vm.changeAccount = function () {
      for (var i = 0; i < vm.accounts.length; i++) {
        if (vm.accounts[i].id === vm.deployment.account) {
          vm.deployment.location = vm.accounts[i].region;
          vm.deployment.isOtherRegion = vm.accounts[i].isOtherRegion;
          vm.deployment.secretAccessKey = vm.accounts[i].secretAccessKey;
          vm.deployment.accessKeyId = vm.accounts[i].accessKeyId;
          vm.deployment.caBundlePath = vm.accounts[i].caBundlePath;
          vm.deployment.endpoint = vm.accounts[i].endpoint;
          vm.deployment.rejectUnauthorizedSsl = vm.accounts[i].rejectUnauthorizedSsl;
          vm.deployment.signatureBlock = vm.accounts[i].signatureBlock;
        }
      }
    };

    vm.createNewDeployment = function (form) {
      vm.submitted = true;
      vm.form = form;
      vm.cloudFormationParameters = {};

      for (var x = 0; x < vm.keys.length; x++) {
        vm.cloudFormationParameters[vm.keys[x]] = vm.deployment[vm.keys[x]];
      }

            // TO DO: set form.$invalid if required GlobalTag is empty

      if (!form.$valid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.deploymentForm');
        return false;
      }

      var cleanStackName = vm.deployment.stackName.replace(/ /g, '-');

      if (vm.accounts.length !== 0) {
        for (var i = 0; i < vm.accounts.length; i++) {
          if (vm.accounts[i].id === vm.deployment.account) {
            vm.deployment.accessKeyId = vm.accounts[i].accessKeyId;
            vm.deployment.secretAccessKey = vm.accounts[i].secretAccessKey;
          }
        }
      }

      DeploymentService.create({
        caBundlePath: vm.deployment.caBundlePath,
        endpoint: vm.deployment.endpoint,
        rejectUnauthorizedSsl: vm.deployment.rejectUnauthorizedSsl,
        signatureBlock: vm.deployment.signatureBlock,

        landscapeId: vm.landscapeId,
        stackName: cleanStackName,
        description: vm.deployment.description,

        location: vm.deployment.location,
        accessKeyId: vm.deployment.accessKeyId,
        secretAccessKey: vm.deployment.secretAccessKey,

        billingCode: vm.deployment.billingCode,
        tags: vm.deployment.tags,
        cloudFormationParameters: vm.cloudFormationParameters
      })
                .then(function (data) {
                  console.log(JSON.stringify(data));
                  $state.go('landscapes.view', {
                    landscapeId: vm.landscapeId
                  });
                    //$location.path('/landscapes/'+ vm.landscapeId);
                })
                .catch(function (err) {
                  console.log(err);
                  console.log(JSON.stringify(err));

                  err = err.data;
                  $scope.errors = {};

                    // Update validity of form fields that match the mongoose errors
                  angular.forEach(err.errors, function (error, field) {
                    form[field].$setValidity('mongoose', false);
                    $scope.errors[field] = error.message;
                  });
                });

    };
  }
})();
