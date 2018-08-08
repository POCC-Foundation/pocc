var redis = require('redis');
var config = require('../config/config');
module.exports = {
    hget:function(n,k,f,callback){
        var client = redis.createClient(config.redisPost, config.redisIP);
        client.on("error", function(error) {
//            //     console.log("redis hget on error ========="+error);
            callback(false,null);
        });
        //client.auth(config.redisAuth);
        client.select(n, function(error){
            if(error) {
//                //     console.log("redis hget select error ========="+error);
                callback(false,null);
            } else {
                //     //     console.log("redis hget select error ========= no error");
                client.hget(k, f ,function(error, res){
                    if(error) {
                        //     console.log("redis hget error========="  + error);
                        callback(false,null);
                    } else {
                        ////     console.log("redis hget res========="  + res + "////////////");
                        callback(true,res);
                    }
                    // 关闭链接
                      client.quit();                   
                });
            }
        });
    },
    
    get:function(n,k,callback){
        var client = redis.createClient(config.redisPost, config.redisIP);
        client.on("error", function(error) {
            //     console.log("redis get on error ========="+error);
            callback(false,null);
        });
        //client.auth(config.redisAuth);
        client.select(n, function(error){
            if(error) {
                //     console.log("redis get select error ========="+error);
                callback(false,null);
            } else {
                //     console.log("redis get select error ========= no error");
                client.get(k,function(error, res){
                    if(error) {
                        //     console.log("redis get error========="  + error);
                        callback(false,null);
                    } else {
                        //     console.log("redis get res========="  + res + "////////////");
                        callback(true,res);
                    }
                    // 关闭链接
                      client.quit();                   
                });
            }
        });
    },
    
    hgetall:function(n,k,callback){
        var client = redis.createClient(config.redisPost, config.redisIP);
        client.on("error", function(error) {
            //     console.log("redis hgetall on error ========="+error);
            callback(false,null);
        });
        //client.auth(config.redisAuth);
        client.select(n, function(error){
            if(error) {
                //     console.log("redis hgetall select error ========="+error);
                callback(false,null);
            } else {
                //     console.log("redis hgetall select error ========= no error");
                client.hgetall(k,function(error, res){
                    if(error) {
                        //     console.log("redis hgetall error========="  + error);
                        callback(false,null);
                    } else {
                        ////     console.log("redis hgetall res========="  + res + "////////////");
                        callback(true,res);
                    }
                    // 关闭链接
                    client.end();
                });
            }
        });
    },
    
    hset:function(n,k,f,v){
        var client = redis.createClient(config.redisPost, config.redisIP);
        client.on("error", function(error) {
            //     console.log("redis hset on error ========="+error);
        });
        //client.auth(config.redisAuth);
        client.select(n, function(error){
            if(error) {
                //     console.log("redis hset select error ========="+error);
            } else {
                //     console.log("redis hset select error ========= no error");
                client.hset(k, f, v,function(error, res){
                    if(error) {
                        //     console.log("redis hset error========="  + error);
                    } else {
                        ////     console.log("redis hset success res========="  + res+"////////////");
                    }
                });
                  client.quit();                   
            }
        });
    },
    
    set:function(n,k,v){
        var client = redis.createClient(config.redisPost, config.redisIP);
        client.on("error", function(error) {
            //     console.log("redis set on error ========="+error);
        });
        //client.auth(config.redisAuth);
        client.select(n, function(error){
            if(error) {
                //     console.log("redis set select error ========="+error);
            } else {
                //     console.log("redis set select error ========= no error");
                client.set(k,v,function(error, res){
                    if(error) {
                        //     console.log("redis set error========="  + error);
                    } else {
                        //     console.log("redis set res========="  + res + "////////////");
                    }
                    // 关闭链接
                     client.quit();                   
                });
            }
        });
    },
    
    isTen : function(callback){
        var myDate = new Date();
        var minu = myDate.getMinutes(); 
        ////     console.log("myMinu===="+minu);
        var ten = minu%10 
        ////     console.log("ten===="+ten);
        if(ten == 0){
            callback(true);
        }else{
            callback(false);
        }
    },
    
    isHour : function(callback){
        var myDate = new Date();
        var minu = myDate.getMinutes(); 
        ////     console.log("myMinu===="+minu);
        if(minu == 0){
            callback(true);
        }else{
            callback(false);
        }
    }
} ;   
