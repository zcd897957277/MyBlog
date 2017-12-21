//文章列表选择文章
$('ul.labels').on('click','li.labels-li',function(){
    var _id = $(this).attr('id');
    var identity = 0;
    loadXMLDoc(_id,identity);
});

//点击编辑文本
$('.body').on('click','#articleContentShow>button',function(){
    var _id = $(this).attr('id');
    var identity = 1;
    loadXMLDoc(_id,identity);
});

//文本编辑时返回
$('.body').on('click','#articleContent>div.article-info>div.article-btns>div.btn-back>button.btn-hong',function(){
    var _id = $(this).attr('id');
    var identity = 0;
    loadXMLDoc(_id,identity);
});

//文本编辑时上传修改
$('.body').on('click','#articleContent>div.article-info>div.article-btns>div.btn-publish>button.btn-lan',function(){
    var _id = $(this).attr('id');
    var blogTextQian = $(this).parents('div#articleContent').find('div#upload-rich-text').find('.froala-element.not-msie.f-basic').html();
    if(blogTextQian.indexOf('"')){
        blogTextQian = blogTextQian.replace(/\"/g,"'");
        if(blogTextQian.indexOf('#')){
            blogTextQian = blogTextQian.replace(/\#/g,"%asd");
        }
        if(blogTextQian.indexOf('&')){
            blogTextQian = blogTextQian.replace(/\&/g,"%zxc");
        }
    }
    var identity = 2;
    loadXMLDoc(_id,identity,blogTextQian);
});

function loadXMLDoc(_id,identity,blogTextQian) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else {
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var obj = JSON.parse(xmlhttp.responseText);
            obj = obj['result'][0];
            var blogName = obj.blogName;
            var blogText = obj.blogText;
            if(blogText.indexOf('\"')){
                blogText = blogText.replace(/\\\"/g,"'");
            }
            if(blogText.indexOf('%asd')){
                blogText = blogText.replace(/%asd/g,"#");
            }
            if(blogText.indexOf('%zxc')){
                blogText = blogText.replace(/%zxc/g,"&");
            }
            var blogLabel = obj.blogLabel;
            var _id = obj._id;
            if(blogName && blogText && _id){
                if(identity == '0' || identity == '2'){
                    var str = '';
                    str += "<div class='articleContentShow' id='articleContentShow'>"+
                        "<p class='articleShow-title'>"+blogName+"</p>"+
                        "<div class='article-cont'>"+blogText+"</div>"+
                        "<button type='button' id='"+_id+"' class='btn btn-info btn-modify'><span class='glyphicon glyphicon-pencil form-control-feedback pencil' aria-hidden='true'></span>不满意，点此修改</button>"+
                        "</div>";
                    $('#articleContentShow').remove();
                    if($('#articleContent')){
                        $('#articleContent').remove();
                    }
                    $('.body').append(str);
                    //初始化位置
                    TLayoutControl.fInitLayout();
                } else if(identity == '1'){
                    var str = '';
                    str += "<div class='articleContent' id='articleContent'>"+
                        "<p class='article-title'>"+blogName+"</p>"+
                        "<div class='article-info'>"+
                        "<img class='article-label' src='/images/tag.png' alt='标签'>"+
                        "<span class='article-span'><span class='article-label-name'>"+blogLabel+"</span></span>"+
                        "<div class='btn-toolbar article-btns' role='toolbar' aria-label='按钮组'>"+
                        "<div class='btn-group btn-back' role='group' aria-label='返回'>"+
                        "<button type='button' id='"+_id+"' class='btn btn-default btn-hong'>返回</button>"+
                        "</div>"+
                        "<div class='btn-group btn-publish' role='group' aria-label='上传修改'>"+
                        "<button type='button' id='"+_id+"' class='btn btn-default btn-lan'>上传修改</button>"+
                        "</div></div></div>"+
                        "<div class='clear'></div>"+
                        "<!--文本上传-->"+
                        "<div id='upload-rich-text'>"+
                        "<div id='edit'>"+blogText+"</div>"+
                        "</div>"+
                        "</div>";
                    $('#articleContentShow').remove();
                    $('.body').append(str);
                    //打开文章编辑器
                    setTimeout(function(){
                        $('#edit').editable({inlineMode: false, alwaysBlank: true});
                    },1);
                    TLayoutControl.fInitLayout();
                }
            } else {
                console.log('获取提示失败！');
            }
        }
    };
    if(blogTextQian){
        xmlhttp.open("GET","/body/articleList?_id="+_id+"&blogTextQian="+blogTextQian,true);
    }else{
        xmlhttp.open("GET","/body/articleList?_id="+_id,true);
    }
    xmlhttp.send();
}

//<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span> 88行左右如果要加标签的叉叉，在该行
//最后的两个</span>之间加上这句

//删除标志的提示
$('#labelCont').on('click','img.subtract',function(){
    $('#labelCont').children('ul.labels').each(function(index,value){
        if($(value).find('div.labels-title>a.glyphicon-remove').attr('style')){
            $(value).find('div.labels-title>a.glyphicon-remove').attr('style','');
        }else{
            $(value).find('div.labels-title>a.glyphicon-remove').attr('style','display:none');
        }
    });
});
