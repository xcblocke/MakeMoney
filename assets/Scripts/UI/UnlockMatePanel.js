
var UnlockMatePanel = cc.Class({
    extends: cc.Component,

    properties: {
        Atlas:cc.SpriteAtlas,
        Sp:cc.Sprite,
        desLbl:cc.RichText,

    },

    ShowPanel:function(data){
        this.Sp.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        this.desLbl.string = "<color=#16a0e8>"+data.des + "</c>";
    },

    ClosePanel:function () {
        this.node.active = false;
    },

    
});
module.exports = UnlockMatePanel;
