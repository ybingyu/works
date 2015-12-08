/**
 * 9宫格 地鼠集合（Control）
 */
function SpriteSet(){
    this.init();
}

SpriteSet.prototype.init = function(){
    this.data = new SpriteSetData();
}
/**
 * 遍历地鼠对象
 * @param {function} fn 单个地鼠对象要执行的函数
 */
SpriteSet.prototype.ergodicSprites = function(fn){
    if(typeof fn != "function"){
        return;
    }
    for(var i = 0;i < CEIL_NUM_X; i ++){
        for(var j = 0;j < CEIL_NUM_Y; j ++){
            var sprite = this.data.aSprites[i][j];
            fn(sprite);
        }
    }
}
/**
 * 随机显现地鼠
 * @param {Level} oLevel Level实例对象
 */
SpriteSet.prototype.randomCreateSprite = function(oLevel){
    var createSpriteNum = Math.ceil(Math.random()*2);//出现1-2只地鼠

    for(var i = 0;i< createSpriteNum;i++){
        //地鼠出现的位置
        var x = Math.floor(Math.random()*3),
            y = Math.floor(Math.random()*3);
        if(this.data.aSprites[x][y].getState() == 1){//若该位置已出现地鼠
            i--;
            break;
        }
        //获得当前关卡随机产生的英雄1种 + 小兵5种的头像 即Class
        //randomCls 是个二维数组，[0]：class [1]：type小兵/英雄
        var randomCls  = oLevel.getRandomSpriteCls();
        //获得该地鼠的class & type
        var randomClsIndex = Math.floor(Math.random()*randomCls.length);
        var cls = randomCls[randomClsIndex][0];
        var type = randomCls[randomClsIndex][1];

        this.data.aSprites[x][y].setSprite( "sprite " + cls,type);

        //统计产生的英雄/小兵的总数
        Sprite.prototype.score.countRasSprite(type);
    }
}
/**
 * 遍历地鼠 给地鼠设置动画时间
 * @param {num} ad 地鼠动画时间
 */
SpriteSet.prototype.initSpritesAnimateDur = function(ad){
    this.ergodicSprites(function(sprite){
        DomControl.setStyle(sprite.ele,"animation-duration:" + ad + "s");
        DomControl.setStyle(sprite.ele,"-webkit-animation-duration:" + ad + "s");
    })
}

/**
 * 关卡结束 重置地鼠
 */
SpriteSet.prototype.resetSprites = function(){
    this.ergodicSprites(function(sprite){
        sprite.init();
        //重置地鼠动画时间
        sprite.ele.style.cssText = "";
    })
}


/**
 * 地鼠集 数据对象(Modal)
 */
function SpriteSetData(){
    this.init();
}
/**
 * 初始化
 */
SpriteSetData.prototype.init = function(){
    this.aSprites = new Array();//sprite
    var oSprites = document.querySelectorAll("#spriteLayer li");

    for(var i = 0;i < CEIL_NUM_X; i ++){
        this.aSprites[i] = new Array();
        for(var j = 0;j < CEIL_NUM_Y; j ++){
            var newSprite = new Sprite(oSprites[CEIL_NUM_Y*i + j]);
            this.aSprites[i][j] = newSprite;
        }
    }
    var parent = this.aSprites[0][0].ele.parentNode;
    while( parent.id != "spriteLayer"){
        parent = parent.parentNode;
    }
    // 阻止ul滚动
    DomControl.addEvent(parent,"touchmove",function(event) {
        event.preventDefault();// 阻止浏览器默认事件
    });
}

