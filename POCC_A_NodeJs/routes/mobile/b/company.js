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
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/company/index', htmlBody);
}); 
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/company/companyShow', htmlBody);
}); 
module.exports = router;
