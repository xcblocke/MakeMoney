
var PlatformController = cc.Class({
    statics:{
        wxSubContextViewLock:0,
        //微信 wx
        //头条 tt
        //百度 baidu
        platform:"wx",
        nickName:"校长王",

        Init:function () {
        	if(!window.wx && !window.tt && !window.swan)
            	this.platform="pc";

            this.InitRandNickName();
            
            this.CreateGameClub();
        },

        //百度 头条等先判定是否登陆了
        IsLoginSync:function(){
        	if(this.platform == "baidu")
        	{
        		var result = swan.isLoginSync();
    			if(result.isLogin)
    			{
    				console.log("已经有登陆了");
    				return true;
    			}
    			return false;
        	}
        	else if(this.platform == "tt")
        	{

        	}

        	return true;
        },

        Login:function(){
        	var self = this;
        	if(this.platform == "baidu")
        	{
        		swan.login({
			        success: function () {
			            self.setUserCloudStorage(cc.Mgr.UserDataMgr.HistoryHighAssets);
			        },
			        fail: function () {
			            swan.showModal({
			                title: "登录失败",
			                content: "是否重新登录？",
			                cancelText: "退出游戏",
			                success: function (res) {
			                    if (res.confirm) {
			                        console.log("点击了确定");
			                        self.Login();
			                    }
			                    else if (res.cancel) {
			                        console.log("点击了取消");
			                        swan.exit();
			                    }
			                }
			            })
			        }
			    })
        	}
        	else if(this.platform == "tt")
        	{

        	}

        	return true;
        },

        //游戏圈按钮
        CreateGameClub:function(){
        	if(this.platform == "wx")
        	{
        		var winSize = cc.view.getVisibleSize();
        		var leftRatio = 68 / winSize.width;
        		var topRatio = 275 / winSize.height;

        		var sysInfo = wx.getSystemInfoSync();

        		this.leftPos = sysInfo.windowWidth * leftRatio;
        		this.topPos = sysInfo.windowHeight * topRatio;

        		console.log(this.topPos + "  ================创建游戏圈按钮===============" + this.leftPos);

        		var self = this;
        		this.gameClubBtn = wx.createGameClubButton({
        			icon:'green',
        			text:"游戏圈",
        			style:{
        				left:self.leftPos - 20,
        				top:self.topPos - 20,
        				width: 45,
        				height: 45,
        			}
        		});
        	}
        },

        ShowClubButton:function(flag = false)
        {
        	if(this.platform == "wx" && this.gameClubBtn != null)
        	{
        		if(flag == true)
        			this.gameClubBtn.show();
        		else
        			this.gameClubBtn.hide();
        	}
        },

        //随机一个名字
        InitRandNickName:function(){
        	var seed = Math.floor(Math.random()*24) + 1;
        	this.nickName = cc.Mgr.global.getTranslation("Name"+ seed);
        	cc.log("================================ " + this.nickName)
        },

        //右上角的转发按钮
        ShareTopNav:function(){
        	var index = Math.floor(Math.random()*6);
	        let info = cc.Mgr.ShareInfos.getShareInfos(index);
	        if(this.platform == "wx")
	        {
	            wx.showShareMenu({withShareTicket:true});
	            wx.onShareAppMessage(function () {
	                // 用户点击了“转发”按钮
	                return {
	                  title: "【有人@你】我在这个游戏里面挣了一个亿",
	                  imageUrlId: 'dwMg-qBPS8S7MIWk4VRHxw',
	                  imageUrl: "https://paopao.talkyun.com.cn/yiyi/1.jpg",
	                }
	            })
	        }
	        else if(this.platform == "tt")
	        {
	            tt.showShareMenu(false);
	            tt.onShareAppMessage(function () {
	                // 用户点击了“转发”按钮
	                return {
	                  title: info.text,
	                  //imageUrlId: 'Ik14RZj7SV2BtigrtE3d1g',
	                  imageUrl: info.url,
	                }
	            })
	        }
	        else if(this.platform == "baidu")
	        {
	            swan.showShareMenu(false);
	            swan.onShareAppMessage(function () {
	                // 用户点击了“转发”按钮
	                return {
	                  title: info.text,
	                  imageUrl: info.url
	                }
	            })
	        }
        },

        //转发一段文本
        ShareToFriendTxt:function(str){
        	if(this.platform == "wx")
	        {
	            console.log("点击了分享啊");
	            wx.shareAppMessage({
	                title: str,
	            })
	        }
	        else if(this.platform == "tt")
	        {
	            tt.shareAppMessage({
	                title: str,
	            })
	        }
	        else if(this.platform == "baidu")
	        {
	            console.log("点击了分享啊");
	            swan.shareAppMessage({
	                title: str,
	            })
	        }
        },

        //自定义转发
        ShareToFriend:function(index){
        	var info = cc.Mgr.ShareInfos.getShareInfos(index);
	        if(this.platform == "wx")
	        {
	            console.log("点击了分享啊");
	            wx.shareAppMessage({
	                title: info.text,
	                imageUrl: info.url,
	            })
	        }
	        else if(this.platform == "tt")
	        {
	            tt.shareAppMessage({
	                title: info.text,
	                imageUrl: info.url
	            })
	        }
	        else if(this.platform == "baidu")
	        {
	            console.log("点击了分享啊");
	            swan.shareAppMessage({
	                title: info.text,
	                imageUrl: info.url
	            })
	        }
        },
 		//显示平台的小弹窗 回调用
        showToast:function(text)
	    {
	        cc.log(text);
	        if(this.platform == "wx")
	        {
	            wx.showToast({
	                title: text,
	                icon: 'success',
	                duration: 2000
	            })
	        }
	        else if(this.platform == "tt")
	        {
	            tt.showToast({
	                title: text,
	                icon: 'success',
	                duration: 2000
	            })
	        }
	        else if(this.platform == "baidu")
	        {
	            swan.showToast({
	                title: text,
	                icon: 'success',
	                duration: 2000
	            })
	        }  
	    },
	    //微信开放数据存储 score 代表当前要保存的东西
	    setUserCloudStorage:function(socre) 
	    {
	    	if(!this.IsLoginSync())
	    	{
	    		return;
	    	}
	    	
	        cc.log("setUserCloudStorage socre = " + socre);
	        if(this.platform == "wx")
	        {
	            var kvData={};
	            kvData.wxgame={};
	            kvData.wxgame.score = socre;
	            kvData.wxgame.update_time =  new Date().getTime();
	            console.log(JSON.stringify(kvData));

	            var kvDataList = new Array();
	            kvDataList.push({key: "xmbScore", value: JSON.stringify(kvData)});
	            wx.setUserCloudStorage({
		            KVDataList: kvDataList,
		            success: res => {
		                console.log("success:" + JSON.stringify(res))
		            },
		            fail: res => {
		                console.log("fail : " + res);
		            }
	            });
	        }
	        else if(this.platform == "baidu")
	        {
	        	var kvData={};
	            kvData.wxgame={};
	            kvData.wxgame.score = socre;
	            kvData.wxgame.update_time =  new Date().getTime();
	            console.log(JSON.stringify(kvData));

	            var kvDataList = new Array();
	            kvDataList.push({key: "xmbScore", value: JSON.stringify(kvData)});

	        	swan.setUserCloudStorage({
					KVDataList: kvDataList,
					success: res => console.log("success "+res),
					fail: res => console.log("fail "+res),
					complete: res => console.log("complete "+res)
				});
	        }
	    },

	    //是否支持排行功能
	    IsSupportRank:function()
	    {
	        if(this.platform == "wx" || this.platform == "baidu")
	            return true;

	        return false;
	    },

	    //显示子域
	    showSubContentView:function()
	    {
	        if(this.platform == "wx" || this.platform == "baidu" )
	        {
		        var param = {};
		        param.platform = this.platform;
		        param.flag = true;
		        cc.director.GlobalEvent.emit(cc.Mgr.Event.ShowRank, param);
	        }
	    },

	    hideSubContentView:function()
	    {
	        if(this.platform == "wx" || this.platform == "baidu" )
	        {
	            var param = {};
		        param.flag = false;
		        param.platform = this.platform;
		        cc.director.GlobalEvent.emit(cc.Mgr.Event.ShowRank, param);
	        }
	    },

	    SendMessageToSubView:function(code,curScore=0)
	    {
	        var msg={};
	        msg.code = code;
	        msg.curScore = curScore;
	        if(this.platform == "wx")
	        {
	            wx.getOpenDataContext().postMessage({
	                message: msg
	            });
	        }
	        else if(this.platform == "baidu")
	        {
	        	swan.getOpenDataContext().postMessage({
				    message: msg
				});
	        }
	    },

	    //整理数据
	    CollateData:function(data)
	    {
	        this.userInfo = [];
	        var j = 0;
	        for (let i = 0; i < data.length; ++i) {
	            if(data[i].KVDataList.length == 0)
	            {
	                console.log("combData 没有此项数据");
	                continue;
	            }
	            //{"openid":"o0OhZ5Kn2xO9b5FVR8TE0YXOl3Wc","nickname":"杨彬","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/FcRibGPkicSKhn6LA1OWfL7ictiaKiajzibzW8zwQibkGKdCJmmiasvibcRasI2KytcVtW8ClH5IQTsOs3CB8vyMSUAOarA/132","KVDataList":[{"key":"\belsfkScore","value":"{\"wxgame\":{\"score\":1889,\"update_time\":1553824369920}}"}]}
	            this.userInfo[j]={};
	            this.userInfo[j].openid = data[i].openid;
	            this.userInfo[j].nickname = data[i].nickname;
	            this.userInfo[j].avatarUrl = data[i].avatarUrl;

	            var kVDataListValuestr = data[i].KVDataList[0].value;
	            kVDataListValuestr = kVDataListValuestr.substr(1); //删除第一个字符
	            kVDataListValuestr = kVDataListValuestr.substr(0, kVDataListValuestr.length-1); 
	            kVDataListValuestr = "{" + kVDataListValuestr + "}";
	            var gameScore = JSON.parse(kVDataListValuestr).wxgame;
	            this.userInfo[j].score = gameScore.score;
	            j++;
	        }
	        //给用户数据进行排序
	        this.userInfo.sort((a,b)=>{
	                if(a.score<b.score)
	                    return 1;
	                else if(a.score>b.score)
	                    return -1
	                else
	                    return 0;
	            }
	        );
	        console.log("CollateData--- " + JSON.stringify(this.userInfo));
	        for(var i=0 ;i<this.userInfo.length;i++)
	        {	//挑出自己的排名
	            if(this.userInfo[i].avatarUrl == this.avatarUrl)
	            {
	                this.mySordId = i;
	            }
	        } 
	    },
    },
});
module.exports = PlatformController;
