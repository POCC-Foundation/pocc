var express = require('express');
var rp = require('request-promise');
var config = require('../config/config');
var utilTool = require('../config/utilTool');
var configContant = require('../config/configContant');
var qs = require('qs');
var router = express.Router();

var formView="app/form";
var backView="app/back";
 
var htmlBody = {};
router.use(function (req, res, next) {
    htmlBody = {};
    //var code=req.query.code;///根据这个参数来 判断app端请求的什么接口，来显示不同的界面
   // if()
    if (req.session.fromapp == 1)
    {
        res.locals.fromapp = "1";
        htmlBody.fromapp = "1";
        if (req.session.apptype == 1)
        {
            res.locals.apptype = "1";
            htmlBody.apptype = "1";
            res.locals.source = "Android";
        } else {
            res.locals.apptype = "0";
            htmlBody.apptype = "0";
            res.locals.source = "APP";
        }
    } else {
        res.locals.fromapp = "0";
        res.locals.apptype = "0";
        htmlBody.fromapp = "0";
     //   res.locals.source = "MZ";
    }
    next();
});

router.use(function (req, res, next) {
    if (typeof (res.locals.user) == "undefined" || res.locals.user == null || res.locals.user == '') {
        res.redirect("/mzc/login");
        return;
    } else {
        next();
    }
});

router.get("/RelaceUserRedis", function (req, res, next) { 
       console.log("1111112323232===="+req.session.code);
        htmlBody.code=req.query.code;
        htmlBody.source=req.query.source;
       console.log("source===="+req.session.source+"23232323232"+req.query.source);
        htmlBody.resp_code=req.body.resp_code;
        htmlBody.resp_desc=req.query.resp_desc;
        
    rp(config.getUrlClear(req, res,  '/api/v2/user/'+res.locals.user.id+'/userinfo?isRelaceUserRedis=true' )).then(function (body) {
       console.log("1111112323232====");
        htmlBody.resp_code='0000';
        htmlBody.resp_desc='成功';
        res.render(backView, htmlBody);
    }).catch(function (error) {
        res.send(error);
    });
});




//开户绑卡
router.get("/kaihu", function (req, res, next) { 
        console.log("111113321===="+res.locals.user.enterprise);
        req.session.source=req.query.source;
        ///cardNbr!=1 说明 四码开户未成功
        htmlBody.codeTitle='kaihu';
            var requestOpts = {
                body: {
                    fromsource: 4,
                    rebackUrl: config.myDomain+'/mzc/app/bankUrlBack?source='+req.query.source,
                    client_tp: '1',//m站
                    userid:res.locals.user.id,
                    usr_attr: res.locals.user.hid,
                    enterprise: res.locals.user.enterprise//个人企业 
                            /**
                             * 这里可能要做些初始化的赋值，如授权的范围，授权的额度，授权的时间。等等 一些非必填的字段。 3.5号上线可不考虑那么多
                             */
                }};
            var options = {
                method: 'POST',
                uri: config.getUrlPost(req, '/apk/bankAddUser/addUser'),
                // uri: 'http://www.wanghao.com:3000/test/1',
                form: config.postData(req, requestOpts.body),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            rp(options).then(function (body) { 
                htmlBody.kaihu= JSON.parse(body);
                 htmlBody.code="0000";
                htmlBody.opt="kaihu";
                console.log("用户类型是：======"+res.locals.user.enterprise+"数据是"+JSON.parse(body)+" htmlBody.kaihu是："+  htmlBody.kaihu.htmlText);
              res.render(formView, htmlBody);
            }).catch(function (err) {
                console.log(err + "-->err");
                res.send(err);
            });
});

/**
 * 
 * 开户处理结束返回的地址
 */
router.post("/bankUrlBack", function (req, res, next) {
     res.locals._layoutFile = false; 
     htmlBody.codeTitle='kaihu';
     htmlBody.code='kaihu';
     htmlBody.resp_desc=req.body.resp_desc;
     htmlBody.resp_code=req.body.resp_code;
     htmlBody.source=req.query.source;
     res.locals.source=req.query.source;
     console.log(req.body.resp_code);//返回结果码  0000说明是成功的
     console.log(req.body.resp_desc);//返回的结果描述
     var parameter=qs.stringify(req.body);//把post里面的参数 转化为 a=1&b=2&c=3这样的格式
     console.log(qs.stringify(req.body));
     if (req.body.resp_code == '0000')
    {
        rp(config.getUrlClear(req, res,  '/apk/bankAddUser/addUserBack?' + parameter)).then(function (body) {
             res.redirect('/mzc/app/RelaceUserRedis?source='+ res.locals.source+"&code=kaihu");///开户，用户授权 等 需要去刷新redis缓存  其他可以跳过这步骤
        }).catch(function (error) {
            htmlBody.codeTitle='开户失败';
            htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
            res.render(backView, htmlBody);
        });
    }else{
        htmlBody.codeTitle=req.body.resp_code+":"+req.body.resp_desc;
        htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
        res.render(backView, htmlBody);
    }
});


      
 
 //绑卡
router.get("/bangka", function (req, res, next) { 
        ///cardNbr!=1 说明 四码开户未成功
        htmlBody.codeTitle='bangka';
        req.session.source=req.query.source;
       // req.session.source=req.boby.source;
            var requestOpts = {
                body: {
                    fromsource: 4,
                    rebackUrl: config.myDomain+'/mzc/app/bkUrlBack?source='+req.query.source,
                    client_tp: '1',//m站
                    userid:res.locals.user.id,
                    usr_attr: res.locals.user.hid,
                    enterprise: res.locals.user.enterprise//个人企业 
                            /**
                             * 这里可能要做些初始化的赋值，如授权的范围，授权的额度，授权的时间。等等 一些非必填的字段。 3.5号上线可不考虑那么多
                             */
                }};
            var options = {
                method: 'POST',
                uri: config.getUrlPost(req, '/apk/unbindCard/bindCardUser'),
                // uri: 'http://www.wanghao.com:3000/test/1',
                form: config.postData(req, requestOpts.body),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            rp(options).then(function (body) { 
                htmlBody.kaihu= JSON.parse(body);
                htmlBody.kaihu2="hhh";
                 htmlBody.code="0000";
                htmlBody.opt="bangka";
                console.log("用户类型是：======"+res.locals.user.enterprise+"数据是"+JSON.parse(body)+" htmlBody.kaihu是："+  htmlBody.kaihu.htmlText);
              res.render(formView, htmlBody);
            }).catch(function (err) {
                console.log(err + "-->err");
                res.send(err);
            });
});

 
 /**
 * 
 * 绑卡处理结束返回的地址
 */
router.post("/bkUrlBack", function (req, res, next) {
     res.locals._layoutFile = false; 
     htmlBody.codeTitle='bangka';
     htmlBody.code='bangka';
     htmlBody.resp_desc=req.body.resp_desc;
    htmlBody.resp_code=req.body.resp_code;
      htmlBody.source=req.query.source;
     res.locals.source=req.query.source;
     console.log(req.body.resp_code);//返回结果码  0000说明是成功的
     console.log(req.body.resp_desc);//返回的结果描述
     var parameter=qs.stringify(req.body);//把post里面的参数 转化为 a=1&b=2&c=3这样的格式
     console.log(qs.stringify(req.body));
     if (req.body.resp_code == '0000')
    {
        rp(config.getUrlClear(req, res,  '/apk/unbindCard/bindCardUserBack?' + parameter)).then(function (body) {
              res.redirect('/mzc/app/RelaceUserRedis?source='+ res.locals.source+"&code=bangka");///开户，用户授权 等 需要去刷新redis缓存 
        }).catch(function (error) {
            htmlBody.codeTitle='开户失败';
            htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
            res.render(backView, htmlBody);
        });
    }else{
        htmlBody.codeTitle=req.body.resp_code+":"+req.body.resp_desc;
        htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
        res.render(backView, htmlBody);
    }
});
 

 
 
 //解绑
router.get("/jiebang", function (req, res, next) { 
        console.log("111111===="+res.locals.user.enterprise);
        req.session.source=req.query.source;
        ///cardNbr!=1 说明 四码开户未成功
        htmlBody.codeTitle='jiebang';
            var requestOpts = {
                body: {
                    fromsource: 4,
                    rebackUrl: config.myDomain+'/mzc/app/jiebangBackUrl?source='+req.query.source,
                    client_tp: '1',//m站
                    userid:res.locals.user.id,
                    usr_attr: res.locals.user.hid,
                    enterprise: res.locals.user.enterprise//个人企业 
                            /**
                             * 这里可能要做些初始化的赋值，如授权的范围，授权的额度，授权的时间。等等 一些非必填的字段。 3.5号上线可不考虑那么多
                             */
                }};
            var options = {
                method: 'POST',
                uri: config.getUrlPost(req, '/apk/unbindCard/unbindCardUser'),
                // uri: 'http://www.wanghao.com:3000/test/1',
                form: config.postData(req, requestOpts.body),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            rp(options).then(function (body) { 
                htmlBody.kaihu= JSON.parse(body);
                htmlBody.code="0000";
                htmlBody.opt="jiebang";
                console.log("用户类型是：======"+res.locals.user.enterprise+"数据是"+JSON.parse(body)+" htmlBody.kaihu是："+  htmlBody.kaihu.htmlText);
              res.render(formView, htmlBody);
            }).catch(function (err) {
                console.log(err + "-->err");
                res.send(err);
            });
});


 /**
 * 
 * 解绑结束返回的地址
 */
router.post("/jiebangBackUrl", function (req, res, next) {
     res.locals._layoutFile = false; 
     htmlBody.codeTitle='jiebang';
     htmlBody.code='jiebang';
     htmlBody.resp_desc=req.body.resp_desc;
    htmlBody.resp_code=req.body.resp_code;
     htmlBody.source=req.query.source;
     res.locals.source=req.query.source;
     console.log(req.body.resp_code);//返回结果码  0000说明是成功的
     console.log(req.body.resp_desc);//返回的结果描述
     var parameter=qs.stringify(req.body);//把post里面的参数 转化为 a=1&b=2&c=3这样的格式
     console.log(qs.stringify(req.body));
     if (req.body.resp_code == '0000')
    {
        rp(config.getUrlClear(req, res,  '/apk/unbindCard/unbindCardUserBack?' + parameter)).then(function (body) {
             res.redirect('/mzc/app/RelaceUserRedis?source='+ res.locals.source+"&code=jiebang");///开户，用户授权 等 需要去刷新redis缓存 
        }).catch(function (error) {
            htmlBody.codeTitle='开户失败';
            res.render(backView, htmlBody);
        });
    }else{
        htmlBody.codeTitle=req.body.resp_code+":"+req.body.resp_desc;
        res.render(backView, htmlBody);
    }
});
 
 

 
 //授权
router.get("/shouquan", function (req, res, next) { 
        console.log("111111===="+res.locals.user.enterprise+req.query.source);
        ///cardNbr!=1 说明 四码开户未成功
        req.session.source=req.query.source;
        htmlBody.codeTitle='shouquan';
            var requestOpts = {
                body: {
                    fromsource: 1,
                    back_notify_url: config.myDomain+'/mzc/app/sqBackUrl?source='+req.query.source,
                    page_notify_url: config.myDomain+'/mzc/app/sqBackUrl?source='+req.query.source,
                    source: 'ANDROID',//m站
                    userId:res.locals.user.id,
                    usr_attr: res.locals.user.hid,
                    enterprise: res.locals.user.enterprise//个人企业 
                            /**
                             * 这里可能要做些初始化的赋值，如授权的范围，授权的额度，授权的时间。等等 一些非必填的字段。 3.5号上线可不考虑那么多
                             */
                }};
            var options = {
                method: 'POST',
                uri: config.getUrlPost(req, '/api/sumpay/bid/form'),
                // uri: 'http://www.wanghao.com:3000/test/1',
                form: config.postData(req, requestOpts.body),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            rp(options).then(function (body) { 
                htmlBody.kaihu= JSON.parse(body);
                htmlBody.code="0000";
                htmlBody.opt="shouquan";
                console.log("用户类型是：======"+res.locals.user.enterprise+"数据是"+JSON.parse(body)+" htmlBody.kaihu是："+  htmlBody.kaihu.htmlText);
              res.render(formView, htmlBody);
            }).catch(function (err) {
                console.log(err + "-->err");
                res.send(err);
            });
});

 /**
 * 
 * 授权结束返回的地址
 */
router.post("/sqBackUrl", function (req, res, next) {
     res.locals._layoutFile = false; 
     htmlBody.codeTitle='shouquan';
     htmlBody.code='shouquan';
       htmlBody.resp_code=req.body.resp_code;
     htmlBody.resp_desc=req.body.resp_desc;
     req.session.source=req.query.source;
     res.locals.source=req.query.source;
     htmlBody.source=req.query.source;
      console.log('232390012k'+req.query.source);
     console.log(req.body.resp_code);//返回结果码  0000说明是成功的
     console.log(req.body.resp_desc);//返回的结果描述
     var parameter=qs.stringify(req.body);//把post里面的参数 转化为 a=1&b=2&c=3这样的格式
     console.log(qs.stringify(req.body));
     if (req.body.resp_code == '0000')
    {
        rp(config.getUrlClear(req, res,  '/apk/authorize/back?' + parameter)).then(function (body) {
            console.log(req.body.resp_desc+"2323-======================"+ res.locals.source);
            res.redirect('/mzc/app/RelaceUserRedis?source='+ res.locals.source+"&code=shouquan");///开户，用户授权 等 需要去刷新redis缓存  其他可以跳过这步骤
        }).catch(function (error) {
            htmlBody.codeTitle='开户失败';
            htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
            res.render(backView, htmlBody);
        });
    }else{
        htmlBody.codeTitle=req.body.resp_code+":"+req.body.resp_desc;
        htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
        res.render(backView, htmlBody);
    }
});
 
 
 //销户
router.get("/xiaohu", function (req, res, next) { 
        console.log("111111===="+res.locals.user.enterprise);
        ///cardNbr!=1 说明 四码开户未成功
        htmlBody.codeTitle='xiaohu';
         req.session.source=req.query.source;
            var requestOpts = {
                body: {
                    fromsource: 4,
                    rebackUrl: config.myDomain+'/mzc/app/xiaohuBackUrl?source='+req.query.source,
                    client_tp: '1',//m站
                    userid:res.locals.user.id,
                    usr_attr: res.locals.user.hid,
                    enterprise: res.locals.user.enterprise//个人企业 
                            /**
                             * 这里可能要做些初始化的赋值，如授权的范围，授权的额度，授权的时间。等等 一些非必填的字段。 3.5号上线可不考虑那么多
                             */
                }};
            var options = {
                method: 'POST',
                uri: config.getUrlPost(req, '/apk/bankAddUser/cancelAccount'),
                // uri: 'http://www.wanghao.com:3000/test/1',
                form: config.postData(req, requestOpts.body),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            rp(options).then(function (body) { 
                htmlBody.kaihu= JSON.parse(body);
                htmlBody.code="0000";
                htmlBody.opt="xiaohu";
                console.log("用户类型是：======"+res.locals.user.enterprise+"数据是"+JSON.parse(body)+" htmlBody.kaihu是："+  htmlBody.kaihu.htmlText);
              res.render(formView, htmlBody);
            }).catch(function (err) {
                console.log(err + "-->err");
                res.send(err);
            });
});

/**
 * 
 * 销户结束返回的地址
 */
router.post("/xiaohuBackUrl", function (req, res, next) {
     res.locals._layoutFile = false; 
     htmlBody.codeTitle='xiaohu';
     htmlBody.code='xiaohu';
     htmlBody.resp_desc=req.body.resp_desc;
     htmlBody.resp_code=req.body.resp_code;
     res.locals.source=req.query.source;
     htmlBody.source=req.query.source;
     console.log(req.body.resp_code);//返回结果码  0000说明是成功的
     console.log(req.body.resp_desc);//返回的结果描述
     var parameter=qs.stringify(req.body);//把post里面的参数 转化为 a=1&b=2&c=3这样的格式
     console.log(qs.stringify(req.body));
     if (req.body.resp_code == '0000')
    {
        rp(config.getUrlClear(req, res,  '/apk/bankAddUser/cancelAccountUrlBack?' + parameter)).then(function (body) {
            res.redirect('/mzc/app/RelaceUserRedis?source='+ res.locals.source+"&code=xiaohu");///开户，用户授权 等 需要去刷新redis缓存
        }).catch(function (error) {
            htmlBody.codeTitle='开户失败';
            htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
            res.render(backView, htmlBody);
        });
    }else{
        htmlBody.codeTitle=req.body.resp_code+":"+req.body.resp_desc;
        htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
        res.render(backView, htmlBody);
    }
});
 


 
 //重置密码
router.get("/resetPw", function (req, res, next) { 
        console.log("111111===="+res.locals.user.enterprise);
        ///cardNbr!=1 说明 四码开户未成功
        htmlBody.codeTitle='resetPw';
         req.session.source=req.query.source;
            var requestOpts = {
                body: {
                    fromsource: 4,
                    page_notify_url: config.myDomain+'/mzc/app/resetPwBackUrl?source='+req.query.source,
                    client_tp: '1',//m站
                    userId:res.locals.user.id,
                    usr_attr: res.locals.user.hid,
                    enterprise: res.locals.user.enterprise//个人企业 
                            /**
                             * 这里可能要做些初始化的赋值，如授权的范围，授权的额度，授权的时间。等等 一些非必填的字段。 3.5号上线可不考虑那么多
                             */
                }};
            var options = {
                method: 'POST',
                uri: config.getUrlPost(req, '/apk/bankAddUser/resetPw'),
                // uri: 'http://www.wanghao.com:3000/test/1',
                form: config.postData(req, requestOpts.body),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            rp(options).then(function (body) { 
                htmlBody.kaihu= JSON.parse(body);
                htmlBody.code="0000";
                htmlBody.opt="resetPw";
                console.log("用户类型是：======"+res.locals.user.enterprise+"数据是"+JSON.parse(body)+" htmlBody.kaihu是："+  htmlBody.kaihu.htmlText);
              res.render(formView, htmlBody);
            }).catch(function (err) {
                console.log(err + "-->err");
                res.send(err);
            });
});
 
 

/**
 * 
 * 重置密码结束返回的地址
 */
router.post("/resetPwBackUrl", function (req, res, next) {
     res.locals._layoutFile = false; 
     htmlBody.codeTitle='resetPw';
     htmlBody.code='resetPw';
       htmlBody.resp_code=req.body.resp_code;
     htmlBody.resp_desc=req.body.resp_desc;
     htmlBody.source=req.query.source;
     console.log(req.body.resp_code);//返回结果码  0000说明是成功的
     console.log(req.body.resp_desc);//返回的结果描述
     var parameter=qs.stringify(req.body);//把post里面的参数 转化为 a=1&b=2&c=3这样的格式
     console.log(qs.stringify(req.body));
     if (req.body.resp_code == '0000')
    {
            htmlBody.codeTitle='开户失败';
            htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
            res.render(backView, htmlBody);
    }else{
        htmlBody.codeTitle=req.body.resp_code+":"+req.body.resp_desc;
        htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
        res.render(backView, htmlBody);
    }
});
 
 
 
 
 
 
 
 
 //充值
router.get("/congzi", function (req, res, next) { 
        ///cardNbr!=1 说明 四码开户未成功
        htmlBody.codeTitle='congzi';
         req.session.source=req.query.source;
         req.session.amount=req.query.amount;
            var requestOpts = {
                body: {
                    fromsource: 4,
                    rebackUrl: config.myDomain+'/mzc/app/congziBackUrl?source='+req.query.source,
                    client_tp: '1',//m站
                    source: req.query.source,//m站
                    userId:res.locals.user.id,
                    amount: req.query.amount,
                            /**
                             * 这里可能要做些初始化的赋值，如授权的范围，授权的额度，授权的时间。等等 一些非必填的字段。 3.5号上线可不考虑那么多
                             */
                }};
            var options = {
                method: 'POST',
                uri: config.getUrlPost(req, '/api/yilian/recharge/savePay'),
                // uri: 'http://www.wanghao.com:3000/test/1',
                form: config.postData(req, requestOpts.body),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            rp(options).then(function (body) { 
                htmlBody.kaihu= JSON.parse(body).map;
                htmlBody.code="0000";
                htmlBody.opt="congzi";
                console.log("用户类型是：======"+res.locals.user.enterprise+"数据是"+JSON.parse(body)+" htmlBody.kaihu是："+  htmlBody.kaihu.htmlText
                        );
              res.render(formView, htmlBody);
            }).catch(function (err) {
                console.log(err + "-->err");
                res.send(err);
            });
});
 
 
 
 /**
 * 
 * 充值返回的地址
 */
router.post("/congziBackUrl", function (req, res, next) {
     res.locals._layoutFile = false; 
     htmlBody.codeTitle='congzi';
     htmlBody.code='congzi';
     htmlBody.resp_desc=req.body.resp_desc;
     htmlBody.resp_code=req.body.resp_code;
     htmlBody.source=req.query.source;
     console.log(req.body.resp_code);//返回结果码  0000说明是成功的
     console.log(req.body.resp_desc);//返回的结果描述
     var parameter=qs.stringify(req.body);//把post里面的参数 转化为 a=1&b=2&c=3这样的格式
     console.log(qs.stringify(req.body));
      if (req.body.resp_code == '0000')
    {
        rp(config.getUrlClear(req, res,  '/api/yilian/recharge/rechargeNoticeReturn?' + parameter)).then(function (body) {
           
            res.render(backView, htmlBody);
        }).catch(function (error) {
            htmlBody.codeTitle='开户失败';
            htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
            res.render(backView, htmlBody);
        });
    }else{
        htmlBody.codeTitle=req.body.resp_code+":"+req.body.resp_desc;
        htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
        res.render(backView, htmlBody);
    }
});
 
 
 
 






 //提现
router.get("/tixian", function (req, res, next) { 
        ///cardNbr!=1 说明 四码开户未成功
        htmlBody.codeTitle='tixian';
         req.session.source=req.query.source;
         req.session.amount=req.query.amount;
            var requestOpts = {
                body: {
                    fromsource: 4,
                    rebackUrl: config.myDomain+'/mzc/app/tixianBackUrl?source='+req.query.source,
                    client_tp: '1',//m站
                    source: req.query.source,//m站
                    userId:res.locals.user.id,
                    amount: req.query.amount,
                            /**
                             * 这里可能要做些初始化的赋值，如授权的范围，授权的额度，授权的时间。等等 一些非必填的字段。 3.5号上线可不考虑那么多
                             */
                }};
            var options = {
                method: 'POST',
                uri: config.getUrlPost(req, '/api/yilian/withdraw/savePay'),
                // uri: 'http://www.wanghao.com:3000/test/1',
                form: config.postData(req, requestOpts.body),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            rp(options).then(function (body) { 
                htmlBody.kaihu= JSON.parse(body).map;
                htmlBody.code="0000";
                htmlBody.opt="tixian";
                console.log("用户类型是：======"+res.locals.user.enterprise+"数据是"+JSON.parse(body)+" htmlBody.kaihu是："+  htmlBody.kaihu.htmlText
                        );
              res.render(formView, htmlBody);
            }).catch(function (err) {
                console.log(err + "-->err");
                res.send(err);
            });
});
 
 
 
 /**
 * 
 * 提现返回的地址
 */
router.post("/tixianBackUrl", function (req, res, next) {
     res.locals._layoutFile = false; 
     htmlBody.codeTitle='tixian';
     htmlBody.code='tixian';
     htmlBody.resp_desc=req.body.resp_desc;
     htmlBody.resp_code=req.body.resp_code;
     
     htmlBody.source=req.query.source;
     console.log(req.body.resp_code);//返回结果码  0000说明是成功的
     console.log(req.body.resp_desc);//返回的结果描述
     var parameter=qs.stringify(req.body);//把post里面的参数 转化为 a=1&b=2&c=3这样的格式
     console.log(qs.stringify(req.body));
      if (req.body.resp_code == '0000')
    {
        rp(config.getUrlClear(req, res,  '/api/yilian/withdraw/withdrawNoticeReturn?' + parameter)).then(function (body) {
            var session = req.session;
            session.code = 'tixian';
            session.resp_desc = req.body.resp_desc;
            res.render(backView, htmlBody);
        }).catch(function (error) {
            htmlBody.codeTitle='开户失败';
            htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
            res.render(backView, htmlBody);
        });
    }else{
        htmlBody.codeTitle=req.body.resp_code+":"+req.body.resp_desc;
        htmlBody.codeTitle='开户已失败，2秒钟后自动去往个人中心';
        res.render(backView, htmlBody);
    }
});
 



 
 
 
module.exports = router;


