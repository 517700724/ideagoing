function Arabia_to_Chinese(n,id) {
			part = String(n).split(".");
		    //小数点前进行转化
	        if (part[0].length > 12) {
        	//_jM.tooltip.showTip(id,"位数过大，无法计算");
	        	if(_jM.IsPC()){
					_ec.showTip(id,"位数过大");
				}else{
					alert("位数过大");
				}
        	return ""; 
        	} //若数量超过拾亿单位
			
	        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
	           if(_jM.IsPC()){
					_ec.showTip(id,"非法数据");
				}else{
					alert("非法数据");
				}
	        var unit = "千百拾亿千百拾万千百拾元角分", str = "";
	            n += "00";
	        var p = n.indexOf('.');
	        if (p >= 0)
	            n = n.substring(0, p) + n.substr(p+1, 2);
	            unit = unit.substr(unit.length - n.length);
	        for (var i=0; i < n.length; i++)
	            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
	        return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
	}
