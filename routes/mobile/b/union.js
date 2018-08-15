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
    } else {
        res.locals.currentUser = "";
        res.locals.userId = "";
    }
    res.locals._layoutFile = "./mobile/init/singer.html";
    res.locals.nav_index=3;///底部导航条的选中状态，按从左到右 1--4
    next();
});
///我加入的的联盟
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。 
    htmlBody.backUrl = "/mzb/userCenter";
    htmlBody.title = "我的联盟";
    res.render('mobile/b/union/my_union', htmlBody);
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
////所有联盟
router.get('/list', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。 
    htmlBody.backUrl = "/mzb/userCenter";
    htmlBody.title = "我的联盟";
    res.render('mobile/b/union/list', htmlBody);
}); 
module.exports = router;
