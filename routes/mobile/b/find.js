/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *  发现栏目
 * /find/new 发现栏目-新鲜事
 * /find/help 发现栏目-探秘
 * /find/item 发现栏目-联盟
 */

var express = require('express');
var rp = require('request-promise');
var config = require('../../config/config');
var router = express.Router();

var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody.srcSource = "index";
    htmlBody.title = "发现";
    htmlBody.isLogin = 0;
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user.data;
        res.locals.userId = res.locals.user.data.id;
        htmlBody.isLogin = 1;
    } else {
        config.toLogin(req, res,1);
        return;
        res.locals.currentUser = "";
        res.locals.userId = "";
    }
    res.locals.nav_index=3;///底部导航条的选中状态，按从左到右 1--4
    next();
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    res.locals._layoutFile = false;
    res.render('mobile/index/index', htmlBody);
}); 
module.exports = router;
