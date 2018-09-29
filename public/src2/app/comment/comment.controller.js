(function(){
  angular
    .module('comment')
    .controller('commentController',commentController)

    function commentController($scope,timeNow,service){
      var vm = this;
      activate();

      function activate(){
        productKindlist();
      }

      /** 商品分类查询 */
      function productKindlist(){
        var data = {
          "api":"searchProductKind",

        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var productKind = response.productKind;
            vm.productKindlist = angular.fromJson(productKind);
            console.log(vm.productKindlist);
          }
        })
      }

    }
})()
