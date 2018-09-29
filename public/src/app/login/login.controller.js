(function(){
  'use strict'

  angular
    .module('mishop')
    .controller('LoginController',LoginController)

    function LoginController($scope,$location,$cookies,timeNow,$state,service,$stateParams,serviceAlert,serviceConfirm){
      var vm = this;

      vm.userLogin = userLogin //用户登录

      vm.remember = true; //记住登录状态

      activate();

      function activate(){
        cookie();
        vm.errorType = false; //提示框显示状态
        vm.waitType = false;  //等待遮罩层显示状态
      }

      /** 页面加载检查是否有cookies */
      function cookie(){
        if ($cookies.get('rmbUser')=='true') {
          vm.username = $cookies.get('userPhone');
        }
      }

    /** 登录按钮click; */
      function userLogin(){
        var data = {
          "api" :"userLogin",
          "userPhone":vm.username,
          "userPassword":vm.password
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var userInfo = response.userInfo;
            vm.userInfo = angular.fromJson(userInfo);
            console.log(vm.userInfo);
            localStorage.setItem("loginUserData",JSON.stringify(vm.userInfo));
            $state.go('indexContent');
            $cookies.put('userId', response.userId, { expires: expireDate });
            if (vm.remember) {
              console.log(vm.remember);
              var userPhone = vm.username;
              var expireDate = new Date();
              expireDate.setDate(expireDate.getDate() + 30);
              $cookies.put('rmbUser', 'true', { expires: expireDate });
              $cookies.put('userPhone', userPhone, { expires: expireDate });
            } else {
              $cookies.remove('rmbUser');
              $cookies.remove('userPhone');
            }
          }else{
            serviceAlert(response.msg)
          }
        })
      }

   }

})()