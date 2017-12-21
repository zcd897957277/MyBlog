var minHeight=685;
var minWidth=300;
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
    oUser:null, articles:null, articleShow:null
     , nUserW: 0, nUserH: 0, aDomAry: []
    , fInitLayout: function () {//初始化布局
        var b = this;
        // 窗口的文档显示区的宽度 window.innerWidth
        if (window.innerWidth) {
            this.nUserW = window.innerWidth;
        } else { //ie（兼容）中获取窗口的文档显示区的宽度
            if ((document.body) && (document.body.clientWidth)) {
                this.nUserW = document.body.clientWidth;
            }
        }
        if (window.innerHeight) {
            this.nUserH = window.innerHeight;
        } else {
            //clientHeight页面浏览器中可以看到内容的这个区域的高度
            if ((document.body) && (document.body.clientHeight)) {
                this.nUserH = document.body.clientHeight;
            }
        }
        // ie(兼容) 获取可视区域的高宽
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
            this.nUserH = document.documentElement.clientHeight;
            this.nUserW = document.documentElement.clientWidth;
        }
        // 获取元素
        if (this.aDomAry.length < 4) {
            this.aDomAry = fGetElement("leftNav","rightCont","articleContentShow");
        }

        this.oUser = this.aDomAry[0];
        this.articles = this.aDomAry[1];
        this.articleShow = this.aDomAry[2];

        //左边user
        if($(this.oUser)){
            $(this.oUser).height(parseInt(minHeight));
        }

        //右边文章列表
        if($(this.articles)){
            if(((this.nUserH) * 0.96)<minHeight){
                $(this.articles).height(parseInt(minHeight));
            }else{
                $(this.articles).height(parseInt((this.nUserH) * 0.9));
            }
        }
        //右边文章内容
        if($(this.articleShow)){
            if(((this.nUserH) * 0.96)<minHeight){
                $(this.articleShow).height(parseInt(minHeight));
            }else{
                $(this.articleShow).height(parseInt((this.nUserH) * 0.9));
            }
        }
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