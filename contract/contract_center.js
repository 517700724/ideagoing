var _ct=null;
var _competive_id = null;
var _cid64=null;
var _b64 = new Base64();
$(document).ready(function(){
	_ct=new contractCenter();
	_ct.init();
});

function contractCenter(){
	var _self=this;
	
	this.init=function(){
		_competive_id=_jM.getParam("cid");
		_cid64=_b64.encode(_competive_id);
		$(".ct_time").html(_jM.date.date2DateString(new Date()));
		
		$(".click_read").click(function(){
			parent._jM.dialog.showModeDialog({
				id:"doContractContainer",
				height:655,
				width:1100,
				heightstr:"auto",
				position:"absolute",
				url:"/pc/contract/contract_read.html?cid="+_cid64
			});
			parent._jM.dialog.hiddenModeDialog("contractContainer");
		});
		$(".editBox").click(function(){
			parent._jM.dialog.showModeDialog({
				id:"doContractContainer",
				height:655,
				width:1100,
				heightstr:"auto",
				position:"absolute",
				url:"/pc/contract/contract_read.html?cid="+_cid64
			});
			parent._jM.dialog.hiddenModeDialog("contractContainer");
		});
		
		_self.contractInfo();
	}
	
	this.contractInfo=function(){
		_jM.post("/bp/contract/getContractOverview/"+_competive_id,null,function(rs,data){
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
			//alert(rs.msg);
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

function goPersonal(){
	if(window.parent){
		window.parent.location.href="/personal";
	}else{
		window.location.href="/personal";
	}
}