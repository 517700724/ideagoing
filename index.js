var _index=null;
$(document).ready(function(){
	_index=new index();
	_index.init();
	$("#advertList").myScroll({speed:70,rowHeight:40});
});

function index(){
	var _self=this;
	
	this.init=function(){
		$(".serv_type").each(function(){
			var cval=$(this).attr('cval');
			$(this).html(_self.processType(cval));
		});
	}
	
	this.processType = function(type)
	{
		if(typeof _categoryList == 'undefined' || _categoryList == null || _categoryList.length == 0)
			return '';
		var cateName="";
		var typeList=type.split(",");
		
		for (var i = 0; i < _categoryList.length; i++)
		{
			if(_categoryList[i].id == typeList[0])
			{
				cateName+=_categoryList[i].name+" ";
				
				var cateList2=_categoryList[i].children;
				for (var j = 0; j < cateList2.length; j++) {
					if(cateList2[j].id == typeList[1]){
						cateName+=cateList2[j].name;
						break;
					}
				}
				break;
			}
		}
		return cateName;
	}
}