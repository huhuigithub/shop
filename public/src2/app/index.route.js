(function() {
  'use strict';

  angular
    .module('mishop')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .state('login',{
        url:'/',
        templateUrl:'app/login/login.html',
        controller:'LoginController',
        controllerAs:'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
