var _pl=null;
var _rows=10;	//每页展示行数
var _PageNum=5;	//每页连接数
var _currUid=null;
var _providerListArry=new Array();

$(document).ready(function(){
	_pl=new Providerlist();
	_pl.init();
	
		var isOut = true;
	    var other = document.getElementsByTagName('body')[0];
	    
	    $(".menu_show").click(function(){
	    	isOut = false;
	    });
	    $("#currentTypeName").click(function(){
	    	isOut = false;
	    });
	    $("#currentTypeNameL2").click(function(){
	    	isOut = false;
	    });
	    
	    other.onclick = function(){
	        if(isOut){
	        	_pl.hideChild2cate();
	        	_pl.hideChild3cate();
	        }
	         isOut = true;
	    }
});

function Providerlist(){
	var _page = new Paging();
	var _self=this;
	var _custCategory = 0;//当前业务分类id
	var _custType = 0;//当前用户分类id
	
	this.init=function(){
		_self.TabCategoryL1();
		_self.initSearch();
		
		$("#alltypeTop").click(function(){
			//_self.level1Click($("#catali0"),0,"全部分类");
			_self.defaultStatus();

		});
	}
	/**
	 * click default status
	 */
	this.defaultStatus=function(){
		_self.TabCategoryL1();
		
		$("#sv_top_l2").hide();
		$("#menu_show2").hide();
		
		$(".sertypeClicked").removeClass("sertypeClicked");
		$("#cateli0").addClass("sertypeClicked");
		
		$("#currentTypeName").html("<a class='sv_last'  style='cursor:pointer;' onclick='_pl.showChild2cate(0)'><span >全部分类</span></a>");
		$("#showcurrentTypeName").html("<a class='sv_last_a' onclick='_pl.hideChild2cate()' ><span>全部分类</span></a>");
		
		$("#custT"+_custType).addClass("custClicked");
		_custCategory = 0;
		_self.setTopCategoryL1(_custCategory);
		_self.initSearch(1);
	}
	
	/**
	 * Tab Category L1
	 */
	this.TabCategoryL1 = function(){
		var categoryList=_categoryList;
		var html="<li class='menu_li sertypeClicked' id='cateli0'   onclick='_pl.level1Click(this,0,\"全部分类\")'>全部分类</li>";
		
		for(var i=0; i<categoryList.length; i++){
			html+="<li class='menu_li' id='cateli"+categoryList[i].id+"' onmousemove ='_pl.previewL1("+categoryList[i].id+")'" +
					"onmouseout ='_pl.hidePreview("+categoryList[i].id+")' onclick=\"_pl.level1Click(this,"+categoryList[i].id+",'"+categoryList[i].name+"')\">"+categoryList[i].name+"</li>";
		}
		$("#TabCategory").html(html);
	}
	
	/**
	 * Level 1 category item click.
	 */
	this.level1Click = function(obj, pid,currentTypeName){
		$("#sv_top_l2").hide();
		$("#menu_show2").hide();
		
		if(obj != null){
			$(".sertypeClicked").removeClass("sertypeClicked");
			$(obj).addClass("sertypeClicked");
			
			var iurldown="";
			var iurlup="";
			if(pid!=0){
				iurldown="<img src='/pc/sever/image/icon_down.png' >";
				iurlup="<img src='/pc/sever/image/icon_up.png' >";
			}
			
			$("#currentTypeName").html("<a class='sv_last'  style='cursor:pointer;' onclick='_pl.showChild2cate("+pid+")'><span >"+currentTypeName+"</span>"+iurldown+"</a>");
			$("#showcurrentTypeName").html("<a class='sv_last_a' onclick='_pl.hideChild2cate()' ><span>"+currentTypeName+"</span>"+iurlup+"</a>");
		}
		
		$("#custT"+_custType).addClass("custClicked");
		_custCategory = pid;
		_self.setTopCategoryL1(_custCategory);
		_self.initSearch(1);
	}
	/**
	 * Level 2 category item click.
	 */
	this.level2Click = function(obj, pid,currentTypeName,idL2){
		if(obj != null){
			var cate3list=_self.getcate3List(pid,idL2);
			var iurldown="";
			var iurlup="";
			
			$(".sertypeClicked").removeClass("sertypeClicked");
			$(obj).addClass("sertypeClicked");
			
			if(cate3list!=null&&cate3list.length>0){
				iurldown="<img src='/pc/sever/image/icon_down.png' >";
				iurlup="<img src='/pc/sever/image/icon_up.png' >";
			}
			
			$("#currentTypeNameL2").html("><a class='sv_last'  style='cursor:pointer;' onclick='_pl.showChild3cate("+pid+","+idL2+")'><span >"+currentTypeName+"</span>"+iurldown+"</a>");
			$("#showcurrentTypeNameL2").html("><a class='sv_last_a' onclick='_pl.hideChild3cate()'><span>"+currentTypeName+"</span>"+iurlup+"</a>");
			
			$("#level1Click").hide();
		}
		
		$("#custT"+_custType).addClass("custClicked");
		_custCategory = pid;
		_self.setTopCategoryL2(pid,idL2);
		_self.initSearch(1);
	}
	/**
	 * Level 3 category item click.
	 */
	this.level3Click = function(obj,pid){
		if(obj != null){
			$(".sertypeClicked").removeClass("sertypeClicked");
			$(obj).addClass("sertypeClicked");
			_custCategory = pid;
			$("#custT"+_custType).addClass("custClicked");
			_self.initSearch(1);
		}
	}

	/**
	 * Custom type click.
	 */
	this.custTypeClick = function(obj, custType){
		if(obj != null){
			$(".custClicked").removeClass("custClicked");
			$(obj).addClass("custClicked");
		}
		
		_custType = custType;
		_self.initSearch(1);
	}
	/**
	 * show Child 2 category
	 */
	this.showChild2cate=function(pid){
		if(pid==0){
			return;
		}
		$("#currentTypeName").hide();
		$("#showcurrentTypeName").show();
		$("#menu_show1").show();
		_self.hideChild3cate();
	}
	/**
	 * show Child 3 category
	 */
	this.showChild3cate=function(pid,idL2){
		
		var cateChildList=_self.getcate2List(idL2);
		
		if(cateChildList!=null&&cateChildList.length>0){
			$("#currentTypeNameL2").hide();
			$("#showcurrentTypeNameL2").show();
			$("#menu_show2").show();
			
			_self.showChild3cate();
			_self.setTopCategoryL2(pid,idL2);
			_self.hideChild2cate();
		}
	}
	/**
	 * get category 2 info
	 */
	this.setTopCategoryL1=function(pid){
		if(pid!=0){
			var cateChildList=_self.getcate2List(pid);
			var num=cateChildList.length;
			
			var tophtml="";
			var tabhtml="<li class='menu_li sertypeClicked' id='cateli"+pid+"'   onclick='_pl.level2Click(this,"+pid+",\"全部分类\","+pid+")'>全部分类</li>";
			
			for(var i=0;i<_categoryList.length;i++){
				tophtml+="<li style='cursor:pointer;' id='cateli"+_categoryList[i].id+"' onclick=\"_pl.level1Click(this,"+_categoryList[i].id+",'"+_categoryList[i].name+"')\">"+_categoryList[i].name+"</li>";
			}
			for(var i=0;i<num;i++){
				tabhtml+="<li class='menu_li' id='cateli"+cateChildList[i].id+"' onmousemove ='_pl.previewL2("+cateChildList[i].id+","+pid+")' " +
						 "onmouseout ='_pl.hidePreview("+cateChildList[i].id+")' onclick=\"_pl.level2Click(this,"+cateChildList[i].id+",'"+cateChildList[i].name+"',"+pid+")\">"+
						 cateChildList[i].name+"</li>";
			}
			$("#menu_l1").html(tophtml);
			$("#TabCategory").html(tabhtml);
			//$("#sv_top_l2").show();
		}else{
			$("#menu_l1").html("");
		}
	}
	/**
	 * get category 3 info
	 */
	this.setTopCategoryL2=function(pid,idL2){
		var cateChildList2=_self.getcate2List(idL2);
		var cateChildList=_self.getcate3List(pid,idL2);
		if(cateChildList!=null&&cateChildList.length>0){
			var num=cateChildList.length;
			
			var tophtml="";
			var tabhtml="<li class='menu_li sertypeClicked' id='cateli"+pid+"'   onclick='_pl.level3Click(this,"+pid+")'>全部分类</li>";
			
			for(var i=0;i<cateChildList2.length;i++){
				tophtml+="<li style='cursor:pointer;' id='cateli"+cateChildList2[i].id+"' onclick=\"_pl.level2Click(this,"+cateChildList2[i].id+",'"+cateChildList2[i].name+"',"+idL2+")\">"+cateChildList2[i].name+"</li>";			}
			
			for(var i=0;i<num;i++){
				tabhtml+="<li class='menu_li' id='cateli"+cateChildList[i].id+"' onmousemove ='_pl.previewL2("+cateChildList[i].id+","+pid+")' " +
				"onmouseout ='_pl.hidePreview("+cateChildList[i].id+")' onclick=\"_pl.level3Click(this,"+cateChildList[i].id+")\">"+
				cateChildList[i].name+"</li>";
			}
			$("#menu_l2").html(tophtml);
			$("#TabCategory").html(tabhtml);
			$("#sv_top_l2").show();
		}else{
			$("#menu_l2").html("");
			_self.hideChild3cate();
			_self.setTopCategoryL1(idL2);

			if(pid!=idL2){
				$(".sertypeClicked").removeClass("sertypeClicked");
				$("#cateli"+pid).addClass("sertypeClicked");
			}
			$("#custT"+_custType).addClass("custClicked");

		}
	}
	/**
	 * get category 2 List
	 */
	this.getcate2List=function(pid){
		if(pid==0){
			return;
		}
		var cateChildList=null;
		for(var i=0; i<_categoryList.length; i++){
			if(_categoryList[i].id==pid){
				cateChildList=_categoryList[i].children;
			}
		}
		return cateChildList;
	}
	/**
	 * get category 3 List
	 */
	this.getcate3List=function(pid,topid){
		var cate2List=_self.getcate2List(topid);
		var cate3List=null;
		if(cate2List!=null){
			for(var i=0; i<cate2List.length; i++){
				if(cate2List[i].id==pid){
					cate3List=cate2List[i].children;
				}
			}
		}
		return cate3List;
	}
	
	this.hideChild2cate=function(){
		$("#currentTypeName").show();
		$("#showcurrentTypeName").hide();
		$("#menu_show1").hide();
	}
	this.hideChild3cate=function(){
		$("#currentTypeNameL2").show();
		$("#showcurrentTypeNameL2").hide();
		$("#menu_show2").hide();
	}
	/**
	 * Initial search.
	 */
	this.initSearch = function(pageNo){
		var cpage=parseInt(_jM.getMark("page")||1);
		var params = {
			rows:_rows,
			page:pageNo || cpage, 
			"param.custType":(_custType == 0?"":_custType),
			"param.custCategory":(_custCategory == 0?"":_custCategory)
		};
		var queryMode = _jM.getParam('queryMode');
		if(queryMode != null)
			params['param.queryMode'] = queryMode;
		var needId = _jM.getParam('needId');
		if(needId != null)
			params['param.needId'] = needId;
		
		_self.search(params,_self);
	}
	
	/**
	 * Do search list.
	 */
	this.search = function(p){
		var currid=null;
		
		_jM.login.getLogin(function(data){
			currid=data.custId;
		},function(){
			$('#focusBlock').click(function(){_jM.login.go();});
		});
		
		$.post("/bp/custBase/publicList",p, function(data){
			var html="";
			
			
			if(data!=null && data.rows.length>0){
				for(var i = 0; i < data.rows.length; i++) {
					var row =data.rows[i];
					var custSrc="";
					var vSrc="";
					var custServiceStr="";
					var favoriteUrl="";
					var clickfun="";
					var focusBlock="";
					
					_providerListArry.push(row.id);
					
					if(row.custType==2){
						custSrc="/pc/sever/image/enterQ.png";
					}else{
						custSrc="/pc/sever/image/perG.png";
					}
					if(row.custAuthenticat==1){
						vSrc="/pc/sever/image/vflag.png";
					}else{
						vSrc="/pc/sever/image/vflag_gray.png";
					}
					var custserviceNum=row.custServiceInfos.length>2?2:row.custServiceInfos.length;
					for (var j = 0; j < custserviceNum; j++) {
						var custServiceInfo=row.custServiceInfos[j];
						custServiceStr+="<a target='_blank' style='color: #ff6600;text-decoration: underline' href='"+custServiceInfo.serviceUrl+"'>"+
						custServiceInfo.serviceTitle+"</a>&ensp;";
					}
					if(custserviceNum==0){
						custServiceStr="服务商暂时没有编辑服务内容";
					}
					
					if(row.id != currid){
						clickfun="onclick='favoriteOperate("+row.id+")'";
					}
					else{
						focusBlock="display:none;";
					}
					
					html+="<div class='sv_main bg_color2'><div class='sv_m_l float_l text_m'>";
					html+="<a target='_blank' style='cursor:pointer;' onclick='_pl.goDetails(\""+row.custUrl+"\")'><img style='width:150px;' src='"+_jM.ideagoing.getDefaultPhoto(row.custImage, row.custType)+"'></a></div>";
					html+="<div class='sv_m_m float_l'><h3 style='cursor:pointer;'  onclick='_pl.goDetails(\""+row.custUrl+"\")'><p style='width: 320px;float: left;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height:28px;'>"+row.custNickname+"</p>";
					html+="<a href=''><img align='top' src='"+custSrc+"'></a>";
					html+="<a href=''><img src='"+vSrc+"'></a></h3>";
					html+="<ul class='m_comment'>";
					html+="<li>成功案例：<span>0</span></li>";
					html+="<li>诚信分：<span>"+row.custIntegrityLevel+"分</span></li>";
					html+="<li>好评率：<span>"+row.custGoogLevel+"%</span></li><div class='clearfix'></div></ul>";
					html+="<p class='sv_text' style='overflow: hidden;text-overflow: ellipsis; white-space: nowrap;width:396px;'>用户简介："+row.custDesc+"</p>";
					html+="<div class='sv_skill'><label>擅长技能：</label><span>"+row.custTechniques+"</span></div>";
					html+="<div class='sv_nr'><label>服务内容：</label><span class='color_f'>"+custServiceStr+"</span></div>";
					html+="</div><div class='sv_m_r float_r'>";
					html+="<div style='"+focusBlock+"' class='sv_gz text_r'><a style='cursor:pointer;' "+clickfun+" class='gz_btn borderCl color_f' >";
					html+="<input type='hidden' id='focus"+row.id+"'>";
					
					if(row.isFavorited==0){
						html+="<img align='top' id='favoriteimg"+row.id+"' cid='"+row.id+"' src='/pc/sever/image/unfavorite.png' >" ;
					}else{
						html+="<img align='top' id='favoriteimg"+row.id+"' cid='"+row.id+"' src='/pc/sever/image/favorited.png' >" ;
					}
					
					html+="</a></div>";
					html+="<div class='userComment_btn'><a class='btn' target='_blank' onclick='_pl.goDetails(\""+row.custUrl+"\")'>客户综合评价</a></div>";
					html+="</div><div class='clearfix'></div></div>";
					
					if(row.invitationStatus != null)
					{
						if(row.invitationStatus == 0)
						{
							html+="<div id='invIcon_"+row.id+"' custId='"+row.id+"' status='0' class='invitationIconPos notInvitation' title='邀请竞标' onclick='sendInvitation(this)'></div>";
						}
						else
						{
							html+="<div id='invIcon_"+row.id+"' custId='"+row.id+"' status='1' class='invitationIconPos doneInvitation' title='已邀请竞标' onclick='sendInvitation(this)'></div>";
						}
					}
					html+="</li>";
				}
				
				_page.init({
					   PageNum   : _PageNum,
					   rows      : _rows,
					   totalCount:data.totalCount,
					   divId     :"personalListPager"
					}, data.pageNo-1);
			}else{
				html="<li style='width:100%;border:none;text-align:center;color: #888;height:80px;line-height:80px;list-style: none;'>目前还没有任何服务方！</li>";
				$("#personalListPager").html("");
			}
			$(".need_lists").html(html);
			hideMineInvIcon();
		});
	}
	
	/**
	 * show Favorite
	 */
	this.showFavorite=function(imgDom,custId){
//		var img = $(imgDom);
//		if($("#focus"+custId).val() != "")
//			return;
//		_jM.post("/bp/custFavorite/checkFavorite", {favoriteType:2,favoriteId:img.attr('cid')}, function(rs,data){
//			if(data){
//				img.attr("src","/pc/sever/image/favorited.png");
//				$("#focus"+custId).val(1);
//				
//			}else{
//				img.attr("src","/pc/sever/image/unfavorite.png");
//				$("#focus"+custId).val(0);
//			}
//		});
	}
	
	/**
	 * preview L1
	 */
	this.previewL1=function(index){
		var cateChildList=_self.getcate2List(index);
		_self.preview(index,cateChildList);
	}
	/**
	 * preview L2
	 */
	this.previewL2=function(index,idL1){
		var cateChildList=_self.getcate3List(index,idL1);
		if(cateChildList!=null&&cateChildList.length>0){
			_self.preview(index,cateChildList);
		}
	}
	
	/**
	 * preview child category
	 */
	this.preview=function(index,cateChildList){
		$(".mn_list_show").remove();
		if(cateChildList==null&&cateChildList.length<0){
			return;
		}
		
		var html="<div class='mn_list_show' id='catechild"+index+"'><div class='show_container'>"+
		"<div class='menuList_bg'><img src='/pc/sever/image/menuList_bg.png'></div>";
		
		if(cateChildList.length>0){
			var showNum=cateChildList.length>2?2:cateChildList.length;
			for(var i=0; i<showNum; i++){
				if(i==0){
					html+="<div class='sc_top' ><div class='sv_yl float_l'>预览：</div>";
				}
					html+="<div class='yl_list'><ul><li><a href=''>"+cateChildList[i].name+"</a></li>";
					
				var catechild2List=cateChildList[i].children;
				if(catechild2List.length>0){
					var showNum2=catechild2List.length>5?5:catechild2List.length;
					html+="<li>"
						for(var j=0; j<showNum2; j++){
							html+="<a href=''>"+catechild2List[j].name+"</a>";
						}
					html+="</li>"
				}
				html+="</ul></div>";
				if(i==0){
					html+="<div class='clearfix'></div></div>"
				}
			}
			html+="</div></div>";
		}
		$("#cateli"+index).append(html);
	}
	this.hidePreview=function(index){
		$("#catechild"+index).remove();
	}
	
	this.goDetails=function(src){
		window.open(src+"?custCategory="+_custCategory);
	}
	
}
function upPage(pageNo){
	scroll(0,0);
	_pl.initSearch(pageNo);
}

function hideMineInvIcon()
{
	if(_currUid == null)
	{
		_jM.login.getLogin(function(data){
			_currUid = data.custId;
			$('#invIcon_'+_currUid).hide();
		});
	}
	else
	{
		$('#invIcon_'+_currUid).hide();
	}
}

function checkFavorite(custId){
	var success = function(rs, data){
		var target = $('#focusBlock');
		if(data)
		{
			_favoriteUrl="/pc/sever/image/favorited.png";
		}
		else
		{
			_favoriteUrl="/pc/sever/image/unfavorite.png";
		}
	}
	_jM.post("/bp/custFavorite/checkFavorite", {favoriteType:2,favoriteId:custId}, success);
}

function favoriteOperate(custId)
{
	var success = function(rs, data){
		var target = $("#favoriteimg"+custId);
		if($("#focus"+custId).val() == 0)
		{
			target.attr("src","/pc/sever/image/favorited.png");
			$("#focus"+custId).val(1);
		}
		else
		{
			target.attr("src","/pc/sever/image/unfavorite.png");
			$("#focus"+custId).val(0);
		}
	}
	if($("#focus"+custId).val() == 0)
	{
		_jM.post("/bp/custFavorite/add", {favoriteType:2,favoriteId:custId}, success);
	}
	else
	{
		_jM.post("/bp/custFavorite/deleteEx", {favoriteType:2,favoriteId:custId}, success);
	}
}