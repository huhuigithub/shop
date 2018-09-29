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
          templateUrl:'app/main/main3.html'
        },
        '@personContent':{
          templateUrl:'app/person/person.html',
          controller:'PersonController',
          controllerAs:'vm'
        }
      }
    })
    .state('personContent.updatePerson',{
      url:'/updatePerson',
      views:{
        '@personContent': {
          templateUrl: 'app/person/updatePerson.html',
          controller: 'updatePersonController',
          controllerAs: 'vm'
        }
      }
    })
    .state('addressContent',{
      url:'/address',
      views:{
        '':{
          templateUrl:'app/main/main3.html'
        },
        '@addressContent':{
          templateUrl:'app/person/address.html',
          controller:'addressController',
          controllerAs:'vm'
        }
      }
    })
    .state('orderContent',{
      url:'/order',
      views:{
        '':{
          templateUrl:'app/main/main3.html'
        },
        '@orderContent':{
          templateUrl:'app/person/order.html',
          controller:'orderController',
          controllerAs:'vm'
        }
      }
    })
    .state('orderContent.orderInfo',{
      url:'/orderInfo/:orderId',
      views:{
        '@orderContent': {
          templateUrl: 'app/person/orderInfo.html',
          controller: 'orderInfoController',
          controllerAs: 'vm'
        }
      }
    })
    .state('orderContent.comment',{
      url:'/comment/:orderId&:productId',
      views:{
        '@orderContent': {
          templateUrl: 'app/person/comment.html',
          controller: 'commentController',
          controllerAs: 'vm'
        }
      }
    })

  }
})()
