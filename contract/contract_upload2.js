var _sc=null;
var _rows=4;	//每页展示行数
var _PageNum=5;	//每页连接数
var _queryParams = {page:1, rows:_rows/*,'custId':15*/};
var _urlHost = '';
$(document).ready(function(){
	_sc=new successCase();
	_sc.init();
	$("#success_case").click(function(){

		$("#successCaseView").show();
		$("#backCompetive").show();
		$("#competiveView").hide();
		parent.iFrameHeightById("competiveContainer");
		
		$("#serviceTitle").val("");
		$("#serviceDesc").val("");
		$("#showAttachment").html("");
		parent._jM.dialog.hideClose();
	});
});

function upPage(pageNo){
	_queryParams.page = pageNo;
	_sc.query(_queryParams);
}

function successCase(){
//start
	var _self = this;
	var _pager= new Paging();
	var _pager_1= new Paging();
	
	this.init=function(){
		var needid = _jM.getParam("nid");
		if(needid == null || needid=="" || parseInt(needid)<=0){
			window.parent.location.href=window.parent.location.href;
		}
		
		$("#upcase").click(function(){
			clickUpcase();
		});
		
		$("#selectcase").click(function(){
			_self.hideTooltip();
			$("#upcase").removeClass("index");
			$("#selectcase").addClass("index");
			$("#upcase_div").hide();
			$("#sub_update").hide();
			$("#selectcase_div").show();
			$("#sub_select").show();
		});
		
		_self.getServiceList(_queryParams);
		
		_upload.init({submitdata:function(){_self.validateSubmit();},uploadNumber:3,uploadFrameId:"uploadFrame",uploadFormId:"uploadForm",selectId:"caseAddAttachment",
			uploadFormat:["jpg","png","gif","txt","doc","xls","pdf","ppt","zip","rar"],selectCallBack:function(list){
			_self.hideTooltip();
			if(list!=null){
				var html="";
				for(var i=0;i<list.length;i++){
					html+="<span id='fid"+list[i].id+"' style='float: left; margin-left: 20px; margin-top: -10px;'><div style='overflow: hidden; white-space: nowrap; max-width: 100px; text-overflow: ellipsis;float:left;'>"+list[i].name+"</div><img style='width:10px;float:left;' " +
					"alt='x'  onclick='removefile(\""+list[i].id+"\")' src='/pc/help/about/guide/image/closeImg.jpg' >&nbsp;</span>";
				}
				
				$("#showAttachment").html(html);
				$("#showAttachment").show();
			}
		},uploadSuccess:function(data){
			_self.hideTooltip();
			_self.validateSubmit(_self.buildImgData(data));
			//$("#caseAttachment").val(_upload.upload_getURL(data));
			//_self.validateSubmit();
		},uploadFailed:function(data){
			_jM.tooltip.showTip("caseAddAttachment","文件上传失败，请重试");
		}});
		
		$("#sub_select").click(function(){
			_self.hideTooltip();
			var item = $(":radio:checked"); 
			var len=item.length;
			if(len>0){
				var serviceId=$('input[name="ulRadio"]:checked').val();
				_self.backCompetive(serviceId);
			}else{
				_jM.tooltip.showTip("sub_select","请选择一个案例");
			}
		});
	}
	
	this.query = function(p)
	{
		_self.getServiceList(p);
	}
	
	this.getPager = function(){
		return _pager;
	}
	
	this.buildQueryPage = function(p)
	{
		p.start = (p.page-1)*p.rows;
		p.limit = p.rows;
		return p;
	}
	//---------validate---------------
	this.vtTitle=function(){
		var val=$("#serviceTitle").val();
		if(_jM.validate.isEmpty(val)){
			_jM.tooltip.showTip("serviceTitle","名称不能为空");
			return false;
		}
		
		if(!_jM.validate.isLengthBetween(val,1,20)){
			_jM.tooltip.showTip("serviceTitle","名称长度不超过20");
			return false;
		}
		return true;
	}
	this.vtDesc=function(){
		var val=$("#serviceDesc").val();
		if(_jM.validate.isEmpty(val)){
			_jM.tooltip.showTip("serviceDesc","描述不能为空");
			return false;
		}
		if(!_jM.validate.isLengthBetween(val,1,1000)){
			_jM.tooltip.showTip("serviceDesc","描述最多1000字");
			return false;
		}
		return true;
	}
	this.vtAtta=function(imgData){
//		var val=$("#caseAttachment").val();
//		if(_jM.validate.isEmpty(val)){
//			_jM.tooltip.showTip("caseAddAttachment","请上传文件");
//			return false;
//		}
		if(imgData==null){
			_jM.tooltip.showTip("caseAddAttachment","请上传文件");
			return false;
		}
		if(imgData.length<=0){
			_jM.tooltip.showTip("caseAddAttachment","请上传文件");
			return false;
		}
		return true;
	}
	//--------------submit--------------
	this.validateSubmit=function(imgData){
		_self.hideTooltip();
		if(!_self.vtTitle()) return;
		if(!_self.vtDesc()) return;
		if(!_self.vtAtta(imgData)) return;
		_self.submitData(imgData);
	}
	
	this.submitData=function(imgData){
		
		var needid = $("#needId").val();
		var p = {
				serviceDesc:$("#serviceDesc").val(),
				serviceTitle:$("#serviceTitle").val()
		};
		$.extend(p, imgData.data);
		$.post('/bp/serviceInfo/saveForCompetitive/'+needid, p, function(result){
			if(result.success){
				_self.backCompetive(result.data);
			}else{
				_jM.tooltip.showTip("sub_update","提交失败");
			}
		});
	}
	
	this.buildImgData = function(obj){
		var imgData = {};
		for (var i = 0; i < obj.length; i++) 
		{
			imgData['imgData['+i+'].fileUrl'] = obj[i].url;
			var subItem = obj[i].subItems;
			if(subItem && subItem.length > 0)
			{
				for (var j = 0; j < subItem.length; j++) 
				{
					imgData['imgData['+i+'].subItem['+j+'].url'] = subItem[j].url;
					imgData['imgData['+i+'].subItem['+j+'].imgType'] = subItem[j].imgType;
				}
			}
		}
		return {data:imgData,length:obj.length};
	}
	
	this.hideTooltip=function(){
		_jM.tooltip.hideTip("caseAddAttachment");
		_jM.tooltip.hideTip("sub_select");
		_jM.tooltip.hideTip("serviceTitle");
		_jM.tooltip.hideTip("serviceDesc");
		_jM.tooltip.hideTip("sub_update");
	}
	
	this.backCompetive=function(successCaseId){
//		parent._jM.dialog.showModeDialog({
//			id:"competiveContainer",
//			height:655,
//			width:540,
//			heightstr:"auto",
//			position:"absolute",
//			url:"/pc/contract/join.html?successCaseId="+successCaseId+"&nid="+nid
//		});
//		parent._jM.dialog.hiddenModeDialog("successCaseContainer");
		//window.location.href="/pc/contract/join.html?successCaseId="+successCaseId+"&nid="+nid
		clickUpcase();
		//-----------------------------------
		parent._jM.dialog.showClose();
		
		$("#successCaseId").val(successCaseId);
		
		$("#successCaseView").hide();
		$("#backCompetive").hide();
		$("#competiveView").show();
		parent.iFrameHeightById("competiveContainer");
	}
	
	
	/**
	 * Get need list by parameter(page and search keyword).
	 */
	this.getServiceList = function(p){
		var data=_self.buildQueryPage(p);
		_jM.post("/bp/serviceInfo/getDataList", data , function(rs ,data){
			var html="";
			if(data.rows.length > 0)
			{
				for(var i=0; i<data.rows.length; i++)
				{
					var item = data.rows[i];
					html+="<li><div class='upLoad_img float_l'><img src='"+item.firstImg+"' style='width:56px;height:56px;'></div>";
					html+="<div class='upLoad_info float_l'>"+item.serviceTitle+"</div>";
					html+="<div class='upLoad_radio float_r'>";
					html+="<input type='radio' name='ulRadio' value='"+item.id+"'></div>";
					html+="<div class='clearfix'></div></li>";
				}
				_pager.init({
				   PageNum   : _PageNum,
				   rows      : _rows,
				   totalCount: data.totalCount,
				   divId     :"zonePager"
				}, p.page-1);
			}
			else
			{
				var currPage = _self.getPager().currPage;
				if(currPage > 0)
				{
					_queryParams.page = 1;
					_self.query(_queryParams);
					return;
				}
				html="<div class='zone_empty'>目前还没有任何记录!</div>";
				$("#zonePager").html("");
			}
			$("#caseList").html(html);
		},function(rs){
			alert(rs);
		});
	}
//end
}
//------remove file-----------
function removefile(fid){
	$("#fid"+fid).remove();
	_upload.removeFile(fid);
}

function backCompetive(){
	clickUpcase();
	//---------------
	parent._jM.dialog.showClose();
	$("#successCaseView").hide();
	$("#backCompetive").hide();
	$("#competiveView").show();
	parent.iFrameHeightById("competiveContainer");
}

function clickUpcase(){
	_sc.hideTooltip();
	$("#upcase").addClass("index");
	$("#selectcase").removeClass("index");
	$("#upcase_div").show();
	$("#sub_update").show();
	$("#selectcase_div").hide();
	$("#sub_select").hide();
}