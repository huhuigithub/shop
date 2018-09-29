(function(){
  angular
    .module('admin')
    .controller('adminController',adminController)

    function adminController($scope,timeNow,service){
      var vm = this;
      vm.deleteAdminById = deleteAdminById;
      activate();

      function activate(){
        adminList();
      }

      /** 登录按钮click; */
      function adminList(){
        var data = {
          api :'searchAdmin'
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var admin = response.admin;
            vm.adminlist = angular.fromJson(admin);
            console.log(vm.adminlist);
          }
        })
      }

      function deleteAdminById(adminId){
        var data = {
          api :'deleteAdminById',
          adminId:adminId
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            adminList();
          }
        })
      }
    }
})()
