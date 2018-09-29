(function(){
  angular
    .module('productKind')
    .controller('createProductKindController',createProductKindController)

    function createProductKindController($scope,$log,$state,timeNow,service,serviceAlert){
      var vm = this;

      vm.RAMSelect = RAMSelect;
      vm.ROMSelect = ROMSelect;
      vm.colorSelect= colorSelect;
      vm.screenSizeSelect = screenSizeSelect;
      vm.tvTypeSelect = tvTypeSelect;
      vm.doorSelect = doorSelect;
      vm.productTypeSelect = productTypeSelect;
      vm.productBrandSelect = productBrandSelect;
      vm.uploadFile = uploadFile;
      vm.format = format;
      vm.createProductKind =createProductKind;

      vm.Url = Url;
      vm.add = add;
      vm.del = del;
      vm.ok = ok;

      activate();

      function activate(){
        parameter();
      }

      function Url(){
        var url = vm.dataUrl;
        var index = url.lastIndexOf("\.");//查找最后一个\的位置
        vm.dataType = url.substring(index+1);
      }

      vm.list = [{id:101,age:30,name:"李四"}];
      function add(){
          var obj={id:101,age:30,name:"李四"};
          vm.list.push(obj);
      }

      function del(idx){
          vm.list.splice(idx,1);
          $scope.conf.splice(idx,1);
      }

      $scope.conf = [];
      function ok() {
          console.log($scope.conf.join('_'));
      };

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

      
      vm.choseRAM = new Array(); 
      vm.choseROM = new Array(); 
      vm.choseColor = new Array(); 
      vm.choseScreenSize = new Array();
      function RAMSelect(check,data){
        console.log(vm.choseRAM);
      }

      function ROMSelect(check,data){
        console.log(vm.choseROM);
      }

      function colorSelect(check,color,imgUrl){
        console.log(vm.choseColor);
      }

      function screenSizeSelect(){
        console.log(vm.choseScreenSize);
      }

      function tvTypeSelect(){
        console.log(vm.chosetvType);
      }
      function productTypeSelect(){
        vm.productBrand = '';
      }
      function productBrandSelect(){
        console.log(vm.productBrand);
      }
      function doorSelect(){
        console.log(vm.choseDoor);
      }

      //参数存入数组
      function format(data){
        if(!data){
          return;
        }
        // var configuration = vm.configuration;
        var data1 = new Array();
        var data2 = new Array();
        cons=data.split("*"); //字符分割 
        // console.log(cons);
        for (var i=0;i<cons.length ;i++ ){ 
          // console.log(cons[i]);
          cons2=cons[i].split("\n"); //字符分割 
          for (var j=0;j<cons2.length;j++ ){
            if(cons2[j]==''){
              continue;
            }
            data2.push(cons2[j]); //分割后的字符输出 
          }
          if(data2.length==0){
            continue;
          }
          data1.push(data2); //分割后的字符输出
          data2 = [];
        } 
        // console.log(data1);
        return data1;
      }

      $("#file0").change(function(){
        var that = this;
        var formData = new FormData();
        var file = document.getElementById("file0");
        formData.append('file',file.files[0]);
        console.log(formData.get('file'));
        vm.fileName = this.files[0].name;
        $.ajax({
           url: 'http://127.0.0.1:3200/upload',
          type: 'POST',
          data: formData,
          // async: false,
          cache: false,
          contentType: false,
          processData: false,
          success: function(data){
            $(that).parent().next().next().attr("src", data.url) ;
            vm.filePath = data.url;
            console.log(vm.fileName);
          }
        });
      });
      function uploadFile(index){
        if(!vm.fileName || !vm.filePath){
          return false;
        }
        var data = {
          "api":"uploadFile",
          "fileName" : vm.fileName,
          "filePath" : vm.filePath
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res == "1"){ 
            serviceAlert('上传成功！');
            console.log('success:',response);
            vm.showImg = "http://olau2z5k7.bkt.clouddn.com/"+vm.fileName;
            vm.fileName ='';
            vm.filePath ='';
          }else{
            serviceAlert(response.msg);
          }       
        })
      }


      function createProductKind(){
        if(vm.productType==='手机'){
          var params1 = {
            "RAM":vm.choseRAM,
            "ROM":vm.choseROM,
            "颜色":vm.choseColor,
            "配置":format(vm.configuration),
            "重量与尺寸":format(vm.weightSize),
            "续航与快充":format(vm.charginge),
            "拍照与摄像":format(vm.camera),
            "屏幕类型":format(vm.screen),
            "全网通双卡和移动网络":format(vm.simCard),
            "导航定位":format(vm.navigation),
            "感应器":format(vm.sensors),
            "多媒体播放":format(vm.playback)
          }
        }
        if(vm.productType==='笔记本'){
          var params1 = {
            "RAM":vm.choseRAM,
            "ROM":vm.choseROM,
            "屏幕尺寸":vm.choseScreenSize,
            "颜色":vm.choseColor,
            "配置":format(vm.configuration),
            "重量与尺寸":format(vm.weightSize),
            "屏幕":format(vm.screen),
            "网络":format(vm.simCard),
            "内存":format(vm.memory),
            "硬盘":format(vm.hardDisk),
            "视频":format(vm.video),
            "音频":format(vm.audio),
            "电池电源":format(vm.battery),
            "外设接口":format(vm.api),
            "操作系统":format(vm.system)
          }
        }
        if(vm.productType==='平板'){
          var params1 = {
            "RAM":vm.choseRAM,
            "ROM":vm.choseROM,
            "屏幕尺寸":$scope.conf,
            "颜色":vm.choseColor,
            "配置":format(vm.configuration),
            "重量与尺寸":format(vm.weightSize),
            "拍照与摄像":format(vm.camera),
            "屏幕":format(vm.screen),
            "网络":format(vm.simCard),
            "感应器":format(vm.sensors),
            "视频":format(vm.video),
            "音频":format(vm.audio)
          }
        }
        if(vm.productType==='电视'){
          var params1 = {
            "屏幕尺寸":vm.chosetvScreenSize,
            "电视版本":vm.chosetvType
          }
        }
        if(vm.productType==='冰箱'){
          var params1 = {
            "颜色":vm.choseColor,
            "doorKind":vm.choseDoor,
            "vol":$scope.conf
          }
        }
        if(vm.productType==='鼠标'){
          var params1 = {
            "颜色":vm.choseColor,
            "配置":format(vm.configuration),
            "重量与尺寸":format(vm.weightSize),
            "操作系统":format(vm.system),
            "包装清单":format(vm.packingList)
          }
        }
        var data = {
          "api":"createProductKind",
          "productName":vm.productName,
          "productType":vm.productType,
          "productBrand":vm.productBrand,
          "productMinPrice":vm.productMinPrice,
          "productInfo":params1,
          "productImg":vm.showImg
        }
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            alert(response.msg);
            // $state.go('productKindContent');
          }else{
            alert(response.msg);
          }
        })
      }

      /** 用户数据 */
      function usersList(){
        var data = {
          "api":"searchUsers"
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var users = response.users;
            vm.userlist = angular.fromJson(users);
            console.log(vm.userlist);
          }
        })
      }


    }
})()
