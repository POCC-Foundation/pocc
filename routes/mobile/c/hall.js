/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * c端 大厅栏目
 * /hall/ 大厅首页

 */

var express = require('express');
var rp = require('request-promise');
var config = require('../../config/config');
var router = express.Router();

var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody.srcSource = "index";
    htmlBody.title = "大厅";
    htmlBody.isLogin = 0;
    res.locals._layoutFile = "./mobile/init/singer_c.html";
    if (res.locals.user) {
    	res.locals.currentUser = res.locals.user.data;
    	res.locals.userId = res.locals.user.data.id;
    	 htmlBody.user=res.locals.user.data;
    	 htmlBody.userId=res.locals.user.data.id;
        htmlBody.isLogin = 1;
    } else {
        res.locals.currentUser = "";
        res.locals.userId = "";
    }
    res.locals.nav_index = 1;///底部导航条的选中状态，按从左到右 1--4
    next();
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    res.locals._layoutFile = false;
    htmlBody.backUrl = "";
    res.render('mobile/c/hall/index', htmlBody);
}); 


//企业信息
router.get('/loanquest/detail/:id', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.loanrequest.inCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.inCompany = body1.data;//// 
        console.log("这里借款需求-inCompany详情：" + body);
        next();
    }); 
}); 

//获取担保记录
router.get('/loanquest/detail/:id', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
	next();
}); 

router.get('/loanquest/detail/:id', function (req, res, next) { 
	   rp(config.getUrl(req, res, "/api/v1/loanensure/listWithUser?loanRequestId="+htmlBody.loanrequest.id)).then(function (body) {
	        var body1 = JSON.parse(body); 
	        htmlBody.ensures = body1;//// 
	        console.log("担保记录-ensures：" + body);
	        htmlBody.backUrl = "/mzc/hall/loanquest/list";
	        res.render('mobile/c/hall/loanRequest/detail', htmlBody);
	    }); 
  
}); 

//公司详情
//读公司信息
router.get('/company/:id/show', function (req, res, next) {
  console.log("in 公司详情：" + req.params.id);
  rp(config.getUrl(req, res, "/api/v1/company/getOne?id=" + req.params.id)).then(function (body) {
      var body1 = JSON.parse(body);
      htmlBody.company = body1;
      console.log("这里公司详情：" + body);
      next();
  });
});


//读加入的联盟
router.get('/company/:id/show', function (req, res, next) {
  console.log("in 读加入的联盟：" + req.params.id);
  rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId=" + req.params.id)).then(function (body) {
      var body1 = JSON.parse(body);
      htmlBody.unionlist = body1;
      console.log("这里读公司加入的联盟：" + body);
      next();
  });
});



//router.get('/', function (req, res, next) {
//    ///暂不加载数据，显示默认界面或者图片。
//   // res.locals._layoutFile = false;
//    htmlBody.title = "个人中心"; 
//    htmlBody.backUrl = "/mzc/demand/";
//    res.render('mobile/c/userCenter/userCenter', htmlBody);
//});

module.exports = router;
