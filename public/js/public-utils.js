//var baseURL="/";
var _jM = new jModule();

$(document).ready(function(){
	_jM.login.init();
});

//****************************************************************************
function jModule(){};

jModule.prototype.IsPC=function(){//is pc
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

jModule.prototype.cate={
		/**
		 * get level2 cate list
		 */
		getL2cateList:function(firstId){
			var secondList=null;
			for(var i=0; i<_categoryList.length; i++){
				if(_categoryList[i].id==firstId){
					secondList=_categoryList[i].children;
				}
			}
			return secondList;
		},
		/**
		 * get level3 cate list
		 */
		getL3cateList:function(firstId,secondId){
			var secondList=_jM.cate.getL2cateList(firstId);
			var thirdList=null;
			if(secondList!=null){
				for(var i=0; i<secondList.length; i++){
					if(secondList[i].id==secondId){
						thirdList=secondList[i].children;
					}
				}
			}
			return thirdList;
		}
}

jModule.prototype.selectimg={
		mycheckbox:function(sid,sval,yseval,noval){
			$("#"+sid).click(function(){
				if(sid=="agreeRules"){
					_jM.tooltip.hideTip("agreeRules");
				}
				var yesvalue=$("#"+sval).val();
				if(yesvalue==noval){
					$("#"+sid).attr("src","/pc/public/image/selected.png");
					$("#"+sval).val(yseval);
				}else{
					$("#"+sid).attr("src","/pc/public/image/unselect.png");
					$("#"+sval).val(noval);
				}
			});
		},
	
		setSelected:function(sid,valname,val,yseval,noval){
			if(val==1){
				$("#"+sid).attr("src","/pc/public/image/selected.png");
				$("#"+valname).val(yseval);
			}else{
				$("#"+sid).attr("src","/pc/public/image/unselect.png");
				$("#"+valname).val(noval);
			}
		},
		
		myradio:function(clickid,bid,rvalname,rval){
			$("#"+clickid).click(function(){
				_jM.selectimg.setRadio(clickid,bid,rvalname,rval);
			});
		},
		
		setRadio:function(clickid,bid,rvalname,rval){
			$("#"+clickid).attr("src","/pc/public/image/selected.png");
			$("#"+bid).attr("src","/pc/public/image/unselect.png");
			$("#"+rvalname).val(rval);
		}
}

jModule.prototype.ideagoing = {
		//Get default photo
		getDefaultPhoto : function(custImage, custType){
			return _jM.validate.isNotEmpty(custImage)?custImage
					:(custType == 2?"/statics/public/image/default-enterprise.png"
							:"/statics/public/image/default-boy.png");
		},
		
		//Get upload attachment list by attachment string.
		getUploadAttachmentList : function(attachment){
			if(_jM.validate.isNotEmpty(attachment)){
				var attachList = attachment.split("|");
				var resultList = new Array();
				
				if(attachList != null && attachList.length>0){
					for(var i=0; i<attachList.length; i++){
						if(_jM.validate.isEmpty(attachList[i])){
							continue;
						}
						var attList = attachList[i].split("*");
						resultList[resultList.length]={"imgURL":attList[1],"imgText":attList[0]};
					}
				}
				return resultList;
			}
			return null;
		} 
	}

jModule.prototype.login = {
	user:null,
	go: function(url){
		var backURL = _jM.validate.isEmpty(url)?
				(window.parent?window.parent.location.href:window.location.href):url;
		backURL = encodeURIComponent(backURL);
		if(window.parent){
			window.parent.location.href="/login/login.html?backURL="+backURL;
		}else{
			window.location.href="/login/login.html?backURL="+backURL;
		}
	},
	logout:function(){
		$.post("/bp/user/logout", null, function(data){
			if(data.success){
				_jM.login.go(null);
			}
		});
	},
	getLogin:function(loginSuccess, loginFailed){
		$.post("/bp/user/isLogin", null, function(data){
			if(!data.success && data.errCode == "01"){
				if(loginFailed != null){
					loginFailed(data);
				}
			}else{
				if(loginSuccess != null){
					loginSuccess(data.data);
				}
			}
		});
	},
	isLogin:function(){
		_jM.post("/bp/user/isLogin", null, function(rs, data){});
	},
	initHeader:function(){
		if($(".first").length>0){
			_jM.iframe$getElement({
				url:"/pc/public/header/header.html", 
				success:function(html){
					$(".first").html(html);
					
					if(typeof(headOnload)!="undefined"){
						headOnload();
					}
					
					$.post("/bp/user/getUser", null, function(data){
						if(data.success){
							_jM.login.user = data.data;
							var _showNickName=_jM.login.user.custNickName;
							
							$(".inx_top_btns").remove();
							$(".inx_top_menu").css("display","block");
							$(".inx_account_img").attr("src",_jM.validate.isEmpty(_jM.login.user.custImage)
									?"/statics/index/image/inx_photo.png":_jM.login.user.custImage);
							//$(".header_home_ul").append("<li><span style='color:#ff6600;'>"+ _showNickName+"</span> 您好，<a href='javascript:void(0)' onclick='_jM.login.logout()'>退出</a></li>");
							if(_jM.validate.isEmpty(_jM.login.user.custURL)){
								$("#zoneItem_personal").hide();
							}
							var noRead=0;
//							_jM.post('/bp/custMessage/list',null,function(data,dData){
//								var mesList=dData.rows;
//								for(var i in mesList){
//									var obj=mesList[i];
//									var mesStatu=obj.messageStatus;
//									if(mesStatu==1){
//										noRead++;
//									}
//								}
//								if(noRead==0){
//									noRead="";
//								}
//								$("#msgNum1").html(noRead)
//								$("#msgNum2").html(noRead)
//								$("#msgNum3").html(noRead)
//							});
						}
					});
				}
			});
		}
	},
	init:function(){
		_jM.login.initHeader();
		if($(".last").length>0){
			_jM.iframe$getElement({
				url:"/pc/public/footer/footer.html", 
				success:function(html){
					$(".last").html(html);
				}
			});
		}
	}
}

//Set cookie
jModule.prototype.setCookie = function(name,value, days,path){
	var Days = days;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ encodeURIComponent(value) + ";expires=" + exp.toGMTString()+";path="+path;
}

//Get cookies
jModule.prototype.getCookie = function(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return decodeURIComponent(arr[2]);
	else
		return null;
} 

//Get param.
jModule.prototype.getParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r!= null) return unescape(r[2]); return null;
}
//Get parent param.
jModule.prototype.getParentParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.parent.location.search.substr(1).match(reg);
	if (r!= null) return unescape(r[2]); return null;
}
//Get mark
jModule.prototype.getMark = function(name) {
	var reg = new RegExp("^" + name + "=([^&]*)$");
	var r = window.location.hash.substr(1).match(reg);
	if (r!= null) return unescape(r[1]); return null;
}

jModule.prototype.iframe$getElement = function(p){
	if(p == null || p.url == null){
		alert("Url can not be null!");
	}

	var _eleme = p.element == null ? "body" : p.element;
	var _frame = $("<iframe style='display:none' src='"+ p.url +"'></iframe>");
		_frame.prependTo("body");

		_frame.load(function(){
			var html = _frame.contents().find(_eleme).first().html();
			//Call back.
			if(p.success != null){
				p.success(html);
			}
			_frame.remove();
		});
};

jModule.prototype.iframe$getFrameHeight = function(id){
	var f= document.getElementById(id).contentWindow;
	if(f != null && f.document.body != null) {
		var h = f.document.body.scrollHeight;
		return h;
	}
	return 0;
};

jModule.prototype.tooltip = {
	show : function (p){
		var id = p.id;
		var text = (typeof(p.tip)=="undefined" || p.tip==null)?"请输入提示信息！":p.tip;
		var _top = (typeof(p.top)=="undefined" || p.top==null)? 0 : p.top;
		var _left= (typeof(p.left)=="undefined" || p.left==null)? 0 : p.left;

		var tip=$("<div id='"+id+"_tip' class='cls_tool_tip' style='display:block;position:absolute;z-index:99;height:30px;'><div style='background-color:#FFE6E7;border:1px solid #ff3b2f;padding:5px 10px 5px 10px;font-size:12px;font-weight:normal;'>"+text+"</div><img style='float:left;margin-left:10px;' src='/statics/public/image/down.png'/></div>");
			tip.prependTo("body");
			tip.css("top",$("#"+id).offset().top + _top);
			tip.css("left",$("#"+id).offset().left + _left);
			tip.css("display","block");
		return tip;
	},
	
	showTip:function(id,txt){ 
		_jM.tooltip.show({
			id:id,
			top:-35,
			tip:txt
		});
	},
	
	hideTip:function(id){ 
		_jM.tooltip.hidden({id:id});
	},
	hidden : function(p){
		var id = p.id +"_tip";
		$("#"+id).remove();
	}
};

jModule.prototype.dropMenu = {
	show : function(p){
		var id     = p.showId;
		var menuId = p.menuId;
		var _top   = (typeof(p.top)=="undefined" || p.top==null)? 0 : p.top;
		var _left  = (typeof(p.left)=="undefined" || p.left==null)? 0 : p.left;

		$("#"+menuId).css("position","absolute");
		$("#"+menuId).css("z-index","98");
		$("#"+menuId).css("display","block");
		$("#"+menuId).css("top",$("#"+id).offset().top + _top);
		$("#"+menuId).css("left",$("#"+id).offset().left + _left);
		$("#"+menuId).hover(null, function(){
			$("#"+menuId).css('display','none');
			if(p.hide!=null){
				p.hide();
			}
        });
		
		if(p.show!=null){
			p.show();
		}
	},
	hidden:function(p){
		var menuId = p.menuId;
		$("#"+menuId).css('display','none');
		if(p.hidden!=null){
			p.hidden();
		}
	}
};

jModule.prototype.dialog = {
	iFrameHeight :function(divId) {  
			var ifm= document.getElementById("dialogFrame");   
			var subWeb = document.frames ? document.frames["dialogFrame"].document : ifm.contentDocument;   
			
			var winHeight = 0;
			if (subWeb.innerHeight){
				winHeight = subWeb.innerHeight;
			}else if((subWeb.body) && (subWeb.body.clientHeight)){
				winHeight = subWeb.body.clientHeight;
			}
			
			if(ifm != null && subWeb != null) {
			   ifm.height = winHeight;
			   $(divId).css("height",winHeight);
			   $(divId).css("margin-top",-winHeight/2);
			}   
		},   	
	
	show : function(p){
		var dialogId = p.dialogId;
		var _width   = p.width;
		var _height  = p.height;
		var _heightstr = p.heightstr;//设置auto
		var _bounds  = _jM.getClientBounds();
		heightstr=_height+"px";
		if(_jM.validate.isNotEmpty(_heightstr)){
			heightstr="auto";
		}
		
		_jM.layer.show({id:"globalModeLayer"});
		
		$("#"+dialogId).css("position","absolute");
		$("#"+dialogId).css("z-index","99");
		$("#"+dialogId).css("box-shadow", "0 0 15px #888");
		$("#"+dialogId).css("display","block");
		$("#"+dialogId).css("width", _width+"px");
		$("#"+dialogId).css("height", heightstr);
		$("#"+dialogId).css("left", (_bounds.width - _width)/2 +"px");
		$("#"+dialogId).css("top" , (_bounds.scrollTop - 100 + (_bounds.height- _height)/2) +"px");
	},
	
	showModeDialog : function(p){
		var _id		 = p.id;
		var _src     = p.url;
		var _width   = p.width;
		var _height  = p.height;
		var _position= p.position;
		
		var _heightstr = p.heightstr;//设置auto
		var frameHeight=_height+"px";
			heightstr=_height+"px";
			
		if(_jM.validate.isNotEmpty(_heightstr)){
			heightstr="auto";
			frameHeight="auto";
		}
		if(_jM.validate.isEmpty(_position)){
			_position="fixed";
		}
		
		var _callback= typeof(p.callBack)!="undefined"?p.callBack:null;
		var _outlineStyle  = p.outlineStyle || '';
		var _bounds  = _jM.getClientBounds();
		var _param   = typeof(p.param)!="undefined"? p.param:null;
		var _html = "<div id='"+_id+"' style='position:"+_position+";z-index:99;background-color:#fff;";
			_html+= "display:block;width:" + _width + "px;height:" + heightstr + ";left:50%;margin-left:"+(-_width/2)+"px" ;//+(_bounds.width - _width)/2+"px";
			//_html+=";top:" + (_bounds.scrollTop - 100 + (_bounds.height- (_height+25))/2) + "px;"+_outlineStyle+"'>";
			_html+=";top:50%;margin-top:"+(-_height/2)+"px;"+_outlineStyle+"'>";
			_html+="<div style='width:100%;height:25px;'><img onclick='_jM.dialog.hiddenModeDialog(\""+_id+"\")' src='/pc/help/about/guide/image/closeImg.jpg' style='float:right;margin:5px 5px;cursor:pointer;width:15px;height:15px;'  /></div>";
			_html+="<script type='text/javascript'>var _dialogParam = null;</script>";
			_html+="<iframe  id='dialogFrame' onload='_jM.dialog.iFrameHeight("+_id+")' src='" + _src + "' scrolling='no' frameborder='0' width='100%' height='"+frameHeight+"' style='overflow:hidden;'></iframe>";
			_html+="</div>";
		//	onload='_jM.dialog.iFrameHeight("+_id+")'
			_jM.layer.show({id:"globalModeLayer"});
			$(_html).prependTo("body");
			$("#dialogFrame").load(function(){
				if(_callback!=null){
					_callback($("#dialogFrame"));
				}
			});
			_dialogParam = _param;
	},
	
	hidden : function(p){
		_jM.layer.hidden({id:"globalModeLayer"});
		
		var dialogId = p.dialogId;
		$("#"+dialogId).css('display','none');
		if(p.hidden!=null){
			p.hidden();
		}
	},
	
	hiddenModeDialog : function(id){
		$("#"+id).remove();
		_jM.layer.hidden({id:"globalModeLayer"});
	},
	hiddenModeDialogPc : function(id){
		$("#"+id).remove();
		_jM.layer.hidden({id:"globalModeLayer"});
	}
};

jModule.prototype.getClientBounds = function(){
	var bounds=new Object();
	var isIE=navigator.userAgent.indexOf("MSIE")>0?true:false;

	bounds.width    = $(window).width();//isIE?document.body.clientWidth:document.documentElement.clientWidth;
	bounds.height   = $(window).height();//isIE?document.body.clientHeight:document.documentElement.clientHeight;
	bounds.scrollTop= document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
	bounds.scrollHeight= document.documentElement.scrollHeight || document.body.scrollHeight;
	return bounds;
};

jModule.prototype.timer = {
	start : function(p){
		var time = p.time == null ? 1000 :p.time;
		var callback = p.callback;
		
		return window.setInterval(callback, time);
	},
	stop : function(p){
		if(p.timeHandler == null){
			return;
		}
		window.clearInterval(p.timeHandler);
	}
};

jModule.prototype.layer = {
	show : function(p){
		var height= document.body.scrollHeight;
		var html  = "<div id='"+p.id+"' style='width:100%;min-width:1200px;height:"+height+"px;position:absolute;background-color:#000;"
				+ "filter:alpha(opacity=25);-moz-opacity:0.6;opacity:0.6;z-index:98;left:0px;top:0px;text-align:center;'></div>";

		$(html).appendTo($("body"));
		return p.id;
	},
	
	hidden: function(p){
		$("#"+p.id).remove();
	}
};

jModule.prototype.dubDatalayer = {
		show : function(p){
			var height= document.body.scrollHeight;
			var html  = "<div id='"+p.id+"' style='width:100%;min-width:1200px;height:"+height+"px;position:absolute;background-color:#000;"
			+ "filter:alpha(opacity=25);-moz-opacity:0.1;opacity:0.1;z-index:19;left:0px;top:0px;text-align:center;'></div>";
			
			$(html).appendTo($("body"));
			return p.id;
		},
		
		hidden: function(p){
			$("#"+p.id).remove();
		}
};

jModule.prototype.date = {
	string2Date : function(str){
		var date = eval('new Date(' + str.replace(/\d+(?=-[^-]+$)/, function (a){ 
			return parseInt(a, 10) - 1; }).match(/\d+/g) + ')'
		  	);
		return date;
	},
	date2DateString : function(date){
		return date == null ? "": (date.getFullYear()+"-"+(date.getMonth()+1)
				+"-"+date.getDate());
	}
};

jModule.prototype.post = function(url, param, success, error){
	$.post(url, param, function(data){
		if(!data.success){
			if(data.errCode == "01"){
				_jM.login.go(null);
				return;
			}
			if(error != null){
				error(data);
			}
		}else{
			if(success != null){
				success(data, data.data);
			}
		}
	});
};

jModule.prototype.need={//需求类
		
		needbudget : function(spend){//需求预算翻译
			var needBudgetStr="";
			switch(spend){
			case "0,1000":needBudgetStr="1千以下";
				break;
			case "1000,3000":needBudgetStr="1千到3千";
				break;
			case "3000,10000":needBudgetStr="3千到1万";
				break;
			case "10000,30000":needBudgetStr="1万到3万";
				break;
			case "30000,100000":needBudgetStr="3万到10万";
				break;
			case "100000,300000":needBudgetStr="10万到30万";
				break;
			case "300000,1000000":needBudgetStr="30万到100万";
				break;
			case "1000000,100000000000":needBudgetStr="100万以上";
				break;
			case "0.00":needBudgetStr="待商议";
				break;
			default:needBudgetStr=spend;
			}
			return needBudgetStr;
		}
};

jModule.prototype.validate = {
	//是否是有效的手机号
	isMobile : function(v){
		v = $.trim(v);
		return v.match(/^1\d{10}$/);
	},
	//是否是空字符串或者null
	isEmpty : function(v){
		v = $.trim(v);
		return v== null || v=="" || v.length<=0;
	},
	//是否不为空字符串
	isNotEmpty :function(v){
		v = $.trim(v);
		return v!=null && v!="" && v.length>0;
	},
	//是否是有效的数字，包括整数与小数
	isNumber : function(v){
		v = $.trim(v);
		return !isNaN(v);
	},
	//是否是整数
	isInteger : function(v){
		v = $.trim(v);
		return v.match(/^[0-9]*$/)
	},
	//是否是货币数字，小数点后两位
	isBigDecimal : function(v){
		v = $.trim(v);
		if(isNaN(v)){return false;}

		var index = v.lastIndexOf(".");
		if(index==-1){
			return true;
		}else{
			return index>=v.length-3;
		}
	},
	//是否是有效的数字，且在指定的范围内
	isNumberRangeIn : function(v, min, max){
		v = $.trim(v);
		if(isNaN(v)){return false;}
		var v2 = parseFloat(v);
		if(v2 < min || v2> max){
			return false;
		}
		return true;
	},
	//是否是货币数字，且在指定的范围内
	isDecimalRangeIn : function(v, min, max){
		v = $.trim(v);
		if(_jM.validate.isBigDecimal(v)){
			var v2 = parseFloat(v);
			return v2>=min && v2<=max;
		}
		return false;
	},
	//是否全是字母
	isCharacter : function(v){
		v = $.trim(v);
		return v.match(/^[A-Za-z]+$/);
	},
	//是否全是数字
	isDigital : function(v){
		v = $.trim(v);
		return v.match(/^[0-9]*$/);
	},
	//是否包含非法的字符
	isIllegalCharacter :function(v){
		v = $.trim(v);
		return v.match(/^((?![！~@#￥%……&*]).)*$/);
	},
	//字符串长度是否在有效的范围内
	isLengthBetween:function(v, min, max){
		v = $.trim(v);
		return v!=null && v.length>=min && v.length<=max;
	}
};
jModule.prototype.tooltip = {
		show : function (p){
			var id = p.id;
			var text = (typeof(p.tip)=="undefined" || p.tip==null)?"请输入提示信息！":p.tip;
			var _top = (typeof(p.top)=="undefined" || p.top==null)? 0 : p.top;
			var _left= (typeof(p.left)=="undefined" || p.left==null)? 0 : p.left;

			var tip=$("<div id='"+id+"_tip' class='cls_tool_tip' style='display:block;position:absolute;z-index:99;height:30px;'><div style='background-color:#FFE6E7;border:1px solid #ff3b2f;padding:5px 10px 5px 10px;font-size:12px;font-weight:normal;'>"+text+"</div><img style='float:left;margin-left:10px;' src='/statics/public/image/down.png'/></div>");
				tip.prependTo("body");
				tip.css("top",$("#"+id).offset().top + _top);
				tip.css("left",$("#"+id).offset().left + _left);
				tip.css("display","block");
			return tip;
		},
		showTip:function(id,txt){ 
			_jM.tooltip.show({
				id:id,
				top:-35,
				tip:txt
			});
		},
		hideTip:function(id){ 
			_jM.tooltip.hidden({id:id});
		},
		hidden : function(p){
			var id = p.id +"_tip";
			$("#"+id).remove();
		},
		hiddenAll : function(){
			$(".cls_tool_tip").remove();
		}
	};