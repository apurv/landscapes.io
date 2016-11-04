(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('users.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    var auth = {
      user: $window.user
    };

    if (auth.user !== null) {
      // var rolesArray = auth.user.roles ? auth.user.roles : [{ name: 'guest' }];
      // var roles = [];
      // rolesArray.forEach(role => { roles.push(role.name); });
      // auth.user.roles = roles;

      console.log('$window.user --> ', $window.user)
      console.log('auth.user.roles --> ', auth.user.roles)
    }

    return auth;
  }
} ());
