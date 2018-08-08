var express = require('express');
var rp = require('request-promise');
var fs = require('fs');
var config = require('../config/config');
var utilTool = require('../config/utilTool');
var router = express.Router();

var htmlBody = {};

router.use(function (req, res, next) {
    htmlBody = {};
    res.locals._layoutFile = false;
    htmlBody.isLogin = 0;

    //if (res.locals.user == null) {
        //res.redirect("/login");
    //} else {
    //    htmlBody.isLogin = 1;
    //    htmlBody.currentUser = res.locals.user;

        next();
   // }
});

 
router.get('/uploadimg', function (req, res, next) {
    htmlBody.title = "上传图片";
    var object= req.query.object;
    if(object==null || object=='' || object.length<1)
    {
        object="userLogo";
    }
    htmlBody.cropper_aspectratio= req.query.cropper_aspectratio;
    htmlBody.object =object;
    res.render('mobile/util/uploadimg', htmlBody);
});
router.post('/doUploadimg', function (req, res) {
    //接收前台POST过来的base64

    try {
        var imgData = req.body.imgData;
        var object= req.body.object; 
        //过滤data:URL
        var base64Data = imgData.replace("data:image/jpeg;base64,", "");
        var dataBuffer = new Buffer(base64Data, 'base64');
        ///获取时间，生成目录
        var imgDirBase = "uploadfile/userimg";
        var time1 = new Date();
        var year = time1.getYear();
        var month = time1.getMonth();
        var days = time1.getDay();

        //var imageName = htmlBody.currentUser.USER_ID + "_" + time1.getTime() + ".jpg";
        var imageName =  time1.getTime() + ".jpg";
        if(object!=null && object=='userLogo')
        {
            imgDirBase = "uploadfile/userimg";
        }else{
            imgDirBase = "uploadfile/storeimg";
        }
        imgDirBase +="/" + year + "/" + month + "/" + days;
        utilTool.mkdir("public/"+imgDirBase, "");
        fs.writeFile("public/"+imgDirBase + "/" + imageName, dataBuffer, function (err) {
            if (err) {
                console.log("保存失败！>" +err+":"+ imgDirBase + "/" + imageName);
            } else {
                //res.send("保存成功！");
                console.log("保存成功！>" + imgDirBase + "/" + imageName);
            }
        });
        /**
         * 阿里云SSO处理 返回存储地址
         * 
         */
    } catch (ddd)
    {
        console.log("--ddd-->" + ddd);
    }
    htmlBody.imgUrl ="/"+imgDirBase + "/" + imageName;
    res.send(htmlBody);
   // res.render('mobile/util/uploadimg', htmlBody);
});

module.exports = router;