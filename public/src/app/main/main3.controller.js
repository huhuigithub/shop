(function() {
  'use strict';

  angular
    .module('mishop')
    .controller('Main3Controller', Main3Controller);

  /** @ngInject */
  function Main3Controller() {
    var vm = this;



    activate();

    function activate() {
     console.log('a');
    }



  }
})();
