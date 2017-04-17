var _jc=null;
$(document).ready(function(){
	_jc=new joinCompetive();
	_jc.init();
});

function joinCompetive(){
//start
	var _self=this;
	
	this.init=function(){
		var needid = _jM.getParam("nid");
		var needTitle=_jM.getParam("needTitle");
		var successCaseId = _jM.getParam("successCaseId");
		$("#successCaseId").val("");
		if(needid == null || needid=="" || parseInt(needid)<=0){
			window.parent.location.href="/";
		}
		if(successCaseId != null || successCaseId!="" || parseInt(needid)>0){
			$("#successCaseId").val(successCaseId);
		}
		
		_jM.post("/bp/needCompetitive/isCanCompetitive", {needId:needid}, function(rs, data){
			$("#competitivePay").focus(function(){_self.hiddenTip();_jM.tooltip.showTip("competitivePay","项目报价必须是有效的数字，精确到小数点后两位")});
			$("#competitivePay").blur(function(){_self.hiddenTip();_jM.tooltip.hideTip("competitivePay")});
			$("#competitiveDevTimes").focus(function(){_self.hiddenTip();_jM.tooltip.showTip("competitiveDevTimes","实施工期必须填写，且必须是整数")});
			$("#competitiveDevTimes").blur(function(){_self.hiddenTip();_jM.tooltip.hideTip("competitiveDevTimes")});
			$("#competitiveDesc").focus(function(){_self.hiddenTip();_jM.tooltip.showTip("competitiveDesc","竞标描述必须填写")});
			$("#competitiveDesc").blur(function(){_self.hiddenTip();_jM.tooltip.hideTip("competitiveDesc")});
			$("#agreeRules").blur(function(){_self.hiddenTip();_jM.tooltip.hideTip("agreeRules")});
			
			$("#pro_title").html("项目名称："+needTitle);
			$("#needId").val(needid);
			$("#submitButton").click(function(){
				_self.validateSubmit();
			 });
			$("#success_case").click(function(){
//				parent._jM.dialog.showModeDialog({
//					id:"successCaseContainer",
//					height:655,
//					width:540,
//					heightstr:"auto",
//					url:"/pc/contract/contract_upload2.html?needid="+needid
//				});
//				
//				parent._jM.dialog.hiddenModeDialog("competiveContainer");
				$("#successCaseView").show();
				$("#competiveView").hide();
				parent.iFrameHeightById("competiveContainer");
			});
		}, function(rs){
			alert(rs.msg);
			window.parent.location.href="/";
		})
		
		$(".ct_btn2").click(function() {
		if ($(".ct_show").is(":hidden")) {
			$(this).find("img").addClass("imgDiv");
			$(".ct_show").show();
			//parent.setFrameHeight(970, "competiveContainer");
			parent._jM.dialog.iFrameHeight("competiveContainer")
		} else {
			$(this).find("img").removeClass("imgDiv");
			$(".ct_show").hide();
			//parent.setFrameHeight(733, "competiveContainer");
			parent._jM.dialog.iFrameHeight("competiveContainer")
		}
	})
		
	}
	
	//validate
	this.hiddenTip = function(){
		_jM.tooltip.hideTip("competitivePay");
		_jM.tooltip.hideTip("competitiveDevTimes");
		_jM.tooltip.hideTip("competitiveDesc");
		_jM.tooltip.hideTip("agreeRules");
		_jM.tooltip.hideTip("submitButton");
		_jM.tooltip.hideTip("success_case");
		_jM.tooltip.hideTip("competitiveDepositRate");
	}
	this.validateCompetitivePay = function(){
		if(_jM.validate.isEmpty($("#competitivePay").val())){_self.hiddenTip();_jM.tooltip.showTip("competitivePay","项目报价必须填写");return false;}
		if(!_jM.validate.isBigDecimal($("#competitivePay").val())){_self.hiddenTip();_jM.tooltip.showTip("competitivePay","项目报价必须是有效的数字，精确到小数点后两位");return false;}
		if(!_jM.validate.isDecimalRangeIn($("#competitivePay").val(),1,100000000000)){
			_self.hiddenTip();_jM.tooltip.showTip("competitivePay","项目报价的取值范围只能在1到100000000000之间！");
			return false;
		}
		return true;
	}
	this.validateCompetitiveDevTimes = function(){
		if(_jM.validate.isEmpty($("#competitiveDevTimes").val())){_self.hiddenTip();_jM.tooltip.showTip("competitiveDevTimes","实施工期必须填写");return false;}
		if(!_jM.validate.isInteger($("#competitiveDevTimes").val())){_self.hiddenTip();_jM.tooltip.showTip("competitiveDevTimes","实施工期必须是整数");return false;}
		if(!_jM.validate.isDecimalRangeIn($("#competitiveDevTimes").val(),1,10000)){
			_self.hiddenTip();_jM.tooltip.showTip("competitiveDevTimes","实施工期的取值范围只能在1到10000之间！");
			return false;
		}
		return true;
	}
	this.validateCompetitiveDesc = function(){
		if(_jM.validate.isEmpty($("#competitiveDesc").val())){_self.hiddenTip();_jM.tooltip.showTip("competitiveDesc","竞标描述必须填写");return false;}
		if(!_jM.validate.isLengthBetween($("#competitiveDesc").val(), 1, 4000)){
			_self.hiddenTip();_jM.tooltip.showTip("competitiveDesc","竞标描述长度不能超过4000字符");return false;
		}
		return true;
	}
	this.validateRules = function(){
		if(!$("#agreeRules").prop("checked")){_self.hiddenTip();_jM.tooltip.showTip("agreeRules","您必须同意发布需求规则与保密协议才能继续");return false;}
		return true;
	}
	this.vtSvase=function(){
//		if(_jM.validate.isEmpty($("#successCaseId").val())){
//			_jM.tooltip.showTip("success_case","请上传或选择成功案例");
//			return false;
//		}
		return true;
	}
	this.vtRate=function(){
		if(_jM.validate.isEmpty($("#competitiveDepositRate").val())){
			_jM.tooltip.showTip("competitiveDepositRate","项目合同款比率不能为空");
			return false;
		}
		if(!_jM.validate.isNumberRangeIn($("#competitiveDepositRate").val(),0,100)){
			_jM.tooltip.showTip("competitiveDepositRate","请填写有效数字（0到100）");
			return false;
		}
		return true;
	}
	
	//submit validate 
	this.validateSubmit = function(){
		_self.hiddenTip();
		if(!_self.validateCompetitivePay()) return;
		if(!_self.validateCompetitiveDevTimes()) return;
		if(!_self.validateCompetitiveDesc()) return;
		if(!_self.validateRules()) return;
		if(!_self.vtRate()) return;
		if(!_self.vtSvase()) return;

		_self.submit();
	}
	//------------------submit------------------
	this.submit = function(){
		_jM.dubDatalayer.show({id:"globalModeLayer"});
		_jM.post("/bp/needCompetitive/saveNeedCompetitive", $("#submitForm").serialize(), function(rs, data){
//			window.location.href="/competitive/competitive_extra.html?cid="+data;
			parent._jM.dialog.showModeDialog({
				id:"contractContainer",
				height:655,
				width:540,
				heightstr:"auto",
				position:"absolute",
				url:"/pc/contract/contract_center.html?cid="+data
			});
			parent._jM.dialog.hiddenModeDialog("competiveContainer");
			
		}, function(rs){
			if(rs.errCode == "04"){
				_jM.dubDatalayer.hidden({id:"globalModeLayer"});
				_jM.tooltip.showTip("submitButton","不能重复竞标！");
			}else{
				_jM.dubDatalayer.hidden({id:"globalModeLayer"});
				_jM.tooltip.showTip("submitButton","提交失败，请重试！");
			}
		});
	}
	
//end	
}

//select option  showCompetitiveNeedArrearsMaxRateList
function showCompetitiveNeedArrearsMaxRateList(){
	_jM.dropMenu.show({showId:'competitiveNeedArrearsMaxRate',menuId:'competitiveNeedArrearsMaxRateList',top:25});
	$("#competitiveNeedArrearsMaxRate").focus();
	
	//hiddenCompetitiveNeedArrearsMaxRateList();
	hiddenTimeoutPunishList();
	hiddenLaterMaintainList();
	hiddenLaterPaymentList();
}
function clickCompetitiveNeedArrearsMaxRate(v){
	$("#competitiveNeedArrearsMaxRate").val(v);
	hiddenCompetitiveNeedArrearsMaxRateList();
}
function hiddenCompetitiveNeedArrearsMaxRateList(){
	_jM.dropMenu.hidden({menuId:'competitiveNeedArrearsMaxRateList'});
}

//select option  showTimeoutPunishList
function showTimeoutPunishList(){
	_jM.dropMenu.show({showId:'timeoutPunish',menuId:'timeoutPunishList',top:25});
	$("#timeoutPunish").focus();
	
	hiddenCompetitiveNeedArrearsMaxRateList();
	//hiddenTimeoutPunishList();
	hiddenLaterMaintainList();
	hiddenLaterPaymentList();
}
function clickTimeoutPunishList(v){
	$("#timeoutPunish").val(v);
	hiddenTimeoutPunishList();
}
function hiddenTimeoutPunishList(){
	_jM.dropMenu.hidden({menuId:'timeoutPunishList'});
}

//select option  showLaterMaintainList
function showLaterMaintainList(){
	_jM.dropMenu.show({showId:'laterMaintain',menuId:'laterMaintainList',top:25});
	$("#laterMaintain").focus();
	
	hiddenCompetitiveNeedArrearsMaxRateList();
	hiddenTimeoutPunishList();
	//hiddenLaterMaintainList();
	hiddenLaterPaymentList();
}
function hiddenLaterMaintainList(){
	_jM.dropMenu.hidden({menuId:'laterMaintainList'});
}
function clickLaterMaintainList(v){
	$("#laterMaintain").val(v);
	hiddenLaterMaintainList();
}

//select option  showLaterPaymentList
function showLaterPaymentList(){
	_jM.dropMenu.show({showId:'laterPayment',menuId:'laterPaymentList',top:25});
	$("#laterPayment").focus();
	
	hiddenCompetitiveNeedArrearsMaxRateList();
	hiddenTimeoutPunishList();
	hiddenLaterMaintainList();
	//hiddenLaterPaymentList();
}
function hiddenLaterPaymentList(){
	_jM.dropMenu.hidden({menuId:'laterPaymentList'});
}
function clickLaterPaymentList(v){
	$("#laterPayment").val(v);
	hiddenLaterPaymentList();
}