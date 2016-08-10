;
function moveToEnd(mainBox,isLoad){
	var windowHeight = mainBox[0].offsetHeight,
		pageHeight = mainBox.find(".scrollContentBox")[0].offsetHeight,
		isSrollY = mainBox.scrollTop();
	if(isLoad || (pageHeight - isSrollY - windowHeight)< 300 ){
		mainBox.stop().animate({scrollTop: pageHeight - windowHeight + 39}, 500);
	}
		
}

$(function(){
	var isiOSBoolean = isiOS(),
		isAndroidBoolean =isAndroid();
		
	var noContentHtml = '<div class="box_nothing" style="display:block;"><span class="tips_1">没有更多</span></div>';
	
	if(document.getElementById('speakBottom')){
		document.getElementById('speakBottom').addEventListener('touchmove',function(e){
			e.preventDefault();
		});
	}
		
	//滚动加载帖子
	if(liveStatus =='beginning'){
		$(".speakContentBox").scroll(function(){
			if($(this).scrollTop() == 0 && $(".start_notice").length<1){
				$(".btnLoadSpeak").addClass("on");
				talkHistory($("#speakBubbles dd").eq(0).attr("attrtime"));
			}
		});
	}else{
		$(".speakContentBox").scroll(function(){
			if($(".bubble_dt.end_tips").length < 1 && $(".speakContentBox")[0].scrollHeight - $(".speakContentBox")[0].scrollTop -$(".speakContentBox")[0].offsetHeight == 0){
				$(".btnLoadSpeakEnd").addClass("on");
				talkHistory($("#speakBubbles dd").last().attr("attrtime"));
			}
		});
	}

	$(".commentContentBox").scroll(function(){
		if($(".commentContentBox .box_nothing").length < 1 && $(".commentContentBox")[0].scrollHeight - $(".commentContentBox")[0].scrollTop -$(".commentContentBox")[0].offsetHeight == 0){
			$(".btnLoadComment").addClass("on");
			commentHistory($(".comment_dd:last-child").attr("attrtime"));
		}
	});

	//回车
	document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13){ 
			if($(document.activeElement).hasClass("speakInput")){
				$(".speakBottom .btnLiveTalk").click();
			}
        }

    }; 
    
    //ios输入状态滚动到底部
   	$(document).on("focus",".speakInput,.commentInput,.danmuInput",function(){
	    $("body").animate({scrollTop:$('body')[0].scrollHeight}, 500);
	});
	
	$(window).resize(function() {
	   $("body").animate({scrollTop:$('body')[0].scrollHeight}, 500);
	});
	
    if(isiOSBoolean){
	    var scrollEndBox = '<div class="scrollEndBox"></div>';
	    document.addEventListener('touchstart', function(e){
			$(".scrollContentBox").append(scrollEndBox);
    	});
    }

	//直播菜单tab
	$(".tab_voice").click(function(){
		if($(".speakBox").hasClass("voiceBottom")){
			removeOtherBClass();
			$(".speakBox").addClass("hasTabBottom");
		}else{
			removeOtherBClass();
			$(".speakBox").addClass("voiceBottom");
		}
	});
	$(".btnBackVoice").click(function(){
		removeOtherBClass();
		$(".speakBox").addClass("hasTabBottom");
	});
	$(".tab_text").click(function(){
		removeOtherBClass();
		$(".speakBox").addClass("textBottom");
		$(".speakInput").focus();
	});
	$(".tab_others").click(function(){
		if($(".speakBox").hasClass("othersBottom")){
			removeOtherBClass();
			$(".speakBox").addClass("hasTabBottom");
		}else{
			removeOtherBClass();
			$(".speakBox").addClass("othersBottom");
		}
	});

	function removeOtherBClass(){
		$(".speakBox").removeClass("textBottom").removeClass("voiceBottom").removeClass("othersBottom").removeClass("hasTabBottom");
	}
	
	$(".tabToComment").click(function(){
		$(".commentBox").show();
	});
	$(".commentHeader").click(function(){
		$(".commentBox").hide();
	});
	
	var isTalking = true;
	
	function topicId(){
		var topicUrl = window.location.pathname;
		var num_1,num_2;
			num_1 = topicUrl.lastIndexOf("."),
			num_2 = topicUrl.lastIndexOf("/")+1;
			
			topicUrl = topicUrl.substring(num_2,num_1);
		return topicUrl;
	}
	var topicId=topicId();
	
	//提交发言
	$(".speakBottom .btnLiveTalk").click(function(e){
		liveTalk("text",$(".speakInput").val(),"",""); 
		e.preventDefault();
		
	});
	$(".commentBottom .btnLiveTalk").click(function(e){
		var isQuestion = "N";
		if($(".commentBottom .btn_ask").hasClass("on")){
			isQuestion = "Y";
		}
		commentWall("text",$(".commentInput").val().replace(/\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029)/g, "<br>"),isQuestion); 
	});
	$(".danmuBottom .btnLiveTalk").click(function(e){
		var isQuestion = "N";
		if($(".danmuBottom .btn_ask").hasClass("on")){
			isQuestion = "Y";
		}
		commentWall("text",$(".danmuInput").val().replace(/\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029)/g, "<br>"),isQuestion); 
	});
	$(".cb_top .btn_ask").click(function(){
		$(this).toggleClass("on");
	})
	$(".commentBox .commentInput").focus(function(){
		$(".commentBox").addClass("typing");
		
	});
	$(".commentBottom .btnCommentCancel").click(function(){
		$(".commentBox").removeClass("typing");
		$(".commentInput").blur();
	})
	 
	//直播发言提交
	function liveTalk(type,content,commentId,second){
		if(isTalking){
			isTalking = false;
			var isReplay;
			
			if(commentId != ""){
				 isReplay = "Y";
			}else{
				isReplay = "N";
				if(content.trim() ==""){
					$(document).minTipsBox({	
						tipsContent:"内容不能为空", 
						tipsTime:1
					});
					isTalking = true;
					return false;
				}
			}
			
			if(type == "text"){
				content = content.replace(/ /g,"\&nbsp\;");
				content = firstFilter(content);
				content = symbolFilter(content);
				content=postBackFilter(content);
			}
			
			if(content.trim().length > 2000){
				$(document).minTipsBox({	
					tipsContent:"内容字数不能超过2000字", 
					tipsTime:1
				});
				isTalking = true;
				return false;
			}
		
			
			var dataJson = 	'{'
							  +'liveId:"'+ liveId +'",'
							  +'commentId:"'+ commentId +'",'
							  +'topicId:"'+topicId+'",'
							  +'type:"'+ type +'",'
							  +'content:"'+ content +'",'
							  +'second:"'+ second +'",'
							  +'creatorRole:"'+ currentUserRole +'",'
							  +'isReplay:"'+ isReplay
							  +'"}';
			$.ajax({
				type: "POST",
				url: CtxPath+"/live/speak/add.htm",
				data: {dataJson:dataJson},
				success:function(result){
					if(type == "audio"|| type == "audioId"){
						$(".recordingSending").hide();
						isRecordSent = true;
						recLocalId = "";
					}
					
					isTalking = true;
					var data=eval("("+result+")");
					if(data.statusCode == "200"){
						if (type == "text"){
							$(".speakInput").val("");
						}
						
						if(isReplay == "Y"){
							var btnHtml= '<i class="btn_iswalled">已上墙</i>'
							$("#commentDl [attr-id="+commentId+"] .right_info" ).prepend(btnHtml);
							$("#commentDl [attr-id="+commentId+"] .btn_wall" ).remove();
							$(".commentReplyBox").hide();
						}
						speakHandle(data.liveSpeakView,false);
						moveToEnd($(".speakContentBox"),true);
						return;

					}else{
						$(document).minTipsBox({
							tipsContent:data.msg, 
							tipsTime:1
						});
						
					}
				},
				error:function(result){
					var data=eval("("+result+")");
					isTalking = true;
					$(document).minTipsBox({	
						tipsContent:data.msg, 
						tipsTime:1
					});
				}
			});
			
		};
	}
	
	//直播历史发言
	var isLoading = true;
	var hasTalkHistory = false;
	function talkHistory(loadTime){
		var beforeOrAfter = "before";
		if(liveStatus == "ended"){
			beforeOrAfter ="after";
		}
		if(isLoading){
			isLoading = false;
			$.ajax({
				type: "GET",
				url: CtxPath+"/live/speak/getSpeak.htm",
				data: {liveId:liveId,beforeOrAfter:beforeOrAfter,time:loadTime,pageSize:'10',topicId:topicId},
				success:function(result){
					var data=eval("("+result+")");
					if(data.statusCode == "200"){
						var btnHeight = $(".btnLoadSpeak")[0].offsetHeight;
						for (var i = 0;i<data.liveSpeakViews.length;i++) {
							var dataObj = data.liveSpeakViews[i];
							speakHandle(dataObj,true);
						}
						
						$("#BubblesTemp .recordingMsg").each(function(){
							imReaded($(this).parents("dd").attr("attr-id"));
						});
						
						if(isIntervalStart){
							isIntervalStart = false;
							$("#BubblesTemp").children().appendTo($("#speakBubbles"));
							$(".btnLoadSpeak").removeClass("on");
							$(".btnLoadSpeakEnd").removeClass("on");
							isLoading = true;
							if(liveStatus != "ended"){
								moveToEnd($(".speakContentBox"),true);
								intervalStart();
							}
							$(".qlLoading").remove();
							clearTimeout(relLoadBox);
						}else{
							setTimeout(function(){
								if(liveStatus == "ended"){
									$("#BubblesTemp").children().appendTo($("#speakBubbles"));
								}else{
									var pageHeightB = $("#BubblesTemp")[0].offsetHeight;
									$("#BubblesTemp").children().prependTo($("#speakBubbles"));
									btnHeight = btnHeight - $(".btnLoadSpeak")[0].offsetHeight;
									pageHeightB = pageHeightB - $("#BubblesTemp")[0].offsetHeight + $(".speakContentBox").scrollTop();
									$(".speakContentBox").scrollTop(pageHeightB - btnHeight);
								}
								$(".btnLoadSpeak").removeClass("on");
								$(".btnLoadSpeakEnd").removeClass("on");
								isLoading = true;
							},1000);
						};
						
						
						
						
					}else{
						isLoading = true;
					}
					
				},
				error:function(){
					isLoading = true;
				}
			});
		}
		
		
	}
	
	//评论发言提交
	function commentWall(type,content,isQuestion){

		if(isTalking){
			isTalking = false;
			var isquestion=isQuestion||"N";
			
			if(type == "text"){
				content=firstFilter(content);
				content = symbolFilter(content.replace(/ /g,"\&nbsp\;"));
				content=postBackFilter(content);
			}
			
			if(content.trim() ==""){
				$(document).minTipsBox({	
					tipsContent:"内容不能为空", 
					tipsTime:1
				});
				isTalking = true;
				return false;
			}else if(content.trim().length > 2000){
				$(document).minTipsBox({	
					tipsContent:"内容字数不能超过2000字", 
					tipsTime:1
				});
				isTalking = true;
				return false;
			}
			
			
			
			
			$.ajax({
				type: "POST",
				url: CtxPath+"/live/comment/add.htm",
				data: {liveId:liveId,topicId:topicId,type:type,content:content,isQuestion:isquestion},
				success:function(result){
					isTalking = true;
					var data=eval("("+result+")");
					if(data.statusCode == "200"){
						if (type == "text"){
							$(".askTypeBox").hide();
							$(".commentInput").val("");
							$(".danmuInput").val("");
							$(".commentInput").blur();
							$(".commentBox").removeClass("typing");
							$(".danmuBottom").height("0rem");
							$(".blackBg").hide();
							$(".danmuInput").blur();
						}
						commentHandle(data.liveCommentView,true);
						danmuHandle(data.liveCommentView,true);
						$(".commentContentBox").stop().animate({scrollTop: 0}, 500);
					}else{
						isTalking = true;
						$(document).minTipsBox({	
							tipsContent:data.msg, 
							tipsTime:1
						});
					}
				},
				error:function(){
					isTalking = true;
					$(document).minTipsBox({	
						tipsContent:data.msg, 
						tipsTime:1
					});
				}
			});
			
		};
		
		
	}
	
	//评论历史
	var noCommentHistory = false;
	var isLoadingComment = true;
	function commentHistory(loadTime){
		if(isLoadingComment){
			isLoadingComment = false;
			
			$.ajax({
				type: "GET",
				url: CtxPath+"/live/comment/getComment.htm",
				data: {liveId:liveId,beforeOrAfter:"before",time:loadTime,pageSize:'10',topicId:topicId},
				success:function(result){
					var data=eval("("+result+")");
					if(data.statusCode == "200"){
					
						var btnHeight = $(".btnLoadComment")[0].offsetHeight;
						for (var i = 0;i<data.liveCommentViews.length;i++) {
							var dataObj = data.liveCommentViews[i];
							commentHandle(dataObj,false);
						}
						
						if(noCommentHistory && $(".commentContentBox .box_nothing").length<1){
							$(".commentContentBox .scrollContentBox").append(noContentHtml);
						}
						$(".btnLoadComment").removeClass("on");
						isLoadingComment = true;
						if(iscommentStart){
							iscommentStart=false;
							$(".isdan_btn_a").click();
						}
//						setTimeout(function(){
//							var pageHeightB = $("#commentDlTemp")[0].offsetHeight;
//							$("#commentDlTemp").children().prependTo($("#commentDl"));
//							btnHeight = btnHeight - $(".btnLoadComment")[0].offsetHeight;
//							pageHeightB = pageHeightB - $("#commentDlTemp")[0].offsetHeight + $(".commentContentBox").scrollTop();
//							$(".commentContentBox").scrollTop(pageHeightB - btnHeight);
//							$(".btnLoadComment").removeClass("on");
//							isLoadingComment = true;
//						},1000);
							
					}else{
						isLoadingComment = true;
					}
				},
				error:function(){
					isLoadingComment = true;
				}
			});
		}
		
		
	}

	//直播发言处理
	function speakHandle(data,isPrepend){
		var isL = "left_bubble",isR = "right_bubble";
		var likesNum = 0;
		if(data.likesNum){
			likesNum = data.likesNum;
		}
		var speakCreateByHeadImgUrl = "http://img.skg.com/wtWap/forumLogo/normalForumLogo.png";
		if(/^(http)/.test(data.speakCreateByHeadImgUrl)){
			speakCreateByHeadImgUrl = data.speakCreateByHeadImgUrl;
		}
		
		var creatorRole = "";
		switch(data.creatorRole){
			case "guest": creatorRole = "嘉宾" ; break;
			case "compere": creatorRole = "特邀主持人" ; break;
			case "topicCreater": creatorRole = "主持人" ; break;
		}
		if($(".speakContentBox [attr-id="+data.id+"]").length < 1){
			if(data.type == "start"){
				if($(".start_notice").length < 1){
					var bubbleHtml = '<dt class="bubble_dt start_notice" attr-id="'+ data.id +'" attrtime="'+ data.createTime +'"><b>本次直播将于'+startDate+'开始</b></dt>';
					var nowTime = new Date().getTime();
					if( nowTime < startTime ){
						var afterTimeStart = startTime - nowTime;
						setTimeout(function(){
							if($(".start_notice").length > 0){
								$(".start_notice b").text($(".start_notice b").text().replace("将",""));
							}
						},afterTimeStart);
						
					}else{
						bubbleHtml = bubbleHtml.replace("将","");
					}
				}
				
				if($(".setPasswordTips").length>0){
					$(".setPasswordTips").show();
				}
				if($(".setGuestTips").length>0){
					$(".setGuestTips").show();
				}
				
			}else if(data.type == "end" && $(".end_tips").length < 1){
				var bubbleHtml ='<dt class="bubble_dt end_tips" attr-id="'+ data.id +'"><b>直播已结束</b></dt>';
			}else if(data.type == "redpacket"){
				var bubbleHtml ='<dd class="'+ isR +' luckyMoney" attr-id="'+ data.id +'" attrcreateby="'+ data.createBy +'" attrtime="'+ data.createTime +'">'
								+'<div class="speak_time">'+ data.createTimeView +'</div>'
								+'<div class="head_portrait"><img src="'+speakCreateByHeadImgUrl+'"></div>'
								+'<div class="speaker_name"><b>'+ data.speakCreateByName +'</b>'+ creatorRole +'</div>'
								+'<div class="bubble_content" attr-myself="'+ (data.commentId==userId) +'" attr-money="'+data.rewardMoney+'" attr-response="'+data.rewardResponse+'" attr-who="'+data.content+'">'
								+'<p>赞赏了'+data.content+'</p>'
								+'<p>红包</p></div></dd>';
								
			}else if(data.type != "start"&&data.type != "end"&&data.type != "redpacket"){
				var contentType ='';
				if(data.type=="audio"){
					contentType = 'recordingMsg';
					var recordsecond=data.second;
					if(recordsecond<=12){
						contentType+=' recordwid1';
					}else if(recordsecond>0 && recordsecond<=24){
						contentType+=' recordwid2';
					}else if(recordsecond>24 && recordsecond<=36){
						contentType+=' recordwid3';
					}else if(recordsecond>36 && recordsecond<=48){
						contentType+=' recordwid4';
					}else if(recordsecond>48 && recordsecond<=60){
						contentType+=' recordwid5';
					}
				}
				
				var bubbleHtml = '<dd class="'+ isL +'" attr-id="'+ data.id +'" attrtime="'+ data.createTime +'" attrcreateby="'+ data.createBy +'">'
					+'<div class="speak_time">'+ data.createTimeView +'</div>'
					+'<div class="head_portrait"><img src="'+speakCreateByHeadImgUrl+'"></div>'
					+'<div class="speaker_name"><b>'+ data.speakCreateByName +'</b>'+ creatorRole +'</div>'
					+'<div class="bubble_content '+ contentType +'">';
					if(data.type == "text"){
						bubbleHtml +='<p>';
					}
					if(data.commentId != ""){
						bubbleHtml += '<b>@'+data.commentCreateByName+'</b>';
						if(data.isReplyQuestion=="Y"){
							bubbleHtml+='<em class="ask_label">问</em>';
						}
						switch (data.commentType){
							case "text": bubbleHtml+= data.commentContent+'</p>';  break;
							case "image": bubbleHtml+= '</p><img src="'+ data.commentContent +'">'; break;
						}
						if(data.content !=""){
							bubbleHtml += '<p><b>回复</b>';
						}else{
							bubbleHtml += '<p>';
						}
						
					}
					switch (data.type){
						case "text": bubbleHtml+= data.content+'</p>';  break;
						case "image": bubbleHtml+= '<img src="'+ data.content +'">'; break;
						case "audio": bubbleHtml+= '<i class="audio_info" attr-src="'+ data.content +'"></i><var>'+ data.second +'</var>'; break;
					}
					
					bubbleHtml +='</div>';
					if (percentageRule.isEnable == 'Y') {
						bubbleHtml += '<a class="btn_ilike" href="javascript:;">赏</a>';
					}
					
					if(powerEntity.allowDelSpeak || data.createBy == userId){
						bubbleHtml+= '<a class="btn_revoke" href="javascript:;">撤回</a>';
					}
				bubbleHtml+='</dd>';
				
				
			}
			
			if(isPrepend){
				if(liveStatus == "ended"){
					$("#BubblesTemp").append(bubbleHtml);
				}else{
					$("#BubblesTemp").prepend(bubbleHtml);
				}
				
				hasTalkHistory = false;
			}else{
				$("#speakBubbles").append(bubbleHtml);
				if(data.type == "audio"){
					newAudioPlay();
				}
			}
			moveToEnd($(".speakContentBox"),false);

		}else{
			hasTalkHistory = true;
		}
		
	}
	
	//评论发言处理
	function commentHandle(data,isPrepend){
		$("#loadNone").hide();
		var ishas = $(".commentContentBox [attr-id="+data.id+"]").length < 1;
		if(ishas){
			var createByImgUrl = "http://img.skg.com/wtWap/forumLogo/normalForumLogo.png";
			if( /^(http)/.test(data.createByHeadImgUrl)){
				createByImgUrl = data.createByHeadImgUrl
			};
			
			var voteType ="";
			if(data.voteType){
				switch(data.voteType){
					case "likes": voteType = "liked"; break;
					case "despise": voteType = "hated"; break;
				}
			}
			
			var commentHtml = '<dd class="comment_dd '+ voteType +'" attr-id="'+ data.id +'" attrtime="'+ data.createTime +'" attrcreateby="'+ data.createBy +'">'
									+'<span class="right_info">';
									if(powerEntity.allowReplyComment&& liveStatus =='beginning'){
										switch(data.isReplay){
											case "N":commentHtml+='<i class="btn_wall">上墙</i> '; break;
											case "Y":commentHtml+='<i class="btn_iswalled">已上墙</i> '; break;
										}
									}
									commentHtml+='<i class="btn_like">'+ data.likesNum +'</i> '
										+'<i class="btn_hate">'+ data.despiseNum +'</i>'
									+'</span>'
									+'<a class="avatar"><img src="'+ createByImgUrl +'"/></a>'
									+'<a class="author_name">'+ data.createByName +'</a>'
									+'<b class="time">'+ data.createTimeView +'</b>';
									if(powerEntity.allowDelSpeak || data.createBy == userId){
										commentHtml+='<i class="delCommentMsg">删除</i>';
									}
									
									commentHtml+='<p class="content">';
									if(data.isQuestion=="Y"){
										commentHtml+='<em class="ask_label">问</em>';
									}
			switch (data.type){
				case "text": commentHtml+= data.content;  break;
				case "image": commentHtml+= '<img src="'+ data.content +'">';  break;
			}						
			commentHtml +=	'</p></dd>';
			
			if(isPrepend){
				//$("#commentDlTemp").prepend(commentHtml);
				$("#commentDl").prepend(commentHtml);
			}else{
				noCommentHistory = false;
				$("#commentDl").append(commentHtml);
			}
		}else{
			noCommentHistory = true;
		}
	}
	
	//投票处理
	function voteHandle(data){
		if($("#commentDl [attr-id="+data.commentId+"]").length > 0){
			var commentDd = $("#commentDl [attr-id="+data.commentId+"]");
			commentDd.find(".btn_like").text(data.liveCommentPo.likesNum);
			commentDd.find(".btn_hate").text(data.liveCommentPo.despiseNum);
			
			if(data.id == userId){
				switch (data.voteType){
					case "likes": 
						commentDd.addClass("liked").removeClass("hated");
						break;
					case "despise": 
						commentDd.addClass("hated").removeClass("liked");
						break;
				}
			}
		}
	}
	
	//直播点赞处理
	function speakVoteHandle(data){
		if($("#speakBubbles [attr-id="+data.speakId+"]").length > 0){
			var likeBtn = $("#speakBubbles [attr-id="+data.speakId+"]").find(".liveflower");
			var likeNum = Number(likeBtn.text());
			
			if(data.id != userId){
				likeBtn.text(++likeNum);
			}else{
				if(!likeBtn.hasClass("on")){
					likeBtn.addClass("on");
					likeBtn.text(++likeNum);
				}
			}
		}
		
	}

	//上墙、点赞
	$(document).on("click",".btn_wall",function(){
		var replyToName = $(this).parents(".comment_dd").find(".author_name").text();
		$(".commentReplyBox").attr("attrCommentId",$(this).parents(".comment_dd").attr("attr-id"));
		$(".commentReplyBox textarea").val("");
		$(".commentReplyBox").show();
	}).on("click",".btn_like,.btn_hate",function(){
		
		var voteType,
			commentId =  $(this).parents(".comment_dd").attr("attr-id"),
			LOrH = "liked",
			removeLOrH = "hated",
			self = $(this);
			
		if($(this).hasClass("btn_like")){
			voteType = "likes";
		}else if($(this).hasClass("btn_hate")){
			voteType = "despise";
			LOrH = "hated",
			removeLOrH = "liked";
		}
		
		if(!$(this).parents(".comment_dd").hasClass(LOrH)){
			$(this).parents(".comment_dd").addClass(LOrH);
			
			$.ajax({
				type: "POST",
				url: CtxPath+"/live/comment/commentLike.htm",
				data: {liveId:liveId,topicId:topicId,voteType:voteType,commentId:commentId},
				success:function(result){
					var data=eval("("+result+")");
					if(data.statusCode == "200"){
						self.parents(".comment_dd").removeClass(removeLOrH);
						var haslikes = "",
							hasdespise = "";
						if(data.result.likes){haslikes = data.result.likes};
						if(data.result.despise){hasdespise = data.result.despise};
						var datajson = 	'{"id":"'+data.result.id+'","commentId":"'+ data.result.commentId +'","voteType":"'+ data.result.voteType +'","liveCommentPo":{"despiseNum":"'+ data.result.liveCommentPo.despiseNum+'","likesNum":"'+ data.result.liveCommentPo.likesNum+'"}}';
						datajson = eval("("+datajson+")");
						voteHandle(datajson);
					}else if(data.statusCode == "205"){
						$(document).minTipsBox({	
							tipsContent: data.msg, 
							tipsTime:1
						});
					}
					
				},
				error:function(){
					self.parents(".comment_dd").removeClass(LOrH);
					
				}
			});
		}
		
		
		
	});
	
	//上墙发表
	$(".commentReplyBox .gene_confirm").click(function(e){
		liveTalk("text",$(".commentReplyBox textarea").val(),$(".commentReplyBox").attr("attrCommentId"),"");
		e.preventDefault();
	});

	//发图
	if($(".btnImgUpload").length>0){
		new imgUpload($(".btnImgUpload"),
		{	
			project:"wtLive",
			folder:"liveComment",
			onComplete : function(imgUrl) {
				var commentImgUrl = imgUrl+'@150h_1e_1c_2o_1l';
				liveTalk("image",commentImgUrl,"","");
				$(".loadingBox").hide();
			},
			onChange : function(){
				$(".loadingBox").show();
			},
			onError : function(){
				$(".loadingBox").hide();
			}
				
		});
	}
	
	//直播点赞
//	$(document).on("click",".liveflower",function(){
//		if($(this).hasClass("on")){return false;}
//		var _self = $(this);
//			goodnum = Number($(this).text()),
//			speakId = $(this).parents("dd").attr("attr-id");
//			
//		$.ajax({
//			type: "POST",
//			url: CtxPath+"/live/comment/speakLike.htm",
//			data: {liveId:liveId,topicId:topicId,voteType:"likes",speakId:speakId},
//			success:function(result){
//				var data=eval("("+result+")");
//				if(data.statusCode == "200"){
//					_self.addClass("on").text(++goodnum);
//				}else if(data.statusCode == "205"){
//					$(document).minTipsBox({	
//						tipsContent: data.msg, 
//						tipsTime:1
//					});
//				}
//				
//			},
//			error:function(result){
//				var data=eval("("+result+")");
//				$(document).minTipsBox({	
//					tipsContent: data.msg, 
//					tipsTime:1
//				});
//				
//			}
//		});
//	});
	
	//删除直播发言和直播评论
	$(document).on("click",".btn_revoke",function(){
		var _self = $(this);
			speakId = $(this).parents("dd").attr("attr-id");
			createBy = $(this).parents("dd").attr("attrcreateby");
		$(document).popBox({
            boxContent:"确定撤回吗？", 
            btnType:"both",
            confirmFunction: function(){
            	$.ajax({
					type: "POST",
					url: CtxPath+"/live/speak/speakMg.htm",
					data: {speakId:speakId,topicId:topicId,createBy:createBy},
					success:function(result){
						var data=eval("("+result+")");
						if(data.statusCode == "200"){
							delLiveMsgHandle(speakId);
						}else if(data.statusCode == "205"){
							$(document).minTipsBox({	
								tipsContent: data.msg, 
								tipsTime:1
							});
						}
						
					},
					error:function(result){
						var data=eval("("+result+")");
						$(document).minTipsBox({	
							tipsContent: data.msg, 
							tipsTime:1
						});
						
					}
				});
            	
            }
        });
	});
	$(document).on("click",".delCommentMsg",function(){
		var _self = $(this);
			commentId = $(this).parents("dd").attr("attr-id");
			createBy = $(this).parents("dd").attr("attrcreateby");
		$(document).popBox({
            boxContent:"确定删除吗？", 
            btnType:"both",
            confirmFunction: function(){
            	$.ajax({
					type: "POST",
					url: CtxPath+"/live/comment/commentMg.htm",
					data: {commentId:commentId,topicId:topicId,createBy:createBy},
					success:function(result){
						var data=eval("("+result+")");
						if(data.statusCode == "200"){
							delLiveCommentHandle(commentId);
						}else if(data.statusCode == "205"){
							$(document).minTipsBox({	
								tipsContent: data.msg, 
								tipsTime:1
							});
						}
					},
					error:function(result){
						var data=eval("("+result+")");
						$(document).minTipsBox({	
							tipsContent: data.msg, 
							tipsTime:1
						});
					}
				});
            	
            }
        });
	});
	
	//删除直播发言和直播评论处理
	function delLiveMsgHandle(speakId){
		if($("#speakBubbles [attr-id="+speakId+"]").length > 0){
			$("#speakBubbles [attr-id="+speakId+"]").remove();
		}
	}
	function delLiveCommentHandle(commentId){
		if($("#commentDl [attr-id="+commentId+"]").length > 0){
			$("#commentDl [attr-id="+commentId+"]").remove();
		};
		if($(".danmulist [attr-id="+commentId+"]").length > 0){
			$(".danmulist [attr-id="+commentId+"]").remove();
		};
		if($("#commentDl dd").length<1){
			$("#loadNone").show();
		}
	}

    //录音
    var recordingSecond = 0;
    var recordingTimer;
    var btnOffsetTop;
    var isTouching = true,
    	isRecordingStart = false,
		isRecordSent = true,
		isTouching = true,
		isClickRecStart = true,
		fristRec = true,
		frequentlyTouch = true;
	
    if(document.getElementById('speakBottom')){
    	btnOffsetTop = document.getElementById('speakBottom').offsetTop + $(".tab_speak")[0].offsetHeight;
    }
   
    function clock(){	
    	recordingSecond++;
		if(recordingSecond >60){
			recordingSecond = 60;
		}
		$(".second_dd var").text(recordingSecond);
	}

	if((isiOS() || isAndroid())&&$("#speakBottom").length > 0){
	    document.getElementById('btnRecording').addEventListener('touchstart', function(e){
	    	e.preventDefault();
	    	if(fristRec){
	    		fristRec = false;
	    		$(document).minTipsBox({	
					tipsContent: "如果遇到无法录音，请切换录音模式", 
					tipsTime:3
				});
	    	}
	    	btnOffsetTop = document.getElementById('speakBottom').offsetTop + $(".tab_speak")[0].offsetHeight;
	    	isTouching = true;
	    	if(isRecording && isRecordSent && isClickRecStart&&frequentlyTouch){
	    		isRecording = false;
	    		frequentlyTouch = false;
	    		setTimeout(function(){
	    			frequentlyTouch = true;
	    		},1000);
		      	wx.startRecord({
		      		success: function (res) {
				        stopAnime();
				      	_audioPlayer.pause();
				      	if(isTouching){
				      		isRecordingStart = true;
				      		$("#btnRecording").addClass("on");
				      		$(".speakBottom").addClass("recording");
				      		$(".recording_box .tips_dd").text("松开发送");
						  	recordingSecond = 0;
					    	recordingTimer = setInterval(clock,1000);
				      	}else{
				      		wx.stopRecord({
							    complete:function(res){
							    	isRecording = true;
							    }
							});
				      		
				      	}
				    },
				    fail:function(res){
				    	isRecording = true;
				    }
		      	});
	    	}
	    });
	    
	    document.getElementById('btnRecording').addEventListener('touchmove', function(e){
	    	if($(".clickRecording").length < 1){
		    	var touchY = e.changedTouches[0].clientY;
		    	if(touchY >= btnOffsetTop){
		        	$(".recordingTips_2").hide();
		        	$(".recording_box .tips_dd").text("松开发送");
				}else{
					$(".recordingTips_2").show();
					$(".recording_box .tips_dd").text("松开取消");
				}
			}
	   	});
		   	
	    function wxUploadVoice(localId) {
	    	isRecordSent = false;
	    	if(recordingSecond<1){
	    		recordingSecond = 1;
	    	}
			wx.uploadVoice({
			    localId: localId, 
			    isShowProgressTips: 1,
			    success: function (res) {
			        var serverId = res.serverId; 
			        $(".recordingSending").show();
			        liveTalk("audioId",serverId,"",recordingSecond);
			    },
			    complete:function(res){
			    	removeClickClass();
			    	isClickRecStart = true;
			    }
			});
			$(".second_dd var").text("0");
			if(isiOSBoolean){
				wx.playVoice({
					localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
				});
				wx.stopVoice({
					localId: localId // 需要停止的音频的本地ID，由stopRecord接口获得
				});
			}
	    }
	    
		document.addEventListener('touchend', function(e){
			//屏蔽上拉黑底
			if(isiOSBoolean){
				if($(".scrollEndBox").length > 0){
					$(".scrollEndBox").remove();
				}
				setTimeout(function(){
					if($(".scrollEndBox").length < 1){
						$(".liveBoxContent").append(scrollEndBox);
					}
				},700);
			}
			
			//录音
			if($(".clickRecording").length < 1){
				isTouching = false;
				$(".speakBottom").removeClass("recording");
				$(".recordingTips_2").hide();
				$(".recording_box .tips_dd").text("按住说话");
				setTimeout(function(){
					$("#btnRecording").removeClass("on");
					$(".second_dd var").text("0");
					if(isRecordingStart){
						var localId;
						var touchY = e.changedTouches[0].clientY;
						clearInterval(recordingTimer);
						if(recordingSecond < 1){
							$(document).minTipsBox({	
								tipsContent: "录音时间太短", 
								tipsTime:1
							});
							wx.stopRecord();
							isRecording = true;
						    isRecordingStart = false;
						}else{
							wx.stopRecord({
							    success: function (res) {
							        localId = res.localId;
							        if(touchY >= btnOffsetTop){
							        	wxUploadVoice(localId);
									}else{
										$(document).minTipsBox({	
											tipsContent: "已取消发送", 
											tipsTime:1
										});
									}
							    },
							    complete:function(res){
							    	isRecording = true;
							    	isRecordingStart = false;
							    }
							});
						}
						
						
					}else{
						wx.stopRecord();
						isRecording = true;
					}
				},300);
			}
	    });
	    
	    document.addEventListener('touchcancel', function(e){
	    	isTouching = false;
	    	$(".speakBottom").removeClass("recording");
			$(".recordingTips_2").hide();
			$(".recording_box .tips_dd").text("按住说话");
			$(".second_dd var").text("0");
	    });	
		
		wx.ready(function(){
		    wx.onVoiceRecordEnd({
			    // 录音超过一分钟
			    complete: function (res) {
			    	clearInterval(recordingTimer);
			    	recordingSecond = 60;
			    	$(".speakBottom").removeClass("recording").removeClass("recording_2");
					$(".recordingTips_2").hide();
					$("#btnRecording").removeClass("on");
					isRecordingStart = false;
					isRecording = true;
			        var localId = res.localId; 
			        wxUploadVoice(localId)
			    }
			});
		});

		function removeClickClass(){
			$(".recording_click .btn_dd").removeClass("stopRec").removeClass("startRec");
		}

		$(".tab_recordingType").click(function(){
			$(".recording_tab_box").toggleClass("clickRecording");
		});

		$("#btnStartRec").click(function(){
			if(isClickRecStart){
				isClickRecStart = false;
				wx.startRecord({
		      		success: function (res) {
				        stopAnime();
				      	_audioPlayer.pause();
				      	removeClickClass();
			      		$(".recording_click .btn_dd").addClass("startRec");
			      		$(".speakBottom").addClass("recording_2");
			      		$(".recording_click .tips_dd").text("点击按钮，完成录音");
					  	recordingSecond = 0;
				    	recordingTimer = setInterval(clock,1000);
				    },
				    fail:function(res){
				    	isClickRecStart = true;
				    	removeClickClass()
				    }
		      	});
				
			}
			
		});
			
		var recLocalId;
		$("#btnStopRec").click(function(){
			if(recordingSecond < 1){
				$(document).minTipsBox({	
					tipsContent: "录音时间太短", 
					tipsTime:1
				});
			}else{
				clearInterval(recordingTimer);
				wx.stopRecord({
				    success: function (res) {
				        recLocalId = res.localId;
				        removeClickClass();
				        $(".recording_click .btn_dd").addClass("stopRec");
				        $(".recording_click .tips_dd").text("");
				    },
				    fail:function(res){
				    	removeClickClass();
				    	isClickRecStart = true;
				    	$(".second_dd var").text("0");
				    	$(".speakBottom").removeClass("recording_2");
				    	$(".recording_click .tips_dd").text("点击按钮录音");
				    	$(document).minTipsBox({	
							tipsContent: "录音时间太短", 
							tipsTime:1
						});
				    }
				});
			}
			
			
		});
		
		$("#btnSentRec").click(function(){
			if(recLocalId != ""){
				wxUploadVoice(recLocalId);
				$(".speakBottom").removeClass("recording_2");
				$(".recording_click .tips_dd").text("点击按钮录音");
			}
		});
		
		$("#btnCancelRec").click(function(){
			isClickRecStart = true;
			$(".second_dd var").text("0");
			$(".speakBottom").removeClass("recording_2");
			$(".recording_click .tips_dd").text("点击按钮录音");
			removeClickClass();
			
		});

	}else{
		$("#btnRecording").click(function(){
			$(document).minTipsBox({	
				tipsContent: "请到手机端录音", 
				tipsTime:1
			});
		})
	}

    //播放音频
    var lastPlay,
    	isAutoPlay = true,
    	_audioPlayer = document.getElementById("audioPlayer"), 
    	$audioPlayer = $("#audioPlayer"),
    	audioType = ".aac",
    	newCurrentTime = 0,
		isWaitTime = 0;
		
    	if(isAndroid()){
    		audioType = ".amr";
    	}
    
	$(document).on("click",".recordingMsg",function(){
		playAudio($(this));
	});
	
	var checkALoad;
	function playAudio(isme){
		var self = isme;
		self.addClass("isReaded");
		if(checkALoad){
			clearInterval(checkALoad);
		}
		rememberImReaded(self.parents("dd").attr("attr-id"));
		if(!self.hasClass("isPlaying")){
			stopAnime();
			self.addClass("isPlaying");
			self.addClass("audioloading");
			var audioTempSrc = self.find(".audio_info").attr("attr-src");
			if(!/(\.mp3)/.test(audioTempSrc)){
				audioTempSrc = audioTempSrc.replace(/(\.amr)|(\.aac)/gi,"")+audioType;
			}
			$audioPlayer.attr("src",audioTempSrc);
			_audioPlayer.volume=1;
			_audioPlayer.play();
		}else{
			_audioPlayer.pause();
			stopAnime();
		}
	}
	
	function stopAnime(){
		if($(".isPlaying").length > 0){
			$(".isPlaying").removeClass("audioloading").removeClass("isPlaying"); 
		}
		
	}

	_audioPlayer.loop = false;
	
	try
	{
		_audioPlayer.addEventListener('ended', function () {  
			var self = $(".isPlaying");
			self.removeClass("audioloading");
			clearInterval(checkALoad);
			var playIndex = $("#speakBubbles .recordingMsg").index(self);
			if(playIndex < $("#speakBubbles .recordingMsg").length - 1){
				playAudio($("#speakBubbles .recordingMsg").eq(playIndex+1));
			}else{
				stopAnime();
			}
		}, false);
		_audioPlayer.addEventListener('pause', function () { 
			if(!$audioPlayer.hasClass("isSpecialPause")){
				var self = $(".isPlaying");
				clearInterval(checkALoad);
				setTimeout(function(){
					if(self.hasClass("isPlaying")){
						$(".isPlaying").removeClass("audioloading").removeClass("isPlaying");
					}
				},1000);
			}
		}, false);
		_audioPlayer.addEventListener('canplaythrough', function (e) { 
			$(".isPlaying").removeClass("audioloading");
			checkALoad = setInterval(function(){
				$audioPlayer.removeClass("isSpecialPause");
				if(newCurrentTime == _audioPlayer.currentTime){
					$(".isPlaying").addClass("audioloading");
					isWaitTime++;
					if(isWaitTime > 2 && isiOSBoolean){
						isWaitTime = 0;
						$audioPlayer.addClass("isSpecialPause");
						_audioPlayer.pause();
						_audioPlayer.currentTime = _audioPlayer.currentTime+0.1;
						_audioPlayer.play();
						
					}
				}else{
					isWaitTime = 0;
					$(".isPlaying").removeClass("audioloading");
				}
				newCurrentTime = _audioPlayer.currentTime;
			},1100);
		}, false);
		_audioPlayer.addEventListener('stalled', function(e){ 
			if($(".audioloading").length > 0){
				$(document).minTipsBox({	
					tipsContent: "网络不佳，请检查网络", 
					tipsTime:1
				});
			}
		}, false);
		_audioPlayer.addEventListener('error', function () { 
			$(document).minTipsBox({	
				tipsContent: "音频加载失败，请稍后重试", 
				tipsTime:1
			});
		}, false);
	
	}catch(err){}
	
	//记录已播放音频
	var recordReaded={};

	if(localStorage.getItem('recordReaded')){
		recordReaded=JSON.parse(localStorage['recordReaded']);
	}
	
	function imReaded(id){
		if(recordReaded[id]){
			$(".left_bubble[attr-id="+ id +"]").find(".recordingMsg").addClass("isReaded");
		}
	}
	
	function rememberImReaded(id){
		if(!recordReaded[id]){
			recordReaded[id] = new Date().getTime();
			localStorage.setItem('recordReaded',JSON.stringify(recordReaded));
		}
	}
	
	$("#speakBubbles .recordingMsg").each(function(){
		imReaded($(this).parents("dd").attr("attr-id"));
	});
	
	if(localStorage.getItem('isAutoPlay')){
		if(localStorage.getItem('isAutoPlay') == "false"){
			isAutoPlay = false;
		}
	}
	
	if(powerEntity.allowSpeak){
		isAutoPlay = false;
	}
	
	if(!isAutoPlay){
		$("#btnAutoPlay").removeClass("swon")
	}
	
	//新消息自动播放
	$("#btnAutoPlay").click(function(){
		$("#btnAutoPlay").toggleClass("swon");
		if($("#btnAutoPlay").hasClass("swon")){
			isAutoPlay = true;
			localStorage.setItem('isAutoPlay',"true");
		}else{
			isAutoPlay = false;
			localStorage.setItem('isAutoPlay',"false");
		}
	});
	
	function newAudioPlay(){
		if(isAutoPlay && liveStatus == "beginning" && $(".isPlaying").length < 1){
			playAudio($(".recordingMsg:last"));
		}
	}
	

    function rewardactionHandle(data){
    	if($(".luckyMoney[attr-id='" + data.id + "']").length>0){
    		$(".luckyMoney[attr-id='" + data.id + "']").find(".bubble_content").attr("attr-response",data.rewardResponse);
    	}
    }

	//  赞赏
	$(document).on("click",".btn_ilike",function(){
		if(isiOS()||isAndroid()){
    		var shangid=$(this).parents("dd").attr("attrcreateby");
			var name=$(this).parents("dd").find(".speaker_name b").text();
			var userImg = $(this).parents("dd").find(".head_portrait img").attr("src");
			$(".live_headpic img").attr("src",userImg)
			$(".live_towho").attr("shangid",shangid);
			$(".live_towho").text(name);
			$(".redbagBox").show();
    	}else{
    		$(document).popBox({
	            boxContent:"请使用手机微信赞赏", 
	            btnType:"confirm",
	            confirmName:"知道了"
	        });
    	}
		
	});
	var redbagbol=true;
	$(document).on("click",".live_redbaglist li",function(){
		var pageid=$(".live_towho").attr("shangid");
		var pagemoney=Number($(this).find("var").text());
		if(Number(pagemoney)<2){
       	 $(document).minTipsBox({
				tipsContent:"请输入大于2的金额", 
				tipsTime:1
			});
       	return false;
        }else if(Number(pagemoney)>200){
       	 $(document).minTipsBox({
 				tipsContent:"请输入小于200的金额", 
 				tipsTime:1
 			});
        	return false;
         }
		var pagemoney=pagemoney*100;
		liveRedbag("redpacket",pagemoney,pageid,liveId,topicId);
		
		
	});

	//   赞赏弹框
    $(document).on("click",".live_othermoney",function(){
    	$(".otherRedmoneyBox").show();
    }).on("click",".otherRedmoneyBox",function(et){
    	if(et.target.className=="redbag_count_label"||et.target.className=="money_count"||et.target.className=="gene_btn gene_confirm"){
    		return false;
    	}
    	$(".otherRedmoneyBox").hide();
    });
    $(document).on("click",".otherRedmoneyBox .gene_confirm",function(){
    	var pagemoney=Number($(".money_count").val());
    	var pageid=$(".live_towho").attr("shangid");
    	if(pagemoney==""){
    		$(document).minTipsBox({
				tipsContent:"金额不能为空", 
				tipsTime:1
			});
    		return false;
    	}else if(!/(^[0-9]*\.[0-9]*$)|(^[0-9]*$)/.test(pagemoney)){  
    		$(document).minTipsBox({
				tipsContent:"请输入数字!", 
				tipsTime:1
			});
             return false; 
         }else if(Number(pagemoney)<2){
        	 $(document).minTipsBox({
 				tipsContent:"请输入大于2的金额", 
 				tipsTime:1
 			});
        	return false;
         }else if(Number(pagemoney)>200){
        	 $(document).minTipsBox({
  				tipsContent:"请输入小于200的金额", 
  				tipsTime:1
  			});
         	return false;
          }
    	pagemoney = (pagemoney*100).toFixed(0);
    	liveRedbag("redpacket",pagemoney,pageid,liveId,topicId);
    	$(".otherRedmoneyBox").hide();
    	
    });
	
	//	直播赞赏提交
	function liveRedbag(type,pagemoney,pageid,liveId,topicId){
		if(redbagbol){
			redbagbol=false;
			$.ajax({
				type: "POST",
				url: CtxPath+"/live/pay/UnifiedOrder.htm",
				data: {byUserId:pageid,total_fee:pagemoney,liveId:liveId,topicId:topicId},
				success:function(result){
					var data=eval("("+result+")");
					 if(data.statusCode=="200"){
						 callPay(data);
					 }
				},
				error:function(){
					redbagbol=true;
					$(document).minTipsBox({
						tipsContent:data.msg, 
						tipsTime:1
					});
				}
			});
		}
		
	 }
	function callPay(data){
		if (typeof WeixinJSBridge == "undefined"){
		   if( document.addEventListener ){
		       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
		   }else if (document.attachEvent){
		       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
		       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
		   }
		}else{
		   onBridgeReady(data);
		}
	}
	function onBridgeReady(data){
	   WeixinJSBridge.invoke(
	       'getBrandWCPayRequest', {
	           "appId":data.appId,     //公众号名称，由商户传入     
	           "timeStamp":data.timeStamp,         //时间戳，自1970年以来的秒数     
	           "nonceStr":data.nonceStr, //随机串     
	           "package":data.packageValue,     
	           "signType":data.signType,         //微信签名方式：     
	           "paySign": data.paySign //微信签名 
	       },
	       function(res){
	           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
	   				$(document).minTipsBox({
	   					tipsContent:"赞赏成功", 
	   					tipsTime:1
	   				});
	   				$(".redbagBox").hide();
	   				moveToEnd($(".speakContentBox"),true);
	   				
	           }else if(res.err_msg == "get_brand_wcpay_request:cancel" ){
	        	   $.ajax({
		   				type: "POST",
		   				url: CtxPath+"/live/pay/updatestatus.htm",
		   				data: {id:data.id,status:"CANCEL"},
		   				success:function(result){
		   					var data=eval("("+result+")");
		   					 if(data.statusCode=="200"){
		   						$(document).minTipsBox({
		   		   					tipsContent:"已取消赞赏", 
		   		   					tipsTime:1
		   		   				});
		   					 }
		   				},
		   				error:function(){
		   					redbagbol=true;
		   					$(document).minTipsBox({
		   						tipsContent:data.msg, 
		   						tipsTime:1
		   					});
		   				}
		   			});
		        	   
		           }else if(res.err_msg == "get_brand_wcpay_request:fail"){
		        	   $.ajax({
		   				type: "POST",
		   				url: CtxPath+"/live/pay/updatestatus.htm",
		   				data: {id:data.id,status:"FAIL"},
		   				success:function(result){
		   					var data=eval("("+result+")");
		   					 if(data.statusCode=="200"){
		   						$(document).minTipsBox({
		   		   					tipsContent:"支付失败", 
		   		   					tipsTime:1
		   		   				});
		   					 }
		   				},
		   				error:function(){
		   					redbagbol=true;
		   					$(document).minTipsBox({
		   						tipsContent:data.msg, 
		   						tipsTime:1
		   					});
		   				}
		   			});
		        	   
		           }
		           redbagbol=true;
		           // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
	       }
	   ); 
	}   
	var whogive="",whoget="",response="",detailbol=true;
	$(document).on("click",".luckyMoney .bubble_content",function(){
		$(".LmTipsBox").attr("attr-id",$(this).parents(".luckyMoney").attr("attr-id"));
		$(".live_headpic img").attr("src",$(this).parents(".luckyMoney").find(".head_portrait img").attr("src"));
		$(".thank_money var").text(Number($(this).attr("attr-money"))/100);
		response=$(this).attr("attr-response");
		whogive=$(this).parents(".luckyMoney").find(".speaker_name b").text();
		whoget=$(this).attr("attr-who");
		$(".replyresult .r1").text(whoget);
		$(".replyresult .r2").text(whogive);
		$(".LmTipsBox .live_towhy").text(whogive+"赞赏了"+whoget);
		if(response!=""&&response!="null"){
			if(response=="baobao"){
				$(".replyresult .r3").text("拥抱");
			}else if(response=="loveyou"){
				$(".replyresult .r3").text("握手");
			}else if(response=="meme"){
				$(".replyresult .r3").text("么么哒");
				
			}
			$(".replyresult").addClass("on").show();
			$(".thankBox").removeClass("on").hide();
		}else{
			$(".replyresult").removeClass("on").hide();
			if($(this).attr("attr-myself")== "true"){
				$(".LmTipsBox .live_towhy").text(whogive+"赞赏了你");
				$(".thankBox").addClass("on").show();
				$(".rgdetail").show();
			}else{
				$(".replyresultNone").addClass("on").show();
			}
		}
		
		if(powerEntity.allowMGLive||$(this).attr("attr-myself")== "true"){
			$(".rgdetail").show();
			$(".redbag_rule_2").show();
			if($(this).attr("attr-myself")== "true"){
				$(".redbag_rule_2").hide();
				$(".redbag_rule_3").show();
			}
		}
		
		$(".thank_money").show();
		if($(this).attr("attr-money") == "" || $(this).attr("attr-money") == "null" || $(this).attr("attr-money") == undefined){
			$(".thank_money").hide();
		}
		
		
		$(".LmTipsBox").show();
	}).on("click",".thank_choose dd",function(){
		var action=$(this).attr("attr-action");
		var $this=$(this);
		$.ajax({
			type: "POST",
			url: CtxPath+"/live/speak/addAction.htm",
			data: {topicId:topicId,speakId:$(".LmTipsBox").attr("attr-id"),action:action},
			success:function(result){
				var data=eval("("+result+")");
				if(data.statusCode == "200"){
					rewardactionHandle(data.liveSpeakView);
					$(".replyresult").addClass("on").show();
					$(".thankBox").removeClass("on").hide();
					$(".replyresult .r1").text(whoget);
					$(".replyresult .r2").text(whogive);
					$(".replyresult .r3").text($this.html());
				}else{
					$(document).minTipsBox({
	   					tipsContent:data.msg, 
	   					tipsTime:1
	   				});
				}
				
			},
			error:function(result){
				var data=eval("("+result+")");
				$(document).minTipsBox({
   					tipsContent:data.msg, 
   					tipsTime:1
   				});
			}
		});
	}).on("click",".rgdetail .rglist",function(){		
		if(detailbol){
			detailbol=false;
			$(this).parent(".rgdetail").addClass("on");
			$(".replyresultNone.on").hide();
			$(".replyresult.on").hide();
			$(".thankBox.on").hide();
		}else{
			detailbol=true;
			$(this).parent(".rgdetail").removeClass("on");
			$(".replyresultNone.on").show();			
			$(".replyresult.on").show();
			$(".thankBox.on").show();
		}
		$(".managerThankBox").slideToggle();
		
	});
	$(document).on("click",".LmTipsBox",function(et){
		if(et.target.className=="rglist"){
			return false;
		}else
		$(this).hide();
		$(".managerThankBox").hide();
		$(".rgdetail").hide();
		$(".replyresultNone").removeClass("on").hide();
		$(".redbag_rule_3").hide();
		detailbol=true;
		$(".rgdetail").removeClass("on");
	});
	$(document).on("click",".redbagBox",function(et){
		if(et.target.className=="rglist"){
			return false;
		}else
		$(this).hide();
	});
	
	//预览图片
	if(isiOSBoolean || isAndroidBoolean){
		function viewImg(imgThis){
			var thisSrc = imgThis.attr("src").replace(/(@)\w*/,"@1600w_1l_2o");
			var imgSrcList = [];
				
			for(i=0;i< $("#speakBubbles .bubble_content img").length;i++){
				imgSrcList[i] = $("#speakBubbles .bubble_content img").eq(i).attr("src").replace(/(@)\w*/,"@1600w_1l_2o");
			}	
				
			wx.previewImage({
			    current: thisSrc, 
			    urls: imgSrcList
			});
		};
		
		$(document).on("click","#speakBubbles .bubble_content img",function(){
			viewImg($(this));
		});
		
	}else{
		var imgTemp,
			imgFristW = 500,
			imgViesW,imgViesH,imgScale,
			maLeft,maTop,
			moveLeft = 0,moveTop = 0,
			minImgW = 100, maxImgW = 1600;
		
		$(document).on("mousewheel DOMMouseScroll", function (e) {
		    if($(".img_view_window img").length > 0){
		    	var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
		                (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
			    if (delta > 0) {
			    	imgViesW = imgViesW + 100;
			    } else if (delta < 0) {
			    	imgViesW = imgViesW - 100;
			    }
			    imgSize();
		    }
		    
		});
		
		function imgSize(){
			if(imgViesW < minImgW){
				imgViesW = minImgW;
			}else if(imgViesW > maxImgW){
				imgViesW = maxImgW;
			}
			
			imgViesH = parseInt(imgViesW/imgScale);
		        
	        imgTemp.width = imgViesW;
	        imgTemp.height = imgViesH;
	        
	        $(imgTemp).css({
	        	"margin-left":-( parseInt(imgViesW/2))+"px",
	        	"margin-top":-( parseInt(imgViesH/2))+"px",
	        });
			
		}
		
		$(document).on("mousedown",".img_view_window img",function (eventd){
		 	eventd.preventDefault();
		 	var msx=eventd.clientX;
		    var msy=eventd.clientY;
	        $(document).on("mousemove",function (eventm){
	        	eventm.preventDefault();
		        var mex=eventm.clientX;
		        var mey=eventm.clientY;
		        $(imgTemp).css({
		        	"left":'+='+(mex - msx),
		        	"top":'+='+(mey - msy)
		        });
		        msx = mex;
		        msy = mey;
	        })
	    });
	    $(document).mouseup(function (){
	    	$(this).unbind("mousemove");
	    });
	    
	    
	    $(document).on("click","#speakBubbles .bubble_content img",function(){
			imgTemp = new Image();
			imgTemp.onload = function() {
				if(imgTemp.width>imgFristW){
					imgViesW = imgFristW;
				}else{
					imgViesW = imgTemp.width;
				}
				if(imgTemp.width < 100){
					minImgW = imgTemp.width;
				}else{
					minImgW = 100;
				}
				
				imgScale = imgTemp.width / imgTemp.height;
		        imgSize();
				$("#imgViewWin").append(imgTemp).show();
			};
			imgTemp.src = $(this).attr("src").replace(/(@)\w*/,"@1600w_1l_2o");; 
				
		}).on("click" , "#imgViewWin .ivwBg,.img_view_window .btn_closed", function(){
			$("#imgViewWin img").remove();
			$("#imgViewWin").hide();
		})
	    
	}
	
	$("#loginbtn").click(function(){
		$.post(CtxPath+"/ifLogIn.htm");
	})

	//操作框
	$(".btn_closeCBox").click(function(){
		$(".control_box").removeClass("on");
		$(".control_box .cbox_main").animate({marginBottom:"-250px"},300);
	});
	$(".btnControlBox").click(function(){
		$(".control_box").addClass("on");
		$(".control_box .cbox_main").animate({marginBottom:"0"},300);
	});

	
//	引导方法
	function guideFunction(key,whichBox,topicId){
		var type="LIVE";
		if(key=="PASSWORDGUID"||key=="INVITEGUID"){
			type="TOPIC";
		}
		$.ajax({
			type: "POST",
			url: CtxPath+"/live/saveGuide.htm",
			data: {key:key,topicId:topicId||"",type:type,isEnable:"N"},
			success:function(result){
				var data=eval("("+result+")"); 
				if(data.statusCode=="200"){
					$(".geneBox").hide();
					$("."+whichBox).hide();
				}else{
					$(document).minTipsBox({
						tipsContent:data.msg, 
						tipsTime:1
					});
				}
			},
			error:function(){
				$(document).minTipsBox({
					tipsContent:data.msg, 
					tipsTime:1
				});
			}
		});
	}
	
	//	邀请嘉宾引导
	$(document).on("click",".setGuestTips .btn_gtb_close",function(){
		$(".funcGTips").show();
	}).on("click",".funcGTips .gene_confirm",function(){
		var topicId=$(this).attr("attr-topicid")||"";
		guideFunction("INVITEGUID","setGuestTips",topicId);
	});
	
//	设置固定密码
	$(document).on("click",".setPasswordTips .btn_gtb_close",function(){
		var topicId=$(this).attr("attr-topicid")||"";
		guideFunction("PASSWORDGUID","setPasswordTips",topicId);
	});
	
//	设置随机密码
//	$(document).on("click",".randomcodefuncbox_close",function(){
//		guideFunction("MANAGEGUID","randomcode");
//	});
	
//	弹幕
	var isdanbol=true;
	$(document).on("click",".isdan_btn_a",function(){
		if(isdanbol){
			isdanbol=false;
			lastDanmu();
			$(".danmu_bar").addClass("on");
			$(".isdan_btn_a").text("关");
			$(".danmuBox").show();
		}else{
			isdanbol=true;
			$(".danmu_bar").removeClass("on");
			$(".danmuBox").hide();
			$(".isdan_btn_a").text("弹");
			$(".danmulist").html("");
		}
		
	}).on("click",".write_dan_a",function(){
		isdanmuwrite=false;
		$(".danmuBottom").height("23rem");
		$(".blackBg").show();
		
	}).on("click",".danmuBottom .btnCommentCancel",function(){
		$(".danmuBottom").height("0rem");
		$(".blackBg").hide();
		$(".danmuInput").blur();
	});

	function danmuHandle(data){
		if($(".danmu_bar").hasClass("on") && $(".danmulist [attr-id="+data.id+"]").length < 1){
			var createByImgUrl = "http://img.skg.com/wtWap/forumLogo/normalForumLogo.png";
			if( /^(http)/.test(data.createByHeadImgUrl)){
				createByImgUrl = data.createByHeadImgUrl;
			};
			
			var danmuHtml = '<dd attr-id="'+ data.id +'"><p>';
			if(data.isQuestion=="Y"){
				danmuHtml+='<em class="ask_label">问</em>';
			}
			danmuHtml+= data.content +'</p><i><img src="'+ createByImgUrl +'"></i></dd>';
			$(".danmulist").prepend(danmuHtml);
		}
	}
	
	function lastDanmu(){
		var lastDanmuHtml = "";
		if($(".comment_dd").eq(0).length > 0 && $(".danmulist dd[attr-id='"+$(".comment_dd").eq(0).attr("attr-id")+"']").length<=0){
			lastDanmuHtml += '<dd attr-id="'+ $(".comment_dd").eq(0).attr("attr-id") +'"><p>'+ $(".comment_dd").eq(0).find(".content").html() +'</p><i><img src="'+ $(".comment_dd").eq(0).find(".avatar img").attr("src") +'"></i></dd>';
		}
		if($(".comment_dd").eq(1).length > 0 && $(".danmulist dd[attr-id='"+$(".comment_dd").eq(1).attr("attr-id")+"']").length<=0){
			lastDanmuHtml += '<dd attr-id="'+ $(".comment_dd").eq(1).attr("attr-id") +'"><p>'+ $(".comment_dd").eq(1).find(".content").html() +'</p><i><img src="'+ $(".comment_dd").eq(1).find(".avatar img").attr("src") +'"></i></dd>';
		}
		if($(".comment_dd").eq(2).length > 0 && $(".danmulist dd[attr-id='"+$(".comment_dd").eq(2).attr("attr-id")+"']").length<=0){
			lastDanmuHtml += '<dd attr-id="'+ $(".comment_dd").eq(2).attr("attr-id") +'"><p>'+ $(".comment_dd").eq(2).find(".content").html() +'</p><i><img src="'+ $(".comment_dd").eq(2).find(".avatar img").attr("src") +'"></i></dd>';
		}
		$(".danmulist").append(lastDanmuHtml);
	}
	
	function inviteModifyHandle(data){
		switch(data.status){
			case "publish": 
				if(userId == data.userId){
					currentUserRole = data.role;
				}
				break;
			case "delete": 
				if($(".guest_head i[attr-id="+data.id+"]").length > 0){
					$(".guest_head i[attr-id="+data.id+"]").remove();
				}
				if(userId == data.userId){
					currentUserRole = "";
					removeOtherBClass();
				}
				break;
		}
		
	}
	
	function inviteAdd(data){
		if($(".guest_head i").length < 3 && $(".guest_head i[attr-id="+data.id+"]").length < 1){
			var guestHeadImgUrl = "http://img.skg.com/wtWap/forumLogo/normalForumLogo.png";
			if(/^(http)/.test(data.userBackgroundImgUrl)){
				guestHeadImgUrl = data.userBackgroundImgUrl;
			}
			var guestHtml = '<i attr-id="' + data.id + '"><img src="'+guestHeadImgUrl+'"></i>';
			$(".guest_head b").before(guestHtml);
		}
		if(userId == data.userId){
			currentUserRole = data.role;
		}
		
		var bubbleGuestHtml= '<dt class="bubble_dt"><b>嘉宾'+ data.userName +'加入直播间</b></dt>';
		$("#speakBubbles").append(bubbleGuestHtml);
		
		if($(".setGuestTips").length > 0){
			$(".setGuestTips").hide();
		}
	}
	
	var isIntervalStart = true;
	var iscommentStart=true;
			
	function intervalStart(){
		var pushData = {dir:"LIVE",id:topicId,msgType:"public",reqSleep:3000,funcSleep:"0",
			callback:function(data){
				switch(data.pushExp){
					case "speak": 
						if($("#speakBubbles").children().length > 0 && data.createTime < Number($("#speakBubbles").children().eq(0).attr("attrtime"))){
							return false;
						}
						speakHandle(data,false); 
						break;
					case "comment": commentHandle(data,true);danmuHandle(data); break;
					case "vote": voteHandle(data); break;
					case "speakVote": speakVoteHandle(data); break;
					case "deleteSpeak":delLiveMsgHandle(data.id); break;
					case "deleteComment":delLiveCommentHandle(data.id); break;	
					case "liveBegin": if(liveStatus != "beginning") window.location.reload(true);	break;
					case "liveEnd": removeOtherBClass(); break;
					case "rewardaction": rewardactionHandle(data); break;
					case "inviteAdd": inviteAdd(data); break;
					case "inviteModify": inviteModifyHandle(data); break;
					case "reload": window.location.reload(true); break;
				}
				
			},
			callEver:function(){
				$(".allcount var").text(PushMessageListener.onLineNum);
			}
		}
		PushMessageListener.init(pushData);
	}
	
	window.onload=function(){ 
		var loadDataTime = (new Date().getTime() > startTime)? new Date().getTime(): startTime;
		
		commentHistory(loadDataTime);
		$(".speakContentBox").stop().animate({scrollTop: 2}, 0);
		
		if(powerEntity.allowSpeak && liveStatus == "beginning"){
			$(".speakBox").addClass("hasTabBottom");
		};
		
		isRecording = true;
		
		
		//定时请求数据
		if(liveStatus != "ended"){
			talkHistory(loadDataTime);
		}else{
			talkHistory("1120752000000");
		}
		//百度统计加在后面
		addBaiduStatistic();
	};
	function addBaiduStatistic(){
	  var hm = document.createElement("script");
	  hm.src = "//hm.baidu.com/hm.js?9f8c5d323a26421cb966b5e405d629c3";
	  var s = document.getElementsByTagName("script")[0]; 
	  s.parentNode.insertBefore(hm, s);
	}
});
