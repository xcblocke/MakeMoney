
var StartUpPanel = cc.Class({
    extends: cc.Component,

    properties: {
        title:cc.Label,
        desLbl:cc.Label,
        costLbl:cc.Label,
        iconSp:cc.Sprite,
        cost:cc.Integer,
    },

    ShowPanel:function (data) {
        this.title.string = data.name;
        this.desLbl.string = "升级"+data.name+"****";
        //this.iconSp.spriteFrame = ;
        var cost = cc.Mgr.MapDataMgr.getUpgradeCostByTwoId(data.Id, data.subId, data.toLv);
        this.costLbl.string = cost;
        this.cost = cost;
    },

    ClosePanel:function(){
        this.node.active = false;
    },

    ClickUpgrade:function(){
        
    },

});
module.exports = StartUpPanel;
