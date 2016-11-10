'use strict';

angular.module('landscapes')
    .controller('AdminAccountsCtrl', function ($scope, $state, $uibModal, CloudAccountService) {

        var vm = this;
        vm.account = {
            rejectUnauthorizedSsl: true
        };

        vm.addingAccount = false;
        vm.editingAccount = false;

        vm.editAccount = function (id) {
            console.log('editAccount: ' + id);
            vm.editingAccount = true;
            vm.account = CloudAccountService.retrieveOne(id);
            console.log(vm.account);
            vm.showAdvanced = _showAdvanced(vm.account);
        };

        function _showAdvanced(account) {
            let show = false;
            if(!account.rejectUnauthorizedSsl || account.endpoint || account.caBundlePath || account.signatureBlock) {
                show = true
            }
            return show;
        }

        vm.updateAccount = function (id) {
            console.log('updateAccount');
            console.log(vm.account);
            //Whys is this empty - AH?
        };

        vm.addAccount = function () {
            console.log('addAccount');
            vm.account = {
                rejectUnauthorizedSsl: true
            };
            vm.addingAccount = true;
        };

        vm.resetAccounts = function () {
            console.log('resetAccounts');

            CloudAccountService.retrieve()
                .then(function (data) {
                    $scope.$parent.vm.accounts = data;
                });

            vm.addingAccount = false;
            vm.editingAccount = false;
            vm.account = {
                rejectUnauthorizedSsl: true
            };
            vm.submitted = false;

        };

        vm.errors = {};

        vm.saveAccount = function (form) {
            vm.submitted = true;
            vm.form = form;

            if (vm.form.$invalid) {
                console.log('form.$invalid:', vm.form.$error); //TODO fix error logging

            } else if (vm.addingAccount) {

                console.log('vm.account', vm.account)

                CloudAccountService.create({
                    name: vm.account.name,
                    accessKeyId: vm.account.accessKeyId,
                    secretAccessKey: vm.account.secretAccessKey,
                    region: vm.account.region || 'us-east-1',
                    isOtherRegion: vm.account.isOtherRegion,
                    rejectUnauthorizedSsl: vm.account.rejectUnauthorizedSsl,
                    endpoint: vm.account.endpoint,
                    caBundlePath: vm.account.caBundlePath,
                    signatureBlock: vm.account.signatureBlock

                })
                    .then(function () { vm.resetAccounts(); })
                    .catch(function (err) {
                        err = err.data || err;
                        console.log(' CloudAccountService.create() --> ERROR:', err);

                        vm.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            console.log('error, field', error, field)
                            console.log(vm.form);
                            vm.form[field].$setValidity('mongoose', false);
                            vm.errors[field] = error.message;
                        });
                    });

            } else if (vm.editingAccount) {

                console.log('editing account...');
                console.log(vm.account);

                CloudAccountService.update(vm.account._id, {
                    name: vm.account.name,
                    accessKeyId: vm.account.accessKeyId,
                    secretAccessKey: vm.account.secretAccessKey,
                    region: vm.account.region || 'us-east-1',
                    isOtherRegion: vm.account.showOtherRegion,
                    rejectUnauthorizedSsl: vm.account.rejectUnauthorizedSsl,
                    endpoint: vm.account.endpoint,
                    caBundlePath: vm.account.caBundlePath,
                    signatureBlock: vm.account.signatureBlock
                })
                    .then(function () {
                        vm.resetAccounts();
                    })
                    .catch(function (err) {
                        err = err.data || err;
                        console.log(err);

                        vm.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    });
            }
        };

        vm.deleteAccount = function () {
            console.log('deleteAccount: ' + vm.account.id);

            vm.confirmDelete(vm.account.name, function (deleteConfirmed) {
                console.log('deleteAccount.deleteConfirmed: ' + deleteConfirmed);
                if (deleteConfirmed === true) {

                    CloudAccountService.delete(vm.account.id)
                        .then(function () {
                            vm.resetAccounts();
                        })
                        .catch(function (err) {
                            err = err.data || err;
                            console.log(err);
                        });
                }
            });
        };

        vm.confirmDelete = function (msg, callback) {
            console.log(msg)
            var modalInstance = $uibModal.open({
                templateUrl: 'confirmDeleteModal.html',
                controller: 'DeleteModalInstanceCtrl as vm',
                size: 'sm',
                resolve: { msg: function () { return msg; } }
            });

            modalInstance.result.then(function (result) {
                return callback(result);
            });
        };
    });


angular.module('landscapes')
    .controller('DeleteModalInstanceCtrl', function ($scope, $uibModalInstance, msg) {
        var vm = this;
        vm.msg = msg;

        vm.close = function (result) {
            $uibModalInstance.close(result); // close, but give 500ms for bootstrap to animate
        };
    });
