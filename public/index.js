var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer=require('multer');
var util = require("util");
var async = require('async');
var a = {};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('src'));

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/my/get', function (req, res) {
   res.send('get:' + req.query.txt1);
});

// 图片上传接口
var storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, './src/images')
  },
  filename: function (req, file, cb){
    cb(null, file.originalname)
  }
});

var upload = multer({
  storage: storage
});
app.post('/upload', upload.single('file'), function (req, res, next) {
  var reqs =  eval(req.query);
  var callback =  req.query.callback;
  var url = 'http://' + req.headers.host + '/images/' + req.file.originalname
  res.json({
    url : url
  })
});

app.post('/my/shop_post.jsp', function(req, res, next){
  var reqs =  eval(req.query);
  var callback =  req.query.callback;
  console.log(req.query);
  
});

app.get('/my/shop.jsp', function (req, res) {
  var reqs =  eval(req.query);
  var callback =  req.query.callback;

    /* ----------file-------------- */ 
  if(req.query.api ==='uploadFile'){
    var qiniu = require("qiniu");
    qiniu.conf.ACCESS_KEY = 'FAYGrwzvxbjmacXZVjhAk5yoXP3J8J-_gMrmh8wD';
    qiniu.conf.SECRET_KEY = 'v3EGiyiZliDA7FB8FGTJVwY1kvRzS9KIOEaHlQUC';
    //要上传的空间
    bucket = 'huhui';
    //上传到七牛后保存的文件名
    key = req.query.fileName;
    //构建上传策略函数
    function uptoken(bucket, key) {
      var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
      return putPolicy.token();
    }
    //生成上传 Token
    token = uptoken(bucket, key);
    //要上传文件的本地路径
    filePath = "./src/images/"+req.query.fileName;
    //构造上传函数
    function uploadFile(uptoken, key, localFile) {
      var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
          if(!err) {// 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId); 
            var result = {res:'1',msg: "上传成功",data:ret.key};
            res.send(callback + '(' + JSON.stringify(result) + ')');      
          } else {// 上传失败， 处理返回代码
            console.log(err);
            var result = {res:'0',msg: "上传失败",data:err};
            res.send(callback + '(' + JSON.stringify(result) + ')');
          }
      });
    }
    //调用uploadFile上传
    uploadFile(token, key, filePath);
    url = 'http://olau2z5k7.bkt.clouddn.com/'+key;
    var policy = new qiniu.rs.GetPolicy();
    //生成下载链接url
    var downloadUrl = policy.makeRequest(url);
    //打印下载的url
    console.log(downloadUrl+"**********");
    return;

  }
  /* ----------用户登录-------------- */ 
  if(req.query.api ==='userLogin'){
    connection.query('select * FROM user where userPhone = '+reqs.userPhone+'', function(err, rows, fields) {
      if (err) console.error(err.stack);
      var user = rows[0];
      console.log(user);
      var isLegal=false;
      var userInfo;
      if(!user){
        var result = {res:'0',msg: "用户名或密码错误",adminInfo:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
        return false;
      }
      if(user.userStatus==='冻结'){
        var result = {res:'0',msg: "账户被冻结",userInfo:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
        return false;
      }
      if(reqs.userPhone==user.userPhone&&reqs.userPassword==user.userPassword){
        isLegal = true;
        userInfo = user;
        console.log(userInfo);
      }
      if(isLegal){
        var result = {res:'1',msg: "登录成功",userInfo:userInfo};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "用户名或密码错误",userInfo:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------用户登录-------------- */ 

  /* ----------创建用户-------------- */ 
  if(req.query.api ==='createUser'){
    connection.query('select * FROM user where userPhone = '+reqs.userPhone+'', function(err, rows, fields) {
      if (err) console.error(err.stack);

      if(rows.length<=0){
        var user  = {'userName': reqs.userName,'userPhone':reqs.userPhone,'userPassword':reqs.userPassword,'userStatus': '激活','userCreateTime':reqs.userCreateTime,'userImg':'http://olau2z5k7.bkt.clouddn.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.jpg'}
        connection.query('insert INTO user set ?', user, function(err, result) {
          if (err) throw err;
          console.log('insert lisi');     
        });
        var result = {res:'1',msg: "用户新增成功"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "该手机号已存在"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------创建用户-------------- */ 
  
  /* ----------查询所有用户-------------- */ 
  if(req.query.api ==='searchUsers'){
    connection.query('select * FROM user ORDER BY userCreateTime desc', function(err, rows, fields) {
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "用户查询成功",users:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无用户数据",users:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询所有用户-------------- */ 

  /* ----------通过Id查询用户信息-------------- */ 
  if(req.query.api ==='searchUserById'){
    console.log('searchUserById-----');
    console.log(reqs);
    connection.query('select * FROM user where userId = '+reqs.userId+'', function(err, rows, fields) {
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "用户信息查询成功",user:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无用户信息",user:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------通过Id查询用户信息-------------- */ 

  /* ----------通过Id修改用户地址-------------- */ 
  if(req.query.api ==='updateUserAddressById'){
    console.log('updateUserById-----');
    console.log(reqs);
    var addressList = eval('('+reqs.userAddress+')');
    for( var i = 1; i < addressList.length; i = i + 1 ) {
      if(addressList[i].select==='1') {
        addressList.unshift(addressList[i]);
        addressList.splice(i+1,1);
        break;
      }
    }
    addressList = JSON.stringify(addressList);
    console.log(addressList);
    connection.query("update user set userAddress = '"+addressList+"' where userId='"+reqs.userId+"'", function(err, result) {
      if (err) console.error(err.stack);
      console.log(result);

      if(result.warningCount ===0){
        var result = {res:'1',msg: "修改信息成功"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "修改用户失败"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------通过Id查询用户-------------- */

  /* ----------通过Id检验用户密码-------------- */ 
  if(req.query.api ==='checkUserPswById'){
    console.log('checkUserPswById-----');
    console.log(reqs);
    connection.query("select * FROM user where userId = '"+reqs.userId+"'and userPassword='"+reqs.oldPassword+"'", function(err, rows, fields) {
      if(rows.length<=0){
        var result = {res:'0',msg: "密码错误"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'1',msg: "密码正确"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });
    return;
  }
  /* ----------通过Id检验用户密码-------------- */ 

  /* ----------通过Id修改用户密码-------------- */ 
  if(req.query.api ==='updateUserPswById'){
    console.log('updateUserPswById-----');
    console.log(reqs);
    connection.query("select * FROM user where userId = '"+reqs.userId+"'and userPassword='"+reqs.oldPassword+"'", function(err, rows, fields) {
      if(rows.length<=0){
        var result = {res:'0',msg: "密码错误"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
        return;
      }
      var user  = {'userPassword':reqs.userPassword};
      connection.query("update user set ? where userId='"+reqs.userId+"'",user, function(err, result) {
        if (err) console.error(err.stack);
        console.log(result);

        if(result.warningCount ===0){
          var result = {res:'1',msg: "修改密码成功"};
          res.send(callback + '(' + JSON.stringify(result) + ')');
        }else{
          var result = {res:'0',msg: "修改密码失败"};
          res.send(callback + '(' + JSON.stringify(result) + ')');
        }
      });   //查询
      return;
    });
    return;
  }
  /* ----------通过Id修改用户密码-------------- */ 

  /* ----------用户状态修改-------------- */ 
  if(req.query.api ==='updateUserStatus'){
    var user  = {'userStatus': reqs.userStatus}
    connection.query('update user set ? where userId='+reqs.userId+'',user, function(err, result) {
      console.log(result);
      if(result.warningCount ===0){
        var date = {res:'1',msg: "用户状态修改成功"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }else{
        var date = {res:'0',msg: "用户状态修改失败"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }
    });   //查询
    return;
  }
  /* ----------用户状态修改-------------- */

   /* ----------用户头像修改-------------- */ 
  if(req.query.api ==='updateUserImgById'){
    var user  = {'userImg': reqs.userImg}
    connection.query('update user set ? where userId='+reqs.userId+'',user, function(err, result) {
      console.log(result);
      if(result.warningCount ===0){
        var date = {res:'1',msg: "用户头像修改成功"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }else{
        var date = {res:'0',msg: "用户头像修改失败"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }
    });   //查询
    return;
  }
  /* ----------用户头像修改-------------- */ 


  /* ----------通过Id修改用户基本信息-------------- */ 
  if(req.query.api ==='updateUserInfoById'){
    console.log('updateUserInfoById-----');
    console.log(reqs);
    connection.query("select * FROM user where userId = '"+reqs.userId+"'", function(err, rows, fields) {
      if(rows.length<=0){
        var result = {res:'0',msg: "无此用户"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
        return;
      }
      var user  = {'userName':reqs.userName,'realName': reqs.realName,'userPhone':reqs.userPhone,'userCreateTime':reqs.userCreateTime}
      console.log(user);
      connection.query("update user set ? where userId='"+reqs.userId+"'",user, function(err, result) {
        if (err) console.error(err.stack);
        console.log(result);

        if(result.warningCount ===0){
          var result = {res:'1',msg: "修改信息成功"};
          res.send(callback + '(' + JSON.stringify(result) + ')');
        }else{
          var result = {res:'0',msg: "修改信息失败"};
          res.send(callback + '(' + JSON.stringify(result) + ')');
        }
      });   //查询
      return;
    });
    return;
  }
  /* ----------通过Id修改用户基本信息-------------- */ 

  /* ----------通过Id删除管理员-------------- */ 
  if(req.query.api ==='deleteUserById'){
    connection.query("delete FROM user where userId = '"+reqs.userId+"'", function(err, result) {
      console.log('deleteUserById-----');
      if (err) console.error(err.stack);
      if(result.warningCount ===0){
        var data = {res:'1',msg: "用户删除成功"};
        res.send(callback + '(' + JSON.stringify(data) + ')');
      }else{
        var data = {res:'0',msg: "用户删除失败"};
        res.send(callback + '(' + JSON.stringify(data) + ')');
      }
    });   //查询
    return;
  }
  /* ----------删除订单-------------- */ 

  /* ------------用户名重复检验-----------*/
  if(req.query.api ==='userCheckName'){
    connection.query("select * FROM user where userName = '"+reqs.userName+"'", function(err, rows, fields) {
      if (err) console.error(err.stack);
      console.log(reqs);
      if(rows.length<=0){
        var result = {res:'1',msg: "该用户名未注册",a:req.query.q};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "该用户名已存在",a:req.query.q};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    })
    return;
  }
  /* ------------用户名重复检验-----------*/

  /* ------------用户手机号码重复检验-----------*/
  if(req.query.api ==='userCheckPhoneNum'){
    connection.query('select * FROM user where userPhone = '+reqs.userPhone+'', function(err, rows, fields) {
      if (err) console.error(err.stack);
      console.log(reqs);
      if(rows.length<=0){
        var result = {res:'1',msg: "该手机号未注册",a:req.query.q};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "该手机号已存在",a:req.query.q};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    })
    return;
  }
  /* ------------用户手机号码重复检验-----------*/

  /* ----------管理员登录-------------- */ 
  if(req.query.api ==='adminLogin'){
    connection.query('select * FROM admin where adminPhone = '+reqs.adminPhone+'', function(err, rows, fields) {
      if (err) console.error(err.stack);

      var admin = rows[0];
      var isLegal=false;
      var adminInfo;
      if(!admin){
        var result = {res:'0',msg: "管理员账户错误",adminInfo:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
        return false;
      }
      if(admin.adminStatus==='冻结'){
        var result = {res:'0',msg: "账户被冻结",adminInfo:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
        return false;
      }
      if(reqs.adminPhone==admin.adminPhone&&reqs.adminPassword==admin.adminPassword){
        isLegal = true;
        adminInfo = admin;
      }
      if(isLegal){
        var result = {res:'1',msg: "登录成功",adminInfo:adminInfo};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "密码错误",adminInfo:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------管理员登录-------------- */ 

  /* ----------创建管理员-------------- */ 
  if(req.query.api ==='createAdmin'){
    connection.query('select * FROM admin where adminPhone = '+reqs.adminPhone+'', function(err, rows, fields) {
      if (err) console.error(err.stack);
      if(rows.length<=0){
        var admin  = {'adminName': reqs.adminName,'adminPhone':reqs.adminPhone,'adminPassword':reqs.adminPassword,'adminRole':reqs.adminRole,'adminStatus':'激活','adminCreateTime':reqs.adminCreateTime}
        connection.query('insert INTO admin set ?', admin, function(err, result) {
          if (err) throw err;
          console.log('insert lisi');     
        });
        var result = {res:'1',msg: "管理员新增成功"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "该手机号已存在"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------创建管理员-------------- */ 

  /* ----------通过Id查询管理员-------------- */ 
  if(req.query.api ==='searchAdminById'){
    console.log('searchAdminById-----');
    connection.query('select * FROM admin where adminId = '+reqs.adminId+'', function(err, rows, fields) {
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "管理员信息查询成功",admin:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无管理员数据",admin:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------通过Id查询管理员-------------- */ 

  /* ----------通过Id删除管理员-------------- */ 
  if(req.query.api ==='deleteAdminById'){
    connection.query("delete FROM admin where adminId = '"+reqs.adminId+"'", function(err, result) {
      console.log('deleteAdminById-----');
      if (err) console.error(err.stack);
      if(result.warningCount ===0){
        var data = {res:'1',msg: "管理员删除成功"};
        res.send(callback + '(' + JSON.stringify(data) + ')');
      }else{
        var data = {res:'0',msg: "管理员删除失败"};
        res.send(callback + '(' + JSON.stringify(data) + ')');
      }
    });   //查询
    return;
  }
  /* ----------删除订单-------------- */ 

  /* ----------通过查询所有管理员-------------- */ 
  if(req.query.api ==='searchAdmin'){
    connection.query('select * FROM admin ORDER BY adminCreateTime desc', function(err, rows, fields) {
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "管理员查询成功",admin:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无管理员数据",admin:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------通过查询所有管理员-------------- */ 

  /* ------------管理员手机号码重复检验-----------*/
  if(req.query.api ==='checkPhoneNum'){
    connection.query('select * FROM admin where adminPhone = '+reqs.adminPhone+'', function(err, rows, fields) {
      if (err) console.error(err.stack);
      console.log(req.query.q);
      if(rows.length<=0){
        var result = {res:'1',msg: "该手机号未注册",a:req.query.q};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "该手机号已存在",a:req.query.q};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    })
    return;
  }
  /* ------------管理员手机号码重复检验-----------*/

  /* ----------通过Id检验用户密码-------------- */ 
  if(req.query.api ==='checkAdminPswById'){
    console.log('checkAdminPswById-----');
    console.log(reqs);
    connection.query("select * FROM admin where adminId = '"+reqs.adminId+"'and adminPassword='"+reqs.oldPassword+"'", function(err, rows, fields) {
      if(rows.length<=0){
        var result = {res:'0',msg: "密码错误"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'1',msg: "密码正确"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });
    return;
  }
  /* ----------通过Id检验用户密码-------------- */ 

  /* ----------通过Id修改用户密码-------------- */ 
  if(req.query.api ==='updateAdminPswById'){
    console.log('updateAdminPswById-----');
    console.log(reqs);
    connection.query("select * FROM admin where adminId = '"+reqs.adminId+"'and adminPassword='"+reqs.oldPassword+"'", function(err, rows, fields) {
      if(rows.length<=0){
        var result = {res:'0',msg: "密码错误"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
        return;
      }
      var admin  = {'adminPassword':reqs.adminPassword};
      connection.query("update admin set ? where adminId = '"+reqs.adminId+"'",admin, function(err, result) {
        if (err) console.error(err.stack);
        console.log(result);

        if(result.warningCount ===0){
          var result = {res:'1',msg: "修改密码成功"};
          res.send(callback + '(' + JSON.stringify(result) + ')');
        }else{
          var result = {res:'0',msg: "修改密码失败"};
          res.send(callback + '(' + JSON.stringify(result) + ')');
        }
      });   //查询
      return;
    });
    return;
  }
  /* ----------通过Id修改用户密码-------------- */ 

  /* ----------修改管理员-------------- */ 
  if(req.query.api ==='updateAdmin'){
    var admin  = {'adminName': reqs.adminName,'adminPhone':reqs.adminPhone,'adminRole':reqs.adminRole}
    connection.query('update admin set ? where adminId='+reqs.adminId+'',admin, function(err, result) {
      console.log(result);
      if(result.warningCount ===0){
        var date = {res:'1',msg: "管理员修改成功"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }else{
        var date = {res:'0',msg: "管理员修改失败"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }
    });   //查询
    return;
  }
  /* ----------修改管理员-------------- */ 

  /* ----------管理员密码重置-------------- */ 
  if(req.query.api ==='resetAdminPassword'){
    var admin  = {'adminPassword': '123456'}
    connection.query('update admin set ? where adminId='+reqs.adminId+'',admin, function(err, result) {
      console.log(result);
      if(result.warningCount ===0){
        var date = {res:'1',msg: "管理员密码重置成功"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }else{
        var date = {res:'0',msg: "管理员密码重置失败"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }
    });   //查询
    return;
  }
  /* ----------管理员密码重置-------------- */

  /* ----------管理员状态修改-------------- */ 
  if(req.query.api ==='updateAdminStatus'){
    var admin  = {'adminStatus': reqs.adminStatus}
    connection.query('update admin set ? where adminId='+reqs.adminId+'',admin, function(err, result) {
      console.log(result);
      if(result.warningCount ===0){
        var date = {res:'1',msg: "管理员状态修改成功"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }else{
        var date = {res:'0',msg: "管理员状态修改失败"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }
    });   //查询
    return;
  }
  /* ----------管理员状态修改-------------- */ 

  /* ----------创建商品分类-------------- */ 
  if(req.query.api ==='createProductKind'){
    console.log(reqs);
    connection.query("select * FROM productKind where productName = '"+reqs.productName+"'", function(err, rows, fields) {
      console.log(rows);
      if (err) console.error(err.stack);

      if(rows.length<=0){
        var productKind  = {'productName': reqs.productName,'productInfo':reqs.productInfo,'productType':reqs.productType,'productImg':reqs.productImg,'productMinPrice':reqs.productMinPrice,'productBrand':reqs.productBrand}
        connection.query('insert INTO productKind set ?', productKind, function(err, result) {
          if (err) console.error(err.stack);
          console.log('insert lisi');     
        });
        var result = {res:'1',msg: "商品分类新增成功"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "该商品分类已存在"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------创建商品分类-------------- */

  /* ----------修改商品分类-------------- */ 
  if(req.query.api ==='updateProductKind'){
    var productKind = {'productName': reqs.productName,'productInfo':reqs.productInfo,'productType':reqs.productType,'productImg':reqs.productImg,'productMinPrice':reqs.productMinPrice,'productBrand':reqs.productBrand}
    connection.query('update productKind set ? where kindId='+reqs.kindId+'',productKind,function(err, result) {
      console.log(productKind);
      if(result.warningCount ===0){
        var date = {res:'1',msg: "商品分类修改成功"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }else{
        var date = {res:'0',msg: "商品分类修改失败"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }
    });   //查询
    return;
  }
  /* ----------修改商品分类-------------- */ 

  /* ----------查询商品分类-------------- */ 
  if(req.query.api ==='searchProductKind'){
    connection.query('select * FROM productKind ORDER BY kindId desc', function(err, rows, fields) {
      if (err) console.error(err.stack);
      console.log('searchProductKind-----');

      if(rows.length>0){
        var result = {res:'1',msg: "商品分类查询成功",productKind:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无商品分类数据",productKind:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询商品分类-------------- */ 

  /* ----------查询商品分类分组-------------- */ 
  if(req.query.api ==='searchProductKindGroup'){
    connection.query('select * FROM productKind Group by productType having count(*)>1', function(err, rows, fields) {
      if (err) console.error(err.stack);
      console.log('searchProductKindGroup-----');

      if(rows.length>0){
        var result = {res:'1',msg: "商品分类查询成功",productKind:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无商品分类数据",productKind:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询商品分类分组-------------- */ 

  /* ----------查询商品分类-------------- */ 
  if(req.query.api ==='searchProductKindById'){
    connection.query('select * FROM productKind where kindId ='+reqs.kindId+'', function(err, rows, fields) {
      console.log('searchProductKindById-----');
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "商品分类查询成功",productKind:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无商品分类数据",productKind:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询商品分类-------------- */ 

  /* ----------通过商品ID删除商品-------------- */ 
  if(req.query.api ==='deleteProductKindById'){
    connection.query("delete FROM productKind where kindId = '"+reqs.kindId+"'", function(err, result) {
      console.log('deleteProductKindById-----');
      if (err) console.error(err.stack);
      if(result.warningCount ===0){
        var data = {res:'1',msg: "商品分类删除成功"};
        res.send(callback + '(' + JSON.stringify(data) + ')');
      }else{
        var data = {res:'0',msg: "商品分类删除失败"};
        res.send(callback + '(' + JSON.stringify(data) + ')');
      }
    });   //查询
    return;
  }
  /* ----------删除商品-------------- */

  /* ----------通过商品Type和Brand查询商品名称-------------- */ 
  if(req.query.api ==='getProductNameByTypeAndBrand'){
    connection.query("select productName FROM productKind where productType = '"+reqs.productType+"'and productBrand = '"+reqs.productBrand+"'", function(err, rows, fields) {
      console.log('getProductNameByTypeAndBrand-----');
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "商品名称查询成功",productNamelist:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "此商品类型无商品",productNamelist:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------通过商品Type和Brand查询商品名称------------- */

  /* ----------通过商品type查询商品分类-------------- */ 
  if(req.query.api ==='getProductKindByType'){
    connection.query("select * FROM productKind where productType = '"+reqs.productType+"'", function(err, rows, fields) {
      console.log('getProductKindByType-----');
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "商品分类查询成功",productKindlist:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "此商品类型无商品",productKindlist:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------通过商品type查询商品分类-------------- */ 

  /* ----------通过商品name查询商品分类信息-------------- */ 
  if(req.query.api ==='searchProductKindByName'){
    connection.query("select * FROM productKind where productName = '"+reqs.productName+"'", function(err, rows, fields) {
      console.log('searchProductKindByName-----');
      if (err) console.error(err.stack);
      if(rows.length>0){
        var result = {res:'1',msg: "商品分类信息查询成功",productKind:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无商品分类信息",productKind:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询商品分类-------------- */ 

  /* ----------通过商品name查询商品信息-------------- */ 
  if(req.query.api ==='searchProductByName'){
    connection.query("select * FROM product where productName = '"+reqs.productName+"'", function(err, rows, fields) {
      console.log('searchproductByName-----');
      if (err) console.error(err.stack);
      if(rows.length>0){
        var result = {res:'1',msg: "商品分类信息查询成功",productList:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无商品分类信息",productList:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------通过商品name查询商品信息-------------- */ 

  /* ----------通过商品name查询商品分类Version-------------- */ 
  if(req.query.api ==='searchProductVersionByName'){
    connection.query("select ProductVersion FROM product where productName = '"+reqs.productName+"'", function(err, rows, fields) {
      console.log('searchProductVersionByName-----');
      if (err) console.error(err.stack);
      if(rows.length>0){
        var result = {res:'1',msg: "商品分类信息查询成功",productList:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无商品分类信息",productList:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询商品分类Version-------------- */ 

  /* ----------查询商品个体信息-------------- */ 
  if(req.query.api ==='searchProductList'){
    connection.query("select * FROM product ORDER BY productId desc", function(err, rows, fields) {
      console.log('searchProductList-----');
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "商品个体查询成功",productList:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无商品个体信息",productList:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询商品分类-------------- */

  /* ----------通过商品ID查询商品信息-------------- */ 
  if(req.query.api ==='searchProductById'){
    connection.query("select * FROM product where productId = '"+reqs.productId+"'", function(err, rows, fields) {
      console.log('searchProductById-----');
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "商品信息查询成功",product:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无此商品信息",product:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询商品分类-------------- */  

  /* ----------创建商品个体-------------- */ 
  if(req.query.api ==='createProduct'){
    console.log(reqs);
    connection.query("select * FROM product where productVersion = '"+reqs.productVersion+"'and productColor='"+reqs.productColor+"'and productName='"+reqs.productName+"'", function(err, rows, fields) {
      console.log(rows);
      if (err) console.error(err.stack);
      var isLegal=false;
      if(rows.length<=0){
        isLegal=true;
      }else{
        isLegal=false;
      }
      if(isLegal){
        var product = {'productName': reqs.productName,'productVersion':reqs.productVersion,'productType':reqs.productType,'productImg':reqs.productImg,'productPrice':reqs.productPrice,'productColor':reqs.productColor,'productData':reqs.productData,"productBrand":reqs.productBrand,'kindId':reqs.kindId}
        connection.query('insert INTO product set ?', product, function(err, result) {
          if (err) throw err;
          console.log('insert lisi');     
        });
        var result = {res:'1',msg: "商品个体新增成功"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "该商品个体已存在"};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------创建商品个体-------------- */

  /* ----------修改商品个体-------------- */ 
  if(req.query.api ==='updateProduct'){
    console.log(reqs);
    var product = {'productName': reqs.productName,'productVersion':reqs.productVersion,'productColor':reqs.productColor,'productType':reqs.productType,'productImg':reqs.productImg,'productPrice':reqs.productPrice,'productData':reqs.productData,"productBrand":reqs.productBrand,'kindId':reqs.kindId}
    if(!reqs.productId){
      return;
    }
    connection.query('update product set ? where productId='+reqs.productId+'',product,function(err, result) {
      console.log(result);
      if(result.warningCount ===0){
        var date = {res:'1',msg: "商品分类修改成功"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }else{
        var date = {res:'0',msg: "商品分类修改失败"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }
    });   //查询
    return;
  }
  /* ----------修改商品个体-------------- */

  /* ----------通过商品ID删除商品-------------- */ 
  if(req.query.api ==='deleteProductById'){
    connection.query("delete FROM product where productId = '"+reqs.productId+"'", function(err, result) {
      console.log('deleteProductById-----');
      if (err) console.error(err.stack);
      if(result.warningCount ===0){
        var data = {res:'1',msg: "商品删除成功"};
        res.send(callback + '(' + JSON.stringify(data) + ')');
      }else{
        var data = {res:'0',msg: "商品删除失败"};
        res.send(callback + '(' + JSON.stringify(data) + ')');
      }
    });   //查询
    return;
  }
  /* ----------删除商品-------------- */ 

  /* ----------通过选择商品名称查询商品信息-------------- */ 
  if(req.query.api ==='searchProductBySelest'){
    connection.query("select * FROM product where productName = '"+reqs.productName+"'", function(err, rows, fields) {
      console.log('searchProductById-----');
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "商品信息查询成功",product:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无此商品信息",product:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询商品分类-------------- */

  /* ----------通过选择商品类型查询商品信息-------------- */ 
  if(req.query.api ==='searchProductByType'){
    connection.query("select * FROM product where productType = '"+reqs.productType+"'", function(err, rows, fields) {
      console.log('searchProductByType-----');
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "商品信息查询成功",product:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无此商品信息",product:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询商品分类-------------- */ 

  /* ----------通过选择商品属性查询商品信息-------------- */ 
  if(req.query.api ==='searchProductByVersion'){
    console.log(reqs);
    connection.query("select * FROM product where productVersion = '"+reqs.productVersion+"'and productName='"+reqs.productName+"'", function(err, rows, fields) {
      console.log('searchProductByVersion-----');
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "商品信息查询成功",product:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无此商品信息",product:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询商品分类-------------- */ 

  /* ----------通过输入字段查询商品信息-------------- */ 
  if(req.query.api ==='searchProductByKeyword'){
    console.log(reqs);
    connection.query("select * FROM product where CONCAT(`productName`,`productVersion`,`productType`,`productBrand`) LIKE '%"+reqs.keyword+"%'", function(err, rows, fields) {
      console.log('searchProductByKeyword-----');
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "商品查询成功",product:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无此商品信息",product:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询商品分类-------------- */ 

  /* ----------通过商品分类查询商品信息-------------- */ 
  if(req.query.api ==='searchProductByType'){
    console.log(reqs);
    connection.query("select * FROM product where productType='"+reqs.productType+"'", function(err, rows, fields) {
      console.log('searchProductByType-----');
      if (err) console.error(err.stack);

      if(rows.length>0){
        var result = {res:'1',msg: "商品查询成功",product:rows};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }else{
        var result = {res:'0',msg: "无此商品信息",product:''};
        res.send(callback + '(' + JSON.stringify(result) + ')');
      }
    });   //查询
    return;
  }
  /* ----------查询商品分类-------------- */ 

  /* ----------创建购物车-------------- */ 
  if(req.query.api ==='buyShopCart'){
    console.log('buyShopCart-------------------');
    connection.query("select * FROM shoppingCart where userId = '"+reqs.userId+"'", function(err, rows, fields) {
      if (err) console.error(err.stack);
      var proIdList = [];
      var shoppingPrice = 0;//商品总价
      var shoppingNum = 0;//商品数量
      reqs.productIdList = eval('('+reqs.productIdList+')');//提交的购物车商品id转对象
      

      if(rows.length>0){//提交的购物车商品与数据库中存在的合并
        rows[0].productIdList = eval('('+rows[0].productIdList+')');
        for(var i=0;i<rows[0].productIdList.length;i++){
          reqs.productIdList.push(rows[0].productIdList[i]);
        }
      }
      var str1 = [];
      reqs.productIdList[0].num = parseInt(reqs.productIdList[0].num);
      str1.push(reqs.productIdList[0]);
      for(var i=1;i<reqs.productIdList.length;i++){//数据重复合并
        reqs.productIdList[i].num = parseInt(reqs.productIdList[i].num);
        var repeat  =false;
        for(var j = 0;j<str1.length;j++){
          if(str1[j].productId===reqs.productIdList[i].productId){
            repeat = true;
            str1[j].num = parseInt(str1[j].num) +parseInt(reqs.productIdList[i].num);
            break;
          }
        }
        if(!repeat){
          str1.push(reqs.productIdList[i]);
        }
      }
      reqs.productIdList = str1;
      var proIdList = reqs.productIdList;

      var sqls ={};
      for(var i=0;i<reqs.productIdList.length;i++){
         sql = {
          product:"select * FROM product where productId = '"+reqs.productIdList[i].productId+"'"
        };
        sqls[i]= sql.product;
      }
      async.map(sqls, function(item, callback) {
        connection.query(item, function(err, results) {
          callback(err, results[0]);
        });
      }, function(err, results) {
        if(err) {
          console.log(err);
          var result = {res:'0',msg: "购物车修改失败",data:results};
          res.send(callback + '(' + JSON.stringify(result) + ')');
        } else {
          for(var i=0;i<reqs.productIdList.length;i++){//商品总数、总价计算
            shoppingNum = parseInt(shoppingNum)+parseInt(reqs.productIdList[i].num);
            shoppingPrice = parseInt(shoppingPrice)+parseInt(reqs.productIdList[i].num)*parseInt(results[i].productPrice);
          }
          var shoppingCart = {'shoppingPrice': parseInt(shoppingPrice),'shoppingNum':parseInt(shoppingNum),'productIdList':JSON.stringify(proIdList),'userId':parseInt(reqs.userId)}
          if(rows.length<=0){
            connection.query('insert INTO shoppingCart set ?', shoppingCart, function(err, result) {
              if (err) console.error(err.stack);
              console.log('insert lisi');     
            });
            return;
          }else{
            connection.query('update shoppingCart set ? where userId='+parseInt(reqs.userId)+'',shoppingCart,function(err, result) {
              console.log(result);
              if(result.warningCount ===0){
                var date = {res:'1',msg: "购物车修改成功"};
                res.send(callback + '(' + JSON.stringify(date) + ')');
              }else{
                var date = {res:'0',msg: "购物车修改失败"};
                res.send(callback + '(' + JSON.stringify(date) + ')');
              }
            });   //查询
            return;
          }
          var result = {res:'1',msg: "购物车修改成功",data:results};
          res.send(callback + '(' + JSON.stringify(result) + ')');
        }
      });
      return;
    });   //查询
    return;
  }
  /* ----------创建购物车-------------- */

  /* ----------修改购物车-------------- */ 
  if(req.query.api ==='updateShopCart'){
    console.log('updateShopCart-------------------');
    connection.query("select * FROM shoppingCart where userId = '"+reqs.userId+"'", function(err, rows, fields) {
      if (err) console.error(err.stack);
      var shoppingPrice = 0;//商品总价
      var shoppingNum = 0;//商品数量
      reqs.productIdList = eval('('+reqs.productIdList+')');//提交的购物车商品id转对象
      for(var i=0;i<reqs.productIdList.length;i++){
        delete reqs.productIdList[i].productInfo
      }
      var proIdList = reqs.productIdList;


      var sqls ={};
      for(var i=0;i<reqs.productIdList.length;i++){
         sql = {
          product:"select * FROM product where productId = '"+reqs.productIdList[i].productId+"'"
        };
        sqls[i]= sql.product;
      }
      async.map(sqls, function(item, callback) {
        connection.query(item, function(err, results) {
          callback(err, results[0]);
        });
      }, function(err, results) {
        if(err) {
          console.log(err);
          var result = {res:'0',msg: "购物车修改失败",data:results};
          res.send(callback + '(' + JSON.stringify(result) + ')');
        } else {
          for(var i=0;i<reqs.productIdList.length;i++){//商品总数、总价计算
            shoppingNum = parseInt(shoppingNum)+parseInt(reqs.productIdList[i].num);
            shoppingPrice = parseInt(shoppingPrice)+parseInt(reqs.productIdList[i].num)*parseInt(results[i].productPrice);
          }
          var shoppingCart = {'shoppingPrice': parseInt(shoppingPrice),'shoppingNum':parseInt(shoppingNum),'productIdList':JSON.stringify(proIdList),'userId':parseInt(reqs.userId)}
          if(rows.length<=0){
            connection.query('insert INTO shoppingCart set ?', shoppingCart, function(err, result) {
              if (err) console.error(err.stack);
              console.log('insert lisi');     
            });
            return;
          }else{
            connection.query('update shoppingCart set ? where userId='+parseInt(reqs.userId)+'',shoppingCart,function(err, result) {
              console.log(result);
              if(result.warningCount ===0){
                var date = {res:'1',msg: "商品分类修改成功"};
                res.send(callback + '(' + JSON.stringify(date) + ')');
              }else{
                var date = {res:'0',msg: "商品分类修改失败"};
                res.send(callback + '(' + JSON.stringify(date) + ')');
              }
            });   //查询
            return;
          }
          var result = {res:'1',msg: "购物车修改成功",data:results};
          res.send(callback + '(' + JSON.stringify(result) + ')');
        }
      });
      return;
    });   //查询
    return;
  }
  /* ----------修改购物车-------------- */

  /* ----------购物车查询-------------- */ 
  if(req.query.api ==='searchShopCart'){
    console.log(reqs);
    connection.query("select * FROM shoppingCart where userId = '"+reqs.userId+"'", function(err, rows, fields) {
      if (err) console.error(err.stack);
      console.log(rows);
      if(rows.length<=0){
        return;
      }
      rows[0].productIdList = eval('('+rows[0].productIdList+')');
      var sqls ={};
      for(var i=0;i<rows[0].productIdList.length;i++){
         sql = {
          product:"select * FROM product where productId = '"+rows[0].productIdList[i].productId+"'"
        };
        sqls[i]= sql.product;
      }
      async.map(sqls, function(item, callback) {
        connection.query(item, function(err, results) {
          callback(err, results[0]);
        });
      }, function(err, results) {
        if(err) {
          console.log(err);
        } else {
          var cart = rows[0];
          for(var i=0;i<cart.productIdList.length;i++){
            cart.productIdList[i].productInfo = results[i];
          }
          var result = {res:'1',msg: "购物车查询成功",data:cart};
          res.send(callback + '(' + JSON.stringify(result) + ')');
        }
      });
    });   //查询
    return;
  }
  /* ----------购物车查询-------------- */ 

  /* ----------productId列表，查询商品信息-------------- */ 
  if(req.query.api ==='searchProInfoById'){
    console.log(reqs);
      reqs.productIdList = eval('('+reqs.productIdList+')');
      var shoppingPrice = 0;//商品总价
      var shoppingNum = 0;//商品数量
      var sqls ={};
      for(var i=0;i<reqs.productIdList.length;i++){
         sql = {
          product:"select * FROM product where productId = '"+reqs.productIdList[i].productId+"'"
        };
        sqls[i]= sql.product;
      }
      // console.log(sqls);
      async.map(sqls, function(item, callback) {
        connection.query(item, function(err, results) {
          callback(err, results[0]);
        });
      }, function(err, results) {
        if(err) {
          console.log(err);
        } else {
          var cart = reqs.productIdList;
          for(var i=0;i<cart.length;i++){
            cart[i].productInfo = results[i];
          }
          for(var i=0;i<reqs.productIdList.length;i++){//商品总数、总价计算
            shoppingNum = parseInt(shoppingNum)+parseInt(reqs.productIdList[i].num);
            shoppingPrice = parseInt(shoppingPrice)+parseInt(reqs.productIdList[i].num)*parseInt(results[i].productPrice);
          }
          var shoppingCart = {'shoppingPrice': parseInt(shoppingPrice),'shoppingNum':parseInt(shoppingNum),'productIdList':JSON.stringify(cart)}
          console.log(results);
          var result = {res:'1',msg: "商品查询成功",data:shoppingCart};
          // console.log(result);
          res.send(callback + '(' + JSON.stringify(result) + ')');
        }
      });
    return;
  }
  /* ----------productId列表，查询商品信息-------------- */ 

  /* ----------创建订单-------------- */ 
  if(req.query.api ==='submitOrder'){
    console.log(reqs);
    reqs.orderProductIdList = eval('('+reqs.orderProductIdList+')');//提交的购物车商品id转对象
    for(var i=0;i<reqs.orderProductIdList.length;i++){
      delete reqs.orderProductIdList[i].productInfo
    }
    var order = {'orderConsignee':reqs.orderConsignee,'orderState':reqs.orderState,'orderAddress':reqs.orderAddress,'orderPhone':reqs.orderPhone,'orderPayType':reqs.orderPayType,'orderProductIdList':JSON.stringify(reqs.orderProductIdList),'userId':reqs.userId,"orderPrice":reqs.orderPrice,'orderTime':reqs.orderTime,'orderNum':reqs.orderNum}
    console.log(order);
    connection.query('insert INTO  `order` set ?',order, function(err, result) {//创建订单
      if (err) console.error(err.stack);
      console.log('insert lisi'); //订单创建完成
      connection.query("select * FROM shoppingCart where userId = '"+reqs.userId+"'", function(err, rows, fields) {//查询购物车
        // console.log(rows);
        var productIdList = eval('('+rows[0].productIdList+')');
        for(var i=0;i<productIdList.length;i++){//删除结算的商品
          for(var j=0;j<reqs.orderProductIdList.length;j++){
            if(productIdList[i].productId===reqs.orderProductIdList[j].productId){
              productIdList.splice(i,1);
            }
          }
        }
        // console.log(productIdList);
        var shoppingPrice = 0;//商品总价
        var shoppingNum = 0;//商品数量
        var sqls ={};
        for(var i=0;i<productIdList.length;i++){
         sql = {
          product:"select * FROM product where productId = '"+productIdList[i].productId+"'"
          };
          sqls[i]= sql.product;
        }
        // console.log(sqls);
        async.map(sqls, function(item, callback) {
        connection.query(item, function(err, results) {
          callback(err, results[0]);
          });
        }, function(err, results) {
          if(err) {
            console.log(err);
            var result = {res:'0',msg: "购物车修改失败",data:results};
            res.send(callback + '(' + JSON.stringify(result) + ')');
          } else {
            for(var i=0;i<productIdList.length;i++){//商品总数、总价计算
              shoppingNum = parseInt(shoppingNum)+parseInt(productIdList[i].num);
              shoppingPrice = parseInt(shoppingPrice)+parseInt(productIdList[i].num)*parseInt(results[i].productPrice);
            }
            var shoppingCart = {'shoppingPrice': parseInt(shoppingPrice),'shoppingNum':parseInt(shoppingNum),'productIdList':JSON.stringify(productIdList),'userId':parseInt(reqs.userId)}
            console.log(shoppingCart);
            connection.query('update shoppingCart set ? where userId='+parseInt(reqs.userId)+'',shoppingCart,function(err, result) {
              // console.log(result);
              if(result.warningCount ===0){
                console.log('购物车修改成功');
              }else{
                console.log('购物车修改失败');
              }
            });   //查询
            return;
          }
        });
        return;
      });
    });
    var result = {res:'1',msg: "订单创建成功"};
    res.send(callback + '(' + JSON.stringify(result) + ')');
    return;
  }
  /* ----------创建订单-------------- */

  /* ----------所有订单查询-------------- */ 
  if(req.query.api ==='searchOrder'){
    console.log(reqs);
    connection.query("select * FROM `order` ORDER BY orderTime desc", function(err, rows, fields) {
      if (err) console.error(err.stack);
      // console.log(rows);
      if(rows.length<=0){
        var result = {res:'0',msg: "无订单",data:rows};
        res.send(callback +  '(' + JSON.stringify(result) + ')');
        return;
      }
      var list = [];
      for(var i=0;i<rows.length;i++){
        rows[i].orderProductIdList = eval('('+rows[i].orderProductIdList+')');
        rows[i].orderAddress = eval('('+rows[i].orderAddress+')');
      }
      for(var i=0;i<rows.length;i++){
        for(var j=0;j<rows[i].orderProductIdList.length;j++){
          rows[i].orderProductIdList[j].orderId = rows[i].orderId;
          list.push(rows[i].orderProductIdList[j]);
        }
      }
      // console.log(list);
      if (err) console.error(err.stack);

      var sqls ={};
      for(var i=0;i<list.length;i++){
         sql = {
          product:"select * FROM product where productId = '"+list[i].productId+"'"
        };
        sqls[i]= sql.product;
      }
      console.log(sqls);
      async.map(sqls, function(item, callback) {
        connection.query(item, function(err, results) {
          callback(err, results[0]);
        });
      }, function(err, results) {
        if(err) {
          console.log(err);
        } else {
          console.log(result);
          for(var i=0;i<results.length;i++){
            results[i].productColor = eval('('+results[i].productColor+')');
            results[i].productVersion = eval('('+results[i].productVersion+')');
            list[i].productInfo = results[i];
          }
          for(var i=0;i<rows.length;i++){
            for(var j=0;j<list.length;j++){
              for(var k=0;k<rows[i].orderProductIdList.length;k++){
                if(rows[i].orderId === list.orderId && rows[i].orderProductIdList[k].productId === list.productId){
                  rows[i].orderProductIdList[k].productInfo = rows[i].productInfo;
                }
              }
            }
          }
          console.log(rows);
          var result = {res:'1',msg: "订单查询成功",data:rows};
          res.send(callback +  '(' + JSON.stringify(result) + ')');
        }
      });
      return;
    });   //查询
    return;
  }
  /* ----------所有订单查询-------------- */ 

  /* ----------通过userId,订单状态查询订单-------------- */ 
  if(req.query.api ==='searchOrderByStateAnduserId'){
    console.log(reqs);
    connection.query("select * FROM `order` where userId = '"+reqs.userId+"'and orderState='"+reqs.orderState+"'ORDER BY orderTime desc", function(err, rows, fields) {
      if (err) console.error(err.stack);
      // console.log(rows);
      if(rows.length<=0){
        var result = {res:'0',msg: "无订单",data:rows};
        res.send(callback +  '(' + JSON.stringify(result) + ')');
        return;
      }
      var list = [];
      for(var i=0;i<rows.length;i++){
        rows[i].orderProductIdList = eval('('+rows[i].orderProductIdList+')');
        rows[i].orderAddress = eval('('+rows[i].orderAddress+')');
      }
      for(var i=0;i<rows.length;i++){
        for(var j=0;j<rows[i].orderProductIdList.length;j++){
          rows[i].orderProductIdList[j].orderId = rows[i].orderId;
          list.push(rows[i].orderProductIdList[j]);
        }
      }
      // console.log(list);
      if (err) console.error(err.stack);

      var sqls ={};
      for(var i=0;i<list.length;i++){
         sql = {
          product:"select * FROM product where productId = '"+list[i].productId+"'"
        };
        sqls[i]= sql.product;
      }
      // console.log(sqls);
      async.map(sqls, function(item, callback) {
        connection.query(item, function(err, results) {
          callback(err, results[0]);
        });
      }, function(err, results) {
        if(err) {
          console.log(err);
        } else {
          for(var i=0;i<results.length;i++){
            results[i].productColor = eval('('+results[i].productColor+')');
            results[i].productVersion = eval('('+results[i].productVersion+')');
            list[i].productInfo = results[i];
          }
          for(var i=0;i<rows.length;i++){
            for(var j=0;j<list.length;j++){
              for(var k=0;k<rows[i].orderProductIdList.length;k++){
                if(rows[i].orderId === list.orderId && rows[i].orderProductIdList[k].productId === list.productId){
                  rows[i].orderProductIdList[k].productInfo = rows[i].productInfo;
                }
              }
            }
          }
          // console.log(rows);
          var result = {res:'1',msg: "订单查询成功",data:rows};
          console.log(result);res.send(callback +  '(' + JSON.stringify(result) + ')');
        }
      });
      return;
    });   //查询
    return;
  }
  /* ----------通过userId,订单状态查询订单-------------- */ 


  /* ----------个人订单查询-------------- */ 
  if(req.query.api ==='searchOrderByuserId'){
    console.log(reqs);
    connection.query("select * FROM `order` where userId = '"+reqs.userId+"'ORDER BY orderTime desc", function(err, rows, fields) {
      if (err) console.error(err.stack);
      console.log(rows);
      if(!rows){
        var result = {res:'0',msg: "无订单",data:rows};
        res.send(callback +  '(' + JSON.stringify(result) + ')');
        return;
      }
      var list = [];
      for(var i=0;i<rows.length;i++){
        rows[i].orderProductIdList = eval('('+rows[i].orderProductIdList+')');
        rows[i].orderAddress = eval('('+rows[i].orderAddress+')');
      }
      for(var i=0;i<rows.length;i++){
        for(var j=0;j<rows[i].orderProductIdList.length;j++){
          rows[i].orderProductIdList[j].orderId = rows[i].orderId;
          list.push(rows[i].orderProductIdList[j]);
        }
      }
      // console.log(list);
      if (err) console.error(err.stack);

      var sqls ={};
      for(var i=0;i<list.length;i++){
         sql = {
          product:"select * FROM product where productId = '"+list[i].productId+"'"
        };
        sqls[i]= sql.product;
      }
      // console.log(sqls);
      async.map(sqls, function(item, callback) {
        connection.query(item, function(err, results) {
          callback(err, results[0]);
        });
      }, function(err, results) {
        if(err) {
          console.log(err);
        } else {
          for(var i=0;i<results.length;i++){
            results[i].productColor = eval('('+results[i].productColor+')');
            results[i].productVersion = eval('('+results[i].productVersion+')');
            list[i].productInfo = results[i];
          }
          for(var i=0;i<rows.length;i++){
            for(var j=0;j<list.length;j++){
              for(var k=0;k<rows[i].orderProductIdList.length;k++){
                if(rows[i].orderId === list.orderId && rows[i].orderProductIdList[k].productId === list.productId){
                  rows[i].orderProductIdList[k].productInfo = rows[i].productInfo;
                }
              }
            }
          }
          // console.log(rows);

          var result = {res:'1',msg: "订单查询成功",data:rows};
          console.log(result);res.send(callback +  '(' + JSON.stringify(result) + ')');
        }
      });
      return;
    });   //查询
    return;
  }
  /* ----------个人订单查询-------------- */ 

  /* ----------通过订单状态查询订单-------------- */ 
  if(req.query.api ==='searchOrderByState'){
    console.log(reqs);
    connection.query("select * FROM `order` where orderState='"+reqs.orderState+"'ORDER BY orderTime desc", function(err, rows, fields) {
      if (err) console.error(err.stack);
      // console.log(rows);
      if(rows.length<=0){
        var result = {res:'0',msg: "无订单",data:rows};
        res.send(callback +  '(' + JSON.stringify(result) + ')');
        return;
      }
      var list = [];
      for(var i=0;i<rows.length;i++){
        rows[i].orderProductIdList = eval('('+rows[i].orderProductIdList+')');
        rows[i].orderAddress = eval('('+rows[i].orderAddress+')');
      }
      for(var i=0;i<rows.length;i++){
        for(var j=0;j<rows[i].orderProductIdList.length;j++){
          rows[i].orderProductIdList[j].orderId = rows[i].orderId;
          list.push(rows[i].orderProductIdList[j]);
        }
      }
      // console.log(list);
      if (err) console.error(err.stack);

      var sqls ={};
      for(var i=0;i<list.length;i++){
         sql = {
          product:"select * FROM product where productId = '"+list[i].productId+"'"
        };
        sqls[i]= sql.product;
      }
      // console.log(sqls);
      async.map(sqls, function(item, callback) {
        connection.query(item, function(err, results) {
          callback(err, results[0]);
        });
      }, function(err, results) {
        if(err) {
          console.log(err);
        } else {
          for(var i=0;i<results.length;i++){
            results[i].productColor = eval('('+results[i].productColor+')');
            results[i].productVersion = eval('('+results[i].productVersion+')');
            list[i].productInfo = results[i];
          }
          for(var i=0;i<rows.length;i++){
            for(var j=0;j<list.length;j++){
              for(var k=0;k<rows[i].orderProductIdList.length;k++){
                if(rows[i].orderId === list.orderId && rows[i].orderProductIdList[k].productId === list.productId){
                  rows[i].orderProductIdList[k].productInfo = rows[i].productInfo;
                }
              }
            }
          }
          // console.log(rows);
          var result = {res:'1',msg: "订单查询成功",data:rows};
          console.log(result);res.send(callback +  '(' + JSON.stringify(result) + ')');
        }
      });
      return;
    });   //查询
    return;
  }
  /* ----------通过订单状态查询订单-------------- */ 

  /* ----------订单id查询-------------- */ 
  if(req.query.api ==='searchOrderById'){
    console.log(reqs);
    connection.query("select * FROM `order` where orderId = '"+reqs.orderId+"'", function(err, rows, fields) {
      console.log(rows[0]);
      console.log('--------------------------------');
      var list = [];
      if(rows.length>0){
        rows[0].orderProductIdList = eval('('+rows[0].orderProductIdList+')');
        rows[0].orderAddress = eval('('+rows[0].orderAddress+')');
      }
      for(var j=0;j<rows[0].orderProductIdList.length;j++){
        rows[0].orderProductIdList[j].orderId = rows[0].orderId;
        list.push(rows[0].orderProductIdList[j]);
      }
      console.log(list);
      if (err) console.error(err.stack);

      var sqls ={};
      for(var i=0;i<list.length;i++){
         sql = {
          product:"select * FROM product where productId = '"+list[i].productId+"'"
        };
        sqls[i]= sql.product;
      }
      // console.log(sqls);
      async.map(sqls, function(item, callback) {
        connection.query(item, function(err, results) {
          callback(err, results[0]);
        });
      }, function(err, results) {
        if(err) {
          console.log(err);
        } else {
          for(var i=0;i<results.length;i++){
            results[i].productColor = eval('('+results[i].productColor+')');
            results[i].productVersion = eval('('+results[i].productVersion+')');
            list[i].productInfo = results[i];
          }
            for(var j=0;j<list.length;j++){
              for(var k=0;k<rows[0].orderProductIdList.length;k++){
                if(rows[0].orderId === list.orderId && rows[0].orderProductIdList[k].productId === list.productId){
                  rows[0].orderProductIdList[k].productInfo = rows[0].productInfo;
                }
              }
            }
          // console.log(rows[0]);
          var result = {res:'1',msg: "订单查询成功",data:rows[0]};
          console.log(result);res.send(callback +  '(' + JSON.stringify(result) + ')');
        }
      });
      return;
    });   //查询
    return;
  }
  /* ----------订单id查询-------------- */ 

  // /* ----------通过订单ID删除订单-------------- */ 
  // if(req.query.api ==='deleteOrderById'){
  //   connection.query("delete FROM `order` where orderId = '"+reqs.orderId+"'", function(err, result) {
  //     console.log('deleteOrderById-----');
  //     if (err) console.error(err.stack);
  //     if(result.warningCount ===0){
  //       var data = {res:'1',msg: "订单删除成功"};
  //       res.send(callback + '(' + JSON.stringify(data) + ')');
  //     }else{
  //       var data = {res:'0',msg: "订单删除失败"};
  //       res.send(callback + '(' + JSON.stringify(data) + ')');
  //     }
  //   });   //查询
  //   return;
  // }
  // /* ----------删除订单-------------- */ 

  /* ----------删除所有订单-------------- */ 
  if(req.query.api ==='deleteOrder'){
    connection.query("delete FROM `order`", function(err, result) {
      console.log('deleteOrderById-----');
      if (err) console.error(err.stack);
      if(result.warningCount ===0){
        var data = {res:'1',msg: "订单删除成功"};
        res.send(callback + '(' + JSON.stringify(data) + ')');
      }else{
        var data = {res:'0',msg: "订单删除失败"};
        res.send(callback + '(' + JSON.stringify(data) + ')');
      }
    });   //查询
    return;
  }
  /* ----------删除订单-------------- */ 

  /* ----------修改订单状态-------------- */ 
  if(req.query.api ==='updateOrderState'){
    console.log(reqs);
    if(!reqs.orderId){
      var date = {res:'0',msg: "没有获取到订单号"};
      res.send(callback + '(' + JSON.stringify(date) + ')');
      return;
    }
    connection.query("select * FROM `order` where orderId = '"+reqs.orderId+"'", function(err, rows, fields) {
      var order = {'orderState': reqs.orderState}//0.待发货 1.待收货 2.待评价 -1.已取消,-2 删除
      if(reqs.orderState==='-1' && rows[0].orderState!='0'){
        if(rows[0].orderState=='1'){
          var date = {res:'0',msg: "订单已发货无法进行此操作，请刷新页面"};
        }
        if(rows[0].orderState=='2'){
          var date = {res:'0',msg: "订单已接收无法进行此操作，请刷新页面"};
        }
        if(rows[0].orderState=='3'){
          var date = {res:'0',msg: "订单已完成无法进行此操作，请刷新页面"};
        }
        if(rows[0].orderState=='-1'){
          var date = {res:'0',msg: "订单已取消无法进行此操作，请刷新页面"};
        }
        if(rows[0].orderState=='-2'){
          var date = {res:'0',msg: "订单已删除无法进行此操作，请刷新页面"};
        }
        res.send(callback + '(' + JSON.stringify(date) + ')');
        return false;
      }
      connection.query('update `order` set ? where orderId='+reqs.orderId+'',order,function(err, result) {
        if (err) console.error(err.stack);
        console.log(result);
        if(result.warningCount ===0){
          var date = {res:'1',msg: "修改订单状态成功"};
          res.send(callback + '(' + JSON.stringify(date) + ')');
        }else{
          var date = {res:'0',msg: "修改订单状态失败"};
          res.send(callback + '(' + JSON.stringify(date) + ')');
        }
      });
      return;
    });   //查询
    return;
  }
  /* ----------修改订单状态-------------- */

  /* ----------订单评价-------------- */ 
  if(req.query.api ==='orderComment'){
    console.log(reqs);
    if(!reqs.productId){
      var date = {res:'0',msg: "没有获取到商品Id"};
      res.send(callback + '(' + JSON.stringify(date) + ')');
      return;
    }
    var comment = {'productId':reqs.productId,'userId':reqs.userId,'userName':reqs.userName,'orderId':reqs.orderId,'kindId':reqs.kindId,'commentCon':reqs.commentCon,'commentSource':reqs.commentSource,'commentTime':reqs.commentTime,'commentImg1':reqs.commentImg1,"commentImg2":reqs.commentImg2}
    connection.query('insert INTO comment set ?', comment, function(err, result) {
      if (err) throw err;
      if(result.warningCount ===0){
        connection.query("select * FROM `order` where orderId = '"+reqs.orderId+"'", function(err, rows, fields) {
          var list = [];
          if(rows.length>0){
            rows[0].orderProductIdList = eval('('+rows[0].orderProductIdList+')');
            rows[0].orderAddress = eval('('+rows[0].orderAddress+')');
          }
          for(var j=0;j<rows[0].orderProductIdList.length;j++){//筛选出
              console.log('reqs.productId:'+reqs.productId);
            if(rows[0].orderProductIdList[j].productId == reqs.productId){
              console.log('reqs.productId:'+reqs.productId);
              rows[0].orderProductIdList[j].commentState = '1';
            }
          }
          console.log(rows[0].orderProductIdList);
          console.log('-----------------------');
          var orderProductIdList = JSON.stringify(rows[0].orderProductIdList);
          var order = {'orderProductIdList': orderProductIdList};//修改订单商品评价状态
          connection.query('update `order` set ? where orderId='+reqs.orderId+'',order,function(err, result2) {
            if (err) console.error(err.stack);

            console.log(result);
            if(result2.warningCount ===0){
              var date = {res:'1',msg: "订单评价成功"};
              res.send(callback + '(' + JSON.stringify(date) + ')');
            }else{
              var date = {res:'0',msg: "修改订单状态失败"};
              res.send(callback + '(' + JSON.stringify(date) + ')');
            }

          });   //查询
          // console.log(list);
          return;
        });   //查询
      }else{
        var date = {res:'0',msg: "订单评价失败"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }    
    });
    return;
  }
  /* ----------订单评价-------------- */

  /* ----------商品评价查询-------------- */ 
  if(req.query.api ==='searchProductComment'){
    console.log(reqs);
    connection.query("select * FROM comment where kindId = '"+reqs.kindId+"' ORDER BY commentTime desc", function(err, rows, fields) {
      if (err) console.error(err.stack);
      var sqls ={};
      for(var i=0;i<rows.length;i++){
         sql = {
          user:"select * FROM user where userId = '"+rows[i].userId+"'"
        };
        sqls[i]= sql.user;
      }
      async.map(sqls, function(item, callback) {
        connection.query(item, function(err, results) {
          callback(err, results[0]);
        });
      }, function(err, results) {
        if(err) {
          console.log(err);
        } else {
          for(var i=0;i<results.length;i++){
            rows[i].userInfo = results[i];
          }
          var result = {res:'1',msg: "订单查询成功",data:rows};
          res.send(callback +  '(' + JSON.stringify(result) + ')');
        }
      });
      return;
    }); 
    return;
  }

  /* ----------商品评价查询-------------- */

  /* ----------商品评价删除-------------- */ 
  if(req.query.api ==='deleteComment'){
    console.log(reqs);
    connection.query("delete from comment where commentId='"+reqs.commentId+"'", function(err, result) {
      if (err) console.error(err.stack);
      if(result.warningCount ===0){
        var date = {res:'1',msg: "评价删除成功"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }else{
        var date = {res:'0',msg: "评价删除失败"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }
    }); 
    return;
  }

  /* ----------商品评价删除-------------- */

  /* ----------商品评价回复-------------- */ 
  if(req.query.api ==='commentReply'){
    console.log(reqs);
    var comment = {'systemComment':reqs.systemComment}
    if(!reqs.systemComment){
      return;
    }
    connection.query("update comment set ? where commentId='"+reqs.commentId+"'",comment,function(err, result) {
      console.log(result);
      if(result.warningCount ===0){
        var date = {res:'1',msg: "评价回复成功"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }else{
        var date = {res:'0',msg: "评价回复失败"};
        res.send(callback + '(' + JSON.stringify(date) + ')');
      }
    });   //查询
    return;
  }
  /* ----------商品评价删除-------------- */



});

var mysql= require('mysql');
var connection = mysql.createConnection({
  host     : '60.205.210.86',
  user     : 'root',
  password : 'fallen',
  database : 'mishop'
});
connection.connect();  //链接数据库

// connection.query('select * FROM user', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('The solution is: ', rows);
// });   //查询
// var user  = {'userName': '胡辉','userPhone':'15862472342','userAddress':'苏州市','userPassword':'123456'};
// connection.query('insert INTO user set ?', user, function(err, result) {
//   if (err) throw err;
//   console.log('insert lisi');     
// });
// console.log(query.sql);  //增加
// connection.query('update users set age="20" where username="张三"',function(err, result) {
//     if (err) throw err;

//     console.log('updated zhangsan\'s age to 20');
//     console.log(result);
//     console.log('\n');
// }); //修改

// connection.query('delete from  users where username="李四"', function(err, result) {
//     if (err) throw err;

//     console.log('deleted lisi');
//     console.log(result);
//     console.log('\n');
// }); //删除

var server = app.listen(3200, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("huhui，访问地址为 http://%s:%s", host, port);
});