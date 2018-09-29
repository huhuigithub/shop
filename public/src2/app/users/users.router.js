(function(){
  'use strict'

  angular
    .module('users',['ui.router'])
    .config(config)

    function config($stateProvider){
      $stateProvider
        .state('usersContent',{
          url:'/users',
          views:{
            '':{
              templateUrl:'app/main/main.html'
            },
            '@usersContent':{
              templateUrl:'app/users/users.html',
              controller:'usersController',
              controllerAs:'vm'
            }
          }
        })
    }

})()
