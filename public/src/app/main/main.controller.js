(function() {
  'use strict';

  angular
    .module('mishop')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
    var vm = this;



    activate();

    function activate() {
     console.log('a');
    }



  }
})();
