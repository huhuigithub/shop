(function(){
  'use strict'

  angular
    .module('cart',['ui.router'])
    .config(config)

    function config($stateProvider){
      $stateProvider
        .state('cartContent',{
          url:'/cart',
          views:{
            '':{
              templateUrl:'app/main/main2.html'
            },
            '@cartContent':{
              templateUrl:'app/cart/cart.html',
              controller:'cartController',
              controllerAs:'vm'
            }
          }
        })
        .state('cartContent.getOrderInfo',{
          url:'/getOrderInfo/:productIdList',
          views:{
            '':{
              templateUrl:'app/main/main2.html'
            },
            '@cartContent':{
              templateUrl:'app/cart/getOrderInfo.html',
              controller:'getOrderInfoController',
              controllerAs:'vm'
            }
          }
        })
    }

})()
