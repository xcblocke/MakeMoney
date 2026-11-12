
var TimePanel = cc.Class({
    extends: cc.Component,

    properties: {
        ClockAnima:cc.Animation,
    },

    PlayAnima:function(){
        this.ClockAnima.play("Clock");
    },

    ClockEnd:function(){
        this.node.active = false;
        cc.director.GlobalEvent.emit(cc.Mgr.Event.ClockEnd, {});
        //cc.log("闹钟结束======================================");
    },
});
module.exports = TimePanel;
