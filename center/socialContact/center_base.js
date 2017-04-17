var _categoryList = "";


function editButton_click(showId, hiddenId){
$("#"+showId).css("display","block");
$("#"+hiddenId).css("display","none");
}
function cancelButton_click(showId, hiddenId){
$("#"+showId).css("display","none");
$("#"+hiddenId).css("display","block");
hideTooltip();
}
function hideTooltip(){
	hide("custNickname_input");
	hide("custRealname_input");
	hide("custIdentityId_input");
	hide("custPhone_input");
	hide("custEmail_input");
	hide("custQq_input");
	hide("custWeixin_input");
	hide("limitArea");
	hide("custAddress_input");
	hide("hidden");
	hide("custTechniques_input");
	hide("custCategory_input");
	
	hide("enterName_input");
	hide("enterLegalname_input");
	hide("enterEstablishTime_input");
	hide("enterIntra_input");
	hide("enterIdentityId_input");
	hide("enterChargeName_input");
	hide("enterChargeDepart_input");
	hide("enterChargePhone_input");
	hide("enterFixedPhone_input");
	hide("enterEmail_input");
	hide("enterEstablishAddress_input");
	hide("needIntention");
	hide("enterIntention_input");
	hide("enterRange_input");
}
function showFunctionBtn(funId){
$("#"+funId).css("display","block");
}
function hiddenFunctionBtn(funId){
$("#"+funId).css("display","none");
}
function showAreaist(){
	$("#areaList").css("top",$("#limitArea").offset().top + 30);
	$("#areaList").css("left",$("#limitArea").offset().left);
	$("#areaList").css("display","block");
}


$(document).ready(function(){
	
	
	var _pText = "";
	for (var i = 0; i < _pList.length; i++) {
		_pText += "<li><a style='font-weight:normal' href=\"javascript:getCityList('"
				+ _pList[i].stateCode
				+ "')\">"
				+ _pList[i].name
				+ "</a></li>";
	}
	$("#provinceList").html(_pText);

	var d =new Date();
	var year = d.getFullYear();

	var html="";
	var html2="";

	for(var j=1950; j<=year;j++){
		html +="<li onclick=\"clickStartYearList("+j+")\">"+j+"</li>";
		html2+="<li onclick=\"clickEndYearList("+j+")\">"+j+"</li>";
	}
	$("#startYearList").html(html);
	$("#endYearList").html(html2);
	$.post("/bp/baseCategory/level_0", null, function(data){
		if(data==null){
			return;
		}
		var _categoryList=data;
		var html3="";
		for(var a=0; a<_categoryList.length; a++){
			
			html3+="<li onclick=\"clickNeedIntentionList('"+_categoryList[a].categoryDesc+"',"
				+_categoryList[a].id+")\">"+_categoryList[a].categoryDesc+"</li>";
		}
		$("#needIntentionList").html(html3);
	});
});

function getCityList(code) {
	for (var i = 0; i < _pList.length; i++) {
		if (_pList[i].stateCode == code) {
			var cities = _pList[i].children;
			var _cText = "";

			for (var j = 0; j < cities.length; j++) {
				_cText += "<li><a style='font-weight:normal' href=\"javascript:selectCity("
				+ cities[j].cityId + ",'" + cities[j].name + "','"+_pList[i].stateCode+"','"+_pList[i].name+"')\">" + cities[j].name+ "</a></li>";
			}
			$("#cityList").html(_cText);
			areaTabChange(1);
		}
	}
}
function areaTabChange(tab) {
	if (tab == 1) {
		$("#cityList").css("display", "block");
		$("#provinceList").css("display", "none");
		$("#pBtn").css("border-bottom","1px solid #ddd");
		$("#cBtn").css("border-bottom","1px solid #fff");
	} else {
		$("#cityList").css("display", "none");
		$("#provinceList").css("display", "block");
		$("#pBtn").css("border-bottom","1px solid #fff");
		$("#cBtn").css("border-bottom","1px solid #ddd");
	}
}
function selectCity(id,name, stateCode, provinceName) {
	$("#limitArea").val(provinceName+" "+name);
	$("#custCityId_input").val(id);
	$("#custProvinceCode_input").val(stateCode);
}

function showStartYearList(){
	_jM.dropMenu.show({showId:'startYearBox',menuId:'startYearList',top:28});
	$("#startYearBox").focus();
}
function hiddenStartYearList(){
	_jM.dropMenu.hidden({menuId:'startYearList'});
}
function clickStartYearList(v){
	$("#startYearBox").val(v);
	hiddenStartYearList();
}

function showStartMonthList(){
	_jM.dropMenu.show({showId:'startMonthBox',menuId:'startMonthList',top:28});
	$("#startMonthBox").focus();
}
function hiddenStartMonthList(){
	_jM.dropMenu.hidden({menuId:'startMonthList'});
}
function clickStartMonthList(v){
	$("#startMonthBox").val(v);
	hiddenStartMonthList();
}

function showEndYearList(){
	_jM.dropMenu.show({showId:'endYearBox',menuId:'endYearList',top:28});
	$("#endYearBox").focus();
}
function hiddenEndYearList(){
	_jM.dropMenu.hidden({menuId:'endYearList'});
}
function clickEndYearList(v){
	$("#endYearBox").val(v);
	hiddenEndYearList();
}

function showEndMonthList(){
	_jM.dropMenu.show({showId:'endMonthBox',menuId:'endMonthList',top:28});
	$("#endMonthBox").focus();
}
function hiddenEndMonthList(){
	_jM.dropMenu.hidden({menuId:'endMonthList'});
}
function clickEndMonthList(v){
	$("#endMonthBox").val(v);
	hiddenEndMonthList();
}

function showEducationList(){
	_jM.dropMenu.show({showId:'educationBox',menuId:'educationList',top:28});
	$("#educationBox").focus();
}
function hiddenEducationList(){
	_jM.dropMenu.hidden({menuId:'educationList'});
}
function clickEducationList(v, id){
	$("#educationBox").val(v);
	$("#learnEducation_input").val(id);
	hiddenEducationList();
}

function showNeedIntentionList(){
	_jM.dropMenu.show({showId:'needIntention',menuId:'needIntentionList',top:28});
	$("#needIntention").focus();
}
function hiddenNeedIntentionList(){
	_jM.dropMenu.hidden({menuId:'needIntentionList'});
}
function clickNeedIntentionList(v, id){
	$("#needIntention").val(v);
	$("#enterIntention_input").val(id);
	$("#custCategory_input").val(id);
	hiddenNeedIntentionList();
}