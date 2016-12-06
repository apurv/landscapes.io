(function() {
    'use strict';

    angular
        .module('landscapes')
        .controller('LandscapesListController', LandscapesListController);

    LandscapesListController.$inject = ['$scope', '$rootScope', '$state', 'LandscapesService', 'PermissionService', 'DeploymentService', 'Authentication'];

    function LandscapesListController($scope, $rootScope, $state, LandscapesService, PermissionService, DeploymentService, Authentication) {

        console.log('LandscapesListController')

        var vm = this;
        const runningStatus = ['CREATE_COMPLETE', 'ROLLBACK_COMPLETE', 'ROLLBACK_COMPLETE', 'DELETE_COMPLETE', 'UPDATE_COMPLETE', 'UPDATE_ROLLBACK_COMPLETE']
        const pendingStatus = ['CREATE_IN_PROGRESS', 'ROLLBACK_IN_PROGRESS', 'DELETE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS', 'UPDATE_ROLLBACK_IN_PROGRESS', 'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS', 'REVIEW_IN_PROGRESS']

        vm.statusArr = []
        vm.currentUser = Authentication.user;
        vm.hasPermission = PermissionService.hasPermission;
        vm.landscapes = LandscapesService.query();
        vm.landscapesDetails = []

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

                        resolve(landscapes)
                    })
                })
            })

            return Promise.all(_promises)

        }).then(landscapes => {

            vm.landscapesDetails = landscapes

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

            let _promiseAll = landscapes.map((landscape, x) => {
                if (landscape.length) {
                    _promises[x] = landscape.map(stack => {
                        if (!stack.isDeleted && !stack.awsErrors) {
                            return DeploymentService.describe(stack.stackName, stack.location, stack.accountName)
                        }
                        return []
                    })
                    return Promise.all(_promises[x])
                }
                return []
            })

            return Promise.all(_promiseAll)

        }).then(landscapesStatus => {

            // flatten deployments in landscapesStatus
            landscapesStatus = landscapesStatus.map(stack => {
                return _.compact(stack.map(dep => {
                        return dep[0]
                }))
            })

            // loop through each deployment and increment the running/pending statuses
            landscapesStatus.forEach((ls, index) => {
                ls.forEach(deployment => {

                    // HACK: Remove this
                    deployment.StackStatus = 'CREATE_IN_PROGRESS'

                    if (runningStatus.indexOf(deployment.StackStatus) > -1) {
                        vm.landscapes[index].status.running++
                    } else if (pendingStatus.indexOf(deployment.StackStatus) > -1) {
                        vm.landscapes[index].status.pending++

                        // derive the index of the pending deployment and poll AWS until its resolved
                        let _pendingIndex = _.findIndex(vm.landscapesDetails[index], { stackName: deployment.StackName })
                        let _pendingDeployment = vm.landscapesDetails[index][_pendingIndex]
                        poll(index, 5000, _pendingDeployment.stackName, _pendingDeployment.location, _pendingDeployment.accountName)
                    }
                })
            })


        }).catch(err => {
            console.log(err)
        })


        function poll(index, interval, stackName, location, accountName) {
            return DeploymentService.describe(stackName, location, accountName).then(deployment => {
                if (runningStatus.indexOf(deployment[0].StackStatus) > -1) {
                    vm.landscapes[index].status.running++
                    vm.landscapes[index].status.pending--
                } else {
                    setTimeout(() => {
                        poll(index, stackName, location, accountName)
                    }, interval)
                }
            }).catch(err => {
                console.log(err)
            })
        }






    }
})();
