/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * c端 大厅下的分众链保 栏目

 * /hall/loan/list 标的列表
 * /hall/loan/:id/show 标的详情
 * /hall/loan/:id/show 标的详情
 */

var express = require('express');
var rp = require('request-promise');
var config = require('../../config/config');
var router = express.Router();

var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody.srcSource = "index";
    htmlBody.title = "分众链保";
    htmlBody.isLogin = 0;
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user.data;
        res.locals.userId = res.locals.user.data.id;
        htmlBody.isLogin = 1;
    } else {
    	config.toLogin(req, res,0);
    }
    next();
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    res.locals._layoutFile = false;
    res.render('mobile/index/index', htmlBody);
}); 
module.exports = router;
