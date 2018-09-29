(function(){
  angular
    .module('admin')
    .controller('createAdminController',createAdminController)

    function createAdminController($scope,$state,timeNow,service,$filter){
      var vm = this;
      vm.createAdmin = createAdmin;
      vm.phoneCheck = phoneCheck;
      activate();

      function activate(){
      }


      function createAdmin(){
        var data = {
          "api":"createAdmin",
          "adminName":vm.name,
          "adminPhone":vm.phone,
          "adminPassword":vm.password,
          "adminRole":vm.role,
          "adminCreateTime": $filter('date')(timeNow, 'yyyy-MM-dd hh:mm:ss')
        }
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            console.log(response);
            localStorage.setItem("loginUserData",JSON.stringify(response.userInfo));//保存登录用户信息
            $state.go('adminContent');
          }else{
            serviceAlert(data.msg);
          }
        })
      }

      /** 手机号码重复检验 START */
      vm.phoneType = false;
      function phoneCheck(){
        if(!(/^1[34578]\d{9}$/.test(vm.phone))){
          vm.phoneType = false;
          return false;
        }
        var data = {
          api   : 'checkPhoneNum',
          adminPhone : vm.phone,
          q:{
            a:'1',
            b:'2',
            c:'3'
          }
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
