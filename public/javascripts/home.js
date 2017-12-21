var minHeight=445;
// 获取元素
function fGetElement() {
    var c = new Array();
    for (var b = 0; b < arguments.length; b++) {
        var a = arguments[b];
        // 判断是否是字符串类型
        if (typeof a == "string") {
            // 获取a
            a = $('#'+a+'');
        }
        if (arguments.length == 1) {
            return a;
        }
        c.push(a);
    }
    return c;
}
//布局控制
var TLayoutControl = {
     oBlog:null, label:null, edit:null, article:null
    , articleShow:null, list:null, blog:null
    , nBlogW: 0, nBlogH: 0, aDomAry: []
    , fInitLayout: function () {//初始化布局
        var b = this;
        // 窗口的文档显示区的宽度 window.innerWidth
        if (window.innerWidth) {
            this.nBlogW = window.innerWidth;
        } else { //ie（兼容）中获取窗口的文档显示区的宽度
            if ((document.body) && (document.body.clientWidth)) {
                this.nBlogW = document.body.clientWidth;
            }
        }
        if (window.innerHeight) {
            this.nBlogH = window.innerHeight;
        } else {
            //clientHeight页面浏览器中可以看到内容的这个区域的高度
            if ((document.body) && (document.body.clientHeight)) {
                this.nBlogH = document.body.clientHeight;
            }
        }
        // ie(兼容) 获取可视区域的高宽
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
            this.nBlogH = document.documentElement.clientHeight;
            this.nBlogW = document.documentElement.clientWidth;
        }
        // 获取元素
        if (this.aDomAry.length < 8) {
            this.aDomAry = fGetElement("leftNav","labelCont","edit","articleContent","articleContentShow","list","inputBlog");
        }

        var height=this.nBlogH;

        this.oBlog = this.aDomAry[0];
        this.label = this.aDomAry[1];
        this.edit = this.aDomAry[2];
        this.article = this.aDomAry[3];
        this.articleShow = this.aDomAry[4];
        this.list = this.aDomAry[5];
        this.blog = this.aDomAry[6];

        if($(this.oBlog)){
            if(this.nBlogH<minHeight){
                $(this.oBlog).height(parseInt(minHeight));
            }else{
                $(this.oBlog).height(parseInt(height));
            }
        }

        //博客键入界面
        if($(this.blog)){
            $(this.blog).css({left:parseInt($(this.oBlog).width())});
        }

        //标签管理与文章管理的高度
        if($(this.label)){
            var widB=$(this.oBlog).width();
            if(this.nBlogH<minHeight){
                $(this.label).css({
                    height:parseInt(minHeight),
                    left:widB
                });
            }else{
                $(this.label).css({
                    height:this.nBlogH,
                    left:widB
                });
            }
        }

        //文章编辑器中编辑区域高度
        if($(this.edit)){
            if($(this.edit).find('.froala-element.not-msie.f-basic.f-placeholder')){
                $($(this.edit).find('.froala-element.not-msie.f-basic.f-placeholder')).height(this.nBlogH * 0.5);
            }
        }

        //在文章编辑或展示时整个区域的宽度
        var wid=this.nBlogW;
        var wid1=$(this.oBlog).width();
        var wid2=$(this.label).width();
        if($(this.article) || $(this.articleShow)){
            $(this.article).css({
                left:wid1+wid2,
                width:wid-wid1-wid2
            });
            $(this.articleShow).css({
                left:wid1+wid2,
                width:wid-wid1-wid2
            });
        }

        //随机blog
        if($(this.list)){
            $(this.list).css({
                left:wid1+wid2
            });
        }

        this.transPage();
    },
    transPage:function(){ //页面跳转
        this.oBlog = this.aDomAry[0];
        // 跳至blog键入
        var linav1 = $(this.oBlog).find('li.li-nav-1');
        $(linav1).on('click',function(){
            window.location.href='/body/inputBlog';
        });
        //跳至文章列表
        var linav2 = $(this.oBlog).find('li.li-nav-2');
        $(linav2).on('click',function(){
            window.location.href='/body/articleList';
        });
        //跳至标签列表
        var linav3 = $(this.oBlog).find('li.li-nav-3');
        $(linav3).on('click',function(){
            window.location.href='/body/labelManage';
        });
        //跳至用户
        var linav4 = $(this.oBlog).find('li.li-nav-4');
        $(linav4).on('click',function(){
            window.location.href='/body/userArticles';
        });
    }
};
// 初始化布局
TLayoutControl.fInitLayout();
// 浏览器缩放时控制大小
window.onresize = function () {
    // ie中长宽不变就跳出
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        var a = document.documentElement.clientHeight;
        var b = document.documentElement.clientWidth;
        if (a === TLayoutControl.nLayoutHeight) {
            return;
        }
        if (b === TLayoutControl.nLayoutWidth) {
            return;
        }
    }
    TLayoutControl.fInitLayout();
};