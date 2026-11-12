var LovePointCost = require("LovePointCost");
var MateGetCond = require("MateGetCond");
var MateBonus = require("MateBonus");
var MateData = cc.Class({
	name:"MateData",
    properties: {
        Id:cc.Integer,
        icon:"",
        name:"",
        bonusList:[MateBonus],
        unlockCond:cc.Integer,
        getCondList:[MateGetCond],
        sex:cc.Integer,
        lovePointList:[LovePointCost],
    },
});
module.exports = MateData;
