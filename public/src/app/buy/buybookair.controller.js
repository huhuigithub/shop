(function(){
  angular
    .module('buy')
    .controller('buybookairController',buybookairController)

    function buybookairController($scope,$state,$document,$window,$stateParams,$cookies,timeNow,service,serviceAlert){
      var vm = this;

      vm.selectProductKind = selectProductKind;
      vm.selectVersion = selectVersion;
      vm.selectProductBuy = selectProductBuy;
      vm.buyShop = buyShop;
      vm.check = check;
      var loginUserData = localStorage.getItem("loginUserData");
      loginUserData = angular.fromJson(loginUserData);
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
          "productType":'笔记本'
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var productKindlist = response.productKindlist;
            vm.productKindlist = angular.fromJson(productKindlist);
            if($cookies.get('phoneName')!==''&& $cookies.get('phoneName')){
              vm.productName = $cookies.get('phoneName');
              $cookies.remove('phoneName');
              console.log(vm.productName);
            }else{
              vm.productName = vm.productKindlist[0].productName;
            }
            console.log(vm.productKindlist);
            selectProductKind(vm.productId,vm.productName);
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
            vm.productInfo = eval('(' + vm.productKind.productInfo + ')');
            console.log(vm.productInfo);
            vm.choseRAM = vm.productInfo.RAM;
            vm.choseROM = vm.productInfo.ROM;
            vm.choseColor = vm.productInfo.颜色;
            vm.configuration = vm.productInfo.配置;
            vm.weightSize = vm.productInfo.重量与尺寸;
            console.log(vm.weightSize);
            vm.charginge = vm.productInfo.续航与快充;
            vm.camera = vm.productInfo.拍照与摄像;
            vm.screen = vm.productInfo.屏幕;
            vm.simCard = vm.productInfo.网络;
            vm.battery = vm.productInfo.电池电源;
            vm.navigation = vm.productInfo.导航定位;
            vm.sensors = vm.productInfo.感应器;
            vm.video = vm.productInfo.视频;
            vm.audio = vm.productInfo.音频;
            vm.api = vm.productInfo.外设接口;
            vm.system = vm.productInfo.操作系统;
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
        // vm.colorIndex = -1;
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
            for(i in vm.product){
              vm.product[i].productColor = eval('('+vm.product[i].productColor+')');
              vm.product[i].productVersion = eval('('+vm.product[i].productVersion+')');
            }
            console.log(vm.product);
            selectProductBuy(vm.product[0],0);
          }else{
            vm.product = '';
            serviceAlert(response.msg);
          }
        })
      }

      function selectProductBuy(data,index){
        console.log(data);
        vm.productId = data.productId;
        vm.productImg = data.productImg;
        vm.colorIndex = index;
        vm.checkProduct = data;
      }


      function buyShop(){
        if(!loginUserData){
          serviceAlert('当前处于未登录状态，请先登录',function(){
            $state.go('login');
          })
          return;
        }
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
