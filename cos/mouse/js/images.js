/**
 * 图片管理类 (Control)
 */
function ImagesControl(index,fn){
    this.init(index,fn);
}
ImagesControl.prototype.init = function(index,fn){
    var _this = this;

    this.data = new ImagesData(DomControl.getCWidth(),DomControl.getCHeight(),index);

    // 初始化ele
    this.ele = {},
    this.ele.oLoad = document.querySelector("#load");
    this.ele.oCanvas = document.querySelector("canvas");
    document.querySelector("#load .load_txt").innerHTML = "玩命加载图片资源中...<br/>建议在wifi环境下访问";
    
    this.ele.oCanvas.width = this.data.nCW;
    this.ele.oCanvas.height = this.data.nCH;

    this.ctx = this.ele.oCanvas.getContext("2d");

    this.ctx.font = "2rem Arial";

    // Blue gradient for progress bar
    var progress_lingrad = this.ctx.createLinearGradient(0,this.data.nProcessY+this.data.nProcessH,0,0);
    progress_lingrad.addColorStop(0, '#4DA4F3');
    progress_lingrad.addColorStop(0.4, '#ADD9FF');
    progress_lingrad.addColorStop(1, '#9ED1FF');
    this.ctx.fillStyle = progress_lingrad;

    this.preLoadImgs(this.data.aSrc,fn);
}
/**
 * 绘制
 */
ImagesControl.prototype.drawProcess = function () {
    if(!this.ctx){
        return;
    }
    // 画圆角矩形
    var curW = this.data.nLoadedImgs / this.data.aSrc.length * this.data.nProcessW;
    // Clear everything before drawing
    this.ctx.clearRect(this.data.nProcessX-5,this.data.nProcessY-5,this.data.nProcessW+15,this.data.nProcessH+100);
    this.progressLayerRect(this.ctx, this.data.nProcessX, this.data.nProcessY, this.data.nProcessW, this.data.nProcessH, this.data.radius);
    this.progressBarRect(this.ctx, this.data.nProcessX, this.data.nProcessY, curW, this.data.nProcessH, this.data.radius, this.data.nProcessW);
    this.progressText(this.ctx, this.data.nProcessX, this.data.nProcessY,curW, this.data.nProcessH, this.data.radius, this.data.nProcessW );

}

/**
 * 批量加载
 * @param {array} arr 图片路径数组
 */
ImagesControl.prototype.preLoadImgs = function (arr ,fnBack) {
    var arrNewImgs=[];
    this.data.nLoadedImgs=0;
    var fnCallBack=function(){};
    var arr=(typeof arr!="object")?[arr] : arr;//确保都是数组

    var _this = this;
    function ImgsLoadPost(){
        _this.data.nLoadedImgs++;
        _this.drawProcess();
        if(_this.data.nLoadedImgs == arr.length){
            console.log("图片已经加载完成");
            // DomControl.addClass(_this.ele.oLoad,"dn"); 
            // DomControl.removeClass(document.querySelector("#fullMain"),"dn"); 
            // fnCallBack(arrNewImgs);
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
    }
}
 
/**
 * 绘制背景条
 * @param {CanvasContext} ctx
 * @param {num} x x坐标
 * @param {num} y y坐标
 * @param {num} w 总宽度width
 * @param {num} h height
 * @param {num} r radius
 */
ImagesControl.prototype.progressLayerRect = function (ctx, x, y, width, height, radius) {
    ctx.save();
    // Set shadows to make some depth
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#666';

     // Create initial grey layer
    ctx.fillStyle = 'rgba(189,189,189,0.1)';
    ctx.roundRect( x, y, width, height, radius);
    // Overlay with gradient
    ctx.shadowColor = 'rgba(0,0,0,0)';
    var lingrad = ctx.createLinearGradient(0,y+height,0,0);
    lingrad.addColorStop(0, 'rgba(255,255,255, 0.1)');
    lingrad.addColorStop(0.4, 'rgba(255,255,255, 0.7)');
    lingrad.addColorStop(1, 'rgba(255,255,255,0.4)');
    ctx.fillStyle = lingrad;
    ctx.roundRect( x, y, width, height, radius);

    ctx.fillStyle = 'white';
    // roundInsetRect(ctx, x, y, width, height, radius);

    ctx.restore();
}
/**
 * 绘制进度条
 * @param {CanvasContext} ctx
 * @param {num} x x坐标
 * @param {num} y y坐标
 * @param {num} w 当前宽度width
 * @param {num} h height
 * @param {num} r radius
 * @param {num} max 总宽度;
 */
ImagesControl.prototype.progressBarRect = function (ctx, x, y, width, height, radius, max) {
    // var to store offset for proper filling when inside rounded area
    var offset = 0;
    ctx.beginPath();
    if (width<radius) {
        offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius-width),2));
        ctx.moveTo(x + width, y+offset);
        ctx.lineTo(x + width, y+height-offset);
        ctx.arc(x + radius, y + radius, radius, Math.PI - Math.acos((radius - width) / radius), Math.PI + Math.acos((radius - width) / radius), false);
    }
    else if (width+radius>max) {
        offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius - (max-width)),2));
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width, y);
        ctx.arc(x+max-radius, y + radius, radius, -Math.PI/2, -Math.acos((radius - (max-width)) / radius), false);
        ctx.lineTo(x + width, y+height-offset);
        ctx.arc(x+max-radius, y + radius, radius, Math.acos((radius - (max-width)) / radius), Math.PI/2, false);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    }
    else {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    }
    ctx.closePath();
    ctx.fill();

    // draw progress bar right border shadow
    if (width<max-1) {
        ctx.save();
        ctx.shadowOffsetX = 1;
        ctx.shadowBlur = 1;
        ctx.shadowColor = '#666';
        if (width+radius>max)
          offset = offset+1;
        ctx.fillRect(x+width,y+offset,1,height-offset*2);
        ctx.restore();
    }
}
/**
 * 绘制文字
 * @param {CanvasContext} ctx
 * @param {num} x x坐标
 * @param {num} y y坐标
 * @param {num} w 当前宽度width
 * @param {num} h height
 * @param {num} r radius
 * @param {num} max 总宽度;
 */
ImagesControl.prototype.progressText = function(ctx, x, y, width, height, radius, max) {
    ctx.save();
    ctx.fillStyle = '#fff';
    var text = Math.floor(width/max*100)+"%";
    var text_width = ctx.measureText(text).width;
    // 文字跟随
    // var text_x = x+width-text_width-radius/2;
    // if (width<=radius+text_width) {
    //     text_x = x+radius/2;
    // }
    // 文字居中
    var text_x = x + (max - text_width)/2;
    ctx.fillText(text, text_x,y + 50 + height);
    ctx.restore();
}
/**
 * 图片管理类 (Modal)
 */
function ImagesData(cw,ch,index){
    // 屏幕宽高
    this.nCH = ch;
    this.nCW = cw;
    //相对于屏幕的比例
    var nWp = 0.8,
        nHp = 0.05;
    //坐标
    this.nProcessX = this.nCW * (1 - nWp) / 2;
    this.nProcessY = this.nCH * 0.2;
    // 宽度
    this.nProcessW = this.nCW * nWp;
    this.nProcessH = this.nCH * nHp;
    // radius
    this.radius = this.nProcessH / 2;
    // 首页图片资源
    this.aSrc = IMG[index];
    this.nLoadedImgs = 0;
}


/**
 * 绘制圆角矩形 拓展画布
 * @param {num} x x坐标
 * @param {num} y y坐标
 * @param {num} w width
 * @param {num} h height
 * @param {num} r radius
 */
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.arc(x+width-radius, y+radius, radius, -Math.PI/2, Math.PI/2, false);
    this.lineTo(x + radius, y + height);
    this.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    this.closePath();
    this.fill();
    return this;
}

