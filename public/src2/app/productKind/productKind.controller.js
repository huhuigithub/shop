(function(){
  angular
    .module('productKind')
    .controller('productKindController',productKindController)

    function productKindController($scope,timeNow,service,serviceAlert){
      var vm = this;
      activate();

      vm.deleteProductKindById = deleteProductKindById;

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

      /** 商品删除 */
      function deleteProductKindById(kindId){
        var data = {
          "api":"deleteProductKindById",
          "kindId":kindId
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            serviceAlert(response.msg);
            productKindlist();
          }
        })
      }

    }
})()
