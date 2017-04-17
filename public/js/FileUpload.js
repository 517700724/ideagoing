/**
 * File upload component.
 */

function FileUpload(){
	
	//Current object.
	var _self = this;
	
	//Upload parameters.
	var _param = null;
	
	//Upload file formatter.
	var _regex = null;
	
	var _fileId = 1;
	
	/**
	 * Initial upload component.
	 * 
	 * uploadFrameId
	 * uploadFormId
	 * selectId
	 * uploadFormat
	 * selectCallBack
	 * uploadCompleted
	 */
	this.init = function(p){
		_param = p;
		
		if(_param == null){
			alert("Specified param can not be null!");
			return;
		}
		if(typeof(_param.uploadFrameId) == "undefined" 
				|| _param.uploadFrameId == null || _param.uploadFrameId == ""){
			alert("Upload frame id can not be null!");
			return;
		}
		if(typeof(_param.uploadFormId) == "undefined" 
				|| _param.uploadFormId == null || _param.uploadFormId == ""){
			alert("Upload form id can not be null!");
			return;
		}
		if(typeof(_param.selectId) == "undefined" 
			|| _param.selectId == null || _param.selectId == ""){
			alert("Select file id can not be null!");
			return;
		}
		if(typeof(_param.uploadNumber) == "undefined" 
			|| _param.uploadNumber == null || _param.uploadNumber == ""){
			_param.uploadNumber = 5;
		}
		if(typeof(_param.uploadFormat) != "undefined" 
				&& _param.uploadFormat != null && _param.uploadFormat != ""){
			var regex = "";
			
			for(var i =0; i<_param.uploadFormat.length; i++){
				regex+="."+_param.uploadFormat[i] + (i==_param.uploadFormat.length-1?"":"|");
			}
			_regex= new RegExp(regex);
		}
		
		$("#"+_param.uploadFormId).submit(_self.validateFile);
		$("#"+_param.uploadFrameId).load(_self.complete);
		//Add file input
		_self.addFile();
	}
	
	/**
	 * Add file to upload list.
	 */
	this.addFile = function(){
		var fileNumber = _self.getFileNumber();
		if(fileNumber < _param.uploadNumber){
			
			var top   = $("#"+_param.selectId).offset().top;
			var left  = $("#"+_param.selectId).offset().left;
			var width = $("#"+_param.selectId).width();
			var height= $("#"+_param.selectId).height();
			var zIndex= _fileId;
			
			var input = "<input type='file' name='file' id='uploadFile"+_fileId+"' style='position:absolute;z-index:"+zIndex
				+";width:"+width+"px;height:"+height+"px;top:"+top+"px;left:"+left
				+"px;background-color:#ddd;font-size:100px;overflow:hidden;opacity:0;filter:alpha(opacity=0);cursor:pointer' "
				+"onchange='_upload.changeFile(this)'/>";
				
			$("#"+_param.uploadFormId).append(input);
			_fileId++;
			
		}
	}
	
	/**
	 * Remote file.
	 */
	this.removeFile = function(id){
		if(id != null && id.length>0){
			$("#"+id).remove();
		}
		
//		var fileList = _self.getFileList();
//		var isExist = false;
		
//		for(var i=0; i<fileList.length; i++){
//			var name = $(fileList[i]).val();
//			if(name == null || name.length<=0){
//				isExist = true;
//				break;
//			}
//		}
		
		if(!_self.isExist()){
			//Add new file.
			_self.addFile();
		}
		
		//Selected file call back.
		if(typeof(_param.selectCallBack) != "undefined" && _param.selectCallBack != null){
			_param.selectCallBack(_self.getFileObjectList());
		}
	}
	
	/**
	 * isExist
	 */
	this.isExist=function(){
		var currLne=0;
		var nullinp=0;
		var maxlength=_param.uploadNumber;
		var listLength=0;
		
		if($("#inpuploadFile1")!=null&&$("#inpuploadFile1").length>0){
			currLne++;
		}
		if($("#inpuploadFile2")!=null&&$("#inpuploadFile2").length>0){
			currLne++;
		}
		if($("#inpuploadFile3")!=null&&$("#inpuploadFile3").length>0){
			currLne++;
		}
		
		
		var fileList = _self.getFileList();
		listLength=fileList.length;
		for(var i=0; i<fileList.length; i++){
			var name = $(fileList[i]).val();
			if(name == null || name.length<=0){
				nullinp++;
			}
		}
		
		var isflag=nullinp-currLne;
		
		if(isflag>0){
			return true;
		}else{
			return false;
		}
	}
	/**
	 * Select file changed.
	 */
	this.changeFile = function(obj){
		var file = obj.value.toLowerCase();
		if(file==null||file==""||file.length<0){
			return;
		}
		if(_regex != null && !_regex.test(file)){
			alert("不支持的上传文件格式："+file+"，目前仅支持的格式为："+_param.uploadFormat);
			
			//Delete select file.
			$(obj).remove();
		}
		//Add new file.
		_self.addFile();
		
		//Selected file call back.
		if(typeof(_param.selectCallBack) != "undefined" && _param.selectCallBack != null){
			_param.selectCallBack(_self.getFileObjectList());
		}
	}
	
	/**
	 * Upload validate, remove empty file.
	 */
	this.validateFile = function(){
		var fileList = _self.getFileList();
		var length = fileList.length;
		var flagLength=length;
		
		for(var i=0; i<fileList.length; i++){
			var name = $(fileList[i]).val();
			if(name == null || name.length<=0){
				flagLength--;
			}
		}
		
		if(flagLength <= 0){
			_param.submitdata();
			return false;
		}

		for(var i=0; i<fileList.length; i++){
			var name = $(fileList[i]).val();
			if(name == null || name.length<=0){
				$(fileList[i]).remove();
				length--;
			}
		}
		
		_jM.dubDatalayer.show({id:"globalModeLayer"});
		setTimeout("uptimeOut()",1000*60*5);//1000为1秒钟,设置为5分钟。 
		return true;
	}
	
	/**
	 * Get can upload.
	 */
	this.canUpload = function(){
		var fileList = _self.getFileList();
		for(var i=0; i<fileList.length; i++){
			var name = $(fileList[i]).val();
			if(name != null && name.length > 0){
				return true;
			}
		}
		return false;
	}
	
	/**
	 * Get input file list.
	 */
	this.getFileList = function(){
		var fileList = $("#"+_param.uploadFormId).find("input[name='file']");
		return fileList == null ? new Array():fileList;
	}
	
	/**
	 * Get file object list.
	 */
	this.getFileObjectList = function(){
		var fileList = _self.getFileList();
		var rs = new Array();
		
		for(var i=0; i<fileList.length; i++){
			if(fileList[i].value == null || fileList[i].value == "")
				continue;
			
			var file = fileList[i].value.toLowerCase();
			rs[rs.length] = {id:fileList[i].id, name:file.substring(file.lastIndexOf("\\")+1)};; 
		}
		return rs;
	}
	
	/**
	 * Get file number.
	 */
	this.getFileNumber = function(){
		return _self.getFileList().length;
	}
	
	/**
	 * Get upload result.
	 */
	this.complete = function(){
		_jM.dubDatalayer.hidden({id:"globalModeLayer"});
		
		var f = $(window.frames[_param.uploadFrameId].document).contents().text();
		if(f == null || f.length<=0)return;
		var con = eval('(0,' + f + ')');

//		if(_param.uploadCompleted != null){
//			_param.uploadCompleted(con);
//		}
		if(con.statusCode == 1){
			if(_param.uploadFailed != null){
				_param.uploadFailed(con);
			}
		}else{
			if(_param.uploadSuccess != null){
				_param.uploadSuccess(con.result);
			}
		}
		
		var fileList = _self.getFileList();
		for(var i=0; i<fileList.length; i++){
			$(fileList[i]).remove();
		}
	}
	
	/**
	 * Upload component resize.
	 */
	this.resize = function(){
		var fileList = _self.getFileList();
		var top   = $("#"+_param.selectId).offset().top;
		var left  = $("#"+_param.selectId).offset().left;
		
		for(var i=0; i<fileList.length; i++){
			$(fileList[i]).css("top",top+"px");
			$(fileList[i]).css("left",left+"px");
		}
	}
	
	/**
	 * Get upload urls.
	 */
	this.upload_getURL = function(obj){
		var urls="";
		
		for(var i=0; i<obj.length; i++){
			if(obj[i].status == 0){
				var index  = obj[i].fileName.lastIndexOf("\\");
				var resName= (index !=-1?obj[i].fileName.substring(index+1):obj[i].fileName);
		
				urls+= resName+"*"+obj[i].url+"|";
			}
		}
		return urls;
	}
	
	
}

var _upload = null;
$(document).ready(function(){_upload = new FileUpload();});
$(window).resize(function(){_upload.resize();});

/**
 * up time out
 */

function uptimeOut(){
	_jM.dubDatalayer.hidden({id:"globalModeLayer"});
	alert("上传超时，请重试");
}