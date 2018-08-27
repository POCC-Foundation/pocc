var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var rp = require('request-promise');
var qs = require('qs');


engine = require('ejs-mate');
var session = require('express-session');
var config = require('./routes/config/config');
var utilTool = require('./routes/config/utilTool');
var configContant = require('./routes/config/configContant');
var RedisStore = require('connect-redis')(session);
var app = express();
// view engine setup
//app.engine('ejs', engine);

app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs'); // so you can render('index') 
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

//app.locals._layoutFile = 'layout.html';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));

app.use(function (req, res, next) {
    if (req.headers['content-type'] && req.headers['content-type'].indexOf('GBK') > -1) {
        req.headers['content-type'] = req.headers['content-type'].replace('GBK', 'UTF-8');
    }
    next();
});

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));

app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//app.use(function(req, res, next){
//  req.session._garbage = Date();
//  req.session.touch();
//  next();
//});


app.use(session({
    //store: new RedisStore({
        //host: config.redisIP,
        //port: config.redisPost,
        //pass: config.redisAuth,
        //ttl: 60 * 30
    //}),
    secret: 'doumanuser',
    name: 'doumanuser', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: (1000 * 60 * 30), httpOnly: true}//, 设置30分钟后session和相应的cookie失效过期
    //resave: false,
    //saveUninitialized: true,
}));

/*外部应用带token参数的默认登录设置   
 * 外部引用链接需要带的参数 fromapp=0 / 1
 * */
app.use(function (req, res, next) {

    var real_ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
    res.locals.ip=real_ip;
    //var referer_headers = req.headers.referer;
    //console.log("============用户访问真实IP：" + real_ip + " | " + new Date().getTime());
    //console.log("-#########----获取请求头的来源信息----->req.headers.referer===" + referer_headers);
    /*获取来源渠道参数*/
    if (req.url.indexOf('favicon.ico') > -1)
    {
        res.send("");
        return;
    }
    console.log("req.url------>" + req.url);
    if (req.query.fromapp) {
        console.log("you :" + req.session.fromapp);
        req.session.fromapp = req.query.fromapp;
    }else{
        req.session.fromapp = "";
    }
    
    if (req.query.apptype) {
        console.log("you :" + req.session.apptype);
        req.session.apptype = req.query.apptype;
    }else{
        req.session.apptype = "";
    }

    if (req.query.token && req.query.token != "undefined" && req.query.token != "null")
    {
        //console.log(req.query.token);
        res.cookie('ccat', req.query.token, {maxAge: 30 * 60 * 1000, path: '/', domain: config.cookieDomain, httpOnly: true});
//        console.log("=" + req.url);
//        if (!req.cookies.ccat) {
//            //console.log("没有得到" + tokenn);
//        } else {
//            //console.log("得到" + req.cookies.ccat);
//        }
        req.session.user = null;
        res.redirect(req.url.replace("token", "token2"));//因为写完cookie 要刷新后才能正常读到，所以在这里处理完以后，重新访问下网页

    }
    next();
});




app.use(function (req, res, next) {
    if (!req.cookies.ccat) {
        req.session.user = null;
        //config.loginout(req,res);
        
        //console.log('!req.cookies.ccat' );
        next();
    } else {

        // console.log('用token去拿数据' + req.cookies.ccat);

        if (!req.session.user) {
                   
            rp(config.getUrl(req,res, '/api/v1/user/whoamiplz')).then(function (body) {
                // Process html... 
                console.log('用token去拿数据--->' + body);
                body = JSON.parse(body);
                res.locals.user = body;
                req.session.user = body;
//                console.log('body.user数据--->' + body.user.mobile);
                //console.log(body.user.id);
                next();
            }).catch(function (err) {
                console.log("--0---<" + err);
                // res.render('index', {title: err});
                // Crawling failed...
                next();
            });
        } else {
            res.locals.user = req.session.user;
            next();
        }
    }

});



app.use(function (req, res, next) {
    var config_clientStyle_alive = "P";
    res.locals.clientStyle = 'P';
    //console.log("客户端模式" + config.clientStyle);
    if (config.clientStyle === 'auto')
    {//自动判断客户端
        try {
            if (utilTool.isMobile(req, res))
            {
                // console.log("判断客户端系统是M站端");
                res.locals.clientStyle = "M";
            } else {
                // console.log("判断客户端系统是PC端");
                res.locals.clientStyle = "P";
            }
        } catch (e)
        {
            console.log("执行错误===>" + e);
        }
    }
    if (config.clientStyle === 'pc')
    {
        res.locals.clientStyle = "P";
    }
    //res.locals.clientStyle = 'P';
    if (config.clientStyle === 'mobile')
    {
        res.locals.clientStyle = "M";
    }
    ///根据客户端来转化url
    /*
    if (res.locals.clientStyle === 'P')
    {
        console.log("p============" + req.url);
        if (req.url.indexOf(config.mobileFistRouter) > -1)
        {
            if(req.url.indexOf("ajax") > -1){
                console.log("ajax============yes");
            }else{
              //  res.redirect(req.url.replace(config.mobileFistRouter, ""));
            }
        }
        res.locals._layoutFile = './pc/init/layout.html';
    }*/
    //res.locals.clientStyle = 'P';
    if (res.locals.clientStyle === 'M')
    {
       // res.locals._layoutFile = './mobile/init/layout.html';
//        if (req.session.fromapp == 1)
//        {
//            res.locals._layoutFile = './init/layout_mobile_app.html';
//        } else {
//            res.locals._layoutFile = './init/layout_mobile.html';
//        }
        if (req.url.indexOf(config.mobileFistRouter) > -1)
        {

        } else {
           // res.redirect(config.mobileFistRouter + req.url);
         //   res.redirect(config.mobileFistRouter + req.url);
        }
    }
    //res.locals.clientStyle = 'M';

    res.locals.cdnUrl = config.cdnUrl;
    res.locals.config = configContant;

    try {

        //res.locals.user = req.session.user;
        //console.log("res.locals.user;----/" +res.locals.user);
        res.locals.utilTool = utilTool;

    } catch (e) {
          console.log("opts.user=req.session.user;----/" + e);
    }
    next();
});

app.use(function (req, res, next) {
    var method = req.method;
    var url = decodeURI(req.url);
    if(method == "GET"){
        if (url.indexOf("<script>") > -1 || url.indexOf("</script>") > -1){
            url = url.replace("<script>","").replace("</script>","");
            res.redirect(url);
        }else{
            next();
        }
    }else{
        var data = qs.stringify(req.body);
        var data1 = decodeURI(data).replace("<script>","").replace("</script>","");
        var obj = qs.parse(data1);
        req.body = obj; 
        next();
    }
});
app.use('/mzc/test/', require('./routes/test/test'));//首页
app.use('/mzc/util', require('./routes/mobile/util'));
// m站路由
app.use('/mzc/login', require('./routes/mobile/login'));//登录
app.use('/mzc/register', require('./routes/mobile/register'));//注册 
app.use('/mzc/', require('./routes/mobile/c/index'));//首页 
 
app.use('/mzc/hall', require('./routes/mobile/c/hall'));//c端大厅 
app.use('/mzc/hall/loan', require('./routes/mobile/c/loan'));//C端标的相关 
app.use('/mzc/find', require('./routes/mobile/c/find'));//c端 发现 
app.use('/mzc/userCenter', require('./routes/mobile/c/userCenter'));//c端 个人中心
//b端
app.use('/mzb/login', require('./routes/mobile/login_b'));//登录
app.use('/mzb/register', require('./routes/mobile/register_b'));//注册 
app.use('/mzb/', require('./routes/mobile/b/index'));//首页 
app.use('/mzb/demand', require('./routes/mobile/b/demand'));//b端 资金需求栏目 
app.use('/mzb/store', require('./routes/mobile/b/store'));//b端 资金产品栏目 
app.use('/mzb/find', require('./routes/mobile/b/find'));//b端 发现
app.use('/mzb/company', require('./routes/mobile/b/company'));//b端 发现
app.use('/mzb/union', require('./routes/mobile/b/union'));//b端 发现 
app.use('/mzb/userCenter', require('./routes/mobile/b/userCenter'));//b端 个人中心
//
app.use('/mzb/userCenterLoan', require('./routes/mobile/b/userCenterLoan'));//b端 个人中心 - 标的相关
//app.use('/mzc/wechat', require('./routes/wechat/wechatTotal'));//微信


//app.use('/login', require('./routes/pc/login'));//登录
//app.use('/register', require('./routes/pc/register'));//注册
app.use('/', require('./routes/pc/index'));//首页
//app.use(function (req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log("err.status==>" + err.status + "-->" + err.message);
    try {
        res.render('error', {
            message: err.message,
            status: err.status,
            error: {}
        });
    } catch (e)
    {
        res.send('');
        return;
    }
});

module.exports = app;
