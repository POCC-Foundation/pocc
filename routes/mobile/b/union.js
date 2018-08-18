/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *  发现栏目
 * /union/ 我的联盟
 * /union/:id/show 联盟详情
 * /union/task 联盟任务
 * /union/list 所有联盟
 */

var express = require('express');
var rp = require('request-promise');
var config = require('../../config/config');
var router = express.Router();

var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody.srcSource = "index";
    htmlBody.title = "企业联盟";
    htmlBody.isLogin = 0;
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user;
        res.locals.userId = res.locals.user.id;
        htmlBody.isLogin = 1;
        htmlBody.company = res.locals.user.company;
        res.locals.company = res.locals.user.company;

    } else {
        res.locals.currentUser = "";
        res.locals.userId = "";
    }
    res.locals._layoutFile = "./mobile/init/singer.html";
    res.locals.nav_index = 3;///底部导航条的选中状态，按从左到右 1--4
    next();
});

//我加入的的联盟
router.get('/', function (req, res, next) {
    console.log("in 我加入的的联盟-ID：");
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unions = body1;
        console.log("我加入的的联盟：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。 
    htmlBody.backUrl = "/mzb/userCenter";
    htmlBody.title = "我的联盟";
    res.render('mobile/b/union/my_union', htmlBody);
});


//我加入的联盟的其他成员
router.get('/otherCompany', function (req, res, next) {
    console.log("in 我加入的的联盟-ID：");
    rp(config.getUrl(req, res, "/api/v1/loanrequest/getCompanysInOneUnion?unionId=" + req.query.unionId + "&inCompany=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unionCompanys = body1;
        console.log("我加入的其他成员：" + body);
        res.locals._layoutFile = false;
        res.render('mobile/b/union/otherCompanyList', htmlBody);
    });
});

//某联盟的所有成员
router.get('/allOtherCompany', function (req, res, next) {
    console.log("in 某联盟的所有成员：");
    rp(config.getUrl(req, res, "/api/v1/loanrequest/getCompanysInOneUnion?unionId=" + req.query.unionId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.allUnionCompanys = body1;
        console.log("某联盟的所有成员：" + body);
//        res.locals._layoutFile = false;
        res.render('mobile/b/union/allOtherCompanyList', htmlBody);
    });
});


router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。 
    htmlBody.backUrl = "/mzb/union";
    htmlBody.title = "我的联盟";
    res.render('mobile/b/union/task', htmlBody);
});

////联盟任务  对申请加入联盟的企业投票
////对企业进行担保
router.get('/task', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。 
    htmlBody.backUrl = "/mzb/userCenter";
    htmlBody.title = "我的联盟";
    res.render('mobile/b/union/task', htmlBody);
});

//所有联盟
router.get('/list', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/unionchain/getUnions")).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unionCompanys = body1;
        console.log("所有联盟：" + body);
        next();
    });
});
router.get('/list', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。 
    htmlBody.backUrl = "/mzb/userCenter";
    htmlBody.title = "所有联盟";
    res.render('mobile/b/union/list', htmlBody);
});

module.exports = router;
