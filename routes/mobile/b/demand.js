/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 端 需求栏目
 /demand/ 需求列表
 /demand/:id/show
/demand/:id/join 参与需求

 */

var express = require('express');
var rp = require('request-promise');
var config = require('../../config/config');
var router = express.Router();

var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody.srcSource = "index";
    htmlBody.title = "借款需求";
    res.locals._layoutFile = "./mobile/init/singer.html";
    htmlBody.isLogin = 0;
    if (res.locals.user) {
    	htmlBody.currentCompany=res.locals.user.company;
        res.locals.currentUser = res.locals.user.data;
        res.locals.userId = res.locals.user.data.id;
        res.locals.company = res.locals.user.company;
        htmlBody.isLogin = 1;
        htmlBody.currentUser =res.locals.currentUser;
    } else {
        config.toLogin(req, res,1);
        return;
    }
    res.locals.nav_index=1;///底部导航条的选中状态，按从左到右 1--4
    next();
});
router.get('/', function (req, res, next) { 
     
     var urlParam=req.originalUrl.replace("/mzb/demand","");
     if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.company.id;
     }else{
         urlParam="?companyId="+res.locals.company.id;
     }
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
}); 
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        // console.log("这里读出企业账户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/demand/demandList', htmlBody);
}); 

///借款需求
router.get('/:id/show', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id
    		+"&userId="+req.query.userId
    		+"&companyId="+req.query.companyId
    		)).then(function (body) {
        var body1 = JSON.parse(body);
        if (body1.resultCode === "SUCCESSFUL") {
        	htmlBody.demand = body1.data;////  
        	 console.log("这里借款需求详情：" + body);
             next();
        } else {
        	var msg = body1.message;
        	   ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>parent.window.location.href="/mzb/demand"; alert("'+msg+'");</script></html>');
            res.end();
       } 
       
    }); 
}); 
//企业信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


///借款需求
router.get('/:id/join', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
router.get('/:id/show', function (req, res, next) { 
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/demandShow', htmlBody);
}); 

//go 参与需求
router.get('/toJoinDemand/:inCompany/:id', function (req, res, next) {
    console.log("in go 参与需求：");
    htmlBody.title = "参与需求";
    htmlBody.inCompany = req.params.inCompany;
    htmlBody.id = req.params.id;
    //htmlBody.backUrl = "/mzb/demand/"+req.params.id+"/show";
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/joinDemand', htmlBody);
});
//do 参与需求
router.post('/doJoinDemand', function (req, res, next) {
    console.log("IN 参与需求 outCompany："+res.locals.company.id+"demand的id："+req.body.id);
    res.locals._layoutFile = false;
//    req.body.id = req.params.id;
    req.body.outCompany=res.locals.company.id;
    req.body.sourceId=req.body.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/joinDemand'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body351 = JSON.parse(body);
        console.log("申请贷款--body：" + body); 
        if (htmlBody.body351.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与需求成功!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
        } else if (htmlBody.body351.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script>alert("已经参与过!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
       } else if (htmlBody.body351.resultCode === "SAME") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("自己不能参与自己的需求!");</script></html>');
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
router.get('/', function (req, res, next) { 
     
     var urlParam=req.originalUrl.replace("/mzb/demand","");
     if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.company.id;
     }else{
         urlParam="?companyId="+res.locals.company.id;
     }
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
}); 
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        // console.log("这里读出企业账户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/demand/demandList', htmlBody);
}); 

///借款需求
router.get('/:id/show', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id
    		+"&userId="+req.query.userId
    		+"&companyId="+req.query.companyId
    		)).then(function (body) {
        var body1 = JSON.parse(body);
        if (body1.resultCode === "SUCCESSFUL") {
        	htmlBody.demand = body1.data;////  
        	 console.log("这里借款需求详情：" + body);
             next();
        } else {
        	var msg = body1.message;
        	   ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>parent.window.location.href="/mzb/demand"; alert("'+msg+'");</script></html>');
            res.end();
       } 
       
    }); 
}); 
//企业信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


///借款需求
router.get('/:id/join', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
router.get('/:id/show', function (req, res, next) { 
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/demandShow', htmlBody);
}); 

//go 参与需求
router.get('/toJoinDemand/:inCompany/:id', function (req, res, next) {
    console.log("in go 参与需求：");
    htmlBody.title = "参与需求";
    htmlBody.inCompany = req.params.inCompany;
    htmlBody.id = req.params.id;
    //htmlBody.backUrl = "/mzb/demand/"+req.params.id+"/show";
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/joinDemand', htmlBody);
});
//do 参与需求
router.post('/doJoinDemand', function (req, res, next) {
    console.log("IN 参与需求 outCompany："+res.locals.company.id+"demand的id："+req.body.id);
    res.locals._layoutFile = false;
//    req.body.id = req.params.id;
    req.body.outCompany=res.locals.company.id;
    req.body.sourceId=req.body.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/joinDemand'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body351 = JSON.parse(body);
        console.log("申请贷款--body：" + body); 
        if (htmlBody.body351.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与需求成功!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
        } else if (htmlBody.body351.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script>alert("已经参与过!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
       } else if (htmlBody.body351.resultCode === "SAME") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("自己不能参与自己的需求!");</script></html>');
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
router.get('/', function (req, res, next) { 
     
     var urlParam=req.originalUrl.replace("/mzb/demand","");
     if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.company.id;
     }else{
         urlParam="?companyId="+res.locals.company.id;
     }
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
}); 
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        // console.log("这里读出企业账户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/demand/demandList', htmlBody);
}); 

///借款需求
router.get('/:id/show', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id
    		+"&userId="+req.query.userId
    		+"&companyId="+req.query.companyId
    		)).then(function (body) {
        var body1 = JSON.parse(body);
        if (body1.resultCode === "SUCCESSFUL") {
        	htmlBody.demand = body1.data;////  
        	 console.log("这里借款需求详情：" + body);
             next();
        } else {
        	var msg = body1.message;
        	   ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>parent.window.location.href="/mzb/demand"; alert("'+msg+'");</script></html>');
            res.end();
       } 
       
    }); 
}); 
//企业信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


///借款需求
router.get('/:id/join', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
router.get('/:id/show', function (req, res, next) { 
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/demandShow', htmlBody);
}); 

//go 参与需求
router.get('/toJoinDemand/:inCompany/:id', function (req, res, next) {
    console.log("in go 参与需求：");
    htmlBody.title = "参与需求";
    htmlBody.inCompany = req.params.inCompany;
    htmlBody.id = req.params.id;
    //htmlBody.backUrl = "/mzb/demand/"+req.params.id+"/show";
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/joinDemand', htmlBody);
});
//do 参与需求
router.post('/doJoinDemand', function (req, res, next) {
    console.log("IN 参与需求 outCompany："+res.locals.company.id+"demand的id："+req.body.id);
    res.locals._layoutFile = false;
//    req.body.id = req.params.id;
    req.body.outCompany=res.locals.company.id;
    req.body.sourceId=req.body.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/joinDemand'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body351 = JSON.parse(body);
        console.log("申请贷款--body：" + body); 
        if (htmlBody.body351.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与需求成功!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
        } else if (htmlBody.body351.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script>alert("已经参与过!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
       } else if (htmlBody.body351.resultCode === "SAME") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("自己不能参与自己的需求!");</script></html>');
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
router.get('/', function (req, res, next) { 
     
     var urlParam=req.originalUrl.replace("/mzb/demand","");
     if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.company.id;
     }else{
         urlParam="?companyId="+res.locals.company.id;
     }
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
}); 
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        // console.log("这里读出企业账户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/demand/demandList', htmlBody);
}); 

///借款需求
router.get('/:id/show', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id
    		+"&userId="+req.query.userId
    		+"&companyId="+req.query.companyId
    		)).then(function (body) {
        var body1 = JSON.parse(body);
        if (body1.resultCode === "SUCCESSFUL") {
        	htmlBody.demand = body1.data;////  
        	 console.log("这里借款需求详情：" + body);
             next();
        } else {
        	var msg = body1.message;
        	   ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>parent.window.location.href="/mzb/demand"; alert("'+msg+'");</script></html>');
            res.end();
       } 
       
    }); 
}); 
//企业信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


///借款需求
router.get('/:id/join', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
router.get('/:id/show', function (req, res, next) { 
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/demandShow', htmlBody);
}); 

//go 参与需求
router.get('/toJoinDemand/:inCompany/:id', function (req, res, next) {
    console.log("in go 参与需求：");
    htmlBody.title = "参与需求";
    htmlBody.inCompany = req.params.inCompany;
    htmlBody.id = req.params.id;
    //htmlBody.backUrl = "/mzb/demand/"+req.params.id+"/show";
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/joinDemand', htmlBody);
});
//do 参与需求
router.post('/doJoinDemand', function (req, res, next) {
    console.log("IN 参与需求 outCompany："+res.locals.company.id+"demand的id："+req.body.id);
    res.locals._layoutFile = false;
//    req.body.id = req.params.id;
    req.body.outCompany=res.locals.company.id;
    req.body.sourceId=req.body.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/joinDemand'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body351 = JSON.parse(body);
        console.log("申请贷款--body：" + body); 
        if (htmlBody.body351.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与需求成功!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
        } else if (htmlBody.body351.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script>alert("已经参与过!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
       } else if (htmlBody.body351.resultCode === "SAME") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("自己不能参与自己的需求!");</script></html>');
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
router.get('/', function (req, res, next) { 
     
     var urlParam=req.originalUrl.replace("/mzb/demand","");
     if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.company.id;
     }else{
         urlParam="?companyId="+res.locals.company.id;
     }
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
}); 
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        // console.log("这里读出企业账户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/demand/demandList', htmlBody);
}); 

///借款需求
router.get('/:id/show', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id
    		+"&userId="+req.query.userId
    		+"&companyId="+req.query.companyId
    		)).then(function (body) {
        var body1 = JSON.parse(body);
        if (body1.resultCode === "SUCCESSFUL") {
        	htmlBody.demand = body1.data;////  
        	 console.log("这里借款需求详情：" + body);
             next();
        } else {
        	var msg = body1.message;
        	   ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>parent.window.location.href="/mzb/demand"; alert("'+msg+'");</script></html>');
            res.end();
       } 
       
    }); 
}); 
//企业信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


///借款需求
router.get('/:id/join', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
router.get('/:id/show', function (req, res, next) { 
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/demandShow', htmlBody);
}); 

//go 参与需求
router.get('/toJoinDemand/:inCompany/:id', function (req, res, next) {
    console.log("in go 参与需求：");
    htmlBody.title = "参与需求";
    htmlBody.inCompany = req.params.inCompany;
    htmlBody.id = req.params.id;
    //htmlBody.backUrl = "/mzb/demand/"+req.params.id+"/show";
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/joinDemand', htmlBody);
});
//do 参与需求
router.post('/doJoinDemand', function (req, res, next) {
    console.log("IN 参与需求 outCompany："+res.locals.company.id+"demand的id："+req.body.id);
    res.locals._layoutFile = false;
//    req.body.id = req.params.id;
    req.body.outCompany=res.locals.company.id;
    req.body.sourceId=req.body.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/joinDemand'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body351 = JSON.parse(body);
        console.log("申请贷款--body：" + body); 
        if (htmlBody.body351.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与需求成功!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
        } else if (htmlBody.body351.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script>alert("已经参与过!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
       } else if (htmlBody.body351.resultCode === "SAME") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("自己不能参与自己的需求!");</script></html>');
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
router.get('/', function (req, res, next) { 
     
     var urlParam=req.originalUrl.replace("/mzb/demand","");
     if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.company.id;
     }else{
         urlParam="?companyId="+res.locals.company.id;
     }
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
}); 
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        // console.log("这里读出企业账户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/demand/demandList', htmlBody);
}); 

///借款需求
router.get('/:id/show', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id
    		+"&userId="+req.query.userId
    		+"&companyId="+req.query.companyId
    		)).then(function (body) {
        var body1 = JSON.parse(body);
        if (body1.resultCode === "SUCCESSFUL") {
        	htmlBody.demand = body1.data;////  
        	 console.log("这里借款需求详情：" + body);
             next();
        } else {
        	var msg = body1.message;
        	   ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>parent.window.location.href="/mzb/demand"; alert("'+msg+'");</script></html>');
            res.end();
       } 
       
    }); 
}); 
//企业信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


///借款需求
router.get('/:id/join', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
router.get('/:id/show', function (req, res, next) { 
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/demandShow', htmlBody);
}); 

//go 参与需求
router.get('/toJoinDemand/:inCompany/:id', function (req, res, next) {
    console.log("in go 参与需求：");
    htmlBody.title = "参与需求";
    htmlBody.inCompany = req.params.inCompany;
    htmlBody.id = req.params.id;
    //htmlBody.backUrl = "/mzb/demand/"+req.params.id+"/show";
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/joinDemand', htmlBody);
});
//do 参与需求
router.post('/doJoinDemand', function (req, res, next) {
    console.log("IN 参与需求 outCompany："+res.locals.company.id+"demand的id："+req.body.id);
    res.locals._layoutFile = false;
//    req.body.id = req.params.id;
    req.body.outCompany=res.locals.company.id;
    req.body.sourceId=req.body.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/joinDemand'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body351 = JSON.parse(body);
        console.log("申请贷款--body：" + body); 
        if (htmlBody.body351.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与需求成功!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
        } else if (htmlBody.body351.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script>alert("已经参与过!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
       } else if (htmlBody.body351.resultCode === "SAME") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("自己不能参与自己的需求!");</script></html>');
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
router.get('/', function (req, res, next) { 
     
     var urlParam=req.originalUrl.replace("/mzb/demand","");
     if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.company.id;
     }else{
         urlParam="?companyId="+res.locals.company.id;
     }
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
}); 
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        // console.log("这里读出企业账户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/demand/demandList', htmlBody);
}); 

///借款需求
router.get('/:id/show', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id
    		+"&userId="+req.query.userId
    		+"&companyId="+req.query.companyId
    		)).then(function (body) {
        var body1 = JSON.parse(body);
        if (body1.resultCode === "SUCCESSFUL") {
        	htmlBody.demand = body1.data;////  
        	 console.log("这里借款需求详情：" + body);
             next();
        } else {
        	var msg = body1.message;
        	   ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>parent.window.location.href="/mzb/demand"; alert("'+msg+'");</script></html>');
            res.end();
       } 
       
    }); 
}); 
//企业信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


///借款需求
router.get('/:id/join', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
router.get('/:id/show', function (req, res, next) { 
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/demandShow', htmlBody);
}); 

//go 参与需求
router.get('/toJoinDemand/:inCompany/:id', function (req, res, next) {
    console.log("in go 参与需求：");
    htmlBody.title = "参与需求";
    htmlBody.inCompany = req.params.inCompany;
    htmlBody.id = req.params.id;
    //htmlBody.backUrl = "/mzb/demand/"+req.params.id+"/show";
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/joinDemand', htmlBody);
});
//do 参与需求
router.post('/doJoinDemand', function (req, res, next) {
    console.log("IN 参与需求 outCompany："+res.locals.company.id+"demand的id："+req.body.id);
    res.locals._layoutFile = false;
//    req.body.id = req.params.id;
    req.body.outCompany=res.locals.company.id;
    req.body.sourceId=req.body.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/joinDemand'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body351 = JSON.parse(body);
        console.log("申请贷款--body：" + body); 
        if (htmlBody.body351.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与需求成功!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
        } else if (htmlBody.body351.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script>alert("已经参与过!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
       } else if (htmlBody.body351.resultCode === "SAME") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("自己不能参与自己的需求!");</script></html>');
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
router.get('/', function (req, res, next) { 
     
     var urlParam=req.originalUrl.replace("/mzb/demand","");
     if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.company.id;
     }else{
         urlParam="?companyId="+res.locals.company.id;
     }
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
}); 
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        // console.log("这里读出企业账户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/demand/demandList', htmlBody);
}); 

///借款需求
router.get('/:id/show', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id
    		+"&userId="+req.query.userId
    		+"&companyId="+req.query.companyId
    		)).then(function (body) {
        var body1 = JSON.parse(body);
        if (body1.resultCode === "SUCCESSFUL") {
        	htmlBody.demand = body1.data;////  
        	 console.log("这里借款需求详情：" + body);
             next();
        } else {
        	var msg = body1.message;
        	   ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>parent.window.location.href="/mzb/demand"; alert("'+msg+'");</script></html>');
            res.end();
       } 
       
    }); 
}); 
//企业信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


///借款需求
router.get('/:id/join', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
router.get('/:id/show', function (req, res, next) { 
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/demandShow', htmlBody);
}); 

//go 参与需求
router.get('/toJoinDemand/:inCompany/:id', function (req, res, next) {
    console.log("in go 参与需求：");
    htmlBody.title = "参与需求";
    htmlBody.inCompany = req.params.inCompany;
    htmlBody.id = req.params.id;
    //htmlBody.backUrl = "/mzb/demand/"+req.params.id+"/show";
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/joinDemand', htmlBody);
});
//do 参与需求
router.post('/doJoinDemand', function (req, res, next) {
    console.log("IN 参与需求 outCompany："+res.locals.company.id+"demand的id："+req.body.id);
    res.locals._layoutFile = false;
//    req.body.id = req.params.id;
    req.body.outCompany=res.locals.company.id;
    req.body.sourceId=req.body.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/joinDemand'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body351 = JSON.parse(body);
        console.log("申请贷款--body：" + body); 
        if (htmlBody.body351.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与需求成功!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
        } else if (htmlBody.body351.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script>alert("已经参与过!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
       } else if (htmlBody.body351.resultCode === "SAME") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("自己不能参与自己的需求!");</script></html>');
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
router.get('/', function (req, res, next) { 
     
     var urlParam=req.originalUrl.replace("/mzb/demand","");
     if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.company.id;
     }else{
         urlParam="?companyId="+res.locals.company.id;
     }
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
}); 
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        // console.log("这里读出企业账户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/demand/demandList', htmlBody);
}); 

///借款需求
router.get('/:id/show', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id
    		+"&userId="+req.query.userId
    		+"&companyId="+req.query.companyId
    		)).then(function (body) {
        var body1 = JSON.parse(body);
        if (body1.resultCode === "SUCCESSFUL") {
        	htmlBody.demand = body1.data;////  
        	 console.log("这里借款需求详情：" + body);
             next();
        } else {
        	var msg = body1.message;
        	   ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>parent.window.location.href="/mzb/demand"; alert("'+msg+'");</script></html>');
            res.end();
       } 
       
    }); 
}); 
//企业信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


///借款需求
router.get('/:id/join', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
router.get('/:id/show', function (req, res, next) { 
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/demandShow', htmlBody);
}); 

//go 参与需求
router.get('/toJoinDemand/:inCompany/:id', function (req, res, next) {
    console.log("in go 参与需求：");
    htmlBody.title = "参与需求";
    htmlBody.inCompany = req.params.inCompany;
    htmlBody.id = req.params.id;
    //htmlBody.backUrl = "/mzb/demand/"+req.params.id+"/show";
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/joinDemand', htmlBody);
});
//do 参与需求
router.post('/doJoinDemand', function (req, res, next) {
    console.log("IN 参与需求 outCompany："+res.locals.company.id+"demand的id："+req.body.id);
    res.locals._layoutFile = false;
//    req.body.id = req.params.id;
    req.body.outCompany=res.locals.company.id;
    req.body.sourceId=req.body.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/joinDemand'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body351 = JSON.parse(body);
        console.log("申请贷款--body：" + body); 
        if (htmlBody.body351.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与需求成功!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
        } else if (htmlBody.body351.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script>alert("已经参与过!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
       } else if (htmlBody.body351.resultCode === "SAME") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("自己不能参与自己的需求!");</script></html>');
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
router.get('/', function (req, res, next) { 
     
     var urlParam=req.originalUrl.replace("/mzb/demand","");
     if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.company.id;
     }else{
         urlParam="?companyId="+res.locals.company.id;
     }
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
}); 
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        // console.log("这里读出企业账户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/demand/demandList', htmlBody);
}); 

///借款需求
router.get('/:id/show', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id
    		+"&userId="+req.query.userId
    		+"&companyId="+req.query.companyId
    		)).then(function (body) {
        var body1 = JSON.parse(body);
        if (body1.resultCode === "SUCCESSFUL") {
        	htmlBody.demand = body1.data;////  
        	 console.log("这里借款需求详情：" + body);
             next();
        } else {
        	var msg = body1.message;
        	   ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>parent.window.location.href="/mzb/demand"; alert("'+msg+'");</script></html>');
            res.end();
       } 
       
    }); 
}); 
//企业信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


///借款需求
router.get('/:id/join', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
router.get('/:id/show', function (req, res, next) { 
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/demandShow', htmlBody);
}); 

//go 参与需求
router.get('/toJoinDemand/:inCompany/:id', function (req, res, next) {
    console.log("in go 参与需求：");
    htmlBody.title = "参与需求";
    htmlBody.inCompany = req.params.inCompany;
    htmlBody.id = req.params.id;
    //htmlBody.backUrl = "/mzb/demand/"+req.params.id+"/show";
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/joinDemand', htmlBody);
});
//do 参与需求
router.post('/doJoinDemand', function (req, res, next) {
    console.log("IN 参与需求 outCompany："+res.locals.company.id+"demand的id："+req.body.id);
    res.locals._layoutFile = false;
//    req.body.id = req.params.id;
    req.body.outCompany=res.locals.company.id;
    req.body.sourceId=req.body.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/joinDemand'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body351 = JSON.parse(body);
        console.log("申请贷款--body：" + body); 
        if (htmlBody.body351.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与需求成功!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
        } else if (htmlBody.body351.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script>alert("已经参与过!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
       } else if (htmlBody.body351.resultCode === "SAME") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("自己不能参与自己的需求!");</script></html>');
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
router.get('/', function (req, res, next) { 
     
     var urlParam=req.originalUrl.replace("/mzb/demand","");
     if(urlParam.indexOf("?")>-1)
     {
         urlParam+="&companyId="+res.locals.company.id;
     }else{
         urlParam="?companyId="+res.locals.company.id;
     }
     rp(config.getUrl(req, res, "/api/v1/loandemand/list"+urlParam)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demandList = body1;////这个地方不能用 htmlBody.body
        console.log("这里借款需求列表：" + body);
        next();
    });
}); 
router.get('/', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/companyaccount/getOne?id=" + res.locals.company.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.companyAccount = body1.data;////这个地方不能用 htmlBody.body
        // console.log("这里读出企业账户内容：" + body);
        next();
    });
});
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    htmlBody.backUrl = "/mzb/userCenter/";
    res.render('mobile/b/demand/demandList', htmlBody);
}); 

///借款需求
router.get('/:id/show', function (req, res, next) {
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id
    		+"&userId="+req.query.userId
    		+"&companyId="+req.query.companyId
    		)).then(function (body) {
        var body1 = JSON.parse(body);
        if (body1.resultCode === "SUCCESSFUL") {
        	htmlBody.demand = body1.data;////  
        	 console.log("这里借款需求详情：" + body);
             next();
        } else {
        	var msg = body1.message;
        	   ///父窗口弹窗提示 错误
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>parent.window.location.href="/mzb/demand"; alert("'+msg+'");</script></html>');
            res.end();
       } 
       
    }); 
}); 
//企业信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/company/getOne?id="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandCompany = body1.data;//// 
        console.log("这里借款需求-demandCompany详情：" + body);
        next();
    }); 
}); 
////联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getOne?id="+htmlBody.demand.unionId)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.demandUnion = body1.data;////  
        next();
    }); 
}); 
////加入的其他联盟信息
router.get('/:id/show', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/unionchain/getCompanyUnions?companyId="+htmlBody.demand.intCompany)).then(function (body) {
        var body1 = JSON.parse(body); 
        htmlBody.joinUnions = body1;////  
        console.log("这里unionchain：" + body);
        next();
    }); 
}); 


///借款需求
router.get('/:id/join', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
    rp(config.getUrl(req, res, "/api/v1/loandemand/getOne?id="+req.params.id)).then(function (body) {
        var body1 = JSON.parse(body);
        htmlBody.demand = body1.data;////  
        console.log("这里借款需求详情：" + body);
        next();
    }); 
}); 
router.get('/:id/show', function (req, res, next) { 
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/demandShow', htmlBody);
}); 

//go 参与需求
router.get('/toJoinDemand/:inCompany/:id', function (req, res, next) {
    console.log("in go 参与需求：");
    htmlBody.title = "参与需求";
    htmlBody.inCompany = req.params.inCompany;
    htmlBody.id = req.params.id;
    //htmlBody.backUrl = "/mzb/demand/"+req.params.id+"/show";
    htmlBody.backUrl = "";
    res.render('mobile/b/demand/joinDemand', htmlBody);
});
//do 参与需求
router.post('/doJoinDemand', function (req, res, next) {
    console.log("IN 参与需求 outCompany："+res.locals.company.id+"demand的id："+req.body.id);
    res.locals._layoutFile = false;
//    req.body.id = req.params.id;
    req.body.outCompany=res.locals.company.id;
    req.body.sourceId=req.body.id;
    var options = {
        method: 'POST',
        uri: config.getUrlPost(req, '/api/v1/loandemand/joinDemand'),
        form: config.postData(req, req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    rp(options).then(function (body) {
        console.log(body + "-->err");
        htmlBody.body351 = JSON.parse(body);
        console.log("申请贷款--body：" + body); 
        if (htmlBody.body351.resultCode === "SUCCESSFUL") {
            console.log("SUCCESSFUL：");
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
            res.write('<html><script>alert("参与需求成功!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
        } else if (htmlBody.body351.resultCode === "EXIST") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            ///配合模板中的iframe父窗口跳转到
            res.write('<html><script>alert("已经参与过!");parent.window.location.href="/mzb/demand";</script></html>');
            res.end();
       } else if (htmlBody.body351.resultCode === "SAME") {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8', });
            res.write('<html><script>alert("自己不能参与自己的需求!");</script></html>');
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
