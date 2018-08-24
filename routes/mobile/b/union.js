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
        htmlBody.company = res.locals.user.company;
        res.locals.company = res.locals.user.company;

    } else {
        res.locals.currentUser = "";
        res.locals.userId = "";
    }
    res.locals._layoutFile = "./mobile/init/singer.html";
    res.locals.nav_index = 3;///底部导航条的选中状态，按从左到右 1--4
    next();
});

//我加入的的联盟
router.get('/', function (req, res, next) {
    console.log("in 我加入的的联盟-ID：");
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unions = body1;
        console.log("我加入的的联盟：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。 
    htmlBody.backUrl = "/mzb/userCenter";
    htmlBody.title = "我的联盟";
    res.render('mobile/b/union/my_union', htmlBody);
});


//我加入的联盟的其他成员
router.get('/otherCompany', function (req, res, next) {
    console.log("in 我加入的的联盟-ID：");
    rp(config.getUrl(req, res, "/api/v1/loanrequest/getCompanysInOneUnion?unionId=" + req.query.unionId + "&inCompany=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unionCompanys = body1;
        console.log("我加入的其他成员：" + body);
        res.locals._layoutFile = false;
        res.render('mobile/b/union/otherCompanyList', htmlBody);
    });
});

//某联盟的所有成员
router.get('/allOtherCompany', function (req, res, next) {
    console.log("in 某联盟的所有成员：");
    rp(config.getUrl(req, res, "/api/v1/loanrequest/getCompanysInOneUnion?unionId=" + req.query.unionId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.allUnionCompanys = body1;
        console.log("某联盟的所有成员：" + body);
//        res.locals._layoutFile = false;
        res.render('mobile/b/union/allOtherCompanyList', htmlBody);
    });
});


router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。 
    htmlBody.backUrl = "/mzb/union";
    htmlBody.title = "我的联盟";
    res.render('mobile/b/union/task', htmlBody);
});


//所有联盟
router.get('/list', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/unionchain/getUnions")).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unionCompanys = body1;
        console.log("所有联盟：" + body);
        next();
    });
});
router.get('/list', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。 
    htmlBody.backUrl = "/mzb/userCenter";
    htmlBody.title = "所有联盟";
    res.render('mobile/b/union/list', htmlBody);
});

////联盟任务  
//对申请加入联盟的企业投票 以及 对企业进行担保
router.get('/task', function (req, res, next) {
    console.log("联盟任务companyId：" + res.locals.company.id);
    rp(config.getUrl(req, res, "/api/v1/unionchain/getUnionTasks?companyId=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unionTasks = body1;
        console.log("所有联盟任务：" + body);
        next();
    });
});
router.get('/task', function (req, res, next) {
    htmlBody.backUrl = "/mzb/userCenter";
    htmlBody.title = "联盟任务";
    res.render('mobile/b/union/task', htmlBody);
});

//任务-投票详情
router.get('/taskShow', function (req, res, next) {
    console.log("联盟任务companyId：" + res.locals.company.id);
    rp(config.getUrl(req, res, "/api/v1/unionchain/getTaskDetails?companyId=" + req.params.id + "&unionId" + req.params.unionId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.taskDetails = body1;
        console.log("同意人数及公司名字：" + body);
        next();
    });
});
router.get('/taskShow', function (req, res, next) {
    htmlBody.backUrl = "/mzb/userCenter";
    htmlBody.title = "联盟任务-投票详情";
    res.render('mobile/b/union/task_details', htmlBody);
});

router.get('/editTask/:stat/:unionId/:id', function (req, res, next) {
    console.log("联盟任务companyId：" + res.locals.company.id);
    rp(config.getUrl(req, res, "/api/v1/unionchain/editTask?stat=" + req.params.stat + "&unionId" + req.params.unionId + "&companyId" + req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.taskDetails = body1;
        console.log("同否：" + body);
        htmlBody.backUrl = "/mzb/userCenter";
        htmlBody.title = "处理联盟任务";
        res.render('mobile/b/union/task_details', htmlBody);
    });
});

//贷款详情
router.get('/loanRequest/:id/show', function (req, res, next) {
    console.log("in 贷款详情requests" + req.params.id);
    rp(config.getUrl(req, res, "/api/v1/loanrequest/getLoanRequestShow?id=" + req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.requests = body1;
        htmlBody.loanRequestId = req.params.id;
        console.log("这里读出贷款管理列表requests：" + body);
        next();
    });
});

////读出审核列表
router.get('/loanRequest/:id/show', function (req, res, next) {
    console.log("in 审核列表：");
    /////读一个借款申请项目 的所有审核记录
    rp(config.getUrl(req, res, "/api/v1/loancheckrecord/list?requestId=" + req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.ch = body1;
        console.log("这里读出checkInfo：" + body);
        next();
    });
});

///读出担保记录
router.get('/loanRequest/:id/show', function (req, res, next) {
    console.log("in 担保记录：");
    rp(config.getUrl(req, res, "/api/v1/loanensure/getEnsuresByCompanyId?userId=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.ensure = body1;
        console.log("这里读出ensure：" + body);
        next();
    });
});

router.get('/loanRequest/:id/show', function (req, res, next) {
    htmlBody.title = "贷款管理详情";
    htmlBody.backUrl = "/mzb/union/task";
    res.render('mobile/b/union/loanRequestShow_Ensure', htmlBody);
});

router.get('/editTaskEnsure/:loanRequestId', function (req, res, next) {
    console.log("editTaskEnsure：" + res.locals.company.id);
    req.body.id = req.params.id;
    req.body.inCompany = res.locals.company.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loanrequest/editTaskEnsure?userId=' + res.locals.company.id + "&loanRequestId=" + req.params.loanRequestId),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body1 = JSON.parse(body);
        if (htmlBody.body1.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("担保成功!");parent.window.location.href="/mzb/union/task";</script></html>');
            res.end();
        } else if (htmlBody.body1.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script></script></html>');
            res.end();
        } else {
///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script></script></html>');
            res.end();
        }

    }).catch(function (err) {
// POST failed...
        console.log(err + "-->err");
        ///父窗口弹窗提示 错误
        res.writeHead(200, {'Content-Type': 'text/html', });
        ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
        res.write('<html><script></script></html>');
        res.end();
    });
});
module.exports = router;
