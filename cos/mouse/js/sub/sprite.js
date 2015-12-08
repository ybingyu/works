/**
 * 地鼠 对象 (Control)
 * @param ele 地鼠对应的dom元素 
 */
function Sprite(ele){
    this.init(ele);
}

Sprite.prototype.init = function(ele){
    var _this = this;

    this.data = new SpriteData();//Modal
    this.resetSprite();

    if(this.ele && ele){
        return ;
    }

    // View :绑定dom
    if(typeof ele == "string"){
        this.ele = document.querySelector(ele);
    }else if(typeof ele == "object"){
        this.ele = ele.querySelector("div");
    }

    // dom绑定事件 击中
    DomControl.addEvent(this.ele,"touchend",function(event) {
        event.preventDefault();// 阻止浏览器默认事件
        if(_this.data.state == 1){
            _this.score.setCount(_this.data.spriteType);
            _this.resetSprite();
            _this.hitSprite();
            // _this.data.init();
            console.log("hit");
            // 0128 audio 
            AudioControl.play("hit");           
        }
    });
    // var parent = this.ele.parentNode;
    // while( parent.id != "spriteLayer"){
    //     parent = parent.parentNode;
    // }
    // // dom绑定事件 击中
    // DomControl.addEvent(parent,"touchmove",function(event) {
    //     event.preventDefault();// 阻止浏览器默认事件
    // });

    //动画结束时消失
    DomControl.addEvent(this.ele,"animationend",function(){
        _this.animationEnd();
    });
    DomControl.addEvent(this.ele,"webkitAnimationEnd",function(){
        _this.animationEnd();
    });
}

/**
 * 设置绑定分数对象
 * @param {object} ele 分数管理对象 dom
 */
Sprite.prototype.setScore = function(ele){
    if(Sprite.prototype.score == null){
        Sprite.prototype.score = ele;
    }
}
/**
 * 击中地鼠 特效
 */
Sprite.prototype.hitSprite = function(){
    this.data.init(2);

    DomControl.addClass(this.ele,"sprite hited");
}
/**
 * 地鼠出现
 * @param {string} cls 添加ClassName
 * @param {num} type 添加spriteType 小兵0 英雄1
 */
Sprite.prototype.setSprite = function(cls,type){
    var _this = this;
    // DomControl.addClass(this.ele,cls);
    this.ele.className = cls;

    this.data.setState(1);
    this.data.setType(type);
}

/**
 * 地鼠消失 重置
 * @param {string} cls 要删除的ClassName
 */
Sprite.prototype.resetSprite = function(cls){
    if(!this.ele){
        return;
    }
    if(cls){
        DomControl.removeClass(this.ele,cls)
    }else{
        this.ele.className = "";
    }
}

/**
 * @return {num} state 当前状态1有地鼠 0无地鼠
 */
Sprite.prototype.getState = function(){
    return this.data.state;
}

/**
 * 地鼠动画 结束时执行函数
 */
Sprite.prototype.animationEnd = function(){
    this.resetSprite();
    //只有英雄重置
    if(this.data.state == 1 && this.data.spriteType == 1){
        //将连击数重置
        this.score.resetDoubleHit();
    }
    this.data.init();
}

/**
 * 地鼠数据 对象(Modal)
 * @param {num} state 状态
 * @param {num} type 类型
 */
function SpriteData(state,type){
    this.init(state,type);
}
/**
 * 地鼠 初始化
 * @param {num} state 状态
 * @param {num} type 类型
 */
SpriteData.prototype.init = function(state,type){
    this.state = state || 0;// 状态 0：无英雄 1:有英雄 2:被击中 
    this.spriteType = type || -1;//小兵0 英雄1
}
/**
 * 设置类型
 * @param {num} type 类型
 */
SpriteData.prototype.setType = function(type){
    this.spriteType = type;//小兵0 英雄1
}
/**
 * 设置状态
 * @param {num} state 状态
 */
SpriteData.prototype.setState = function(state){
    this.state = state;// 状态 0：无英雄 1:有英雄 2:被击中
}