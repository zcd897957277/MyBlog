var express = require('express');
var url = require('url');
var router = express.Router();
var mongoose = require('../config/config');
mongoose.Promise = require('bluebird');
var querystring=require('querystring');


var User = require('../models/user');

// function insert() {
//通过entity，将通过model创建的实体，用save的方法保存数据
// var userCont = new User({
//     phone: '15728042326',
//     password: 'zcd123456'
// });
//将模板数据保存到数据库
// userCont.save(function (err, doc) {
//     if (err) {
//         console.log('error:' + err);
//     } else {
//         console.log(doc);
//     }
// });


/* GET login page. */
router.get('/', function(req, res, next) {
    if(url.parse(req.url).query!=null){
        var state=0;
        var getPhone=querystring.parse(url.parse(req.url).query)["phone"];
        var getPwd=querystring.parse(url.parse(req.url).query)["password"];
        User.find({phone:getPhone}, function(err, result){
            if (err) {
                console.log("Error:" + err);
            }
            else {
                if(result){
                    if(result[0].password == getPwd){
                        state=1;
                    }
                }
            }
            // mongoose.connection.close();数据库关闭
            if(state === 1){
                res.send({'state':'登录成功'});
            }else{
                res.send({'state':'登录失败'});
            }
        });
    }else{
        next();
    }
});

router.get('/', function(req, res, next) {
    res.render('login',{title:'blog'});
});

module.exports = router;

