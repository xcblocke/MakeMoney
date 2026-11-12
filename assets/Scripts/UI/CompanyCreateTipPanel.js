
var CompanyCreateTipPanel = cc.Class({
    extends: cc.Component,

    properties: {
        Atlas:cc.SpriteAtlas,
        IconSp:cc.Sprite,
        NameLbl:cc.Sprite,
        NumLbl:cc.Label,
        DesLbl:cc.RichText,
        Data:null,
    },

    ShowPanel:function (data) {
      this.Data = null;
      this.Data = data;  
      this.NameLbl.spriteFrame = this.Atlas.getSpriteFrame(data.name);
      this.IconSp.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
      this.NumLbl.string = cc.Mgr.global.CompanyCreateCost;
      var name = cc.Mgr.global.getTranslation("company_"+data.Id);
      this.DesLbl.string = "<color=#696969>创办</c>"+"<color=#e77122>"+name+"</c>" + "<color=#696969>需要花费</c>" +"<color=#e77122>"+ cc.Mgr.global.FormatNum(Math.floor(cc.Mgr.global.CompanyCreateCost * 100 * data.stockPrice))
                           +"</c>" +"<color=#696969>,收益率为</c>" + "<color=#e77122>"+(data.bonusRatio*100)+"%" +"</c>";  
    },

    ClickCreate:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if(cc.Mgr.UserDataMgr.Cash < (cc.Mgr.global.CompanyCreateCost * 100 * this.Data.stockPrice))
        {
            var param = {};
            param.forWhat = "";
            param.text = "现金不够";
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return ;
        }
        if(cc.Mgr.UserDataMgr.FundationAge == 0)
        {
            cc.Mgr.UserDataMgr.FundationCompanyId = this.Data.Id;
            cc.Mgr.UserDataMgr.FundationAge = cc.Mgr.UserDataMgr.Age;
        }

        cc.Mgr.global.CreateCompanyTimes += 1;
        cc.Mgr.UserDataMgr.Cash -= Math.floor(cc.Mgr.global.CompanyCreateCost * 100 * this.Data.stockPrice);
        var param = {};
        param.Num = cc.Mgr.global.CompanyCreateCost * 100;
        param.price = this.Data.stockPrice;
        param.cost = this.Data.stockCost;
        param.Id = this.Data.Id;
        var data = cc.Mgr.UserDataMgr.CreateCompany(param);
        //通知刷新UI
        cc.Mgr.UserDataMgr.hasCompany = true;//企业只能创办一个
        cc.director.GlobalEvent.emit(cc.Mgr.Event.CreateCompanySuccess, data);
        this.ClosePanel();
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active =false;
    },
});
module.exports = CompanyCreateTipPanel;
