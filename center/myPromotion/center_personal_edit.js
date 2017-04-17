var _pe=null;
$(document).ready(function(){
	_pe=new personalEdit();
	_pe.init();
});

function personalEdit(){
	var _self=this;
	
	this.init=function(){
		/*初始化cate列表*/
		_self.getcateList("cate",1);
		_self.getcateList("ser",1);
		//_self.getcateList1();
		
		/*获取用户信息*/
		_self.getInfo();
		
		
		$("#cate1Inp").click(function(){_jM.dropMenu.show({showId:'cate1Inp',menuId:'cate1list',top:32});});
		$("#cate2Inp").click(function(){_jM.dropMenu.show({showId:'cate2Inp',menuId:'cate2list',top:32});});
		$("#cate3Inp").click(function(){_jM.dropMenu.show({showId:'cate3Inp',menuId:'cate3list',top:32});});
		
		$("#ser1Inp").click(function(){_jM.dropMenu.show({showId:'ser1Inp',menuId:'ser1list',top:32});});
		$("#ser2Inp").click(function(){_jM.dropMenu.show({showId:'ser2Inp',menuId:'ser2list',top:32});});
		$("#ser3Inp").click(function(){_jM.dropMenu.show({showId:'ser3Inp',menuId:'ser3list',top:32});});
		
		$("#submitData").click(function(){_self.upData()});
	}
	
	/*validate data*/
	this.vtSinature=function(){
		if(_jM.validate.isLengthBetween($("#signature").val(),0,15)){
			_jM.tooltip.showTip("signature","请不要超过15个字");
			return false;
		}
		return true;
	}
	
	this.vtDesc=function(){
		if(_jM.validate.isLengthBetween($("#custDesc").val(),0,3000)){
			_jM.tooltip.showTip("custDesc","请不要超过3000个字");
			return false;
		}
		return true;
	}
	
	this.vtNick=function(){
		if(_jM.validate.isEmpty($("#nickName").val())){
			_jM.tooltip.showTip("nickName","请填写昵称");
			return false;
		}
		if(_jM.validate.isLengthBetween($("#nickName").val(),1,64)){
			_jM.tooltip.showTip("nickName","请不要超过64个字");
			return false;
		}
		return true;
	}
	
	this.vtTech=function(){
		var num=0;
		for(var i=0;i<5;i++){
			if(_jM.validate.isEmpty($("#tech"+i).val())){
				num++;
			}
		}
		
		if(num<3){
			_jM.tooltip.showTip("submitData","最少填写三个");
			return false;
		}
		return true;
	}
	
	
	/*get Cust Info For Center Personal*/
	this.getInfo=function(){
		_jM.post("/bp/custBase/getCustInfoForCenterPersonal",null,function(rs,data){
			if(rs==null){
				return;
			}
			if(data.custType==1){
				$("#niackTitle").html("用户昵称");
				$("#logoTitle").html("个人logo");
			}else if(data.custType==2&&data.custAuthenticat){
				$("#niackTitle").html("公司名称");
				$("#logoTitle").html("公司logo");
			}else if(data.custType==2&&!data.custAuthenticat){
				$("#niackTitle").html("公司昵称");
				$("#logoTitle").html("公司logo");
			}
			
			$("#nickName").val(data.custNickname);
			$("#nickNameShow").val(data.custNickname);
			$("#signature").val(data.signature);
			$("#custDesc").html(data.custDesc);
			
			var techList=data.custTechniques.split("，");
			for (var  i= 0;  i< techList.length; i++) {
				$("#tech"+i).val(techList[i]);
			}
			
			if(data.updateNicknameNum==0){
				$("#nickName").show();
				$("#nickNameShow").hide();
			}
			
		},function(rs){
			
		});
	}
	/*update Cust Info In Center Personal*/
	this.upData=function(){
		var techs="";
		for(var i=0;i<5;i++){
			if(_jM.validate.isNotEmpty($("#tech"+i).val())){
				techs+=$("#tech"+i).val()+"，";
			}
		}
		if(_jM.validate.isNotEmpty(techs)){
			techs=techs.substring(0,techs.length-1);
		}
		
		var data={
			custCategorys:$("#cate3InpVal").val(),
			custTechniques:techs,
			custNickname:$("#nickName").val(),
			signature:$("#signature").val(),
			custImage:""
		}
		
		_jM.post("/bp/custBase/updateCustInfoInCenterPersonal",data,function(rs,data){
			
		},function(rs){
			
		})
	}
	
	/*update Cust Desc In Center Personal*/
	this.upDesc=function(){
		_jM.post("/bp/custBase/updateCustDescInCenterPersonal",{custDesc:$("#custDesc").val()},function(rs,data){
			
		},function(rs){
			
		})
	}
	
	
	/*cate list */
	this.getcateList=function(type,cateLevel,firstId,secondId){
		var cateGoryList=null;
		if(cateLevel==1){
			cateGoryList=_categoryList;
		}else if(cateLevel==2){
			cateGoryList=_jM.cate.getL2cateList(firstId);
		}else if(cateLevel==3){
			cateGoryList=_jM.cate.getL3cateList(firstId,secondId);
		}
		
		if(cateGoryList==null||cateGoryList.length==0){
			$("#"+type+"3Inp").val("暂无三级分类");
			return;
		}else{
			var html="";
			for (var i = 0; i < cateGoryList.length; i++) {
				html+="<li onclick='_pe.cateClick(\""+cateGoryList[i].name+"\","+cateGoryList[i].id+",\""+type+"\","+cateLevel+")'>"+cateGoryList[i].name+"</li>"
			}
			var catelist=type+cateLevel+"list";
			$("#"+catelist).html(html);
			
			if(cateLevel==1){
				_self.getcateList(type,2,cateGoryList[0].id);
				_self.cateClick(cateGoryList[0].name,cateGoryList[0].id,type,1);
			}else if(cateLevel==2){
				_self.getcateList(type,3,firstId,cateGoryList[0].id);
				_self.cateClick(cateGoryList[0].name,cateGoryList[0].id,type,2);
			}else if(cateLevel==3){
				_self.cateClick(cateGoryList[0].name,cateGoryList[0].id,type,3);
			}
			
		}
		
	}
	/*cate click */
	this.cateClick=function(name,id,type,cateLevel){
		var cateInp=type+cateLevel+"Inp";
		var cateInpVal=type+cateLevel+"InpVal";
		var catelist=type+cateLevel+"list";
		
		$("#"+cateInp).val(name);
		$("#"+cateInpVal).val(id);
		$("#"+catelist).hide();
		
		if(cateLevel==1){
			_self.getcateList(type,2,id);
		}else if(cateLevel==2){
			_self.getcateList(type,3,$("#"+type+"1InpVal").val(),id);
		}
		
	}
	
}