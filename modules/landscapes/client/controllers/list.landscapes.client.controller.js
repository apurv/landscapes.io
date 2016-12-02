(function() {
    'use strict';

    angular
        .module('landscapes')
        .controller('LandscapesListController', LandscapesListController);

    LandscapesListController.$inject = ['$scope', '$rootScope', '$state', 'LandscapesService', 'PermissionService', 'DeploymentService', 'Authentication'];

    function LandscapesListController($scope, $rootScope, $state, LandscapesService, PermissionService, DeploymentService, Authentication) {

        console.log('LandscapesListController')

        var vm = this;

        vm.statusArr = []
        vm.currentUser = Authentication.user;
        vm.hasPermission = PermissionService.hasPermission;
        vm.landscapes = LandscapesService.query();

        function StatusModel() {
            this.pending = 0
            this.running = 0
            this.errored = 0
            this.deleted = 0
        }

        for (var i = 0; i < vm.landscapes.length; i++) {

            if (vm.landscapes[i]['description'].length > 160) {
                vm.landscapes[i]['description'] = vm.landscapes[i]['description'].substring(0, 157) + '...';
            }

            vm.landscapes[i]['imageUri'] = '/api/landscapes/' + vm.landscapes[i]._id + '/image' + $rootScope.randomQueryString();

        }

        // promisify vm.landscapes to attain the deployments
        vm.landscapes.$promise.then(response => {

            vm.landscapes = response

            // instantiate statuses
            vm.landscapes.forEach(landscape => {
                landscape.status = new StatusModel()
            })

            // create promise array to gather all deployments
            let _promises = vm.landscapes.map((landscape, index) => {
                return new Promise((resolve, reject) => {
                    DeploymentService.retrieveForLandscape(vm.landscapes[index]._id, (err, landscapes) => {
                        if (err) {
                            console.log(err)
                            reject(err)
                        }

                        // forEach deployment if state is in progress then set interval

                        resolve(landscapes)
                    })
                })
            })

            return Promise.all(_promises)

        }).then(landscapes => {

            // count deleted/purged/errored landscapes
            landscapes.forEach((landscape, i) => {
                landscape.forEach(deployment => {
                    if (deployment && deployment.isDeleted) {
                        vm.landscapes[i].status.deleted++
                    } else if (deployment && deployment.awsErrors) {
                        vm.landscapes[i].status.errored++
                    }
                })
            })

            // gather status for other landscapes
            let _promises = []

            let _promiseAll = landscapes.map((landscape, j) => {
                if (landscape.length) {
                    _promises[j] = landscape.map(stack => {
                        if (!stack.isDeleted && !stack.awsErrors) {
                            return DeploymentService.describe(stack.stackName, stack.location, stack.accountName)
                        }
                        return []
                    })
                    return Promise.all(_promises[j])
                }
                return []
            })

            return Promise.all(_promiseAll)

        }).then(stacksInfo => {
            console.log('%c stackInfo ', 'background: #1c1c1c; color: deepskyblue', stacksInfo)

            // count in-progress/running/error deployments
            stacksInfo.forEach((deployments, i) => {
                deployments.forEach(deployment => {
                    console.log('%c deployment ', 'background: #1c1c1c; color: limegreen', deployment)
                    if (deployment) {
                        deployment.forEach(stack => {
                            console.log('%c stack ', 'background: #1c1c1c; color: rgb(209, 29, 238)', stack)

                            let runningArr = ['CREATE_COMPLETE', 'ROLLBACK_COMPLETE', 'ROLLBACK_COMPLETE', 'DELETE_COMPLETE', 'UPDATE_COMPLETE', 'UPDATE_ROLLBACK_COMPLETE']

                            if (runningArr.indexOf(stack.StackStatus) > -1) {
                                if (vm.landscapes[i].isRunning) {
                                    vm.landscapes[i].isRunning++
                                } else {
                                    vm.landscapes[i].isRunning = 1
                                }
                            }

                        })
                    } else if (vm.landscapes[i].isError) {
                        vm.landscapes[i].isError += 1
                    } else {
                        vm.landscapes[i].isError = 1
                        // console.log('%c vm.landscapes[i].landscapeId ', 'background: #1c1c1c; color: rgb(209, 29, 238)', vm.statusArr[vm.landscapes[i]._id])
                        // vm.statusArr[vm.landscapes[i]._id] = 1
                        // if (vm.statusArr[vm.landscapes[i]._id].error) {
                        //     vm.statusArr[vm.landscapes[i]._id].error++
                        // } else {
                        //     vm.statusArr[vm.landscapes[i]._id] = {
                        //         error: 1
                        //     }
                        // }
                    }
                })
            })

            console.log('%c statusArr ', 'background: #1c1c1c; color: rgb(209, 29, 238)', vm.statusArr)

        }).catch(err => {
            console.log(err)
        })






    }
})();
