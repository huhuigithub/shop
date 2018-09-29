(function(){
  'use strict'

  angular
    .module('order',['ui.router'])
    .config(config)

    function config($stateProvider){
      $stateProvider
        .state('orderContent',{
          url:'/order',
          views:{
            '':{
              templateUrl:'app/main/main.html'
            },
            '@orderContent':{
              templateUrl:'app/order/order.html',
              controller:'orderController',
              controllerAs:'vm'
            }
          }
        })
        .state('orderContent.orderInfo',{
          url:'/orderInfo/:orderId',
          views:{
            '@orderContent': {
              templateUrl: 'app/order/orderInfo.html',
              controller: 'orderInfoController',
              controllerAs: 'vm'
            }
          }
        })
    }

})()
