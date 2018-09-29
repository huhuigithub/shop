(function(){
  angular
    .module('list')
    .controller('listController',listController)

    function listController($scope,timeNow,service){
      var vm = this;
      activate();

      function activate(){
        getProduct('手机');
        getProduct('笔记本');
        getProduct('平板');
        getProduct('电视');
        getProduct('鼠标');
        getProduct('冰箱');
      }

      function getProduct(type){
        var data = {
          "api":"searchProductByType",
          "productType":type
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
            if(type==='手机'){
              vm.phone = vm.product;
              console.log(vm.product);
            }if(type==='笔记本'){
              vm.bookair = vm.product;
              console.log(vm.product);
            }if(type==='平板'){
              vm.pad = vm.product;
              console.log(vm.product);
            }if(type==='电视'){
              vm.tv = vm.product;
              console.log(vm.product);
            }if(type==='鼠标'){
              vm.mouse = vm.product;
              console.log(vm.product);
            }if(type==='冰箱'){
              vm.icebox = vm.product;
              console.log(vm.product);
            }
          }else{
            vm.productKindlist = '';
          }
        })
      }

    }
})()
