$(function(){
    var vm = new Vue({
        el:"#moduleSubject",
        data:{
            host:"http://172.17.12.2",
            // host:"http://172.17.12.3",/*域名*/
            port:"5000",/*端口号*/
            ishow:true,/*是否显示*/
            isIndex1:"-1",/*题目筛选一(点击)*/
            isIndex2:"-1",/*题目筛选二(点击)*/
            isIndex3:"-1",/*题目筛选三(点击)*/
            chapterIndex:[],
            subjectList:[],/*科目数据(点击)*/
            bookList:[],/*册数据*/
            chapterList:[],/*章节数据*/
            topicFilterList1:[],/*题目筛选数据1*/
            topicFilterList2:[],/*题目筛选数据2*/
            topicFilterList3:[],/*题目筛选数据3*/
            topicFilterEn:[],
            isFilterEn:true,
            numCount:{},/*总数*/
            decCount:[],/*章节数量*/
            localData:{},/*本地存储数据*/
            topicData:{},/*题目数据*/
            isEmpty:0,/*数据的总数*/
            token:localStorage.getItem("token")
        },
        mounted:function(){
            this.subjectMethod();
        },
        methods:{
            /*资源库管理-科目*/
            subjectMethod:function(){
                var _this = this;
               $.ajax({url:config.XK_MS_PREFIX+"/mm/enums/QuestionDisciplineKind/",success:function(res){
                    _this.subjectList = res.literal;
                    setTimeout(function(){
                        $('.select_list').selectpicker('refresh');
                        if(_this.GetQueryString("sub")!=null){
                            $('.select_list').selectpicker('val',_this.GetQueryString("sub"));
                        }
                        var name = $("#subject").val();
                        _this.bookMethod(name);
                        if(name =="english"){
                            _this.ishow=false;
                        }else {
                            _this.ishow=true;
                        }
                    },10);
                    $("#subject").on('changed.bs.select', function () {
                        name = $("#subject").val();
                        if(name =="english"){
                            _this.ishow=false;
                        }else {
                            _this.ishow=true;
                        }
                        history.replaceState(null,null,"?sub="+name);
                        _this.bookMethod(name);
                    });
                }})
            },
            /*资源库管理-册*/
            bookMethod:function(name){
                var _this = this,
                    url=config.XK_MS_PREFIX+"/bot-nodes/?where={\"edition\": \"std-17\",\"discipline\":\""+name+"\",\"koLyro\":\"volume\"}";
                $.ajax({url:url,success:function(data){
                    _this.bookList = data._items;
                    setTimeout(function(){
                        $('#book').selectpicker('refresh');
                        $(".module-accordion").find(".module-list").removeClass("open");
                        $(".module-accordion").find(".module-list-two").hide();
                        var c_id = $("#book").val(),
                            bookName=_this.bookList[0].name;
                        if(_this.GetQueryString("c_id")!=null){
                            c_id=_this.GetQueryString("c_id");
                            $('#book').selectpicker('val',c_id);
                        }
                        _this.chapterMethod(name,c_id,bookName);
                    },100);
                    $("#book").on('changed.bs.select', function (e,i,v) {
                        var c_id = $("#book").val(),
                            bookName= _this.bookList[i].name;
                        name=$("#subject").val();
                        _this.chapterMethod(name,c_id,bookName);
                        history.replaceState(null,null,"?sub="+name+"&c_id="+c_id);
                    });
                }})
            },
            /*资源库管理-章节*/
            chapterMethod:function(name,c_id,bookName){
                var _this = this,
                    c_name=$("#subject option:selected").text();
                if(name == "english"){
                    $.ajax({url:config.XK_MS_PREFIX+"/mm/enums/EnglishQuestionComboFormatKind",success:function(data){
                        _this.chapterList = data.literal;
                        //_this.dataNum(name,c_id,bookName);
                        setTimeout(function(){
                            if(_this.GetQueryString("en_name")!=null){
                                $(".module-en-accordion .module-list").removeClass("open");
                                $(".module-en-accordion [data-name="+_this.GetQueryString('en_name')+"]").addClass("open");
                            }else{
                                $(".module-en-accordion .module-list").removeClass("open");
                                $(".module-en-accordion .module-list").eq(0).addClass("open");
                            }
                            var en_name= $(".module-en-accordion .module-list.open").attr("data-name");
                            _this.localData = {"subject":c_name,"subject_en":name,"book":$("#book option:selected").text(),"volume":$("#book").val(),"chapter_name":$(".module-en-accordion .module-list.open").attr("data-name"),"chapter":$(".module-list.open .accordion-dec").text()};
                            localStorage.setItem("localData",JSON.stringify(_this.localData));
                            _this.topicFilter(name,c_id,en_name);
                            _this.TopicEN(name,c_id,en_name);
                        },10);
                    }})
                }else{
                    $.ajax({url:config.XK_MS_PREFIX+"/bot-nodes/"+c_id+"/sonern?structrue=flatten",success:function(data){
                        var jsonData = _this.jsonTree(data._items);
                        _this.chapterList = jsonData;
                        setTimeout(function(){
                            if(_this.GetQueryString("section")!=null){
                                var _index = $("[data-id="+_this.GetQueryString('section')+"]").parents(".module-list").index();
                                $(".module-accordion").bt_accordion({"index":_index});
                                $("[data-id="+_this.GetQueryString('section')+"]").addClass("active").siblings("li").removeClass("active");
                            }else{
                                $(".module-accordion").bt_accordion();
                            }
                            var son_id = $(".module-accordion .open").find(".active").attr("data-id");
                            _this.allTopic(name,son_id);
                            _this.localData = {"subject":c_name,"subject_en":name,"book":$("#book option:selected").text(),"chapter_id":$(".module-list-two .active").attr("data-id"),"chapter":$(".module-list.open .accordion-dec").text(),"section":$(".module-list-two li.active .accordion-two-dec").text()};
                            localStorage.setItem("localData",JSON.stringify(_this.localData));
                            _this.topicFilter(name,c_id,null);
                        },10);
                    }})
                }
            },
            /*点击英语章节的节点*/
            chapterEn:function(status){
                var _this = this,
                    toggle = event.currentTarget,
                    name = $("#subject").val(),
                    c_name=$("#subject option:selected").text(),
                    c_id=$("#book").val(),
                    en_name = $(toggle).attr("data-name");
                    $(toggle).addClass("open").siblings(".module-list").removeClass("open");
                    _this.localData = {"subject":c_name,"subject_en":name,"book":$("#book option:selected").text(),"volume":$("#book").val(),"chapter_name":$(".module-list.open").attr("data-name"),"chapter":$(".module-en-accordion .module-list.open .accordion-dec").text()};
                    localStorage.setItem("localData",JSON.stringify(_this.localData));
                    history.replaceState(null,null,"?sub="+name+"&c_id="+$("#book").val()+"&en_name="+$(".module-en-accordion .module-list.open").attr("data-name"));
                    _this.TopicEN(name,c_id,en_name);
                    _this.topicFilter(name,c_id,en_name);
            },
            /*章节点击事件调用题目数据(非英语)*/
            chapterEvent:function(event){
                var _this = this;
                _this.chapterIndex[event]=event;
                var toggle = event.currentTarget,
                    name = $("#subject").val(),
                    c_name=$("#subject option:selected").text(),
                    son_id = $(toggle).attr("data-id");
                $(".module-accordion .module-list .module-list-two .active").removeClass("active");
                $(toggle).addClass("active").siblings("li").removeClass("active");
                _this.localData = {"subject":c_name,"subject_en":name,"book":$("#book option:selected").text(),"chapter_id":$(".module-list-two .active").attr("data-id"),"chapter":$(".module-list.open .accordion-dec").text(),"section":$(".module-list-two li.active .accordion-two-dec").text()};
                localStorage.setItem("localData",JSON.stringify(_this.localData));
                history.replaceState(null,null,"?sub="+name+"&c_id="+$("#book").val()+"&section="+son_id);
                _this.allTopic(name,son_id);
            },
            /*显示册-章节的数量*/
            /*dataNum:function(name,c_id,bookName){
                var _this = this;
                if(name =="english"){
                    $.ajax({
                        url:config.XK_MS_PREFIX+"/quesbanks/core/question-summations/batch-tagged-checked-all/?scope={\"koDiscipline\":\""+name+"\"}&sonern-of="+c_id,
                        async: false,
                        success:function(data){
                        _this.numCount = data._items;
                        _this.decCount = _this.numCount[bookName].summations;

                    }})
                }else{
                    $.ajax({url:config.XK_MS_PREFIX+"/quesbanks/core/question-summations/batch-tagged-checked-all/?scope={\"koDiscipline\":\""+name+"\"}&sonern-of="+c_id,success:function(data){
                        var count = data._items;
                    }})
                }
            },*/
            /*资源库管理-章节科目题目(英语)*/
            TopicEN:function(name,c_id,en_name){
                var _this = this;
                $.ajax({
                    url:config.XK_MS_PREFIX+"/quesbanks/core/questions?where={\"koDiscipline\":\""+name+"\",\"volume\":\""+c_id+"\",\"comboFormat\":\""+en_name+"\",\"dad\":{\"$exists\":false},\"statusOfCheck\":{\"$ne\":\"pass\"}}",
                    cache:false,
                    async:false,
                    success:function(data){
                    _this.topicData=data._items;
                    _this.isEmpty=_this.topicData.length;
                }})

            },
            /*资源库管理-章节科目题目(非英语)*/
            allTopic:function(name,son_id){
                var _this = this;
                $.ajax({
                    url:config.XK_MS_PREFIX+"/quesbanks/core/questions/?where={\"koDiscipline\":\""+name+"\",\"botn\":\""+son_id+"\",\"dadquestion\":{\"$exists\":false},\"dad\":{\"$exists\":false},\"statusOfCheck\":{\"$ne\":\"pass\"}}",
                    cache:false,
                    success:function(data){
                    //console.log(data._items);
                    _this.topicData=data._items;
                    _this.isEmpty=_this.topicData.length;
                    setTimeout(function(){
                        var math = document.getElementById("topic-data-list");
                        MathJax.Hub.Queue(["Typeset",MathJax.Hub,math]);
                    },10)
                }})
            },
            /*删除资源库题目*/
            deleteTopic:function(status){
                var _this=this,
                    toggle = event.currentTarget,
                    name=$("#subject").val(),
                    index=$(toggle).parents(".theme-list").index();
                    son_id=$(".module-accordion .open").find(".active").attr("data-id");

                if(!$(toggle).parents("li").hasClass("disable")){
                    var _id = $(toggle).attr("data-id");
                    $(toggle).betaLayer({clickSure:function(){
                        $.ajax({
                            url:config.XK_MS_PREFIX+"/quesbanks/core/questions/"+_id,
                            type: 'DELETE',
                            success: function() {
                                if(name=="english"){
                                    _this.TopicEN(name,$("#book").val(),$(".module-en-accordion .module-list.open").attr("data-name"));
                                }else{
                                    _this.allTopic(name,son_id);
                                }
                                _this.topicData.splice(index,1);
                            }
                        });
                    }});
                }
            },
            /*题型筛选功能*/
            topicFilter:function(name,c_id,en_name){
                var _this = this;
                if(name!="english"){
                    $.ajax({url:config.XK_MS_PREFIX+"/quesbanks/core/question-partitions/by-multi-dimension/?scope={\"koDiscipline\":\""+name+"\", \"section\":\""+c_id+"\"}",success:function(data){
                        _this.topicFilterList1 = data.partition[0].summations.summations;
                        _this.topicFilterList2 = data.partition[1].summations.summations;
                        _this.topicFilterList3 = data.partition[2].summations.summations;
                    }})
                }else{
                    en_name = en_name.replace(/-/g,"");
                    $.ajax({
                        url:config.XK_MS_PREFIX+"/propertysets/question-e2-"+en_name,
                        success:function(data){
                            _this.topicFilterEn=data.properties;
                            _this.topicFilterEn.length>0?$(".module-marking-en").show():$(".module-marking-en").hide();
                    }})
                }
            },
            /*题型筛选功能-点击*/
            topicShow:function(typeName,status){
                var _this= this,
                    currentEl=event.currentTarget,
                    name=$("#subject").val(),
                    filterType=[];
                $(currentEl).addClass("active").siblings("li").removeClass("active");
                if(_this.localData.subject_en=="english"){
                    var c_id=$("#book").val(),
                        en_name=$(".module-en-accordion .module-list.open").attr("data-name");
                    $(".marking-type").each(function(i,v){
                        var checkFilter = $(".marking-type").eq(i).find("li.active").attr("data-name");
                    })
                    $.ajax({
                        url:config.XK_MS_PREFIX+"/quesbanks/core/questions?where={\"koDiscipline\":\""+name+"\",\"volume\":\""+c_id+"\",\"comboFormat\":\""+en_name+"\",\"dad\":{\"$exists\":false},\"statusOfCheck\":{\"$ne\":\"pass\"}}",
                        cache:false,
                        async:false,
                        success:function(data){
                            _this.topicData=data._items;
                            _this.isEmpty=_this.topicData.length;
                        }})
                }else{
                    var son_id = $(".module-accordion .open").find(".active").attr("data-id");
                    $.ajax({
                        url:config.XK_MS_PREFIX+"/quesbanks/core/questions/?where={\"koDiscipline\":\""+name+"\",\"botn\":\""+son_id+"\",\"dadquestion\":{\"$exists\":false},\"dad\":{\"$exists\":false},\"statusOfCheck\":{\"$ne\":\"pass\"}}",
                        cache:false,
                        success:function(data){
                            _this.topicData=data._items;
                            _this.isEmpty=_this.topicData.length;
                            setTimeout(function(){
                                var math = document.getElementById("topic-data-list");
                                MathJax.Hub.Queue(["Typeset",MathJax.Hub,math]);
                            },10)
                        }})
                }
            },
            /*过滤未审核的题目*/
            auditPass:function(status){
                var _this = this,
                    currentEl=status.currentTarget,
                    name=$("#subject").val(),
                    c_id=$('#book').val(),
                    en_name=$('.module-en-accordion .open').attr('data-name'),
                    son_id = $(".module-accordion .open").find(".active").attr("data-id");
                $(currentEl).find("i").toggleClass("icon-check");
                if($(currentEl).find("i").hasClass("icon-check")) {
                    if (name != "english") {
                        $.ajax({
                            url: config.XK_MS_PREFIX + "/quesbanks/core/questions?where={\"koDiscipline\":\"" + name + "\",\"botn\":\"" + son_id + "\",\"dad\":{\"$exists\":false}}",
                            success: function (data) {
                                _this.topicData=data._items;
                                _this.isEmpty=_this.topicData.length;
                                setTimeout(function(){
                                    var math = document.getElementById("topic-data-list");
                                    MathJax.Hub.Queue(["Typeset",MathJax.Hub,math]);
                                },10)
                            }
                        })
                    } else {
                        $.ajax({
                            url: config.XK_MS_PREFIX + "/quesbanks/core/questions?where={\"koDiscipline\":\"" + name + "\",\"volume\":\"" + c_id + "\",\"comboFormat\":\"" + en_name + "\",\"dad\":{\"$exists\":false}}",
                            success: function (data) {
                                _this.topicData=data._items;
                                _this.isEmpty=_this.topicData.length;
                            }
                        })
                    }
                }else{
                    if (name != "english") {
                        _this.allTopic(name,son_id);
                    }else{
                        _this.TopicEN(name,c_id,en_name);
                    }
                }
            },
            /*json数据格式处理,平层改为树节点*/
            jsonTree:function(data){
                var jsonItem = data,
                    evenval_son = [],
                    evenval_dad = [],
                    sectionAarry="";
                $.each(jsonItem, function (i, v) {
                    if(jsonItem[i].son){
                        jsonItem[i].son =[];
                    }
                    if(jsonItem[i].koLyro=="section"){
                        evenval_son.push(data[i]);
                    }
                    if(jsonItem[i].koLyro=="chapter"){
                        evenval_dad.push(data[i]);
                    }
                });
                for(var i =0;i<evenval_son.length;i++){
                    sectionAarry = evenval_son[i].dad;
                    compare(sectionAarry,i);
                }
                function compare(sonId,index){
                    for(var j=0;j<evenval_dad.length;j++){
                        if(evenval_dad[j]._id == sonId){
                            evenval_dad[j].son.push(evenval_son[index]);
                        }
                    }
                }
                return evenval_dad;
            },
            /*取url的关键字*/
            GetQueryString:function(name){
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if(r!=null)return  unescape(r[2]); return null;
            }
        }
    });
})