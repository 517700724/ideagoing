var _rc=null;
var _b64 = new Base64();
var _competive_id = null;
var _cid64=null;
$(document).ready(function(){
	//wap
	var JSESSIONID =_jM.getParam("JSESSIONID");
	if(_jM.validate.isNotEmpty(JSESSIONID)){
		_jM.setCookie("JSESSIONID", JSESSIONID, 1/144,"/bp/");
	}
	

	parent._jM.dialog.hideClose();
	_rc=new readContract();
	_rc.init();
	$("input").attr("disabled","disabled");
});

function readContract(){
	var _self=this;
	
	this.init=function(){
		_cid64=_jM.getParam("cid");
		_competive_id=_b64.decode(_cid64);
		
		
		
		$("#edit_btn").click(function(){
			if(_jM.IsPC()){
				window.location.href="/pc/contract/contract_edit.html?cid="+_cid64;
			}else{
				window.location.href="/wap/contract/contract_edit_wap.html?cid="+_cid64;
			}
		});
		_self.readContract();
		_self.checkCanAgree();
		if(!_jM.IsPC()){
			_self.contractStatus();
		}
		
		$("#invitionContract").click(function(){//邀请签署合同
			_jM.post("/bp/contract/submitContract",{contractId:$("#contractid").val()},function(rs,data){
			
					if(_jM.IsPC()){
						alert("邀请成功");
						_self.backCenter();
					}else{
						alert("邀请成功");
						$(".edit_top").hide();
						$(".joinBtn").hide();
						window.location.reload();
					}
				
			},function(rs){
				if(rs.errCode==-1){
					alert("对方已更新合同，请查看");
					_self.readContract();
				}
				if(rs.errCode==null){
					alert(rs.msg);
				}
			})

		});
		$("#cancelInvition").click(function(){//取消
			if(_jM.IsPC()){
				_self.backCenter();
			}else{
				
			}
		});
		$("#agreeContract").click(function(){
			_jM.post("/bp/contract/agreeContract",{contractId:$("#contractid").val()},function(rs,data){
				if(_jM.IsPC()){
					parent._jM.dialog.hiddenModeDialogPc("doContractContainer");
				}else{
					alert("保存成功");
					$("#agreeContract").hide();
					window.location.reload();
				}

			},function(rs){
				alert(rs.msg);
			});
		});
		$("#waitAgree").click(function(){
			parent._jM.dialog.hiddenModeDialogPc("doContractContainer");
		});
	}
	
	this.checkCanAgree=function(){
		_jM.post("/bp/contract/checkCanAgree/"+_competive_id,null,function(rs,data){
			if(data==1){
				if(_jM.IsPC()){
					$("#cancelInvition").css("margin-left","0px");
				}
				$("#agreeContract").show();
				$("#invitionContract").hide();
				$("#edit_btn").hide();
			}
			if(_jM.IsPC()){
				if($("#agreeContract").css("display")=="none"&&$("#invitionContract").css("display")=="none"){
					$("#cancelInvition").css("margin-left","103px");
				}else{
					$("#cancelInvition").css("margin-left","0px");
				}
			}
			
			/*if(!_jM.IsPC()){
				if($("#invitionContract").css("display")=="none"&&$("#agreeContract").css("display")=="none"){
					$("#invitionContracts").show();
				}else{
					$("#invitionContracts").hide();
				}
			}*/
			
		},function(rs){
			
		});
	}
	
	this.contractStatus=function(){
		_jM.post("/bp/contract/getContractOverview/"+_competive_id,null,function(rs,data){
			$.post("/bp/user/getUser",null,function(rs){
				if(rs.data.custId==data.partyAId){
					if(data.contractAStatus==1&&(data.contractBStatus==2||data.contractBStatus==0)){
						//等待签署
						$("#invitionContracts").show();
					}else if(data.contractBStatus==4){
						//等待签署
						$("#invitionContracts").html("爱迪狗平台撮合中-待同意");
						$("#invitionContracts").show();
					}else{
						$("#invitionContracts").hide();
					}
				}else{
					if(data.contractBStatus==1&&(data.contractAStatus==2||data.contractAStatus==0)){
						//等待签署
						$("#invitionContracts").show();
					}else if(data.contractAStatus==4){
						//等待签署
						$("#invitionContracts").html("爱迪狗平台撮合中-待同意");
						$("#invitionContracts").show();
					}else{
						$("#invitionContracts").hide();
					}
				}
				
			});
			
		},function(data){
			//alert(rs.msg);
		});
	}
	
	this.readContract=function(){
		_jM.post("/bp/contract/getCustContractByCompetitiveId/"+_competive_id,null,function(rs,data){
			if(rs==null){
				return;
			}
			
			if(data.status!=0){
				$("#edit_btn").hide();
				$("#invitionContract").hide();

				if(_jM.IsPC()){
					$("#cancelInvition").css("margin-left","103px");
				}
			}

			
		
			
			if(_jM.IsPC()){
				if($("#agreeContract").css("display")=="none"&&$("#invitionContract").css("display")=="none"){
					$("#cancelInvition").css("margin-left","103px");
				}else{
					$("#cancelInvition").css("margin-left","0px");
				}
			}
			
			$("#contractid").val(data.id);
			
			$("#contractNo").val(data.contractNo);
			$("#partyaName").val(data.partyaName);
			$("#partybName").val(data.partybName);
			$("#projectName").val(data.projectName);
			$("#projectName1").val(data.projectName);
			
			$("#productDesign").html((data.productDesign).replace(/\r|\n/g,"</p><p>"));//设计要求  需求详情
			$("#productMainFunc").html(_self.isNull(data.productMainFunc));//软件的主要功能
			
			$("#firstEntrustRate").val(100-parseInt(data.competitiveNeedArrearsMaxRate));//1-最大欠款比例
			$("#competitiveNeedArrearsMaxRate").val(data.competitiveNeedArrearsMaxRate);//合同款最大欠款比例读取			
			$("#developResult").html((_self.isNull(data.developResult)).replace(/\r|\n/g,"</p><p>"));//开发成果  竞标详情
			
			$("#partycPayRate").val(data.partycPayRate);//
			$("#competitiveServiceTimes").val(data.competitiveServiceTimes);//后期维护时间
			
			$("#deliveryMaterial").html((data.deliveryMaterial).replace(/\r|\n/g,"</p><p>"));//交付材料
			$("#deliveryWay").val(data.deliveryWay);//交付材料形式
			
			$("#acceptStandard").html(_self.isNull(data.acceptStandard));//验收标准
			$("#acceptDeadline").val(data.acceptDeadline);//验收期限
			$("#acceptOvertime").val(data.acceptOvertime);//超时验收
			
			$("#competitivePay").val(data.competitivePay);//项目开发费用(阿拉伯)
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
			alert("合同内容获取失败");
		});
	}
	this.isNull=function(val){
		
		if(_jM.validate.isEmpty(val)){
			return "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;";
		}
		return val;
	}
	
	this.backCenter=function(){
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
	}
}

function a_to_c(){
	_jM.tooltip.hideTip("competitivePay");
	var a=$("#competitivePay").val();
	var c=Arabia_to_Chinese(a,"competitivePay");
		$("#competitivePayUppercase").val(c);
}

