/**
 * 描述：TODO 推送类
 * 构建组：app-push
 * 作者：zhongjinyou
 * 邮箱: zhongjinyou@skg.com
 * 日期:Dec 26, 2015-10:07:22 PM
 * 版权：SKG 公司版权所有
 * 
 * @param {Object} data {dir:"论坛：FROUM/直播：LIVE",id:论坛ID/直播ID,msgType:消息类型:public/private,reqSleep:请求间隔时间(默认3秒),funcSleep:回调方法间隔时间（默认为0）,callback:回调函数}
 */



var PushMessageListener = {
	onLineNum:"",
	idx:'',
	prevTime:'',
	init : function(data) {
		var _self = this;
		this.receive = function() {
			$.ajax({
				type : "GET",
				url : CtxPath + "/push/receive.htm",
				data:{idx:_self.idx,prevTime:_self.prevTime},
				success : function(result) {
					var data = eval("(" + result + ")");
					PushMessageListener.onLineNum = data.onLineNum;
					_self.callEver();
					if (data.status == "200") {
						_self.idx = data.idx;
						_self.prevTime = data.prevTime;
						var execSleep=0;
						if (_self.funcSleep > 0) {
							for (var i = 0;i<data.list.length;i++) {
								execSleep = execSleep + _self.funcSleep;
								var dataObj = eval("(" + data.list[i] + ")");
								setTimeout(function() {
									_self.callback(dataObj);
								}, execSleep);
							}
						} else {
							for (var i = 0;i<data.list.length;i++) {
								var dataObj = eval("(" + data.list[i] + ")");
								_self.callback(dataObj);
							}
						}
					}
					_self.timer = setTimeout(_self.receive, _self.reqSleep);
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					if (textStatus == 'timeout' || textStatus == 'error') {
						clearTimeout(_self.timer);
						_self.timer = setTimeout(_self.receive, _self.reqSleep);
					}
				},
				cache:false,
				timeout:5000
			});
		};
		this.callback = data.callback;
		this.callEver = data.callEver;
		this.reqSleep = 3000;
		this.funcSleep = 0;
		if (data.reqSleep) {
			this.reqSleep = data.reqSleep;
		}
		if (data.funcSleep) {
			this.funcSleep = data.funcSleep;
		}
		
		$.ajax({
			type : "POST",
			url : CtxPath + "/push/init.htm",
			data : {
				dir : data.dir,
				id : data.id,
				msgType : data.msgType
			},
			success : function(result) {
				var data = eval("(" + result + ")");
				console.info(data.status + ":" + data.msg);
				if (data.status == '200') {
					PushMessageListener.onLineNum = data.onLineNum;
					_self.callEver();
					_self.receive();
				}
			},cache:false
		});
	}
}; 

