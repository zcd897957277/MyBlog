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
        if(obj){
            for(var i=0;i<obj.length&&i<4;i++){
                var getId = obj[i]._id;
                var getTitle = obj[i].blogName;
                var getContent = obj[i].blogText;
                if(getContent.length > 100){
                    getContent = getContent.substr(0,100);
                }
                var getTime = obj[i].blogTime;
                var time1 = getTime.indexOf('T');
                var time2 = getTime.indexOf('.');
                var getTimeZui = getTime.substring(0,time1);
                getTimeZui += ' '+getTime.substring(time1+1,time2);
                var str = '';
                str +="<ul class='ul-article' id='"+getId+"'>"+
                    "<li class='li-title'><b>"+getTitle+"</b></li>"+
                    "<li class='li-content'>"+getContent+"</li>"+
                    "<li class='li-date'>"+getTimeZui+"</li>"+
                    "</ul>";
                $('#rightCont').append(str);
            }
        }else{
            console.log('获取提示失败！');
        }
    }
};
xmlhttp.open("GET","/body/userArticles?getDate="+true,true);
xmlhttp.send();


//点击文章展现文章详情
setTimeout(function(){
    $('ul.ul-article').on('click',function(){
        window.location.href='/body/userArticleShow?_id='+$(this).attr('id');
    });
},100);