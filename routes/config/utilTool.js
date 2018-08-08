/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('../config/config');
var fs = require('fs');
var path = require('path');  
module.exports = {
    /**
     * 根据毫秒数获取时间字符串
     */
   
    timsToDateString: function (tims)
    {
        var newTime = new Date(tims); //就得到普通的时间了 
        return newTime.getFullYear() + "." + (newTime.getMonth() + 1) + "." + newTime.getDate();
    },
    formatTime: function (time, formatStr) {
        var newTime = new Date(time);
        var str = formatStr;
        str = str.replace(/yyyy|YYYY/, newTime.getFullYear());
        str = str.replace(/yy|YY/, (newTime.getYear() % 100) > 9 ? (newTime.getYear() % 100).toString() : '0' + (newTime.getYear() % 100));
        str = str.replace(/MM/, (newTime.getMonth() + 1) > 9 ? (newTime.getMonth() + 1).toString() : '0' + (newTime.getMonth() + 1));
        str = str.replace(/M/g, newTime.getMonth());
        str = str.replace(/dd|DD/, newTime.getDate() > 9 ? newTime.getDate().toString() : '0' + newTime.getDate());
        str = str.replace(/d|D/g, newTime.getDate());
        str = str.replace(/hh|HH/, newTime.getHours() > 9 ? newTime.getHours().toString() : '0' + newTime.getHours());
        str = str.replace(/h|H/g, newTime.getHours());
        str = str.replace(/mm/, newTime.getMinutes() > 9 ? newTime.getMinutes().toString() : '0' + newTime.getMinutes());
        str = str.replace(/m/g, newTime.getMinutes());
        str = str.replace(/ss|SS/, newTime.getSeconds() > 9 ? newTime.getSeconds().toString() : '0' + newTime.getSeconds());
        str = str.replace(/s|S/g, newTime.getSeconds());
        return str;
    },
    getnoMallTime:function (data)
    {
        var formatDate = function (date) {  
        var y = date.getFullYear();  
        var m = date.getMonth() + 1;  
        m = m < 10 ? '0' + m : m;  
        var d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        return y + '-' + m + '-' + d;  
    };    
    },
    timsToDateTimeString: function (tims)
    {
        var oldTime = (new Date("2012/12/25 20:11:11")).getTime(); //得到毫秒数  
        var newTime = new Date(oldTime); //就得到普通的时间了 
    },
    formatAmount: function (money, digit) { // 千分位格式化金额,参数：金额,保留小数位
        var tpMoney = '0.00';
        if (undefined != money) {
            tpMoney = money;
        }
        tpMoney = new Number(tpMoney);
        if (isNaN(tpMoney)) {
            return '0.00';
        }
        tpMoney = tpMoney.toFixed(digit) + '';
        var re = /^(-?\d+)(\d{3})(\.?\d*)/;
        while (re.test(tpMoney)) {
            tpMoney = tpMoney.replace(re, "$1,$2$3");
        }
        return tpMoney;
    },
     formatAmounta: function (money, digit) { // 千分位格式化金额,参数：金额,保留小数位
        var tpMoney = '0.00';
        if (undefined != money) {
            tpMoney = money;
        }
        tpMoney = new Number(tpMoney);
        if (isNaN(tpMoney)) {
            return '0.00';
        }
        tpMoney = tpMoney.toFixed(digit) + '';
        return tpMoney;
    },
    formateDate:function(date,str){
        if(date == null){
            return "永不过期"
        }else{
           var newTime = new Date(date)
            str = str.replace(/yyyy|YYYY/, newTime.getFullYear());
            str = str.replace(/yy|YY/, (newTime.getYear() % 100) > 9 ? (newTime.getYear() % 100).toString() : '0' + (newTime.getYear() % 100));
            str = str.replace(/MM/, (newTime.getMonth() + 1) > 9 ? (newTime.getMonth() + 1).toString() : '0' + (newTime.getMonth() + 1));
            str = str.replace(/M/g, newTime.getMonth());
            str = str.replace(/dd|DD/, newTime.getDate() > 9 ? newTime.getDate().toString() : '0' + newTime.getDate());
            str = str.replace(/d|D/g, newTime.getDate());
        }
        return str;
    },
    formateMobile:function (str) {
        str = str.toString();
        str = str.trim();
        var result = '';
        if (str.length === 11) {
            result = str.substring(0, 3) + ' ' + '****' + ' ' +
                str.substring(
                    7);
        } else {
            console.error('mobile number ' + str +
                ' is invalid');
            result = str;
        }
        //return result.replace(/\s/g, '&nbsp;')
        return result;
    },
    formateName:function (str) {
        str = str.trim();
        var result = '';
        if (str.length != 0) {
            var nstr = str.substring(0,1);
            for(var i = 1;i <= str.length - 1;i++){
                nstr += "*";
            }
            result = nstr;
        } else {
            console.error('name ' + str +
                ' is invalid');
            result = str;
        }
        //return result.replace(/\s/g, '&nbsp;')
        return result;
    },
    
      // 格式化银行卡号
    formateBankAccount : function (str) {
        str = str.toString();
        str = str.trim();
        var result = '';
        if (str.length === 16) {
            result = str.substring(0, 4) + ' ' + '**** ****' + ' ' +
                str.substring(
                    12);
        } else if (str.length === 19) {
            result = str.substring(0, 4) + ' ' + '**** **** ***' + ' ' +
                str.substring(
                    15);
        } else {
            console.error('Bank account number ' + str +
                ' is invalid');
            result = str;
        }
        //return result.replace(/\s/g, '&nbsp;')
        return result;
    },
    
    formateIdNumber : function (str) {
        str = str.toString();
        str = str.trim();
        var result = '';
        if (str.length === 18) {
            result = str.substring(0, 4) + ' ' + '**********' + ' ' +
                str.substring(
                    14);
        }else {
            console.error('idNumber ' + str +
                ' is invalid');
            result = str;
        }
        //return result.replace(/\s/g, '&nbsp;')
        return result;
    },
    
     formateIdNumberLoan : function (str) {
        str = str.toString();
        str = str.trim();
        var result = '';
        if (str.length === 18) {
            result = str.substring(0, 4) + ' ' + '**************';
        }else {
            console.error('idNumber ' + str +
                ' is invalid');
            result = str;
        }
        //return result.replace(/\s/g, '&nbsp;')
        return result;
    },
     
      
    isMobile: function (req, res)
    {

        var cs = this.clientSystem(req, res);
        //console.log(" cs cs cs手机端" + cs);
        if (cs.Mobile)
        {
            return true;
        }
        if (cs.iOS || cs.iPhone || cs.iPad)
        {
            return true;
        }
        if (cs.Android)
        {
            return true;
        }
        if (cs.webOS)
        {
            return true;
        }

        return false;
    }
    ,
    clientSystem: function (req, res)
    {
        var ua = req.headers['user-agent'];
        var cs = {};
        if (/mobile/i.test(ua))
            cs.Mobile = true;

        if (/like Mac OS X/.test(ua)) {
            cs.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
            cs.iPhone = /iPhone/.test(ua);
            cs.iPad = /iPad/.test(ua);
        }

        if (/Android/.test(ua))
            cs.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];

        if (/webOS\//.test(ua))
            cs.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

        if (/(Intel|PPC) Mac OS X/.test(ua))
            cs.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

        if (/Windows NT/.test(ua))
            cs.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];

        return  cs;
    }  ,
    mkdir: function (dirpath, dirname) {
        //判断是否是第一次调用  
         console.log("--sss-->"+dirpath);
         try{
        if (typeof dirname === "undefined") {
            if (fs.existsSync(dirpath)) {
                return;
            } else {
                this.mkdir(dirpath, path.dirname(dirpath));
            }
        } else {
            //判断第二个参数是否正常，避免调用时传入错误参数  
            if (dirname !== path.dirname(dirpath)) {
                this.mkdir(dirpath);
                return;
            }
            if (fs.existsSync(dirname)) {
                fs.mkdirSync(dirpath)
            } else {
                this.mkdir(dirname, path.dirname(dirname));
                fs.mkdirSync(dirpath);
            }
        }
        
         }catch(eee)
         {
             console.log("--eee-->"+eee);
         }
    }
    

};
