var ph=0;
var pw=0;
$(function(){
    //判断手机号输入是否正确
    $('input.login-input-phone').on('blur',function(){
        //获取输入的手机号
        const phone = $.trim($(this).val());
        if(isPhone(phone)){
           if($(this).parents('div.input-output').find('icon').hasClass('hideIcon')){
               $(this).parents('div.input-output').find('icon').removeClass('hideIcon');
           }
           if(!$(this).parents('div.input-output').find('label').hasClass('hideIcon')){
               $(this).parents('div.input-output').find('label').addClass('hideIcon');
           }
           ph=1;
        }else{
            if($(this).parents('div.input-output').find('label').hasClass('hideIcon')){
                $(this).parents('div.input-output').find('label').removeClass('hideIcon');
            }
            if(!$(this).parents('div.input-output').find('icon').hasClass('hideIcon')){
                $(this).parents('div.input-output').find('icon').addClass('hideIcon');
            }
            ph=0;
        }
    });
    //判断密码输入是否正确
    $('input.login-input-password').on('blur',function(){
        //获取输入的手机号
        var password = $.trim($(this).val());
        if(isPassword(password)){
            if($(this).parents('div.input-output').find('icon').hasClass('hideIcon')){
                $(this).parents('div.input-output').find('icon').removeClass('hideIcon');
            }
            if(!$(this).parents('div.input-output').find('label').hasClass('hideIcon')){
                $(this).parents('div.input-output').find('label').addClass('hideIcon');
            }
            //输出密码强度
            var numStrong=0;
            for(var i=0;i<password.length;i++){
                numStrong+=CharMode(parseInt(password.charCodeAt(i)));
            }
            $(this).parents('div.input-output').find('span.password-strong').html('强度为'+bitTotal(numStrong));
            pw=1;
        }else{
            if($(this).parents('div.input-output').find('label').hasClass('hideIcon')){
                $(this).parents('div.input-output').find('label').removeClass('hideIcon');
            }
            if(!$(this).parents('div.input-output').find('icon').hasClass('hideIcon')){
                $(this).parents('div.input-output').find('icon').addClass('hideIcon');
            }
            $(this).parents('div.input-output').find('span.password-strong').html('密码强度');
            pw=0;
        }
    });

    //点击登录
    $('button.login-btn').on('click',function(){
        if(ph === 1 && pw === 1){
            var phoneNum = $('input.login-input-phone').val();
            var passwordNum = $('input.login-input-password').val();
            loadXMLDoc(phoneNum,passwordNum);
        }else{
            return;
        }
    });
});

//正则判断手机号
function isPhone(phone) {
    var bValidate = RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/).test(phone);
    if (bValidate) {
        return true;
    } else
        return false;
}

//正则判断密码
function isPassword(password) {
    var pValidate = RegExp(/^[a-zA-Z0-9]{6,10}$/).test(password);
    if (pValidate) {
        return true;
    } else
        return false;
}
//正则判断字符类型
function CharMode(iN) {
    if (iN >= 48 && iN <= 57) //数字
        return 1;
    if (iN >= 65 && iN <= 90) //大写字母
        return 2;
    if (iN >= 97 && iN <= 122) //小写
        return 4;
    else
        return 8; //特殊字符
}
//统计字符类型
function bitTotal(num) {
    modes = '弱';
    if(num <= 20){
        modes = '弱';
    }else if(20<num<60){
        modes = '中';
    }else{
        modes = '强';
    }
    return modes;
}

function loadXMLDoc(phone,password) {
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
                if(tip.toString() == '登录失败'){
                    $('icon.password-icon').css({
                        'background-image': 'url(../images/icon1.png)'
                    });
                    $('input.login-input-password').val('');
                    $('.login-name.password-strong').html('密码强度');
                    $('.password-label.login-warn.hideIcon').html('密码错误').removeClass('hideIcon');
                    var str = '';
                    str +="<div class='tip'>"+tip+"</div>";
                    $('.body').append(str);
                    if($('.tip')){
                        setTimeout(function(){
                            $('.tip').remove();
                        },1000);
                    }
                }else{
                    $('icon.password-icon').css({
                        'background-image': 'url(../images/icon.png)'
                    });
                    var str = '';
                    str +="<div class='tip'>"+tip+"</div>";
                    $('.body').append(str);
                    if($('.tip')){
                        setTimeout(function(){
                            $('.tip').remove();
                            window.location.href='/body/inputBlog';
                            xmlhttp.open("GET","/body/inputBlog",true);
                            xmlhttp.send();
                        },1000);
                    }
                }
            }else{
                console.log('获取提示失败！');
            }
        }
    };
    xmlhttp.open("GET","/?phone="+phone+'&password='+password,true);
    xmlhttp.send();
}