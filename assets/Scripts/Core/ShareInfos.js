
var ShareInfos = cc.Class({
    extends: cc.Component,
    statics:{
        init:function()
        {
            this.Infos = [
               {text:"【有人@你】我在这个游戏里面挣了一个亿",url:"https://paopao.talkyun.com.cn/yiyi/1.jpg"},
               {text:"迎娶白富美，开着法拉利。这才是我想要的人生巅峰",url:"https://paopao.talkyun.com.cn/yiyi/2.jpg"},
               {text:"开局几万块，看我如何打遍商界无敌手。",url:"https://paopao.talkyun.com.cn/yiyi/3.jpg"},
               {text:"不看不知道，我的资产在好友中排名居然是。。。。",url:"https://paopao.talkyun.com.cn/yiyi/3.jpg"},
               {text:"空姐和超模同时看上我，我该如何选择？",url:"https://paopao.talkyun.com.cn/yiyi/4.jpg"},
               {text:"2019我定了一个小目标，没想到这么快就完成了。",url:"https://paopao.talkyun.com.cn/yiyi/5.jpg"},
            ];
        },

        getShareInfos:function(index){
            return this.Infos[index];
        },
    },
});
module.exports = ShareInfos;