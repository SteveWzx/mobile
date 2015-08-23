var PageTransitions = (function() {

	var $main = $( '#main' ),
		$pages = $main.children( '.stage' ),
		animcursor = 3,
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
		document.ontouchstart = function(e){ e.preventDefault(); };
		
		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );

		$pages.eq( current ).addClass( 'pt-page-current' );

		$pages
		.on( 'swipeUp', function() {
			if( isAnimating ) {
				return false;
			}
			nextPage( {animation: 3, dir: 'next'} );
		} )
		.on( 'swipeDown', function() {
			if( isAnimating ) {
				return false;
			}
			nextPage( {animation: 4, dir: 'prev'} );
		} )

	}

	function nextPage(options ) {
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
					isAnimating = false
					return false;
					current = 0;
				}
			}else{//prev
				if( current > 0 ) {
					--current;
				}
				else {
					isAnimating = false
					return false;
					current = pagesCount - 1;
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
		endCurrPage = false;
		endNextPage = false;
		resetPage( $outpage, $inpage );
		isAnimating = false;
	}

	function resetPage( $outpage, $inpage ) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
	}
	
	init();


	
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
		nextPage : nextPage,
	};

})();