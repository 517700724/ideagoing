var _nd = new NeedDetail();
var _accusationId = null;

$(document).ready(function(){
	_nd.init(needStatus);
});

function NeedDetail(){
	var _self = this;
	var _timer = null;
	var _timerSeconds = 0;
	var _rows = 5;	//每页展示行数
	var _page = 1;
	var _totalPage  = 1;
	var _canMessage = false;
	var _catelist=new Array();
	
	this.init = function(needStatus){
		_canMessage = needStatus == 6 || needStatus ==61;
		
		_jM.login.getLogin(function(data){
			if(_self.getCompetitiveReleaseTime()){
				_self.getCanCompetitive();
			}else{
				_self.bindCompetitiveButton(true, "050");
			}
			if(data.custId == needCustId || !_canMessage){
				$("#messageTooltip").remove();
				$(".message").remove();
			}
			_self.getMessageList({page:_page,rows:_rows});
		}, function(){
			if(_self.getCompetitiveReleaseTime()){
				$("#jingbiaoBtn").click(function(){
					var backURL=window.location.href;
					_jM.dialog.showModeDialog({
						id:"loginContainer",
						height:349,
						width:540,
						url:"/pc/user/login/login.html?backURL="+backURL
					});
					//_jM.login.go(null);
				});
			}
		});
		$("#messageSubmit").click(function(){
			_self.submitMessage();
		});
		$("#msg_more_button").click(function(){
			$("#msg_more_button").css("display","none");
			$("#msg_more_progress").css("display","block");
			
			var page = _page>_totalPage?_totalPage+1:_page+1;
			_self.getMessageList({page:page, rows:_rows});
		});
		$("#accusationSubmit").click(function(){
			_self.accusationMessage();
		});
		
		_jM.login.getLogin(function(data){
			if(data.custId != needCustId)
			{
				_self.checkFavorite();
				$('#favoritebtn').click(_self.favoriteOperate);
			}
			else
			{
				$('.d_favorite').hide();
			}
		});
		
		_self.category1();
	}
	
	/**
	 * addCate
	 */
	this.delback=function(curid){
		$("#li"+curid).css("background-color","#fff");
	}
	
	this.category1=function(){
		var _cate1Html="";
		for (var i = 0; i < _categoryList.length; i++) {
			_cate1Html+="<li id='li"+_categoryList[i].id+"' onmouseout='_nd.delback("+_categoryList[i].id+")' onmouseover='_nd.category2("+_categoryList[i].id+")'>"+_categoryList[i].name+"</li>";
		}
		$("#serviceType1").html(_cate1Html);
	}
	this.category2=function(curid){
		$("#cate_div3").hide();
		$("#li"+$("#currid1").val()).css("background-color","#fff");
		$("#li"+curid).css("background-color","#ddd");
		$("#currid1").val(curid);
		
		var _cate2Html="";
		var cateList="";
		var cateChildrenList="";
		
		for (var i = 0; i < _categoryList.length; i++) {
			if(_categoryList[i].id==curid){
				cateList=_categoryList[i].children;
			}
		}
		for (var i = 0; i < cateList.length; i++) {
			var cateListId=cateList[i].id;
			var cateListName=cateList[i].name;
			var flagChseck=false;
			
			for (var j = 0; j < cateList.length; j++) {
				if(cateList[j].id==cateListId){
					cateChildrenList=cateList[j].children;
				}
			}
			if(cateChildrenList.length>0){
				_cate2Html+="<li id='li"+cateListId+"' onmouseout='_nd.delback("+cateListId+")' onmouseover='_nd.category3("+cateListId+","+curid+")'>"+cateList[i].name+"</li>";
			}else{
				_cate2Html+="<li onmouseover='_nd.category3("+cateListId+","+curid+")'>"+cateListName;
				
				for (var k = 0; k < _catelist.length; k++) {
					if(_catelist[k]==cateListId){
						flagChseck=true;
					}
				}
				if(flagChseck){
					_cate2Html+="<input checked='true' onclick='_nd.checkCate("+cateListId+",\""+cateListName+"\")' id='cateid"+cateListId+"' style='width:20px;height:0px;' type='checkbox' value='"+cateListId+"'>";
				}else{
					_cate2Html+="<input onclick='_nd.checkCate("+cateListId+",\""+cateListName+"\")' id='cateid"+cateListId+"' style='width:20px;height:12px;' type='checkbox' value='"+cateListId+"'>";
				}
				_cate2Html+="</li>";
			}
		}
		$("#serviceType2").html(_cate2Html);
		$("#cate_div2").show();
	}
	
	this.category3=function(scendid,curid){
		$("#cate_div3").show();
		$("#li"+$("#currid2").val()).css("background-color","#fff")
		$("#li"+scendid).css("background-color","#ddd");
		$("#li"+curid).css("background-color","#ddd");
		$("#currid2").val(scendid)
		var _cate3Html="";
		var cateList="";
		var cateChildrenList="";
		
		for (var i = 0; i < _categoryList.length; i++) {
			if(_categoryList[i].id==curid){
				cateList=_categoryList[i].children;
			}
		}
		
		for (var i = 0; i < cateList.length; i++) {
			if(cateList[i].id==scendid){
				cateChildrenList=cateList[i].children;
			}
		}
		
		for (var i = 0; i < cateChildrenList.length; i++) {
			var cateid=cateChildrenList[i].id;
			var cateName=cateChildrenList[i].name;
			var flagChseck=false;
			
			_cate3Html+="<li  onmouseover='_nd.addback("+scendid+")'>"+cateName;
			
			for (var k = 0; k < _catelist.length; k++) {
				if(_catelist[k]==cateid){
					flagChseck=true;
				}
			}
			if(flagChseck){
				_cate3Html+="<input  checked='true' onclick='_nd.checkCate("+cateid+",\""+cateName+"\")' id='cateid"+cateid+"' style='width:20px;height:0px;' type='checkbox' value='"+cateid+"'>";
			}else{
				_cate3Html+="<input onclick='_nd.checkCate("+cateid+",\""+cateName+"\")' id='cateid"+cateid+"' style='width:20px;height:12px;' type='checkbox' value='"+cateid+"'>";
			}
			_cate3Html+="</li>";
		}
		$("#serviceType3").html(_cate3Html);
		
		if(cateChildrenList.length>0){
			$("#cate_div3").show();
		}else{
			$("#cate_div3").hide();
		}
	}
	this.addback=function(cateid){
		$("#li"+cateid).css("background-color","#ddd");
	}
	
	this.checkCate=function(cateid,catename){
		_self.hideTooltip();
		
		var flagChseck=false;
		for (var k = 0; k < _catelist.length; k++) {
			if(_catelist[k]==cateid){
				flagChseck=true;
			}
		}
		
		if(flagChseck){
			catename+="&nbsp;";
			var delIndex=this.getIndex(_catelist,cateid);
			_catelist.splice(delIndex, 1)
			$("#div"+cateid).remove();
		}else{
			if(_catelist.length<5){
				_catelist.push(cateid);
				$("#custCategory_input").append("<div style='margin-right:5px;text-align:left;width:auto;' id='div"+cateid+"'>"+catename+"<img onclick='_nd.removeCate("+cateid+")' src='/statics/public/image/close.gif'></div>");
			}else{
				document.getElementById("cateid"+cateid).checked=false;
				_jM.tooltip.showTip("custCategory_input","最多添加5个");
			}
		}
		
		_self.upselectId();
	}
	
	this.removeCate=function(cateid){
		var delIndex=this.getIndex(_catelist,cateid);
		_catelist.splice(delIndex, 1)
		$("#div"+cateid).remove();
		if(document.getElementById("cateid"+cateid)!=null){
			document.getElementById("cateid"+cateid).checked=false;
		}
		_self.upselectId();
	}
	
	this.upselectId=function(){
		var uploadId="";
		for (var i = 0; i < _catelist.length; i++) {
			if(i<_catelist.length-1){
				uploadId+=_catelist[i]+",";
			}else{
				uploadId+=_catelist[i];
			}
		}
		$("#selectedId").val(uploadId);
	}
	
	this.getIndex=function(list,listv){
		var index=null
		for (var i = 0; i < list.length; i++) {
			if(list[i]==listv){
				index=i;
			}
		}
		return index;
	}
	
	this.showCate=function(){
		$("#cate_div1").show();
	}
	
	this.hidecate=function(){
		
	}
	this.hideTooltip=function(){
		_jM.tooltip.hideTip("custCategory_input");
	}
	/**
	 * Initial competitive release time.
	 */
	this.getCompetitiveReleaseTime = function(){
		var date  = new Date();
		var mills = releaseCheckTime.getTime();
			mills+= releaseCompetitiveTimes*1000*60*60*24;
		
		if(needStatus == 6 && mills > date.getTime()){
			var releaseMills = mills - date.getTime();
				releaseMills = releaseMills <= 0? 0:releaseMills;
			
			_self.startTimer(releaseMills, function(v){$("#showCompetitiveReleaseDays").html("竞标剩余"+v);
			}, null);
			return true;
		}else{
			$("#showCompetitiveReleaseDays").html(_self.getNeedPhase(needStatus));
			//$("#jingbiaoBtn").remove();
			$("#jingbiaoBtn").css("background-color","#fff");
			$("#jingbiaoBtn").html("");
			
			if(mills > date.getTime()){				
				return true;
			}else{
				return false;
			}
		}
	}
	
	this.getNeedPhase = function(v){
		//-2 取消发布，-1已提交，0待托管，1待审核，2待审核，3初审通过，4初审不通过，5复审不通过，6竞标中，61选标中，
		//7已过期，8实施中，81验收中，82验收不通过，83待付款，84待评价，85需求方已评价，86服务方已评价，9维护中，10结束
		switch(v){
		case -2:
			return "已取消";
		case -1:
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
			return "发布中";
		case 6:
			return "竞标中";
		case 61:
			return "选标中";
		case 7:
			return "已过期";
		case 8:
		case 81:
		case 82:
		case 83:
		case 84:
		case 85:
		case 86:
		case 87:
		case 88:
		case 89:
		case 90:
			return "实施中";
		case 9:
			return "维护中";
		case 10:
			return "已完成";
		}
	}
	
	/**
	 * Get can competitive.
	 */
	this.getCanCompetitive = function(){
		_jM.post("/bp/needCompetitive/isCanCompetitive", {needId:needId}, function(rs, data){
			_self.bindCompetitiveButton(false, null);
		}, function(rs){
			_self.bindCompetitiveButton(true, rs.errCode);
		});
	}
	
	/**
	 * Bind button.
	 */
	this.bindCompetitiveButton = function(disable, status){
		if(disable){
			$("#jingbiaoBtn").css("background-color","#fff");
			$("#jingbiaoBtn").css("color","#ff6600");
			$("#jingbiaoBtn").css("cursor","default");
			
			switch(status){
			case "050":
			case "051":
				$("#jingbiaoBtn").html("已过竞标期");
				break;
			case "052":
				$("#jingbiaoBtn").html("");//自己的标
				break;
			case "053":
				$("#jingbiaoBtn").html("已淘汰");
				break;
			case "055":
				$("#jingbiaoBtn").html("已投标");
				break;
			}
		}else{
			$("#jingbiaoBtn").css("background-color","#ff6600");
			$("#jingbiaoBtn").css("cursor","pointer");
			$("#jingbiaoBtn").html("立即竞标");

			$("#jingbiaoBtn").click(function(){

				//window.location.href="/competitive/competitive_detail.html?nid="+needId;跳转至竞标页面
				_jM.post("/bp/needCompetitive/isCanCompetitive", {needId:needId}, function(rs, data){
					_jM.dialog.showModeDialog({
						id:"competiveContainer",
						
						width:540,
						heightstr:"auto",
						position:"absolute",
						url:"/pc/contract/join.html?nid="+needId+"&needTitle="+needTitle
					});
					//window.location.href="/statics/competitive/competitive_detail.html?nid="+needId;
				}, function(rs){
					window.location.reload();
				});
				/*$.post("/bp/custBase/checkCategorys", null, function(data){
					if(data.data){
						window.location.href="/competitive/competitive_detail.html?nid="+needId;
					}else{
						_jM.dialog.show({width:700,height:100,dialogId:'addServiceDialog'});
					}
				});*/
			});
		}
	}
	
	/**
	 * Start competitive timer.
	 */
	this.startTimer = function(mills, callBackFun, endFun){
		if(mills > 0){
			_timerSeconds = mills + 60000;
			_timer = _jM.timer.start({time:1000, callback: function(){
				_timerSeconds = _timerSeconds - 1000;
				
				if(_timerSeconds >= 0 && callBackFun != null){
					callBackFun(_self.getDate2Days(_timerSeconds));
					
				}else{
					_jM.timer.stop({timeHandler:_timer});
					if(endFun != null){
						endFun();
					}else{
						window.location.reload();
					}
				}
			}});
		}
	}
	
	/**
	 * Get date 2 days.
	 * 
	 * @param v mills.
	 */
	this.getDate2Days = function(v){
		if(v == null || v <= 0){
			return "";
		}
		var mills1 = v%(24*60*60*1000);
		var days   = (v-mills1)/(24*60*60*1000);
		
		var mills2 = mills1%(60*60*1000);
		var hours  = (mills1-mills2)/(60*60*1000);
		
		var mills3 = mills2%(60*1000);
		var minutes= (mills2-mills3)/(60*1000);
		
		var mills4 = mills3%1000;
		var seconds= (mills3-mills4)/1000;
		return days+"天"+hours+"小时"+minutes+"分"+seconds+"秒";
	}
	
	/**
	 * Submit message.
	 */
	this.submitMessage = function(){
		var msg = $("#messageContent").val();
			msg = msg.trim();
			if(msg==""){
				_jM.tooltip.showTip("messageSubmit","请输入留言内容");
				return;
			}
			if(msg.length>140){
				_jM.tooltip.showTip("messageSubmit","留言内容不能超过140字符！");
				return;
			}
			
		_jM.post("/bp/needMessage/saveCustIdMessage", {needId:needId,messageContent:msg}, function(rs, data){
			window.location.reload();
			$("#messageContent").val("");
			$(".success_text").show();
		},null);
	}
	
	/**
	 * Reply message.
	 */
	this.replyMessage = function(id){
		var msg = $("#msgReplyTextarea"+id).val();
			msg = msg.trim();
			
			if(msg.length>140){
				_jM.tooltip.showTip("msgReply"+id,"回复内容不能超过140字符！");
				return;
			}
		_jM.post("/bp/needMessage/saveReply", {needId:needId,messageContent:msg,parentId:id}, function(rs, data){
			window.location.reload();
		},null);
	}
	
	/**
	 * Get reply message textarea.
	 */
	this.getReplyMessage = function(t, obj, id){
		if($("#msgReplyForm"+id).length<=0){
			var html="";
			html+="<div class='w msg2' id='msgReplyForm"+id+"'>";
			html+="<div class='message' style='display:block'>";
			html+="<textarea class='msg_area' placeholder='请输入回复内容，不能超过140个字符！' id='msgReplyTextarea"+id+"' onchange=\"$('#showMsgReply"+id+"').html($(this).val().trim().length+'/140字符')\" onkeydown=\"$('#showMsgReply"+id+"').html($(this).val().trim().length+'/140字符');\"></textarea>";
			html+="<div class='msg_label'>留言内容仅对方可见，请放心交流<span id='showMsgReply"+id+"'>0/140字符</span></div>";
			html+="<div class='global_btn' style='width:100px' id='msgReply"+id+"' onclick='_nd.replyMessage("+id+")'>发表</div>";
			html+="<div style='background-color:#888;margin-right:10px;width:100px;' class='global_btn' onclick=\"$('#msgReplyForm"+id+"').remove();_jM.tooltip.hideTip('msgReply"+id+"')\">取消</div>"
			html+="</div></div>";
			if(t == 1){
				$(obj).parent().parent().append(html);
			}else{
				$(obj).parent().parent().parent()
				.parent()
				.parent()
				.append(html);
			}
		}else{
			window.location.href = "#msgReplyForm"+id;
		}
	}
	
	/**
	 * Get message list.
	 */
	this.getMessageList = function(p){
		if(p == null){
			p = new Object();
		}
		p.needId = needId;
		_jM.post("/bp/needMessage/getMessageTree", p, function(rs, data){
			var html="";
			
			if(data!=null && data.rows.length>0){
				for(var i=0; i<data.rows.length; i++){
					var item = data.rows[i];
					var user = item.messageDirection == 0?item.custBase:item.needCustBase;
					var photo= _jM.validate.isNotEmpty(user.custImage)?user.custImage:"/statics/index/image/default.png";
					
					html+="<li "+(i==0?"style='border-top: none;'":"")+">";
					html+="<img src='"+photo+"' class='img'>";
					html+="<div class='w author'><a target='_blank' href='"+user.custUrl+"' class='blueLink'>"+user.custNickname+"</a>&nbsp;发表</div>";
					html+="<div class='w desc'>"+item.messageContent+"</div>";
					html+="<div class='oper'><span>"+item.createTime+"</span>";
					html+=(_canMessage)?"<a href='javascript:void(0)' onclick='_nd.getReplyMessage(1, this,"+item.id+")'>回复</a>":"";
					html+=(item.checkStatus == -1)?"<a href='javascript:void(0)' onclick='accusation("+item.id+")'>举报</a>":"";
					html+="</div>";
					
					if(item.chiledrenList != null && item.chiledrenList.length>0){
						html+="<div class='w child'>";
						html+="<ul class='msg_list'>";
						for(var j=0; j<item.chiledrenList.length; j++){
							var child = item.chiledrenList[j];
							var user2 = child.messageDirection == 0?child.custBase:child.needCustBase;
							var photo2= _jM.validate.isNotEmpty(user2.custImage)?user2.custImage:"/statics/index/image/default.png";
							
							html+="<li>";
							html+="<img src='"+photo2+"' class='img'>";
							html+="<div class='w author'><a target='_blank' href='"+user2.custUrl+"' class='blueLink'>"+user2.custNickname+"</a>&nbsp;回复</div>";
							html+="<div class='w desc'>"+child.messageContent+"</div>";
							html+="<div class='oper'><span>"+child.createTime+"</span>";
							html+=(_canMessage)?"<a href='javascript:void(0)' onclick='_nd.getReplyMessage(2, this,"+item.id+")'>回复</a>":"";
							html+=(child.checkStatus == -1)?"<a href='javascript:void(0)' onclick='accusation("+child.id+")'>举报</a>":"";
							html+="</div></li>";
						}
						html+="</ul>";
						html+="</div>";
					}
					html+="</li>";
				}
				$("#messasgeUlList").append(html);
			}
			else{
				
			}
			
			_totalPage = data.totalPage;
			_page = data.pageNo;
			if(data.totalCount>5){
				$("#msg_more_button").css("display","block");
				$("#msg_more_progress").css("display","none");
			}
		});
	}
	
	/**
	 * Accusation message.
	 */
	this.accusationMessage = function(){
		var msg = $("#accusationTextarea").val();
			msg = msg.trim();
			
		if(msg.length>140){
			_jM.tooltip.showTip("accusationSubmit","举报内容不能超过140字符！");
			return;
		}
		if(_accusationId!=null){
			_jM.post("/bp/needMessage/saveReport", {needId:needId,reportReason:msg,id:_accusationId}, function(rs, data){
				window.location.reload();
			},null);
		}
	}
	
	this.checkFavorite = function (){
		var success = function(rs, data){
			var target = $('#favoritebtn');
			if(data)
			{
				$('#favoriteTitle').css('color','#ff7519');
				target.attr('src','/statics/public/image/full_star.png');
				target.attr('status','1');
			}
			else
			{
				$('#favoriteTitle').css('color','#a4a1a1');
				target.attr('src','/statics/public/image/empty_star.png');
				target.attr('status','0');
			}
		}
		_jM.post("/bp/custFavorite/checkFavorite", {favoriteType:1,favoriteId:needId}, success);
	}

	this.favoriteOperate = function ()
	{
		var success = function(rs, data){
			var target = $('#favoritebtn');
			if(target.attr('status') == '0')
			{
				$('#favoriteTitle').css('color','#ff7519');
				target.attr('src','/statics/public/image/full_star.png');
				target.attr('status','1');
			}
			else
			{
				$('#favoriteTitle').css('color','#a4a1a1');
				target.attr('src','/statics/public/image/empty_star.png');
				target.attr('status','0');
			}
		}
		if($('#favoritebtn').attr('status') == '0')
		{
			_jM.post("/bp/custFavorite/add", {favoriteType:1,favoriteId:needId}, success);
		}
		else
		{
			//_jM.post("/bp/custFavorite/deleteEx", {favoriteType:1,favoriteId:needId}, success);
		}
	}
}
function accusation(id){
	_accusationId = id;
	$("#accusationTextarea").val("");
	_jM.dialog.show({width:600,height:310,dialogId:'accusationDialog'});
}
function accusationClose(){
	_jM.tooltip.hideTip("accusationSubmit");
	_jM.dialog.hidden({dialogId:'accusationDialog'});
}
function closeServiceDialog(){
	_jM.dialog.hidden({dialogId:'addServiceDialog'});
}

function iFrameHeightById(id) {  
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
		$("#"+id).css("height",winHeight);
	}   
}   	