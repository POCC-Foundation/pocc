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

router.use(function (req, res, next) {
	console.log("这里借款需求详情：");
    htmlBody.srcSource = "index";
    htmlBody.title = "分众链保";
    htmlBody.isLogin = 0;
    res.locals._layoutFile = "./mobile/init/singer.html";
    if (res.locals.user) {
    	res.locals.currentUser = res.locals.user.data;
    	res.locals.userId = res.locals.user.data.id;
    	 htmlBody.user=res.locals.user.data;
    	 htmlBody.userId=res.locals.user.data.id;
        htmlBody.isLogin = 1;
    } else {
    	config.toLogin(req, res,0);
    }
    res.locals.nav_index = 1;///底部导航条的选中状态，按从左到右 1--4
    next();
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    var urlParam=req.originalUrl.replace("/mzc/loanrequest","");
    rp(config.getUrl(req, res, "/api/v1/loanrequest/getlistWithCompanyPage"+urlParam)).then(function (body) {
       var body1 = JSON.parse(body);
       htmlBody.requestList = body1;////这个地方不能用 htmlBody.body
       htmlBody.backUrl = "/mzc/hall";
       console.log("这里分众链保列表：" + body);
       res.render('mobile/c/hall/loanRequest/list', htmlBody);
   });
}); 

router.get('/detail/:id', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/useraccount/getOne?id=" + res.locals.userId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.userAccount = body1.data;////这个地方不能用 htmlBody.body
        console.log("userAccount===================：" + body);
        next();
    });
});

///借款需求
router.get('/detail/:id', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loanrequest/getOne?id="+req.params.id)).then(function (body) {
    	console.log("userid===========：" + res.locals.userId);
        var body1 = JSON.parse(body);
        htmlBody.userId=res.locals.userId;
        htmlBody.loanrequest = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 

//企业信息
router.get('/detail/:id', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.loanrequest.inCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.inCompany = body1.data;//// 
        console.log("这里借款需求-inCompany详情：" + body);
        next();
    }); 
}); 

//获取担保记录
router.get('/detail/:id', function (req, res, next) {
	 rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.loanrequest.outCompany)).then(function (body) {
	        var body1 = JSON.parse(body); 
	        htmlBody.outCompany = body1.data;//// 
	        console.log("这里借款需求-outCompany：" + body);
	        next();
	    }); 
}); 

router.get('/detail/:id', function (req, res, next) { 
	   rp(config.getUrl(req, res, "/api/v1/loanensure/listWithUser?loanRequestId="+htmlBody.loanrequest.id)).then(function (body) {
	        var body1 = JSON.parse(body); 
	        htmlBody.ensures = body1;//// 
	        console.log("担保记录-ensures：" + body);
	        htmlBody.backUrl = req.backUrl;
	        res.render('mobile/c/hall/loanRequest/detail', htmlBody);
	    }); 
  
}); 

//公司详情
//读公司信息
router.get('/company/:id/show', function (req, res, next) {
  console.log("in 公司详情：" + req.params.id);
  rp(config.getUrl(req, res, "/api/v1/company/getOne?id=" + req.params.id)).then(function (body) {
      var body1 = JSON.parse(body);
      htmlBody.company = body1;
      console.log("这里公司详情：" + body);
      next();
  });
});


//读加入的联盟
router.get('/company/:id/show', function (req, res, next) {
  console.log("in 读加入的联盟：" + req.params.id);
  rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId=" + req.params.id)).then(function (body) {
      var body1 = JSON.parse(body);
      htmlBody.unionlist = body1;
      console.log("这里读公司加入的联盟：" + body);
      next();
  });
});


//do 参与担保
router.post('/doEnsure', function (req, res, next) {
    console.log("IN 参与需求 userid："+req.body.userId+"request的id："+req.body.id);
    res.locals._layoutFile = false;
//    req.body.id = req.params.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loanrequest/doEnsure'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body1 = JSON.parse(body);
        console.log("参与担保--body：" + body);
        if (htmlBody.body1.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与成功!");parent.window.location.href="/mzc/loanrequest";</script></html>');
            res.end();
        } else if (htmlBody.body1.resultCode === "FINSH") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
	            res.write('<html><script>alert("额度不足"); window.location.href="/mzc/loanrequest"</script></html>');
            res.end();
        } else {
            ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("系统错误") ; window.location.href="/mzc/loanrequest";</script></html>');
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


//router.get('/', function (req, res, next) {
//    ///暂不加载数据，显示默认界面或者图片。
//   // res.locals._layoutFile = false;
//    htmlBody.title = "个人中心"; 
//    htmlBody.backUrl = "/mzc/demand/";
//    res.render('mobile/c/userCenter/userCenter', htmlBody);
//});

module.exports = router;
