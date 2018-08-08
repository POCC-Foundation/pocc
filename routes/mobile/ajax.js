var express = require('express');
var rp = require('request-promise');
var config = require('../config/config');
var router = express.Router();

var htmlBody = {};
/**
 * 这里放一些 不需要用户登录的，不用模板的，跟其他页面关联不大的。
 * 
 */
router.use(function (req, res, next) {
    res.locals._layoutFile = false;
    htmlBody.isLogin = 0;
    if (res.locals.user) {
        htmlBody.isLogin = 1;
        htmlBody.currentUser = res.locals.user;
        htmlBody.userId = res.locals.user.id;
    }
    next();
});
//关注或者取消关注
router.get('/doAttend', function (req, res, next) {
    console.log('关注或者取消关注--id：111');

    if (htmlBody.currentUser == undefined)
    {
        console.log('if');
        htmlBody.resultCode = "NOLOGIN";
        res.send(htmlBody.resultCode);
    } else {
        console.log('else');
        var USER_M = htmlBody.currentUser.USER_ID;
        var USER_F = req.query.USERID;
        if (USER_M == USER_F) {
            console.log('if2');
            htmlBody.resultCode = "SELF";
            res.send(htmlBody.resultCode);
        } else {
            console.log('else2');
            rp(config.getUrl(req, res, '/api/v1/userExpand/doAttend?USER_M=' + USER_M + '&USER_F=' + USER_F)).then(function (body) {
                var body1 = JSON.parse(body);
                if (body1.resultCode === 'SUCCESSFUL') {
                    console.log('关注或者取消关注--' + body);
                    htmlBody.resultCode = "SUCCESSFUL";
                    res.send(htmlBody.resultCode);
                }
            });
        }
    }
});

//关注或者取消关注
router.post('/getTokenOrder', function (req, res, next) {
    rp(config.getUrl(req, res, '/api/v1/tokenOrder/getOrder?ORDER_ID=' +req.body.ORDER_ID)).then(function (body) {
        var body1 = JSON.parse(body);
        console.log('getOrder--' + body);
        console.log('getOrder--' + body1.data.STAT);
        
        res.send(body1); 
    });
});
module.exports = router;