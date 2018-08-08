var express = require('express');
var rp = require('request-promise');
var config = require('../config/config');
var router = express.Router();

var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody.srcSource = "index";
    htmlBody.title = "首页";
    htmlBody.isLogin = 0;
    if (res.locals.user) {
        res.locals.currentUser = res.locals.user;
        res.locals.userId = res.locals.user.id;
        htmlBody.isLogin = 1;
    } else {
        res.locals.currentUser = "";
        res.locals.userId = "";
    }
    next();
});
/*  
 //互金资讯
 router.get('/', function (req, res, next) {
 var str = "?page=" + 1 + "&size=" + 3;
 rp(config.getUrl(req,res, "/apk/article/COVERAGE/list" + str + "&name=" + encodeURIComponent('互金资讯'))).then(function (body) {
 var body1 = JSON.parse(body);
 if (body1.status === 0) {
 htmlBody.hujinzixunList = body1.data;
 console.log("互金资讯：" + htmlBody.hujinzixunList)
 }
 next();
 });
 }); 
 */
 

// 首页加载
router.get('/', function (req, res, next) {
    ///暂不加载数据，显示默认界面或者图片。
   
    res.locals._layoutFile = "./mobile/init/userCenter_layout.html";
    res.render('mobile/index/index', htmlBody);
}); 

router.get('/logout', function (req, res, next) {
    try {
        config.loginout(req, res);
        req.session.user = null;
    } catch (e) {
        console.log("==logout-222- logout=>" + e);
    }
    var from = req.query.from;
//    console.log("/logout   from" + from);
    if (from == "loginOne") {
        res.redirect('/?from=loginOne');
    } else {
        res.redirect('/');
    }
});

var captchapng = require('captchapng');
router.get('/captcha.png', function (req, res, next) {

    var fistNumber = parseInt(Math.random() * 1000);

    var lastNumber = parseInt(Math.random() * 10);
    var str_captch = fistNumber + "" + lastNumber;
    var p = new captchapng(100, 30, str_captch); // width,height,numeric captcha 
    req.session.picCode = str_captch;
    res.cookie('pic_cooobaidu_gbdj', str_captch, {maxAge: 10 * 60 * 1000, path: '/', httpOnly: true});
    //var p = new captchapng(80, 30, parseInt(Math.random() * 9000 + 1000)); // width,height,numeric captcha 
    p.color(200, 0, 0, 0);  // First color: background (red, green, blue, alpha) 
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha) 

    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
});
 
router.get('/echostr', function (req, res, next) {
    res.locals._layoutFile = false;
    req.body.ORDER_ID = req.params.ORDER_ID;
    console.log('/echostr-get--------' + req.query.echostr); 
    res.writeHead(200, {'Content-Type': 'text/html', });
    ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
    res.write(req.query.echostr);
    res.end();

});
router.post('/echostr', function (req, res, next) {
    res.locals._layoutFile = false;
    req.body.ORDER_ID = req.params.ORDER_ID;
    console.log('/echostr-post----' + req.body.echostr); 
    res.writeHead(200, {'Content-Type': 'text/html', });
    ///实名认证完成 配合模板中的iframe父窗口跳转到 預覽頁面
    res.write(req.body.echostr);
    res.end();

});
module.exports = router;