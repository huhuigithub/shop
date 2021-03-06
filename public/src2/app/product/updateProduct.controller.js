(function(){
  angular
    .module('product')
    .controller('updateProductController',updateProductController)

    function updateProductController($scope,timeNow,service,$state,$stateParams,$timeout,serviceAlert){
      var vm = this;

      activate();
      vm.uploadFile = uploadFile;
      vm.updateProduct = updateProduct;
      vm.productTypeSelect = productTypeSelect;
      vm.productBrandSelect = productBrandSelect;
      vm.screenSizeSelect = screenSizeSelect;
      vm.productNameSelect = productNameSelect;
      vm.colorSelect = colorSelect;

      function activate(){
        parameter();
        product();
      }

      function colorSelect(item){
        vm.proColor = item;
        console.log(vm.proColor);
      }

      function productTypeSelect(){
        console.log(vm.productType);
      }
      function productBrandSelect(){
        console.log(vm.productBrand);
        getProductName();
      }
      function screenSizeSelect(){
        console.log(vm.screenSize);
      }

      function parameter(){
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
            // $(that).parent().next().next().attr("src", data.url) ;
            $("#img0").attr("src", data.url) ;
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

      function productNameSelect(){
        console.log(vm.productName);
        getProductKind();
      }


      /** 商品查询 */
      function product(){
        var data = {
          "api":"searchProductById",
          "productId":$stateParams.productId
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var product = response.product[0];
            vm.product = angular.fromJson(product);
            console.log(vm.product);
            vm.productType = vm.product.productType;
            vm.productName = vm.product.productName;
            vm.productPrice = vm.product.productPrice;
            vm.productVersion = eval('('+vm.product.productVersion+')');
            vm.showImg = vm.product.productImg;
            vm.proColor = eval('('+vm.product.productColor+')');
            if(vm.productType ==='手机'||vm.productType ==='平板'){
              vm.RAM = vm.productVersion.ver1;
              vm.ROM = vm.productVersion.ver2;
              vm.color = vm.proColor.color;
            }
            if(vm.productType ==='笔记本'){
              vm.screenSize = vm.productVersion.ver1;
              vm.color = vm.proColor.color;
              vm.RAM = vm.productVersion.ver2;
              vm.ROM = vm.productVersion.ver3;
            }
            if(vm.productType ==='鼠标'){
              // vm.proColor = vm.productVersion.ver1;
              vm.color = vm.proColor.color;
            }
            if(vm.productType ==='电视'){
              vm.screenSize = vm.productVersion.ver1;
              vm.tvType = vm.productVersion.ver2;
              vm.productData = eval('(' + vm.product.productData + ')');
              vm.configuration = forstr(vm.productData.配置);
              vm.weightSize = forstr(vm.productData.重量与尺寸);
              vm.screen = forstr(vm.productData.屏幕);
              vm.simCard = forstr(vm.productData.网络);
              vm.api = forstr(vm.productData.外设接口);
              vm.playPower = forstr(vm.productData.影音播放性能);
              vm.packingList = forstr(vm.productData.包装清单);
              vm.accessoriesList = forstr(vm.productData.配件盒清单);
              }
              if(vm.productType ==='冰箱'){
              vm.volCheck = vm.productVersion.ver1;
              vm.doorKind = vm.productVersion.ver2;
              vm.color = vm.proColor.color;
              vm.productData = eval('(' + vm.product.productData + ')');
              vm.mainBody = forstr(vm.productData.主体);
              vm.configuration = forstr(vm.productData.配置);
              vm.weightSize = forstr(vm.productData.重量与尺寸);
              vm.packingList = forstr(vm.productData.包装清单);
              }
            $("#img0").attr("src", vm.showImg);
            getProductKind();
          }
        })
      }

      /** 商品名称查询 */
      function getProductName(){
        var data = {
          "api":"getProductNameByTypeAndBrand",
          "productType":vm.productType,
          "productBrand":vm.productBrand
        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var productNamelist = response.productNamelist;
            vm.productNamelist = angular.fromJson(productNamelist);
            console.log(vm.productNamelist);
          }else{
            vm.productNamelist = productNamelist;
            serviceAlert(response.msg);
          }
        })
      }

      // /** 商品名称查询 */
      // function getProductName(){
      //   var data = {
      //     "api":"getProductNameByType",
      //     "productType":vm.productType
      //   };
      //   var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
      //   vm.promise = service.getData(data,URL);
      //   return vm.promise.then(function(response) {
      //     if(response.res === '1'){
      //       var productNamelist = response.productNamelist;
      //       vm.productNamelist = angular.fromJson(productNamelist);
      //       console.log(vm.productNamelist);
      //     }else{
      //       vm.productNamelist = productNamelist;
      //       serviceAlert(response.msg);
      //     }
      //   })
      // }

      /** 商品分类信息查询 */
      function getProductKind(){
        var data = {
          "api":"searchProductKindByName",
          "productName":vm.productName,

        };
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){
            var productKind = response.productKind[0];
            vm.productKind = angular.fromJson(productKind);
            vm.productColor = eval('(' + vm.productColor + ')');
            vm.productName = vm.productKind.productName;
            vm.kindId = vm.productKind.kindId;
            vm.productType = vm.productKind.productType;
            vm.productBrand = vm.productKind.productBrand;
            vm.kindId = vm.productKind.kindId;
            vm.productInfo = eval('(' + vm.productKind.productInfo + ')');
            vm.choseRAM = vm.productInfo.RAM;
            vm.choseROM = vm.productInfo.ROM;
            vm.choseColor = vm.productInfo.颜色;
            vm.choseScreenSize = vm.productInfo.屏幕尺寸;
            vm.chosetvType = vm.productInfo.电视版本;
            vm.choseDoor = vm.productInfo.doorKind;
            vm.vol = vm.productInfo.vol;
            //电视
            console.log(vm.choseColor);
            getProductName();
          }
        })
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
          cons2 = cons[i].split("\n"); //字符分割 
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

      //数组参数转字符串
      function forstr(data){
        if(!data){
          return;
        }
        var data1;
        if(typeof(data[0])==="object"){
          data1 = data.join('\n*');
          data1 = data1.replace(/,/g,"\n");
        }else{
          data1 = data.join('\n');
        }
        return data1; 
      }

      /** 修改商品个体 */
      function updateProduct(){
        if(vm.productType === '手机'){
          vm.productVersion = [{"ver1":vm.RAM,"ver2":vm.ROM}]
        }
        if(vm.productType === '平板'){
          vm.productVersion = [{"ver1":vm.RAM,"ver2":vm.ROM,"ver3":vm.screenSize}]
        }
        if(vm.productType === '笔记本'){
          vm.productVersion = [{"ver1":vm.screenSize,"ver2":vm.RAM,"ver3":vm.ROM}]
        }
        if(vm.productType === '鼠标'){
          vm.productVersion = [{"ver1":vm.color}]
        }
        if(vm.productType === '电视'){
          vm.productVersion = [{"ver1":vm.screenSize,"ver2":vm.tvType}];
          vm.productData = {
            "配置":format(vm.configuration),
            "重量与尺寸":format(vm.weightSize),
            "屏幕":format(vm.screen),
            "网络":format(vm.simCard),
            "外设接口":format(vm.api),
            "影音播放性能":format(vm.playPower),
            "包装清单":format(vm.packingList),
            "配件盒清单":format(vm.accessoriesList)
          }
        }
        if(vm.productType === '冰箱'){
          vm.productVersion = [{
            "ver1":vm.volCheck,
            "ver2":vm.doorKind}];
          vm.productData = {
            "主体":format(vm.mainBody),
            "配置":format(vm.configuration),
            "重量与尺寸":format(vm.weightSize),
            "包装清单":format(vm.packingList)
          }
        }
        var data = {
          "api":"updateProduct",
          "productId":$stateParams.productId,
          "kindId":vm.kindId,
          "productType":vm.productType,
          "productBrand":vm.productBrand,
          "productName":vm.productName,
          "productVersion":vm.productVersion,
          "productData":vm.productData,
          "productImg":vm.showImg,
          "productPrice":vm.productPrice.toString(),
          "productColor":vm.proColor,
          "kindId":vm.kindId
        };
        console.log(data);
        var URL = 'http://127.0.0.1:3200/my/mishop.jsp?callback=JSON_CALLBACK';
        vm.promise = service.getData(data,URL);
        return vm.promise.then(function(response) {
          if(response.res === '1'){            
            serviceAlert(response.msg);
            $state.go('productContent');
          }else{
            serviceAlert(response.msg);
          }
        })
      }
    }
})()
