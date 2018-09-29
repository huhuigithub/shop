(function(){
  angular
    .module('buy')
    .controller('buytvController',buytvController)

    function buytvController($scope,$state,$document,$window,$stateParams,$cookies,timeNow,service,serviceAlert){
      var vm = this;

      var loginUserData = localStorage.getItem("loginUserData");
      loginUserData = angular.fromJson(loginUserData);

      vm.selectProduct = selectProduct;
      vm.selectVersion = selectVersion;
      vm.selectProductBuy = selectProductBuy;
      vm.buyShop = buyShop;
      vm.check = check;
      vm.state = '1';
      activate();

      function activate(){
        $($window).scrollTop(0);
        getProductName();
        searchProductComment();
      }

      //页面离开事件
      $scope.$on("$destroy", function(){
        $cookies.remove('phoneName');
      });

      function check(state){
        vm.state = state;
      }

      function searchProductComment(){
        var data = {
          "api":"searchProductComment",
          "productId":vm.productId,
          "kindId":$stateParams.kindId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.comment = response.data;
            vm.comLen = vm.comment.length;
            for(var i=0;i<vm.comment.length;i++){
              vm.comment[i].commentImg2 = eval('('+vm.comment[i].commentImg2+')');
            }
            console.log(vm.comment);
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      /** 商品名称查询 */
      function getProductName(){
        var data = {
          "api":"getProductKindByType",
          "productType":'电视'
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var productKindlist = response.productKindlist;
            vm.productKindlist = angular.fromJson(productKindlist);
            console.log(vm.productKindlist);
            selectProductKind();
          }else{
            vm.productKindlist = productKindlist;
            serviceAlert(response.msg);
          }
        })
      }

      //数组参数转字符串
      function forstr(data){
        if(!data){
          return;
        }
        var data1;
        if(typeof(data[0])==="object"){
          data1 = data.join('\n*');
          data1 = data1.replace(/,/g,"\n");
        }else{
          data1 = data.join('\n');
        }
        return data1; 
      }

      function selectProductKind(productId,productName){
        // $cookies.put('phoneName', productName);
        vm.choseColor = '';
        var data = {
          "api":"searchProductKindById",
          "kindId":$stateParams.kindId
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var productKind = response.productKind[0];
            vm.productKind = angular.fromJson(productKind);
            vm.productName = vm.productKind.productName;
            vm.productType = vm.productKind.productType;
            vm.showImg = vm.productKind.productImg;
            selectProduct(vm.productName);
          }else{
            vm.productKind = productKind;
            serviceAlert(response.msg);
          }
        })
      }

      function selectProduct(productName){
        var data = {
          "api":"searchProductVersionByName",
          "productName":productName
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var productList = response.productList;
            vm.productList = angular.fromJson(productList);
            vm.version = dealArr(vm.productList);
            console.log(vm.version);
            selectVersion(vm.version[0],0);
          }else{
            vm.productList = '';
            serviceAlert(response.msg);
          }
        })
      }

      function unique(arr){
        // 遍历arr，把元素分别放入tmp数组(不存在才放)
        var tmp = new Array();
        for(var i=0;i<arr.length;i++){
          var tmp2 = tmp.join('*');
          //该元素在tmp内部不存在才允许追加
          if(tmp2.indexOf(arr[i])<0){
              tmp.push(arr[i]);
          }
        }
        return tmp;
      }

      function dealArr(arr){
        var tmp = new Array();
        for(var i in arr){
          tmp.push(arr[i].ProductVersion);
        }
        var tmp2 = unique(tmp);
        tmp2 = evalArr(tmp2);
        return tmp2;
      }

      function evalArr(arr){
        var tmp = new Array();
        for(var i in arr){
          tmp.push(eval('('+arr[i]+')'));
        }
        return tmp;
      }
  

      function selectVersion(version,index){
        console.log();
        vm.chosedIndex = index;
        vm.colorIndex = -1;
        var data = {
          "api":"searchProductByVersion",
          "productVersion":version,
          "productName":vm.productName
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.product = angular.fromJson(response.product);
            for(var i in vm.product){
              vm.product[i].productColor = eval('('+vm.product[i].productColor+')');
              vm.product[i].productVersion = eval('('+vm.product[i].productVersion+')');
              vm.product[i].productData = eval('('+vm.product[i].productData+')');
            }
            vm.configuration = vm.product[0].productData.配置;
            vm.weightSize = vm.product[0].productData.屏幕;
            vm.screen = vm.product[0].productData.重量与尺寸;
            vm.simCard = vm.product[0].productData.网络;
            vm.api = vm.product[0].productData.外设接口;
            vm.playPower = vm.product[0].productData.影音播放性能;
            vm.packingList = vm.product[0].productData.包装清单;
            vm.accessoriesList = vm.product[0].productData.配件盒清单;
            selectProductBuy(vm.product[0],0);
          }else{
            vm.product = '';
            serviceAlert(response.msg);
          }
        })
      }

      function selectProductBuy(data,index){
        vm.productId = data.productId;
        vm.productImg = data.productImg;
        vm.colorIndex = index;
        vm.checkProduct = data;
        // var data = {
        //   "api":"searchProductByName",
        //   "RAM":vm.RAM,
        //   "ROM":vm.ROM,
        //   "productColor":color
        // };
        // var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        // vm.promise = service.getData(data,URL);
        // return vm.promise.then(function(response) {
        //   if(response.res === '1'){
        //     var productKindlist = response.productKindlist;
        //     vm.productKindlist = angular.fromJson(productKindlist);
        //     console.log(vm.productKindlist);
        //   }else{
        //     vm.productKindlist = productKindlist;
        //     serviceAlert(response.msg);
        //   }
        // })
      }

      function buyShop(){
      vm.productIdList = [];
        var productId = {
          productId:vm.productId,
          num:'1'
        }
        vm.productIdList.push(productId);
        var data = {
          "api":"buyShopCart",
          "userId":loginUserData.userId,
          "productIdList":angular.toJson(vm.productIdList)
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            $state.go('cartContent');
          }else{
            serviceAlert(response.msg);
          }
        })
      }

    }
})()
