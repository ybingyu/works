var preload = function(){};
preload.prototype.init = function(source,fnBack,fnProgress){
    var self = this;
    self.nLoaded = 0;
    audio = {};

    var resource = [];
    self.fnProgress = fnProgress || function(){};
    var postaction = fnBack || function() {};
    //var source = (typeof source != "object") ? [source] : source; 确保都是数组

    function loadPost() {
        if(self.fnProgress){
            self.fnProgress(self.nLoaded,source.length);
        }
        self.nLoaded++;
        if (self.nLoaded == source.length) {
            console.log("加载完成");
            self.fnProgress(self.nLoaded,source.length);
            postaction(resource);
        }
    }

    for (var i = 0,len = source.length ; i < len; i++) {
        switch(source[i][0]){
            case 'img' :
                resource[i] = new Image();
                resource[i].onload = function() {
                    this.onload = null;
                    loadPost();
                }
                resource[i].onerror = function() {
                    loadPost();
                }
                resource[i].src = Config.imgPath + source[i][1];
                break;
            case 'audio':
                var a = new Howl({
                    urls : [Config.audioPath + source[i][1]],
                    onload : loadPost
                });
                resource[i] = a;
                audio[source[i][1]] = a;
                break;
        }
    }
    return {
        done: function(f) {
            postaction = f || postaction;
        },
        audio : audio
    };
}
