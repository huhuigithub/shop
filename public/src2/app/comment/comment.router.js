(function(){
  'use strict'

  angular
    .module('comment',['ui.router'])
    .config(config)

    function config($stateProvider){
      $stateProvider
        .state('commentContent',{
          url:'/comment',
          views:{
            '':{
              templateUrl:'app/main/main.html'
            },
            '@commentContent':{
              templateUrl:'app/comment/comment.html',
              controller:'commentController',
              controllerAs:'vm'
            }
          }
        })
        .state('commentContent.commentInfo',{
          url:'/commentInfo/:kindId',
          views:{
            '@commentContent': {
              templateUrl: 'app/comment/commentInfo.html',
              controller: 'commentInfoController',
              controllerAs: 'vm'
            }
          }
        })
    }

})()
