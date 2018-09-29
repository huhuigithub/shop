(function(){
  angular
    .module('list')
    .controller('searchController',searchController)

    function searchController($scope,$cookies,$window,$stateParams,timeNow,service,serviceAlert){
      var vm = this;

      activate();

      function activate(){
        $($window).scrollTop(0);
        getProductName();
        console.log($stateParams.keyword);
      }

      /** 商品名称查询 */
      function getProductName(){
        var data = {
          "api":"searchProductByKeyword",
          "keyword":$stateParams.keyword
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.product = angular.fromJson(response.product);
            for(var i=0;i<vm.product.length;i++){
              vm.product[i].productColor = eval('(' + vm.product[i].productColor + ')');
              vm.product[i].productVersion = eval('(' + vm.product[i].productVersion + ')');
            }
            console.log(vm.product);
          }else{
            vm.product = response.product;
            serviceAlert(response.msg);
          }
        })
      }


    }
})()
