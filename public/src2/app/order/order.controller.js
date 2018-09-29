(function(){
  angular
    .module('order')
    .controller('orderController',orderController)

    function orderController($scope,$state,timeNow,service,$filter,serviceAlert,serviceConfirm){
      var vm = this;

      // vm.cancelOrder = cancelOrder;//取消订单
      vm.shipmentOrder = shipmentOrder;//发货订单
      vm.searchOrder = searchOrder;//全部订单
      vm.searchOrderByState = searchOrderByState;//状态查询订单

      activate();

      function activate(){
        searchOrder();
      }

      function searchOrder(){
        var data = {
          "api":"searchOrder",
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.order = angular.fromJson(response.data);
            for(var i=0;i<vm.order.length;i++){
              vm.order[i].orderProductIdListLen = vm.order[i].orderProductIdList.length;
              vm.order[i].orderTime = $filter('date')(vm.order[i].orderTime, 'yyyy-MM-dd');
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
          "api":"searchOrderByState",
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
              vm.order[i].orderTime = $filter('date')(vm.order[i].orderTime, 'yyyy-MM-dd');
              // vm.order[i].orderAddress = eval('('+vm.order[i].orderAddress+')');
              // vm.order[i].orderAddress.area = eval('('+vm.order[i].orderAddress.area+')');
            }
            console.log(vm.order);
          }else{
            vm.order = '';
          }
        })
      }

      function shipmentOrder(orderId){
        serviceConfirm('是否发货',function(){
          var data = {
            "api":"updateOrderState",
            "orderId":orderId,
            "orderState":'1'//待收货状态-->发货
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
        })
      }

      function evaluationOrder(orderId){ 
        var data = {
          "api":"updateOrderState",
          "orderId":orderId,
          "orderState":'3',//0.待发货 1.待收货 2.待评价 -1.已取消 3.已评价--完成
          "orderEvaluation":'系统默认评价'
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
