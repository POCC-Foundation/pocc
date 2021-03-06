/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *  产品栏目
 /store/ 需求列表
 /store/:id/show
 */

var express = require('express');
var rp = require('request-promise');
var config = require('../../config/config');
var router = express.Router();

var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody.srcSource = "index";
    htmlBody.title = "资金产品";
    res.locals._layoutFile = "./mobile/init/singer.html";
    htmlBody.isLogin = 0;
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user.data;
        res.locals.userId = res.locals.user.data.id;
        res.locals.company = res.locals.user.company;
        htmlBody.isLogin = 1;
        htmlBody.currentCompany = res.locals.user.company;
        htmlBody.currentUser =res.locals.currentUser;
    } else {
        config.toLogin(req, res,1);
        return;
        res.locals.currentUser = "";
        res.locals.userId = "";
    }
    res.locals.nav_index = 2;///底部导航条的选中状态，按从左到右 1--4
    next();
});
//router.get('/', function (req, res, next) {
//    ///暂不加载数据，显示默认界面或者图片。
//    res.locals._layoutFile = false;
//    res.render('mobile/index/index', htmlBody);
//});

router.get('/:id/:outCompany/:unionId/show', function (req, res, next) {
    console.log("in 资金产品详情：" + req.params.id);
   /* rp(config.getUrl(req, res, "/api/v1/loanstore/getStoreDetails?id=" + req.params.id + "&outCompany=" + req.params.outCompany + "&unionId=" + req.params.unionId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.storeShow = body1;
        console.log("这里资金产品详情：" + body);
        next();
    });*/
    
    rp(config.getUrl(req, res, "/api/v1/loanstore/getStoreDetails?id="+req.params.id
    		+"&userId="+req.query.userId
    		+"&companyId="+req.query.companyId
    		+ "&unionId=" + req.params.unionId
    		)).then(function (body) {
        var body1 = JSON.parse(body);
        if (body1.resultCode === "SUCCESSFUL") {
        	htmlBody.storeShow = body1;////  
        	 console.log("这里资金产品详情：" + body);
             next();
        } else {
        	var msg = body1.message;
        	   ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>parent.window.location.href="/mzb/store"; alert("'+msg+'");</script></html>');
            res.end();
       } 
       
    }); 
    
    
    
});
router.get('/:id/:outCompany/:unionId/show', function (req, res, next) {
	rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id=" + req.params.unionId)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.unionDetail = body1;
        console.log("联盟详情：" + body);
        next();
    });
});
//获取委贷申请列表
router.get('/:id/:outCompany/:unionId/show', function (req, res, next) {
	rp(config.getUrl(req, res, "/api/v1/loanentrusted/list?storeId=" + req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.loanentrusteds =  body1;
        console.log("委贷申请列表：" + body);
        next();
    });
});
router.get('/:id/:outCompany/:unionId/show', function (req, res, next) {
    htmlBody.backUrl = "";
    res.render('mobile/b/store/storeShow', htmlBody);
});

//对外产品列表///
router.get('/', function (req, res, next) {
    console.log("in 对外产品列表：");
    var urlParam = req.originalUrl.replace("/mzb/store", "");
    if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.company.id;
     }else{
         urlParam="?companyId="+res.locals.company.id;
     }
    
    rp(config.getUrl(req, res, "/api/v1/loanstore/list" + urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.storeList = body1;
        console.log("这里借款需求列表：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    console.log("in 对外产品列表2：");
    htmlBody.title = "企业产品列表";
    htmlBody.backUrl = "";
    res.render('mobile/b/store/storeList', htmlBody);
});

//go 申请贷款
router.get('/toApply/:outCompany/:id', function (req, res, next) {
    console.log("in go 申请贷款：");
    htmlBody.title = "申请贷款";
    htmlBody.outCompany = req.params.outCompany;
    htmlBody.id = req.params.id;
    htmlBody.backUrl = "";
    res.render('mobile/b/store/apply', htmlBody);
});

//do 申请贷款
router.post('/doApply', function (req, res, next) {
    console.log("IN 申请贷款 inCompany"+res.locals.company.id);
//    res.locals._layoutFile = false;
    req.body.sourceId = req.body.id;
    req.body.inCompany=res.locals.company.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loanstore/joinStore'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body1 = JSON.parse(body);
        console.log("申请贷款--body：" + body);
        if (htmlBody.body1.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("申请产品成功!");parent.window.location.href="/mzb/store";</script></html>');
            res.end();
        } else if (htmlBody.body1.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("已经申请过产品!");</script></html>');
            res.end();
        } else if (htmlBody.body1.resultCode === "SAME") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("自己不能参与自己的产品!");</script></html>');
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
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
    
    /**
     * 参与委托贷款
     */
   router.get('/joinEntrusted/:storeId/:companyId/:companyName', function (req, res, next) {
        console.log("in 资金产品详情：" + req.params.storeId);
        var options = {
                method: 'POST',
                uri: config.getUrlPost(req, '/api/v1/loanentrusted/save'),
                form: config.postData(req, req.params),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
        };
        rp(options).then(function (body) {
    			res.send(body)
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
