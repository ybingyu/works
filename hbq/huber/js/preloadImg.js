/*
 * Author: ybingyu
 * Version: 0.1.0
 * Compile Date: 2015-07-30 19:17
*/ 
/**
 * 图片管理类 (Control)
 * @param {num} index IMG中索引
 */
function ImagesControl(fn){
    this.init(fn);
}
ImagesControl.prototype.init = function(fn){
    var _this = this;

    this.data = new ImagesData();

    // 初始化ele
    this.ele = {},
    this.ele.oLoad = document.querySelector("#load");

    this.preLoadImgs(this.data.aSrc,fn);
}


/**
 * 批量加载
 * @param {array} arr 图片路径数组
 * @param {function} fn 回调函数
 */
ImagesControl.prototype.preLoadImgs = function (arr ,fnBack) {
    var arrNewImgs=[];
    this.data.nLoadedImgs=0;
    var fnCallBack=function(){};
    var arr=(typeof arr!="object")?[arr] : arr;//确保都是数组

    var _this = this;
    function ImgsLoadPost(){
        _this.data.nLoadedImgs++;
        if(_this.data.nLoadedImgs == arr.length){
            console.log("图片已经加载完成");
            fnBack();
        }
    }
    for(var i = 0; i < arr.length ; i++){
        arrNewImgs[i] = new Image();
        arrNewImgs[i].onload = function(){
            this.onload = null;
            ImgsLoadPost();
        }
        arrNewImgs[i].onerror = function(){
            ImgsLoadPost();
        }
        // IMGPATH 路径前缀
        arrNewImgs[i].src = IMGPATH + arr[i];
    }
    return {
        done:function(fn){
            fnCallBack = fn || fnCallBack;
        }
    };
};

/**
 * 图片管理类 (Modal)
 */
function ImagesData(){
    // 首页图片资源
    this.aSrc = IMG;
    this.nLoadedImgs = 0;
}


