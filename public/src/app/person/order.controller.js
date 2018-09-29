(function(){
  angular
    .module('person')
    .controller('orderController',orderController)

    function orderController($scope,$state,timeNow,service,serviceAlert,serviceConfirm){
      var vm = this;

      vm.deleteOrder = deleteOrder;//删除订单
      vm.changeOrder = changeOrder;//取消订单
      vm.searchOrder = searchOrder;//全部订单
      vm.searchOrderByState = searchOrderByState;//状态查询订单

      var loginUserData = localStorage.getItem("loginUserData");
      loginUserData = angular.fromJson(loginUserData);


      activate();

      function activate(){
        searchOrder()
      }

      function searchOrder(){
        var data = {
          "api":"searchOrderByuserId",
          "userId":loginUserData.userId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.order = angular.fromJson(response.data);
            var orderCommentState;
            for(var i=0;i<vm.order.length;i++){
              vm.order[i].orderProductIdListLen = vm.order[i].orderProductIdList.length;
              if(vm.order[i].orderState=='2'){
                for(var j=0;j<vm.order[i].orderProductIdList.length;j++){
                  if(!vm.order[i].orderProductIdList[j].commentState){
                    orderCommentState = false;
                    break;
                  }
                  if(vm.order[i].orderProductIdList[j].commentState!='1'){
                    orderCommentState = false;
                    break;
                  }
                  if(vm.order[i].orderProductIdList[j].commentState=='1'){
                    orderCommentState = true;
                  }
                }
              }
              if(orderCommentState){
                changeOrder(vm.order[i].orderId,'3');
              }
              // vm.order[i].orderAddress = eval('('+vm.order[i].orderAddress+')');
              // vm.order[i].orderAddress.area = eval('('+vm.order[i].orderAddress.area+')');
            }
            console.log(vm.order);
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      function searchOrderByState(orderState){
        var data = {
          "api":"searchOrderByStateAnduserId",
          "userId":loginUserData.userId,
          "orderState":orderState
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.order = angular.fromJson(response.data);
            for(var i=0;i<vm.order.length;i++){
              vm.order[i].orderProductIdListLen = vm.order[i].orderProductIdList.length;
              // vm.order[i].orderAddress = eval('('+vm.order[i].orderAddress+')');
              // vm.order[i].orderAddress.area = eval('('+vm.order[i].orderAddress.area+')');
            }
            console.log(vm.order);
          }else{
            vm.order = '';
          }
        })
      }

      function deleteOrder(orderId){
        var data = {
          "api":"deleteOrderById",
          "orderId":orderId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            searchOrder();
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      function changeOrder(orderId,state){
        var data = {
          "api":"updateOrderState",
          "orderId":orderId,
          "orderState":state//0.待发货 1.待收货 2.待评价 -1.已取消,-2 删除
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            searchOrder();
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      function init() {
        var optionsJson = {
            type: 'GET',
            url: 'app/components/header/header.json',
            dataType: "json",
            timeout: 30000
        };
        return optionsJson;
      }
    }
})()
