var config = {
    "XK_MS_SCHEME":"https",/*协议*/
    "XK_MS_HOST":"xk-uat-b.b.rawstonedu.net",/*域名地址*/
    "XK_MS_PORT":"8201",/*端口*/
    "XK_MS_PREFIX":"",/*根路径*/
    "XK_MS_VERSION":"",/*版本号*/
    "token":localStorage.getItem("token"),
    "CKEDITOR_HOST":"https://xk-uat-b.b.rawstonedu.net:8202/4.7.3/full/ckeditor.js",/*ckeditor路径*/
    "UPLOAD":"https://xk-uat-b.b.rawstonedu.net:8202/quesbanks/pictures"
}
/*配置最初路径*/
config.XK_MS_PREFIX = config.XK_MS_SCHEME+"://"+config.XK_MS_HOST+":"+config.XK_MS_PORT;
/*版本号路径*/
config.XK_MS_VERSION=config.XK_MS_PREFIX+"/1.0/";
config.UPLOAD=config.UPLOAD+"?token="+config.token;
/*公共加入js标签代码*/
function include(path){
    var a=document.createElement("script");
    a.type = "text/javascript";
    a.src=path;
    var head=document.getElementsByTagName("head")[0];
    head.appendChild(a);
}
