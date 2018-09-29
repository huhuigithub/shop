(function(){
  'use strict'

  angular
   .module('mishop')
   .factory('service',service)
   .factory('timeNow',timeNow)
   .factory('serviceAlert',alert)
   .factory('serviceConfirm',confirm);

   function service($http,$q){

     var services = {
       getData:getData
     }

     return services;

     function getData(data){
       var deferred = $q.defer();
       var url = 'http://127.0.0.1:3200/my/shop.jsp?callback=JSON_CALLBACK';
       $http.jsonp(url, {params: data})
       .success(function(response){
         if(response){
           console.log(deferred);
           angular.extend(deferred.promise, response)
           deferred.resolve(response);
         }else{
           deferred.reject(response);
         }
       })
       return deferred.promise;
     }

   }

   function timeNow(){
      var time = Date.parse(new Date());
      return time;
   }

   function alert(SweetAlert){
     return function(text,activity){
       SweetAlert.swal({
         title: "提示",
         text: text,
         //  type: "warning",
         showCancelButton: false,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: "确定",
         closeOnConfirm: true},
         function(){
           activity && activity();
         });
     }
   }

   function confirm(SweetAlert){
     return function(text,tureActivity){
       SweetAlert.swal({
         title: "提示",
         text: text,
        //  type: "warning",
         showCancelButton: true,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         closeOnConfirm: true,
         closeOnCancel: true },
         function(isConfirm){
           if (isConfirm) {
             tureActivity();
          } else {
            return;
           }
         });
     }
   }

})()
