(function() {
  'use strict';

  angular
    .module('mishop')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */

    function NavbarController($scope,$state,$interval,timeNow,service) {
      var vm = this;
      var getTask;//计时任务
      vm.signOut = signOut;//退出登录
      var loginAdminData = localStorage.getItem('loginAdminData');
      vm.loginAdminData = angular.fromJson(loginAdminData);
      // vm.permission = loginUserData;
      // console.log(loginUserData);
      activate();

      function activate(){
          queryTask();
      }

      function signOut(){
        var r=confirm('确定要退出吗？')
        if (r==true){
          localStorage.removeItem('loginAdminData');
          $state.go('login');
        }
      }

      function queryTask(){
      }

      getTask = $interval(function() { //每15分钟查询一次任务
        
      }, 90000);






    }
  }

})();
