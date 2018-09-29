(function(){
  'use strict'

  angular
    .module('list',['ui.router'])
    .config(config)

    function config($stateProvider){
      $stateProvider
        .state('listContent',{
          url:'/list',
          views:{
            '':{
              templateUrl:'app/main/main.html'
            },
            '@listContent':{
              templateUrl:'app/list/list.html',
              controller:'listController',
              controllerAs:'vm'
            }
          }
        })
        .state('searchContent',{
          url:'/search/:keyword',
          views:{
            '':{
              templateUrl:'app/main/main.html'
            },
            '@searchContent':{
              templateUrl:'app/list/search.html',
              controller:'searchController',
              controllerAs:'vm'
            }
          }
        })
    }

})()
