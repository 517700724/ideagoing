var serObj,needObj,serj,needj;
var sernowPage=0;//当前页
var neednowPage=0;//当前页
var listNum=5;//每页显示<ul>数
var serPagesLen;//服务项目总页数
var needPagesLen;//需求项目总页数
var _currentNeedlist=null;


$(document).ready(function(){
	_jM.login.getLogin(function(data){
		if(parseInt(data.custId)==parseInt($("#cur_custId").val().replace(/,/,""))){
			$(".sv_btns").hide();
		}
	},function(){
		
	});
	genStar();
	
	//服务项目列表
	serObj=document.getElementById("ser_pro_list").getElementsByTagName("li");
	serj=serObj.length;
	serPagesLen=Math.ceil(serj/listNum);
	serUpPage(0);
	serisShow();
	//需求项目列表
	needObj=document.getElementById("need_pro_list").getElementsByTagName("li");
	needj=needObj.length
	needPagesLen=Math.ceil(needj/listNum);
	needUpPage(0);
	needisShow();
	/**
	 * invite_btn clcik
	 */
	$(".invite_btn").click(function(){
		_jM.login.getLogin(function(data){
			showMyneedList();
		},function(){
			var backURL=window.location.href;
			_jM.dialog.showModeDialog({
				id:"loginContainer",
				height:349,
				width:540,
				url:"/pc/user/login/login.html?backURL="+backURL
			});
		});
	});
	
	$(".hire_btn").click(function(){
		_jM.login.getLogin(function(data){
			window.open("/pc/project/recruit/recruit_select.html?inv_id="+$("#cur_custId").val());
		},function(){
			var backURL=window.location.href;
			_jM.dialog.showModeDialog({
				id:"loginContainer",
				height:349,
				width:540,
				url:"/pc/user/login/login.html?backURL="+"/pc/project/recruit/recruit_select.html?inv_id="+$("#cur_custId").val()
			});
		});
	});
});


//---------------ser----------------
function nextSerPage(){
	if(sernowPage<serPagesLen-1){
		sernowPage++;
		serUpPage(sernowPage);
	}
	serisShow();
}
function foreSerPage(){
	if(sernowPage>0){
		sernowPage--;
		serUpPage(sernowPage);
	}
	serisShow();
}
//---------------need----------------
function nextNeedPage(){
	if(neednowPage<needPagesLen-1){
		neednowPage++;
		needUpPage(neednowPage);
	}
	needisShow();
}
function foreNeedPage(){
	if(neednowPage>0){
		neednowPage--;
		needUpPage(neednowPage);
	}
	needisShow();
}
//---------ser-----------
function serisShow(){
	if(sernowPage>0){
		$("#serup_no").hide();
		$("#serup").show();
	}else{
		$("#serup_no").show();
		$("#serup").hide();
	}
	if(sernowPage<serPagesLen-1){
		$("#serdown_no").hide();
		$("#serdown").show();
	}else{
		$("#serdown_no").show();
		$("#serdown").hide();
	}
}
//---------need-----------
function needisShow(){
	if(neednowPage>0){
		$("#needup_no").hide();
		$("#needup").show();
	}else{
		$("#needup_no").show();
		$("#needup").hide();
	}
	if(neednowPage<needPagesLen-1){
		$("#needdown_no").hide();
		$("#needdown").show();
	}else{
		$("#needdown_no").show();
		$("#needdown").hide();
	}
}

function genStar()
{
	$('.score').each(function(){
		var score = $(this).html();
		score = parseFloat(score);
		var starHtml = '';
		for (var j = 0; j < 5; j++) 
		{
			if(Math.round(score - 1) >= j)
			{
				starHtml += '<img src="/statics/personal/image/light_start.png"/>';
			}
			else
			{
				starHtml += '<img src="/statics/personal/image/gray_start.png"/>';
			}
		}
		$(this).html(starHtml+'&nbsp;'+score+'分');
	})
}

function serUpPage(p){
	//内容变换
	for (var i=0;i<serj;i++){
		serObj[i].style.display="none"
	}
	for (var i=p*listNum;i<(p+1)*listNum;i++){
	if(serObj[i])serObj[i].style.display="block"
	}
}
function needUpPage(p){
	//内容变换
	for (var i=0;i<needj;i++){
		needObj[i].style.display="none"
	}
	for (var i=p*listNum;i<(p+1)*listNum;i++){
		if(needObj[i])needObj[i].style.display="block"
	}
}

function sendinvite(id){
	if(document.getElementById("ck"+id).checked){
		$.post('/bp/invitation/save',{custId:$("#cur_custId").val(),needId:id},function(data){
			if(data.success){
				$("#btn"+id).hide();
				$("#disbtn"+id).show();
			}
		});
	}
}

function hire(){
	window.open("/pc/project/recruit/recruit_select.html");
}

function showMyneedList(){
	custId=$("#cur_custId").val();
	_jM.post('/bp/need/getNeedList',{needStatus:"6,61",page:1,rows:10,queryMode:1,invCustId:custId},function(data,rs){
		if(data==null){
			return;
		}
		var needlist=rs.rows;
		_currentNeedlist=needlist;
		var html="<tr><td width='32%' style='padding-right:35px;' align='center'><div class='tb_title'>需求ID</div></td>"+
                	"<td width='45%' align='left'><div class='tb_title'>项目需求标题</div></td>"+
                	"<td width='9%' align='center'><div class='tb_title'>选择</div></td>"+
                	"<td width='14%' align='center'><div class='tb_title'>操作</div></td></tr>";
		if(needlist.length>0){
			for (var i = 0; i < needlist.length; i++) {
				var obj=needlist[i];
				var isSend="display:block;";
				var noSend="display:none;";
				if(obj.invitationStatus==1){
					isSend="display:none;";
					noSend="display:block;";
				}
				html+="<tr><td align='left'><div class='tb_text'>"+obj.needNo+"</div></td>";
				html+="<td align='left'><div class='tb_text'>"+obj.needTitle+"</div></td>";
				html+="<td align='center'><div class='tb_text'><input id='ck"+obj.id+"' type='checkbox'></div></td>";
				html+="<td align='center'><div class='tb_text'>";
				html+="<a id='btn"+obj.id+"' style='"+isSend+"' class='btn' onclick='sendinvite(\""+obj.id+"\")'>邀请</a>";
				html+="<a id='disbtn"+obj.id+"' style='"+noSend+"' class='btn' >已邀请</a>";
				html+="</div></td></tr>";
			}
			$("#need_list_t").html(html);
			$(".shade_show").fadeIn();
			$(".invite_box").fadeIn();
		}else{
			$(".shade_show").fadeIn();
			$(".hire_box").fadeIn();
		}
	});
}
