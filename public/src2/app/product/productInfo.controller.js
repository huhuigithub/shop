(function(){
  angular
    .module('product')
    .controller('productInfoController',productInfoController)

    function productInfoController($scope,timeNow,service){
      var vm = this;
      activate();

      function activate(){
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
    }
})()
