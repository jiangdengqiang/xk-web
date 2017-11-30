Vue.component("page",{
    template:"#page",
    data:function(){
        return{
            current:1,
            showItem:5,
            allpage:10
        }
    },
    computed:{
        pages:function(){
            var pag = [];
            if( this.current < this.showItem ){ //如果当前的激活的项 小于要显示的条数
                //总页数和要显示的条数那个大就显示多少条
                var i = Math.min(this.showItem,this.allpage);
                while(i){
                    pag.unshift(i--);
                }
            }else{ //当前页数大于显示页数了
                var middle = this.current - Math.floor(this.showItem / 2 ),//从哪里开始
                    i = this.showItem;
                if( middle >  (this.allpage - this.showItem)  ){
                    middle = (this.allpage - this.showItem) + 1
                }
                while(i--){
                    pag.push( middle++ );
                }
            }
            return pag
        }
    },
    methods:{
        goto:function(index){
            if(index == this.current) return;
            this.current = index;
            //这里可以发送ajax请求
        }
    }
})
/*
var vm = new Vue({
    el:'#moduleSubject',
})*/
