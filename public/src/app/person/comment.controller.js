(function(){
  angular
    .module('person')
    .controller('commentController',commentController)

    function commentController($scope,$stateParams,$filter,$state,timeNow,service,serviceAlert,serviceConfirm){
      var vm = this;

      var loginUserData = localStorage.getItem("loginUserData");
      loginUserData = angular.fromJson(loginUserData);
      vm.productId = $stateParams.productId;
      vm.orderId = $stateParams.orderId;


      vm.commentOrder = commentOrder;//订单评价

      // 评论星星
      $scope.max = 5;  
      $scope.ratingVal = 0;  
      $scope.readonly = false;  
      $scope.onHover = function(val){  
        $scope.hoverVal = val;  
      };  
      $scope.onLeave = function(){  
        $scope.hoverVal = null;  
      }  
      $scope.onChange = function(val){  
        $scope.ratingVal = val;  
      }  

      activate();

      function activate(){
        // deleteOrder();
        searchOrderById();

      }

      function searchOrderById(){
        var data = {
          "api":"searchOrderById",
          "orderId":$stateParams.orderId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.order = angular.fromJson(response.data);
            vm.orderState = vm.order.orderState;
            console.log(vm.order);
            var pro = vm.order.orderProductIdList;
            console.log(pro);
            for(var i=0;i<pro.length;i++){
              if(pro[i].productId==vm.productId){
                vm.product = pro[i];
                vm.kindId = vm.product.productInfo.kindId;
                console.log(vm.kindId);
                searchProductComment();
                break;
              }
            }
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      function commentOrder(){
        var params1 = {
          "productName":vm.product.productInfo.productName,
          "ver1":vm.product.productInfo.productVersion.ver1,
          "ver2":vm.product.productInfo.productVersion.ver2,
          "color":vm.product.productInfo.productColor.color,
          "productPrice":vm.product.productInfo.productPrice
        }
        var data = {
          "api":"orderComment",
          "productId":vm.productId,
          "userId":loginUserData.userId,
          "userName":loginUserData.userName,
          "commentCon":vm.commentCon,
          "commentSource":$scope.ratingVal,
          "commentTime":$filter('date')(timeNow,'yyyy-MM-dd HH:mm:ss'),
          "commentImg1":vm.showImg,
          "commentImg2":params1,
          "kindId":vm.kindId,
          "orderId":vm.orderId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            $state.go('orderContent');
            serviceAlert(response.msg);
            // searchOrder();
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      $("#file0").change(function(){
        var that = this;
        var formData = new FormData();
        var file = document.getElementById("file0");
        formData.append('file',file.files[0]);
        console.log(formData.get('file'));
        vm.fileName = this.files[0].name;
        $.ajax({
           url: 'http://127.0.0.1:3200/upload',
          type: 'POST',
          data: formData,
          // async: false,
          cache: false,
          contentType: false,
          processData: false,
          success: function(data){
            // $(that).parent().next().next().attr("src", data.url) ;
            $("#img0").attr("src", data.url) ;
            vm.filePath = data.url;
            console.log(vm.fileName);
            uploadFile();
          }
        });
      });

      function uploadFile(index){
        if(!vm.fileName || !vm.filePath){
          return false;
        }
        var data = {
          "api":"uploadFile",
          "fileName" : vm.fileName,
          "filePath" : vm.filePath
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res == "1"){ 
            serviceAlert('上传成功！');
            console.log('success:',response);
            vm.showImg = "http://olau2z5k7.bkt.clouddn.com/"+vm.fileName;
            vm.fileName ='';
            vm.filePath ='';
          }else{
            // serviceAlert(response.msg);
          }       
        })
      }

      function searchProductComment(){
        var data = {
          "api":"searchProductComment",
          "productId":vm.productId,
          "kindId":vm.kindId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            console.log(response);
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      function deleteOrder(){
        var data = {
          "api":"deleteOrder"
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            console.log(response);
          }else{
            serviceAlert(response.msg);
          }
        })
      }




    }
})()
