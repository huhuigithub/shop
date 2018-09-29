(function(){
  'use strict'

  angular
    .module('mishop')
    .directive('header',header)
    .directive('topbar',topbar)
    .directive('header2',header2)
    .directive('star',star)

  function header(){
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/header/header.html',
      scope: {},
      controller: controller,
      controllerAs: 'vm',
      bindToController: true
    }

    return directive;

    function controller($location,$scope,$state,serviceAlert,serviceConfirm){
      var vm = this;
      vm.signOut = signOut;//退出登录

      vm.show1 = false;
      vm.show2 = false;
      vm.show3 = false;
      vm.show4 = false;

      activate()

      function activate(){
        var loginAdminData = localStorage.getItem("loginAdminData");
        if(!loginAdminData){
          serviceAlert('当前处于未登录状态，请先登录',function(){
            $state.go('login');
          })
        }
        console.log($location.url());
        if($location.url()==='/mi_index'){
          vm.site_category_list = 'site-category-list2';
          vm.site_category = 'site-category2';
        }
        header_nav();
      }


      function header_nav(){
        // vm.waitType = true; //等待界面是否显示
        var response = init();
        response.success = function (data) {
          vm.miphone = angular.fromJson(data.miphone);
          vm.hongmiphone = angular.fromJson(data.hongmiphone);
          console.log(vm.miphone);
        };
        response.error = function (XMLHttpRequest, textStatus, errorThrown) {
            
        };
        $.ajax(response);
      }

      function init() {
        var optionsJson = {
            type: 'GET',
            url: 'app/components/header/header.json',
            dataType: "json",
            timeout: 30000
        };
        return optionsJson;
      }

      function signOut(){
        serviceConfirm('确定要退出吗？',function(){
          localStorage.removeItem("loginUserData");
          $state.go('login');
        })
      }

    }
  }

  function topbar(){
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/header/topbar.html',
      scope: {},
      controller: controller,
      controllerAs: 'vm',
      bindToController: true
    }

    return directive;

    function controller($scope,$state,serviceAlert,serviceConfirm){
      var vm = this;
      vm.signOut = signOut;//退出登录
      activate()

      function activate(){
        var loginAdminData = localStorage.getItem("loginAdminData");
        if(!loginAdminData){
          serviceAlert('当前处于未登录状态，请先登录',function(){
            $state.go('login');
          })
        }
      }

      function signOut(){
        serviceConfirm('确定要退出吗？',function(){
            localStorage.removeItem("loginAdminData");
            $state.go('login');
        })
      }
    }
  }

  function header2(){
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/header/header2.html',
      scope: {},
      controller: controller,
      controllerAs: 'vm',
      bindToController: true
    }

    return directive;
    function controller($location,$scope,$state,serviceAlert,serviceConfirm){
      var vm = this;

      activate();

      function activate(){
        var loginAdminData = localStorage.getItem("loginAdminData");
        if(!loginAdminData){
          serviceAlert('当前处于未登录状态，请先登录',function(){
            $state.go('login');
          })
        }
        console.log($location.url());
        if($location.url()==='/micart'){
          vm.h2 = true;
        }else{
          vm.h2 = false;
        }
      }
    }
    
  }
  function star(){
     return {  
        template: '<ul class="rating" ng-mouseleave="leave()">' +  
            '<li ng-repeat="star in stars" ng-class="star" ng-click="click($index + 1)" ng-mouseover="over($index + 1)">' +  
            '\u2605' +  
            '</li>' +  
            '</ul>',  
        scope: {  
          ratingValue: '=',  
          max: '=',  
          readonly: '@',  
          onHover: '=',  
          onLeave: '='  
        },  
        controller: function($scope){  
          $scope.ratingValue = $scope.ratingValue || 0;  
          $scope.max = $scope.max || 5;  
          $scope.click = function(val){  
            if ($scope.readonly && $scope.readonly === 'true') {  
              return;  
            }  
            $scope.ratingValue = val;  
          };  
          $scope.over = function(val){  
            $scope.onHover(val);  
          };  
          $scope.leave = function(){  
            $scope.onLeave();  
          }  
        },  
        link: function (scope, elem, attrs) {  
          elem.css("text-align", "center");  
          var updateStars = function () {  
            scope.stars = [];  
            for (var i = 0; i < scope.max; i++) {  
              scope.stars.push({  
                filled: i < scope.ratingValue  
              });  
            }  
          };  
          updateStars();  
       
          scope.$watch('ratingValue', function (oldVal, newVal) {  
            if (oldVal) {  
              updateStars();  
            }  
          });  
          scope.$watch('max', function (oldVal, newVal) {  
            if (newVal) {  
              updateStars();  
            }  
          });  
        }  
      };  
    }


})()
