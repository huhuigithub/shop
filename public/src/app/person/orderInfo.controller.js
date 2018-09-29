(function(){
  angular
    .module('person')
    .controller('orderInfoController',orderInfoController)

    function orderInfoController($scope,$stateParams,$state,timeNow,service,serviceAlert,serviceConfirm){
      var vm = this;

      vm.deleteOrder = deleteOrder;//删除订单
      vm.cancelOrder = cancelOrder;//删除订单

      var loginUserData = localStorage.getItem("loginUserData");
      loginUserData = angular.fromJson(loginUserData);


      activate();

      function activate(){
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
          }else{
            serviceAlert(response.msg);
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

      function cancelOrder(){
        var data = {
          "api":"updateOrderState",
          "orderId":$stateParams.orderId,
          "orderState":'-1'//0.待发货 1.待收货 2.待评价--完成 -1.已取消 3.已评价
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
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
