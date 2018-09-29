(function(){
  angular
    .module('product')
    .controller('productController',productController)

    function productController($scope,timeNow,service,serviceAlert){
      var vm = this;
      vm.deleteProductById = deleteProductById;
      activate();

      function activate(){
        searchProductList()
      }

      /** 商品查询 */
      function searchProductList(){
        var data = {
          "api":"searchProductList",
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var productList = response.productList;
            vm.productList = angular.fromJson(productList);
            for(var i=0;i<vm.productList.length;i++){
              vm.productList[i].productVersion = eval('(' +vm.productList[i].productVersion+')');
              vm.productList[i].productColor = eval('(' +vm.productList[i].productColor+')');
            }
            console.log(vm.productList);
          }
        })
      }
      /** 商品删除 */
      function deleteProductById(productId){
        var data = {
          "api":"deleteProductById",
          "productId":productId
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var productList = response.productList;
            vm.productList = angular.fromJson(productList);
            console.log(vm.productList);
            serviceAlert(response.msg);
            searchProductList();
          }
        })
      }
    }
})()
