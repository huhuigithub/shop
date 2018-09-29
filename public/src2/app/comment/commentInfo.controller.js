(function(){
  angular
    .module('comment')
    .controller('commentInfoController',commentInfoController)

    function commentInfoController($scope,timeNow,$stateParams,service,serviceAlert){
      var vm = this;

      vm.deleteComment = deleteComment;
      vm.commentReply =commentReply;

      vm.kindId = $stateParams.kindId;

      activate();

      function activate(){
        searchProductComment();
      }

      function searchProductComment(){
        var data = {
          "api":"searchProductComment",
          "productId":vm.productId,
          "kindId":vm.kindId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            console.log(response);
            vm.comment = response.data;
            vm.reply = vm.comment.systemComment;
            vm.systemComment = vm.reply;
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      function deleteComment(commentId){
        var data = {
          "api":"deleteComment",
          "commentId":commentId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            serviceAlert(response.msg);
            searchProductComment();
          }else{
            serviceAlert(response.msg);
          }
        })
      }

      function commentReply(commentId){
        console.log($('#'+commentId).val());
        var data = {
          "api":"commentReply",
          "commentId":commentId,
          "systemComment":$('#'+commentId).val()
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            serviceAlert(response.msg);
            searchProductComment();
          }else{
            serviceAlert(response.msg);
          }
        })
      }


    }
})()
