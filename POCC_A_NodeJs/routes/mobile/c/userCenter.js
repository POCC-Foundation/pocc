/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * c端 大厅栏目
 * /hall/ 大厅首页

 */

var express = require('express');
var rp = require('request-promise');
var config = require('../../config/config');
var router = express.Router();
var htmlBody = {};

//router.use(function (req, res, next) {
//    htmlBody.srcSource = "index";
//    htmlBody.title = "首页";
//    htmlBody.isLogin = 0;
//    if (res.locals.user) {
//        res.locals.currentUser = res.locals.user;
//        res.locals.userId = res.locals.user.id;
//        htmlBody.isLogin = 1;
//    } else {
//        res.locals.currentUser = "";
//        res.locals.userId = "";
//    }
//    next();
//});
//router.get('/', function (req, res, next) {
//    ///暂不加载数据，显示默认界面或者图片。
//    res.locals._layoutFile = false;
//    res.render('mobile/index/index', htmlBody);
//}); 

router.use(function (req, res, next) {
    htmlBody.srcSource = "index";
    htmlBody.title = "个人中心";
    htmlBody.isLogin = 0;
    res.locals._layoutFile = "./mobile/init/singer_c.html";
    if (res.locals.user) {
    	res.locals.currentUser = res.locals.user.data;
    	res.locals.userId = res.locals.user.data.id;
    	 htmlBody.user=res.locals.user.data;
    	htmlBody.isLogin = 1;
    } else {
        config.toLogin(req, res,0);
       // res.locals.currentUser = "";
       // res.locals.userId = "";
    }
    res.locals.nav_index = 3;///底部导航条的选中状态，按从左到右 1--4
    next();
});

router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/useraccount/getOne?id=" + res.locals.userId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.userAccount = body1.data;////这个地方不能用 htmlBody.body
        console.log("这里读出企业内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/user/getOne?id=" + res.locals.userId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.user = body1.data;////这个地方不能用 htmlBody.body
        console.log("这里读出用户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.userId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        console.log("这里读出企业账户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    console.log("in 对外需求列表：");
   var urlParam=req.originalUrl.replace("/mzc/demand","");
     if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.userId;
     }else{
         urlParam="?companyId="+res.locals.userId;
     }
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    console.log("in 对外产品列表：");
    var urlParam = req.originalUrl.replace("/mzc/store", "");
    if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.userId;
     }else{
         urlParam="?companyId="+res.locals.userId;
     }
    
    rp(config.getUrl(req, res, "/api/v1/loanstore/list" + urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.storeList = body1;
        console.log("这里借款产品列表：" + body);
        next();
    });
});
//读出消息
router.get('/', function (req, res, next) {
     rp(config.getUrl(req, res, "/api/v1/message/listById?userid=" + res.locals.userId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.message = body1;
        console.log("这里读出message：" + body);
        next();
    });
});


router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
   // res.locals._layoutFile = false;
    htmlBody.title = "个人中心"; 
    htmlBody.backUrl = "/mzc/hall/";
    res.render('mobile/c/userCenter/userCenter', htmlBody);
});



//个人设置
router.get('/set', function (req, res, next) {
    console.log("in 个人设置");
    htmlBody.title = "个人设置"; 
    htmlBody.backUrl = "/mzc/userCenter";
    res.render('mobile/c/userCenter/set', htmlBody);
    //res.render('mobile/index/index', htmlBody);
});

//个人资料修改
//获取企业名字等
router.get('/set/persionInfo', function (req, res, next) {
    console.log("in 获取用户资料-userId:" + res.locals.userId);
    rp(config.getUrl(req, res, "/api/v1/user/getOne?id=" +res.locals.userId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.currentUser = body1;////这个地方不能用 htmlBody.body
        console.log("这里读出用户内容：" + body);
        next();
    });
});
router.get('/set/persionInfo', function (req, res, next) {
    console.log("in 个人资料修改");
    htmlBody.title = "设置资料"; 
    htmlBody.backUrl = "/mzc/userCenter/set";
    res.render('mobile/c/userCenter/persionInfo', htmlBody);
});


//执行完善企业资料doEditPersion
router.post('/doEditPersion', function (req, res, next) {
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
        console.log("完善企业资料返回的body：" + body);
        body = JSON.parse(body);
        if (body.resultCode === 'SUCCESSFUL')
        {
            config.printHtml(res, '<html><script>alert("修改成功");parent.window.location.href="/mzc/userCenter/set";</script></html>');
//            console.log("完善企业资料comapnyId-跳转：" + body.id);
//            res.writeHead(200, {'Content-Type': 'text/html'});
//            res.write('<html><script>parent.window.location.href="/mzc/userCenter/union/creatNew?companyId=' + body.id + '";</script></html>');
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


//修改个人密码
router.get('/set/password', function (req, res, next) {
    htmlBody.title = "修改密码";
    htmlBody.backUrl = "/mzc/userCenter/set";
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
            config.printHtml(res, '<html><script>alert("修改成功");parent.window.location.href="/mzc/userCenter/set";</script></html>');
        }
        if (body.resultCode === 'passwordFail')
        {
        	console.log("密码输入错误：" + body);
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





//消息页面
router.get('/message', function (req, res, next) {
    console.log("in 获取消息-userId:" + res.locals.userId);
    rp(config.getUrl(req, res, "/api/v1/message/listById?userid=" + res.locals.userId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.message = body1;
        console.log("这里读出message：" + body);
        next();
    });
});
router.get('/message', function (req, res, next) {
    console.log("in 获取修改状态:" + res.locals.userId);
    rp(config.getUrl(req, res, "/api/v1/message/editMesageStat?stat=1&userid=" + res.locals.userId)).then(function (body) {
        var body1 = JSON.parse(body);
        next();
    });
});
router.get('/message', function (req, res, next) {
    console.log("in 消息页面");
    htmlBody.title = "消息"; 
    htmlBody.backUrl = "/mzc/userCenter";
    res.render('mobile/c/userCenter/message', htmlBody);
});

//钱包
//读取账户信息
router.get('/moneylist', function (req, res, next) {
  rp(config.getUrl(req, res, "/api/v1/useraccount/getOne?id=" + res.locals.userId)).then(function (body) {
      var body1 = JSON.parse(body);
      htmlBody.userAccount = body1;
      console.log("读取UserAccount：" + body);
      next();
  });
});
//读取流水记录
router.get('/moneylist', function (req, res, next) {
  rp(config.getUrl(req, res, "/api/v1/foundrecord/list?type=0&userId=" + res.locals.userId)).then(function (body) {
      var body1 = JSON.parse(body);
      htmlBody.foundRecordList = body1;
      console.log("读取foundrecord：" + body);
      next();
  });
});
router.get('/moneylist', function (req, res, next) {
  console.log("in 钱包页面");
  htmlBody.title = "我的钱包"; 
  htmlBody.backUrl = "/mzc/userCenter";
  res.render('mobile/c/userCenter/moneylist', htmlBody);
});

//去担保记录页
router.get('/ensure', function (req, res, next) {
    console.log("in store：");
    rp(config.getUrl(req, res, "/api/v1/loanensure/listWithUser?userId=" + res.locals.userId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.ensureList = body1;
        console.log("这里担保记录列表：" + body);
        next();
    });
});
router.get('/ensure', function (req, res, next) {
    htmlBody.title = "担保记录";
    htmlBody.backUrl = "/mzc/userCenter/";
    res.render('mobile/c/userCenter/ensureList', htmlBody);
});

/**
 * 我的担保详情
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/ensureShow/:loanRequestId/:id', function (req, res, next) {
	rp(config.getUrl(req, res, "/api/v1/loanrequest/getOne?id="+req.params.loanRequestId)).then(function (body) {
    	console.log("userid===========：" + res.locals.userId);
        var body1 = JSON.parse(body); 
        htmlBody.loanrequest = body1.data;////  
        console.log("这里借款详情：" + body);
        next();
    }); 
});

router.get('/ensureShow/:loanRequestId/:id', function (req, res, next) {
	rp(config.getUrl(req, res, "/api/v1/loanensure/getOne?id="+req.params.id)).then(function (body) {
    	console.log("userid===========：" + res.locals.userId);
        var body1 = JSON.parse(body); 
        htmlBody.loanensure = body1.data;////  
        console.log("这里担保详情：" + body);
        next();
    });  
});
router.get('/ensureShow/:loanRequestId/:id', function (req, res, next) {
	rp(config.getUrl(req, res, "/api/v1/loanrepay/list?ensureId="+req.params.id)).then(function (body) { 
        var body1 = JSON.parse(body); 
        htmlBody.loanrepay = body1;////  
        console.log("这里担body情：" + body);
        next();
    });  
});
router.get('/ensureShow/:loanRequestId/:id', function (req, res, next) {
    htmlBody.title = "担保详情";
    htmlBody.backUrl = "/mzc/userCenter/ensure";
      htmlBody.userId=res.locals.userId;
    res.render('mobile/c/userCenter/ensureShow', htmlBody);
});



//do 取消保
router.get('/doStopEnsure/:id', function (req, res, next) {
    res.locals._layoutFile = false;
    req.body.id = req.params.id;
    console.log( "req.body.id="+req.body.id);
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loanensure/doStopEnsure'),
        form: config.postData(req, req.params),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body1 = JSON.parse(body);
        console.log("取消担保--body：" + body);
        if (htmlBody.body1.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与成功!");parent.window.location.href="/mzc/userCenter/ensure";</script></html>');
            res.end();
        } else if (htmlBody.body1.resultCode === "FINSH") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script>alert("'+htmlBody.body1.message+'!") ; window.location.href="/mzc/userCenter/ensure";</script></html>');  
            //res.write('<html><script>alert("系统异常，稍后再试!"); window.location.href="/mzc/userCenter/ensure"</script></html>');
            res.end();
        } else {
            ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
           res.write('<html><script>alert("'+htmlBody.body1.message+'!") ; window.location.href="/mzc/userCenter/ensure";</script></html>');
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
