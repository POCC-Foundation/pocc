/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * /mzb/userCenter/ 企业中心首页 
 * /mzb/userCenter/set     企业中心设置页面         返回地址： /mzb/userCenter/
 * /mzb/userCenter/set/password 企业中心 修改密码       返回地址： /mzb/userCenter/set
 * /mzb/userCenter/set/companyInfo 设置企业信息     返回地址： /mzb/userCenter/set
 * 
 /mzb/userCenter/union 联盟管理
 /mzb/userCenter/union/creat 新建联盟
 
 /mzb/userCenter/demand 发布的需求
 /mzb/userCenter/demand/creat 发布新需求
 /mzb/userCenter/demand/edit 修改需求
 
 /mzb/userCenter/store 发布的产品
 /mzb/userCenter/store/creat 发布新产品
 /mzb/userCenter/store/creat 修改产品
 
 /mzb/userCenter/loan 贷款管理页面
 /mzb/userCenter/loan/:id 贷款详情+操作 界面
 
 /mzb/userCenter/monylist 钱包页面
 
 /mzb/userCenter/message 消息页面
 
 /mzb/userCenter/union 联盟管理   返回地址： /mzb/userCenter/
 /mzb/userCenter/union/:id/show 某一联盟详情   返回地址： /mzb/userCenter/union
 /mzb/userCenter/union/creat 新建联盟  返回地址： /mzb/userCenter/union
 
 /mzb/userCenter/monylist 钱包页面   返回地址： /mzb/userCenter/
 
 /mzb/userCenter/message 消息页面   返回地址： /mzb/userCenter/
 
 */

var express = require('express');
var rp = require('request-promise');
var config = require('../../config/config');
var router = express.Router();


var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody.srcSource = "index";
    htmlBody.title = "企业中心";
    htmlBody.isLogin = 0;
    res.locals._layoutFile = "./mobile/init/singer.html";
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user.data;
        res.locals.userId = res.locals.user.data.id;
        res.locals.company = res.locals.user.company;
        htmlBody.isLogin = 1;
    } else {
        config.toLogin(req, res,1);
       // res.locals.currentUser = "";
       // res.locals.userId = "";
    }
    res.locals.nav_index = 4;///底部导航条的选中状态，按从左到右 1--4
    next();
});
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.company = body1.data;////这个地方不能用 htmlBody.body
        console.log("这里读出企业内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        console.log("这里读出企业内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
   // res.locals._layoutFile = false;
    htmlBody.title = "企业中心"; 
    htmlBody.backUrl = "/mzb/demand/";
    res.render('mobile/b/userCenter/userCenter', htmlBody);
});

/////消息中心
router.get('/message', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
   // res.locals._layoutFile = false;
    htmlBody.title = "消息中心"; 
    htmlBody.backUrl = "/mzb/userCenter";
    res.render('mobile/b/userCenter/message', htmlBody);
});

// 企业设置
router.get('/set', function (req, res, next) {
    console.log("in 完善企业资料");
    htmlBody.title = "企业设置"; 
    htmlBody.backUrl = "/mzb/userCenter";
    res.render('mobile/b/userCenter/set', htmlBody);
    //res.render('mobile/index/index', htmlBody);
});
//获取企业名字等
router.get('/set/companyInfo', function (req, res, next) {
    console.log("in 获取企业资料-userId:" + req.query.userId);
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.company = body1;////这个地方不能用 htmlBody.body
        console.log("这里读出企业内容：" + body);
        next();
    });
});

// 完善企业资料
router.get('/set/companyInfo', function (req, res, next) {
    console.log("in 完善企业资料");
    htmlBody.title = "设置资料"; 
    htmlBody.backUrl = "/mzb/userCenter/set";
    res.render('mobile/b/userCenter/companyInfo', htmlBody);
    //res.render('mobile/index/index', htmlBody);
});

//执行完善企业资料
router.post('/doEditCompany', function (req, res, next) {
    console.log("in doEditCompany" + req.body.people);
    res.locals._layoutFile = false;
    req.body.id=res.locals.company.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/company/edit'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log("完善企业资料返回的body：" + body);
        body = JSON.parse(body);
        if (body.resultCode === 'SUCCESSFUL')
        {
            config.printHtml(res, '<html><script>alert("修改成功");parent.window.location.href="/mzb/userCenter/set";</script></html>');
//            console.log("完善企业资料comapnyId-跳转：" + body.id);
//            res.writeHead(200, {'Content-Type': 'text/html'});
//            res.write('<html><script>parent.window.location.href="/mzb/userCenter/union/creatNew?companyId=' + body.id + '";</script></html>');
//            res.end();
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

//去创建联盟页面
router.get('/union/creat', function (req, res, next) {
    console.log("in 完善企业资料");
    htmlBody.title = "创建联盟";
    htmlBody.backUrl = "/mzb/userCenter/union";
    res.render('mobile/b/userCenter/union_creat', htmlBody);
});

//执行创建联盟
router.post('/doCreatUnion', function (req, res, next) {
    console.log("in doCreatUnion" + req.body.info);
    res.locals._layoutFile = false;
    
    req.body.companyId=res.locals.company.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/unionchain/creatUnion'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log("创建联盟返回的body：" + body);
        body = JSON.parse(body);
        if (body.resultCode === 'SUCCESSFUL')
        {
            console.log("创建联盟comapnyId-跳转：" + body.id);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<html><script>parent.window.location.href=" /mzb/userCenter/union";</script></html>');
            res.end();
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

//去联盟管理页面
router.get('/union', function (req, res, next) {
    console.log("in 联盟管理页面");
    htmlBody.title = "加入的联盟";
    htmlBody.backUrl = "/mzb/userCenter";
    res.render('mobile/b/userCenter/union', htmlBody);
});

//修改企业密码
/*
router.get('/set/password', function (req, res, next) {
    console.log("in 获取企业资料-userId:");
//        rp(config.getUrl(req, res, "/api/v1/user/getOne?id=" + res.locals.user.data.id)).then(function (body) {
    rp(config.getUrl(req, res, "/api/v1/user/getOne?id=" + res.locals.userId)).then(function (body) {

        var body1 = JSON.parse(body);
        htmlBody.user = body1;
        console.log("这里读出用户内容：" + body);
        next();
    });
});*/
router.get('/set/password', function (req, res, next) {
    htmlBody.title = "修改密码";
    htmlBody.backUrl = "/mzb/userCenter/set";
    res.render('mobile/loginReg/updatePwd', htmlBody);
});
//修改密码
router.post('/doEditPwd', function (req, res, next) {
    console.log("in doEditPwd" );
    res.locals._layoutFile = false;
    req.body.id=res.locals.userId;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/user/edit'),
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
        if (body.resultCode === 'passwordFail')
        {
            config.printHtml(res, '<html><script>alert("密码输入错误");</script></html>');
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
