(function(){
  'use strict'

  angular
    .module('product',['ui.router'])
    .config(config)

    function config($stateProvider){
      $stateProvider
        .state('productContent',{
          url:'/product',
          views:{
            '':{
              templateUrl:'app/main/main.html'
            },
            '@productContent':{
              templateUrl:'app/product/product.html',
              controller:'productController',
              controllerAs:'vm'
            }
          }
        })
        .state('productContent.productInfo',{
          url:'/productInfo/:productId',
          views:{
            '@productContent': {
              templateUrl: 'app/product/productInfo.html',
              controller: 'productInfoController',
              controllerAs: 'vm'
            }
          }
        })
        .state('productContent.createProduct',{
          url:'/createProduct',
          views:{
            '@productContent': {
              templateUrl: 'app/product/createProduct.html',
              controller: 'createProductController',
              controllerAs: 'vm'
            }
          }
        })
        .state('productContent.updateProduct',{
          url:'/updateProduct/:productId',
          views:{
            '@productContent': {
              templateUrl: 'app/product/updateProduct.html',
              controller: 'updateProductController',
              controllerAs: 'vm'
            }
          }
        })
    }

})()
