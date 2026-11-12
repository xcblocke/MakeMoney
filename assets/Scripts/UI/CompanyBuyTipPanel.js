
var CompanyBuyTipPanel = cc.Class({
    extends: cc.Component,

    properties: {
        Atlas:cc.SpriteAtlas,
        IconSp:cc.Sprite,
        TitleName:cc.Sprite,
        BuyNumLbl:cc.Label,
        DesLbl:cc.Label,
        Slider:cc.Slider,
        InPutBox:cc.EditBox,
        Progress:cc.ProgressBar,
        BuyNum:0,
        Data:null,
    },

    ShowPanel:function (data) {
    	this.Data = data;
        this.IconSp.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        this.TitleName.spriteFrame = this.Atlas.getSpriteFrame(data.name);
        this.BuyNum = Math.floor(cc.Mgr.UserDataMgr.Cash / (this.Data.stockPrice * 100));
        var money = Math.floor(this.BuyNum * 100 * this.Data.stockPrice);
        this.DesLbl.string = cc.Mgr.global.FormatNum(money);
        this.BuyNumLbl.string = this.BuyNum;
        this.InPutBox.string = this.BuyNum;
        this.Slider.progress = 1;
        this.Progress.progress = 1;
    },

    ClickBuyBtn:function(){
        if(this.BuyNum <= 0)
        {
            cc.Mgr.AudioMgr.playSFX("click");
            return;
        }
        
        cc.Mgr.UserDataMgr.Cash -= Math.floor(this.Data.stockPrice * (this.BuyNum * 100));
        var param = {};
        param.Num = this.BuyNum * 100;
        param.price = this.Data.stockPrice;
        param.Id = this.Data.Id;
        var data = cc.Mgr.UserDataMgr.BuyStocks(param);
        //通知刷新现金
        cc.director.GlobalEvent.emit(cc.Mgr.Event.BuyStockSuccess, data);
        this.ClosePanel();
    },

    OnSliderChange:function(){
        this.BuyNum = Math.floor(this.Slider.progress * cc.Mgr.UserDataMgr.Cash / (this.Data.stockPrice * 100));
        this.Progress.progress = this.Slider.progress;
        this.DesLbl.string = cc.Mgr.global.FormatNum(Math.floor(this.BuyNum * this.Data.stockPrice * 100));
        this.BuyNumLbl.string = this.BuyNum;
        this.InPutBox.string = this.BuyNum;
    },

    OnInputBoxEnd:function(){
        var MaxNum = Math.floor(cc.Mgr.UserDataMgr.Cash / (this.Data.stockPrice * 100));
        if(this.InPutBox.string != "")
        {
            if(Number(this.InPutBox.string) != null)
            {
                if(Number(this.InPutBox.string) > MaxNum) 
                {
                    this.InPutBox.string = MaxNum;
                    this.BuyNum = MaxNum;
                    this.Progress.progress = 1;
                    this.Slider.progress = 1;
                }
                else
                {
                    this.BuyNum = Number(this.InPutBox.string);
                    this.Slider.progress =  this.BuyNum / MaxNum;
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
        this.DesLbl.string = cc.Mgr.global.FormatNum(Math.floor(this.BuyNum * this.Data.stockPrice * 100));
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },
   
});
module.exports = CompanyBuyTipPanel;
