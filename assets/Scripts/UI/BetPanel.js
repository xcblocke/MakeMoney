var TempBonus = require("TempBonus");
var BetPanel = cc.Class({
    extends: cc.Component,

    properties: {
       Atlas:cc.SpriteAtlas,
       CashLbl:cc.Label,
       costLbl:cc.Label,
       cost:cc.Integer,

       CoinNode:cc.Node,
       CoinEffect:cc.Animation,

  	   zhenNode:cc.Node,
       stateBet:false,
       rate:0,
       IsWin:false,
       tmpWinRatio:0,//临时赢钱概率
    },

    ShowPanel:function (data) {
    	this.CoinNode.active = false;
    	this.stateBet = false;
        this.tmpWinRatio = 0;
        this.zhenNode.rotation = 0;
        this.costLbl.string = "花费金额:"+cc.Mgr.global.BetInitCost;
        this.CashLbl.string = cc.Mgr.UserDataMgr.Cash;
    },

    ClickBet:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if(this.stateBet == true)
            return

        if(cc.Mgr.UserDataMgr.Cash < cc.Mgr.global.BetInitCost)
        {
            var param = {};
            param.forWhat = "";
            param.text = cc.Mgr.global.getTranslation("MoneyNotEnough");
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return;
        }
        this.stateBet = true;
        this.GoToBet();
    },

    CaculateWinRatio:function(){
        var seed = Math.random();
        this.IsWin = true;
        (this.zhenNode.rotation / 60) % 6;
        var rotateAngle = 360 * 6;
        if(seed < cc.Mgr.global.BetWinNullRatio)
        {
            this.IsWin = false;
            this.rate = 0;
            var sd = Math.random();
            if(sd < 0.33)
                rotateAngle += 0;
            else if(sd < 0.66)
                rotateAngle += 2 * 60;
            else
                rotateAngle += 4 * 60;
        }
        else if(seed < cc.Mgr.global.BetWinThreeRatio)
        {
            this.rate = 3;
            rotateAngle += 1 * 60;
        }
        else if(seed < cc.Mgr.global.BetWinFourRatio)
        {
            this.rate = 4;
            rotateAngle += 3 * 60;
        }
        else
        {
            this.rate = 5;
            rotateAngle += 5 * 60;
        }
        return rotateAngle;
    },

    //0 2 4 位置是 谢谢惠顾
    //1 3 5 是win
    GoToBet:function(){
    	var self = this;
    	var seed = Math.floor(Math.random() * 6) + 1;

        cc.Mgr.UserDataMgr.Cash -= cc.Mgr.global.BetInitCost;

    	var x = this.CaculateWinRatio();
    	var rotation = cc.rotateTo(3, x).easing(cc.easeSineInOut());
    	var finished = cc.callFunc(()=>{
    		cc.log("这就是结局================" + this.zhenNode.rotation);
    		self.EndBet();
    	},this);

    	var action = cc.sequence(rotation, finished);
    	this.zhenNode.runAction(action);
    },

    ShowResult:function(){
        if(this.IsWin)
        {
            var param = {};
            var getMoney = (cc.Mgr.global.BetInitCost * this.rate); 
            if(cc.Mgr.global.TempAdsBetBonus == TempBonus.BetBonus)
            {
                getMoney = Math.floor(cc.Mgr.global.BetInitCost * this.rate * 1.2);
                //cc.Mgr.global.TempAdsBetBonus = TempBonus.NULL;
            }
            cc.Mgr.UserDataMgr.Cash += getMoney;
            param.text = cc.Mgr.global.getTranslation("BetWin")+ "\n奖励:" + getMoney;
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            this.tmpWinRatio = 0;//临时概率清零
        }
        else
        {
            var param = {};
            param.text = cc.Mgr.global.getTranslation("BetLose");
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            this.tmpWinRatio += 0.05;
            if(this.tmpWinRatio > 0.25)
            {
                this.tmpWinRatio = 0.25;
            }
        }
        cc.Mgr.global.BetInitCost = cc.Mgr.global.BetInitCost * 2;
        cc.director.GlobalEvent.emit(cc.Mgr.Event.RefreshCashAsset, {});
        this.costLbl.string = "花费金额:"+cc.Mgr.global.BetInitCost;
        this.CashLbl.string = cc.Mgr.UserDataMgr.Cash;
    },

    EndBet:function(){
        if(this.IsWin)
        {
        	this.CoinNode.active = true;
            this.CoinEffect.play("betCoin");
            cc.Mgr.AudioMgr.playSFX("goods_4");
        }
        else
        {
        	this.stateBet = false;
            cc.Mgr.AudioMgr.playSFX("lose");
            this.ShowResult();
        }
    },

    EndCoinEffect:function(){
    	this.CoinNode.active = false;
    	this.stateBet = false;
        this.ShowResult();
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    }, 
});
module.exports = BetPanel;
