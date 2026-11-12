
//技能天赋
var SkillStruct = cc.Class({
	name:"SkillStruct",
    properties: {
    	icon:"",
    	name:"",
    	Id:cc.Integer,
    	subId:cc.Integer,
        level:cc.Integer,
        Uplv:cc.Integer,
        desId:cc.Integer,
        skillType:cc.Integer,
    },
});
module.exports = SkillStruct;
