var express = require('express');
var rp = require('request-promise');
var config = require('../config/config');
var router = express.Router();

var htmlBody = {};
/*
 /mzc/register 个人版本（c端）注册地址
 /mzc/login 个人版本（c端）登录地址
 
 /mzc/register/b 企业版本（B端）注册地址
 /mzc/login/b 企业版本（B端）登录地址
 */
router.use(function (req, res, next) {
    htmlBody = {};
    htmlBody.title = "POCC链企业登录";
    htmlBody.backUrl = "";
    res.locals._layoutFile = "./mobile/init/singer.html";
    //if (!!res.locals.user) {
    // res.redirect("/");
    //} else {
    next();
    return;
    //}
});

 
router.get('/', function (req, res, next) {
    htmlBody.currentUser = "";
    htmlBody.title = "POCC链企业登录";
    res.render('mobile/loginReg/loginB', htmlBody);
});

router.post('/doLogin', function (req, res, next) {
    console.log("in doLogin");
    console.log(req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip);
    var mobile = req.body.mobile;
    var password = req.body.password;

    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/user/login'),
        form: config.postData(req, {
            password: password,
            mobile: mobile
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        //employeeCode
        body = JSON.parse(body);
       /// console.log("返回resultCode：" + body.resultCode);
        if (body.resultCode === "FAIL") {
        ///    console.log("FAIL");
            // res.write('<html><script>parent.window.location.href="/mzc/register";</script></html>');
            config.printHtml(res, '<html><script>alert("用户名或者密码错误，请重试");</script></html>');


        }
        if (body.access_token) {
            res.cookie('ccat', body.access_token, {
                maxAge: 30 * 60 * 1000 * 24,
                path: '/',
                domain: config.cookieDomain
            });
            res.cookie('ccat_mobile', mobile, {
                maxAge: 60 * 60 * 1000 * 24 * 10,
                path: '/',
                domain: config.cookieDomain
            });
            // req.session.user = body;
            htmlBody.result = "Ok";
            htmlBody.user = body;
        } else {
            htmlBody.result = "fail";
            htmlBody.str = body.str;
        }
        //res.render('mobile/loginReg/loginResult', htmlBody);
        var alert_="";
        if(body.tokenInfo)
        {
            alert_="alert(\""+body.tokenInfo+"\");";
        }
        console.log(body.tokenInfo);
         console.log(alert_);
        if (body.data.type == 0)
        {
            config.printHtml(res, '<html><script>'+alert_+'parent.window.location.href="/mzc/userCenter/";</script></html>')
        } else {
            
            config.printHtml(res, '<html><script>'+alert_+'parent.window.location.href="/mzb/userCenter/";</script></html>')
        }
        // POST succeeded...
    }).catch(function (err) {
        // POST failed...
        console.log(err + "-->err");
    });
});

module.exports = router;