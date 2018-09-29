(function(){
  angular
    .module('users')
    .controller('usersController',usersController)

    function usersController($scope,service,$location,$cookies,timeNow,$state,$stateParams){
      var vm = this;

      vm.changeStatus = changeStatus;
      vm.deleteUserById = deleteUserById;

      activate();

      function activate(){
        usersList();
      }

      /** 用户数据 */
      function usersList(){
        var data = {
          "api":"searchUsers"
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.users = angular.fromJson(response.users);
            console.log(vm.users);
          }
        })
      }

      function changeStatus(status,userId){
        vm.userStatus = status;
        var data = {
          "api":"updateUserStatus",
          "userId":userId,
          "userStatus": vm.userStatus,
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            console.log(response);
            usersList();
          }
        })
      }

      function deleteUserById(userId){
        var data = {
          "api" :"deleteUserById",
          "userId":userId
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            usersList();
          }
        })
      }

    }
})()
