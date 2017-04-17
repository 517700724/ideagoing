var reg=null;
$(document).ready(function(){
	$.post('/bp/custBase/genCid',null,function(rs){
		_jM.setCookie('CUST_COOKIE_ID', rs);
	});
	reg=new register();
	reg.init();
});

function register(){
	var _self=this;
	
	var _releaseTime = 0;
	var _releaseHandler = null;
	var _validatePhone = null;
	var _flagExit=true;
	
	this.init=function(){
		$("#quick_recurit").click(function(){
			parent._jM.dialog.showModeDialog({
				id:"quickrepublic",
				width:608,
				height:477,
				url:"/pc/project/recruit/need_register_box.html",
				outlineStyle:'border:0px;background-color:#FAFAFA'
			});
			parent._jM.dialog.hiddenModeDialog("registerContainer");
		});
		/*-----------custBusinessType----------------*/
//		$("#serSelect").click(function(){
//			$("#serSelect").attr("src","/pc/public/image/selected.png");
//			$("#needSelect").attr("src","/pc/public/image/unselect.png");
//			
//			$("#serSelect").attr("sval","0");
//			$("#needSelect").attr("sval","1");
//		});
		_jM.selectimg.myradio("serSelect","needSelect","serval","0");
//		
//		$("#needSelect").click(function(){
//			$("#serSelect").attr("src","/pc/public/image/unselect.png");
//			$("#needSelect").attr("src","/pc/public/image/selected.png");
//			
//			$("#serSelect").attr("sval","1");
//			$("#needSelect").attr("sval","0");
//		});
		_jM.selectimg.myradio("needSelect","serSelect","serval","1");
		/*-----------custType----------------*/
//		$("#indiSelect").click(function(){
//			$("#indiSelect").attr("src","/pc/public/image/selected.png");
//			$("#enterSelect").attr("src","/pc/public/image/unselect.png");
//			
//			$("#indiSelect").attr("sval","1");
//			$("#enterSelect").attr("sval","2");
//		});
		_jM.selectimg.myradio("indiSelect","enterSelect","custval","1");
//		$("#enterSelect").click(function(){
//			$("#indiSelect").attr("src","/pc/public/image/unselect.png");
//			$("#enterSelect").attr("src","/pc/public/image/selected.png");
//			
//			$("#indiSelect").attr("sval","2");
//			$("#enterSelect").attr("sval","1");
//		});
		_jM.selectimg.myradio("enterSelect","indiSelect","custval","2");
		/*-----------协议----------------*/
//		$("#xyselect").click(function(){
//			var okval=$("#xyselect").attr("okval");
//			if(okval==0){
//				$("#xyselect").attr("src","/pc/public/image/selected.png");	
//				$("#xyselect").attr("okval","1");
//			}else if(okval==1){
//				$("#xyselect").attr("src","/pc/public/image/unselect.png");
//				$("#xyselect").attr("okval","0");
//			}
//		});
		_jM.selectimg.mycheckbox("xyselect","xyval","1","0");
		
		$("#submitButton").click(function(){
			_self.validation();
		});
		
		$(".getMsg").click(function(){
			_self.getPhoneCode();
		});
	}
	
	this.validation=function(){
		if(!_self.vtUserName()) return;
		if(!_self.vtPassWord()) return;
		if(!_self.vtPassWord2()) return;
		if(!_self.vtSubpassword()) return;
		if(!_self.vtValidateCode()) return;
		if(!_self.vtInvitationCode()) return;
		if(!_self.vtXieYi()) return;
		
		_self.chechPhoneCode();
	}
	this.getPhoneCode=function(){
		_self.checkPhoneExist();
		if(!_flagExit) return;
		if(!_self.vtUserName()) return;
		if(!_self.vtPassWord()) return;
		if(!_self.vtPassWord2()) return;
		if(!_self.vtSubpassword()) return;
		
		if(_releaseHandler!=null)return;
		_validatePhone= $("#phone").val();
		_releaseTime =180;
		
		$(".getMsg").hide();
		$(".getMsg_sms").show();
		$(".getMsg_sms").html("剩余"+_releaseTime+"秒");
		
		_releaseHandler= _jM.timer.start({time:1000,callback:function(){
			if(_releaseTime>0){
				_releaseTime--;
				$(".getMsg_sms").html("剩余"+_releaseTime+"秒");
			}else{
				_jM.timer.stop({timeHandler:_releaseHandler});
				$(".getMsg_sms").html("获取短信验证码");
				$(".getMsg").show();
				$(".getMsg_sms").hide();
				_releaseHandler=null;
			}
		}});
		
		$.ajax({ url:'/bp/custBase/verificationCode', type:"post", dataType:"json", data:{phone:$("#phone").val(),checkcode:"",areaCode:""},
			　 　success: function(result){
					if(!result.success){
						show(v,result.msg); 
						_jM.timer.stop({timeHandler:_releaseHandler});
						$(".getMsg_sms").html("获取短信验证码");
						$(".getMsg").show();
						$(".getMsg_sms").hide();
						_releaseHandler=null;
					}
				},
				error:function(){show(v,"验证码发送失败，请重试");}
		　  });
		
	}
	
	
	this.submitData=function(){
		if($("#phone").val()!=_validatePhone){
			$("#errortxt").html("获取短信的手机号与您注册的手机号不一致");
			return;
		}
		_self.checkPhoneExist(function(){
			var subData={
				phone:$("#phone").val(),
				password:$("#password").val(),
				validateCode:$("#validateCode").val(),
				invitationCode:$("#invitationCode").val().trim(),
				custType:$("#custval").val(),
				custRoleType:$("#serval").val(),
				areaCode:$("#areaCode").val(),
				username:$("#phone").val(),
				password:$("#password").val(),
				checkcode:null
			}
			$.ajax({ url:'/bp/custBase/registeredsave', type:"post", dataType:"json", data:subData,
			　 　success: function(result){
				 	if(result.success){
						
						var _regType = result.data;
				 		$.ajax({ url:'/bp/user/loginNoCheckCode', type:"post", dataType:"json", data:{},
				 		　 　success: function(result){
				 				if(result.success){
				 					if(window.parent){
				 						window.parent.location.href="/login/register_successful.html?_regType="+_regType;
				 					}else{
				 						window.location.href="/login/register_successful.html?_regType="+_regType;
				 					}
				 				}			
				 			},
				 			error:function(){
				 				if(window.parent){
				 					window.parent.location.href="/login/register_successful.html";
				 				}else{
				 					window.location.href="/login/register_successful.html";
				 				}
				 			}
				 	　  });
				 	}else{
				 		$("#errortxt").html(result.msg);
				 	}
				 },
				error:function(){
					$("#errortxt").html("注册失败，请重试");
					}
		　  });
		});
	}
	
	this.vtUserName=function(){//手机号码验证
		if(_jM.validate.isEmpty($("#phone").val())){
			$("#errortxt").html("手机号码不能为空");
			return false;
		}
		return true;
	}
	
	this.vtPassWord=function(){//密码验证
		if(_jM.validate.isEmpty($("#password").val())){
			$("#errortxt").html("密码不能为空");
			return false;
		}
		return true;
	}
	
	this.vtPassWord2=function(){//密码验证2
		if(_jM.validate.isEmpty($("#passsword2").val())){
			$("#errortxt").html("确认密码不能为空");
			return false;
		}
		return true;
	}
	
	this.vtSubpassword=function(){//验证密码的一致性
		if($("#password").val()!=$("#passsword2").val()){
			$("#errortxt").html("");
			$("#passsword2").val(null);
			$("#passsword2").attr("placeholder","密码错误");
			return false;
		}
		return true;
	}
	
	this.vtXieYi=function(){//协议
		var okval=$("#xyselect").attr("okval");
		if(okval==0){
			$("#errortxt").html("请同意阅读协议");
			return false;
		}
		return true; 
	}
	
	this.vtInvitationCode=function(){//推荐码
		if(isNaN($("#invitationCode").val())){
			$("#errortxt").html("推荐码为纯数字组合");
			return false;
		}
		return true;
	}
	
	this.vtValidateCode=function(){//验证码
		if (_jM.validate.isEmpty($("#validateCode").val())){
			$("#errortxt").html("请填写短信验证码");
			return false 
		};
		return true;
	}
	
	this.vtInvitationCode=function(){//推荐码
		if(isNaN($("#invitationCode").val())){
			$("#errortxt").html("推荐码为纯数字组合")
			return false;
		}
		return true;
	}
	
	
	this.chechPhoneCode=function(){
		$.ajax({ url:'/bp/custBase/chechVerificationCode', type:"post", dataType:"json", data:{phone:$("#phone").val(),validateCode:$("#validateCode").val()},
			success: function(result){
				if(result.success){
					_self.submitData()
				}else{
					$("#errortxt").html("短信验证码不不正确");
				};
		    },
		    error:function(){
			   $("#errortxt").html("短信验证码校验失败，请重试");
		    }
	　  	});
	}
	this.checkPhoneExist=function(callback){
		if(_jM.validate.isEmpty($("#phone").val()))return;
		if(!_jM.validate.isLengthBetween($("#phone").val(),11,11))return;

		$.ajax({ url:'/bp/custBase/checkIsLoginNameExist', type:"post", dataType:"json", data:{custName:$("#phone").val()},
		　 　success: function(result){
				if(!result.success){
					_flagExit=false;
					$("#errortxt").html("该手机号码已经注册");
				}else{
					if(callback!=null){
						callback();
					}
				}
			}
	　  });
	}
	
}

function hiddenAreaCodeList(){
	_jM.dropMenu.hidden({menuId:'areaCodeList'});
}
function areaCodeItemClick(v){
	$("#areaCode").val(v);
	hiddenAreaCodeList();
}
