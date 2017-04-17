var _per=null;

$(document).ready(function(){
	_per=new personal();
	_per.init();
});

function personal(){
	var _self=this;
	
	this.init=function(){
		_self.getCustInfo();
		_self.getServiceInfo();
		_self.getCustCount();
		_self.getNeedList();
		_self.getserviceList();
	}
	
	//get custom info
	this.getCustInfo=function(){
		_jM.post("/bp/custBase/getCustInfoForCenterPersonal",null,function(rs,data){
			if(rs==null){
				return;
			}
			
			if(data.custType==1){
				$("#nickTitle").html("用户昵称：");
			}else if(data.custType==2&&data.custAuthenticat){
				$("#nickTitle").html("公司名称：");
			}else if(data.custType==2&&!data.custAuthenticat){
				$("#nickTitle").html("公司昵称：");
			}
			
			$("#nickName").html(data.custNickname);
			$("#signature").html(data.signature);
			if(_jM.validate.isNotEmpty(data.custImage)){
				$("#custImage").attr("src",data.custImage);
			}
			
			var html="";
			var techList=data.custTechniques.split("，");
			for (var  i= 0;  i< techList.length; i++) {
				html+="<span class='btn'>"+techList[i]+"</span>";
			}
			$(".content_btn").html(html);
			$("#custDesc").html(data.custDesc);
			
		},function(rs){
			
		});
	}
	
	/*服务内容*/
	this.getServiceInfo=function(){
		_jM.post("/bp/serviceInfo/getDataList",{serviceStatus:5},function(rs,data){
			if(rs==null){
				return;
			}
			
		},function(rs){
			
		});
	}
	
	/*客户综合评价*/
	this.getCustCount=function(){
		_jM.post("/bp/custBase/getProNeedCustCount",null,function(rs,data){
			if(rs==null){
				return;
			}
			
		},function(rs){
			
		});
	}
	
	/*需求项目*/
	this.getNeedList=function(){
		_jM.post("/bp/need/list",null,function(rs,data){
			if(rs==null){
				return;
			}
			
		},function(rs){
			
		});
	}
	
	/*服务项目*/
	this.getserviceList=function(){
		_jM.post("/bp/needCompetitiveRef/list",null,function(rs,data){
			if(rs==null){
				return;
			}
			
		},function(rs){
			
		});
	}
}