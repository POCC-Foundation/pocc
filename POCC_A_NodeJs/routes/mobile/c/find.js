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
    htmlBody.imageUrl = config.imageUrl;
    htmlBody.srcSource = "index";
    htmlBody.title = "发现";
    res.locals._layoutFile = "./mobile/init/singer.html";
    htmlBody.isLogin = 0;
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user.data;
        res.locals.userId = res.locals.user.data.id;
        htmlBody.isLogin = 1;
    } else {
    	config.toLogin(req, res,0);
    }
    res.locals.nav_index = 2;///底部导航条的选中状态，按从左到右 1--4
    next();
}); 

//新鲜事
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/article/list?channelId=1")).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.articleList = body1;////这个地方不能用 htmlBody.body
        htmlBody.backUrl = "/mzc/hall";
        console.log("这里借款需求列表：" + body);
         next();
    });

});

//帕克探秘
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/article/list?channelId=2")).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.articleList2 = body1;////这个地方不能用 htmlBody.body
        htmlBody.backUrl = "/mzc/hall";
        console.log("这里借款需求列表：" + body);
         next();
    });

});


//会员排行
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/user/userRank")).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.userRanks = body1;////这个地方不能用 htmlBody.body
        htmlBody.backUrl = "/mzc/find";
        console.log("会员排行：" + body);
        next();
    });

});
router.get('/', function (req, res, next) {

    htmlBody.backUrl = "";
    htmlBody.imageUrl = config.imageUrl;
    res.render('mobile/c/find/index', htmlBody);


});
//新闻详情
router.get('/articleShow/:id', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/article/getOne?id="+req.params.id)).then(function (body) {
       var body1 = JSON.parse(body);
       htmlBody.article = body1.data;////这个地方不能用 htmlBody.body
       htmlBody.backUrl = "/mzc/find";
       htmlBody.imageUrl = config.imageUrl;
       res.render('mobile/c/find/article', htmlBody);
   });
});

module.exports = router;
