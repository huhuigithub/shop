(function(){
  angular
    .module('cart')
    .controller('cartController',cartController)

    function cartController($scope,$state,timeNow,service,serviceAlert,serviceConfirm){
      var vm = this;
      var loginUserData = localStorage.getItem("loginUserData");
      vm.login = angular.fromJson(loginUserData);
      loginUserData = angular.fromJson(loginUserData);
      vm.changeNum = changeNum;
      vm.delProNum = delProNum;
      vm.addProNum = addProNum;
      vm.productSelect = productSelect;
      vm.productSelectAll = productSelectAll;
      vm.delCartPro = delCartPro; //删除购物车某商品
      vm.settlement = settlement; //结算购物车选中商品


      vm.check_proNum = 0;//选中商品数量
      vm.check_proPrice = 0;//选中商品总金额


      vm.logintype = true;
      vm.all = false;
      if(!loginUserData){
        vm.logintype = false;
      }
      activate();

      function activate(){
        if(!loginUserData){
          return;
        }
        searchShopCart();
      }

      function changeNum(num,id){
        var reg = /^[1-9]\d*$/;
        if(!reg.test(num)){
          serviceAlert('请输入大于0的数')
          return;
        }
        console.log(num+'---'+id);
        for(var i=0;i<vm.productIdList.length;i++){//商品总数、总价计算
          if(id ===vm.productIdList[i].productId){
            vm.productIdList[i].num = num;
          }
        }
        console.log(vm.productIdList);
        var shoppingNum = 0;
        var shoppingPrice = 0;
        for(var i=0;i<vm.productIdList.length;i++){//商品总数、总价计算
          shoppingNum = parseInt(shoppingNum)+parseInt(vm.productIdList[i].num);
          shoppingPrice = parseInt(shoppingPrice)+parseInt(vm.productIdList[i].num)*parseInt(vm.productIdList[i].productInfo.productPrice);
        }
        vm.cart.shoppingNum = shoppingNum;
        vm.cart.shoppingPrice = shoppingPrice;
        console.log(vm.cart);
        undateCart();
      }

      function delProNum(num,id){
        console.log(num);
        for(var i=0;i<vm.productIdList.length;i++){//商品总数、总价计算
          if(id ===vm.productIdList[i].productId){
            vm.productIdList[i].num = num;
          }
        }
        console.log(vm.productIdList);
        var shoppingNum = 0;
        var shoppingPrice = 0;
        for(var i=0;i<vm.productIdList.length;i++){//商品总数、总价计算
          shoppingNum = parseInt(shoppingNum)+parseInt(vm.productIdList[i].num);
          shoppingPrice = parseInt(shoppingPrice)+parseInt(vm.productIdList[i].num)*parseInt(vm.productIdList[i].productInfo.productPrice);
        }
        vm.cart.shoppingNum = shoppingNum;
        vm.cart.shoppingPrice = shoppingPrice;
        console.log(vm.cart);
        undateCart();
      }

      function addProNum(num,id){
        console.log(num);
        for(var i=0;i<vm.productIdList.length;i++){//商品总数、总价计算
          if(id ===vm.productIdList[i].productId){
            vm.productIdList[i].num = num;
          }
        }
        console.log(vm.productIdList);
        var shoppingNum = 0;
        var shoppingPrice = 0;
        for(var i=0;i<vm.productIdList.length;i++){//商品总数、总价计算
          shoppingNum = parseInt(shoppingNum)+parseInt(vm.productIdList[i].num);
          shoppingPrice = parseInt(shoppingPrice)+parseInt(vm.productIdList[i].num)*parseInt(vm.productIdList[i].productInfo.productPrice);
        }
        vm.cart.shoppingNum = shoppingNum;
        vm.cart.shoppingPrice = shoppingPrice;
        console.log(vm.cart);
        undateCart();
      }

      function delCartPro(id){
        serviceConfirm('删除商品?', function () {
          console.log(id);
          for(var i=0;i<vm.productIdList.length;i++){//商品总数、总价计算
            if(id ===vm.productIdList[i].productId){
              vm.productIdList.splice(i,1);
              break;
            }
          }
          console.log(vm.productIdList);
          var shoppingNum = 0;
          var shoppingPrice = 0;
          for(var i=0;i<vm.productIdList.length;i++){//商品总数、总价计算
            shoppingNum = parseInt(shoppingNum)+parseInt(vm.productIdList[i].num);
            shoppingPrice = parseInt(shoppingPrice)+parseInt(vm.productIdList[i].num)*parseInt(vm.productIdList[i].productInfo.productPrice);
          }
          vm.cart.shoppingNum = shoppingNum;
          vm.cart.shoppingPrice = shoppingPrice;
          console.log(vm.cart);
          undateCart();
        })
      }

      function searchShopCart(){
        var data = {
          "api":"searchShopCart",
          "userId":loginUserData.userId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.cart = angular.fromJson(response.data);
            vm.productIdList = vm.cart.productIdList;
            for(var i=0;i<vm.productIdList.length;i++){
              vm.productIdList[i].productInfo.productColor = eval('('+vm.productIdList[i].productInfo.productColor+')');
              vm.productIdList[i].productInfo.productVersion = eval('('+vm.productIdList[i].productInfo.productVersion+')');
              vm.productIdList[i].num = parseInt(vm.productIdList[i].num);
            }
            console.log(vm.productIdList);
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      function undateCart(){
        var data = {
          "api":"updateShopCart",
          "userId":loginUserData.userId,
          "productIdList":angular.toJson(vm.productIdList)
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            console.log(response.msg);
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      

      function productSelect(id,num){
        vm.check_proNum = 0;
        vm.check_proPrice = 0;
        console.log(vm.proList);
        for(var i= 0;i<vm.proList.length;i++){
          vm.check_proNum = vm.check_proNum+vm.proList[i].num;
          vm.check_proPrice = vm.check_proPrice +vm.proList[i].num * vm.proList[i].productInfo.productPrice;
        }
        console.log(vm.check_proNum);
      }

      function productSelectAll(id,num){;
        console.log(vm.all);
        if(vm.all){
          vm.proList = angular.copy(vm.productIdList);
          vm.check_proNum = 0;
          vm.check_proPrice = 0;
          console.log(vm.proList);
          for(var i= 0;i<vm.proList.length;i++){
            vm.check_proNum = vm.check_proNum+vm.proList[i].num;
            vm.check_proPrice = vm.check_proPrice +vm.proList[i].num * vm.proList[i].productInfo.productPrice;
          }
        }else{
          vm.proList = '';
          vm.check_proNum = 0;
          vm.check_proPrice = 0;
        }
        console.log(vm.proList);
      }

      function settlement(){
        if(!vm.proList){
          serviceAlert('请选中一件商品');
          return;
        }
        $state.go('cartContent.getOrderInfo',{'productIdList':angular.toJson(vm.proList)});
      }
    }
})()
