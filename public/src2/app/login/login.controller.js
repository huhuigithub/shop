(function(){
  'use strict'

  angular
    .module('mishop')
    .controller('LoginController',LoginController)

    function LoginController($scope,service,$location,$cookies,timeNow,$state,$stateParams,serviceAlert){
      var vm = this;

      vm.login = login //用户登录

      vm.remember = true; //记住登录状态

      activate();

      function activate(){
        console.log('admin');
        cookie();
        vm.errorType = false; //提示框显示状态
        vm.waitType = false;  //等待遮罩层显示状态
      }

      /** 页面加载检查是否有cookies */
      function cookie(){
        if ($cookies.get('rmbUser')=='true') {
          vm.name = $cookies.get('adminPhone');
        }
      }

      /** 登录按钮click; */
      function login(){
        var data = {
          "api":"adminLogin",
          "adminPhone":vm.name,
          "adminPassword":vm.password
        }
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            console.log(response);
            localStorage.setItem("loginAdminData",JSON.stringify(response.adminInfo));//保存登录用户信息
            $state.go('usersContent');

            $cookies.put('adminId', response.adminId, { expires: expireDate });
            if (vm.remember) {
              console.log(vm.remember);
              var adminPhone = vm.name;
              var expireDate = new Date();
              expireDate.setDate(expireDate.getDate() + 30);
              $cookies.put('rmbUser', 'true', { expires: expireDate });
              $cookies.put('adminPhone', adminPhone, { expires: expireDate });
            } else {
              $cookies.remove('rmbUser');
              $cookies.remove('adminPhone');
            }
          }else{
            serviceAlert(response.msg);
          }
        })
      }

   }

})()