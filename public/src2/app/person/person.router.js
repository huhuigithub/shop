(function(){
  'use strict'

  angular
    .module('person',['ui.router'])
    .config(config)

    function config($stateProvider){
      $stateProvider
        .state('personContent',{
          url:'/person',
          views:{
            '':{
              templateUrl:'app/main/main.html'
            },
            '@personContent':{
              templateUrl:'app/person/person.html',
              controller:'personController',
              controllerAs:'vm'
            }
          }
        })
    }

})()
