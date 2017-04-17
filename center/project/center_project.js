var _zn   = new ZoneProject();
var _rows=5;	//每页展示行数
var _PageNum=5;	//每页连接数

$(document).ready(function(){
	_zn.init();
	$(".zone_search_btn").click(function(){
		upPage(1);
	});
})

function ZoneProject(){
	var _self = this;
	var _pager= new Paging();
	
	/*
	Init list
	*/
	this.init = function(){
		_self.getProjectList({page:1, rows:_rows});
	}
	
	/*
	   	Get project list by parameter(page and search keyword).
	*/
	this.getProjectList = function(p){
		_jM.post("/bp/need/getProjectList",p, function(rs,data){
			var html = "";
			var bgColor = "";
			var borderColor = "";
			if(data.rows.length>0){
				for(var i=0; i<data.rows.length; i++){
					var comp = data.rows[i];
					var need = data.rows[i].proNeed;
					var status = getProjectStatus(need.needStatus, comp.competitiveStatus);
					if(i%2==0){
						bgColor = "#fff";
						borderColor = "#e5e5e5";
					}else{
						bgColor = "#e5e5e5";
						borderColor = "#fff";
					}
					
					
					html+="<div class='p_needList' style='background:"+bgColor+"'>";
					html+="<div class='nl_top' style='border-color:"+borderColor+"'>";
					html+="<span>需求ID：<a "+(status.compDetails?"href='/personal/zone_project_detail.html?cid="+comp.id+"'":"")+" target='_blank'>"+need.needNo+"</a></span>";
					html+="<span>日期："+need.needPublicTime+"</span>";
					html+="</div>";
					html+="<ul>";
					html+="<li class='p_list p_list1'>";
					html+="<p>行业："+_comFuns.getNeedCategory(need.proBaseCategorys)+"</p>";
					html+="<p>"+(_jM.validate.isEmpty(need.needUrl)?need.needTitle:"<a href='"+need.needUrl+"' target='_blank'>"+need.needTitle+"</a>")+"</p>";
					html+="</li>";
					html+="<li class='p_list p_list2'>"+_jM.need.needbudget(need.needBudget)+"<br></li>";
					html+="<li class='p_list p_list3'><span>"+(status.compDetails?status.statusDesc:"")+"<br>"+(_jM.validate.isEmpty(status.compStatusDesc)?"":"<span style='color:#446e9b'>【"+status.compStatusDesc+"】</span><br>")
						+(status.compDetails?"<a href='/pc/center/project/center_project_detail.html?cid="+comp.id+"' target='_blank' style='color:#ff7519;'>（查看详情）</a>":"")+"</span></li>";
					html+="<li class='p_list p_list4'>"+getProjectButtons(status.functionList, comp.id,comp.refId)+"</li>";
					html+="</ul>";
					html+="</div>";	
				}
				_pager.init({	
					   PageNum   : _PageNum,
					   rows      : _rows,
					   totalCount:data.totalCount,
					   divId     :"zonePager"
					}, data.pageNo-1);
			}else{
				html="<div style='width:100%;height:80px; line-height:80px;text-align:center;color:#ccc'>目前还没有任何记录</div>";
				$("#zonePager").html("");
			}
			$(".projectLsit").html(html);
		});
	}
}
function upPage(pageNo){
	var keyword = $("#searchKeyword").val();
	var status = $("#searchStatus").val();
	_zn.getProjectList({page:pageNo,rows:_rows, searchKeyWord:keyword, needStatus:status});
}
function searchStatus_click(obj, v){
	$(".liIndex").removeClass("liIndex");
	$(obj).addClass("liIndex");
	$("#searchStatus").val(v);
	upPage(1);
}




















