var _ub = new UserBase();

$(document).ready(function(){
	var _pText = "";
	for (var i = 0; i < _pList.length; i++) {
		_pText += "<li><a style='font-weight:normal' href=\"javascript:getCityList('"
				+ _pList[i].stateCode
				+ "')\">"
				+ _pList[i].name
				+ "</a></li>";
	}
	$("#provinceList").html(_pText);
	_ub.init();
});

//User base object.
function UserBase(){
	var _upNickname=false;
	var _self = this;
	var _data = null;
	var _editEducationId = null;
	var _catelist=new Array();
	
	this.init = function(){
		_self.initFB($("#custNickname_input"),"custNickname_input");
		_self.initFB($("#custRealname_input"),"custRealname_input");
		_self.initFB($("#custIdentityId_input"),"custIdentityId_input");
		_self.initFB($("#custPhone_input"),"custPhone_input");
		_self.initFB($("#custEmail_input"),"custEmail_input");
		
		_self.initFB($("#learnSchool"),"learnSchool");
		_self.initFB($("#learnProfessional"),"learnProfessional");
		_self.initFB($("#educationBox"),"educationBox");
		
		_self.itemAuthChanged();
		$("#userName").click(function(){
			if(_pFlag&&_upNickname){
				$("#showUpname").show();
				$("#remind").hide();
				$("#userName").hide();
			}
		});
		$("#userNameSub").click(function(){
			_self.upNickName();
		});
		$("#userNameIpu").blur(function(){
			_jM.tooltip.hideTip("userNameIpu");
		});
	//	_self.category1();
		
		//Get user informations.
		$.post("/bp/individual/dataDetail", null, function(data){
	//	$.post("/bp/enterprise/getDataDetail", null, function(data){    // 企业
			if(data==null){
				return;
			}

			_data = data;
			_self.initBaseInfo(data);
			_self.initContactInfo(data);
			_self.initTechniques(data);
			_self.initEducationList(data);
			_self.initIntroduction(data);
		});
	};
	
	this.delback=function(curid){
		$("#li"+curid).css("background-color","#fff");
	}
	
	this.category1=function(){
		var _cate1Html="";
		for (var i = 0; i < _categoryList.length; i++) {
			_cate1Html+="<li id='li"+_categoryList[i].id+"' onmouseout='_ub.delback("+_categoryList[i].id+")' onmouseover='_ub.category2("+_categoryList[i].id+")'>"+_categoryList[i].name+"</li>";
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
				_cate2Html+="<li id='li"+cateListId+"' onmouseout='_ub.delback("+cateListId+")' onmouseover='_ub.category3("+cateListId+","+curid+")'>"+cateList[i].name+"</li>";
			}else{
				_cate2Html+="<li onmouseover='_ub.category3("+cateListId+","+curid+")'>"+cateListName;
				
				for (var k = 0; k < _catelist.length; k++) {
					if(_catelist[k]==cateListId){
						flagChseck=true;
					}
				}
				if(flagChseck){
					_cate2Html+="<input checked='true' onclick='_ub.checkCate("+cateListId+",\""+cateListName+"\")' id='cateid"+cateListId+"' style='width:20px;height:0px;' type='checkbox' value='"+cateListId+"'>";
				}else{
					_cate2Html+="<input onclick='_ub.checkCate("+cateListId+",\""+cateListName+"\")' id='cateid"+cateListId+"' style='width:20px;height:12px;' type='checkbox' value='"+cateListId+"'>";
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
			
			_cate3Html+="<li  onmouseover='_ub.addback("+scendid+")'>"+cateName;
			
			for (var k = 0; k < _catelist.length; k++) {
				if(_catelist[k]==cateid){
					flagChseck=true;
				}
			}
			if(flagChseck){
				_cate3Html+="<input  checked='true' onclick='_ub.checkCate("+cateid+",\""+cateName+"\")' id='cateid"+cateid+"' style='width:20px;height:0px;' type='checkbox' value='"+cateid+"'>";
			}else{
				_cate3Html+="<input onclick='_ub.checkCate("+cateid+",\""+cateName+"\")' id='cateid"+cateid+"' style='width:20px;height:12px;' type='checkbox' value='"+cateid+"'>";
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
				$("#custCategory_input").append("<div style='margin-right:5px;text-align:left;width:auto;' id='div"+cateid+"'>"+catename+"<img onclick='_ub.removeCate("+cateid+")' src='/statics/public/image/close.gif'></div>");
			}else{
				document.getElementById("cateid"+cateid).checked=false;
				show("custCategory_input","最多添加5个");
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
	
	this.initFB=function(inp,id){
		inp.blur(function(){hide(id) });
		inp.focus(function(){hide(id) });
	}
	
	this.vtTooltip=function(id,tip){
		_self.hideTooltip();
		show(id,tip);
	}
	this.hideTooltip=function(){
		hide("custNickname_input");
		hide("custRealname_input");
		hide("custIdentityId_input");
		hide("custCategory_input");
		hide("custPhone_input");
		hide("custEmail_input");
		hide("custQq_input");
		hide("custWeixin_input");
		hide("limitArea");
		hide("custAddress_input");
		
		hide("hidden");
		hide("custTechniques_input");
	}
	
	this.initIntroduction = function(data){
		if(data.custBase!=null
			&& _jM.validate.isNotEmpty(data.custBase.custDesc)){
			
			$("#custDesc").html(data.custBase.custDesc);
			$("#showIntroduction").css("display","block");
			$("#addIntroductionLayer").css("display","none");
		}
		$("#custDesc_input").blur(function(){
			hide("custDesc_input");
			$("#custDesc_input").focus();
		});
		$("#user_introduction_add").click(function(){
			$("#custDesc_input").val("");
			$("#showIntroduction").css("display","none");
			$("#editIntroduction").css("display","block");
			$("#addIntroductionLayer").css("display","none");
		});
		$("#user_introduction_cancel").click(function(){
			_self.hideTooltip();
			$("#editIntroduction").css("display","none");
			if(_jM.validate.isNotEmpty(_data.custBase.custDesc)){
				$("#showIntroduction").css("display","block");
			}else{
				$("#addIntroductionLayer").css("display","block");
			}
		});
		$("#user_introduction_submit").click(function(){
			_self.submitIntroduction();
		});
		$("#user_introduction_update").click(function(){
			$("#custDesc_input").val(_data.custBase.custDesc);
			$("#editIntroduction").css("display","block");
			$("#showIntroduction").css("display","none");
			$("#addIntroductionLayer").css("display","none");
		});
	}
	
	this.submitIntroduction = function(){
//		if(_jM.validate.isEmpty($("#custDesc_input").val())){
//			show("custDesc_input","自我介绍不能为空");
//			return;
//		}
		$.post("/bp/custBase/update", $("#introductionSubmitForm").serialize(), function(data){
			if(data.success){
				window.location.reload();
			}else{
				alert("提交失败，请重试！");
			}
		});
	}
	
	//************************************************************************************************************************************
	this.initEducationList = function(data){
		if(data.learnings.length>0){
			for(var i=0; i< data.learnings.length; i++){
				var startTime = _jM.date.string2Date(data.learnings[i].learnBeginTime);
				var   endTime = _jM.date.string2Date(data.learnings[i].learnEndTime);
				
				var html="<div class=\"zone_block\" onmouseover=\"showFunctionBtn('showEducationBtn"+i+"')\" onmouseout=\"hiddenFunctionBtn('showEducationBtn"+i+"')\" id=\"showEducation"+i+"\">";
				html+="<ul class=\"zone_li\">";
				html+="<li style=\"width:350px\"><div>时间：</div><span>"+startTime.getFullYear()+"/"+(startTime.getMonth()+1)+"-"+endTime.getFullYear()+"/"+(endTime.getMonth()+1)+"</span></li>";
				html+="<li style=\"width:350px\"><div>学校：</div><span>"+data.learnings[i].learnSchool+"</span></li>";
				html+="<li style=\"width:350px\"><div>专业：</div><span>"+data.learnings[i].learnProfessional+"</span></li>";
				html+="<li style=\"width:350px\"><div>学历：</div><span>"+_self.getLearnEducation(data.learnings[i].learnEducation)+"</span></li>";
				html+="</ul>";
				html+="<div id=\"showEducationBtn"+i+"\" class=\"zone_btns\">";
				html+="<div class=\"zone_edit\"><a href=\"javascript:void(0)\" onclick=\"_ub.editEducationInit('showEducation"+i+"',"+data.learnings[i].id+")\">修改</a></div>";
				html+="<div class=\"zone_edit\"><a href=\"javascript:void(0)\" onclick='_ub.deleteEducation("+data.learnings[i].id+")'>删除</a></div>";
				html+="</div></div>";
				
				$("#eduationListLayer").prepend(html);
			}
		}
		$("#user_education_submit").click(function(){_self.validateEducation()});
		$("#user_education_cancel").click(function(){
			if(_editEducationId == null){
				cancelButton_click('editEducationLayer','addEducationLayer');
			}else{
				$("#editEducationLayer").css("display","none");
				$("#addEducationLayer").css("display","block");
				$("#"+_editEducationId).css("display","block");
				_editEducationId = null;
				_self.validateShowAddEducation();
			}
		});
		$("#user_education_add").click(function(){
			editButton_click('editEducationLayer','addEducationLayer');
			$("#editEducationLayer").insertAfter($("#addEducationLayer"));
			
			$("#startYearBox").val(1950);
			$("#startMonthBox").val(1);
			$("#endYearBox").val(1950);
			$("#endMonthBox").val(1);
			$("#learnSchool").val("");
			$("#learnProfessional").val("");
			$("#educationBox").val("小学");
			$("#learnEducation_input").val(1);
			$("#learnId_input").val("");
		});
		_self.validateShowAddEducation();
	}
	
	this.validateShowAddEducation =function(){
		if(_data != null && _data.learnings.length >= 5){
			$("#addEducationLayer").css("display","none");
		}else{
			$("#addEducationLayer").css("display","block");
		}
	}
	
	//Get education text.
	this.getLearnEducation = function(t){
		switch(t){
		case 1:return "小学";
		case 2:return "初中";
		case 3:return "高中";
		case 4:return "中专";
		case 5:return "大专";
		case 6:return "本科";
		case 7:return "硕士";
		case 8:return "博士";
		}
		return "";
	}
	
	
	
	//Edit education.
	this.editEducationInit = function(id,learnId){
		if(_editEducationId == null){
			_editEducationId = id;
			$("#editEducationLayer").insertBefore($("#"+id));
			$("#editEducationLayer").css("display","block");
			$("#addEducationLayer").css("display","none");
			$("#"+id).css("display","none");
			
			if(_data.learnings.length>0){
				for(var i=0; i<_data.learnings.length; i++){
					if(_data.learnings[i].id == learnId){
						var startTime = _jM.date.string2Date(_data.learnings[i].learnBeginTime);
						var   endTime = _jM.date.string2Date(_data.learnings[i].learnEndTime);
						
						$("#startYearBox").val(startTime.getFullYear());
						$("#startMonthBox").val(startTime.getMonth()+1);
						$("#endYearBox").val(endTime.getFullYear());
						$("#endMonthBox").val(endTime.getMonth()+1);
						$("#learnSchool").val(_data.learnings[i].learnSchool);
						$("#learnProfessional").val(_data.learnings[i].learnProfessional);
						$("#educationBox").val(_self.getLearnEducation(_data.learnings[i].learnEducation));
						$("#learnEducation_input").val(_data.learnings[i].learnEducation);
						$("#learnId_input").val(_data.learnings[i].id);
						break;
					}	
				}
			}
		}else{
			alert("每次只能修改一项教育经历！");
		}
	}
	
	//Delete education.
	this.deleteEducation = function(id){
		if(id<=0)return;
		if(confirm("确认删除吗？")){ 
			$.post("/bp/individualLearn/delete/"+id, null, function(data){
				if(data.success){
					window.location.reload();
				}else{
					alert("删除失败，请重试！");
				}
			});
		}
	}
	
	//Add or update education.
	this.submitEducation = function(){
			//Begin time 2015-1-1 00:00:00
			$("#learnBeginTime").val($("#startYearBox").val()+"-"+$("#startMonthBox").val()+"-1 00:00:00");
			$("#learnEndTime").val($("#endYearBox").val()+"-"+$("#endMonthBox").val()+"-1 00:00:00");
			if(_editEducationId == null){
				$("#learnId_input").val("");
			}
			$.post("/bp/individualLearn/save", $("#educationSubmitForm").serialize(), function(data){
				if(data.success){
					cancelButton_click('editEducationLayer','addEducationLayer');
					window.location.reload();
				}else{
					alert("提交失败，请重试！");
				}
			});
	}
	this.validateEducation = function(){
		//if(!_self.vtlb()) return;
		//if(!_self.vtle()) return;
		if(!_self.vtls()) return;
		if(!_self.vtlp()) return;
		if(!_self.vted()) return;
		_self.submitEducation();
	}
	this.vtlb=function(){
		if(_jM.validate.isEmpty($("#learnBeginTime").val())){
			show("startYearBox","时间不能为空");
			return false;
		}
		return true;
	}
	this.vtle=function(){
		if(_jM.validate.isEmpty($("#learnEndTime").val())){
			show("startYearBox","时间不能为空");
			return false;
		}
		return true;
	}
	this.vtls=function(){
		if(_jM.validate.isEmpty($("#learnSchool").val())){
			show("learnSchool","学校不能为空");
			return false;
		}
		return true;
	}
	this.vtlp=function(){
		if(_jM.validate.isEmpty($("#learnProfessional").val())){
			show("learnProfessional","专业不能为空");
			return false;
		}
		return true;
	}
	this.vted=function(){
		if(_jM.validate.isEmpty($("#educationBox").val())){
			show("educationBox","学历不能为空");
			return false;
		}
		return true;
	}
	//************************************************************************************************************************************
	//Initial techniques information.
	this.initTechniques = function(data){
//		if(data.custBase.custCategory > 0){
//			for(var i=0;i<_categoryList.length;i++){
//				if(_categoryList[i].id == data.custBase.custCategory){
//					$("#custCategory").html(_categoryList[i].name);
//					$("#needIntention").val(_categoryList[i].name);
//					$("#custCategory_input").val(_categoryList[i].id);
//					break;
//				}
//			}
//		}
		if(data.custBase.custCategorys==null||data.custBase.custCategoryNames==null){
			$("#custCategory").html(null);
			$("#custCategory_input").val(null);
			$("#selectedId").val(null);
		}else{
			$("#custCategory").html(data.custBase.custCategoryNames);
			//$("#custCategory_input").html(data.custBase.custCategorys);
			$("#selectedId").val(data.custBase.custCategorys);
			
			var listId=data.custBase.custCategorys.split(",");
			var listName=data.custBase.custCategoryNames.split(",");
			for (var i = 0; i < listId.length; i++) {
				var cateid=listId[i];
				var cateName=listName[i];
				_catelist.push(cateid);
				$("#custCategory_input").append("<div style='margin-right:5px;text-align:left;width:auto;' id='div"+cateid+"'>"+cateName+"<img onclick='_ub.removeCate("+cateid+")' src='/statics/public/image/close.gif'></div>");
			}
		}
		
		
		$("#custTechniques").html(data.custBase.custTechniques);
		$("#custTechniques_input").val(data.custBase.custTechniques);
		$("#user_Techniques_submit").click(function(){_self.updateTechniques()});
	}
	
	//Validate techniques.
	this.validateTechniques = function(){
		return true;
	}
	
	//Submit request.
	this.updateTechniques = function(){
		if(_self.validateTechniques()){
			var obj={"custCategorys" :$("#selectedId").val(),
					"custTechniques"  :$("#custTechniques_input").val()};
			
			$.post("/bp/custBase/update", obj, function(data){
				if(data.success){
					window.location.reload();
				}else{
					alert("提交失败，请重试！");
				}
			});
		}
	}
	//******************************************************************
	//******************************************************************
	//Initial contact information.
	this.initContactInfo = function(data){
		var geography = 
			(data.custBase.sbstates==null?"":data.custBase.sbstates.stateNameCn)+
			(data.custBase.sbcities==null?"":" "+data.custBase.sbcities.cityNameCn);
		
		$("#custPhone").html(data.custPhone);
		$("#custPhone2").html(data.custPhone);
		$("#custEmail").html(data.custEmail);
		$("#custQq").html(data.custQq);
		$("#custWeixin").html(data.custBase.custWeixin);
		$("#custGeography").html(geography);
		$("#custAddress").html(data.custAddress);
		
		$("#custPhone_input").val(data.custPhone);
		$("#custEmail_input").val(data.custEmail);
		$("#custQq_input").val(data.custQq);
		$("#custWeixin_input").val(data.custBase.custWeixin);
		$("#limitArea").val(geography);
		$("#custAddress_input").val(data.custAddress);
		$("#user_contact_submit").click(function(){_self.updateContachInfo();});
	}
	
	//Validate user contact info.
	this.validateContactInfo = function(){
		//这里需要做校验
		if(!_jM.validate.isEmpty($("#custPhone_input").val())){
			if(!_jM.validate.isMobile($("#custPhone_input").val())){
				_self.vtTooltip("custPhone_input",'联系电话格式不对');
				return false;
			}
		}
		if(!_jM.validate.isEmpty($("#custEmail_input").val())){
			if(!$("#custEmail_input").val().match(/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/)){
				_self.vtTooltip("custEmail_input",'邮箱格式错误');
				return false;
			}
		}
		return true;
	}
	
	this.updateContachInfo = function(){
		if(_self.validateContactInfo()){
			var obj={"custPhone" :$("#custPhone_input").val(),
					"custEmail"  :$("#custEmail_input").val(),
					"custQq"     :$("#custQq_input").val(),
					"custBase.custWeixin" :$("#custWeixin_input").val(),
					"custBase.custCityId" :$("#custCityId_input").val(),
					"custBase.custProvinceCode": $("#custProvinceCode_input").val(),
					"custAddress":$("#custAddress_input").val()
					};
			
			$.post("/bp/individual/update", obj, function(data){
				if(data.success){
					window.location.reload();
				}else{
					alert("提交失败，请重试！");
				}
			});
		}
	}
	//******************************************************************
	//******************************************************************
	//Initial base information.
	this.initBaseInfo = function(data){
		//Init base information.
		$("#custNickname").html(data.custBase.custNickname);
		$("#custRealname").html(data.custRealname);
		$("#custSex").html(data.custSex==1?"男":"女");
		$("#custIdentityId").html(data.custIdentityId);
		$("input[name='custNickname']").val(data.custBase.custNickname);
		$("input[name='custRealname']").val(data.custRealname);
		$("input[name='custIdentityId']").val(data.custIdentityId);
		
		if(data.custSex == 1){
			$("#custSexsBoy").attr("checked","checked");
			$("#custSexsGirl").removeAttr("checked");
		}else{
			$("#custSexsGirl").attr("checked","checked");
			$("#custSexsBoy").removeAttr("checked");
		}
		
		$("#custNickname_input").blur(function(){hide("custNickname_input")});
		$("#custRealname_input").blur(function(){hide("custRealname_input")});
		$("#custIdentityId_input").blur(function(){hide("custIdentityId_input")});
		$("#user_baseInfo_submit").click(function(){_self.updateUserInfo();});
	}
	
	//Validate user base info
	this.validateUserInfo = function(){
		if(_jM.validate.isEmpty($("#custNickname_input").val())){
			show("custNickname_input","昵称必须填写");
			return false;
		}
		if(_jM.validate.isEmpty($("#custRealname_input").val())){
			show("custRealname_input","用户姓名称必须填写");
			return false;
		}
		if(_jM.validate.isEmpty($("#custIdentityId_input").val())){
			show("custIdentityId_input","身份证号必须填写");
			return false;
		}
		//这里需要做校验
		return true;
	};
	
	//Update user base info.
	this.updateUserInfo = function(){
		if(_self.validateUserInfo()){
			var obj={"custRealname" :$("input[name='custRealname']").val(),
					"custSex"       :$("input[name='custSexs']:checked").val(),
					"custIdentityId":$("input[name='custIdentityId']").val(),
					"custBase.custNickname":$("input[name='custNickname']").val()};
			//JSON.stringify(obj)
			
			$.post("/bp/individual/update", obj, function(data){
				if(data.success){
					window.location.reload();
				}else{
					alert("提交失败，请重试！");
				}
			});
		}
	};
	this.itemAuthChanged=function(){
		$.post("/bp/individual/singledetail", null, function(data){
			if(data==null){return;}
			_custType=data.custBase.custType;
			var _custAuth=data.custBase.custAuthenticat;
			if(_custType==1){
				if(data.custBase.updateNicknameNum==1){
					
				}else{
					_upNickname=true;
					$("#remind").html("可点击修改，且只能修改一次");
//					$("#userName").mouseover(function(){
//						_jM.tooltip.showTip("userName","可点击修改，且只能修改一次");
//					});
//					$("#userName").mouseout(function(){
//						_jM.tooltip.hideTip("userName");
//					});
				}
				_pFlag=true;
				$("#userName").html(data.custBase.custNickname);
				$("#userNameIpu").val(data.custBase.custNickname);
			}else{
				var custNickName=data.custBase.custNickname;
				$.post("/bp/enterprise/getDataDetail",null,function(data){
					if(data==null){
						return;
					}
					if(_jM.validate.isEmpty(data.data.enterpriseName)||_custAuth==0){
						$("#userName").html(custNickName);
					}else{
						$("#userName").html(data.data.enterpriseName);
					}
				});
			}
			
			var _custName=data.custBase.custName;
			var p1=_custName.substring(0,3);
			var p2=_custName.substring(7,11);
			var p=p1+" **** **"+p2;
			$("#custName").html(p);
			if(data.custBase.custAuthenticat){
				$("#authFlag").html("已经认证");
				$("#authText").html("已经认证");
				$("#authUserBtnNo").html("查看");
				if(_custType == 1){
					$("#userType").html("个人");
					if(data.custSex){
						$("#maleImg").show();
						$("#femaleImg").hide();
					}else{
						$("#femaleImg").show();
						$("#maleImg").hide();
					}
				}else{
					$("#userType").html("企业");
				}
			}else{
				if(data.custBase.custAuthStatus >= 0){//填写了资料
					if(data.custBase.custAuthStatus == 0){
						$("#authFlag").html("审核中");
						$("#authText").html("审核中");
						$("#authUserBtnNo").html("查看");
					}
					if(data.custBase.custAuthStatus == 1){
						$("#authFlag").html("审核中");
						$("#authText").html("审核中");
						$("#authUserBtnNo").html("查看");
					}
					if(data.custBase.custAuthStatus == 2){
						$("#authFlag").html("初审退回");
						$("#authText").html("初审退回");
						$("#authUserBtnNo").html("认证");
					}
					if(data.custBase.custAuthStatus == 3){
						$("#authFlag").html("认证通过");
						$("#authText").html("认证通过");
						$("#authUserBtnNo").html("查看");
					}
					if(data.custBase.custAuthStatus == 4){
						$("#authFlag").html("复核退回");
						$("#authText").html("复核退回");
						$("#authUserBtnNo").html("认证");
					}
				
					if(_custType == 1){//p
						$("#userType").html("个人");
						if(data.custSex==null){
							//$("#showMale").show();
						}else{
							if(data.custSex){
								//$("#maleImg").show();
								//$("#femaleImg").hide();
							}else{
								//$("#femaleImg").show();
								//$("#maleImg").hide();
							}
						}
					}else{
						$("#userType").html("企业");
						}
				}else{//未填写
					$("#authFlag").html("未认证");
					$("#authText").html("未认证");
					$("#authUserBtnNo").html("认证");
				
					if(_custType == 1){
						$("#userType").html("个人");
						if(data.custSex==null){
							//$("#showMale").show();
						}else{
							if(data.custSex){
								//$("#maleImg").show();
								//$("#femaleImg").hide();
							}else{
								//$("#femaleImg").show();
								//$("#maleImg").hide();
							}
						}
					}else{
						$("#userType").html("企业");
						}
				}
			}
			
		});
	}
	this.upNickName=function(){
		if(!_self.vtUpNick()) return;
		var _newName=$("#userNameIpu").val();
		if(_jM.validate.isEmpty(_newName)){
			_jM.tooltip.showTip("userNameIpu","不能为空");
		}else{
			$.post('/bp/custBase/isNickNameExist',{custNickname:_newName},function(data){
				if(data.success){
					_jM.post('/bp/custBase/update',{custNickname:_newName},function(data,dData){
						$("#userName").html(dData.custNickname);
						$("#userNameIpu").val(dData.custNickname);
						$("#showUpname").hide();
						$("#userName").show();
						window.top.location.reload();
					});
				}else{
					if($("#userNameIpu").val()==$("#userName").html()){
						$("#showUpname").hide();
						$("#userName").show();
					}else{
						_jM.tooltip.showTip("userNameIpu","相同的用户昵称已经被注册");
					}
				}
			});
		}
	}
	this.vtUpNick=function(){
		if($("#userNameIpu").val().match("公司")){
			_jM.tooltip.showTip("userNameIpu","不能包含'公司'二字");
			return false;
		}
		return true;
	}
}
function editButton_click(showId, hiddenId){
	$("#"+showId).css("display","block");
	$("#"+hiddenId).css("display","none");
	}
	function cancelButton_click(showId, hiddenId){
	$("#"+showId).css("display","none");
	$("#"+hiddenId).css("display","block");
	hideTooltip();
}
function hideTooltip(){
	hide("custNickname_input");
	hide("custRealname_input");
	hide("custIdentityId_input");
	hide("custPhone_input");
	hide("custEmail_input");
	hide("custQq_input");
	hide("custWeixin_input");
	hide("limitArea");
	hide("custAddress_input");
	hide("hidden");
	hide("custTechniques_input");
	hide("custCategory_input");
	
	hide("enterName_input");
	hide("enterLegalname_input");
	hide("enterEstablishTime_input");
	hide("enterIntra_input");
	hide("enterIdentityId_input");
	hide("enterChargeName_input");
	hide("enterChargeDepart_input");
	hide("enterChargePhone_input");
	hide("enterFixedPhone_input");
	hide("enterEmail_input");
	hide("enterEstablishAddress_input");
	hide("needIntention");
	hide("enterIntention_input");
	hide("enterRange_input");
}
function showAreaist(){
	$("#areaList").css("top",$("#limitArea").offset().top + 30);
	$("#areaList").css("left",$("#limitArea").offset().left);
	$("#areaList").css("display","block");
}
function areaTabChange(tab) {
	if (tab == 1) {
		$("#cityList").css("display", "block");
		$("#provinceList").css("display", "none");
		$("#pBtn").css("border-bottom","1px solid #ddd");
		$("#cBtn").css("border-bottom","1px solid #fff");
	} else {
		$("#cityList").css("display", "none");
		$("#provinceList").css("display", "block");
		$("#pBtn").css("border-bottom","1px solid #fff");
		$("#cBtn").css("border-bottom","1px solid #ddd");
	}
}
function selectCity(id,name, stateCode, provinceName) {
	$("#limitArea").val(provinceName+" "+name);
	$("#custCityId_input").val(id);
	$("#custProvinceCode_input").val(stateCode);
}
function getCityList(code) {
	for (var i = 0; i < _pList.length; i++) {
		if (_pList[i].stateCode == code) {
			var cities = _pList[i].children;
			var _cText = "";

			for (var j = 0; j < cities.length; j++) {
				_cText += "<li><a style='font-weight:normal' href=\"javascript:selectCity("
				+ cities[j].cityId + ",'" + cities[j].name + "','"+_pList[i].stateCode+"','"+_pList[i].name+"')\">" + cities[j].name+ "</a></li>";
			}
			$("#cityList").html(_cText);
			areaTabChange(1);
		}
	}
}
function hide(id){ _jM.tooltip.hidden({id:id})}