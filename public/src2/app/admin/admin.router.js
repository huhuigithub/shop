(function(){
  'use strict'

  angular
    .module('admin',['ui.router'])
    .config(config)

    function config($stateProvider){
      $stateProvider
        .state('adminContent',{
          url:'/admin',
          views:{
            '':{
              templateUrl:'app/main/main.html'
            },
            '@adminContent':{
              templateUrl:'app/admin/admin.html',
              controller:'adminController',
              controllerAs:'vm'
            }
          }
        })
        .state('adminContent.createAdmin',{
          url:'/createAdmin',
          views:{
            '@adminContent': {
              templateUrl: 'app/admin/createAdmin.html',
              controller: 'createAdminController',
              controllerAs: 'vm'
            }
          }
        })
        .state('adminContent.updateAdmin',{
          url:'/updateAdmin/:adminId',
          views:{
            '@adminContent': {
              templateUrl: 'app/admin/updateAdmin.html',
              controller: 'updateAdminController',
              controllerAs: 'vm'
            }
          }
        })
    }

})()
