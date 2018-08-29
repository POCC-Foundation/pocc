/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * c端 发现栏目
 * /findc/new 发现栏目-新鲜事
 * /findc/help 发现栏目-探秘
 * /findc/item 发现栏目-排行
 */

var express = require('express');
var rp = require('request-promise');
var config = require('../../config/config');
var router = express.Router();

var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody.imageUrl=config.imageUrl;
    htmlBody.srcSource = "index";
    htmlBody.title = "发现";
    res.locals._layoutFile = "./mobile/init/singer.html";
    htmlBody.isLogin = 0;
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user;
        res.locals.userId = res.locals.user.id;
        htmlBody.isLogin = 1;
    } else {
        res.locals.currentUser = "";
        res.locals.userId = "";
    }
    res.locals.nav_index = 2;///底部导航条的选中状态，按从左到右 1--4
    next();
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
	 rp(config.getUrl(req, res, "/api/v1/article/list?channelId=1")).then(function (body) {
	        var body1 = JSON.parse(body);
	        htmlBody.articleList = body1;////这个地方不能用 htmlBody.body
	        console.log("这里新鲜事列表：" + body1);
	    	htmlBody.backUrl = "";
	        htmlBody.imageUrl=config.imageUrl;
	        res.render('mobile/c/find/index', htmlBody);
	    });

}); 

//新鲜事
router.get('/newThings', function (req, res, next) {
     rp(config.getUrl(req, res, "/api/v1/article/list?channelId=1")).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.articleList = body1;////这个地方不能用 htmlBody.body
        htmlBody.backUrl = "/mzc/hall";
        console.log("这里借款需求列表：" + body);
        res.render('mobile/c/find/index', htmlBody);
    });
	
});

//帕克探秘
router.get('/poccFind', function (req, res, next) {
     rp(config.getUrl(req, res, "/api/v1/article/list?channelId=2")).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.articleList = body1;////这个地方不能用 htmlBody.body
        htmlBody.backUrl = "/mzc/hall";
        console.log("这里借款需求列表：" + body);
        res.render('mobile/c/find/poccFind', htmlBody);
    });
	
});


//会员排行
router.get('/userRank', function (req, res, next) {
     rp(config.getUrl(req, res, "/api/v1/user/userRank")).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.userRanks = body1;////这个地方不能用 htmlBody.body
        htmlBody.backUrl = "/mzc/find";
        console.log("会员排行：" + body);
        res.render('mobile/c/find/userRank', htmlBody);
    });
	
});

//新鲜事 详情
router.get('/newThingsDetail', function (req, res, next) {
     rp(config.getUrl(req, res, "/api/v1/article/getOne?id="+req.query.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.article = body1;////这个地方不能用 htmlBody.body
        htmlBody.backUrl = "/mzc/find";
        htmlBody.imageUrl=config.imageUrl;
        res.render('mobile/c/find/newThingsDetail', htmlBody);
    });
	
});

module.exports = router;
