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


//忘记密码
router.get('/forgetPwd', function (req, res, next) {
     console.log("in forgetPwd");
    htmlBody.currentUser = "";
    htmlBody.title = "找回密码";
    res.render('mobile/loginReg/forgetPwd', htmlBody);
});

//忘记密码-收验证码
router.get('/getMobileCaptchaForget', function (req, res, next) {
    console.log("node in getMobileCaptchaForget");
    rp(config.getUrl(req, res, "/api/v1/user/getMobileCaptcha?mobile=" + req.query.mobile)).then(function (body) {
        var body = JSON.parse(body);
        res.locals._layoutFile = false;
        if (body.resultCode === 'MobileNotExit')
        {
            config.printHtml(res, '<html><script>alert("手机号码不存在");</script></html>');
        }
        htmlBody.style = "smsed";
        res.render('mobile/loginReg/loginResult', htmlBody);
    });
});
//执行忘记密码
router.post('/doEditPwd', function (req, res, next) {
    res.locals._layoutFile = false;
    htmlBody.style = "logined";
    var mobile = req.body.mobile;
    var code = req.body.captcha;console.log("输入code"+code);
    if (mobile === '' || mobile.lemgth < 11 || code === '' || code.lemgth < 4)
    {

        config.printHtml(res, '<html><script>alert("手机号或验证码输入错误");</script></html>');

    } else {
        //校验code 
        next();
    }
});
router.post('/doEditPwd', function (req, res, next) {
    console.log("in doEditPwd");
    res.locals._layoutFile = false;
    req.body.id = res.locals.userId;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/user/forgetPwd'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log("修改密码返回的body：" + body);
        body = JSON.parse(body);
        if (body.resultCode === 'SUCCESSFUL')
        {
            config.printHtml(res, '<html><script>alert("修改成功");parent.window.location.href="/mzb/userCenter/set";</script></html>');
        }
        if (body.resultCode === 'captchaError')
        {
            config.printHtml(res, '<html><script>alert("验证码输入错误");</script></html>');
        }
        if (body.resultCode === 'FAIL')
        {
            config.printHtml(res, '<html><script>alert("系统繁忙");</script></html>');
        }
    }).catch(function (err) {
        console.log(err + "-->err");
        res.send(err);
    });
});

module.exports = router;