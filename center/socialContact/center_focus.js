var _zn = new ZoneNeed();
var _rows=4;	//每页展示行数
var _PageNum=5;	//每页连接数
var _tableStatus = 0; //0正常状态，1编辑状态
var _currTab = 0;
var _queryParams = {page:1, rows:_rows, 'param.favoriteType':2/*,'param.custId':3*/};
var _urlHost = '';
var _providerListArry=new Array();
$(document).ready(function(){
	_zn.init();
});

function ZoneNeed(){
	var _self = this;
	var _pager= new Paging();
	
	/**
	 * Init list.
	 */
	this.init = function(){
		_self.getNeedList(_queryParams);
	}
	
	this.query = function(p)
	{
			_self.getNeedList(p);
	}
	
	this.getPager = function(){
			return _pager;
	}
	
	/**
	 * Get need list by parameter(page and search keyword).
	 */
	this.getNeedList = function(p){
		
		var currid=null;
		
		_jM.login.getLogin(function(data){
			currid=data.custId;
		},function(){
			$('#focusBlock').click(function(){_jM.login.go();});
		});
		
		_jM.post(_urlHost+"/bp/custFavorite/getDataList", p, function(rs ,data){
			var html="";
			
			if(data.rows.length > 0)
			{
				var display = _tableStatus == 1 ? '' : 'none';
				for(var i=0; i<data.rows.length; i++)
				{
					var item = data.rows[i];
					if(!item.custBase)
						continue;
					var row = item.custBase;
					
					var clickfun="";
					var focusBlock="";
					var favoriteUrl="";
					var custSrc="";
					var vSrc="";
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
					
					var custServiceStr="";	
					if(item.serviceInfos!=null){
						var custserviceNum=item.serviceInfos.length>2?2:item.serviceInfos.length;
					}
					for (var j = 0; j < custserviceNum; j++) {
						var custServiceInfo=item.serviceInfos[j];
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
		
					
				html+="<div class='attentionList'>";	
				html+="<div class='al_img float_l'><a href='"+row.custUrl+"' target='_blank'><img width='130' src='"+_jM.ideagoing.getDefaultPhoto(row.custImage, row.custType)+"'></a></div>";
				html+="<div class='float_l al_infoText'>";	
				html+="<div class='al_title'>";
				html+="<h3><a href='"+row.custUrl+"' target='_blank'>"+row.custNickname+"</a></h3>";
				html+="<div class='btn2'"+clickfun+">";
				html+="<input type='hidden' id='focus"+row.id+"'>";
				html+="<img align='top' id='favoriteimg"+row.id+"' cid='"+row.id+"' src='/pc/center/image/favorited00.png' >" ;
				html+="</div>";
				html+="</div>";
				html+="<div class='al_m'>";
				html+="<div class='float_l f_l'>";
				html+="<ul><li>成功案例：<span>"+row.custRecVolume+"</span></li><li>诚信分：<span>"+row.custIntegrityLevel+"分</span></li><li>好评率：<span>"+row.custGoogLevel+"%</span></li></ul>";
				html+="<p>擅长技能：<span>"+row.custTechniques+"</span></p>";
				html+="</div>";
				html+="<div class='float_l'><a class='btn' href='"+row.custUrl+"' target='_blank'>客户综合评价</a></div>";
				html+="</div>";
				html+="<p class='sv_com'>服务内容：<span class='color_f'>"+custServiceStr+"</span></p>";
				html+="</div>";
				html+="<div class='clearfix'></div>";
				html+="</div>";
		
				}
				
				_pager.init({
				   PageNum   : _PageNum,
				   rows      : _rows,
				   totalCount: data.totalCount,
				   divId     :"zonePager"
				}, data.pageNo-1);
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
				html="<div class='zone_empty' style='line-height:30px'>目前还没有任何记录!</div>";
				$("#zonePager").html("");
			}
			$(".attentionBox").html(html);
		});
	}
	
	
}
function upPage(pageNo)
{
//	resetCheckbox();
	_queryParams.page = pageNo;
	_zn.query(_queryParams);
}



function favoriteOperate(custId)
{
	$("#focus"+custId).val(1);
	var success = function(rs, data){
		var target = $("#favoriteimg"+custId);
	}
	if($("#focus"+custId).val() == 0)
	{
		_jM.post("/bp/custFavorite/add", {favoriteType:2,favoriteId:custId}, success);
	}
	else
	{
		_jM.post("/bp/custFavorite/deleteEx", {favoriteType:2,favoriteId:custId}, function(){
			window.location.reload();
		});
	}	
	
} 
