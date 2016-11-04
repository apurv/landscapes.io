'use strict';

// <div image-upload></div>

angular.module('landscapes')
    .directive('imageUpload', function($parse) {
        return {
            restrict: 'AE',
            templateUrl: 'modules/landscapes/client/directives/imageUpload/imageUpload.html',
            replace: true
        };
    });
