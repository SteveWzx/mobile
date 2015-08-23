(function(){
    // document.ontouchstart = function(e){ e.preventDefault(); };
    $(document).on('touchstart', function(e){
        var node = $(e.target)
        if(node[0].nodeName.toLowerCase() == 'a' || node.parents('a').length > 0){
            
        }else{
            return false;
        }
    })

    var isSupportTouch = "ontouchend" in document ? true : false
    var eventType = isSupportTouch? 'tap': 'click'
    
    //滑动滚屏
    //主场景
    PageTransitions({
        pageClass: '.pt-page',
        nextEvent: 'swipeUp',
        nextType: 3,
        prevEvent: 'swipeDown',
        prevType: 4,
        fixBug: true
    })
    
    //翻页
    $('.we_btn').on(eventType, function(){
        $(this).parents('.pt-page').eq(0).trigger('swipeUp')
    })

})();