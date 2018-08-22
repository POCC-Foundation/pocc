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
    htmlBody.srcSource = "index";
    htmlBody.title = "发现";
    htmlBody.isLogin = 0;
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user;
        res.locals.userId = res.locals.user.id;
        htmlBody.isLogin = 1;
    } else {
        res.locals.currentUser = "";
        res.locals.userId = "";
    }
    next();
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    res.locals._layoutFile = false;
    res.render('mobile/c/find/index', htmlBody);
}); 
module.exports = router;
