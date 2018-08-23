/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *  产品栏目
 /store/ 需求列表
 /store/:id/show
 */

var express = require('express');
var rp = require('request-promise');
var config = require('../../config/config');
var router = express.Router();

var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody.srcSource = "index";
    htmlBody.title = "资金产品";
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
//router.get('/', function (req, res, next) {
//    ///暂不加载数据，显示默认界面或者图片。
//    res.locals._layoutFile = false;
//    res.render('mobile/index/index', htmlBody);
//});

router.get('/:id/:outCompany/:unionId/show', function (req, res, next) {
    console.log("in 资金产品详情：" + req.params.id);
    rp(config.getUrl(req, res, "/api/v1/loanstore/getStoreDetails?id=" + req.params.id+"&outCompany="+req.params.outCompany+"&unionId="+req.params.unionId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.storeShow = body1;
        console.log("这里资金产品详情：" + body);
        next();
    });
});
router.get('/:id/:outCompany/:unionId/show', function (req, res, next) {
    htmlBody.backUrl = "/mzb/store/";
    res.render('mobile/b/store/storeShow', htmlBody);
});

//对外产品列表
router.get('/', function (req, res, next) {
    console.log("in 对外产品列表：");
    var urlParam = req.originalUrl.replace("/mzb/store", "");
    rp(config.getUrl(req, res, "/api/v1/loanstore/list" + urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.storeList = body1;
        console.log("这里借款需求列表：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    console.log("in 对外产品列表2：");
    htmlBody.title = "企业产品列表";
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/store/storeList', htmlBody);
});
module.exports = router;
