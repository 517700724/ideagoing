var _zpd = new ZoneProjectDetail();
$(document).ready(function(){
	_zpd.init();
});

function ZoneProjectDetail(){
	var _self   = this;
	var _need   = null;
	var _project= null;
	var _addFlag=true;
	var _ProNeedCompetitiveRef=null;
	
	/**
	 * Init zone detail.
	 */
	this.init = function(){
		var compId = _jM.getParam("cid");
		if(_jM.validate.isEmpty(compId)){
			window.location.href="/personal/";
		}
		_self.getProjectDetail(compId);
		var _b64 = new Base64();
		
		$(".click_read").click(function(){
			_jM.dialog.showModeDialog({
				id:"doContractContainer",
				width:1100,
				height:661,
			//	position:"absolute",
				url:"/pc/contract/contract_read.html?cid="+_b64.encode(compId)
			});
		});
	}
	
	/**
	 * Get need.
	 */
	this.getNeed = function(){
		return _need;
	}
	
	/**
	 * Get project detail by competitive id.
	 */
	this.getProjectDetail = function(cid){
		_jM.post("/bp/need/getProjectDetailById", {cid:cid}, function(rs, _data){
			_project = _data.project;
			_need    = _data.project.proNeed;
			
			if(_data.competitiveRef!=null){
				_ProNeedCompetitiveRef = _data.competitiveRef.id;
			}
			
			
			//Set phase.
			var status = getProjectStatus(_need.needStatus, _project.competitiveStatus);
			
			//Initial need phase.
			_comFuns.initNeedPhase(status.statusPhase);
			//Initial need detail.
			_comFuns.initNeedDetail(_need);
			//Initial need tabs.
			_comFuns.initNeedDetailTabs(_comFuns.getNeedPhaseTabs(2, status.statusPhase));
			//Initial competitive detail.
			_self.initCompetitiveDetail(_data.competitive);
			//Initial implements list.
			_self.initImplementsList(_project.needId, _project.id);
			//Initial server evaluate.
			_self.initServerEvaluate(_project.needId);
			//Initial need supplement.
			_self.initSupplement(_project.needId);
			//Get milePost
			_self.readMile(_project.needId, _project.id);
			//Get project status.
			var tooltip = _self.getProjectStatusTooltip(_need.needStatus, _project.competitiveStatus);
			//Set show status and function buttons.
			$("#needShow_status").html(tooltip.statusText);
			$("#needShow_competitivestatus").html(tooltip.compStatusText);
			$("#needShow_functionBtns").html(_self.getProjectDetailButtons(status.functionList));
			
			var hashId = window.location.hash;
			if(hashId == "#li_needCompetitive"){
				_comFuns.setNeedDetailTab($("#li_needCompetitive"), "needCompetitive");
			}
			//view contranct
			_self.contractInfo(_project.id);
		});
	}
	
	/**
	 * Get project detail buttons.
	 */
	this.getProjectDetailButtons = function(funList){
		var html= getProjectButtons(funList, _project.id, _ProNeedCompetitiveRef);
		return _jM.validate.isEmpty(html)?"":"您可以点此："+html;
	}
	
	/**
	 * Get project status tooltip text.
	 */
	this.getProjectStatusTooltip = function(status, compStatus){
		switch(status){
		case 6:
			switch(compStatus){
			case -2:
				return _self.getProjectDetailText("竞标中，", "距离竞标截止时间：", "竞标已取消。", _need.competitiveReleaseMills);
			case -1:
				return _self.getProjectDetailText("竞标中，", "距离竞标截止时间：", "竞标被淘汰。", _need.competitiveReleaseMills);
			case 0:
				return _self.getProjectDetailText("竞标中，", "距离竞标截止时间：", "竞标书已提交，待完善。", _need.competitiveReleaseMills);
			case 1:
				return _self.getProjectDetailText("竞标中，", "距离竞标截止时间：", "竞标书已完善，待付款。", _need.competitiveReleaseMills);
			case 2:
				return _self.getProjectDetailText("竞标中，", "距离竞标截止时间：", "竞标书已发布，等待选标。", _need.competitiveReleaseMills);
			case 21:
				return _self.getProjectDetailText("竞标中，", "距离竞标截止时间：", "对方已发起实施，待确认。", _need.competitiveReleaseMills);
			case 3:
			}
			break;
		case 61:
			switch(compStatus){
			case -2:
				return _self.getProjectDetailText("选标中，", "距离选标截止时间：", "竞标已取消。", _need.competitiveReleaseMills);
			case -1:
				return _self.getProjectDetailText("选标中，", "距离选标截止时间：", "竞标被淘汰。", _need.competitiveReleaseMills);
			case 0:
			case 1:
				return _self.getProjectDetailText("选标中，", "距离选标截止时间：", "竞标期已过，不能再提交竞标。", _need.competitiveReleaseMills);
			case 2:
				return _self.getProjectDetailText("选标中，", "距离选标截止时间：", "竞标书已发布，等待选标。", _need.competitiveReleaseMills);
			case 21:
				return _self.getProjectDetailText("选标中，", "距离选标截止时间：", "对方已发起实施，待确认。", _need.competitiveReleaseMills);
			case 3:
			}
			break;
		case 7:
			switch(compStatus){
			case -2:
				return _self.getProjectDetailText("项目已过期，", null, "竞标已取消。", 0);
			case -1:
				return _self.getProjectDetailText("项目已过期，", null, "竞标被淘汰。", 0);
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
				return _self.getProjectDetailText("项目已过期，", null, "项目已过期。", 0);
				break;
			}
			break;
		case 8:
			return _self.getProjectDetailText("项目实施中。", null, "已中标", 0);
		case 87:
			return _self.getProjectDetailText("初步验收中。","已发起初步验收申请，请耐心等待对方的验收！", "已中标", 0);
		case 88:
			return _self.getProjectDetailText("初步项目验收不通过，请重新发起验收申请！", null, "已中标", 0);
		case 89:
			return _self.getProjectDetailText("初步验收已通过。", null, "已中标", 0);
		case 90:
			return _self.getProjectDetailText("初步验收已通过，等待需求方付款！", null, "已中标", 0);	
		case 81:
			return _self.getProjectDetailText("验收中。","已发起验收申请，请耐心等待对方的验收！", "已中标", 0);
		case 82:
			return _self.getProjectDetailText("验收不通过。","项目验收不通过，请确认！", "已中标", 0);
		case 83:
			return _self.getProjectDetailText("验收完成，等待需求方付款。", null, "已中标", 0);
		case 84:
			return _self.getProjectDetailText("等待双方评价。", null, "已中标", 0);
		case 85:
			return _self.getProjectDetailText("需求方已评，等待服务方评价。", null, "已中标", 0);
		case 86:
			return _self.getProjectDetailText("服务方已评，等待需求方评价。", null, "已中标", 0);
		case 9:
			return _self.getProjectDetailText("售后维护中。", null, "已中标", 0);
		case 10:
			return _self.getProjectDetailText("项目已结束。", null, "已中标", 0);
		}
		return {statusText:"", compStatusText:""};
	}
	
	/**
	 * Get project detail text.
	 */
	this.getProjectDetailText = function(text, text2, text3, countDown){
		var html = "<span class='d_desc2'>"+ text +"</span>" + (_jM.validate.isEmpty(text2)?"":text2);
		if(countDown > 0){
			html+= "<span class='d_desc2' id='need_countdown_timer'>0天0小时0分0秒</span>";
			_comFuns.startTimer(countDown, function(value){
				
				if($("#need_countdown_timer").length>0){
					$("#need_countdown_timer").html(value);
				}
			}, null);
		}
		
		text3 = _jM.validate.isEmpty(text3) ? null:"<span class='d_desc2'>"+text3+"</span>"
		return {statusText:html, compStatusText:text3};
	}

	/**
	 * Initial competitive detail.
	 */
	this.initCompetitiveDetail = function(comp){
		if(comp != null){
			$("#competitiveShow_competitiveTime").html(comp.createTime);
			$("#competitiveShow_competitiveDevTimes").html(comp.competitiveDevTimes+"天");
			$("#competitiveShow_competitivePay").html("￥"+comp.competitivePay);
			$("#competitiveShow_competitivePunishRate").html(comp.competitivePunishRate+"%");
			$("#competitiveShow_competitiveServiceTimes").html(comp.competitiveServiceTimes+"天");
			$("#competitiveShow_competitiveServiceDepositRate").html(comp.competitiveServiceDepositRate+"%");
			$("#competitiveShow_competitiveDesc").html(comp.competitiveDesc);
			$("#competitiveShow_competitiveAttachment").html(_comFuns.getNeedAttachmentList(comp.competitiveAttachment));
			$("#competitiveShow_competitiveNeedArrearsMaxRate").html(comp.competitiveNeedArrearsMaxRate+"%");
		}
	}
	
	/**
	 * Initial implements list.
	 */
	this.initImplementsList = function(nid, cid){
		if($("#tab_needImplement").length > 0){
			$("#implementsFrame").attr("src", "/personal/zone_implements_list.html?nid=" + nid+"&cid="+ cid);
			$("#implementsFrame").load(function(){_self.resetImplFrameHeight();});
		}
	}
	
	/**
	 * Reset implements frame height.
	 */
	this.resetImplFrameHeight = function(){
		$("#implementsFrame").css("height",(_jM.iframe$getFrameHeight("implementsFrame")+50)+"px");
	}
	
	/**
	 * Initial server evaluate.
	 */
	this.initServerEvaluate = function(nid){
		if($("#tab_needEvaluate").length > 0){
			if(_need.needStatus == 84 || _need.needStatus == 85){
				$("#evaluateFrame").attr("src", "/personal/zone_need_evaluate.html?nid=" + nid);
			}
			else if(_need.needStatus == 86 || _need.needStatus == 9 || _need.needStatus == 10){
				$("#evaluateFrame").attr("src", "/personal/zone_need_evaluateshow.html?nid=" + nid);
			}
			$("#evaluateFrame").load(function(){_self.resetEvaluateFrameHeight();});
		}
	}
	
	/**
	 * Reset evaluate frame height.
	 */
	this.resetEvaluateFrameHeight = function(){
		$("#evaluateFrame").css("height",(_jM.iframe$getFrameHeight("evaluateFrame")+50)+"px");
	}
	
	/**
	 * milePost
	 */
	this.addMile=function(mid){
		if(!_addFlag){
			alert("最多添加20个");
			return;
		}
		_jM.tooltip.hiddenAll();
		if(!_self.flag(mid,1)) return;
		$("#flag").val(1);
		var addHtml="";
		addHtml+="<div class='MilePostEdit'>"+
					"<div class='editDate'>"+
						"<input type='text' id='milepostCycleAdd' placeholder='所需时间（天数）'>"+
					"</div>"+
					"<div class='editPostImg'></div>"+
					"<div class='editThing'>"+
						"<textarea id='nodeTitleAdd'  placeholder='请填写该阶段的任务描述' ></textarea>"+
					"</div>"+
					"<div class='btnCancel' id='btnCancel' onclick='_zpd.cancelAdd("+mid+")'>取消</div>"+
					"<div class='btnSub' id='btnSub' onclick='_zpd.submitAdd("+mid+")'>提交</div>"+
				"</div>";
		
		$("#add"+mid).html(addHtml);
		$("#add"+mid).show();
	}
	
	this.cancelAdd=function(mid){
		_jM.tooltip.hiddenAll();
		
		$("#flag").val(0);
		$("#add"+mid).hide();
	}
	
	this.submitAdd=function(mid){
		_jM.tooltip.hiddenAll();
		_jM.tooltip.hideTip("nodeTitleAdd");
		_jM.tooltip.hideTip("milepostCycleAdd");
		
		$("#flag").val(0);
		var nid=$("#nid").val();
		var cid=$("#cid").val();
		var title=$("#nodeTitleAdd").val();
		var cycle=$("#milepostCycleAdd").val();
		var desc="";
		
		if(_jM.validate.isEmpty(cycle)){
			_jM.tooltip.showTip("milepostCycleAdd","开发周期不能为空");
			return;
		}
		if(!_jM.validate.isInteger(cycle)){
			_jM.tooltip.showTip("milepostCycleAdd","开发周期的天数是整数");
			return;
		}
		
		var v2 = parseFloat(cycle);
		
		if(v2<1){
			_jM.tooltip.showTip("milepostCycleAdd","开发周期1到365天");
			return;
		}
		if(v2>365){
			_jM.tooltip.showTip("milepostCycleAdd","开发周期1到365天");
			return;
		}
		
		if(_jM.validate.isEmpty(title)){
			_jM.tooltip.showTip("nodeTitleAdd","事项不能为空");
			return;
		}
		if(!_jM.validate.isLengthBetween(title,1,200)){
			_jM.tooltip.showTip("nodeTitleAdd","事项最多200字");
			return;
		}
		
		//var dataStr="parentId="+mid+"&needId="+nid+"&needCompetitiveId="+cid+"&nodeTitle="+title+"&nodeDesc="+desc+"&milepostCycle="+cycle;
		var dataStr={
				parentId:mid,
				needId:nid,
				needCompetitiveId:cid,
				nodeTitle:title,
				nodeDesc:desc,
				milepostCycle:cycle
		};
		_jM.post('/bp/needCompetitiveMilepost/createMilepost',dataStr,function(data,rst){
			
			_self.readMile($("#nid").val(), $("#cid").val());
			
		},function(rst){
			if(rst.errCode=="081"){
				alert("当前需求已经发起项目实施");
				window.location.reload();
			}else{
				_jM.tooltip.showTip("addBtn"+mid,"添加失败");
			}
			
			
		});
	}
	
	//-------------------------------------
	this.editMile=function(mid){
		_jM.tooltip.hiddenAll();
		
		if(!_self.flag(mid,2)) return;
		$("#flag").val(1);
		$("#show"+mid).hide();
		$("#edit"+mid).show();
	}
	
	this.cancelMile=function(mid){
		_jM.tooltip.hiddenAll();
		
		$("#flag").val(0);
		$("#edit"+mid).hide();
		$("#show"+mid).show();
	}
	
	this.deleteMile=function(mid){
		_jM.tooltip.hiddenAll();
		if(!_self.flag(mid,3)) return;
		$("#flag").val(1);
		
		if(confirm("你确定要删除本条服务意向信息")){
			_jM.post('/bp/needCompetitiveMilepost/deleteMilepost',{id:mid},function(data,rst){
				$("#edit"+mid).hide();
				$("#show"+mid).hide();
				_self.readMile($("#nid").val(), $("#cid").val());
			},function(rst){
				if(rst.errCode=="081"){
					alert("当前需求已经发起项目实施");
					window.location.reload();
				}else{
					_jM.tooltip.showTip("#deleteBtn"+mid,"删除失败");
				}
			});
	     }
	}
	
	this.submitMile=function(mid){
		_jM.tooltip.hiddenAll();
		
		_jM.tooltip.hideTip("nodeTitle"+mid);
		_jM.tooltip.hideTip("milepostCycle"+mid);
		
		var nid=$("#nid").val();
		var cid=$("#cid").val();
		var title=$("#nodeTitle"+mid).val();
		var cycle=$("#milepostCycle"+mid).val();
		var desc="";
		
		if(_jM.validate.isEmpty(cycle)){
			_jM.tooltip.showTip("milepostCycle"+mid,"开发周期不能为空");
			return;
		}
		if(!_jM.validate.isInteger(cycle)){
			_jM.tooltip.showTip("milepostCycle"+mid,"开发周期的天数是整数");
			return;
		}
		
		var v2 = parseFloat(cycle);
		
		if(v2<1){
			_jM.tooltip.showTip("milepostCycle"+mid,"开发周期1到365天");
			return;
		}
		if(v2>365){
			_jM.tooltip.showTip("milepostCycle"+mid,"开发周期1到365天");
			return;
		}
		
		if(_jM.validate.isEmpty(title)){
			_jM.tooltip.showTip("nodeTitle"+mid,"事项不能为空");
			return;
		}
		if(!_jM.validate.isLengthBetween(title,1,200)){
			_jM.tooltip.showTip("nodeTitle"+mid,"事项最多200字");
			return;
		}
		
		//var dataStr="id="+mid+"&needId="+nid+"&needCompetitiveId="+cid+"&nodeTitle="+title+"&nodeDesc="+desc+"&milepostCycle="+cycle;
		var dataStr={
				id:mid,
				needId:nid,
				needCompetitiveId:cid,
				nodeTitle:title,
				nodeDesc:desc,
				milepostCycle:cycle
		}
		_jM.post('/bp/needCompetitiveMilepost/updateMilepost',dataStr,function(data,rst){
			
			_self.readMile($("#nid").val(), $("#cid").val());
			
		},function(rst){
			if(rst.errCode=="081"){
				alert("当前需求已经发起项目实施");
				window.location.reload();
			}else{
				_jM.tooltip.showTip("editBtn"+mid,"修改失败");
			}
			
		});
	}
	
	this.showMilemodeT=function(mid){
		var sta=$("#showModel"+mid).css("display");
		if(sta.toString()=="none"){
			$("#showModel"+mid).show();
			var html=$("#titleInfo"+mid).html();
			var r="...";
			$("#titleInfo"+mid).html(html.replace(r,""));
		}
		if(sta.toString()=="block"){
			$("#showModel"+mid).hide();
			var html=$("#titleInfo"+mid).html();
			var r="...";
			$("#titleInfo"+mid).html(html+"...");
		}
		
	}
	
	this.readMile=function(nid, cid){
		_addFlag=true;
		_jM.tooltip.hiddenAll();
		
		var need_1=_self.getNeed();
		status=need_1.needStatus;
		competitiveStatus=_project.competitiveStatus;
		
		$("#flag").val(0);
		$("#nid").val(nid);
		$("#cid").val(cid);
		_jM.post('/bp/needCompetitiveMilepost/searchMilepost?needId='+nid+'&competitiveId='+cid,null,function(data,rst){
			var filepostHtml="";
			var fistid=0;
			var startTime = rst.length > 0? rst[0].milepostStartTime.split(" ")[0] : "--";
			var addinfo = rst.length > 1? "":"点击创建项目里程碑";
			filepostHtml+="<div class='MilePostInfoPanel'>"+
				
					"<div class='MilePostInfo' id='show"+fistid+"'>"+
						"<div class='MilePostTime' id='staryTime'>"+startTime+"</div>"+
						"<div class='MilePostImg'><img src='/statics/zone/project/image/MileImg.png'></div>"+
						"<div class='MilePostThing'>开始</div>"+
						"<div class='operation'>";
						if(!(status==83||status==84||status==85||status==86||status==9||status==10)){
							filepostHtml+="<span style='margin-left:25px;' id='addBtn"+fistid+"' onclick='_zpd.addMile("+fistid+")'><img src='/statics/zone/project/image/add.png' title='添加事项'>" +
									"<span id='addinfo'>"+addinfo+"</span>" +
									"</span>";
						}
			filepostHtml+="</div>"+
					"</div>"+
					  
					"<div class='MilePostEditPanel'  style='display:none;' id='add"+fistid+"'>"+
						
					"</div>"+
					
				"</div>";
			
			
			for (var i = 0; i < rst.length; i++) {
				if(i == 0){
					continue;
				}
				
				if(rst.length>=20){
					_addFlag=false;
				}
				
				var createTime_l="";
				var obj=rst[i];
				if(obj.milepostStartTime!=null&&obj.milepostStartTime!=""){
					var _createTime=obj.milepostEndTime;
					var ct=_createTime.split(" ");
					createTime_l=ct[0];
				}
				var mid=obj.id;
				
				var title=obj.nodeTitle.substr(0, 34); 
				var nodeTitleM=obj.nodeTitle.replace(title,"");
				
				
				filepostHtml+="<div class='MilePostInfoPanel'>"+
				
								"<div class='MilePostInfo' id='show"+mid+"'>"+
									"<div class='MilePostTime'>"+createTime_l+"</div>"+
									"<div class='MilePostImg'><img src='/statics/zone/project/image/MileImg.png'></div>";
				if(obj.nodeTitle.length>34){					
					filepostHtml+="<div class='MilePostThing' onmouseout='javascript:_zpd.showMilemodeT("+mid+")' onmouseenter='javascript:_zpd.showMilemodeT("+mid+")' id='titleInfo"+mid+"' >"+title+"...</div>";
				}else{
					filepostHtml+="<div class='MilePostThing'  >"+title+"</div>";
				}
				filepostHtml+="<div class='operation'>";
				if(!(status==83||status==84||status==85||status==86||status==9||status==10)){
					filepostHtml+="<span id='editBtn"+mid+"' onclick='_zpd.editMile("+mid+")'><img src='/statics/zone/project/image/edit.png' title='修改事项'></span>"+
										"<span id='addBtn"+mid+"' onclick='_zpd.addMile("+mid+")'><img src='/statics/zone/project/image/add.png' title='添加事项'></span>"+
										"<span id='deleteBtn"+mid+"' onclick='_zpd.deleteMile("+mid+")'><img src='/statics/zone/project/image/delete.png' title='删除事项'></span>";
				}
				filepostHtml+="</div>"+
								"</div>"+
								
								"<div class='MilePostEditPanel' style='display:none;' id='edit"+mid+"'>"+
									"<div class='MilePostEdit'>"+
										"<div class='editDate'>"+
											"<input type='text' id='milepostCycle"+mid+"' onfocus='_jM.tooltip.hiddenAll()' value='"+obj.milepostCycle+"' placeholder='  开发周期（天）'>"+
										"</div>"+
										"<div class='editPostImg'></div>"+
										"<div class='editThing'>"+
											"<textarea onfocus='_jM.tooltip.hiddenAll()' id='nodeTitle"+mid+"'>"+obj.nodeTitle+"</textarea>"+
										"</div>"+
										"<div class='btnCancel' id='btnCancel' onclick='_zpd.cancelMile("+mid+")'>取消</div>"+
										"<div class='btnSub' id='btnSub' onclick='_zpd.submitMile("+mid+")'>提交</div>"+
									"</div>"+
								"</div>";
				if(obj.nodeTitle.length>34){				
				filepostHtml+="<div class='MilePostShowPanel' style='display:none;' id='showModel"+mid+"'>"+
									"<div class='MilePostEdit'>"+
										"<div class='editDate'></div>"+
										"<div class='editPostImg' style='height:120px;'></div>"+
										"<div class='modelT'>"+nodeTitleM+"</div>"+
									"</div>"+
								"</div>";
				}
								
				filepostHtml+="<div class='MilePostEditPanel' style='display:none;' id='add"+mid+"'></div>"+
								
							"</div>";
			}
			$("#milePostHtml").html(filepostHtml);
			
			
		},function(rst){
			
		});
	}
	
	this.flag=function(mid,f){
		if($("#flag").val()==0){
			
			return true;
		}else{
			if(f==1){
				_jM.tooltip.showTip("addBtn"+mid,"请完成当前操作");
			}
			if(f==2){
				_jM.tooltip.showTip("editBtn"+mid,"请完成当前操作");
			}
			if(f==3){
				_jM.tooltip.showTip("deleteBtn"+mid,"请完成当前操作");
			}
			
		}
		return false;
	}
	
	this.initSupplement = function(nid)
	{
		$.post('/bp/needSupplement/getPublicSupplementByNeedId',{needId:nid},function(rs){
			if(rs && rs.success == true)
			{
				var data = rs.data;
				for (var i = 0; i < data.length; i++) {
					var obj = {};
					obj.desc = data[i].supplementDesc;
					obj.attach = data[i].supplementAttachment;
					obj.status = data[i].supplementStatus;
					displaySupplement(obj);
				}
			}
		})
	}
	
	
	/*
	 * Viewer Contract
    */
	this.contractInfo=function(_competive_id){
		_jM.post("/bp/contract/getContractOverview/"+_competive_id,null,function(rs,data){
			//alert("0000");
			if(data.errorCode==2){
				$(".addContract").hide();
			}
			$("#contractCUpdateTime").html(data.contractCUpdateTime);
			$("#contractAUpdateTime").html(data.contractAUpdateTime);
			$("#contractBUpdateTime").html(data.contractBUpdateTime);
			
			$("#Astatus").html("甲方,"+_self.status(data.contractAStatus));
			$("#Bstatus").html("乙方,"+_self.status(data.contractBStatus));
			
			$("#partAname").html(data.partyAName);
			$("#partBname").html(data.partyBName);
			$("#partyAPhone").html(data.partyAPhone);
			$("#partyBPhone").html(data.partyBPhone);
		},function(data){
			
		});
	}
	this.status=function(status){
		var statusInfo="";
		switch(status){
			case 1:
				statusInfo="提交合同";
				break;
			case 2:
				statusInfo="等待同意签署合同";
				break;
			case 3:
				statusInfo="同意签署合同";
				break;
			case 4:
				statusInfo="爱迪狗平台撮合中-待同意";
				break;
			case 5:
				statusInfo="爱迪狗平台已撮合-同意签署合同合同提交";
				break;
			case 6:
				statusInfo="爱迪狗平台撮合中";
				break;
			default:
				statusInfo="正在拟合同...";
				break;
		}
		return statusInfo;
	}
}

function displaySupplement(data)
{
	var seq = $('.nsp').length + 1;
	var html = '<p class="nsp" style="color:#555;font-weight:bold">补充需求'+seq+'</p>';
	html += '<p>'+data.desc+'</p>';
	html += '<ul class="d_attachment">'+_comFuns.getNeedAttachmentList(data.attach)+'</ul>';
	$('#needSupplementDisplay').append(html);
}











