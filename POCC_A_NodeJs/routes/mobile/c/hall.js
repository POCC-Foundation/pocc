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


//router.get('/', function (req, res, next) {
//    ///暂不加载数据，显示默认界面或者图片。
//   // res.locals._layoutFile = false;
//    htmlBody.title = "个人中心"; 
//    htmlBody.backUrl = "/mzc/demand/";
//    res.render('mobile/c/userCenter/userCenter', htmlBody);
//});

module.exports = router;
