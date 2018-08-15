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
    htmlBody.title = "会员注册";
    htmlBody.isLogin = 0;
    res.locals._layoutFile = "./mobile/init/singer.html";
    next();
});

router.use(function (req, res, next) {
    htmlBody.nav_tag = "register";
    next();
});

// 注册
router.get('/', function (req, res, next) {
    /**
     * 写一个cookie 标记，如果在发短息的时候 没有这个cookie  就不通过
     */
    console.log("in 注册");
//    htmlBody.currentUser = "";
//    res.cookie('ccattouser08721', "1945" + new Date().getTime(), {maxAge: 10 * 60 * 1000, path: '/', httpOnly: true}); 
    res.render('mobile/loginReg/register', htmlBody);
});

// 注册企业
router.get('/b', function (req, res, next) {
    console.log("in 注册b");
    res.render('mobile/loginReg/registerB', htmlBody);
});


router.get('/getMobileCaptcha', function (req, res, next) {
    console.log("node in getMobileCaptcha");
    rp(config.getUrl(req, res, "/api/v1/util/getMobileCaptcha?mobile=" + req.query.mobile)).then(function (body) {
        var body = JSON.parse(body);
        res.locals._layoutFile = false;
        if (body.resultCode === 'MobileExit')
        {
            config.printHtml(res, '<html><script>alert("手机号码已存在");</script></html>');
        }

        htmlBody.style = "smsed";
        res.render('mobile/loginReg/loginResult', htmlBody);
    });


});
router.post('/doRegister', function (req, res, next) {
    res.locals._layoutFile = false;
    htmlBody.style = "logined";
    var mobile = req.body.mobile;
    var code = req.body.captcha;///undefined 
    if (mobile === '' || mobile.lemgth < 11 || code === '' || code.lemgth < 4)
    {

        config.printHtml(res, '<html><script>alert("手机号或验证码输入错误");</script></html>');

    } else {
        //校验code 
        next();
    }
});

//执行注册
router.post('/doRegister', function (req, res, next) {
    console.log("in doRegister" + req.body.name);
    res.locals._layoutFile = false;
    //如果想给 表单添加参数 可使用 req.body.wanghao='haoren';

    var options = {
        method: 'POST',
        uri: '/api/v1/user/register',
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log("注册返回的body：" + body);
        body = JSON.parse(body);

        if (body.resultCode === 'captchaError')
        {
            config.printHtml(res, '<html><script>alert("手机验证码错误");</script></html>');
        }
        if (body.resultCode === 'MobileExit')
        {
            config.printHtml(res, '<html><script>alert("您注册的手机号已存在");</script></html>');
            return;
        }
        console.log("注册返回的 body.type：" + body.data.type);
        if (body.access_token) {
            res.cookie('ccat', body.access_token, {
                maxAge: 30 * 60 * 1000 * 24,
                path: '/',
                domain: config.cookieDomain
            });
            res.cookie('ccat_mobile', req.body.mobile, {
                maxAge: 60 * 60 * 1000 * 24 * 10,
                path: '/',
                domain: config.cookieDomain
            });
            
        }  

        if (body.resultCode === 'SUCCESSFUL' && body.data.type === 1)
        { 
            config.printHtml(res,'<html><script>parent.window.location.href="/mzb/userCenter/set/companyInfo";</script></html>');//完善企业资料
            
        }else{
            config.printHtml(res,'<html><script>parent.window.location.href="/mzc/userCenter";</script></html>');//完善企业资料
        }
        if (body.resultCode === 'FAIL')
        {
            config.printHtml(res, '<html><script>alert("系统繁忙");</script></html>');
        }

        // POST succeeded...
    }).catch(function (err) {
        // POST failed...
        console.log(err + "-->err");
        res.send(err);
    });
});


module.exports = router;