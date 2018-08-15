/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 
 
 /mzb/userCenterLoan/demand 发布的需求  返回地址 /mzb/userCenter/
 /mzb/userCenterLoan/demandCreat 发布新需求     返回地址/mzb/userCenterLoan/demand
 /mzb/userCenter/Loan/editDemand 修改需求       返回地址 /mzb/userCenterLoan/demand
 
 /mzb/userCenterLoan/store 发布的产品  返回地址 /mzb/userCenter/
 /mzb/userCenterLoan/storeCreat 发布新产品    返回地址： /mzb/userCenterLoan/store
 /mzb/userCenterLoan/editStore 修改产品  返回地址： /mzb/userCenterLoan/store
 
 
 以下是借款项目列表 及详情管理
 /mzb/userCenterLoan/loanRequest/ 贷款管理页面 返回地址 /mzb/userCenter/
 /mzb/userCenterLoan/loanRequest/:id/show 贷款详情+操作 界面  返回地址：/mzb/userCenterLoan/loanRequest/

 /mzb/userCenterLoan/loanRequest/:id/cansol 取消一个项目 状态变换 stat=100  。向iframe提交，完成后刷新父窗口 
 /mzb/userCenterLoan/loanRequest/addCompany?requestId= 给指定的借款申请添加一个项目的第三方 （表单项：选择企业；输入应付金额；输入应付时间；）
/mzb/userCenterLoan/loanRequest/ensureSet?id=?  给指定的借款申请 进行担保设置(loan_ensure_set)。设置表单项:担保总额，企业担保数量，个人担保数量

 网页参照 企业资料修改自己做 （选择公司，从借款所属联盟内的企业中选择。下拉列表；应付）  返回地址/mzb/userCenterLoan/loanRequestShow?id=

 /mzb/userCenterLoan/loanRequest/addFile?requestId=  给指定的借款申请 添加上传文件。表单项(选择文件上传；文件名称)。默认状态0 类型0。网页参照 企业资料修改自己做 返回地址/mzb/userCenterLoan/loanRequestShow?id=

 /mzb/userCenterLoan/loanRequest/addCheckMessage?requestId= 给指定的借款申请 添加描述或者备注留言记录。 表单为：输入描述。网页参照 企业资料修改自己做 返回地址/mzb/userCenterLoan/loanRequestShow?id=

 /mzb/userCenterLoan/loanRequest/:id/setStat/:stat     将指定的借款项目 修改为指定的状态。向iframe提交，完成后刷新父窗口 
 */

var express = require('express');
var rp = require('request-promise');
var config = require('../../config/config');
var router = express.Router();


var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody.srcSource = "index";
    htmlBody.title = "首页";
    htmlBody.isLogin = 0;
    res.locals._layoutFile = "./mobile/init/singer.html";
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user.data;
        res.locals.userId = res.locals.user.data.id;
        res.locals.company = res.locals.user.company;
        htmlBody.isLogin = 1;
    } else {
        config.toLogin(req, res,1);
    }
    res.locals.nav_index = 4;///底部导航条的选中状态，按从左到右 1--4
    next();
});
//router.get('/', function (req, res, next) {
//    ///暂不加载数据，显示默认界面或者图片。
//    res.locals._layoutFile = false;
//    res.render('mobile/index/index', htmlBody);
//});

//去发布需求页面--登陆企业加入的联盟
router.get('/demandCreat', function (req, res, next) {
    console.log("in 登陆企业加入的联盟-ID：");
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unions = body1;
        console.log("这里读出登陆企业加入的联盟：" + body);
        next();
    });
});
router.get('/demandCreat', function (req, res, next) {
    console.log("in 去发布需求页面");
    htmlBody.title = "发布需求";
    htmlBody.backUrl = "/mzb/userCenterLoan/demand";
    res.render('mobile/b/userCenter/publishDemand', htmlBody);
});

//执行保存需求
router.post('/doSaveDemand', function (req, res, next) {
    console.log("in doSaveDemand");
    res.locals._layoutFile = false;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/save'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log("保存需求返回的body：" + body);
        body = JSON.parse(body);
        if (body.resultCode === 'SUCCESSFUL')
        {
            config.printHtml(res, '<html><script>alert("发布成功");parent.window.location.href="/mzb/userCenterLoan/demand";</script></html>');
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

//去修改需求页面--读出登陆企业加入的联盟
router.get('/editDemand', function (req, res, next) {
    console.log("in 登陆企业加入的联盟-ID：");
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unions = body1;
        console.log("这里读出登陆企业加入的联盟：" + body);
        next();
    });
});
//去修改需求页面--读出需求信息
router.get('/editDemand', function (req, res, next) {
    console.log("in 登陆企业加入的联盟-ID：");
//    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id=" +req.body.id)).then(function (body) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id=" + req.query.id)).then(function (body) {

        var body1 = JSON.parse(body);
        htmlBody.demand = body1;
        console.log("这里读出需求信息：" + body);
        next();
    });
});
router.get('/editDemand', function (req, res, next) {
    console.log("in 去修改需求页面");
    htmlBody.title = "修改需求";
    htmlBody.backUrl = "/mzb/userCenterLoan/demand";
    res.render('mobile/b/userCenter/editPublishDemand', htmlBody);
});

//执行修改需求
router.post('/doEditDemand', function (req, res, next) {
    console.log("in doEditDemand" + req.body.beginTime);
    res.locals._layoutFile = false;

    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/edit'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log("保存需求返回的body：" + body);
        body = JSON.parse(body);
        if (body.resultCode === 'SUCCESSFUL')
        {
            config.printHtml(res, '<html><script>alert("修改成功");parent.window.location.href="/mzb/userCenterLoan/demand";</script></html>');
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

//去发布产品页面
router.get('/storeCreat', function (req, res, next) {
    console.log("in 登陆企业加入的联盟-ID：");
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unions = body1;
        console.log("这里读出登陆企业加入的联盟：" + body);
        next();
    });
});
router.get('/storeCreat', function (req, res, next) {
    console.log("in 去发布产品页面");
    htmlBody.title = "发布产品";
    htmlBody.backUrl = "/mzb/userCenterLoan/store";
    res.render('mobile/b/userCenter/publishStore', htmlBody);
});

//执行保存产品
router.post('/doSaveStore', function (req, res, next) {
    console.log("in doSaveStore");
    res.locals._layoutFile = false;
    req.body.money = req.body.money * 10000;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loanstore/save'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log("保存产品返回的body：" + body);
        body = JSON.parse(body);
        if (body.resultCode === 'SUCCESSFUL')
        {
            config.printHtml(res, '<html><script>alert("发布成功");parent.window.location.href="/mzb/userCenterLoan/store";</script></html>');
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

//去修改产品页面
router.get('/editStore', function (req, res, next) {
    console.log("in 登陆企业加入的联盟-ID：");
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unions = body1;
        console.log("这里读出登陆企业加入的联盟：" + body);
        next();
    });
});
//去修改产品页面--读出产品信息
router.get('/editStore/:id', function (req, res, next) {
    console.log("in 读出产品信息：");
//    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id=" +req.body.id)).then(function (body) {
    rp(config.getUrl(req, res, "/api/v1/loanstore/getOne?id=" + req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.store = body1;
        htmlBody.store.data.money = body1.data.money / 10000;
        console.log("这里读出产品信息：" + body + "money" + body1.data.money / 10000);
        next();
    });
});
router.get('/editStore/:id', function (req, res, next) {
    console.log("in 去修改产品页面");
    htmlBody.title = "修改产品";
    htmlBody.backUrl = "/mzb/userCenterLoan/store";
    res.render('mobile/b/userCenter/editPublishStore', htmlBody);
});

//执行修改产品
router.post('/doEditStore', function (req, res, next) {
    console.log("in doEditStore");
    res.locals._layoutFile = false;

    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loanstore/edit'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log("保存产品返回的body：" + body);
        body = JSON.parse(body);
        if (body.resultCode === 'SUCCESSFUL')
        {
            config.printHtml(res, '<html><script>alert("修改成功");parent.window.location.href="/mzb/userCenterLoan/store";</script></html>');
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


//去需求列表
router.get('/demand', function (req, res, next) {
    console.log("in demand：");
    console.log("这里读出需求列表：" + res.locals.company.id);
    rp(config.getUrl(req, res, "/api/v1/loandemand/getDemandByCompanyId?intCompany=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demands = body1;
        console.log("这里读出需求列表：" + body);
        next();
    });
});
router.get('/demand', function (req, res, next) {
    htmlBody.title = "企业需求列表";
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/userCenter/demand', htmlBody);
});

//去产品列表
router.get('/store', function (req, res, next) {
    console.log("in store：");
    rp(config.getUrl(req, res, "/api/v1/loanstore/getStoreByCompanyId?outCompany=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.stores = body1;
        console.log("这里读出产品列表：" + body);
        next();
    });
});
router.get('/store', function (req, res, next) {
    htmlBody.title = "企业产品列表";
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/userCenter/store', htmlBody);
});

//贷款管理列表
router.get('/loanRequest', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loanrequest/getRequestsByCompanyId?companyId=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.requests = body1;
        console.log("这里读出贷款管理列表：" + body);
        next();
    });
});
router.get('/loanRequest', function (req, res, next) {
    htmlBody.title = "企业管理列表";
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/userCenter/loanRequest', htmlBody);
});

//贷款详情
router.get('/loanRequest/:id/show', function (req, res, next) {
    console.log("in 贷款详情：");
//    rp(config.getUrl(req, res, "/api/v1/loanrequest/getLoanRequestShow?id=" +req.body.id)).then(function (body) {
    rp(config.getUrl(req, res, "/api/v1/loanrequest/getOne?id=" + req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.requests = body1;
        console.log("这里读出贷款管理列表：" + body);
        next();
    });
});
router.get('/loanRequest/:id/show', function (req, res, next) {
    htmlBody.title = "贷款管理详情";
    htmlBody.backUrl = "/mzb/userCenterLoan/loanRequest/";
    res.render('mobile/b/userCenter/loanRequestShow', htmlBody);
});
module.exports = router;
