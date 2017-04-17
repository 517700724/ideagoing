$(document).ready(function(){
	var _rpf=new rpassfun();
	_rpf.init();
	$("#img1").css("background-color","#ff6600");
	$("#showPhone").val(null);
	$("#validateCode").val(null);
	$("#userPassword").val(null);
	$("#userPasswordConfirm").val(null);
})

var rpassfun=function(){
	var _self=this;
	var _ph="userphone";
	var _releaseHandler=null;
	
	this.init=function(){
		$("#doNextone").click(function(){
			_self.hideTip();
			_self.clicked("doNextone2","doNextone");
			_self.dNone();
		});
		$("#doNexttwo").click(function(){
			_self.hideTip();
			_self.clicked("doNexttwo3","doNexttwo");
			_self.dNtwo();
		});
		$("#doNextthree").click(function(){
			_self.hideTip();
			_self.clicked("doNextthree2","doNextthree");
			_self.dNthree();
		});
		$("#getCode1").click(function(){
			_self.hideTip();
			_self.getCode();
		});
		$("#doNexttwo2").click(function(){
			_self.hideTip();
			if(!_self.vtCode()) return;
			_jM.tooltip.showTip("validateCode","校验码错误");
		});
		
		$("#showPhone").focus(function(){
			_self.hideTip();
		});
		$("#validateCode").focus(function(){
			_self.hideTip();
		});
		$("#userPassword").focus(function(){
			_self.hideTip();
		});
		$("#userPasswordConfirm").focus(function(){
			_self.hideTip();
		});
	}
	
	this.clicked=function(ids,idh){
		$("#"+ids).show();
		$("#"+idh).hide();
	}
	
	this.hideTip=function(){
		_jM.tooltip.hideTip("showPhone");
		_jM.tooltip.hideTip("validateCode");
		_jM.tooltip.hideTip("userPassword");
		_jM.tooltip.hideTip("userPasswordConfirm");
	}
	
	this.dNone=function(){
		if(!_self.vtSp()) return;
		var _phone=$("#showPhone").val();
		$.post('/bp/custBase/checkIsLoginNameExist?custName='+_phone,null,function(data){
			if(!data.success){
				$("#"+_ph).val(_phone.trim());
				$("#step_one").hide();
				$("#step_two").show();
				$("#img2").css("background-color","#ff6600");
			}else{
				_jM.tooltip.showTip("showPhone","手机号码不存在");
			}
			_self.clicked("doNextone","doNextone2");
		});
	}
	
	this.vtSp=function(){
		if(_jM.validate.isEmpty($("#showPhone").val())){
			_self.hideTip();
			_jM.tooltip.showTip("showPhone","手机号码不能为空");
			_self.clicked("doNextone","doNextone2");
			return false;
		}
		if(!_jM.validate.isMobile($("#showPhone").val())){
			_self.hideTip();
			_jM.tooltip.showTip("showPhone","手机号码格式有误");
			_self.clicked("doNextone","doNextone2");
			return false;
		}
		return true;
	}
	
	this.dNtwo=function(){
		if(!_self.vtCode()) return;
		var _phone=$("#"+_ph).val();
		var validateCode = $("#validateCode").val().trim();
		$.post('/bp/custBase/chechVerificationCode?phone=' + _phone + '&validateCode=' + validateCode,null,function(data){
			if(data.success){
				$("#step_two").hide();
				$("#step_three").show();
				$("#img3").css("background-color","#ff6600");
			}else{
				_jM.tooltip.showTip("validateCode","校验码错误");
			}
			_self.clicked("doNexttwo","doNexttwo3");
		});
	}
	
	this.getCode=function(){
		var _phone=$("#"+_ph).val();
		if(_jM.validate.isEmpty(_phone)){
			alert("您已超时");
			window.location.href="/login/password.html";
		}
		$("#getCode1").hide();
		$("#getCode2").show();
		_releaseTime =60;
		$("#getCode2").html("剩余"+_releaseTime+"秒");

		_releaseHandler= _jM.timer.start({time:1000,callback:function(){
			if(_releaseTime>0){
				_releaseTime--;
				$("#getCode2").html("剩余"+_releaseTime+"秒");
			}else{
				_jM.timer.stop({timeHandler:_releaseHandler});
				$("#getCode2").html("获取验证码");
				$("#getCode2").hide();
				$("#getCode1").show();
				_releaseHandler=null;
			}
		}});

		$.post("/bp/custBase/verificationCode?phone=" + _phone, null, function (data) {
			console.log(data.success);
			if(!data.success){
				_self.hideTip();
				_jM.tooltip.showTip("getCode2","验证码发送失败，请重试"); 
				_jM.timer.stop({timeHandler:_releaseHandler});
				$("#getCode2").html("获取验证码");
				$("#getCode2").hide();
				$("#getCode1").show();
				_releaseHandler=null;
			}else{
				$("#doNexttwo2").hide();
				$("#doNexttwo").show();
			}
		});
	}
	
	this.vtCode=function(){
		if(_jM.validate.isEmpty($("#validateCode").val())){
			_self.hideTip();
			_jM.tooltip.showTip("validateCode","校验码不能为空");
			_self.clicked("doNexttwo","doNexttwo3");
			return false;
		}
		return true;
	}
	
	this.dNthree=function(){
		if(!_self.vtPass()) return;
		var _password = $("#userPassword").val(); 
		var _phone=$("#"+_ph).val();
		$.post("/bp/custBase/pwdUpdate",{custName:_phone,password:_password}, function (data) {
			if(data.success){
				$("#step_three").hide();
				$("#step_four").show();
				$("#img4").css("background-color","#ff6600");
			}else{
				_jM.tooltip.showTip("doNextthree","密码修改失败");
			}
			_self.clicked("doNextthree","doNextthree2");
		});
	}
	
	this.vtPass=function(){
		
		if(_jM.validate.isEmpty($("#userPassword").val())){
			_self.hideTip();
			_jM.tooltip.showTip("userPassword","新密码不能为空");
			_self.clicked("doNextthree","doNextthree2");
			return false;
		}
		if(!_jM.validate.isLengthBetween($("#userPassword").val(),6, 24)){
			_self.hideTip();
			_jM.tooltip.showTip("userPassword","密码长度必须在6-24位之间");
			_self.clicked("doNextthree","doNextthree2");
			return false ;
		}
		if(_jM.validate.isEmpty($("#userPasswordConfirm").val())){
			_self.hideTip();
			_jM.tooltip.showTip("userPasswordConfirm","确认密码不能为空");
			_self.clicked("doNextthree","doNextthree2");
			return false;
		}
//		if(!_jM.validate.isLengthBetween($("#userPasswordConfirm").val(),6, 24)){
//			_self.hideTip();
//			_jM.tooltip.showTip("userPasswordConfirm","确认密码长度必须在6-24位之间");
//			_self.clicked("doNextthree","doNextthree2");
//			return false ;
//		}
		if($("#userPassword").val()!=$("#userPasswordConfirm").val()){
			_self.hideTip();
			_jM.tooltip.showTip("userPasswordConfirm","确认密码和新密码不一致");
			_self.clicked("doNextthree","doNextthree2");
			return false;
		}
		return true;
	}
}