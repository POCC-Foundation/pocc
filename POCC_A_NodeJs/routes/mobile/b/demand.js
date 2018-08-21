/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 端 需求栏目
 /demand/ 需求列表
 /demand/:id/show
/demand/:id/join 参与需求

 */

var express = require('express');
var rp = require('request-promise');
var config = require('../../config/config');
var router = express.Router();

var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody.srcSource = "index";
    htmlBody.title = "借款需求";
    res.locals._layoutFile = "./mobile/init/singer.html";
    htmlBody.isLogin = 0;
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user;
        res.locals.userId = res.locals.user.id;
        res.locals.company = res.locals.user.company;
        htmlBody.isLogin = 1;
    } else {
        
    }
    res.locals.nav_index=1;///底部导航条的选中状态，按从左到右 1--4
    next();
});
router.get('/', function (req, res, next) { 
     
     var urlParam=req.originalUrl.replace("/mzb/demand","");
    
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
}); 
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/demand/demandList', htmlBody);
}); 

///借款需求
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
//企业信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.id)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


///借款需求
router.get('/:id/join', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
router.get('/:id/show', function (req, res, next) { 
    htmlBody.backUrl = "/mzb/demand/";
    res.render('mobile/b/demand/demandShow', htmlBody);
}); 
module.exports = router;