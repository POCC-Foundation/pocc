var express = require('express');
var rp = require('request-promise');
var config = require('../config/config');
 
var url = require('url');
var qs = require('qs');
var router = express.Router();

/* GET users listing. */
var htmlBody = {};


var iconv = require('iconv-lite');
  



router.get('/edit', function (req, res, next) {
    var str = "?page=" + 1 + "&size=" + 3;
    rp(config.getUrl(req,res, "/api/v1/util/getCategory?bianma=1")).then(function (body) {
            var body1 = JSON.parse(body); 
            htmlBody.productCategory = body1.dictionaries;
            console.log("htmlBody.productCategory：" + body)
       
        next();
    });
}); 

router.get('/edit', function (req, res, next) { 
      res.locals._layoutFile = false;
      res.render('test/edit', htmlBody);
});
router.get('/logo', function (req, res, next) { 
      res.locals._layoutFile = false;
      res.render('test/logo', htmlBody);
});
module.exports = router;
