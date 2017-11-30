var top = new Vue({
    el:"#header_main",
    data:{
        crumbs:"",
    },
    mounted:function(){
        this.headLoalData();
    },
    methods:{
        headLoalData:function(){
            var _this = this,
                NewData= JSON.parse(localStorage.getItem("localData"));
            if(NewData.subject_en=="english"){
                _this.crumbs = NewData.subject+"\t/\t"+NewData.book+"\t/\t"+NewData.chapter;
            }else{
                _this.crumbs = NewData.subject+"\t/\t"+NewData.book+"\t/\t"+NewData.chapter+"\t/\t"+NewData.section;
            }
        }
    }
})