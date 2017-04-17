var _comFuns = new CommonsFunctions();

/**
 * Need common functions.
 */
function CommonsFunctions(){
	var _tabs = ["needDetail", "needCompetitive", "needImplement", "needEvaluate"];
	var _self = this;
	var _timer = null;
	var _timerSeconds = 0;
	
	/**
	 * Get phase need tabs.
	 */
	this.getNeedPhaseTabs = function(type, phase){
		if(type == 1 && phase == 1){
			return [_tabs[0]];
		}
		else if(type == 1 && phase == 2){
			return [_tabs[1], _tabs[0]];
		}
		else if(type == 1 && phase == 3){
			return [_tabs[2], _tabs[0]];
		}
		else if(type == 1 && phase == 4){
			return [_tabs[3], _tabs[2], _tabs[0]];
		}
		else if(type == 1 && phase == 5){
			return [_tabs[2], _tabs[0], _tabs[3]];
		}
		else if(type == 2 && phase == 1){
			return [_tabs[0], _tabs[1]];
		}
		else if(type == 2 && phase == 2){
			return [_tabs[2], _tabs[1], _tabs[0]];
		}
		else if(type == 2 && phase == 3){
			return [_tabs[2], _tabs[1], _tabs[0]];
		}
		else if(type == 2 && phase == 4){
			return [_tabs[3], _tabs[2], _tabs[1], _tabs[0]];
		}
		else if(type == 2 && phase == 5){
			return [_tabs[2], _tabs[0], _tabs[1], _tabs[3]];
		}
		return [];
	}
	
	/**
	 * Get need buttons.
	 */
	this.getNeedButtons = function(type, funList, id){
		var html="";
		
		if(funList != null){
			for(var i=0; i< funList.length; i++){
				var t = funList[i];
				
				if(type == 1 && t == "needSubmit"){
					html+= _self.getNeedButtonText(t, id, "继续完善");
				}
				else if(type == 1 && t == "needPayment"){
					html+= _self.getNeedButtonText(t, id, "立即支付");
				}
				else if(type == 1 && t == "needCancel"){
					html+= _self.getNeedButtonText(t, id, "取消需求");
				}
				else if(type == 1 && t == "needRepublish"){
					//html+= _self.getNeedButtonText(t, id, "重新发布");
				}
				else if(type == 1 && t == "needChooseCompetitive"){
					html+= _self.getNeedButtonText(t, id, "选标");
				}
				else if(type == 1 && t == "needSupplement"){
					html+= _self.getNeedButtonText(t, id, "补充需求");
				}
				else if(type == 1 && t == "needFollowImplement"){
					html+= _self.getNeedButtonText(t, id, "查看进度");
				}
				else if(type == 1 && t == "needFollowAgreement"){
					html+= _self.getNeedButtonText(t, id, "查看协议");
				}
				else if(type == 1 && t == "needCheckImplement"){
					//html+= _self.getNeedButtonText(t, id, "验收");
				}
				else if(type == 1 && t == "needCheckPayment"){
					html+= _self.getNeedButtonText(t, id, "立即支付");
				}
				else if(type == 1 && t == "needFirstCheckPayment"){
					html+= _self.getNeedButtonText(t, id, "立即支付");
				}
				else if(type == 1 && t == "needEvaluate"){
					html+= _self.getNeedButtonText(t, id, "立即评价");
				}
				else if(type == 2 && t == "serverFollowAgreement"){
					html+= _self.getNeedButtonText(t, id, "查看协议");
				}
				else if(type == 2 && t == "serverApplyCheck"){
					html+= _self.getNeedButtonText(t, id, "申请验收");
				}
				else if(type == 2 && t == "serverFollowCheck"){
					//html+= _self.getNeedButtonText(t, id, "查看验收");
				}
				else if(type == 2 && t == "serverCheckFailed"){
					//html+= _self.getNeedButtonText(t, id, "验收不通过");
				}
				else if(type == 2 && t == "serverEvaluate"){
					html+= _self.getNeedButtonText(t, id, "评价");
				}
			}
		}
		return html;
	}
	
	/**
	 * Get need button text.
	 */
	this.getNeedButtonText = function(type, id, desc, nid){
		return "<div class='d_desc_btn' id='btn_"+type+"' onclick=\"_comFuns.functionClick('"+type+"',"+id+","+nid+")\">"+desc+"</div>";
	}
	
	/**
	 * Function button on click.
	 */
	this.functionClick = function(type, id ,nid){
		if(typeof(operationClick) != "undefined"){
			operationClick(type, id, nid);
		}
	}
	
	/**
	 * Get need status.
	 */
	this.getNeedStatus = function(v){
		//发布需求状态流程有两种 -1 -> 0 -> 2 或 -1 -> 1 -> 2
		//-2 取消发布，-1已提交，0待托管，1待审核，2待审核，3初审通过，4初审不通过，5复审不通过，6竞标中，61选标中，
		//7已过期，8实施中，87初步验收中，88初步验收不通过，89初步验收通过，81验收中，82验收不通过，83待付款，84待评价，85需求方已评价，86服务方已评价，9维护中，10结束
		var obj = {statusDesc:"", functionList:[], statusPhase:0, status:v};
		
		switch (v){
		case -2:
			obj.statusPhase = 1;
			obj.statusDesc  = "已取消";
			obj.functionList= [];
			break;
		case -1:
			obj.statusPhase = 1;
			obj.statusDesc  = "已提交";
			obj.functionList= ["needSubmit", "needCancel"];
			break;
		case 0:
			obj.statusPhase = 1;
			obj.statusDesc  = "待托管";
			obj.functionList= ["needPayment", "needCancel"];
			break;
		case 1://待审核
			obj.statusPhase = 1;
			obj.statusDesc  = "待审核";
			obj.functionList= ["needCancel"];
			break;
		case 2://待审核
		case 3://初审通过
			obj.statusPhase = 1;
			obj.statusDesc  = "待审核";
			obj.functionList= ["needCancel"];
			break;
		case 4://初审不通过
		case 5://复审不通过
			obj.statusPhase = 1;
			obj.statusDesc  = "审核不通过";
			obj.functionList= ["needRepublish", "needCancel"];
			break;
		case 6:
			obj.statusPhase = 2;
			obj.statusDesc  = "竞标中";
			obj.functionList= ["needChooseCompetitive","needSupplement"];
			break;
		case 61:
			obj.statusPhase = 2;
			obj.statusDesc  = "选标中";
			obj.functionList= ["needChooseCompetitive"];
			break;
		case 7:
			obj.statusPhase = 2;
			obj.statusDesc  = "已过期";
			obj.functionList= ["needRepublish"];
			break;
		case 8:
			obj.statusPhase = 3;
			obj.statusDesc  = "实施中";
			obj.functionList= ["needFollowImplement", "needFollowAgreement", "serverFollowAgreement", "serverApplyCheck"];
			break;
		case 87:
			obj.statusPhase = 3;
			obj.statusDesc  = "初步验收中";
			obj.functionList= [];
			break;
		case 88:
			obj.statusPhase = 3;
			obj.statusDesc  = "初步验收不通过";
			obj.functionList= [];
			break;
		case 89:
			obj.statusPhase = 3;
			obj.statusDesc  = "初步验收通过";
			obj.functionList= [];
			break;
		case 90:
			obj.statusPhase = 3;
			obj.statusDesc  = "初步验收通过，待付款";
			obj.functionList= ["needFirstCheckPayment"];
			break;
		case 81:
			obj.statusPhase = 3;
			obj.statusDesc  = "验收中";
			obj.functionList= ["needCheckImplement", "needFollowAgreement", "serverFollowAgreement", "serverFollowCheck"];
			break;
		case 82:
			obj.statusPhase = 3;
			obj.statusDesc  = "验收不通过";
			obj.functionList= ["serverCheckFailed"];
			break;
		case 83://待付款
			obj.statusPhase = 3;
			obj.statusDesc  = "待付款";
			obj.functionList= ["needCheckPayment", "needFollowAgreement", "serverFollowAgreement"];
			break;
		case 84:
			obj.statusPhase = 4;
			obj.statusDesc  = "待评价";
			obj.functionList= ["needEvaluate", "serverEvaluate"];
			break;
		case 85:
			obj.statusPhase = 4;
			obj.statusDesc  = "需求方已评";
			obj.functionList= ["serverEvaluate"];
			break;
		case 86:
			obj.statusPhase = 4;
			obj.statusDesc  = "服务方已评";
			obj.functionList= ["needEvaluate"];
			break;
		case 9:
			obj.statusPhase = 5;
			obj.statusDesc  = "售后中";
			obj.functionList= [];
			break;
		case 10:
			obj.statusPhase = 5;
			obj.statusDesc  = "已结束";
			obj.functionList= [];
			break;
		}
		return obj;
	}
	
	/**
	 * Initial need phase.
	 */
	this.initNeedPhase = function(phase){
		$("#needPhase1").attr("src","/statics/public/image/step_bg_02.jpg");
		$("#needPhase2").attr("src","/statics/public/image/"+(phase>=2?"step_bg_02.jpg":"step_bg_01.jpg"));
		$("#needPhase3").attr("src","/statics/public/image/"+(phase>=3?"step_bg_02.jpg":"step_bg_01.jpg"));
		$("#needPhase4").attr("src","/statics/public/image/"+(phase>=4?"step_bg_02.jpg":"step_bg_01.jpg"));
		$("#needPhase5").attr("src","/statics/public/image/"+(phase>=5?"step_bg_02.jpg":"step_bg_01.jpg"));
	}
	
	/**
	 * Initial need detail.
	 */
	this.initNeedDetail = function(_need){
		if(_need != null){
			$("#needShow_needTitle").html(_need.needTitle);
			$("#needShow_needNo").html(_need.needNo);
			$("#needShow_publishtime").html(_need.needPublicTime);
			$("#needShow_needDeposit").html("￥"+_need.needDeposit);
			$("#needShow_needBudget").html("￥"+_need.needBudget);
			$("#needShow_needCompetitiveTimes").html(_need.needCompetitiveTimes+"天");
			$("#needShow_needChooseTimes").html(_need.needChooseTimes+"天");
			$("#needShow_needCategory").html(_self.getNeedCategory(_need.proBaseCategorys));
			$("#needShow_needAreaList").html(_self.getNeedAreaList(_need.sbcitieses));
			$("#needShow_needDevelopmentTimes").html(_need.needDevelopmentTimes+"天");
			$("#needShow_needTechniques").html(_jM.validate.isEmpty(_need.needTechniques)?"无要求":_need.needTechniques);
			
			$("#needShow_needRequiredEnterprise").html(_need.needRequiredEnterprise==0?"否":"是");
			$("#needShow_needAfterSales").html(_need.needAfterSales==0?"否":"是");
			$("#needShow_needInvoice").html(_need.needInvoice==0?"否":"是");
			$("#needShow_needThirdAuth").html(_need.needThirdAuth==0?"否":"是");
			$("#needShow_needRequiredCase").html(_need.needRequiredCase==0?"否":"是");
	
			//$("#needShow_needDesc").html(_need.needDesc.replace(/\r\n/g,"</p><p>"));
			$("#needShow_needDesc").html(_need.needDesc!=null&&_need.needDesc!=''?_need.needDesc.replace(/\r|\n/g,'</p><p>'):'');
			$("#needShow_needAttachment").html(_self.getNeedAttachmentList(_need.needAttachment));
		}
	}
	
	/**
	 * Get need category.
	 */
	this.getNeedCategory = function(categoryList){
		var html="";
		if(categoryList != null){
			for(var i=categoryList.length-1; i>=0; i--){
				html+= categoryList[i].categoryName + (i==0?"":" / ");
			}
		}
		return html;
	}
	
	/**
	 * Get need attachment list.
	 */
	this.getNeedAttachmentList = function(attachment){
		var attList = _jM.ideagoing.getUploadAttachmentList(attachment);
		var html="";
		if(attList != null){
			for(var i=0; i<attList.length; i++){
				html+="<li>附件"+(i+1)+"：<a href='"+attList[i].imgURL+"' target='_blank'>"
					+attList[i].imgText+"</a></li>";
			}
		}
		return html;
	}
	
	/**
	 * Get need detail area list. 
	 */
	this.getNeedAreaList = function(cities){
		if(cities != null && cities.length>0){
			var html="";
			for(var i=0; i<cities.length; i++){
				html+=cities[i].cityNameCn + (i==cities.length-1?"":",");
			}
			return html;
		}else{
			return "无限制";
		}
	}
	
	/**
	 * Get date 2 days.
	 * 
	 * @param v mills.
	 */
	this.getDate2Days = function(v){
		if(v == null || v <= 0){
			return "";
		}
		var mills1 = v%(24*60*60*1000);
		var days   = (v-mills1)/(24*60*60*1000);
		
		var mills2 = mills1%(60*60*1000);
		var hours  = (mills1-mills2)/(60*60*1000);
		
		var mills3 = mills2%(60*1000);
		var minutes= (mills2-mills3)/(60*1000);
		
		var mills4 = mills3%1000;
		var seconds= (mills3-mills4)/1000;
		return days+"天"+hours+"小时"+minutes+"分"+seconds+"秒";
	}
	
	/**
	 * Initial need detail tabs.
	 */
	this.initNeedDetailTabs = function(tabList){
		if(tabList == null || tabList.length<=0){
			return;
		}
		
		for(var i=0; i<_tabs.length; i++){
			var isDelete = true;
			
			for(var j=0; j<tabList.length; j++){
				if(_tabs[i] == tabList[j]){
					isDelete = false;
					break;
				}
			}
			if(isDelete){
				$("#tab_"+ _tabs[i]).remove();
				$("#li_"+ _tabs[i]).remove();
			}
		}
		
		_self.setNeedDetailTab($("#li_"+tabList[0]), tabList[0]);
	}
	
	/**
	 * Set need detail tab.
	 */
	this.setNeedDetailTab = function(obj, tag){
		$(".click").removeClass("click");
		$(obj).addClass("click");
		
		for(var j=0; j<_tabs.length; j++){
			if(_tabs[j] == tag){
				$("#tab_"+_tabs[j]).css("display","block");
			}else{
				$("#tab_"+_tabs[j]).css("display","none");
			}
		}
		if(typeof(operationTabClick) != "undefined"){
			operationTabClick(tag);
		}
	}
	
	/**
	 * Start count down timer.
	 */
	this.startTimer = function(mills, callBackFun, endFun){
		if(mills > 0){
			_timerSeconds = mills + 60000;
			_timer = _jM.timer.start({time:1000, callback: function(){
				_timerSeconds = _timerSeconds - 1000;
				
				if(_timerSeconds >= 0 && callBackFun != null){
					callBackFun(_self.getDate2Days(_timerSeconds));
					
				}else{
					_jM.timer.stop({timeHandler:_timer});
					if(endFun != null){
						endFun();
					}else{
						window.location.reload();
					}
				}
			}});
		}
	}
}