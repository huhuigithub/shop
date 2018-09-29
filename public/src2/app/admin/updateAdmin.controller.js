(function(){
  angular
    .module('admin')
    .controller('updateAdminController',updateAdminController)

    function updateAdminController($scope,$state,$stateParams,timeNow,serviceAlert,service){
      var vm = this;

      vm.updateAdmin = updateAdmin;
      vm.pswReset = pswReset;
      vm.changeStatus = changeStatus;

      var loginAdminData = localStorage.getItem("loginAdminData");
      loginAdminData = angular.fromJson(loginAdminData);

      vm.adminId = $stateParams.adminId;

      activate();

      function activate(){
        adminInfo();
      }

      /** 加载admin信息; */
      function adminInfo(){
        var data = {
          api : 'searchAdminById',
          adminId:vm.adminId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var admin = response.admin;
            vm.adminInfo = angular.fromJson(admin[0]);
            console.log(vm.adminInfo);
            vm.name = vm.adminInfo.adminName;
            vm.phone = vm.adminInfo.adminPhone;
            vm.role = vm.adminInfo.adminRole;
            vm.adminStatus = vm.adminInfo.adminStatus;
            vm.createTime = vm.adminInfo.adminCreateTime;
          }
        })
      }
      function updateAdmin(){
        var data = {
          "api":"updateAdmin",
          "adminId":vm.adminId,
          "adminName":vm.name,
          "adminPhone":vm.phone,
          "adminRole":vm.role,
          "adminStatus":vm.adminInfo.adminStatus,
          "adminCreateTime": vm.createTime
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            console.log(response);
            $state.go('adminContent');
          }
        })
      }

      function pswReset(){
        var data = {
          "api":"resetAdminPassword",
          "adminId":vm.adminId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            console.log(response);
            $state.go('adminContent');
          }
        })
      }

      function changeStatus(status){
        if(vm.adminId===loginAdminData.adminId){
          serviceAlert('管理员无法更改自身状态');
          return;
        }
        vm.adminStatus = status;
        var data = {
          "api":"updateAdminStatus",
          "adminId":vm.adminId,
          "adminStatus": vm.adminStatus,
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            console.log(response);
            $state.go('adminContent');
          }
        })
      }

    }
})()
