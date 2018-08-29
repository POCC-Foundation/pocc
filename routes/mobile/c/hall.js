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
    res.locals._layoutFile = "./mobile/init/singer.html";
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user;
        res.locals.userId = res.locals.user.id;
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
    res.render('mobile/c/hall/index', htmlBody);
}); 

//分众链保
router.get('/loanquest/list', function (req, res, next) {
	 var urlParam=req.originalUrl.replace("/mzc/hall/loanquest/list","");
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        htmlBody.backUrl = "/mzc/hall";
        console.log("这里借款需求列表：" + body);
        res.render('mobile/c/hall/loanRequest/list', htmlBody);
    });
});

///借款需求
router.get('/loanquest/detail/:id', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 

//企业信息
router.get('/loanquest/detail/:id', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/loanquest/detail/:id', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/loanquest/detail/:id', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


router.get('/loanquest/detail/:id', function (req, res, next) { 
    htmlBody.backUrl = "/mzc/hall/loanquest/list";
    res.render('mobile/c/hall/loanRequest/detail', htmlBody);
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
router.get('/company/:id/show', function (req, res, next) {
  htmlBody.backUrl = "/mzc/store/";
  res.render('mobile/b/company/companyShow', htmlBody);
});
//router.get('/', function (req, res, next) {
//    ///暂不加载数据，显示默认界面或者图片。
//   // res.locals._layoutFile = false;
//    htmlBody.title = "个人中心"; 
//    htmlBody.backUrl = "/mzc/demand/";
//    res.render('mobile/c/userCenter/userCenter', htmlBody);
//});

module.exports = router;
