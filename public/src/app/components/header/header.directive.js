(function(){
  'use strict'

  angular
    .module('mishop')
    .directive('header',header)
    .directive('topbar',topbar)
    .directive('header2',header2)
    .directive('star',star)
    .directive('starshow',starshow)
    .directive('scroll',scroll)

  function scroll($window,$cookies){
    return function(scope, element, attrs) {
      angular.element($window).bind("scroll", function() {
        if (this.pageYOffset > 0) {
          $cookies.put('scrollTop', this.pageYOffset);
        } else {
          $cookies.put('scrollTop',0);
        }
          scope.$apply();
      });
    };
  }

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

    function controller($location,$window,$cookies,$scope,service,$stateParams,$state,serviceAlert,serviceConfirm){
      var vm = this;
      vm.signOut = signOut;//退出登录
      vm.buyProduct = buyProduct;
      vm.buyPhone = buyPhone;
      vm.searchProduct = searchProduct;

      vm.show1 = false;
      vm.show2 = false;
      vm.show3 = false;
      vm.show4 = false;

      activate()

      function activate(){
        var loginUserData = localStorage.getItem("loginUserData");
        // if(!loginUserData){
        //   serviceAlert('当前处于未登录状态，请先登录',function(){
        //     $state.go('login');
        //   })
        // }
        console.log($location.url());
        if($location.url()==='/index'){
          vm.url = $location.url();
          vm.site_category_list = 'site-category-list2';
          vm.site_category = 'site-category2';
        }
        vm.keyword = $stateParams.keyword;
        $location.search({keyword:vm.keyword}) 
        header_nav_phone();
        header_nav_bookAir()
        header_nav_pad();
        header_nav_mouse();
        header_nav_tv();
        header_nav_icebox();
      }


      function buyPhone(){
        $cookies.remove('phoneName');
      }
      function buyProduct(phoneName){
        $cookies.put('phoneName', phoneName);
      }

      function getProduct(type){
        vm.productTypeList = [];
        for(var i=0;i<vm.parameter.length;i++){
          header_nav(vm.parameter[i].productType);
          vm.productTypeList[i] = header_nav(vm.parameter[i].productType);
          console.log(vm.productTypeList[i]);
        }
      }

      function header_nav_phone(type){
        var data = {
          "api":"getProductKindByType",
          "productType":'手机'
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.productKindlist = angular.fromJson(response.productKindlist);
            vm.phoneArr = [];
            for(var i=0;i<Math.ceil(vm.productKindlist.length/6);i++){
              vm.phoneArr[i] = vm.productKindlist.slice(6*i,6*i+6);
            }
          }else{
            vm.productKindlist = '';
          }
        })
      }

      function header_nav_bookAir(type){
        var data = {
          "api":"getProductKindByType",
          "productType":'笔记本'
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.productKindlist = angular.fromJson(response.productKindlist);
            vm.bookAirArr = [];
            for(var i=0;i<Math.ceil(vm.productKindlist.length/6);i++){
              vm.bookAirArr[i] = vm.productKindlist.slice(6*i,6*i+6);
            }
          }else{
            vm.productKindlist = '';
          }
        })
      }

      function header_nav_pad(){
        var data = {
          "api":"getProductKindByType",
          "productType":'平板'
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.productKindlist = angular.fromJson(response.productKindlist);
            vm.padArr = [];
            for(var i=0;i<Math.ceil(vm.productKindlist.length/6);i++){
              vm.padArr[i] = vm.productKindlist.slice(6*i,6*i+6);
            }
          }else{
            vm.productKindlist = '';
          }
        })
      }
      function header_nav_mouse(){
        var data = {
          "api":"getProductKindByType",
          "productType":'鼠标'
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            vm.productKindlist = angular.fromJson(response.productKindlist);
            vm.mouseArr = [];
            for(var i=0;i<Math.ceil(vm.productKindlist.length/6);i++){
              vm.mouseArr[i] = vm.productKindlist.slice(6*i,6*i+6);
            }
          }else{
            vm.productKindlist = '';
          }
        })
      }
      function header_nav_tv(){
        var data = {
          "api":"getProductKindByType",
          "productType":'电视'
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          vm.tvArr = [];
          if(response.res === '1'){
            vm.tvKindlist = angular.fromJson(response.productKindlist);
            for(var i=0;i<Math.ceil(vm.tvKindlist.length/6);i++){
              vm.tvArr[i] = vm.tvKindlist.slice(6*i,6*i+6);
            }
          }else{
            vm.tvKindlist = '';
          }
        })
      }

      function header_nav_icebox(){
        var data = {
          "api":"getProductKindByType",
          "productType":'冰箱'
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          vm.iceboxArr = [];
          if(response.res === '1'){
            vm.iceboxlist = angular.fromJson(response.productKindlist);
            for(var i=0;i<Math.ceil(vm.iceboxlist.length/6);i++){
              vm.iceboxArr[i] = vm.iceboxlist.slice(6*i,6*i+6);
            }
          }else{
            vm.iceboxKindlist = '';
          }
        })
      }
      function bookAirAndpad(){
        header_nav_bookAir();
        // header_nav_pad();
      }

      function searchProduct(){
        if($location.url().indexOf("search") > 0){
          if($stateParams.keyword!==vm.keyword){
            $location.search({keyword:vm.keyword}) 
            $state.go('searchContent',{'keyword':vm.keyword});
            console.log(vm.keyword);
          }else{
            $window.location.reload();
          }
        }else{
          $state.go('searchContent',{'keyword':vm.keyword});
        }
      }

      function parameter(){
        // vm.waitType = true; //等待界面是否显示
        var response = init();
        response.success = function (data) {
          vm.parameter = angular.fromJson(data);
          console.log(vm.parameter);
        };
        response.error = function (XMLHttpRequest, textStatus, errorThrown) {
            
        };
        $.ajax(response);
      }

      function init() {
        var optionsJson = {
            type: 'GET',
            url: 'app/json/parameter.json',
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

      vm.loginType = false;
      function activate(){
        var loginUserData = localStorage.getItem("loginUserData");
        if(!loginUserData){
          vm.loginType = false;
        }else{
          vm.loginType = true;
        }
      }

      function signOut(){
        serviceConfirm('确定要退出吗？',function(){
            localStorage.removeItem("loginUserData");
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
        var loginUserData = localStorage.getItem("loginUserData");
        // if(!loginUserData){
        //   serviceAlert('当前处于未登录状态，请先登录',function(){
        //     $state.go('login');
        //   })
        // }
        console.log($location.url());
        if($location.url()==='/cart'){
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
    function starshow(){
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
          // $scope.over = function(val){  
          //   $scope.onHover(val);  
          // };  
          // $scope.leave = function(){  
          //   $scope.onLeave();  
          // }  
        },  
        link: function (scope, elem, attrs) {  
          elem.css("text-align", "left");  
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
