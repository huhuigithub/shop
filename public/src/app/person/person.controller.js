(function(){
  'use strict'

  angular
   .module('person')
   .controller('PersonController',PersonController)

    function PersonController($scope,$cookies,timeNow,$state,$filter,service,$stateParams,serviceAlert,serviceConfirm){
      var vm = this;

      vm.updateUserInfo = updateUserInfo;//基本信息修改
      vm.check = check;
      vm.phoneCheck = phoneCheck//手机号码验证
      vm.passwordCheck = passwordCheck; //原始密码验证
      vm.passwordKeyup = passwordKeyup; //原始密码输入时
      vm.passwordSubmit = passwordSubmit; //新密码提交

      var loginUserData = localStorage.getItem("loginUserData");
      vm.login = angular.fromJson(loginUserData);
      loginUserData = angular.fromJson(loginUserData);
      vm.state = '1';

      if(!loginUserData){
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
          "api":"searchUserById",
          "userId":loginUserData.userId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.user = response.user[0];
            vm.addressList = eval('('+vm.user.userAddress+')');
            console.log(vm.user);
            localStorage.setItem("loginUserData", JSON.stringify(response.user[0]));
            loginUserData = localStorage.getItem("loginUserData");
            loginUserData = angular.fromJson(loginUserData);
            vm.showImg = loginUserData.userImg;
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
          "api":"checkUserPswById",
          "userId":loginUserData.userId,
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
          "api":"updateUserPswById",
          "userId":loginUserData.userId,
          "oldPassword":vm.oldpassword,
          "userPassword":vm.password
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
            userImgSubmit();
          }else{
            serviceAlert(response.msg);
          }       
        })
      }

      /** 头像修改提交 START */
      function userImgSubmit(){
          var data = {
          "api":"updateUserImgById",
          "userId":loginUserData.userId,
          "userImg":vm.showImg
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data);
          return vm.promise.then(function(response) {
            serviceAlert(response.msg);
            userInfo();
          })
      }
      /** 头像修改提交 END */


    }
})()
