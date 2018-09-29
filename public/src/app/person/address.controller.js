(function(){
  'use strict'

  angular
    .module('person')
    .controller('addressController',addressController)

    function addressController($scope,$cookies,timeNow,$state,service,$stateParams,serviceAlert,serviceConfirm){
      var vm = this;
      vm.areaSelect = areaSelect;
      vm.addSave = addSave; //地址添加保存
      vm.addUpdateSave = addUpdateSave; //地址修改保存
      vm.addressAdd = addressAdd; //地址添加点击
      vm.addUpdate = addUpdate;  //地址修改点击
      vm.addDelete = addDelete //地址删除
      vm.addDefault = addDefault //地址默认
      vm.addSelect = addSelect //地址选择
      vm.addDelete = addDelete //地址删除
      vm.closeAddBox = closeAddBox;

      var loginUserData = localStorage.getItem("loginUserData");
      loginUserData = angular.fromJson(loginUserData);
      console.log(loginUserData);
      vm.addressList = [];

      activate();

      function activate(){
        country();
        userInfo();
      }

      function country(){
        // vm.waitType = true; //等待界面是否显示
        var response = init();
        response.success = function (data) {
          vm.countryData = angular.fromJson(data);
        };
        response.error = function (XMLHttpRequest, textStatus, errorThrown) {
        };
        $.ajax(response);
      }

      function init() {
        var optionsJson = {
            type: 'GET',
            url: 'app/json/country.json',
            dataType: "json",
            timeout: 30000
        };
        return optionsJson;
      }
      function areaSelect(){
        console.log(vm.address);
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
            console.log(vm.addressList);
            localStorage.setItem("loginUserData", JSON.stringify(response.user[0]));
            loginUserData = localStorage.getItem("loginUserData");
            loginUserData = angular.fromJson(loginUserData);
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      function addChange(){

      }

      function addressAdd(){
        vm.boxType = true;
        vm.personName = '';
        vm.address = '';
        vm.detailedAdd = '';
        vm.personPhone = '';
        $scope.form.$setPristine(); //清除表单输入记录
        $scope.form.$setUntouched();
      }
      function closeAddBox(){
        vm.boxType = false;
        vm.addId = '';
        
      }
      /** 地址添加保存 */
      function addSave(){
        vm.shipAddress = {
          "consignee":vm.personName,
          "area":vm.address,
          "detailedAdd":vm.detailedAdd,
          "phone":vm.personPhone,
          "default":'0',
          "select":'0',
          "id":timeNow
        }
        var hasAdd = false;
        for(var i=0;i<vm.addressList.length;i++){
          if(vm.addressList[i].id==vm.addId){
            hasAdd = true;
            break;
          }
        }
        if(!hasAdd){
          vm.addressList.push(vm.shipAddress);
        }

        var data = {
          "api":"updateUserAddressById",
          "userId":loginUserData.userId,
          "userAddress":angular.toJson(vm.addressList)
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            serviceAlert(response.msg);
            vm.boxType = false;
            userInfo();
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      /** 地址编辑点击 */
      function addUpdate(id){
        vm.addId = id;
        console.log(vm.addId);
        console.log(vm.addressList);
        vm.boxType = true;
        for(var i=0;i<vm.addressList.length;i++){
          if(vm.addressList[i].id==id){
            vm.personName = vm.addressList[i].consignee;
            vm.address = vm.addressList[i].area;
            vm.detailedAdd = vm.addressList[i].detailedAdd;
            vm.personPhone = vm.addressList[i].phone;
            vm.default = vm.addressList[i].default;
            vm.select = vm.addressList[i].select;
            break;
          }
        }
      }

      /** 地址编辑保存 */
      function addUpdateSave(){
        console.log(vm.addId);
        vm.shipAddress = {
          "consignee":vm.personName,
          "area":vm.address,
          "detailedAdd":vm.detailedAdd,
          "phone":vm.personPhone,
          "default":vm.default,
          "select":vm.select,
          "id":vm.addId
        }
        for(var i=0;i<vm.addressList.length;i++){
          if(vm.addressList[i].id==vm.addId){
            vm.addressList[i] = vm.shipAddress;
            break;
          }
        }
        console.log(vm.addressList);
        var data = {
          "api":"updateUserAddressById",
          "userId":loginUserData.userId,
          "userAddress":angular.toJson(vm.addressList)
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.addId = '';
            $('#myModal').modal('hide');
            $scope.form.$setPristine(); //清除表单输入记录
            $scope.form.$setUntouched();
            serviceAlert('地址编辑成功！');
            userInfo();
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      /** 地址默认设置 */
      function addDefault(item){
        console.log(item);
        for(var i=0;i<vm.addressList.length;i++){
          if(vm.addressList[i].id==item.id){
            vm.addressList[i].default = '1';
            vm.addressList[i].select = '1';
          }else{
            vm.addressList[i].default = '0';
            vm.addressList[i].select = '0';
          }
        }
        console.log(vm.addressList);
        var data = {
          "api":"updateUserAddressById",
          "userId":loginUserData.userId,
          "userAddress":angular.toJson(vm.addressList)
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            // userInfo();
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      /** 地址选择 */
      function addSelect(item){
        console.log(item);
        for(var i=0;i<vm.addressList.length;i++){
          if(vm.addressList[i].id===item.id){
            vm.addressList[i].select = '1';
          }else{
            vm.addressList[i].select = '0';
          }
        }
        console.log(vm.addressList);
        var data = {
          "api":"updateUserAddressById",
          "userId":loginUserData.userId,
          "userAddress":angular.toJson(vm.addressList)
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            // userInfo();
          }else{
            serviceAlert(response.msg);
          }
        })
      } 

      /** 地址删除 */
      function addDelete(addId){
        serviceConfirm('您确定要删除该收货地址吗?', function () {
          console.log(vm.addressList);
          console.log(addId);
          for(var i=0;i<vm.addressList.length;i++){
            console.log(vm.addressList[i].id);
            if(vm.addressList[i].id==addId){
              vm.addressList.splice(i,1);
              break;
            }
          }
          console.log(vm.addressList);
          var data = {
            "api":"updateUserAddressById",
            "userId":loginUserData.userId,
            "userAddress":angular.toJson(vm.addressList)
          };
          console.log(data);
          var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
          vm.promise = service.getData(data,URL);
          return vm.promise.then(function(response) {
            if(response.res === '1'){
              vm.addId = '';
              $scope.form.$setPristine(); //清除表单输入记录
              $scope.form.$setUntouched();
              userInfo();
            }else{
              serviceAlert(response.msg);
            }
          })
        })
      }
    }
})()
