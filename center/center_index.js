

$(document).ready(function(){
	_jM.login.isLogin();
	/*-------------------获取用户信息-----------------------*/
	getCustInfo();
	
	/*-------------------右边跳转-----------------------*/
	var p = _jM.getParam("t");
	itemFrameChanged(p);
	
	/*-------------------免费推广模块-----------------------*/
	$("#centerItem_personal").click(function(){itemFrameChanged("personal","我的推广中心")});
	/*-------------------业务规则模块-----------------------*/
	$("#centerItem_employersBook").click(function(){itemFrameChanged("employersBook","雇主入门")});
	$("#centerItem_employersGuarantee").click(function(){itemFrameChanged("employersGuarantee","雇主保障")});
	$("#centerItem_serviceBook").click(function(){itemFrameChanged("serviceBook","服务商入门")});
	$("#centerItem_serviceGuarantee").click(function(){itemFrameChanged("serviceGuarantee","服务商保障")});
	/*-------------------交际圈-----------------------*/
	$("#centerItem_personBase").click(function(){itemFrameChanged("personBase","个人资料")});    //centerItem_focus
	$("#centerItem_focus").click(function(){itemFrameChanged("focus","我的关注")});
	$("#centerItem_fansList").click(function(){itemFrameChanged("fansList","我的粉丝")});
	/*-------------------订单管理模块-----------------------*/
	$("#centerItem_project").click(function(){itemFrameChanged("project","个人资料")});    //centerItem_focus
});

function autoIframeHeight() {
	var ifm= document.getElementById("center_frame");
	if(ifm == null){
		return;
	}
	var subWeb = document.frames ? document.frames["center_frame"].document:ifm.contentDocument;

	if(ifm != null && subWeb != null) {
		if(subWeb.body!=null){
			ifm.height = subWeb.body.scrollHeight;
		}
	}
}

function itemChanged(id, url){
	$(".index").removeClass("index");
	$("#"+id).addClass("index")
	$("#center_frame").attr("src", url);
}

function itemFrameChanged(itemName,itemTitle){
	if(itemName == null || itemName ==""){
		itemName = "personal";
		itemTitle= "我的推广中心";
	}
	
	switch(itemName){
		case "personal":
			itemChanged("centerItem_personal","/pc/center/myPromotion/center_personal.html");
			break;
		case "employersBook":
			itemChanged("centerItem_employersBook","/pc/center/businessRule/center_employersBook.html");
			break;
		case "employersGuarantee":
			itemChanged("centerItem_employersGuarantee","/pc/center/businessRule/center_employersGuarantee.html");
			break;
		case "serviceBook":
			itemChanged("centerItem_serviceBook","/pc/center/businessRule/center_serviceBook.html");
			break;
		case "serviceGuarantee":
			itemChanged("centerItem_serviceGuarantee","/pc/center/businessRule/center_serviceGuarantee.html");
			break;
		case "personBase":
			$.post("/bp/individual/singledetail", null, function(data){
				if(data==null){return;}
				var _custType=data.custBase.custType;
				if(_custType==1){
					itemChanged("centerItem_personBase","/pc/center/socialContact/center_base.html");
				}else{
					itemChanged("centerItem_personBase","/pc/center/socialContact/center_basee.html");
				}
			});
			break;
		case "focus":
			itemChanged("centerItem_focus","/pc/center/socialContact/center_focus.html");
			break;
		case "fansList":
			itemChanged("centerItem_fansList","/pc/center/socialContact/center_fansList.html");
			break;
		case "project":
			itemChanged("centerItem_project","/pc/center/project/center_project.html");
			break;
		default:itemChanged("centerMain_item","/pc/center/details.html");
			break;
	}
	$("#itemTitle").html(itemTitle);
}


function getCustInfo(){
	$.post("/bp/individual/singledetail", null, function(rs){
		if(rs==null){
			return;
		}
		
	});

}