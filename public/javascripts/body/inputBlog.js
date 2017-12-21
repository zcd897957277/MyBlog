$('.btn.btn-info').on('click',function(){
    if($('.label-rule').hasClass('hidden-label')){
        var blogName=$('input.blog_name').val();
        var blogLabel=$('input.blog_label').val();
        var blogText=$('textarea.blog_text').val();
        if(blogLabel && blogName && blogText){
            loadXMLDoc(blogName,blogLabel,blogText);
        }
    }
});
function loadXMLDoc(blogName,blogLabel,blogText) {
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
            var tip = obj['state'];
            if(tip){
                var str = '';
                str +="<div class='tipInputBlog'>"+tip+"</div>";
                $('.body').append(str);
                if($('.tipInputBlog')){
                    setTimeout(function(){
                        $('.tipInputBlog').remove();
                        $('input.blog_name').val('');
                        $('input.blog_label').val('');
                        $('textarea.blog_text').val('');
                    },1000);
                }
            }else{
                console.log('获取提示失败！');
            }
        }
    };
    xmlhttp.open("GET","/body/inputBlog?blogName="+blogName+'&blogLabel='+blogLabel+"&blogText="+blogText,true);
    xmlhttp.send();
}

//判断输入的label标签合法
function judge(text){
    text.toLowerCase();
    switch(text){
        case "js":
            return true;
            break;
        case "javascript":
            return true;
            break;
        case "html":
            return true;
            break;
        case "vue":
            return true;
            break;
        case "node":
            return true;
            break;
        case "nodejs":
            return true;
            break;
        default:
            return false;
            break;
    }
}

$('input.blog_label').on('blur',function(){
    var text=$(this).val();
    if(!judge(text)){
       $('.label-rule.hidden-label').removeClass('hidden-label');
    }else{
        $('.label-rule').addClass('hidden-label');
    }
});