var header = new Vue({
    el:"#header",
    data:{
        token:localStorage.getItem("token"),
        userRole:[],
        userPost:[
                {"sort":1},
                {"sort":2},
                {"sort":3},
                {"sort":3},
                {"sort":4},
                {"sort":0}
            ],
        userName:"",
        userMenu:false
    },
    mounted:function(){
        this.isToken();
        this.userToken();
    },
    methods:{
        /*检查是否有token*/
        isToken:function(){
            var _this = this;
            if(_this.token==null||_this.token==""){
                window.location.href="../login/login.html";
            }
        },
        /*查找用户权限*/
        userToken:function(){
            var _this = this,
                tokenArray = _this.token.split("."),
                result= JSON.parse(window.decodeURIComponent(window.atob(tokenArray[1])));
            _this.userRole=result;
            _this.userName=_this.userRole.role[0];
            _this.userName=="xk_admin"?_this.userMenu=true:_this.userMenu=false;
        },
        /*清除本地的token*/
        clearLocalStorage:function(){
            localStorage.clear();
        }
    }
})