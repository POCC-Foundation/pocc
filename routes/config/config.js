var rp = require('request-promise');
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports = {
    apiUrl: "http://127.0.0.3/",    
    cdnUrl: "http://127.0.0.1",
    clientStyle: 'mobile', //可以设置为 pc（只pc） ,mobile（只移动端）,auto（自动）
    clientStyle_alive: '', //不需要设置
    redisIP: '',
    redisPost: '', 
    cookieDomain: '',
    mobileFistRouter: '/mzc',
    myDomain: 'http://192.168.1.145:3000',
    /**
     * 去登录界面 跳转到登录页 带上登录成功后去的地址
     * @param {type} req
     * @param {type} res
     * @param {type} url 设定的登录后要去的网页。 如果该值为空，则默认登录后返回当前页面。
     * @returns {undefined}
     */
    toLogin:function(req,res,style,url){
        var thisUrl_top=req.originalUrl;
        if(url!="" && url!=undefined)
        {
            thisUrl_top=url;
        }
        thisUrl_top=thisUrl_top.replace(/\?/g,'0-0');
        thisUrl_top=thisUrl_top.replace(/&/g,"1-1");
        thisUrl_top=thisUrl_top.replace(/=/g,"2-2");
        console.log("==thisUrl_to_login=>" + req.originalUrl+"-->"+thisUrl_top);
        
        res.cookie('reBackUrl', thisUrl_top, {
                maxAge: 30 * 60 * 1000*24,
                path: '/',
                domain: this.cookieDomain
        });////把登录前需要去的网页 写到cookie中
        
        //MicroMessengers
        /*
        var ua = req.headers['user-agent'];
        var cs = {};
        if (/MicroMessenger/i.test(ua))
        {//判断是微信浏览器
           res.redirect("http://login.heitouyang.cn/sites/login/noWindowRemoteLogin.htm?stat=h5");
        }else{
            res.redirect("/mzc/login?reBackUrl="+thisUrl_top);
        } config.toLogin(req, res);*/
        if(style!="" && style!=undefined &style==1 )
        {
            res.redirect("/mzb/login?reBackUrl="+thisUrl_top);
        }else{
        res.redirect("/mzc/login?reBackUrl="+thisUrl_top);
        }
    },
    printHtml: function ( res,html) {
      res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
      ///输出html文字     
      res.write(html);
      res.end();
    } ,       
    refreshUser: function (req, res) {
         rp(this.getUrl(req,res, '/api/v1/user/getUserById?isRelaceUserRedis=refreshUser&USER_ID='+res.locals.user.USER_ID)).then(function (body) {
                // Process html... 
              console.log('刷新用户信息refreshUser--->' + body);
                body = JSON.parse(body); ;
                req.session.user = null; 
         });
    },
    /**
     * 
     * @param {type} req
     * @param {type} url
     * @returns {module.exports.getUrl.url}
     * 处理对外get请求的url，都统一加上access_token
     */
    getUrl: function (req, res, url) { 
        url = this.apiUrl + url.replace("<script>", "").replace("</script>", "");
        
        //url = this.apiUrl + url.replace("<script>", "").replace("</script>", "");
        var str = "";
        if (url.indexOf("?") > -1) {
            str += "&";
        } else {
            str += "?";
        }
        if (res.locals.clientStyle === 'M') {
            str += "fromsource=3";
        } else {
            str += "fromsource=4";
        }
        if (url.indexOf("access_token") < 1 && req.cookies.ccat) {
            str += "&access_token=" + req.cookies.ccat;
        }
        if(req.query.currentPage)
        {
            str += "&currentPage="+req.query.currentPage;
        }
        url = url + str;
        console.log("==url=>" + url.toString());
        return url;
    },
    getUrlClear: function (req, res, url) {
        url = this.apiUrl + url.replace("<script>", "").replace("</script>", "");

        console.log("==url=>" + url.toString());
        return url;
    },
    getUrlAjax: function (req, res, url) {
        url = this.apiUrl + url.replace("<script>", "").replace("</script>", "");
        var str = "";
        if (url.indexOf("?") > -1) {
            str += "&";
        } else {
            str += "?";
        }
        if (url.indexOf("access_token") < 1 && req.cookies.ccat) {
            str += "access_token=" + req.cookies.ccat;
        }
        url = url + str;
        console.log("==url=>" + url.toString());
        return url;
    },
    getUrlContract: function (req, res, url) {
        url = "http://user.cailu360.com:8808" + url;
        var str = "";
        if (url.indexOf("?") > -1) {
            str += "&";
        } else {
            str += "?";
        }
        if (res.locals.clientStyle === 'M') {
            str += "fromsource=3";
        } else {
            str += "fromsource=4";
        }
//        if (url.indexOf("/mzc") > -1) {
//            str += "fromsource=3";
//        } else {
//            str += "fromsource=4";
//        }
        if (url.indexOf("access_token") < 1 && req.cookies.ccat) {
            str += "&access_token=" + req.cookies.ccat;
        }
        console.log("==url=>" + url.toString());
        return url;
    },
    /**
     * 
     * @param {type} req
     * @param {type} url
     * @returns {module.exports.getUrlPost.url} 增加一个处理token的方法，
     */
    getUrlPost: function (req, url) {
        url = this.apiUrl + url.replace("<script>", "").replace("</script>", "");
        if (url.indexOf("access_token") < 1 && req.cookies.ccat)
        {
            if (url.indexOf("?") > -1)
            {
                url = url + "&access_token=" + req.cookies.ccat;
            } else {
                url = url + "?access_token=" + req.cookies.ccat;
            }
        }
        console.log("==url=>" + url.toString());
        return url;
    },
    getUrlPostClear: function (req, url) {
        url = this.apiUrl + url.replace("<script>", "").replace("</script>", "");

        console.log("==url=>" + url.toString());
        return url;
    },
    postData: function (req, postdate)
    {
        try {
            // console.log("==postdate=>" + postdate.toString());
            //postdate.client_id = this.client_id;
            //postdate.client_secret = this.client_secret;
            // console.log("==postdate=>" + postdate.toString());
            //if (req.cookies.ccat) {
            //    postdate.access_token = req.cookies.ccat;
            //}
            //console.log("==access_token=>" + postdate.access_token);
        } catch (e)
        {
            console.log("==eeee=>" + e.toString());
        }
        //console.log("==postdate=>" + postdate.client_id);
        return postdate;
    },
    loginout: function (req, res)
    {//clearCookie
        res.cookie('ccat', 'logout', {
            maxAge: 0,
            path: '/',
//            domain: this.cookieDomain
        });
        res.cookie('ccat', 'logout', {
            maxAge: 0,
            path: '/',
//            domain: this.acountDoumainCookie
        });
        res.cookie('ccat', 'logout', {
            maxAge: 0,
            path: '/',
//            domain: 'localhost'
        });
        try {
            delete req.session.user;
            delete req.session.currentUser;
            //req.session.user = null;
        } catch (e)
        {
            console.log("==eee-- logout=>" + e);
        }
    }
    
    
}
