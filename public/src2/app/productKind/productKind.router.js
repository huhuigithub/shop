(function(){
  'use strict'

  angular
    .module('productKind',['ui.router'])
    .config(config)

    function config($stateProvider){
      $stateProvider
        .state('productKindContent',{
          url:'/productKind',
          views:{
            '':{
              templateUrl:'app/main/main.html'
            },
            '@productKindContent':{
              templateUrl:'app/productKind/productKind.html',
              controller:'productKindController',
              controllerAs:'vm'
            }
          }
        })
        .state('productKindContent.createProductKind',{
          url:'/createProductKind',
          views:{
            '@productKindContent': {
              templateUrl: 'app/productKind/createProductKind.html',
              controller: 'createProductKindController',
              controllerAs: 'vm'
            }
          }
        })
        .state('productKindContent.updateProductKind',{
          url:'/updateProductKind/:kindId',
          views:{
            '@productKindContent': {
              templateUrl: 'app/productKind/updateProductKind.html',
              controller: 'updateProductKindController',
              controllerAs: 'vm'
            }
          }
        })
    }

})()
