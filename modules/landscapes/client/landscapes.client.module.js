(function (app) {
  'use strict';

  app.registerModule('landscapes',
    [
      'ngFileUpload',
      'monospaced.elastic',
      'ui.bootstrap',
      'checklist-model',
      'angularModalService',
      'trNgGrid'
    ]);

  // app.registerModule('articles.admin', ['core.admin']);
  // app.registerModule('articles.admin.routes', ['core.admin.routes']);
  
  app.registerModule('landscapes.services');
  app.registerModule('landscapes.routes', ['ui.router', 'landscapes.services']);
})(ApplicationConfiguration);
