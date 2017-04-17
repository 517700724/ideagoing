var _rd=null;
var _proneedid=null;
var _selectCities = new Array();
var _selectFile=new Array();
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
	
	_rd = new RecruitDetail();
	_rd.init();
});

function RecruitDetail(){
	var _self = this;
	
	this.init=function(){
		$("#needAttachment").val("");
		$("#needCityId").html("");
		var categoryId = _jM.getParam("id");
		_proneedid = _jM.getParam("proneedid");
		//_self.showProneedInfo(_proneedid);
		_self.showCategory(categoryId);
		//_self.initUpload();
		
		_upload.init({submitdata:function(){_self.subdata();},uploadNumber:3,uploadFrameId:"uploadFrame",uploadFormId:"uploadForm",selectId:"needAddAttachment",
			uploadFormat:["jpg","png","gif","txt","doc","xls","pdf","ppt","zip","rar"],selectCallBack:function(list){
			if(list!=null){
				var html="";
				for(var i=0;i<list.length;i++){
					html+="<span id='fid"+list[i].id+"' style='margin-right:5px;float:left;'><div style='overflow: hidden; white-space: nowrap; max-width: 100px; text-overflow: ellipsis;float:left;'>"+list[i].name+"</div><img style='width:10px;float:left;' " +
					"alt='x'  onclick='removefile(\""+list[i].id+"\")' src='/pc/help/about/guide/image/closeImg.jpg' >&nbsp;</span>";
					
					delArray(list[i].id,_selectFile);
				}
				
				for(var i=0;i<_selectFile.length;i++){
					var val=_selectFile[i].name+"*"+_selectFile[i].url+"|";
					html+="<span id='fid"+_selectFile[i].id+"' style='margin-right:5px;float:left;'><input type='hidden' class='upattachemnt' id='inp"+_selectFile[i].id+"' value=\'"+val+"\'><div style='overflow: hidden; white-space: nowrap; max-width: 100px; text-overflow: ellipsis;float:left;'>"+_selectFile[i].name+"</div><img style='width:10px;float:left;' " +
					"alt='x'  onclick='removefile(\""+_selectFile[i].id+"\")' src='/pc/help/about/guide/image/closeImg.jpg' >&nbsp;</span>";
				}
				
				$("#needShowAttachment").html(html);
				$("#needShowAttachment").show();
			}
		},uploadSuccess:function(data){
			$("#needAttachment").val(_upload.upload_getURL(data));
			_self.subdata();
		},uploadFailed:function(data){
			_jM.tooltip.showTip("needAddAttachment","文件上传失败，请重试");
		}});
		
		_self.showProneedInfo(_proneedid);
		
		
		_self.mycheckbox("needValueService","addserciceval","1","0");
		_self.mycheckbox("agreeRules","xyval","1","0");
		
		_self.mycheckbox("needRequiredEnterpriseBox","custval","1","0");
		_self.mycheckbox("needInvoiceBox","voiceval","1","0");
		_self.mycheckbox("needRequiredCaseBox","caseval","1","0");
		_self.mycheckbox("needThirdAuthBox","thirdval","1","0");
		
		_self.myradio("needIsPublic_yes","needIsPublic_no","pubval","1");
		_self.myradio("needIsPublic_no","needIsPublic_yes","pubval","0");
		
		$("#needSubmit").click(function(){
			_self.hidetip();
			_self.validation();
		});
		
		this.subdata=function(){
			_self.hidetip();
			_self.validation();
		}
		
//		$("#updateneedSubmit").click(function(){
//			_self.updatevalidation();
//		});
		
		$("#needAddAttachment").focus(function(){
			_jM.tooltip.hideTip("needAddAttachment");
		});
		$("#needTitle").focus(function(){
			_jM.tooltip.hideTip("needTitle");
		});
		$("#needBudgetShow").focus(function(){
			_jM.tooltip.hideTip("needBudgetShow");
		});
		$("#needDesc").focus(function(){
			_jM.tooltip.hideTip("needDesc");
		});
		$("#needDevelopmentTimes").focus(function(){
			_jM.tooltip.hideTip("needDevelopmentTimes");
		});
		$("#needTechniques").focus(function(){
			_jM.tooltip.hideTip("needTechniques");
		});
		
		$("#modelPanel").click(function(){
			_jM.dialog.show({width:600,height:600,dialogId:'modelPanelDialog',heightstr:-1});
		});
	}
	
	this.hidetip=function(){
		_jM.tooltip.hideTip("needAddAttachment");
		_jM.tooltip.hideTip("needTitle");
		if($("#budgetFlag").val()==0){
			
			_jM.tooltip.hideTip("custSetBudgetShow");
		}else{
			
			_jM.tooltip.hideTip("needBudgetShow");
		}
		_jM.tooltip.hideTip("needDesc");
		_jM.tooltip.hideTip("agreeRules");
		_jM.tooltip.hideTip("needSubmit");
	}
	
	this.initUpload = function(){
		//_upload = new FileUpload();
		_upload.init({
			uploadSelectId:"uploadFileSelect",
			uploadFrameId:"uploadFrame",
			uploadFormId:"uploadForm",
			uploadNumber:1,
			uploadMaxSize:1024*1024*5,
			uploadFormat:["jpg","png","gif","doc","xls","pdf","txt","ppt","zip"],
			uploadTooltip:function(status, tooltip){
				//_self.hideTooltip();
				if(status){
//					_fileNum++;
					$("#needShowAttachment").show();
//					$("#needShowAttachment").append(tooltip);
					$("#needShowAttachment").html(tooltip);
					/*$("#needShowAttachment").append("<span id='fid"+_fileNum+"'>"+tooltip+"<img style='width:10px;' " +
							"alt='x'  onclick='removefile("+_fileNum+")' src='/pc/help/about/guide/image/closeImg.jpg' >&nbsp;</span>");*/
				}else{
					$("#needShowAttachment").html("<span style='color:#ff0000'>"+tooltip+"</span>");
				}
			},
			uploadSuccess:function(obj){
				if(obj!=null){
					$("#needAttachment").val(_upload.upload_getURL(obj));
					_self.submit();
				}
			},
			uploadFailed:function(obj){
				_jM.tooltip.showTip("needAddAttachment","文件上传失败，请重试");
			}
		});
		$("#needAddAttachment").click(function(){
			_self.hidetip();
			_upload.select();
		});
	}
	
	this.mycheckbox=function(sid,sval,yseval,noval){
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
	}
	
	this.setSelected=function(sid,valname,val,yseval,noval){
		if(val==1){
			$("#"+sid).attr("src","/pc/public/image/selected.png");
			$("#"+valname).val(yseval);
		}else{
			$("#"+sid).attr("src","/pc/public/image/unselect.png");
			$("#"+valname).val(noval);
		}
	}
	
	this.myradio=function(clickid,bid,rvalname,rval){
		$("#"+clickid).click(function(){
			_self.setRadio(clickid,bid,rvalname,rval);
		});
	}
	
	this.setRadio=function(clickid,bid,rvalname,rval){
		$("#"+clickid).attr("src","/pc/public/image/selected.png");
		$("#"+bid).attr("src","/pc/public/image/unselect.png");
		$("#"+rvalname).val(rval);
	}
	
	this.showCategory = function(categoryId){
		if(categoryId == null || categoryId=="" || parseInt(categoryId)<=0){
			window.location.href="/pc/project/recruit/recruit_select.html";
			return;
		}
		$.post("/bp/baseCategory/"+categoryId, null, function(data){
			if(data.length<=0){
				window.location.href="/pc/project/recruit/recruit_select.html";
				return;
			}
			var categoryName ="";
			for(var i=data.length-1; i>=0; i--){
				categoryName+= data[i].categoryName + ((i==0)?"":" > ");
			}
			var curTopId=data[data.length-1].id;
			if(curTopId==263){
				$("#modelPanel").show();
			}else{
				$("#modelPanel").hide();
			}
			$("#needCategoryDesc").html(categoryName);
			$("#needCategory").val(categoryId);
		});
	};
	
	this.showProneedInfo=function(pid){
		if(pid == null || pid=="" || parseInt(pid)<=0){
			return;
		}
		$.post("/bp/need/getById?nid="+pid, null, function(rs,data){
			var prodata=rs.data;
			
			$("#proneedid").val(prodata.id);
			$("#needDesc").html(prodata.needDesc);
			//$("#needAttachment").val(prodata.needAttachment);
			if(_jM.validate.isNotEmpty(prodata.needAttachment)){
				var attaList=_jM.ideagoing.getUploadAttachmentList(prodata.needAttachment);
				var attahtml="";
				for (var i = 0; i < attaList.length; i++) {
					var val=attaList[i].imgText+"*"+attaList[i].imgURL+"|";
					var id="uploadFile"+(parseInt(i)+1);
					attahtml+="<span id='fid"+id+"' style='margin-right:5px;float:left;'><input type='hidden' class='upattachemnt' id='inp"+id+"' value=\'"+val+"\'><div style='overflow: hidden; white-space: nowrap; max-width: 100px; text-overflow: ellipsis;float:left;'>"+attaList[i].imgText+"</div><img style='width:10px;float:left;' " +
					"alt='x'  onclick='removefile(\""+id+"\")' src='/pc/help/about/guide/image/closeImg.jpg' >&nbsp;</span>"
					
					_selectFile[i]={id:id, name:attaList[i].imgText,url:attaList[i].imgURL};
					_upload.addFile();
				}
				$("#needShowAttachment").html(attahtml);
				
			}
			
			var cityhtml="";
			var citylist=prodata.sbcitieses;
			if(citylist.length<=0){
				cityhtml="全国";
			}
			for (var i = 0; i < citylist.length; i++) {
				addCity(citylist[i].cityId,citylist[i].cityNameCn);
				cityhtml+="<span style='margin-right:10px;'>"+citylist[i].cityNameCn+"<a href='javascript:removeCity("+citylist[i].cityId+")' style='color:red;'>X</a></span>";
			}
			
			$("#limitArea").html(cityhtml);
			
			if(prodata.needIsPublic){
				_self.setRadio("needIsPublic_yes","needIsPublic_no","pubval","1");
			}else{
				_self.setRadio("needIsPublic_no","needIsPublic_yes","pubval","0");
			}
			
			$("#needDevelopmentTimes").val(prodata.needDevelopmentTimes);
			$("#needCompetitiveTimes").val(prodata.needCompetitiveTimes);
			$("#needTechniques").val(prodata.needTechniques);
			$("#needCityId").val(prodata.needCityId);
			
			if(prodata.needRequiredEnterprise){
				_self.setSelected("needRequiredEnterpriseBox","custval","1","1","0");
			}else{
				_self.setSelected("needRequiredEnterpriseBox","custval","0","1","0");
			}
			
			if(prodata.needInvoice){
				_self.setSelected("needInvoiceBox","voiceval","1","1","0");
			}else{
				_self.setSelected("needInvoiceBox","voiceval","0","1","0");
			}
			
			if(prodata.needRequiredCase){
				_self.setSelected("needRequiredCaseBox","caseval","1","1","0");
			}else{
				_self.setSelected("needRequiredCaseBox","caseval","0","1","0");
			}
			
			if(prodata.needThirdAuth){
				_self.setSelected("needThirdAuthBox","thirdval","1","1","0");
			}else{
				_self.setSelected("needThirdAuthBox","thirdval","0","1","0");
			}
			
		},null)
	}
	
	this.vtNeedTitle=function(){
		if(_jM.validate.isEmpty($("#needTitle").val()) || !_jM.validate.isLengthBetween($("#needTitle").val(),0,60)){
			_jM.tooltip.showTip("needTitle","项目名称不能为空，且长度不能超过60个字符！");
			window.location.href="#needTitle";
			return false;
		}
		return true;
	}
	this.vtNeedBudget=function(){
		if(_jM.validate.isEmpty($("#needBudget").val())){
			_jM.tooltip.showTip("needBudgetShow","项目预算不能为空");
			window.location.href="#needBudget";
			return false;
		}
		return true;
	}
	this.vtNeedDesc=function(){
		if(_jM.validate.isEmpty($("#needDesc").val()) || !_jM.validate.isLengthBetween($("#needDesc").val(),0,3000)){
			_jM.tooltip.showTip("needDesc","项目描述不能为空，且长度不能超过3000个字符！");
			window.location.href="#needDesc";
			return false;
		}
		return true;
	}
	this.vtNeedDevelopmentTimes=function(){
		if(_jM.validate.isNotEmpty($("#needDevelopmentTimes").val()) && 
				!_jM.validate.isDigital($("#needDevelopmentTimes").val())){
			_jM.tooltip.showTip("needDevelopmentTimes","开发时间必须是有效的数字！");
			window.location.href="#needDevelopmentTimes";
			return false;
		}
		if(_jM.validate.isNotEmpty($("#needDevelopmentTimes").val()) && $("#needDevelopmentTimes").val()>9999){
			_jM.tooltip.showTip("needDevelopmentTimes","开发时间不能超过9999天！");
			window.location.href="#needDevelopmentTimes";
			return false;
		}
		return true;
	}
	this.vtAgreeRules=function(){
		if($("#xyval").val()==0){
			_jM.tooltip.showTip("agreeRules","请阅读《网站注册服务协议》");
			return false;
		}
		return true;
	}
	this.validateNeedTechniques = function(){
		if(_jM.validate.isNotEmpty($("#needTechniques").val())){
			var items = $("#needTechniques").val().split(/,|，/);
			if(items.length>5 || !_jM.validate.isLengthBetween($("#needTechniques").val(),1,40)){
				_self.hidetip();_jM.tooltip.showTip("needTechniques","技能要求个数不能超过5个，总长度不能超过40个字符！")
				return false;
			}
		}
		return true;
	}
	
	this.vtCustSetBudgetShow=function(){
		if(!_jM.validate.isBigDecimal($("#custSetBudgetShow").val())){
			_self.hidetip();_jM.tooltip.showTip("custSetBudgetShow","请填写有效数字，可精确到小数点后两位数字")
			return false;
		}
		if(parseInt($("#custSetBudgetShow").val())>10000000000){
			_self.hidetip();_jM.tooltip.showTip("custSetBudgetShow","最大金额100亿")
			return false;
		}
		var budget=$("#custSetBudgetShow").val();
		$("#needBudget").val(budget,budget);
		return true;
	}
	
	this.validation=function(){
		if($("#updateOrSave").val()==1){
			if(!_self.vtNeedTitle()) return;
			if($("#budgetFlag").val()==0){
				
				if(!_self.vtCustSetBudgetShow()) return;
			}else{
				
				if(!_self.vtNeedBudget()) return;
			}
		}
		
		if(!_self.vtNeedDesc()) return;
		if(!_self.vtNeedDevelopmentTimes()) return;
		if(!_self.vtAgreeRules()) return;
		if(!_self.validateNeedTechniques()) return;
			_self.submit();
	}
	
//	this.updatevalidation=function(){
//		if(!_self.vtNeedDesc()) return;
//		if(!_self.vtAgreeRules()) return;
//		if(!_self.vtNeedDevelopmentTimes()) return;
//		if(!_self.validateNeedTechniques()) return;
//		
//		if(_upload.canUpload()){
//			_upload.upload();
//		}else{
//			_self.submit();
//		}
//	}
	
	this.submit=function(){
		var techniques=$("#needTechniques").val();
		var Ctechniques=techniques.replace(/,|、/,"，");
		
		var subdata=null;
		var categoryId = _jM.getParam("id");
		var inv_id = _jM.getParam('inv_id');//邀请id
		var url="";
		var nexturl=null;
		if($("#updateOrSave").val()==1){
			url="/bp/need/saveNeed/1";
			var needDescval=$("#needDesc").val();
			subdata={
					needCategory:$("#needCategory").val(),
					needTitle:$("#needTitle").val(),
					needBudget:$("#needBudget").val(),
					needDesc:needDescval,
					needAttachment:$("#needAttachment").val(),
					needIsPublic:$("#pubval").val()==1?true :false,
					needDevelopmentTimes:$("#needDevelopmentTimes").val(),
					needCompetitiveTimes:$("#needCompetitiveTimes").val(),
					needTechniques:Ctechniques,//$("#needTechniques").val(),
					needCityId:$("#needCityId").val(),
					needRequiredEnterprise:$("#custval").val()==1?true:false,
					needInvoice:$("#caseval").val()==1?true:false,
					needRequiredCase:$("#needRequiredCaseBox").attr("needval")==1?true:false,
					needThirdAuth:$("#thirdval").val()==1?true:false,
					needValueService:$("#addserciceval").val(),
					needAttaSecret:false
			};
			var nexturl=true;
			
		}else if($("#updateOrSave").val()==0){
			url="/bp/need/updateNeed";
			var attaItems=$(".upattachemnt");
			var attaData="";
			for (var i = 0; i < attaItems.length; i++) {
				attaData+=attaItems[i].value;
			};
			
			subdata={
					id:$("#proneedid").val(),
					needDesc:$("#needDesc").val(),
					needAttachment:$("#needAttachment").val()+attaData,
					needIsPublic:$("#needIsPublic_yes").attr("pubval")==1?true:false,
					needDevelopmentTimes:$("#needDevelopmentTimes").val(),
					needCompetitiveTimes:$("#needCompetitiveTimes").val(),
					needTechniques:Ctechniques,//$("#needTechniques").val(),
					needCityId:$("#needCityId").val(),
					needRequiredEnterprise:$("#custval").val()==1?true:false,
					needInvoice:$("#voiceval").val()==1?true:false,
					needRequiredCase:$("#caseval").val()==1?true:false,
					needThirdAuth:$("#thirdval").val()==1?true:false
			};
			var nexturl=false;
		}
		
		_jM.dubDatalayer.show({id:"globalModeLayer"});
		_jM.post(url,subdata, function(rs, data){
			if(rs.success){
				if(nexturl){
					if(inv_id != null){
						$.post('/bp/invitation/save',{custId:inv_id,needId:data},function(){});
					}
					window.location.href="/pc/project/recruit/recruit_successful2.html?id="+categoryId+"&proneedid="+data;
				}else{
					window.parent.location.href="/pc/project/recruit/recruit_successful1.html";
				}
			}else{
				_jM.dubDatalayer.hide({id:"globalModeLayer"});
				_jM.tooltip.showTip("needSubmit","提交失败");
			}
		},function(rs){
				_jM.dubDatalayer.hide({id:"globalModeLayer"});
				_jM.tooltip.showTip("needSubmit","提交失败");
		});
	}
}

function showtxt(){
	$("#up_txt").html("（一次只能选一个，可选多次，总附件不能大于50MB，最多只能上传3个附件。目前只支持.doc .xls .pdf .txt .jpg .png .ppt .zip .rar等格式的文件）");
}

function hidetxt(){
	$("#up_txt").html("");
}

function showLimitAreaist(){
	/*$("#areaList").css("top",$("#limitArea").offset().top - 1352);
	$("#areaList").css("left",$("#limitArea").offset().left-620.5);*/
	$("#areaList").css("display","block");
}

function getCityList(code) {
	for (var i = 0; i < _pList.length; i++) {
		if (_pList[i].stateCode == code) {
			var cities = _pList[i].children;
			var _cText = "";

			for (var j = 0; j < cities.length; j++) {
				_cText += "<li><a style='font-weight:normal' href=\"javascript:addCity("
				+ cities[j].cityId + ",'" + cities[j].name + "')\">" + cities[j].name+ "</a></li>";
			}
			$("#cityList").html(_cText);
			areaTabChange(1);
		}
	}
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

function addCity(id, name) {
	if (_selectCities.length >= 3) {
		alert("最多只能选择3个！");
		return;
	}
	for (var i = 0; i < _selectCities.length; i++) {
		if (_selectCities[i].id == id) {
			alert("请勿重复选择！");
			return;
		}
	}
	_selectCities[_selectCities.length] = {
		id : id,
		name : name
	};
	if (_selectCities.length == 1){
		$("#needCityId").val($("#needCityId").val()+id);
	}else{
		$("#needCityId").val($("#needCityId").val()+","+id);
	}
	
	showCity();
}
function showCity() {
	var _showText = "";
	for (var j = 0; j < _selectCities.length; j++) {
		_showText += "<span style='margin-right:10px;'>"
				+ _selectCities[j].name
				+ "<a style='color:red;' href='javascript:removeCity("
				+ _selectCities[j].id
				+ ")'>X</a></span>";
	}
	if(_selectCities.length<=0){
		_showText="全国";
	}
	$("#limitArea").html(_showText);
}
function removeCity(id) {
	for (var i = 0; i < _selectCities.length; i++) {
		if (_selectCities[i].id == id) {
			_selectCities.splice(i,1);
			break;
		}
	}
	$("#needCityId").val("");
	for (var i = 0; i < _selectCities.length; i++) {
		if (_selectCities.length == 1){
			$("#needCityId").val($("#needCityId").val()+id);
		}else{
			$("#needCityId").val($("#needCityId").val()+","+id);
		}
	}
	
	showCity();
}

function clickRecruitDaysList(v){
	$("#needCompetitiveTimes").val(v);
	$("#recruitDaysList").hide();
}
function showRecruitDaysList(){
	$("#recruitDaysList").show();
}
function clickRecruitlistBudget(st,end,txt){
	$("#needBudgetShow").val(txt);
	$("#needBudget").val(st+","+end);
	$("#needBudgetShow").show();
	$("#custSetBudgetShow").hide();
	$("#recruitbudgetList").hide();
	$("#budgetFlag").val("1");
}
function custSetBudget(){
	$("#needBudgetShow").hide();
	$("#custSetBudgetShow").show();
	$("#recruitbudgetList").hide();
	$("#custSetBudgetShow").focus();
	$("#budgetFlag").val("0");
}
function showRecruitlistBudget(){
	$("#recruitbudgetList").show();
}

function removefile(fid){
	$("#fid"+fid).remove();
	delArray(fid,_selectFile);
	_upload.removeFile(fid);
}

function delArray(fid,selectFile){
	if(selectFile != null){
		for(var i=0; i<selectFile.length; i++){
			if(selectFile[i].id == fid){
				selectFile.splice(i,1);
				break;
			}
		}
	}
	_selectFile=selectFile;
}

function forwardCustStore()
{
	window.location.href = '/personal/list/index.html?needId='+(_proneedid==null?'':_proneedid)+'&queryMode=1';
}

function headOnload(){
	_upload.resize();
}

function modelPanelClose(){
	_jM.dialog.hidden({dialogId:'modelPanelDialog'});
}