(function() {
  'use strict';

  angular
    .module('mishop')
    .controller('Main2Controller', Main2Controller);

  /** @ngInject */
  function Main2Controller() {
    var vm = this;



    activate();

    function activate() {
     console.log('a');
    }



  }
})();
