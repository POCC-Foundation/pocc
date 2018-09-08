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
    htmlBody.title = "企业";
    res.locals._layoutFile = "./mobile/init/singer.html";
    htmlBody.isLogin = 0;
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user;
        res.locals.userId = res.locals.user.id;
        res.locals.company = res.locals.user.company;
        htmlBody.isLogin = 1;
    } else {
        config.toLogin(req, res,1);
        return;
    }
    res.locals.nav_index=1;///底部导航条的选中状态，按从左到右 1--4
    next();
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/company/index', htmlBody);
}); 
//公司详情
//读公司信息
router.get('/:id/show', function (req, res, next) {
    console.log("in 公司详情：" + req.params.id);
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id=" + req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.company = body1;
        console.log("这里公司详情：" + body);
        next();
    });
});
//读加入的联盟
router.get('/:id/show', function (req, res, next) {
    console.log("in 读加入的联盟：" + req.params.id);
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId=" + req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unionlist = body1;
        console.log("这里读公司加入的联盟：" + body);
        next();
    });
});
router.get('/:id/show', function (req, res, next) {
    htmlBody.backUrl = req.query.backUrl;
    console.log("req.query.backUrl：" + req.query.backUrl);
    res.render('mobile/b/company/companyShow', htmlBody);
});

/**
 *企业静态 
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/:id/show/companyData', function (req, res, next) {
	rp(config.getUrl(req, res, "/api/v1/company/getOne?id=" + req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.company = body1;
        htmlBody.title = body1.data.name;
    	htmlBody.backUrl = req.query.backUrl;
    	res.render('mobile/b/company/companyData', htmlBody);
    });
	
});
/**
 *动态追溯
 * @param req
 * @param res
 * @param next
 * @returns
 */

router.get('/:id/show/dongtaiZuiSuo', function (req, res, next) {
	rp(config.getUrl(req, res, "/api/v1/company/getOne?id=" + req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.company = body1;
        htmlBody.title = body1.data.name;
    	htmlBody.backUrl = req.query.backUrl;
		rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId=" + htmlBody.company.data.id)).then(function (body3) {
	        var body2 = JSON.parse(body3);
	        htmlBody.unionlist = body2;
	        console.log("这里读公司加入的联盟：" + body3);
	        res.render('mobile/b/company/companyDongtai', htmlBody);
	    });

    });
});
/**
 *企业风险评估
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/:id/show/companyFengxian', function (req, res, next) {
	rp(config.getUrl(req, res, "/api/v1/company/getOne?id=" + req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.company = body1;
        htmlBody.title = body1.data.name;
        htmlBody.backUrl = req.query.backUrl;
    	res.render('mobile/b/company/companyFengxian', htmlBody);
    });
	
});
/**
 *企业POCC信用
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/:id/show/companyPOCC', function (req, res, next) {
	rp(config.getUrl(req, res, "/api/v1/company/getOne?id=" + req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.company = body1;
        htmlBody.title = body1.data.name;
        htmlBody.backUrl = req.query.backUrl;
    	res.render('mobile/b/company/companyPOCC', htmlBody);
    });
});
/**
 *企业预警
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/:id/show/compangYujing', function (req, res, next) {
	htmlBody.backUrl = req.query.backUrl;
	htmlBody.title = "预警资讯";
	res.render('mobile/b/company/compangYujing', htmlBody);
});
/**
 * 动态
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/:id/show/dongtai', function (req, res, next) {
	htmlBody.backUrl = req.query.backUrl;
	htmlBody.title = "最新动态";
	res.render('mobile/b/company/dongtai', htmlBody);
});
module.exports = router;
