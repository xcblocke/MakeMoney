var Event = require("Event");
var BuyTipPanel = cc.Class({
    extends: cc.Component,

    properties: {
        IconSp:cc.Sprite,
        nameSp:cc.Sprite,
        Atlas:cc.SpriteAtlas,
        GoodsName:cc.Label,
        BuyNumLbl:cc.Label,
        Slider:cc.Slider,
        Progress:cc.ProgressBar,
        InPutBox:cc.EditBox,
        DesLbl:cc.Label,
        BuyNum:0,
        CanBuyNum:0,
        Data:null,
    },

    ShowPanel:function (data) {
        this.Data = null;
        this.CanBuyNum = Math.floor( cc.Mgr.UserDataMgr.Cash / data.price);
        if(this.CanBuyNum > cc.Mgr.UserDataMgr.WareHouseCapcity)
        {
            this.CanBuyNum = cc.Mgr.UserDataMgr.WareHouseCapcity;
        }

        this.IconSp.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        this.BuyNum = this.CanBuyNum;
        this.nameSp.spriteFrame = this.Atlas.getSpriteFrame(data.name);
        this.BuyNumLbl.string = this.CanBuyNum;
        this.InPutBox.string = this.CanBuyNum;
        this.DesLbl.string = cc.Mgr.global.FormatNum(this.CanBuyNum * data.price); 
        this.Slider.progress = 1;
        this.Progress.progress = 1;
        this.Data = data;
    },

    OnSliderChange:function(){
        this.BuyNum = Math.floor(this.Slider.progress * this.CanBuyNum);
        this.Progress.progress = this.Slider.progress;
        ////cc.log("+++++++++++++++++++++" + this.price);
        this.BuyNumLbl.string = this.BuyNum;
        this.InPutBox.string = this.BuyNum
        this.DesLbl.string = cc.Mgr.global.FormatNum(this.BuyNum * this.Data.price);
    },

    OnInputBoxEnd:function(){
    	if(this.InPutBox.string != "")
    	{
    		if(Number(this.InPutBox.string) != null)
    		{
    			if(Number(this.InPutBox.string) > this.CanBuyNum) 
    			{
    				this.InPutBox.string = this.CanBuyNum;
    				this.BuyNum = this.CanBuyNum;
    				this.Progress.progress = 1;
    				this.Slider.progress = 1;
    			}
    			else
    			{
    				this.BuyNum = Number(this.InPutBox.string);
    				this.Slider.progress =  this.BuyNum / this.CanBuyNum;
    				this.Progress.progress = this.Slider.progress;
    			}
    		}
    	}
    	else
    	{
    		this.InPutBox.string = "0";
			this.BuyNum = 0;
			this.Progress.progress = 0;
			this.Slider.progress = 0;
    	}
    	this.DesLbl.string = cc.Mgr.global.FormatNum(this.BuyNum * this.Data.price);
    },

    ClickBuyBtn:function(){
        if(this.BuyNum <= 0)
        {
            cc.Mgr.AudioMgr.playSFX("click");
            return;
        }

        //判断是否已经买了物种物品
        if(cc.Mgr.UserDataMgr.CheckOwnedGoodsNum() == true)
        {
            this.DesLbl.string = "只能购买拥有5种物品";
            return;
        }
        
        if(cc.Mgr.UserDataMgr.WareHouseCapcity < this.BuyNum)
        {
            var param = {};
            param.forWhat = "";
            param.text = "仓库容量不够";
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return ;
        }
        cc.Mgr.UserDataMgr.WareHouseCapcity -= this.BuyNum;

        cc.Mgr.UserDataMgr.Cash -= (this.Data.price * this.BuyNum);
        var param = {};
        param.Num = this.BuyNum;
        param.price = this.Data.price;
        param.Id = this.Data.Id;
        var data = cc.Mgr.UserDataMgr.BuyGoods(param);
        //通知刷新现金
        cc.director.GlobalEvent.emit(cc.Mgr.Event.BuySuccess, data);
        this.ClosePanel();
        return this.Data.Id;
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },

});
module.exports = BuyTipPanel;
