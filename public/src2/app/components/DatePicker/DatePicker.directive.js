(function() {
  'use strict';

  angular
    .module('daterangepicker', ['ui.bootstrap','daterangepicker'])
    .directive('dateRangePicker', dateRangePicker)
    .directive('uiDate' , uiDate)
    .directive('uiDateTime',uiDateTime)
  function dateRangePicker($window) {
    var directive = {
        link: link,
        restrict: 'A',
        scope: {
          startDate: '=',
          endDate: '='
        }
    };
    return directive;

    function link(scope, element, attrs) {
      var opts = {
        autoUpdateInput: attrs.autoUpdateInput === 'true',
        opens: attrs.opens || 'right',
        clearLabel: 'Clear',
        timePicker: attrs.timePicker === 'true',
        timePicker24Hour: true,
        timePickerIncrement: 10,
        locale: {
          cancelLabel: '清空',
          applyLabel: '生效',
          format: 'YYYY-MM-DD',
          separator: '   '
        },
        startDate: scope.startDate,
        endDate: scope.endDate,
        alwaysShowCalendars: true,
        ranges: {
           '今日': [$window.moment(), $window.moment()],
           '昨日': [$window.moment().subtract(1, 'days'), $window.moment().subtract(1, 'days')],
           '本周': [$window.moment().startOf('week'), $window.moment().endOf('week')],
           '本月': [$window.moment().startOf('month'), $window.moment().endOf('month')],
           '上月': [$window.moment().subtract(1, 'month').startOf('month'), $window.moment().subtract(1, 'month').endOf('month')]
        }
      };
      element.each(function () {
          this.style.setProperty('padding-left', '5px', 'important' );
          this.style.setProperty('padding-right', '5px', 'important' );
      });
      element.daterangepicker(opts)
        .on('apply.daterangepicker', function(ev, picker) {

          var startDate;
          var endDate;

          if (attrs.timePicker === 'true') {
            startDate = picker.startDate.format('YYYY-MM-DD HH:mm');
            endDate = picker.endDate.format('YYYY-MM-DD HH:mm');
          } else {
            startDate = picker.startDate.format(opts.locale.format);
            endDate = picker.endDate.format(opts.locale.format);
          }


          $(this).val(startDate + '   ' + endDate);
          scope.startDate = startDate;
          scope.endDate = endDate;
        })
        .on('cancel.daterangepicker', function(ev, picker) {
          $(this).val('');
          delete scope.startDate;
          delete scope.endDate;
        });

      if (attrs.autoUpdateInput === 'true' && !scope.startDate && !scope.startDate) {
        element.val('');
      }

    }
  }

  function uiDate(){
    return {
      require:'?ngModel',
      link:uiDateFunction
    }

    function uiDateFunction(scope, element, attrs, ngModel){
      if(!ngModel){
        return;
      }

      var myDate = new Date();
      var myoption = {
        format: attrs.format || 'YYYY-MM-DD',
        startView:attrs.startView || 'month',
        minViewMode:attrs.minViewMode || 'days',
        language: 'zh-CN',
        clearBtn: true,
        keyboardNavigation: true,
        minDate: attrs.minDate || myDate,
        //todayBtn: 'linked',
        autoclose: true,
        todayHighlight: true
      }


      // console.log(option,'option');
      scope.$watch(function () {
        return ngModel.$modelValue;
      }, function (value) {
        myoption.date = value;
        myoption.startDate=attrs.mindate;
        myoption.endDate=attrs.maxdate;
        element.datepicker(myoption);
        // console.log(myoption);
      });

    }
  }

  function uiDateTime(){
    return {
    require: '?ngModel',
    link: function (scope, element, attrs, ngModel) {

      if (!ngModel) {
        return;
      }

      scope.$watch(function () {
        return ngModel.$modelValue;
      }, function (value) {
        element.datetimepicker({
          value: value,
          format:'Y-m-d H:i'
        });
      });
    }
  };
  }

})();
