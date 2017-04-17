var _pl=null;
var _rows=12;	//每页展示行数
var _PageNum=5;	//每页连接数
var _currUid=null;
var _providerListArry=new Array();

$(document).ready(function(){
	_pl=new Providerlist();
	_pl.init();
	
	//click other hide menu
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
	var _needStatus=0;
	
	this.init=function(){
		_self.TabCategoryL1();
		_self.initSearch();
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
		_self.initSearch();
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
		_self.initSearch();
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
			_self.initSearch();
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
		_self.initSearch();
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
			var tabhtml="<li class='menu_li sertypeClicked' id='cateli0'   onclick='_pl.level2Click(this,"+pid+",\"全部分类\","+pid+")'>全部分类</li>";
			
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
			var tabhtml="<li class='menu_li sertypeClicked' id='cateli0'   onclick='_pl.level3Click(this,"+pid+")'>全部分类</li>";
			
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
	
	
	this.needStatusClick = function(obj, needStatus){
		if(obj != null){
			$(".color_f").removeClass("color_f");
			$(obj).addClass("color_f");
		}
		_needStatus = needStatus;
		_self.initSearch(1);
	}
	
	
	
	/**
	 * Initial search.
	 */
	this.initSearch = function(pageNo){

		var cpage=parseInt(_jM.getMark("page")||1);
		var params = {
			rows:_rows,
			page:pageNo || cpage,
//   		page:cpage,
			"param.needStatus":(_needStatus == 0?"":_needStatus),
		//	"param.custType":(_custType == 0?"":_custType),
		//  "param.custCategory":(_custCategory == 0?"":_custCategory)
			"param.categoryPath":(_custCategory == 0?"":_custCategory)	
		};
		var queryMode = _jM.getParam('queryMode');
		if(queryMode != null)
			params['param.queryMode'] = queryMode;
		var needId = _jM.getParam('needId');
		if(needId != null)
			params['param.needId'] = needId;
		
		_self.search(params,_self.showFavorite);
	}
	
	/**
	 * Do search list.
	 */
	this.search = function(p,callback){
/*		var currid=null;
		
		_jM.login.getLogin(function(data){
			currid=data.custId;
		},function(){
			$('#focusBlock').click(function(){_jM.login.go();});
		});*/
		
		///bp/need/publiclist
		//http://192.168.0.122:8082/bp/need/publiclist
		$.post("/bp/need/publiclist",p, function(data){
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
				/*	var custserviceNum=row.custServiceInfos.length>2?2:row.custServiceInfos.length;
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
					*/
					var pUrl=""; 
					 nub = i<9?"0"+(i+1):(i+1);
					if(p.page>1){
						nub = 12*(p.page-1)+i+1; 	
					}
					
					
					var row =data.rows[i];
					var needbud=row.needBudget>0?"￥"+_self.ThousandCharacter(row.needBudget):"待商议";
					var needbudget=row.needBudget;
					var needbud="0.00";

					if(row.needStatus==6){
						pUrl = "/pc/need/image/jb_bg1.png";
					}else if(row.needStatus==10){
						pUrl = "/pc/need/image/jb_bg4.png";
					}else if(row.needStatus==61){
						pUrl = "/pc/need/image/jb_bg4.png";
					}else if(row.needStatus==90){
						pUrl = "/pc/need/image/jb_bg4.png";
					}else if(row.needStatus==7){
						pUrl = "/pc/need/image/jb_bg4.png";
					}else{
						pUrl = "/pc/need/image/jb_bg4.png";
					}
					
					switch(needbudget){
					case '0,1000':needbud="1千以下";
						break; 
					case '1000,3000':needbud="1千至3千";
						break; 
					case '3000,10000':needbud="3千至1万";
						break; 
					case '10000,30000':needbud="1万至3万";
						break; 
					case '30000,100000':needbud="3万至10万";
						break; 
					case '100000,300000':needbud="10万至30万";
						break; 
					case '300000,1000000':needbud="30万至100万";
						break; 
					case '1000000,100000000000':needbud="100万以上";
						break; 
					default:needbud=needbudget;
					}
					
					html+="<li class='mk_list'>";
					//new
					html+="<div class='mk_text'>";
					html+="<div class='mk_text_l float_l'>";
					html+="<p><label>项目标题：</label><a href='"+row.needUrl+"' class='tit'>"+row.needTitle+"</a></p>";
					html+="<p><label>项目预算：</label><span class='color_f'>"+needbud+"</span></p>";
					html+="<p><label>截止竞标时间：</label><span class='color_f'>"+(row.competitiveReleaseMills<=0?"--":(row.needStatus==6?_self.getDate2Days(row.competitiveReleaseMills):"--"))+"</span></p>";
					html+="</div>";
					html+="<div class='mk_text_r'>";
					html+="<a href='"+row.needUrl+"' style='background:url("+pUrl+");'>";
					html+=_self.getNeedPhase(row.needStatus)+"</a>";
					html+=" </div>";
					html+="<div class='clearfix'></div>";
					html+="</div>";
					html+="<div class='tag_bg'>"+nub+"</div>";
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
		//	hideMineInvIcon();
		});
	}
	
	this.ThousandCharacter=function(s){
		s=s+"";
	    if(/[^0-9\.]/.test(s)) return "invalid value";
	    s=s.replace(/^(\d*)$/,"$1.");
	    s=s.replace(/(\d*\.\d\d)\d*/,"$1");
	    s=s.replace(".",",");
	    var re=/(\d)(\d{3},)/;
	    while(re.test(s))
	            s=s.replace(re,"$1,$2");
	    s=s.replace(/,(\d\d)$/,".$1");
	    
	    s=s.substring(0,s.length-1);
	    return s.replace(/^\./,"0.")
	    }

	
	/**
	 * Get need status desc.
	 */
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
	case 87:
	case 88:
	case 89:
	case 90:
		return "实施中";
	case 9:
	case 10:
	case 84:
	case 85:
	case 86:
		return "已完成";
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
		
		return "剩余"+days+"天"+hours+"小时";
	}
	
	
	/**
	 * show Favorite
	 */
	this.showFavorite=function(imgDom,custId){
		var img = $(imgDom);
		if($("#focus"+custId).val() != "")
			return;
		_jM.post("/bp/custFavorite/checkFavorite", {favoriteType:2,favoriteId:img.attr('cid')}, function(rs,data){
			if(data){
				img.attr("src","/pc/sever/image/favorited.png");
				$("#focus"+custId).val(1);
				
			}else{
				img.attr("src","/pc/sever/image/unfavorite.png");
				$("#focus"+custId).val(0);
			}
		});
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