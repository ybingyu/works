/**
 * 元素操作 (Control)
 */
function DomControl(){}
/**
 * hasClass
 * @prama {object} ele dom元素
 * @prama {string} cls 样式
 */
DomControl.hasClass = function(ele,cls) { 
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')); 
} 
/**
 * addClass
 * @prama {object} ele dom元素
 * @prama {string} cls 样式
 */
DomControl.addClass = function(ele,cls){ 
    if (!this.hasClass(ele,cls)) {
        ele.className += " "+cls; 
    }
} 
/**
 * removeClass
 * @prama {object} ele dom元素
 * @prama {string} cls 样式
 */
DomControl.removeClass = function(ele,cls){
    if (this.hasClass(ele,cls)) { 
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)'); 
        ele.className=ele.className.replace(reg,' '); 
    } 
} 


/**
 * addEvent
 * @prama {object} ele dom元素
 * @prama {string} type 事件
 * @prama {Function} fn 执行函数
 * @prama {bool} useCapture true 捕获过程中执行 false 冒泡过程中执行
 */
DomControl.addEvent = function(ele, type, fn ,useCapture){
    useCapture = useCapture || true;
    ele.addEventListener(type,function(event){
        fn(event);
    },useCapture);
}

/**
 * setStyle 设置样式
 * @prama {object} ele dom元素
 * @prama {string} strCss 样式 
 * 如：DomControl.setStyle(head,"border:1px solid red;display:block")
 */
DomControl.setStyle = function(ele, strCss){
    function endsWith(str, suffix) {
        var l = str.length - suffix.length;
        return l >= 0 && str.indexOf(suffix, l) == l;
    }
    var sty = ele.style,
        cssText = sty.cssText;
    if(!endsWith(cssText, ';')){
        cssText += ';';
    }
    sty.cssText = cssText + strCss;
}
/**
 * 动画函数
 * @param {dom} oDn 要隐藏的dom 
 * @param {dom} oSh 要显示的dom 
 * @param {function} fn 执行的递归函数（这里用来一般递归自己，衔接下一个动画）
 * @param {num} time 
 */
DomControl.ainma = function (oDn,oSh,fn,time){
    time = time || 1000;
    setTimeout(function(){
        if(oDn){
            if(oDn instanceof Array){
                var len = oDn.length;
                for(var i = 0 ;i < len;i++){
                    DomControl.addClass(oDn[i],"dn");
                }
            }else if(typeof oDn == "object"){
                DomControl.addClass(oDn,"dn");            
            }
        }
        
        if(oSh){
            if(oSh instanceof Array){
                var len = oSh.length;
                for(var i = 0 ;i < len;i++){
                    DomControl.removeClass(oSh[i],"dn");
                }
            }else if( typeof oSh == "object"){
                DomControl.removeClass(oSh,"dn");         
            }
        }
        
        if(fn){
            fn();
        }
    },time);
}
/**
 * ready
 */
DomControl.ready = function (f) {
    var ie = !!(window.attachEvent && !window.opera);
    var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
    var fn = [];
    var run = function () { for (var i = 0; i < fn.length; i++) fn[i](); };
    if (!ie && !wk && document.addEventListener)
        return document.addEventListener('DOMContentLoaded', f, false);
    if (fn.push(f) > 1) return;
    if (ie)
        (function () {
            try { 
                document.documentElement.doScroll('left'); 
                run(); 
            }
            catch (err) { 
                setTimeout(arguments.callee, 0); 
            }
        })();
    else if (wk)
        var t = setInterval(function () {
            if (/^(loaded|complete)$/.test(document.readyState))
                clearInterval(t), run();
        }, 0);
};
/**
 * clientHeight
 */
DomControl.getCHeight = function (){
    return document.body.clientHeight || document.documentElement.clientHeight;
}
/**
 * clientWidth
 */
DomControl.getCWidth = function (){
    return document.body.clientWidth || document.documentElement.clientWidth;
}

// window.onload 多次调用
function windowOnload(fn){
    if(!window.onload){
        window.onload = fn;
    }else{
        var fnOld = window.onload;
        window.onload = function(){
            fnOld();
            fn();
        }
    }
}
// 解析地址
function GetQueryString(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");var r=window.location.search.substr(1).match(reg);if(r!=null)return unescape(r[2]);return null}

//判断手机系统
var browser={
    versions:function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {         //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
         }(),
         language:(navigator.browserLanguage || navigator.language).toLowerCase()
}