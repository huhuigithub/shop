(function(){
  'use strict'

  angular
  .module('index',['ui.router'])
  .config(config)

  function config($stateProvider){
    $stateProvider
    .state('indexContent',{
      url:'/index',
      views:{
        '':{
          templateUrl:'app/main/main.html'
        },
        '@indexContent':{
          templateUrl:'app/index/index.html',
          controller:'indexController',
          controllerAs:'vm'
        }
      }
    })
  }
})()
