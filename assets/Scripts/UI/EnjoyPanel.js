var JoyPanel = require("JoyPanel");
var HousePanel = require("HousePanel");
var TreatPanel = require("TreatPanel");
var CarPanel = require("CarPanel");

var EnjoyPanel = cc.Class({
    extends: cc.Component,

    properties: {
        MainAtlas:cc.SpriteAtlas,
        TipNameSp:cc.Sprite,
        joyPanel:JoyPanel,
        housePanel:HousePanel,
        carPanel:CarPanel,
        //treatPanel:TreatPanel,
    },

    ShowPanel:function(){
        //this.OpenJoyPanel();
    },

    OpenJoyPanel:function () {
        cc.Mgr.AudioMgr.playSFX("click");
        this.joyPanel.node.active = true;
        this.housePanel.node.active = false;
        this.carPanel.node.active = false;
        this.TipNameSp.spriteFrame = this.MainAtlas.getSpriteFrame("funny");
        //this.treatPanel.node.active = false;
    },

    OpenHousePanel:function () {
        cc.Mgr.AudioMgr.playSFX("click");
        this.joyPanel.node.active = false;
        this.housePanel.node.active = true;
        this.carPanel.node.active = false;
        //this.treatPanel.node.active = false;
        this.TipNameSp.spriteFrame = this.MainAtlas.getSpriteFrame("house");
        this.housePanel.ShowPanel();
    },

    OpenCarPanel:function () {
        cc.Mgr.AudioMgr.playSFX("click");
        this.joyPanel.node.active = false;
        this.housePanel.node.active = false;
        this.carPanel.node.active = true;
        //this.treatPanel.node.active = false;
        this.TipNameSp.spriteFrame = this.MainAtlas.getSpriteFrame("text_car");
        this.carPanel.ShowPanel();
    },

    OpenTreatPanel:function () {
        cc.Mgr.AudioMgr.playSFX("click");
        this.joyPanel.node.active = false;
        this.housePanel.node.active = false;
        this.carPanel.node.active = false;
        //this.treatPanel.node.active = true;
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },

});
module.exports = EnjoyPanel;
