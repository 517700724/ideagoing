var Paging=function(){
	var _self =this;
	var _p=null;
	
	/**
	 * p.PageNum;		//_PageNum每页链接数
	 * p.rows;			//_rows每页行数
	 * p.totalCount		//_totalCount数据总计
	 * p.divId			//分页所在div的id
	 */
	this.init=function(p,nowpage){
		if(p == null){
			alert("Init param can not be null!");
			return false;
		}
		_p = p;
		_self.upPage(nowpage);
	}
	
	this.currPage = 0;
	
	this.upPage=function(nowPage){
		this.currPage = nowPage;
		location.href = '#page='+(nowPage+1);
		var _PageNum=_p.PageNum-1;
		var _totalCount=_p.totalCount;
		var _totalPage=Math.ceil(_totalCount/_p.rows);
		
		var strS="",strE="",strE2="";
		strS='<li><a href="javascript:void(0)" onclick="upPage(1)"><div>首页</div></a></li>'
		var PageNum_2=_PageNum%2==0?Math.ceil(_PageNum/2)+1:Math.ceil(_PageNum/2)                                 
		var PageNum_3=_PageNum%2==0?Math.ceil(_PageNum/2):Math.ceil(_PageNum/2)+1
		var strC="",startPage,endPage;
		if (_PageNum>=_totalPage) {
			startPage=0;
			endPage=_totalPage-1
		}
		else if (nowPage<PageNum_2){
			startPage=0;
			endPage=_totalPage-1>_PageNum?_PageNum:_totalPage-1
		}//首页
		else {
			startPage=nowPage+PageNum_3>=_totalPage?_totalPage-_PageNum-1: nowPage-PageNum_2+1;
			var t=startPage+_PageNum;
			endPage=t>_totalPage?_totalPage-1:t
		}
		for (var i=startPage;i<=endPage;i++){  
			if (i==nowPage){
				strC+='<li><a href="javascript:void(0)" onclick="upPage('+(i+1)+')"><div style="border:1px solid #aaa;color:#999;font-weight:bold">'+(i+1)+'</div></a></li> '
			}  
			else{
				strC+='<li><a href="javascript:void(0)" onclick="upPage('+(i+1)+')"><div>'+(i+1)+'</div></a></li> '
			}
		}
		strE='<li><a href="javascript:void(0)" onclick="upPage('+_totalPage+')"><div>尾页</div></a></li>'
		strE2="<li><div style='width:auto;cursor:default;padding:0px 10px;'>"+(nowPage+1)+"/"+_totalPage+"页"+"  共"+_totalCount+"条</div></li>"
		document.getElementById(_p.divId).innerHTML="<ul>"+strS+strC+strE+strE2+"</ul>"	
	}
}