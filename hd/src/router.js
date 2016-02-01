window.onhashchange = function(e){
    mainView.router.loadPage(location.hash.substr(1));
}
define(['utils/appFunc','controller/module'],function(appFunc,CM) {

    var matchs = navigator.userAgent.match(/patriarch\/(\d[0-9.]+)/i),
        vs     = 0;
    if (matchs && matchs.length == 2) {
        vs = parseFloat(matchs[1].replace(/(\d\.)(\d)\.(\d)$/, '$1$2$3'));
    }


    var indexLoad = false;
    window.koubei_reload = false;

    try{

        Template7.registerHelper('getStarHtml',function(star){
          var html="";
          for(var i=1;i<=5;i++){
            (i <= star)?(html+='<i class="has_color"></i>'):(html+='<i>☆</i>');
          }
          return html;
        });

        Template7.registerHelper('cutText',function(str, len){
            
          if(str.length > len)
            return str.substr(0,len) + "..";
          else
            return str;
        });

        Template7.registerHelper('timeFormat', function(time) {
            var date = new Date(time);
            return date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDate()+"日";
        });

    }catch(e) {
        alert(e);
    }
    


    var router = {

        init: function() {
            if(vs&&vs=="4.3") $$('.navbar').hide();
            $$(document).on('pageBeforeInit', function (e) {
                console.log("before");
                var page = e.detail.page;
                router.pageBeforeInit(page);
            });
            $$(document).on('pageAfterAnimation', function (e) {
                console.log("after");
                var page = e.detail.page;
                if( (page.name == 'school' || page.name == 'schoolKoubei') && page.from == 'left' ){
                    $$('#reloadPage').addClass('new_reloadPage').removeClass('reloadPage');
                    $$('#reloadPage').click(function(){
                        JZBMVP.showIndicator();
                        setTimeout(function(){
                            JZBMVP.hideIndicator();
                        },1000);
                    })
                }else{
                    $$('#reloadPage').addClass('reloadPage').removeClass('new_reloadPage');
                }
                if(vs&&vs=="4.3"&&page.name !== 'showQuestion') appFunc.hideToolbar();
                router.pageAfterAnimation(page);
            });
            
            
            mainView.router.reloadPage('/school/question/v4/');

        },
        
        pageAfterAnimation: function(page){
            var name = page.name;
            var from = page.from;
            var query = page.query;
            var swipeBack = page.swipeBack;
            
      
            console.log('name:'+name);

            switch (name){
                case 'index':
                    if(!vs||vs!="4.3") {

                        if(from === 'left'){
                            appFunc.showNavbar();
                            appFunc.hideToolbar();
                            //window.location.reload();
                            CM.module('indexCtrl43').init();
                        }

                        if(!indexLoad) CM.module('indexCtrl43').init();
                    }else {
                        
                        JzbBridge.ready(function(api){

                            api.closeWebview();
                           
                        });
                    }
                    
                break;
                case 'index43':
                    if(!vs||vs!="4.3") {
                        if(from === 'left'){
                            appFunc.showNavbar();
                            appFunc.hideToolbar();
                            //window.location.reload();
                            CM.module('indexCtrl43').init();
                        }

                        if(!indexLoad) CM.module('indexCtrl43').init(); 
                    }else {
                        
                        JzbBridge.ready(function(api){

                            api.closeWebview();
                           
                        });
                    }
                    
                    
                break;
                case 'school':
                    if(from == 'left'){
                        appFunc.hideNavbar();
                        appFunc.showToolbar();
                        CM.module('schoolCtrl43').init(query);
                    }
                break;
                case 'schoolKoubei':
                    if(from == 'left'){
                        //window.location.reload();
                        koubei_reload = true;
                        CM.module('schoolKoubeiCtrl').reload(query);
                        setTimeout(function(){
                            koubei_reload = false;
                        },1000);
                    }
                break;
            }
        },
        
        pageBeforeInit: function(page) {
            appFunc.searchBtn(0);
            var name = page.name;
            var query = page.query;
            var from = page.from;
            console.log('name:'+name);

            if(location.href.indexOf("no_city=true") > 0 && name != "index"){
                $("#backPage").unbind('touchstart');
            }

            switch (name) {
                case 'index':
                    if(location.hash.substr(1).indexOf("school/question/v4/") > 0){
                        appFunc.showNavbar();
                        appFunc.hideToolbar();
                    }

                    if(from == 'left'){
                        // appFunc.hideNavbar();
                    }else{
                        indexLoad = true;
                        if(location.hash.substr(1).indexOf("school/question/v4/") > 0){
                            CM.module('indexCtrl').init();
                        }
                    }
                break;
                case 'index43':
                    if(location.hash.substr(1).indexOf("school/question/v4/") > 0){
                        appFunc.showNavbar();
                        appFunc.hideToolbar();
                    }

                    if(from == 'left'){
                        // appFunc.hideNavbar();
                    }else{
                        indexLoad = true;
                        if(location.hash.substr(1).indexOf("school/question/v4/") > 0){
                            CM.module('indexCtrl43').init();
                        }
                    }
                break;
                case 'school':
                    if(!koubei_reload){
                        appFunc.hideNavbar();
                        appFunc.showToolbar();
                        CM.module('schoolCtrl43').init(query);
                    }
                break;
                case 'schoolIntro':
                
                    appFunc.showToolbar();
                    CM.module('schoolIntroCtrl').init(query);
                break;
                case 'schoolResume':
                    appFunc.showToolbar();
                    CM.module('schoolResumeCtrl').init(query);
                break;
                case 'schoolAsk':
                 
                    appFunc.showToolbar();
                    CM.module('schoolAskCtrl').init(query);
               
                break;
                case 'schoolNotice':
                    appFunc.showToolbar();
                    CM.module('schoolNoticeCtrl').init(query);
                break;
                case 'schoolKoubei':
                    if(!koubei_reload){
                        appFunc.showToolbar();
                        CM.module('schoolKoubeiCtrl').init(query);
                    }
                break;
                case 'showQuestion':
                    appFunc.showToolbar();
                    appFunc.hideNavbar();
                    CM.module('showQuestionCtrl').init(query);
                break;
                case 'schoolZixun':
                    appFunc.showToolbar();
                    appFunc.hideNavbar();
                    CM.module('schoolZixunCtrl').init(query);
                break;
                case 'schoolZhaosheng':
                    appFunc.showToolbar();
                    appFunc.hideNavbar();
                    CM.module('schoolZhaoshengCtrl').init(query);
                break;
                case 'schoolCourse':
                    appFunc.showToolbar();
                    appFunc.hideNavbar();
                    CM.module('schoolCourseCtrl').init(query);
                break;
                case 'schoolMatriculate':
                    appFunc.showToolbar();
                    appFunc.hideNavbar();
                    CM.module('schoolMatriculateCtrl').init(query);
                break;
            }
        },

        /*
        preprocess: function(content,url){
            if(!url) return false;

            url = url.split('?')[0] ;
            var viewName;
            console.log(url);
            switch (url) {
                case 'mvp.html':
                    viewName = 'appView';
                    break;
                case $CONFIG['tpl_dir']+'/school.html':
                    viewName = 'schoolView';
                    break;
                case $CONFIG['tpl_dir']+'/question.html':
                    viewName = 'questionView';
                    break;
                default :
                    return content;
            }
            var output = CM.module('appCtrl').i18next(viewName,content);
            return output;
        }
        */

    };

    return router;
});
