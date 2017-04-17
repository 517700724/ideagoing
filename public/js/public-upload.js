/**
 * File upload component.
 */
function FileUpload(){
	var _p = null;
	var _isInit = false;
	var _self =this;
	var _regex = null;
	var _isUpload = false;
	
	/**
	 * p.uploadSelectId
	 * p.uploadFrameId
	 * p.uploadFormId
	 * p.uploadNumber
	 * p.uploadMaxSize
	 * p.uploadFormat
	 * p.uploadTooltip
	 * p.uploadSuccess
	 * p.uploadFailed
	 */
	this.init = function(p){
		if(p == null){
			alert("Init param can not be null!");
			return false;
		}
		_p = p;
		
		//Build format regex
		if(_p.uploadFormat != null){
			var regex="";
			for(var i =0; i<_p.uploadFormat.length; i++){
				regex+="."+_p.uploadFormat[i]+(i==_p.uploadFormat.length-1?"":"|");
			}
			_regex= new RegExp(regex);
		}
		
		var _fileObj = document.getElementById(_p.uploadSelectId);    
			_fileObj.addEventListener("change", _self.upload_select, false);
		$("#"+_p.uploadFrameId).bind("load",function(){_self.upload_completed();});
	}
	
	//Select file.
	this.select = function(){
		$("#"+_p.uploadSelectId).click();
	};
	
	//Upload select file
	this.upload_select = function(){
	    var fileList = this.files;  
	    var html = "";
	    var totalSize = 0;
	    _isUpload=true;
	    
	    for(var i = 0; i < fileList.length; i++){
	    	if(_regex != null){
	    		var fileName=fileList[i].name.toLowerCase();
	    		if(!_regex.test(fileName)){
					html="不支持："+fileList[i].name+"格式";
					_isUpload =false;
					break;
				}
	    	}
	    	
	        html+= fileList[i].name+";";
	        totalSize+=fileList[i].size;
	    }
	    if(_isUpload && fileList.length <=0){
	    	html="请选择文件！";
	    	_isUpload =false;
	    }
		if(_isUpload && fileList.length > _p.uploadNumber){
			html="文件不能超过"+_p.uploadNumber+"个";
			_isUpload =false;
		}
		if(_isUpload && totalSize <=0){
			html="文件总大小不能为0字节";
			_isUpload =false;
		}
	    if(_isUpload && totalSize > _p.uploadMaxSize){
	    	//html="文件"+_p.uploadMaxSize+"字节";
	    	html="文件不能超过"+(_p.uploadMaxSize/(1024*1024))+"M";
	    	_isUpload =false;
	    }
	    if(_p.uploadTooltip != null){
	    	_p.uploadTooltip(_isUpload, html);
	    }
	}

	this.canUpload = function(){
		return _isUpload;
	}
	
	//Do upload.
	this.upload = function(){
		if(_isUpload && _p.uploadFormId != null){
			$('#'+_p.uploadFormId).submit();
		}
	}

	//Upload completed event.
	this.upload_completed = function(){
		var f = $(window.frames[_p.uploadFrameId].document).contents().text();
		if(_jM.validate.isEmpty(f))return;
		var con = eval('(' + f + ')');

		if(con.statusCode == 1){
			if(_p.uploadFailed != null){
				_p.uploadFailed(con);
			}
		}else{
			if(_p.uploadSuccess != null){
				_p.uploadSuccess(con.result);
			}
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