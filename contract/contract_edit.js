var _ec=null;
var _b64 = new Base64();
var _competive_id = null;
var _cid64=null;
$(document).ready(function(){

	
	if(!_jM.IsPC()){
		/*var headerH = $('.edit_top').height();
		var footerH = $('.joinBtn').height();
		//edit_main
		var winHeight = 0;
		if (window.innerHeight)
			winHeight = window.innerHeight;
			else if ((document.body) && (document.body.clientHeight))
			winHeight = document.body.clientHeight;
		$('.edit_main').css('height',(winHeight -headerH-footerH-66)+'px');
		$('.edit_box').css('height',(winHeight -headerH-footerH-89)+'px');*/
	}
	
	parent._jM.dialog.hideClose();
	_ec=new editContract();
	_ec.init();
});

function editContract(){
	var _self=this;
	
	this.init=function(){
		_cid64=_jM.getParam("cid");
		_competive_id=_b64.decode(_cid64);
		if(_competive_id != null || _competive_id!="" || parseInt(_competive_id)>0){
			$("#competiveId").val(_competive_id);
		}
		
		$("#partyaName").focus();
		
		$("#preview_edit").click(function(){
			_self.validateData();
		});
		
		_self.readContract();
		
		$("#submitData").click(function(){
			_self.validateData();
		});
		
		$("#cancelSubmit").click(function(){

			/*parent._jM.dialog.showModeDialog({
				id:"contractContainer",
				height:655,
				width:540,
				heightstr:"auto",
				position:"absolute",
				url:"/pc/contract/contract_center.html?cid="+_competive_id
			});*/
			alert("您的合同已经保存在个人业务中心，方便您下次浏览！");
			parent._jM.dialog.hiddenModeDialogPc("doContractContainer");
			//_self.readContract();

		});
	}
	
	this.validateData=function(){
		if(!_self.vtRate("firstEntrustRate")) return;
		if(!_self.vtRate("competitiveNeedArrearsMaxRate")) return;
		if(!_self.vtRate("partycPayRate")) return;
		if(!_self.vtRate("penaltyRate")) return;
		if(!_self.vtRate("competitiveDepositRate")) return;
		if(!_self.vtRate("competitiveDepositRate1")) return;
		if(!_self.vtRate("competitiveDepositRate2")) return;
		if(!_self.vtRate("partyaPenaltyRate")) return;
		
		if(!_self.vtNum("competitiveServiceTimes")) return;
		if(!_self.vtNum("acceptDeadline")) return;
		if(!_self.vtNum("partyaOvertime")) return;
		
		if(!_self.isDecimalRangeIn("competitivePay")) return;
		if(!_self.isDecimalRangeIn("partybOvertimePenalty")) return;
		_self.editContract();
	}
	
	this.editContract=function(){
		_jM.post("/bp/contract/saveContractEdit",$("#contractForm").serialize(),function(rs,data){
			alert("保存成功");
			//_self.readContract();
			if(_jM.IsPC()){
				window.location.href="/pc/contract/contract_read.html?cid="+_cid64;
			}else{
				window.location.href="/wap/contract/contract_read_wap.html?cid="+_cid64;
			}

		},function(rs){
			alert(rs.msg)
		})
	}
	
	this.readContract=function(){
		_jM.post("/bp/contract/getCustContractByCompetitiveId/"+_competive_id,null,function(rs,data){
			if(rs==null){
				return;
			}
			$("#contractid").val(data.id);
			
			$("#contractNo").val(data.contractNo);
			$("#partyaName").val(data.partyaName);
			$("#partybName").val(data.partybName);
			$("#projectName").val(data.projectName);
			$("#projectName1").val(data.projectName);
			
			$("#productDesign").val(data.productDesign);//设计要求
			$("#productMainFunc").val(data.productMainFunc);//软件的主要功能
			
			$("#firstEntrustRate").val(100-parseInt(data.competitiveNeedArrearsMaxRate));//1-最大欠款比例
			$("#competitiveNeedArrearsMaxRate").val(data.competitiveNeedArrearsMaxRate);//合同款最大欠款比例读取
			$("#developResult").val(data.developResult);//开发成果
			$("#partycPayRate").val(data.partycPayRate);//
			$("#competitiveServiceTimes").val(data.competitiveServiceTimes);//后期维护时间
			
			$("#deliveryMaterial").val(data.deliveryMaterial);//交付材料
			$("#deliveryWay").val(data.deliveryWay);//交付材料形式
			
			$("#acceptStandard").val(data.acceptStandard);//验收标准
			$("#acceptDeadline").val(data.acceptDeadline);//验收期限
			$("#acceptOvertime").val(data.acceptOvertime);//超时验收
			
			$("#competitivePay").val(data.competitivePay);//项目开发费用(阿拉伯)
			//$("#competitivePay").val(data.competitivePay);//项目开发费用(大写)
			a_to_c();
			
			$("#partybSecrecyDeadline").val(data.partybSecrecyDeadline);//保密期限
			
			//违约责任
			$("#penaltyRate").val(data.penaltyRate);//违约金比例
			$("#competitiveDepositRate").val(data.competitiveDepositRate);//项目押金比率
			$("#partybOvertime").val(data.partybOvertime);//乙方超时解约（天）
			$("#partybOvertimePenalty").val(data.partybOvertimePenalty);//乙方超时罚款（元/天）
			$("#competitiveDepositRate1").val(data.competitiveDepositRate);//项目押金比率
			$("#competitiveDepositRate2").val(data.competitiveDepositRate);//项目押金比率
			$("#partyaPenaltyRate").val(data.partyaPenaltyRate);//甲方违约金比例
			$("#partyaOvertime").val(data.partyaOvertime);//甲方超时解约（天）
			
			$("#partyaName1").val(data.partyaName);//甲方
			$("#partyaAddr").val(data.partyaAddr);//甲方地址
			$("#partyaDelegate").val(data.partyaDelegate);//甲方授权代表
			$("#partyaContactTel").val(data.partyaContactTel);//甲方联系电话
			$("#partyaSignTime").val(data.partyaSignTime);//甲方签订时间
			
			$("#partybName1").val(data.partybName);//乙方
			$("#partybAddr").val(data.partybAddr);//乙方地址
			$("#partybDelegate").val(data.partybDelegate);//乙方授权代表
			$("#partybContactTel").val(data.partybContactTel);//乙方联系电话
			$("#partybSignTime").val(data.partybSignTime);//乙方签订时间
			
			$("#thirdSignTime").val(data.thirdSignTime);//第三方签订时间
		},function(data){
			alert("获取失败");
		});
	}
	
	this.synchronization=function(value,className){
		$("."+className).val(value);
	}
	this.synchronizationRate=function(value,className,id){
		_self.hideToolTip();
		if(!_jM.validate.isNumberRangeIn(value,0,100)){
			//_self.showTip(id,"请填写有效数字（0到100）");
			if(_jM.IsPC()){
				_self.showTip(id,"请填写有效数字（0到100）");
			}else{
				alert("请填写有效数字（0到100）");
			}
			return ;
		}
		$("."+className).val(value);
	}
	this.ArrearsRate=function(flag){
		_self.hideToolTip();
		if(flag==1){
			var firstEntrustRate=$("#firstEntrustRate").val();
			if(!_self.vtRate("firstEntrustRate")) return;
			$("#competitiveNeedArrearsMaxRate").val(100-parseInt(firstEntrustRate));
		}
		if(flag==2){
			var competitiveNeedArrearsMaxRate=$("#competitiveNeedArrearsMaxRate").val();
			if(!_self.vtRate("competitiveNeedArrearsMaxRate")) return;
			$("#firstEntrustRate").val(100-parseInt(competitiveNeedArrearsMaxRate));
		}
	}
	
	//---validate-----
	this.vtRate=function(id){
		if(!_jM.validate.isNumberRangeIn($("#"+id).val(),0,100)){
			//_self.showTip(id,"请填写有效数字（0到100）");
			if(_jM.IsPC()){
				_self.showTip(id,"请填写有效数字（0到100）");
			}else{
				alert("请填写有效数字（0到100）");
			}
			//window.location.href="#"+id;
			return false;
		}
		return true;
	}
	
	this.vtNum=function(id){
		if(!_jM.validate.isNumberRangeIn($("#"+id).val(),0,9999999999)){
			//_self.showTip(id,"请填写有效整数,最大9999999999");
			if(_jM.IsPC()){
				_self.showTip(id,"请填写有效整数,最大9999999999");
			}else{
				alert("请填写有效整数,最大9999999999");
			}
			//window.location.href="#"+id;
			return false;
		}
		return true;
	}
	
	this.isDecimalRangeIn=function(id){
		if(!_jM.validate.isInteger($("#"+id).val(),0,99999999999.99)){
			//_self.showTip(id,"请填写有效数字，精确到小数点2位,99999999999.99");
			if(_jM.IsPC()){
				_self.showTip(id,"请填写有效数字，精确到小数点2位,99999999999.99");
			}else{
				alert("请填写有效数字，精确到小数点2位,99999999999.99");
			}
			//window.location.href="#"+id;
			return false;
		}
		return true;
	}
	
	this.hideToolTip=function(){
		_self.hideTip("competitiveNeedArrearsMaxRate");
		_self.hideTip("firstEntrustRate");
		_self.hideTip("competitiveDepositRate");
		_self.hideTip("competitiveDepositRate1");
		_self.hideTip("competitiveDepositRate2");
	}
	
	this.showTip=function(id,txt){
		$("#"+id).css("background","red");
		$("#"+id).focus();
		//alert(txt);
		$("#contractError").html(txt);
		if($("#isDialog").val()==0){
			$("#isDialog").val(1);
			_jM.dialog.show({width:300,height:120,dialogId:'contractErrorDialog'});
		}
		
	}
	this.hideTip=function(id){
		$("#"+id).css("background","#efefef");
	}
	this.keyIsEnter=function(){
		document.onkeydown=function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode==13){ // 按 Esc 
                return false;
             }
            return true;
        }; 
	}
}

function accusationClose(){
	$("#isDialog").val(0);
	_jM.dialog.hidden({dialogId:'contractErrorDialog'});
}

function a_to_c(){
	_ec.hideTip("competitivePay");
	var a=$("#competitivePay").val();
	var c=Arabia_to_Chinese(a,"competitivePay");
		$("#competitivePayUppercase").val(c);
}
           
