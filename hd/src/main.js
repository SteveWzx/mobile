function c(a){console.log(a)}

$CONFIG['tipMSG'] = {
    emptyVote       : '先投个票呗',
    emptyComment    : '评论内容还没写哦～',
    emptyContent    : '内容还没写哦～',
    moreComment     : '评论内容太多了哦,精简点嘛～',
    thanksVote      : '感谢你的参与……',
    serverError     : '服务器开小差了…请稍后再试试',
    questionOver    : 'Oh,my god！！ 你居然把题答完了！太牛了！',
    sendDataing     : '数据正在飞往服务器……',
    errorLocatData  : '获取本地数据失败了……',
    success         : '感谢你的参与……',
    netError        : '亲，网络不给力啊～',
    resumeSuccess   : '简历投递成功～',
    resumeError     : '简历投递失败～',
    errorMobile     : '手机号格式错误'
}

var _bottomRefresh = false;

;(function() {
    require.config({
        urlArgs: 'version=4.1.1',
        // urlArgs: 'version='+(new Date()).getTime(),
        paths: {
            text        :   $CONFIG['host']+'/script/require/text',
            GTPL        :   $CONFIG['tpl_dir']+'/global.tpl.html',
            utils       :   $CONFIG['host']+'/script/utils',
            view        :   $CONFIG['host']+'/script/view',
            controller  :   $CONFIG['host']+'/script/controller',
            router      :   $CONFIG['host']+'/script/router',
            //GS          :   $CONFIG['host']+'/script/services/globalService',
        },
    });
    require(['router','utils/appFunc'], function(router,appFunc) {

        var app = {
            initialize: function() {
                window._skip = 50;
                this.bindEvents();
            },
            bindEvents: function() {
                window.onload = this.onDeviceReady();
            },
            onDeviceReady: function() {
                app.receivedEvent('deviceready');
            },
            receivedEvent: function(event) {
                switch (event) {
                    case 'deviceready':
                        app.initMainView();
                        break;
                }
            },
            initMainView:function(){
                window.$$ = Dom7;
                window.JZBMVP = new MVP({
                    cache:true,
                    cacheDuration:0,
                    pushState: true,
                    pushStateSeparator:'#',
                    uniqueHistory:true,
                    popupCloseByOutside:false,
                    animateNavBackIcon: true,
                    animatePages:true,
                    pushStateNoAnimation:true,
                    swipeBackPageActiveArea:80,
                    swipeBackPageBoxShadow:false,
                    activeState:true,
                    activeStateElements:'dt',
                    //preprocess:router.preprocess,
                    modalTitle: '&nbsp;',
                    modalButtonOk: '确定',
                    modalButtonCancel: '取消',

                    template7Pages:true,
                    precompileTemplates:true,
                    sortable:false,
                    swipeout:false
                });

                window.mainView = JZBMVP.addView('#indexView', {
                    dynamicNavbar: true
                });

                router.init();
            }
        };
        app.initialize();
    });
})();
