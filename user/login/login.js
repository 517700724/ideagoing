var login=null;
$(document).ready(function(){
	    login=new Login();
		login.init();
});

function Login(){
	var _self=this;
	var _validateCode =false;
	
	this.init=function(){
		$(".registerLink").click(function(){
			
			var backURL="/pc/project/recruit/recruit_select.html";
			parent._jM.dialog.showModeDialog({
				id:"registerContainer",
				height:564,
				width:540,
				url:"/pc/user/register/register.html?backURL="+backURL
			});
			
			parent._jM.dialog.hiddenModeDialog("loginContainer");
		});
		
		$("#quick_recurit").click(function(){
			parent._jM.dialog.showModeDialog({
				width:608,
				height:477,
				url:"/pc/project/recruit/need_register_box.html",
				outlineStyle:'border:0px;background-color:#FAFAFA'
			});
			
			parent._jM.dialog.hiddenModeDialog("loginContainer");
		});
		
		$("#password").keypress(function(e){
			if(e.keyCode==13){
				_self.validation();
			}
		});
		
		/*-----------记住密码----------------*/
		$("#remember").click(function(){
			var okval=$("#remember").attr("okval");
			if(okval==0){
				$("#remember").attr("src","/pc/public/image/selected.png");	
				$("#remember").attr("okval","1");
			}else if(okval==1){
				$("#remember").attr("src","/pc/public/image/unselect.png");
				$("#remember").attr("okval","0");
			}
		});
		
		$("#loginButton").click(function(){
			_self.validation();
		});
	}
	
	this.validation=function(){
		if(!_self.vtUserName()) return;
		if(!_self.vtPassWord()) return;
		if(_validateCode){if(!root.vtImgCode()) return;}

		_self.submitData();
	}
	
	this.submitData=function(){
		var subData={
			username:$("#userName").val(),
			password:$("#password").val(),
			checkcode:_validateCode?$("#imgcode").val():""
		}
		$.ajax({ url:'/bp/user/login', type:"post", dataType:"json", data:subData,
			success: function(result){
				
				if(result.success){
					var ischeck=false;
					if($("#remember").attr("okval")==1){
						ischeck=true;
					}
					if(ischeck){
						_jM.setCookie('user_name', $("#userName").val(), ischeck?7:0);
					}
					
					var backURL = _jM.getParam("backURL");
					if(_jM.validate.isEmpty(backURL)){
						if(window.parent){
							backURL =  decodeURIComponent(window.parent._jM.getParam("backURL"));
						}
						if(_jM.validate.isEmpty(backURL) || backURL=="null"){
							backURL = "/pc/index.html";
						}
					}
					if(window.parent){
						window.parent.location.href= backURL;
					}else{
						window.location.href= backURL;
					}
					
				}else{
					_self.showValidateCode();
					$("#errortxt").html(result.msg);
				}
			},
			error:function(){
				$("#errortxt").html("登录失败，请重试");
			}
		});
		
		var times = _jM.getCookie("user_login_times");
		times = times == null? 0: parseInt(times);
		times+=1;
		_jM.setCookie("user_login_times", times, 1/144);
	}
	
	this.vtUserName=function(){//用户名验证
		if(_jM.validate.isEmpty($("#userName").val())){
			$("#errortxt").html("用户名不能为空");
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
	
	this.vtImgCode=function(){//图片验证
		if(_jM.validate.isEmpty($("#imgcode").val())){
			$("#errortxt").html("图片验证码不能为空");
			return false;
		}
		return true;
	}
	
	this.showValidateCode = function(){
		if(_validateCode)return;

		var times = _jM.getCookie("user_login_times");
		if(times != null && parseInt(times)>3){

			$("#validateCode_div").html("<input type='text' style=' margin-left: 80px;width:110px;height:20px;margin-top:10px;border:1px solid #e3e3e3;border-radius:5px' id='imgcode' placeholder='验证码'/>"+
			"<img src='/bp/drawImage/writeImage?phone="+$("#userName").val()+"' style='margin-top:10px;float:right;margin-right:80px;' onclick='changeImg(this,\"n1\")' title='验证码看不清，换一张' id='validateCodeImg'/>");
			
			_validateCode = true;
			
			imgCode = $('#imgcode');
			imgCode.keypress(function(e){
				if(e.keyCode==13){root.validation();}
			});
		}
	}
	
}

function rPassword(){
	window.parent.location.href="/login/password.html";
}

function changeImg(obj,createTypeFlag){	
	var phone = $("#userName").val();
	if(_jM.validate.isEmpty(phone)){
		$("#errortxt").html("手机号码不能为空");
	}else{
		document.getElementById(obj.id).src="/bp/drawImage/writeImage?createTypeFlag="+createTypeFlag+"&"+Math.random()+"&phone=" + phone;
	}
}