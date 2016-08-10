/*通用提示框*/
;(function($){
	$.fn.extend({
		"popBox" : function(options){
			options=$.extend({
				boxType:"", // 提示框类型 “success,wrong或空”
				boxContent:"",  // 提示框内容
				btnType:"",  // 按钮类型 “confirm,cancel,both或空”
				confirmName:"确定",
				cancelName:"取消",
				textAlign:"center",
				confirmFunction: function(){} // 提交后执行函数

			},options);
			
			var $popBox = ".popBox";
			var $pop_content_span = ".pop_content span";
			var $pop_bottom = ".pop_bottom";
			var $btnConfirmHtml = '<span><a href="javascript:;" class="pop_btn btn_confirm">'+options.confirmName+'</a></span>';
			var $btnCancelHtml = '<span><a href="javascript:;" class="pop_btn btn_cancel">'+options.cancelName+'</a></span>';
			var $btnConfirm = '.btn_confirm';
			var $btnCancel = '.btn_cancel';
			
			//弹出框html代码
			var $popBoxHtml =	'<div class="popBox"><b class="bg"></b><div class="main"><div class="pop_content';
			if(options.textAlign=="left"){
				$popBoxHtml +=" alignLeft";
			}
			$popBoxHtml +='"><span></span></div><div class="pop_bottom"></div></div></div>';
			
			//判断是否有提示框
			if($($popBox).length > 0){
				resetBox();
				$($popBox).show();
				
			}else{
				$($popBoxHtml).appendTo("body");
				resetBox();
			}
			
			//重置按钮方法
			$(document).on("click",$btnCancel,function(){
				$($popBox).hide();
			}).off("click",$btnConfirm).on("click",$btnConfirm,function(){
				options.confirmFunction();
				$($popBox).hide();
			});
			
			//重置提示框属性
			function resetBox(){
				$($pop_content_span).html(options.boxContent);
				$($pop_bottom).removeClass("both");
				//重置按钮
				switch (options.btnType)
				{
					case "confirm":
					  $($pop_bottom).html($btnConfirmHtml);
					  break;
					case "cancel":
					  $($pop_bottom).html($btnCancelHtml);
					  break;
					case "both":
					  $($pop_bottom).addClass("both");
					  $($pop_bottom).html( $btnCancelHtml + $btnConfirmHtml);
					  break;
					default:
					  $($pop_bottom).html("");
					  break;
				}
			}
		}
	});
})(jQuery);

/*自消失提示*/
;(function($){
	$.fn.extend({
		"minTipsBox" : function(options){
			options=$.extend({
				tipsContent:"",  //提示内容
				tipsTime:1//停留时间 , 1 等于 1秒
			},options);
			var $minTipsBox = ".min_tips_box";
			var $tipsContent = ".min_tips_box .tips_content";
			var $tipsTime = parseFloat(options.tipsTime) * 1000;
			//弹出框html代码
			var $minTipsBoxHtml =	'<div class="min_tips_box">'+
										'<b class="bg"></b>'+
										'<span class="tips_content"></span>'+
									'</div>';
			//判断是否有提示框
			if($($minTipsBox).length > 0){
				$($minTipsBox).show();
				resetBox();
				setTimeout(function(){$($minTipsBox).hide();},$tipsTime);
			}else{
				$($minTipsBoxHtml).appendTo("body");
				resetBox();
				setTimeout(function(){$($minTipsBox).hide();},$tipsTime);
			}
			//重置提示框属性
			function resetBox(){
				
				$($tipsContent).html(options.tipsContent);
				var tipsBoxLeft = $($tipsContent).width() / 2 + 10;
				$($tipsContent).css("margin-left", "-"+ tipsBoxLeft+"px");
			}
		}
	});
})(jQuery);

/*图片上传*/
(function(){
    var userName;  
    var passWord;  
    var xmlHttpRequest;  
	var maxByte = 5242880;
//XmlHttpRequest对象  
    function createXmlHttpRequest(method,url){  
        var xhr = new XMLHttpRequest();  
        if ("withCredentials" in xhr) {  
            xhr.open(method, url, true);
        } else if (typeof(xhr) != "undefined") {  
            xhr = new XDomainRequest();  
            xhr.open(method, url);       
        } else {      
            xhr = null;      
        }  
        return xhr;           
    }   
    
    var POLICY_JSON = {"expiration": "2020-12-01T12:00:00.000Z",
                       "conditions": [
                       ["starts-with", "$key", ""],
                       {"bucket": 'ql-res'},
                       ["starts-with", "$Content-Type", ""],
                       ["content-length-range", 0, maxByte]
                       ]
                      }; 
                      
    var policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));
    
    function uploadProgress(evt) {
//      if (evt.lengthComputable) {
//          var percentComplete = Math.round(evt.loaded * 100 / evt.total);
//          document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
//      }else {
//          document.getElementById('progressNumber').innerHTML = 'unable to compute';
//      }
    }
    
	
	
	//
	
	//Add Event
    function addEvent(el, type, fn){
        if (el.addEventListener) {
            el.addEventListener(type, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, function(){
                fn.call(el);
	        });
	    } else {
            throw new Error('not supported or DOM not loaded');
        }
    }
    
	//Add Styles
    function addStyles(el, styles){
        for (var name in styles) {
            if (styles.hasOwnProperty(name)) {
                el.style[name] = styles[name];
            }
        }
    }
    
    //Get file name from path
    function fileFromPath(file){
        return file.replace(/.*(\/|\\)/, "");
    }
    
    //Get Ext frome File
    function getExt(file){
        return (-1 !== file.indexOf('.')) ? file.replace(/.*[.]/, '') : '';
    }
    
    //Get style
    function GetCurrentStyle (obj, prop) {     
	    if (obj.currentStyle) {        
	        return obj.currentStyle[prop];     
	    }      
	    else if (window.getComputedStyle) {        
	        propprop = prop.replace (/([A-Z])/g,"-$1");           
	        propprop = prop.toLowerCase ();        
	        return document.defaultView.getComputedStyle (obj,null)[prop];     
	    }      
	    return null;   
	} 
	
	//reName
	function reName(){
		var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		var res = "";
	    for(var i = 0; i < 8 ; i ++) {
	        var id = Math.ceil(Math.random()*35);
	        res += chars[id];
	    }
	    res += "-";
	    for(var i = 0; i < 4 ; i ++) {
	        var id = Math.ceil(Math.random()*35);
	        res += chars[id];
	    }
	    res += "-";
	    for(var i = 0; i < 4 ; i ++) {
	        var id = Math.ceil(Math.random()*35);
	        res += chars[id];
	    }
	    res += "-" + (new Date).getTime() + "-";
	    for(var i = 0; i < 12 ; i ++) {
	        var id = Math.ceil(Math.random()*35);
	        res += chars[id];
	    }
	    
	    return res;
	}
	//removeNode
	function removeNode(el){
        el.parentNode.removeChild(el);
    }
	
	window.imgUpload = function(button, options){
        this._settings = {
        	project:"wtWap",
            folder:"temp",
            autoSubmit: true,
            responseType: false,
            multiple: "N",
            onChange: function(){
            },
            onComplete: function(alImgUrl){
            },
            onError: function(){
            },
            onAllComplete: function(){
            },
            isPass: function(){
            	return true;
            }
        };
        
        this.fileArray = [];

        for (var i in options) {
            if (options.hasOwnProperty(i)){
                this._settings[i] = options[i];
            }
        }

        // button isn't necessary a dom element
        if (button.jquery){
            // jQuery object was passed
            button = button[0];
        } else if (typeof button == "string") {
            if (/^#.*/.test(button)){
                // If jQuery user passes #elementId don't break it
                button = button.slice(1);
            }
            button = document.getElementById(button);
        }

        if ( ! button || button.nodeType !== 1){
            throw new Error("Please make sure that you're passing a valid element");
        }

        if ( button.nodeName.toUpperCase() == 'A'){
            // disable link
            addEvent(button, 'click', function(e){
                if (e && e.preventDefault){
                    e.preventDefault();
                } else if (window.event){
                    window.event.returnValue = false;
                }
            });
        }
        
        
       
        if(button.tagName=="CANVAS"){
        	this.canvasImg(button);
        }
        else{
        	 //set button.Node style
    		button.style.overflow = "hidden";
            if(GetCurrentStyle(button,"position") == "static"){
    			button.style.position = "relative";
            }
    		
    		
            // DOM element
            this._button = button;
            // DOM element
            this._input = null;
        	this.createInput();
        }
       
        
        
    };
	
	
	imgUpload.prototype = {
		
		createInput: function(){
            var self = this;

            var input = document.createElement("input");
            input.setAttribute('type', 'file');
            input.setAttribute('accept','image/*');
            input.setAttribute('onmousedown', 'return false');
            input.setAttribute('name', 'file');
            input.setAttribute('id','file');
            if(self._settings.multiple == "Y"){
            	input.setAttribute('multiple','multiple');
            }
            
            addStyles(input, {
                'position' : 'absolute',
                // in Opera only 'browse' button
                // is clickable and it is located at
                // the right side of the input
                'right' : 0,
                'bottom' : 0 ,
				'opacity' : 0,
                'margin' : 0,
                'padding' : 0,
                'fontSize' : '480px',
                'cursor' : 'pointer',
                'z-index': '10',
                'filter':'alpha(opacity=0)'
                
            });

            addEvent(input, 'change', function(){
            	
                if ( !input || input.value === ''){
                    return;
                }

                // Get filename from input, required
                // as some browsers have path instead of it
                var file = fileFromPath(input.value);
//
                if (!(file && /^(jpg|JPG|png|PNG|gif|GIF|bmp|BMP|jpeg|JPEG)$/
						.test(getExt(file)))) {
				    $(this).popBox({
				    	    boxTitle:"温馨提示",
				            boxContent:"只支持jpg|JPG|png|PNG|gif|GIF|bmp，请重新选择！", 
				            btnType:"confirm",
				            confirmFunction: function(){return  false; }
				    });
					 
					return false;
				}
                
                

                // Submit form when value is changed
                if (self._settings.autoSubmit&&self._settings.isPass()) {
                	self._settings.onChange();
                    self.submit();//=
                }
            });

			this._button.appendChild(input);

            this._input = input;//=
        },
        
        canvasImg:function(canvasobj){
        	var _imgFile= dataURLtoBlob(canvasobj.toDataURL("image/jpeg"));
        	this.send2OSS(_imgFile);
        },
        
        clearInputVal : function(){
        	removeNode(this._input);
            this._input = null;
            this.createInput();
        },
        
        
        submit: function(){
        	var self = this;
        	
			if(self._input.files.length > 1){
		      	for(i=1; i< self._input.files.length; i++){
		      		self.fileArray[i-1] = self._input.files[i];
		      	}
	      	}
	      	self.send2OSS(this._input.files[0]);
            self.clearInputVal();
        },
        
        uploadElseFile : function () {
        	var self = this;
        	
        	self.send2OSS(self.fileArray.shift());
        },
        
        uploadFile : function (myid,mykey,imgFile) {
	        var self = this,
	       		_imgFile = imgFile,
	        	fd = new FormData(),
	        	signature = b64_hmac_sha1(mykey, policyBase64),
	        	key = this._settings.project+"/"+this._settings.folder+ "/" + reName() +"."+"jpg";
	        	imgLoadUrl = "http://img.qlchat.com/"+key;
	        if(isiOS()|| checkBrowser() == "Chrome"){
	        	maxByte = 3145728;
	        }
	        
        	if(imgFile.size > maxByte){
        		if(isiOS()|| checkBrowser() == "Chrome"){
        			var urlTemp = null ; 
					if (window.createObjectURL!=undefined) { // basic
						urlTemp = window.createObjectURL(_imgFile) ;
					} else if (window.URL!=undefined) { // mozilla(firefox)
						urlTemp = window.URL.createObjectURL(_imgFile) ;
					} else if (window.webkitURL!=undefined) { // webkit or chrome
						urlTemp = window.webkitURL.createObjectURL(_imgFile) ;
					}
					
        			var $img = new Image();
		        	$img.onload = function() {
		        		//生成比例
			            var width = $img.width,
			                    height = $img.height,
			                    scale = width / height;
			            if(width > 1600){
			            	width = parseInt(1600);
			            	height = parseInt(width / scale);
			            }
			
			            //生成canvas
			            if($('#canvasTemp').length < 1){
			            	var newCanvas = document.createElement("canvas");
				            newCanvas.setAttribute('id','canvasTemp');
				            newCanvas.style.display="none";
				            $("body").append(newCanvas);
			            }
			            
			            var $canvas = $('#canvasTemp');
			            var ctx = $canvas[0].getContext('2d');
			            $canvas.attr({width : width, height : height});
			            ctx.drawImage($img, 0, 0, width, height);
			            
			            setTimeout(function(){
			            	base64 = $canvas[0].toDataURL('image/jpeg',0.5);
		        	    	_imgFile = dataURLtoBlob(base64);
		        	    	uploadAction();
		        	    },1000);
		        	    
		        	    
		        	};
	        		$img.src = urlTemp; 
        			
        		}else{
        			$(document).popBox({
						boxTitle:"温馨提示", 
						boxContent:"请选择小于5M的图片", 
						btnType:"confirm",
						confirmFunction: function(){return false;}
				    });
				    self._settings.onError();
				    return false;
        		}
			    
        	}else{
				uploadAction();
        		
          	};
	        
	        
		    function uploadAction(){   
		        fd.append('key', key);
		        fd.append('Content-Type', imgFile.type);      
		        fd.append('OSSAccessKeyId', myid);
		        fd.append('policy', policyBase64)
		        fd.append('signature', signature);
		        fd.append("file",_imgFile);
		        var xhr = createXmlHttpRequest('POST','http://ql-res.oss-cn-hangzhou.aliyuncs.com');
		        xhr.upload.addEventListener("progress", uploadProgress, false);
		        xhr.addEventListener("load", 
			        function(evt){
			        	self._settings.onComplete(imgLoadUrl);
			        	if(self.fileArray.length > 0){
			        		self.uploadElseFile();
			        	}else{
			        		self._settings.onAllComplete();
			        	}
			        }, false);
		        xhr.addEventListener("error", 
			        function(evt){
			        	$(document).popBox({
							boxContent:"上传失败，请重试。", 
							btnType:"confirm" 
				        }); 
				        self._settings.onError();
			        }, false);
		        xhr.addEventListener("abort", 
			        function(evt){
			        	$(document).popBox({
							boxContent:"上传失败，请重试。", 
							btnType:"confirm" 
				        }); 
				        self._settings.onError();
			        }, false);
		        xhr.send(fd);
		    }
        },
        
        send2OSS : function (imgFile){
        	var self = this;
	    	$.ajax({
	    		type: "POST",
	    		url:CtxPath+"/wt/common/imgUpload.htm",    		
	    		success:function(result){    			
	    			var data=eval("("+result+")"); 
	    			if(data.statusCode=="200"){    				
	    				self.uploadFile(data.ossAccessId,data.ossAccessKey,imgFile);
	    			}else if(data.statusCode=="400"){
	    				$(document).popBox({
				            boxContent:data.msg, 
				            btnType:"confirm" 
				        }); 
	    			}else{
	    				$(document).popBox({
				            boxContent:"对不起，您尚未登陆或者超时，请重新登陆!", 
				            btnType:"confirm" 
				        }); 
				        self._settings.onError();
	    			}
	    		},
	    		error:function(){
	    				self.uploadFailed();
	    				self._settings.onError();
				}
	    		
	    	})

	    },
	    
	    uploadFailed : function(){
	    	$(document).popBox({
				boxContent:"上传失败，请重试。", 
				btnType:"confirm" 
	        }); 
	    }
		
		
	}
})();

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function checkBrowser()
{
 var browserName=navigator.userAgent.toLowerCase();
 //var ua = navigator.userAgent.toLowerCase();
 var Sys = {};
 var rtn = false;
 
    if(/msie/i.test(browserName) && !/opera/.test(browserName)){
        strBrowser = "IE: "+browserName.match(/msie ([\d.]+)/)[1];
  		rtn = true;
        //return true;
    }else if(/firefox/i.test(browserName)){
        strBrowser = "Firefox: " + browserName.match(/firefox\/([\d.]+)/)[1];;
        //return false;
    }else if(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)){
       // strBrowser = "Chrome: " + browserName.match(/chrome\/([\d.]+)/)[1];
        strBrowser = "Chrome";
        //return false;
    }else if(/opera/i.test(browserName)){
        strBrowser = "Opera: " + browserName.match(/opera.([\d.]+)/)[1];
        //return false;
    }else if(/webkit/i.test(browserName) &&!(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName))){
        strBrowser = "Safari: ";
        //return false;
    }else{
        strBrowser = "unKnow";
  //return false;
    }
 strBrowser = strBrowser ;
 return strBrowser;
}
function isAndroid(){
	var u = navigator.userAgent, app = navigator.appVersion;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; 
	return isAndroid;
}
function isiOS(){
	var u = navigator.userAgent, app = navigator.appVersion;
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	return isiOS;
}

//修改数据变动判断值
function refreshPage(){
	if(localStorage.getItem("isDataChange_B")){
		var isDataChange_B =localStorage.getItem("isDataChange_B");
		localStorage.setItem("isDataChange_B",++isDataChange_B);
	}
}

//过滤特殊符号
function symbolFilter(sf){
	var sfData = sf;
	sfData = sfData.replace(/\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029)/g,"");
	sfData = sfData.replace(/\%/g, "%25");
    sfData = sfData.replace(/\+/g, "%2B");
    sfData = sfData.replace(/\#/g, "%23");
    sfData = sfData.replace(/\//g, "%2F");
    sfData = sfData.replace(/\?/g, "%3F");
    sfData = sfData.replace(/\=/g, "%3D");
	sfData = sfData.replace(/\</g, "&lt;");
	sfData = sfData.replace(/\>/g, "&gt;");
	sfData = sfData.replace(/\&/g, "%26");
	return sfData;
}

function firstFilter(ff){
	var ffData = ff;
	ffData = ffData.replace(/\"/g, "&quot;");
	ffData = ffData.replace(/\'/g, "&#39;");
	ffData = ffData.replace(/\\/g, "\\\\");
	return ffData;
}

function postBackFilter(pbf){
	var pbfData = pbf;
	pbfData = pbfData.replace(/(\%26lt;br\%26gt;)/g, "\<br\>");
	return pbfData;
}

//检查时间小于2位数
function checkTime(i){
	if (i<10){
		i="0" + i
	}
	return i
}

//滚动加载判断方法
function pageLoadCommon(parentBox,loadFuntion){
	parentBox.scroll(function(){
    	distanceScrollCount = parentBox[0].scrollHeight;
    	distanceScroll = parentBox[0].scrollTop;
    	topicPageHight = parentBox.height();
    	var ddt= distanceScrollCount- distanceScroll - topicPageHight;
    	if(ddt < 1){
			loadFuntion();
		}
    });
	
}

/*页面通用方法*/
$(function(){
	//	判断数据是否有变化
	if(localStorage.getItem("isDataChange_A")){
		var isDataChange_A=localStorage.getItem("isDataChange_A");
		var isDataChange_B=localStorage.getItem("isDataChange_B");
		if(isDataChange_A != isDataChange_B){
			localStorage.setItem("isDataChange_A",isDataChange_B);
			window.location.reload(true);
		}
	}else{
		localStorage.setItem("isDataChange_A",1);
		localStorage.setItem("isDataChange_B",1);
	}
	if(localStorage.getItem("isShare")=="true" && $(".isShare")){
		$(".isShare").show();
		clearTimeout(sharetipsTime);
		var sharetipsTime=setTimeout(function(){
			$(".isShare").hide();
			localStorage.setItem("isShare","false");
		},5000);
	}
	
	//emoji兼容  
	if(isAndroid()){
		var emojiUnicode = {"E415":"D83D,DE04","E056":"D83D,DE0A","E057":"D83D,DE03","E414":"263A","E405":"D83D,DE09","E106":"D83D,DE0D","E418":"D83D,DE18","E417":"D83D,DE1A","E40D":"D83D,DE33","E40A":"D83D,DE0C","E404":"D83D,DE01","E105":"D83D,DE1C","E409":"D83D,DE1D","E40E":"D83D,DE12","E402":"D83D,DE0F","E108":"D83D,DE13","E403":"D83D,DE14","E058":"D83D,DE1E","E407":"D83D,DE16","E401":"D83D,DE25","E40F":"D83D,DE30","E40B":"D83D,DE28","E406":"D83D,DE23","E413":"D83D,DE22","E411":"D83D,DE2D","E412":"D83D,DE02","E410":"D83D,DE32","E107":"D83D,DE31","E059":"D83D,DE20","E416":"D83D,DE21","E408":"D83D,DE2A","E40C":"D83D,DE37","E11A":"D83D,DC7F","E10C":"D83D,DC7D","E32C":"D83D,DC9B","E32A":"D83D,DC99","E32D":"D83D,DC9C","E328":"D83D,DC97","E32B":"D83D,DC9A","E022":"2764","E023":"D83D,DC94","E327":"D83D,DC93","E329":"D83D,DC98","E32E":"2728","E335":"D83C,DF1F","E334":"D83D,DCA2","E337":"2755","E336":"2754","E13C":"D83D,DCA4","E330":"D83D,DCA8","E331":"D83D,DCA6","E326":"D83C,DFB6","E03E":"D83C,DFB5","E11D":"D83D,DD25","E05A":"D83D,DCA9","E00E":"D83D,DC4D","E421":"D83D,DC4E","E420":"D83D,DC4C","E00D":"D83D,DC4A","E010":"270A","E011":"270C","E41E":"D83D,DC4B","E012":"270B","E422":"D83D,DC50","E22E":"D83D,DC46","E22F":"D83D,DC47","E231":"D83D,DC49","E230":"D83D,DC48","E427":"D83D,DE4C","E41D":"D83D,DE4F","E00F":"261D","E41F":"D83D,DC4F","E14C":"D83D,DCAA","E201":"D83D,DEB6","E115":"D83C,DFC3","E428":"D83D,DC6B","E51F":"D83D,DC83","E429":"D83D,DC6F","E424":"D83D,DE46","E423":"D83D,DE45","E253":"D83D,DC81","E426":"D83D,DE47","E111":"D83D,DC8F","E425":"D83D,DC91","E31E":"D83D,DC86","E31F":"D83D,DC87","E31D":"D83D,DC85","E001":"D83D,DC66","E002":"D83D,DC67","E005":"D83D,DC69","E004":"D83D,DC68","E51A":"D83D,DC76","E519":"D83D,DC75","E518":"D83D,DC74","E515":"D83D,DC71","E516":"D83D,DC72","E517":"D83D,DC73","E51B":"D83D,DC77","E152":"D83D,DC6E","E04E":"D83D,DC7C","E51C":"D83D,DC78","E51E":"D83D,DC82","E11C":"D83D,DC80","E536":"D83D,DC63","E003":"D83D,DC8B","E41C":"D83D,DC44","E41B":"D83D,DC42","E419":"D83D,DC40","E41A":"D83D,DC43","E436":"D83C,DF8D","E437":"D83D,DC9D","E438":"D83C,DF8E","E43A":"D83C,DF92","E439":"D83C,DF93","E43B":"D83C,DF8F","E117":"D83C,DF86","E440":"D83C,DF87","E442":"D83C,DF90","E446":"D83C,DF91","E445":"D83C,DF83","E11B":"D83D,DC7B","E448":"D83C,DF85","E033":"D83C,DF84","E112":"D83C,DF81","E325":"D83D,DD14","E312":"D83C,DF89","E310":"D83C,DF88","E126":"D83D,DCBF","E127":"D83D,DCC0","E008":"D83D,DCF7","E03D":"D83C,DFA5","E00C":"D83D,DCBB","E12A":"D83D,DCFA","E00A":"D83D,DCF1","E00B":"D83D,DCE0","E009":"260E","E316":"D83D,DCBD","E129":"D83D,DCFC","E141":"D83D,DD0A","E142":"D83D,DCE2","E317":"D83D,DCE3","E128":"D83D,DCFB","E14B":"D83D,DCE1","E211":"27BF","E114":"D83D,DD0D","E145":"D83D,DD13","E144":"D83D,DD12","E03F":"D83D,DD11","E313":"2702","E116":"D83D,DD28","E10F":"D83D,DCA1","E104":"D83D,DCF2","E103":"D83D,DCE9","E101":"D83D,DCEB","E102":"D83D,DCEE","E13F":"D83D,DEC0","E140":"D83D,DEBD","E11F":"D83D,DCBA","E12F":"D83D,DCB0","E031":"D83D,DD31","E30E":"D83D,DEAC","E311":"D83D,DCA3","E113":"D83D,DD2B","E30F":"D83D,DC8A","E13B":"D83D,DC89","E42B":"D83C,DFC8","E42A":"D83C,DFC0","E018":"26BD","E016":"26BE","E015":"D83C,DFBE","E014":"26F3","E42C":"D83C,DFB1","E42D":"D83C,DFCA","E017":"D83C,DFC4","E013":"D83C,DFBF","E20E":"2660","E20C":"2665","E20F":"2663","E20D":"2666","E131":"D83C,DFC6","E12B":"D83D,DC7E","E130":"D83C,DFAF","E12D":"D83C,DC04","E324":"D83C,DFAC","E301":"D83D,DCDD","E148":"D83D,DCD6","E502":"D83C,DFA8","E03C":"D83C,DFA4","E30A":"D83C,DFA7","E042":"D83C,DFBA","E040":"D83C,DFB7","E041":"D83C,DFB8","E12C":"303D","E007":"D83D,DC5F","E31A":"D83D,DC61","E13E":"D83D,DC60","E31B":"D83D,DC62","E006":"D83D,DC55","E302":"D83D,DC54","E319":"D83D,DC57","E321":"D83D,DC58","E322":"D83D,DC59","E314":"D83C,DF80","E503":"D83C,DFA9","E10E":"D83D,DC51","E318":"D83D,DC52","E43C":"D83C,DF02","E11E":"D83D,DCBC","E323":"D83D,DC5C","E31C":"D83D,DC84","E034":"D83D,DC8D","E035":"D83D,DC8E","E045":"2615","E338":"D83C,DF75","E047":"D83C,DF7A","E30C":"D83C,DF7B","E044":"D83C,DF78","E30B":"D83C,DF76","E043":"D83C,DF74","E120":"D83C,DF54","E33B":"D83C,DF5F","E33F":"D83C,DF5D","E341":"D83C,DF5B","E34C":"D83C,DF71","E344":"D83C,DF63","E342":"D83C,DF59","E33D":"D83C,DF58","E33E":"D83C,DF5A","E340":"D83C,DF5C","E34D":"D83C,DF72","E339":"D83C,DF5E","E147":"D83C,DF73","E343":"D83C,DF62","E33C":"D83C,DF61","E33A":"D83C,DF66","E43F":"D83C,DF67","E34B":"D83C,DF82","E046":"D83C,DF70","E345":"D83C,DF4E","E346":"D83C,DF4A","E348":"D83C,DF49","E347":"D83C,DF53","E34A":"D83C,DF46","E349":"D83C,DF45","E04A":"2600","E04B":"2614","E049":"2601","E048":"26C4","E04C":"D83C,DF19","E13D":"26A1","E443":"D83C,DF00","E43E":"D83C,DF0A","E04F":"D83D,DC31","E052":"D83D,DC36","E053":"D83D,DC2D","E524":"D83D,DC39","E52C":"D83D,DC30","E52A":"D83D,DC3A","E531":"D83D,DC38","E050":"D83D,DC2F","E527":"D83D,DC28","E051":"D83D,DC3B","E10B":"D83D,DC37","E52B":"D83D,DC2E","E52F":"D83D,DC17","E109":"D83D,DC35","E528":"D83D,DC12","E01A":"D83D,DC34","E134":"D83D,DC0E","E530":"D83D,DC2B","E529":"D83D,DC11","E526":"D83D,DC18","E52D":"D83D,DC0D","E521":"D83D,DC26","E523":"D83D,DC24","E52E":"D83D,DC14","E055":"D83D,DC27","E525":"D83D,DC1B","E10A":"D83D,DC19","E522":"D83D,DC20","E019":"D83D,DC1F","E054":"D83D,DC33","E520":"D83D,DC2C","E306":"D83D,DC90","E030":"D83C,DF38","E304":"D83C,DF37","E110":"D83C,DF40","E032":"D83C,DF39","E305":"D83C,DF3B","E303":"D83C,DF3A","E118":"D83C,DF41","E447":"D83C,DF43","E119":"D83C,DF42","E307":"D83C,DF34","E308":"D83C,DF35","E444":"D83C,DF3E","E441":"D83D,DC1A","E21C":"31,20E3","E21D":"32,20E3","E21E":"33,20E3","E21F":"34,20E3","E220":"35,20E3","E221":"36,20E3","E222":"37,20E3","E223":"38,20E3","E224":"39,20E3","E225":"30,20E3","E210":"23,20E3","E232":"2B06","E233":"2B07","E235":"2B05","E234":"27A1","E236":"2197","E237":"2196","E238":"2198","E239":"2199","E23B":"25C0","E23A":"25B6","E23D":"23EA","E23C":"23E9","E24D":"D83C,DD97","E212":"D83C,DD95","E24C":"D83D,DD1D","E213":"D83C,DD99","E214":"D83C,DD92","E507":"D83C,DFA6","E203":"D83C,DE01","E20B":"D83D,DCF6","E22A":"D83C,DE35","E22B":"D83C,DE33","E226":"D83C,DE50","E227":"D83C,DE39","E22C":"D83C,DE2F","E22D":"D83C,DE3A","E215":"D83C,DE36","E216":"D83C,DE1A","E217":"D83C,DE37","E218":"D83C,DE38","E228":"D83C,DE02","E151":"D83D,DEBB","E138":"D83D,DEB9","E139":"D83D,DEBA","E13A":"D83D,DEBC","E208":"D83D,DEAD","E14F":"D83C,DD7F","E20A":"267F","E434":"D83D,DE87","E309":"D83D,DEBE","E315":"3299","E30D":"3297","E207":"D83D,DD1E","E229":"D83C,DD94","E206":"2733","E205":"2734","E204":"D83D,DC9F","E12E":"D83C,DD9A","E250":"D83D,DCF3","E251":"D83D,DCF4","E14A":"D83D,DCB9","E149":"D83D,DCB1","E23F":"2648","E240":"2649","E241":"264A","E242":"264B","E243":"264C","E244":"264D","E245":"264E","E246":"264F","E247":"2650","E248":"2651","E249":"2652","E24A":"2653","E24B":"26CE","E23E":"D83D,DD2F","E532":"D83C,DD70","E533":"D83C,DD71","E534":"D83C,DD8E","E535":"D83C,DD7E","E21A":"D83D,DD32","E219":"D83D,DD34","E21B":"D83D,DD33","E02F":"D83D,DD5B","E024":"D83D,DD50","E025":"D83D,DD51","E026":"D83D,DD52","E027":"D83D,DD53","E028":"D83D,DD54","E029":"D83D,DD55","E02A":"D83D,DD56","E02B":"D83D,DD57","E02C":"D83D,DD58","E02D":"D83D,DD59","E02E":"D83D,DD5A","E332":"2B55","E333":"274C","E24E":"A9","E24F":"AE","E537":"2122","E036":"D83C,DFE0","E157":"D83C,DFEB","E038":"D83C,DFE2","E153":"D83C,DFE3","E155":"D83C,DFE5","E14D":"D83C,DFE6","E156":"D83C,DFEA","E501":"D83C,DFE9","E158":"D83C,DFE8","E43D":"D83D,DC92","E037":"26EA","E504":"D83C,DFEC","E44A":"D83C,DF07","E146":"D83C,DF06","E154":"D83C,DFE7","E505":"D83C,DFEF","E506":"D83C,DFF0","E122":"26FA","E508":"D83C,DFED","E509":"D83D,DDFC","E03B":"D83D,DDFB","E04D":"D83C,DF04","E449":"D83C,DF05","E44B":"D83C,DF03","E51D":"D83D,DDFD","E44C":"D83C,DF08","E124":"D83C,DFA1","E121":"26F2","E433":"D83C,DFA2","E202":"D83D,DEA2","E135":"D83D,DEA4","E01C":"26F5","E01D":"2708","E10D":"D83D,DE80","E136":"D83D,DEB2","E42E":"D83D,DE99","E01B":"D83D,DE97","E15A":"D83D,DE95","E159":"D83D,DE8C","E432":"D83D,DE93","E430":"D83D,DE92","E431":"D83D,DE91","E42F":"D83D,DE9A","E01E":"D83D,DE83","E039":"D83D,DE89","E435":"D83D,DE84","E01F":"D83D,DE85","E125":"D83C,DFAB","E03A":"26FD","E14E":"D83D,DEA5","E252":"26A0","E137":"D83D,DEA7","E209":"D83D,DD30","E133":"D83C,DFB0","E150":"D83D,DE8F","E320":"D83D,DC88","E123":"2668","E132":"D83C,DFC1","E143":"D83C,DF8C","E50B":"D83C,DDEF,D83C,DDF5","E514":"D83C,DDF0,D83C,DDF7","E513":"D83C,DDE8,D83C,DDF3","E50C":"D83C,DDFA,D83C,DDF8","E50D":"D83C,DDEB,D83C,DDF7","E511":"D83C,DDEA,D83C,DDF8","E50F":"D83C,DDEE,D83C,DDF9","E512":"D83C,DDF7,D83C,DDFA","E510":"D83C,DDEC,D83C,DDE7","E50E":"D83C,DDE9,D83C,DDEA"}
		
		$(document).on("keyup","input,textarea",function(e, previous){
			var textTemp = $(this).val().trim();
			var textLastWord = textTemp.substr(textTemp.length-1);
			var str_tmp='';
			
			for(i=0;i<textLastWord.length;i++){
				str_tmp=textLastWord.charCodeAt(i).toString(16);
			}
			str_tmp = str_tmp.toUpperCase();
			if(emojiUnicode[str_tmp]){
				var emojicode = emojiUnicode[str_tmp];
				var str_result='';
				var arr_tmp=new Array();
				arr_tmp=emojicode.split(',');
				for(i=0;i<arr_tmp.length;i++){
					str_result+=String.fromCharCode(parseInt(arr_tmp[i],16));
				}
				textTemp = $(this).val().replace(textLastWord,str_result);
				$(this).val(textTemp);
			}
			
		});
	}
	
	//通用弹框取消按钮
	$(document).on("click",".gene_cancel",function(){
		$(this).parents(".geneBox").hide();
	});
	
	//下拉框
	$(".selet_list").click(function(){
		$(".selet_list").removeClass("on");
	});
	$("body").on("click",".btn_select",function(){
		var selname = $(this).attr('name');
		$('.selet_list[name='+selname+']').addClass("on");
	}).on("click",".selet_list li",function(){
		var selname = $(this).parents(".selet_list").attr('name');
		$('.btn_select[name='+selname+']').text($(this).text());
	});
	
	//单选按钮
	$(document).on("click",".btn_radio",function(){
		$(this).parents(".radio_group").find("input").removeAttr("checked");
		$(this).find("input").attr("checked","checked");
		$(this).parents(".radio_group").find(".btn_radio").removeClass("on");
		$(this).addClass("on");
	});
	
	/***********置顶按钮***********/
	$(document).on("click",".toTopBtn",function(){
		if($(".main_box_1").length>0){
			$(".main_box_1").animate({scrollTop:"0"},300,tophide) ;
			
		}else if($(".main_box_2").length>0){
			$(".main_box_2").animate({scrollTop:"0"},300,tophide) ;
			
		}else if($(".main_box_3").length>0){
			$(".main_box_3").animate({scrollTop:"0"},300,tophide) ;
			
		}else if($(".main_box_4").length>0){
			$(".main_box_4").animate({scrollTop:"0"},300,tophide) ;
			
		}
		function tophide(){$(".toTopBtn").hide();}
	});
	
	$(".main_box_1,.main_box_2,.main_box_3,.main_box_4").scroll(function(){
    	distanceScroll = $(this)[0].scrollTop;
    	if(distanceScroll > 20){
    		$(".toTopBtn").show();
		}else{
			$(".toTopBtn").hide();
		}
    });
    
	
});




































