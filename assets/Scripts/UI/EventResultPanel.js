
var EventResultPanel = cc.Class({
    extends: cc.Component,

    properties: {
        DesLbl:cc.Label,
        CostLbl:cc.Label,
        CostObj:cc.Node,
    },

    ShowPanel:function(data){
        this.DesLbl.string = data.text;
        this.CostLbl.string = data.des;
        this.CostObj.active = true;
        if(data.des == null || data.des == "")
        {
            this.CostObj.active = false;
        }
    },

    ClosePanel:function()
    {
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },
});
