(function(){
  'use strict'

  angular
    .module('mishop')
    .controller('registerController',registerController)

    function registerController($scope,$location,$filter,$cookies,timeNow,$state,service,$stateParams,serviceAlert,serviceConfirm){
      var vm = this;

      vm.createUser = createUser;
      vm.phoneCheck = phoneCheck;
      vm.phoneKeyup = phoneKeyup;
      vm.nameCheck = nameCheck;

      activate();

      function activate(){
        vm.errorType = false; //提示框显示状态
        vm.waitType = false;  //等待遮罩层显示状态
      }


      function createUser(){
        var data = {
          "api":"createUser",
          "userName":vm.name,
          "userPhone":vm.phone,
          "userPassword":vm.password,
          "userCreateTime": $filter('date')(timeNow, 'yyyy-MM-dd hh:mm:ss')
        }
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            console.log(response);
            localStorage.setItem("loginUserData",JSON.stringify(response.userInfo));//保存登录用户信息
            serviceAlert('注册完成');
            $state.go('login');
          }else{
            serviceAlert(data.msg);
          }
        })
      }

      /** 用户名重复检验 START */
      vm.nameType = false;
      function nameCheck(){
        if(!vm.name){
          return false;
        }
        var data = {
          api   : 'userCheckName',
          userName : vm.name
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.nameType = false;
          }else{
            vm.nameType = true;
          }
        })
      }
      /** 手机号码重复检验 END */


      function phoneKeyup(){
        vm.phoneType = false;
        if(!vm.phone){
          vm.phoneFormat = true;
          return;
        }
        if(!(/^1[34578]\d{9}$/.test(vm.phone))){
          vm.phoneType = false;
          vm.phoneFormat = false;
          return false;
        }
        vm.phoneFormat = true;
      }

      /** 手机号码重复检验 START */
      vm.phoneFormat = true;
      vm.phoneType = false;
      function phoneCheck(){
        vm.phoneType = false;
        if(!vm.phone){
          vm.phoneFormat = true;
          return false;
        }
        if(!(/^1[34578]\d{9}$/.test(vm.phone))){
          vm.phoneType = false;
          vm.phoneFormat = false;
          return false;
        }
        vm.phoneFormat = true;
        var data = {
          api   : 'userCheckPhoneNum',
          userPhone : vm.phone
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.phoneType = false;
          }else{
            vm.phoneType = true;
          }
        })
      }
      /** 手机号码重复检验 END */

   }

})()