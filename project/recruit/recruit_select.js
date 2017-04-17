var _showObj= null;
var _showId=null;

$(document).ready(function(){
	var categoryId = _jM.getParam("categoryId");
	var initId = _jM.validate.isEmpty(categoryId) || parseInt(categoryId)<=0 ? 0:parseInt(categoryId);
	
	var html="";
	for(var i=0; i<_categoryList.length; i++){
		html+="<li class='unselect_bacg' id='tbg_li"+_categoryList[i].id+"'><div id='tbg_div"+_categoryList[i].id+"'" +
				" class='tmenu_list t_bg"+_categoryList[i].id+"' id='rootCategory"+_categoryList[i].id+"' " +
				"onclick=\"tab_change(this,"+_categoryList[i].id+")\">"+_categoryList[i].name+"</div></li>"
				
		if(initId == 0 && i==0){
			initId= _categoryList[i].id;			
		}	
	}
	
	$(".body_tab").html(html);
	tab_change($("#tbg_div"+initId), initId);
})

function tab_change(obj, id){
	//大类样式
	if(_showObj!= null){
		$(_showObj).removeClass("t_bged"+_showId);
		$("#tbg_li"+_showId).removeClass("selected_bacg");
		$("#tbg_li"+_showId).addClass("unselect_bacg");
		$(_showObj).addClass("t_bg1"+_showId);
	}
	
	$(obj).addClass("t_bged"+id);
	$("#tbg_li"+id).addClass("selected_bacg");
	$("#tbg_li"+id).removeClass("unselect_bacg");
	$(obj).removeClass("t_bg1"+id);
	_showObj= obj;
	_showId=id;
	
	//显示子类
	var html="";
	for(var i=0; i<_categoryList.length; i++){
		if(_categoryList[i].id == id){
			var child = _categoryList[i].children;
			if(child.length>0){
				for(var j=0; j<child.length; j++){
					var child2 = child[j].children;
					html+="<li style='cursor:pointer'><h3 onclick='"+(child2.length<=0?"godetails("+child[j].id+")":"void(0)")+"'>"+child[j].name+"</h3>"
					
					html+="<div class='tItemList'>";
					if(child2.length>0){
						for(var a=0; a<child2.length; a++){
							html+="<a style='cursor:pointer' href='javascript:godetails("+child2[a].id+")'>"+child2[a].name+"</a>";
						}						
					}
					html+="</div>";
					
				}
			}
		}
		$(".right_body").html(html);
		
	}
	
}

function godetails(id){
	var inv_id = _jM.getParam('inv_id');//邀请id
	alert(inv_id);
	if(window.parent){
		window.parent.location.href="/pc/project/recruit/recruit_detalils.html?id="+id+"&inv_id="+inv_id;
	}else{
		window.location.href="/pc/project/recruit/recruit_detalils.html?id="+id+"&inv_id="+inv_id;
	}
}