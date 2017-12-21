var express = require('express');
var url = require('url');
var router = express.Router();
var mongoose = require('../config/config');
mongoose.Promise = require('bluebird');
var querystring=require('querystring');
var Blog = require('../models/blog');

/* GET inputBlog page. */
router.get('/inputBlog', function(req, res, next) {
    if(url.parse(req.url).query!=null){
        var state=0;
        var getName=querystring.parse(url.parse(req.url).query)["blogName"];
        var getLabel=querystring.parse(url.parse(req.url).query)["blogLabel"];
        var getText=querystring.parse(url.parse(req.url).query)["blogText"];

        //通过entity，将通过model创建的实体，用save的方法保存数据
        var blogText = new Blog({
            blogName: getName,
            blogLabel: getLabel,
            blogText: getText
        });
        //将模板数据保存到数据库
        blogText.save(function (err, doc) {
            if (err) {
                console.log('error:' + err);
            } else {
                console.log(doc);
                state=1;
            }
            if(state === 1){
                res.send({'state':'博客上传成功'});
            }else{
                res.send({'state':'博客上传失败'});
            }
        });
    }else{
        next();
    }
});
router.get('/inputBlog', function(req, res, next) {
    res.render('inputBlog',{title:'blog'});
});

/* GET articleList page. */
router.get('/articleList', function(req, res, next) {
    if(url.parse(req.url).query == null){
        var resultArticles=[];
        Blog.find({}, function(err, result){
            if (err) {
                console.log("Error:" + err);
            } else {
                for(var i=0;i<result.length;i++){
                    var year = (result[i].blogTime).getFullYear();
                    var mouth = (result[i].blogTime).getMonth();
                    var day = (result[i].blogTime).getDate();
                    var hours = (result[i].blogTime).getHours();
                    var minutes = (result[i].blogTime).getMinutes();
                    var seconds = (result[i].blogTime).getSeconds();
                    var time = year+'-'+mouth+'-'+day+' '+hours+':'+minutes+':'+seconds;
                    resultArticles.push({
                        _id:result[i]._id,
                        blogName:result[i].blogName,
                        blogTime:time,
                        blogText:result[i].blogText,
                        blogLabel:result[i].blogLabel
                    });
                }
                res.render('articleList',{title:'article',resultArticles:resultArticles});
            }
        })
    } else {
        next();
    }
});
router.get('/articleList', function(req, res, next) {
    if(querystring.parse(url.parse(req.url).query)['_id']){
        var _id = querystring.parse(url.parse(req.url).query)['_id'];
        if(querystring.parse(url.parse(req.url).query)['blogTextQian']){
            var blogTextQian = querystring.parse(url.parse(req.url).query)['blogTextQian'];
            Blog.update({_id:_id}, {blogText:blogTextQian}, function(err, result){
                if (err) {
                    console.log("Error:" + err);
                }
                else {
                    console.log("Res:" + result);
                }
            })
        }else{
            Blog.find({_id:_id}, function(err, result){
                if (err) {
                    console.log("Error:" + err);
                } else {
                    res.send({result:result});
                }
            })
        }
    }else{
        next();
    }
})
router.get('/articleList', function(req, res, next) {
    var _id = querystring.parse(url.parse(req.url).query)['d_id'];
    Blog.remove({_id:_id}, function(err, result){
        if (err) {
            console.log("Error:" + err);
        } else {
            Blog.find({}, function(err, result){
                if (err) {
                    console.log("Error:" + err);
                } else {
                    console.log("Res:" + result);
                    var resultArticles=[];
                    for(var i=0;i<result.length;i++){
                        var year = (result[i].blogTime).getFullYear();
                        var mouth = (result[i].blogTime).getMonth();
                        var day = (result[i].blogTime).getDate();
                        var hours = (result[i].blogTime).getHours();
                        var minutes = (result[i].blogTime).getMinutes();
                        var seconds = (result[i].blogTime).getSeconds();
                        var time = year+'-'+mouth+'-'+day+' '+hours+':'+minutes+':'+seconds;
                        resultArticles.push({
                            _id:result[i]._id,
                            blogName:result[i].blogName,
                            blogTime:time,
                            blogText:result[i].blogText,
                            blogLabel:result[i].blogLabel
                        });
                    }
                    res.render('articleList',{title:'article',resultArticles:resultArticles});
                }
            })
        }
    })
})

/* GET labelMangage page. */
router.get('/labelManage', function(req, res, next) {
    if(url.parse(req.url).query == null){
        Blog.find({}, function(err, result){
            if (err) {
                console.log("Error:" + err);
            } else {
                var resultLabel=[];
                for(var i=0;i<result.length;i++){
                    var label = result[i].blogLabel;
                    var _id = result[i]._id;
                    var blogName = result[i].blogName;
                    var blogText = result[i].blogText;
                    while(parseInt(blogText.indexOf('<')) >= 0 ){
                        var num1 = blogText.indexOf('<');
                        var num2 = blogText.indexOf('>');
                        var len = blogText.length;
                        if(num1>0){
                            if(num2 < len-1){
                                blogText1 = blogText.substring(0,num1);
                                blogText2 = blogText.substring(num2+1,len);
                                blogText = blogText1 + blogText2;
                            }else{
                                blogText = blogText.substring(0,num1);
                            }
                        }else{
                            blogText = blogText.substring(num2+1);
                        }
                    }
                    if(parseInt(blogText.indexOf('​%zxcnbsp;')) != -1 ){
                        blogText = blogText.replace(/\%zxcnbsp\;/g,"");
                    }
                    var year = (result[i].blogTime).getFullYear();
                    var mouth = (result[i].blogTime).getMonth();
                    var day = (result[i].blogTime).getDate();
                    var time = year+'-'+mouth+'-'+day;
                    var label_num = 1;
                    //resultLabel有内容
                    if(resultLabel.length > 0){
                        for(var l=0;l<resultLabel.length;l++){
                            if(label == resultLabel[l].label){
                                resultLabel[l].label_num++;
                                resultLabel[l].labelCont.push({
                                    _id:_id,
                                    blogName:blogName,
                                    blogTime:time,
                                    blogText:blogText,
                                    blogLabel:label
                                });
                                break;
                            }else{
                                resultLabel.push({
                                    label:label,
                                    label_num:label_num,
                                    labelCont:[{
                                        _id:_id,
                                        blogName:blogName,
                                        blogTime:time,
                                        blogText:blogText,
                                        blogLabel:label
                                    }]
                                })
                                break;
                            }
                        }
                    }else{
                        resultLabel.push({
                            label:label,
                            label_num:label_num,
                            labelCont:[{
                                _id:_id,
                                blogName:blogName,
                                blogTime:time,
                                blogText:blogText,
                                blogLabel:label
                            }]
                        })
                    }
                }
                resultLabel.push({labelOrder:0});
                res.render('labelManage',{title:'label',resultLabel:resultLabel});
            }
        })
    }else{
        next();
    }
});

router.get('/labelManage', function(req, res, next) {
    var getLabel = querystring.parse(url.parse(req.url).query)['label'];
    Blog.find({}, function(err, result){
        if (err) {
            console.log("Error:" + err);
        } else {
            var resultLabel=[];
            for(var i=0;i<result.length;i++){
                var label = result[i].blogLabel;
                var _id = result[i]._id;
                var blogName = result[i].blogName;
                var blogText = result[i].blogText;
                while(parseInt(blogText.indexOf('<')) >= 0 ){
                    var num1 = blogText.indexOf('<');
                    var num2 = blogText.indexOf('>');
                    var len = blogText.length;
                    if(num1>0){
                        if(num2 < len-1){
                            blogText1 = blogText.substring(0,num1);
                            blogText2 = blogText.substring(num2+1,len);
                            blogText = blogText1 + blogText2;
                        }else{
                            blogText = blogText.substring(0,num1);
                        }
                    }else{
                        blogText = blogText.substring(num2+1);
                    }
                }
                if(parseInt(blogText.indexOf('​%zxcnbsp;')) != -1 ){
                    blogText = blogText.replace(/\%zxcnbsp\;/g,"");
                }
                var year = (result[i].blogTime).getFullYear();
                var mouth = (result[i].blogTime).getMonth();
                var day = (result[i].blogTime).getDate();
                var time = year+'-'+mouth+'-'+day;
                var label_num = 1;
                //resultLabel有内容
                if(resultLabel.length > 0){
                    for(var l=0;l<resultLabel.length;l++){
                        if(label == resultLabel[l].label){
                            resultLabel[l].label_num++;
                            resultLabel[l].labelCont.push({
                                _id:_id,
                                blogName:blogName,
                                blogTime:time,
                                blogText:blogText,
                                blogLabel:label
                            });
                            break;
                        }else{
                            resultLabel.push({
                                label:label,
                                label_num:label_num,
                                labelCont:[{
                                    _id:_id,
                                    blogName:blogName,
                                    blogTime:time,
                                    blogText:blogText,
                                    blogLabel:label
                                }]
                            })
                            break;
                        }
                    }
                }else{
                    resultLabel.push({
                        label:label,
                        label_num:label_num,
                        labelCont:[{
                            _id:_id,
                            blogName:blogName,
                            blogTime:time,
                            blogText:blogText,
                            blogLabel:label
                        }]
                    })
                }
            }
            for(var k=0;k<resultLabel.length;k++){
                if(getLabel == resultLabel[k].label){
                    resultLabel.push({
                        labelOrder:k
                    });
                }
            }
            res.render('labelManage',{title:'label',resultLabel:resultLabel});
        }
    })
})

/* GET userArticles page. */
router.get('/userArticles', function(req, res, next) {
    Blog.find({}, function(err, result){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            var resultZui=[];
            //只显示左最新的4篇文章
            if(result.length<5){
                for(var i=result.length-1;i>=0;i--){
                    var year = (result[i].blogTime).getFullYear();
                    var mouth = (result[i].blogTime).getMonth();
                    var day = (result[i].blogTime).getDate();
                    var hours = (result[i].blogTime).getHours();
                    var minutes = (result[i].blogTime).getMinutes();
                    var seconds = (result[i].blogTime).getSeconds();
                    var time = year+'-'+mouth+'-'+day+' '+hours+':'+minutes+':'+seconds;
                    result[i].blogTime = time;
                    var blogText = result[i].blogText;
                    while(parseInt(blogText.indexOf('<')) >= 0 ){
                        var num1 = blogText.indexOf('<');
                        var num2 = blogText.indexOf('>');
                        var len = blogText.length;
                        if(num1>0){
                            if(num2 < len-1){
                                blogText1 = blogText.substring(0,num1);
                                blogText2 = blogText.substring(num2+1,len);
                                blogText = blogText1 + blogText2;
                            }else{
                                blogText = blogText.substring(0,num1);
                            }
                        }else{
                            blogText = blogText.substring(num2+1);
                        }
                    }
                    if(parseInt(blogText.indexOf('​%zxcnbsp;')) != -1 ){
                        blogText = blogText.replace(/\%zxcnbsp\;/g,"");
                    }
                    result[i].blogText = blogText;
                    resultZui.push(result[i])
                }
            }else{
                for(var i=result.length-1;i>=result.length-4;i--){
                    var year = (result[i].blogTime).getFullYear();
                    var mouth = (result[i].blogTime).getMonth();
                    var day = (result[i].blogTime).getDate();
                    var hours = (result[i].blogTime).getHours();
                    var minutes = (result[i].blogTime).getMinutes();
                    var seconds = (result[i].blogTime).getSeconds();
                    var time = year+'-'+mouth+'-'+day+' '+hours+':'+minutes+':'+seconds;
                    result[i].blogTime = time;
                    var blogText = result[i].blogText;
                    while(parseInt(blogText.indexOf('<')) >= 0 ){
                        var num1 = blogText.indexOf('<');
                        var num2 = blogText.indexOf('>');
                        var len = blogText.length;
                        if(num1>0){
                            if(num2 < len-1){
                                blogText1 = blogText.substring(0,num1);
                                blogText2 = blogText.substring(num2+1,len);
                                blogText = blogText1 + blogText2;
                            }else{
                                blogText = blogText.substring(0,num1);
                            }
                        }else{
                            blogText = blogText.substring(num2+1);
                        }
                    }
                    if(parseInt(blogText.indexOf('​%zxcnbsp;')) != -1 ){
                        blogText = blogText.replace(/\%zxcnbsp\;/g,"");
                    }
                    result[i].blogText = blogText;
                    resultZui.push(result[i])
                }
            }

            var resultLabel=[];
            var articlesNum = result.length;
            for(var i=0;i<result.length;i++){
                var label = result[i].blogLabel;
                //resultLabel有内容
                if(resultLabel.length > 0){
                    for(var l=0;l<resultLabel.length;l++){
                        if(label == resultLabel[l].label){
                            break;
                        }else{
                            resultLabel.push({label:label})
                            break;
                        }
                    }
                }else{
                    resultLabel.push({label:label})
                }
            }
            var labelsNum = resultLabel.length;

            res.render('userArticles',{title:'user',resultZui:resultZui,labelsNum:labelsNum,articlesNum:articlesNum});
        }
    })
});

/* GET userArticlesShow page. */
router.get('/userArticleShow', function(req, res, next) {
    if(url.parse(req.url).query!=null){
        var _id = querystring.parse(url.parse(req.url).query)['_id'];
        Blog.find({_id:_id}, function(err, result){
            if (err) {
                console.log("Error:" + err);
            }
            else {
                var resultLabel=[];
                var articlesNum = result.length;
                for(var i=0;i<result.length;i++){
                    var label = result[i].blogLabel;
                    //resultLabel有内容
                    if(resultLabel.length > 0){
                        for(var l=0;l<resultLabel.length;l++){
                            if(label == resultLabel[l].label){
                                break;
                            }else{
                                resultLabel.push({label:label})
                                break;
                            }
                        }
                    }else{
                        resultLabel.push({label:label})
                    }
                }
                var labelsNum = resultLabel.length;
                res.render('userArticleShow',{title:'user',result:result,labelsNum:labelsNum,articlesNum:articlesNum});
            }
        })
    }
});

/* GET aboutMe page. */
router.get('/aboutMe', function(req, res, next) {
    res.render('aboutMe',{title:'我'});
});

module.exports = router;

