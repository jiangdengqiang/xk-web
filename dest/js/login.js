var login = new Vue({
    el:"#login",
    data:{
        username:"",
        password:"",
        host:"http://172.17.12.2",/*域名*/
        port:"5000",/*端口号*/
        token:""
    },
    mounted:function(){
    },
    methods:{
        login:function(){
            var _this = this;
            $.ajax({
                type:"POST",
                url: config.XK_MS_PREFIX + "/tokens/?username=" + _this.username + "&passwd=" + _this.password,
                success: function (data) {
                    if (!data.errorMsg) {
                        localStorage.setItem("token",data.encoded);
                        _this.token=localStorage.getItem("token");
                        window.location.href="../subject/"
                    } else {
                        alert(data.errorMsg);
                    }
                }
            })
        }
    }
})