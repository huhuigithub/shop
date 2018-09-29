(function(){
  angular
    .module('person')
    .controller('personController',personController)

    function personController($scope,timeNow,service){
      var vm = this;

      vm.updateUserInfo = updateUserInfo;//基本信息修改
      vm.check = check;
      vm.phoneCheck = phoneCheck//手机号码验证
      vm.passwordCheck = passwordCheck; //原始密码验证
      vm.passwordKeyup = passwordKeyup; //原始密码输入时
      vm.passwordSubmit = passwordSubmit; //新密码提交

      var loginAdminData = localStorage.getItem("loginAdminData");
      vm.login = angular.fromJson(loginAdminData);
      loginAdminData = angular.fromJson(loginAdminData);
      vm.state = '1';

      if(!loginAdminData){
        serviceAlert('当前处于未登录状态，请先登录',function(){
          $state.go('login');
        })
      }



      activate();

      function activate(){
        userInfo();
      }

      function userInfo(){
        var data = {
          "api":"searchAdminById",
          "adminId":loginAdminData.adminId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.admin = response.admin[0];
            console.log(vm.admin);
            localStorage.setItem("loginAdminData", JSON.stringify(response.admin[0]));
            loginAdminData = localStorage.getItem("loginAdminData");
            loginAdminData = angular.fromJson(loginAdminData);
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      vm.phoneFormat = true;
      vm.phoneType = false;

      /** 手机号码重复检验 START */
      function phoneCheck(){
      vm.phoneFormat = true;
      vm.phoneType = false;
        if(!vm.user.userPhone){
          vm.phoneFormat = true;
          return false;
        }
        if(!(/^1[34578]\d{9}$/.test(vm.user.userPhone))){
          vm.phoneType = false;
          vm.phoneFormat = false;
          return false;
        }
        if(loginUserData.userPhone===vm.user.userPhone){
          return false;
        }
        vm.phoneFormat = true;
        var data = {
          api   : 'userCheckPhoneNum',
          userPhone : vm.user.userPhone
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

      // 基本信息修改
      function updateUserInfo(){
        if(vm.phoneType){
          return;
        }
        var data = {
          "api":"updateUserInfoById",
          "userId":loginUserData.userId,
          "userName":vm.user.userName,
          "userPhone":vm.user.userPhone,
          "realName":vm.user.realName,
          "userCreateTime":timeNow
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            serviceAlert(response.msg);
            userInfo();
          }else{
            serviceAlert(response.msg);
          }
        })
      }
      // 基本信息修改

      function check(state){
        vm.state = state;
      }

      vm.keyupDisabled = true; //密码框禁止输入状态
      vm.passwordCheckType = false;  //原始密码检查状态
      function passwordKeyup(){
        vm.keyupDisabled = true;
      }

      /** 原始密码验证 START*/
      function passwordCheck(){
        // console.log(!vm.oldpassword);
        if(!vm.oldpassword){
          return false;
        }
        var data = {
          "api":"checkAdminPswById",
          "adminId":loginAdminData.adminId,
          "oldPassword":vm.oldpassword
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data);
        return vm.promise.then(function(response) {
          if(response.res === '0'){
            vm.passwordCheckType = true;
          }
          if(response.res === '1'){
            vm.passwordCheckType = false;
            vm.keyupDisabled = false;
          }
        })  
      }
      /** 原始密码验证 END*/

      /** 密码修改提交 START */
      function passwordSubmit(){
        // serviceConfirm('确定要修改密码吗？',function(){
          var a = confirm('确定要修改密码吗？');
            if(a !== true){
              return false;
            }
          var data = {
          "api":"updateAdminPswById",
          "adminId":loginAdminData.adminId,
          "adminPassword":vm.password,
          "oldPassword":vm.oldpassword
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data);
          return vm.promise.then(function(response) {
            vm.oldpassword = '';
            vm.password = '';
            vm.passwordagain = '';
            $scope.form.$setPristine(); //清除表单输入记录
            $scope.form.$setUntouched();
            alert(response.msg);
          })
          // })
      }
      /** 密码修改提交 END */
    }
})()
