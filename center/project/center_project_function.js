/**
 * Get project buttons.
 * 
 * @param funList
 * @param id
 */
function getProjectButtons(funList, id, nid){
	var html = _comFuns.getNeedButtons(2, funList, id);
	
	if(funList != null){
		for(var i=0; i< funList.length; i++){
			var t = funList[i];
			
			if(t == "competitiveSubmit"){
				html+= _comFuns.getNeedButtonText(t, id, "继续完善");
			}
			else if(t == "competitivePayment"){
				html+= _comFuns.getNeedButtonText(t, id, "立即支付");
			}
			else if(t == "competitiveCancel"){
				html+= _comFuns.getNeedButtonText(t, id, "取消竞标");
			}
			else if(t == "competitiveConfirm"){
				html+= _comFuns.getNeedButtonText(t, id, "立即确认",nid);
			}
			else if(t == "competitiveMilepost"){
				html+= _comFuns.getNeedButtonText(t, id, "里程碑");
			}
		}
	}
	return html;
}

/**
 * Get project status.
 * @param v
 * @param v2
 */
function getProjectStatus(v, v2){
	//-2已取消，-1淘汰，0已提交，1待付款，2待选标（已否认、继续待选），3需求方已提交实施请求、待付款 4 等待确认 5 已确任、开始实施
	var obj = _comFuns.getNeedStatus(v);
		obj.compStatusDesc = "";
		obj.compStatus = v2;
		obj.compDetails= true;
		
	switch(obj.status){
	case 6:
		switch(v2){
		case -2:
			obj.compStatusDesc="竞标已取消";
			break;
		case -1:
			obj.compStatusDesc="竞标被淘汰";
			break;
		case 0:
			obj.compStatusDesc="竞标书已提交，待完善";
			obj.functionList= ["competitiveSubmit","competitiveCancel","competitiveMilepost"];
			break;
		case 1:
			obj.compStatusDesc="竞标书已完善，待付款";
			obj.functionList= ["competitivePayment","competitiveCancel","competitiveMilepost"];
			break;
		case 2:
			obj.compStatusDesc="等待选标";
			obj.functionList= ["competitiveMilepost","competitiveCancel"];
			break;
		case 21:
			obj.compStatusDesc="对方已发起实施，待确认";
			obj.functionList= ["competitiveConfirm", "competitiveMilepost"];
			break;
		case 3:
		}
		obj.statusPhase = 1;
		break;
	case 61:
		switch(v2){
		case -2:
			obj.compStatusDesc="竞标已取消";
			break;
		case -1:
			obj.compStatusDesc="竞标被淘汰";
			break;
		case 0:
		case 1:
			obj.compStatusDesc="竞标期已过";
			obj.functionList= ["competitiveCancel"];
			break;
		case 2:
			obj.compStatusDesc="等待选标";
			obj.functionList= ["competitiveMilepost","competitiveCancel"];
			break;
		case 21:
			obj.compStatusDesc="对方已发起实施，待确认";
			obj.functionList= ["competitiveConfirm", "competitiveMilepost"];
			break;
		case 3:
		}
		obj.statusPhase = 1;
		break;
	case 7:
		switch(v2){
		case -2:
			obj.compStatusDesc="竞标已取消";
			break;
		case -1:
			obj.compStatusDesc="竞标被淘汰";
			break;
		case 0:
		case 1:
		case 2:
		case 3:
			obj.compStatusDesc="需求已过期";
			obj.functionList= ["competitiveCancel"];
			break;
		}
		obj.statusPhase = 1;
		break;
	case 8:
		switch(v2){
		case -2:
			obj.compStatusDesc="竞标已取消";
			obj.compDetails = false;
			obj.functionList= [];
			break;
		case -1:
		case 0:
		case 1:
		case 2:
			obj.compDetails = false;
			obj.functionList= [];
			obj.compStatusDesc="竞标被淘汰";
			break;
		case 3:
			obj.compStatusDesc="已中标";
			break;
		}
		obj.statusPhase = 2;
		break;
	case 81:
	case 82:
	case 83:
	case 87:
	case 88:
	case 89:
	case 90:
		switch(v2){
		case -2:
			obj.compStatusDesc="竞标已取消";
			obj.compDetails = false;
			obj.functionList= [];
			break;
		case -1:
		case 0:
		case 1:
		case 2:
			obj.compDetails = false;
			obj.functionList= [];
			obj.compStatusDesc="竞标被淘汰";
			break;
		case 3:
			obj.compStatusDesc="已中标";
			break;
		}
		obj.statusPhase = 3;
		break;
	case 84:
	case 85:
	case 86:
		switch(v2){
		case -2:
			obj.compStatusDesc="竞标已取消";
			obj.compDetails = false;
			obj.functionList= [];
			break;
		case -1:
		case 0:
		case 1:
		case 2:
			obj.compDetails = false;
			obj.functionList= [];
			obj.compStatusDesc="竞标被淘汰";
			break;
		case 3:
			obj.compStatusDesc="已中标";
			break;
		}
		obj.statusPhase = 4;
		break;
	case 9:
	case 10:
		switch(v2){
		case -2:
			obj.compStatusDesc="竞标已取消";
			obj.compDetails = false;
			obj.functionList= [];
			break;
		case -1:
		case 0:
		case 1:
		case 2:
			obj.compDetails = false;
			obj.functionList= [];
			obj.compStatusDesc="竞标被淘汰";
			break;
		case 3:
			obj.compStatusDesc="已中标";
			break;
		}
		obj.statusPhase = 5;
		break;
	}
	return obj;
}

/**
 * Competitive functions.
 */
function operationClick(type, id, nid){  //nid competitiveRef.id
	
	if(type == "competitiveSubmit"){
		window.open("/competitive/competitive_extra.html?cid="+ id);
	}
	else if(type == "competitivePayment"){
		window.open("/competitive/competitive_payment.html?cid="+ id);
	}
	else if(type == "competitiveConfirm"){
		if(window.parent && window.parent._mainZone){
			window.open("/personal/zone_project_confirm.html?cid="+ id+"&nid="+nid);
		}else{
			window.location.href="/personal/zone_project_confirm.html?cid="+ id+"&nid="+nid;
		}
	}
	else if(type == "competitiveMilepost"){
		if(window.parent && window.parent._mainZone){
			window.open("/personal/zone_project_detail.html?cid="+id+"#li_needCompetitive");
		}else{
			_comFuns.setNeedDetailTab($("#li_needCompetitive"), "needCompetitive");
			window.location.href="#li_needCompetitive";
		}
	}
	else if(type == "competitiveCancel"){
		if(window.parent && 
				typeof(window.parent.showModelDialog)!="undefined"){
			
			window.parent.showModelDialog({
				width:500,
				height:430,
				param:{id:id, callBack:function(obj){
					window.location.reload();
				}},
				url:"/personal/zone_project_cancel.html"
			});
		}else{
			_jM.dialog.showModeDialog({
				width:500,
				height:430,
				param:{id:id, callBack:function(obj){
					window.location.reload();
				}},
				url:"/personal/zone_project_cancel.html"
			});
		}
	}
	else if(type == "serverFollowAgreement"){
		if(window.parent && window.parent._mainZone){
			window.open("/personal/zone_project_confirm.html?cid=" + id);
		}else{
			window.location.href="/personal/zone_project_confirm.html?cid=" + id;
		}
	}
	else if(type == "serverApplyCheck"){
		if(window.parent && window.parent._mainZone){
			window.open("/personal/zone_project_detail.html?cid="+id+"#li_needImplement");
		}else{
			_comFuns.setNeedDetailTab($("#li_needImplement"), "needImplement");
			window.location.href="#li_needImplement";
		}
	}
}