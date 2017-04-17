
var _eb=new EntBase();
$().ready(function(){

	
	_eb.init();
});

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
	$("#enterEstablishAddress_input").val(provinceName+" "+name);	
}
//-----------------------------------------------------------------
function EntBase(){
	var _catelist=new Array();
	var _self = this;
	var _data = null;
	var _editIntro = null;
	var en="enterName_input",eln="enterLegalname_input",elt="enterEstablishTime_input",ela="",eii="enterIdentityId_input";
	var cn="enterChargeName_input",cd="enterChargeDepart_input",cp="enterChargePhone_input",fp="enterFixedPhone_input",ee="enterEmail_input",ea="";
	var ni="needIntention",ei="enterIntention_input",er="enterRange_input",itr="enterIntra_input";
	
	this.initFB=function(inp,id){
		inp.blur(function(){hide(id) });
		inp.focus(function(){hide(id) });
	}
	
	this.init=function(){
		_self.initFB($("#"+en),en);
		_self.initFB($("#"+eln),eln);
		_self.initFB($("#"+elt),elt);
		_self.initFB($("#"+eii),eii);
		
		_self.initFB($("#"+cn),cn);
		_self.initFB($("#"+cd),cd);
		_self.initFB($("#"+cp),cp);
		_self.initFB($("#"+fp),fp);
		_self.initFB($("#"+ee),ee);
		_self.initFB($("#"+ei),ei);
		_self.initFB($("#"+itr),itr);
		
		_self.itemAuthChanged();
		
		_jM.post("/bp/enterprise/getDataDetail",null,function(data,dData){
			_data = dData;
			_self.initEntInfo(dData);
			_self.initContactInfo(dData);
			_self.initBusiness(dData);
			_self.initIntroduction(dData);
		});
		
		$("#enter_baseInfo_submit").click(function(){
			_self.hideTooltip();
			_self.vtEntInfo();
		});
		$("#enter_contact_submit").click(function(){
			_self.hideTooltip();
			_self.vtContactInfo();
		});
		$("#enter_Techniques_submit").click(function(){
			_self.hideTooltip();
			_self.vtBusiness();
		});
		$("#enter_introduction_submit").click(function(){
			_self.hideTooltip();
			_self.vtIntroduction();
		});
		
		_self.category1(); 
	};
	
	this.delback=function(curid){
		$("#li"+curid).css("background-color","#fff");
	}
	
	this.category1=function(){
		var _cate1Html="";
		for (var i = 0; i < _categoryList.length; i++) {
			_cate1Html+="<li id='li"+_categoryList[i].id+"' onmouseout='_eb.delback("+_categoryList[i].id+")' onmouseover='_eb.category2("+_categoryList[i].id+")'>"+_categoryList[i].name+"</li>";
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
				_cate2Html+="<li id='li"+cateListId+"' onmouseout='_eb.delback("+cateListId+")' onmouseover='_eb.category3("+cateListId+","+curid+")'>"+cateList[i].name+"</li>";
			}else{
				_cate2Html+="<li onmouseover='_eb.category3("+cateListId+","+curid+")'>"+cateListName;
				
				for (var k = 0; k < _catelist.length; k++) {
					if(_catelist[k]==cateListId){
						flagChseck=true;
					}
				}
				if(flagChseck){
					_cate2Html+="<input checked='true' onclick='_eb.checkCate("+cateListId+",\""+cateListName+"\")' id='cateid"+cateListId+"' style='width:20px;height:0px;' type='checkbox' value='"+cateListId+"'>";
				}else{
					_cate2Html+="<input onclick='_eb.checkCate("+cateListId+",\""+cateListName+"\")' id='cateid"+cateListId+"' style='width:20px;height:12px;' type='checkbox' value='"+cateListId+"'>";
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
			
			_cate3Html+="<li  onmouseover='_eb.addback("+scendid+")'>"+cateName;
			
			for (var k = 0; k < _catelist.length; k++) {
				if(_catelist[k]==cateid){
					flagChseck=true;
				}
			}
			if(flagChseck){
				_cate3Html+="<input  checked='true' onclick='_eb.checkCate("+cateid+",\""+cateName+"\")' id='cateid"+cateid+"' style='width:20px;height:0px;' type='checkbox' value='"+cateid+"'>";
			}else{
				_cate3Html+="<input onclick='_eb.checkCate("+cateid+",\""+cateName+"\")' id='cateid"+cateid+"' style='width:20px;height:12px;' type='checkbox' value='"+cateid+"'>";
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
				$("#custCategory_input").append("<div style='margin-right:5px;text-align:left;width:auto;' id='div"+cateid+"'>"+catename+"<img onclick='_eb.removeCate("+cateid+")' src='/statics/public/image/close.gif'></div>");
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
	
	this.initEntInfo=function(data){//企业信息
		$("#enterName").html(data.enterpriseName);
		$("#enterLegalname").html(data.enterpriseContacts);
		if(_jM.validate.isNotEmpty(data.enterpriseEstablishTime)){
			var elTime=data.enterpriseEstablishTime.replace(/ 00:00:00/,"");
			$("#enterEstablishTime").html(elTime);
		}else{
			$("#enterEstablishTime").html(data.enterpriseEstablishTime);
		}
		
		$("#enterEstablishAddress").html(data.enterpriseRegAddress);
		$("#enterIdentityId").html(data.enterpriseLicenseCode);
		
		$("#"+en).val(data.enterpriseName);
		$("#"+eln).val(data.enterpriseContacts);
		$("#"+elt).val(elTime);
		$("#"+eii).val(data.enterpriseLicenseCode);
	}
	this.upEntInfo=function(){
		var entData={
			enterpriseName:$("#"+en).val(),
			enterpriseContacts:$("#"+eln).val(),
			enterpriseEstablishTime:$("#"+elt).val()+" 00:00:00",
			enterpriseLicenseCode:$("#"+eii).val()
		}
		_jM.post("/bp/enterprise/update",entData,function(data,dData){
			window.location.reload();
		});
	}
	this.vtEntInfo=function(){
		_self.hideTooltip();
		if(!_self.vtEn()) return;
		if(!_self.vtEln()) return;
		if(!_self.vtElt()) return;
		if(!_self.vtEii()) return;
		_self.upEntInfo();
	}
	
	this.initContactInfo=function(data){//联系方式
		$("#enterChargeName").html(data.enterpriseResponsibleName);
		$("#enterChargeDepart").html(data.enterpriseResponsibleDept);
		$("#enterChargePhone").html(data.enterprisePhone);
		$("#enterChargePhone2").html(data.enterprisePhone);
		$("#enterFixedPhone").html(data.enterpriseTelephone);
		$("#enterEmail").html(data.enterpriseEmail);
		$("#htmlEnterAddress").html(data.enterAddress);
		
		$("#"+cn).val(data.enterpriseResponsibleName);
		$("#"+cd).val(data.enterpriseResponsibleDept);
		$("#"+cp).val(data.enterprisePhone);
		$("#"+fp).val(data.enterpriseTelephone);
		$("#"+ee).val(data.enterpriseEmail);
		if(!_jM.validate.isEmpty(data.enterpriseAddress)){
			$("#htmlEnterAddress").html("<div>详细地址：</div><span>"+data.enterpriseAddress+"</span>");
		}
		
	}
	this.upContactInfo=function(){
		//var phone=$("#"+fp).val();
		//var gPhone=phone.replace(/-/g,"").replace(/\s/g,"");
		
		var conData={
			enterpriseResponsibleName:$("#"+cn).val(),
			enterpriseResponsibleDept:$("#"+cd).val(),
			enterprisePhone:$("#"+cp).val(),
			enterpriseTelephone:$("#"+fp).val(),
			enterpriseEmail:$("#"+ee).val()
		}
		_jM.post("/bp/enterprise/update",conData,function(data,dData){
			window.location.reload();
		});
	}
	this.vtContactInfo=function(){
		_self.hideTooltip();
		if(!_self.vtCn()) return;
		if(!_self.vtCd()) return;
		if(!_self.vtCp()) return;
		if(!_self.vtFp()) return;
		if(!_self.vtEe()) return;
		_self.upContactInfo();
	}
	
	this.initBusiness=function(data){//主营业务
		if(data.custBase.custCategorys==null||data.custBase.custCategoryNames==null){
			$("#enterIntention").html(null);
			$("#custCategory_input").val(null);
			$("#selectedId").val(null);
		}else{
			$("#enterIntention").html(data.custBase.custCategoryNames);
			//$("#custCategory_input").val(data.custBase.proBaseCategory.categoryDesc);
			$("#selectedId").val(data.custBase.custCategorys);
			
			var listId=data.custBase.custCategorys.split(",");
			var listName=data.custBase.custCategoryNames.split(",");
			for (var i = 0; i < listId.length; i++) {
				var cateid=listId[i];
				var cateName=listName[i];
				_catelist.push(cateid);
				$("#custCategory_input").append("<div style='margin-right:5px;text-align:left;width:auto;' id='div"+cateid+"'>"+cateName+"<img onclick='_eb.removeCate("+cateid+")' src='/statics/public/image/close.gif'></div>");
			}
		}
		
		if(!_jM.validate.isEmpty(data.enterpriseScopeBusiness)){
			
			$("#htmlRange").html("<div>经营范围：</div><span>"+data.enterpriseScopeBusiness+"</span>");
		}
		
		
	}
	this.upBusiness=function(){
		_jM.post("/bp/enterprise/update",{"custBase.custCategorys":$("#selectedId").val()},function(data,dData){
			window.location.reload();
		});
	}
	this.vtBusiness=function(){
		_self.hideTooltip();
		if(!_self.vtEi()) return;
		_self.upBusiness();
	}
	
	this.initIntroduction=function(data){//企业简介
		if(data.custBase!=null&& _jM.validate.isNotEmpty(data.custBase.custDesc)){
				$("#enterDesc").html(data.custBase.custDesc);
				$("#showIntroduction").css("display","block");
				$("#addIntroductionLayer").css("display","none");
			}
			$("#enterIntra_input").blur(function(){
				hide("enterIntra_input");
				$("#enterIntra_input").focus();
			});
			$("#enter_introduction_add").click(function(){
				$("#enterIntra_input").val("");
				$("#showIntroduction").css("display","none");
				$("#editIntroduction").css("display","block");
				$("#addIntroductionLayer").css("display","none");
			});
			$("#enter_introduction_cancel").click(function(){
				$("#editIntroduction").css("display","none");
				if(_jM.validate.isNotEmpty(_data.custBase.custDesc)){
					$("#showIntroduction").css("display","block");
				}else{
					$("#addIntroductionLayer").css("display","block");
				}
			});
			$("#enter_introduction_update").click(function(){
				$("#enterIntra_input").val(_data.custBase.custDesc);
				$("#editIntroduction").css("display","block");
				$("#showIntroduction").css("display","none");
				$("#addIntroductionLayer").css("display","none");
			});
		
	}
	this.upIntroduction=function(){
		_jM.post("/bp/enterprise/update",{"custBase.custDesc":$("#"+itr).val()},function(data,dData){
			window.location.reload();
		});
	}
	this.vtIntroduction=function(){
		_self.hideTooltip();
		if(!_self.vtItr()) return;
		_self.upIntroduction();
	}
//------------------------------------------------------校验
	this.vtTooltip = function(id, tip){
		_self.hideTooltip();
		show(id,tip);
	}
	
	this.vtEn=function(){
//		if(_jM.validate.isEmpty($("#"+en).val())){
//			_self.vtTooltip(en,'企业名称不能为空');
//			return false;
//		}
		return true;
	}
	this.vtEln=function(){
//		if(_jM.validate.isEmpty($("#"+eln).val())){
//			_self.vtTooltip(eln,'法人名称不能为空');
//			return false;
//		}
		return true;
	}
	this.vtElt=function(){
//		if(_jM.validate.isEmpty($("#"+elt).val())){
//			_self.vtTooltip(elt,'注册时间不能为空');
//			return false;
//		}
		return true;
	}
	this.vtEla=function(){
//		if(_jM.validate.isEmpty($("#"+ela).val())){
//			_self.vtTooltip(ela,'注册地点不能为空');
//			return false;
//		}
		return true;
	}
	this.vtEii=function(){
		if(!_jM.validate.isEmpty($("#"+eii).val())){
//			_self.vtTooltip(eii,'营业执照号码不能为空');
//			return false;
			if(!$("#"+eii).val().match(/\d{15}/)){
				_self.vtTooltip(eii,'营业执照号码为15位');
				return false;
			}
		}
		return true;
	}
	this.vtCn=function(){
		if(_jM.validate.isEmpty($("#"+cn).val())){
			_self.vtTooltip(cn,'负责人名称不能为空');
			return false;
		}
		return true;
	}
	this.vtCd=function(){
//		if(_jM.validate.isEmpty($("#"+cd).val())){
//			_self.vtTooltip(cd,'负责人所在部门不能为空');
//			return false;
//		}
		return true;
	}
	this.vtCp=function(){
		if(_jM.validate.isEmpty($("#"+cp).val())){
			_self.vtTooltip(cp,'负责人手机不能为空');
			return false;
		}
		if(!$("#"+cp).val().match(/[\d-]+/)){
			_self.vtTooltip(cp,'联系电话格式不对');
			return false;
		}
		return true;
	}
	this.vtFp=function(){
		if(!_jM.validate.isEmpty($("#"+fp).val())){
			var phone=$("#"+fp).val();
			var gPhone=phone.replace(/-/g,"").replace(/\s/g,"");;

			var result=phone.match(/^(0\d{2,3})-?(\d{7,8})$/);
			if(result==null){
				_self.vtTooltip(fp,'请填写正确的固定电话格式');
				return false;
			}else{
				return true;
			}
			
		}
		return true;
	}
	this.vtEe=function(){
		if(!_jM.validate.isEmpty($("#"+ee).val())){
//			_self.vtTooltip(ee,'邮箱不能为空');
//			return false;
			if(!$("#"+ee).val().match(/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/)){
				_self.vtTooltip(ee,'邮箱格式错误');
				return false;
			}
		}
		return true;
	}
	this.vtEa=function(){
//		if(_jM.validate.isEmpty($("#"+ea).val())){
//			_self.vtTooltip(ea,'详细地址不能为空');
//			return false;
//		}
		return true;
	}
	this.vtEi=function(){
//		if(_jM.validate.isEmpty($("#"+ei).val())){
//			_self.vtTooltip(ni,需求意向不能为空');//ei-ni
//			return false;
//		}
		return true;
	}
	this.vtEr=function(){
//		if(_jM.validate.isEmpty($("#"+er).val())){
//			_self.vtTooltip(er,'经营范围不能为空');
//			return false;
//		}
		return true;
	}
	this.vtItr=function(){
//		if(_jM.validate.isEmpty($("#"+itr).val())){
//			_self.vtTooltip(itr,'企业简介不能为空');
//			return false;
//		}
		return true;
	}
	
	this.hideTooltip=function(){
		hide(en);
		hide(eln);
		hide(elt);
		hide(eii);
		
		hide(cn);
		hide(cd);
		hide(cp);
		hide(fp);
		hide(ee);
		
		hide(ni);//ei-ni
		hide(er);
		hide(itr);
	}
	
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
	
	
}
function hide(id){ _jM.tooltip.hidden({id:id})}
function show(id,txt){ _jM.tooltip.show({id:id,top:-35,tip:txt})}