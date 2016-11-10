'use strict';

angular.module('landscapes')
    .factory('CloudAccountService', function CloudAccountService($location, CloudAccount) {
        return {
            create: function(group, callback) {
                var cb = callback || angular.noop;
                return CloudAccount.save(group,
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            retrieve: function(callback) {
                var cb = callback || angular.noop;

                return CloudAccount.query({},
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            retrieveOne: function(id) {
                return CloudAccount.get({id:id}, function(){});
            },
            update: function(id, account, callback) {
                var cb = callback || angular.noop;

                return CloudAccount.update({id:id}, account,
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            delete: function(id, callback) {
                var cb = callback || angular.noop;

                return CloudAccount.remove({id: id},
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            }
        };
    });

//why two?

angular.module('landscapes')
    .factory('CloudAccount', function ($resource) {
        return $resource('/api/accounts/:id', {
            id: '@id'
        }, {
            update: { method: 'PUT' }
        });
    });
