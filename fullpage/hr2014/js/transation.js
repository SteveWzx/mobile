var PageTransitions = function(options) {
    options = $.extend({
        pageClass: '.stage',
        nextEvent: 'swipeUp',
        nextType: 3,
        prevEvent: 'swipeDown',
        prevType: 4,
        fixBug: false,
        lastCallback: function(){}
    }, options)

    var globalOptions = options;

    var $main = options.main || $( '#main' )
        $main.data('__ptid', 'main')
    var $pages = $main.find( options.pageClass ).filter(function(){
            return $(this).parent().data('__ptid')=='main'
        }),
        pagesCount = $pages.length,
        current = 0,
        isAnimating = false,
        endCurrPage = false,
        endNextPage = false,
        animEndEventNames = {
            'WebkitAnimation' : 'webkitAnimationEnd',
            'OAnimation' : 'oAnimationEnd',
            'msAnimation' : 'MSAnimationEnd',
            'animation' : 'animationend'
        },
        // animation end event name
        animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
        // support css animations
        support = Modernizr.cssanimations;
    
    function init() {
        
        $pages.each( function() {
            var $page = $( this );
            $page.data( 'originalClassList', $page.attr( 'class' ) );
        } );

        $pages.eq( current ).addClass( 'pt-page-current' );

        $pages
        .on( options.nextEvent, function() {
            if( isAnimating ) {
                return false;
            }
            nextPage( {animation: options.nextType, dir: 'next'} );
        } )
        .on( options.prevEvent, function() {
            if( isAnimating ) {
                return false;
            }
            nextPage( {animation: options.prevType, dir: 'prev'} );
        } )

    }

    function nextPage(options ) {
        $('#log').html('start')
        var animation = (options.animation) ? options.animation : options
          , dir = options.dir ? options.dir: 'next'

        if( isAnimating ) {
            return false;
        }
        isAnimating = true;
        
        var $currPage = $pages.eq( current );

        if(options.showPage){//goto special page
            if( options.showPage < pagesCount - 1 ) {
                current = options.showPage;
            }
            else {
                current = 0;
            }
        }
        else{//normal 
            if(options.dir == 'next'){
                if( current < pagesCount - 1 ) {
                    ++current;
                }
                else {
                    if(globalOptions.isLoop){
                        current = 0;
                    }else{
                        globalOptions.lastCallback()
                        onEndAnimation( $currPage, $nextPage );
                        return false;
                    }
                }
            }else{//prev
                if( current > 0 ) {
                    --current;
                }
                else {
                    onEndAnimation( $currPage, $nextPage );
                    return false;
                }
            }
        }

        var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
            outClass = '', inClass = '';

        switch( animation ) {
            case 1:
                outClass = 'pt-page-moveToLeft';
                inClass = 'pt-page-moveFromRight';
                break;
            case 2:
                outClass = 'pt-page-moveToRight';
                inClass = 'pt-page-moveFromLeft';
                break;
            case 3:
                outClass = 'pt-page-moveToTop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case 4:
                outClass = 'pt-page-moveToBottom';
                inClass = 'pt-page-moveFromTop';
                break;
            case 25:
                outClass = 'pt-page-moveToTop pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 26:
                outClass = 'pt-page-moveToBottom pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
        }

        $currPage.addClass( outClass ).on( animEndEventName, function() {
            $currPage.off( animEndEventName );
            endCurrPage = true;
            if( endNextPage ) {
                onEndAnimation( $currPage, $nextPage );
            }
            
        } );

        $nextPage.addClass( inClass ).on( animEndEventName, function() {
            $nextPage.off( animEndEventName );
            endNextPage = true;
            if( endCurrPage ) {
                onEndAnimation( $currPage, $nextPage );
            }
        } );

        if( !support ) {
            onEndAnimation( $currPage, $nextPage );
        }

    }

    function onEndAnimation( $outpage, $inpage ) {
        $('#log').html('end')
        endCurrPage = false;
        endNextPage = false;
        resetPage( $outpage, $inpage );
        isAnimating = false;
    }

    function resetPage( $outpage, $inpage ) {
        if($outpage && $inpage){
            $outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
            $inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
        }
    }
    
    init();
    if(globalOptions.fixBug){
        onEndAnimation($pages.eq(2), $pages.eq(0))
    }
    
    (function(){
        //for test
        function getQueryParams(qs) {
            qs = qs.split("+").join(" ");
            var params = {}, tokens,
                re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])]
                    = decodeURIComponent(tokens[2]);
            }

            return params;
        }
        var params = getQueryParams(location.search)
        if(params.p){
            $('.stage').eq(params.p - 1).css({'z-index': 1})
        }
    })();
    
    
    return { 
        init : init,
        nextPage : nextPage
    };

};

(function(){
    // document.ontouchstart = function(e){ e.preventDefault(); };
    $(document).on('touchstart', function(e){
        var node = $(e.target)
        if(node[0].nodeName.toLowerCase() == 'a' || node.parents('a').length > 0){
            
        }else{
            return false;
        }
    })

    //滑动滚屏
    PageTransitions({
        pageClass: '.pt-page',
        nextEvent: 'swipeUp',
        nextType: 3,
        prevEvent: 'swipeDown',
        prevType: 4,
        fixBug: true
    })

    PageTransitions({
        main: $('#about'),
        pageClass: '.pt-page',
        nextEvent: 'swipeLeft tap',
        nextType: 1,
        prevEvent: 'swipeRight',
        prevType: 2,
        isLoop: true
        // lastCallback: function(){
        //     $('#about').trigger('swipeUp')
        // }
    })

    PageTransitions({
        main: $('#job1'),
        pageClass: '.pt-page',
        nextEvent: 'tap',
        nextType: 25,
        prevEvent: '',
        isLoop: true
    })
    PageTransitions({
        main: $('#job2'),
        pageClass: '.pt-page',
        nextEvent: 'tap',
        nextType: 25,
        prevEvent: '',
        isLoop: true
    })
    PageTransitions({
        main: $('#job3'),
        pageClass: '.pt-page',
        nextEvent: 'tap',
        nextType: 25,
        prevEvent: '',
        isLoop: true
    })
    PageTransitions({
        main: $('#job5'),
        pageClass: '.pt-page',
        nextEvent: 'tap',
        nextType: 25,
        prevEvent: '',
        isLoop: true
    })


    //翻页
    var isSupportTouch = "ontouchend" in document ? true : false
    var eventType = isSupportTouch? 'tap': 'click'
    $('.hr_link').on(eventType, function(){
        $(this).parents('.pt-page').eq(0).trigger('swipeUp')
    })

    //音乐播放
    var audio = $('#bg-music')[0]
    $('html, body').on('touchstart',function(){
        audio.play();
    })
    
    //静音
    var isAudioPlaying = true
    
    if(!isAudioPlaying){
        audio.play()
    }else{
        audio.pause()
    }
})();