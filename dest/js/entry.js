var Entry = new Vue({
    el:"#entry_wrap",
    data:{
        host:"http://172.17.12.2",
        port:"5000",
        subject:"",/*本地存储科目值*/
        section:JSON.parse(localStorage.getItem('localData')).chapter_id,/*非英语节的ID*/
        comboFormat:JSON.parse(localStorage.getItem('localData')).chapter_name,/*英语节的name*/
        volume:JSON.parse(localStorage.getItem('localData')).volume,/*英语的册id*/
        volumeCn:JSON.parse(localStorage.getItem('localData')).book,
        subFilter:[],/*题目基本标签*/
        responseFormat:[],/*题目基本标签-题型*/
        sourceKind:[],/*题目基本标签-阶段*/
        sourceTime:[],/*题目基本标签-年份*/
        sourceArea:[],/*题目基本标签-城市地域*/
        startTopicNum:[{
            "topicCheck":[
                {"text":"A","ishow":false},
                {"text":"B","ishow":false},
                {"text":"C","ishow":false},
                {"text":"D","ishow":false}
            ]
        }],
        topicLength:0,/*设置小题初始化*/
        checkLength:4,/*题目的选项数*/
        fillLength:[1],/*填空题个数*/
        topicId:GetQueryString("id"),/*编辑页面id的参数*/
        topicNum:GetQueryString("num"),
        countNum:parseInt(GetQueryString("count")),
        wrapStyle:"",
        isEdit:GetQueryString('edit'),/*是否是编辑页面*/
        token:localStorage.getItem("token"),
        sourceShow:false,
        subAreaShow:false

    },
    mounted:function(){
        /*初始化结构*/
        this.initialize();
        /*题目基本标签-数据*/
        this.topicEntry();
        /*编辑页面*/
        this.initEdit();
    },
    methods:{
        /*初始化结构*/
        initialize:function(){
            var _this = this;
            if(_this.comboFormat =="simple-selection"||_this.comboFormat=="reading-comprehension"||_this.comboFormat=="matching" || _this.comboFormat=="cloze" ){
                _this.wrapStyle="selectStyle";
                $(".choice").show();
                $(".fill_blank").hide();
                return false;
            }
            if(_this.comboFormat=="read-writetask"||_this.comboFormat=="fill-word-in-sentence" ||_this.comboFormat=="fill-word-in-text"||_this.comboFormat=="phrase-translation"||_this.comboFormat=="pattern-transformation"||_this.comboFormat=="sentence-completion"||_this.comboFormat=="sentence-translation"){
                _this.wrapStyle="fillStyle";
                $(".fill_blank").show();
                $(".common-tool").eq(1).hide();
                $("#topic_result").show();
                $(".choice").hide();
                return false;
            }
            if(_this.comboFormat=="text-correction"||_this.comboFormat=="sentence-correction"){
                _this.wrapStyle="answerStyle";
                $(".fill_blank").show();
                $(".choice").hide();
                $(".fill_blank").hide();
                $(".common-tool").eq(1).hide();
                $("#topic_result").show();
                return false;
            }
        },
        /*题目基本标签-数据*/
        topicEntry:function(){
            var _this = this,
                NewData= JSON.parse(localStorage.getItem("localData"));
            _this.subject = NewData.subject_en;
            $.ajax({url:config.XK_MS_PREFIX+"/propertysets/question-e1-"+_this.subject+"?token="+_this.token,success:function(data){
                _this.subFilter=data.properties;
                $.each(_this.subFilter,function(i){
                    if(_this.subFilter[i].name=="responseFormat"){
                        _this.responseFormat = _this.subFilter[i].type.literal;
                    }
                    if(_this.subFilter[i].name=="sourceKind"){
                        _this.sourceKind = _this.subFilter[i].type.literal;
                    }
                    if(_this.subFilter[i].name=="sourceTime"){
                        _this.sourceTime = _this.subFilter[i].type.literal;
                    }
                    if(_this.subFilter[i].name=="sourceArea"){
                        _this.sourceArea = _this.subFilter[i].type.literal;
                    }
                })
                setTimeout(function(){
                    $(".topic-test select").selectpicker();
                    $(".topic-test select").selectpicker('refresh');
                },10)
            }});
        },
        /*编辑页面*/
        initEdit:function(){
            var _this = this,
                topicId = GetQueryString("id");
            if(topicId!=null){
                $.ajax({url:config.XK_MS_PREFIX+'/quesbanks/core/questions/'+topicId+"?token="+_this.token,success:function(data){
                    var arrResult = _this.startTopicNum[0].topicCheck;
                   if(data.koDiscipline=="english"){
                       $(window).load(function(){
                           if($(".choice").is(":visible")){
                               _this.selectStyle(arrResult);
                           }
                           if($(".fill_blank").is(":visible")){
                               _this.fillStyle();
                           }
                           if(!$(".choice").is(":visible") && !$(".fill_blank").is(":visible")){
                               _this.answerStyle();
                           }
                       })
                   }else{
                       $(window).load(function(){
                           /*赋值题型1*/
                           $(".topic-type li").each(function(i){
                               if(data.responseFormat==$(".topic-type li").eq(i).attr("data-name")){
                                   $(".topic-type li").removeClass("active");
                                   $(".topic-type li").eq(i).addClass("active");
                               }
                           });
                           /*赋值题型2*/
                           $(".topic-class li").each(function(j){
                               console.log(data.koSource);
                               if(data.koSource==$(".topic-class li").eq(j).attr("data-name")){
                                   $(".topic-class li").removeClass("active");
                                   $(".topic-class li").eq(j).addClass("active");
                               }
                           });
                           if($(".choice").is(":visible")){
                               _this.selectStyle(arrResult);
                           }
                           if($(".fill_blank").is(":visible")){
                               _this.fillStyle();
                           }
                       })

                   }
                    /*选择题模板*/
                    _this.selectStyle=function(arrResult){
                        $('#subYear').selectpicker('val',(data.sourceTime));
                        $('#subArea').selectpicker('val',(data.sourceLoca));
                        $("#ckeditor1").val(data.contOfQuery);
                        $("#ckeditor3").val(data.contOfAnalysis);
                        if(data.sonCount<2){
                            $.each(arrResult,function(i){
                                if(data.contOfKey==arrResult[i].text){
                                    arrResult[i].ishow=true;
                                }
                            })
                        }else{
                            _this.topicLength=data.sonCount;
                            /*循环取出最大的字母*/
                            var str = data.fieldOfSon.contOfKey,
                                newStr = str.join(""),
                                max=newStr[0];
                            for(var i =0;i<newStr.length;i++){
                                if(max<newStr[i])max=newStr[i];
                            }
                            var allLength=max.charCodeAt()-65+1,
                                topicCheck=[];
                            _this.checkLength=allLength;
                            /*遍历添加选择项目*/
                            for(var k=0;k<str.length;k++){
                                for (j = 0; j < allLength; j++) {
                                    topicCheck.push({"text": String.fromCharCode(65 + j), "ishow": false});
                                }
                                _this.startTopicNum[k]={topicCheck};
                                topicCheck=[];
                                _this.selectVal(str,k);
                            }
                            console.log(_this.startTopicNum);
                        }
                    },
                    /*赋值*/
                    _this.selectVal=function(str,k){
                        $.each(_this.startTopicNum[k].topicCheck,function(index,val){
                            if(str[k]==_this.startTopicNum[k].topicCheck[index].text){
                                _this.startTopicNum[k].topicCheck[index].ishow=true;
                            }
                        })
                    };
                    /*填空题模板*/
                    _this.fillStyle=function(){
                        $('#subYear').selectpicker('val',(data.sourceTime));
                        $('#subArea').selectpicker('val',(data.sourceLoca));
                        $("#ckeditor1").val(data.contOfQuery);
                        $("#ckeditor2").val(data.contOfKey);
                        $("#ckeditor3").val(data.contOfAnalysis);
                        console.log(data);
                        if(data.sonCount<2) {
                            _this.fillLength=data.blankCount;
                        }
                    }
                    _this.answerStyle=function(arrResult){
                        $('#subYear').selectpicker('val',(data.sourceTime));
                        $('#subArea').selectpicker('val',(data.sourceLoca));
                        _this.topicLength=data.sonCount;
                        $("#ckeditor1").val(data.contOfQuery);
                        $("#ckeditor2").val(data.contOfKey);
                        $("#ckeditor3").val(data.contOfAnalysis);
                    }
                }})
            }
        },
        /*题目基本标签-添加状态*/
        addStatus:function(status){
            var _this = this,
                currentEl = status.currentTarget,
                _index = $(currentEl).index(),
                allLength=$(".topic-result").length;
            $(currentEl).addClass("active").siblings("li").removeClass("active");
            if($(currentEl).parents(".beta-btn").hasClass("topic-type")){
                if(_index < allLength){
                    switch(_index){
                        case 0:
                            _this.topicLength=0;
                            _this.fillLength=[1];
                            $(".dec-num.dec_blank").removeClass("dec_blank").addClass("dec_option");
                            $("#topic_result").hide();
                            break;
                        case 1:
                            $("#topic_result").show();
                            _this.topicLength=0;
                            _this.checkLength=4;
                            $(".dec-num.dec_option").removeClass("dec_option").addClass("dec_blank");
                            _this.startTopicNum=[{"topicCheck":[
                                {"text":"A","ishow":false},
                                {"text":"B","ishow":false},
                                {"text":"C","ishow":false},
                                {"text":"D","ishow":false}
                            ]}];

                    }
                    $(".topic-result").eq(_index).show().siblings(".topic-result").hide();
                    $(currentEl).attr("data-name")!="select"?$(".common-tool").eq(1).hide():$(".common-tool").eq(1).show();
                }else{
                    $("#topic_result").show();
                    $(".common-tool").eq(1).hide();
                    $(".topic-result").hide();
                }
            }
            if($(currentEl).parents(".beta-btn").hasClass("topic-class")){
                _this.sourceShow=true;
                if($(currentEl).attr("data-name")=="FromPast"){
                    _this.subAreaShow=true;
                }else {
                    _this.subAreaShow=false;
                }
            }


        },
        /*选项状态*/
        optionStatus:function(status){
            var _this = this,
                currentEl = status.currentTarget,
                $index=$(currentEl).parents(".result-list").index(),
                currentIndex=$(currentEl).index();
            if($(currentEl).hasClass("active")){
                $(currentEl).removeClass("active");
                _this.startTopicNum[$index].topicCheck[currentIndex].ishow=false;
            }else{
                $(currentEl).addClass("active");
                _this.startTopicNum[$index].topicCheck[currentIndex].ishow=true;
            }
        },
        /*增加数量*/
        addNum:function(status){
            var _this = this,
                topicLength=_this.startTopicNum.length;
            if(_this.startTopicNum>50){
                alert("暂不支持50个小题以上");
            }else{
                _this.topicLength==0?_this.topicLength=2:_this.topicLength++;
                if($(".choice").is(":visible")){
                    _this.selectTopicAdd();
                }
                if($(".fill_blank").is(":visible")){
                    _this.fillTopicAdd();
                }
            }
        },
        /*减少数量*/
        subNum:function(status){
            var _this = this,
                currentEl = status.currentTarget;
            if(_this.topicLength<2){
                alert("题目不能低于一题");
            }else{
                _this.topicLength>2?_this.topicLength--:_this.topicLength=0;
                if($(currentEl).hasClass("topic-close")){
                    var CurrentIndex = $(currentEl).parents(".result-list").index();
                    _this.startTopicNum.splice(CurrentIndex,1);
                }else{
                    if($(".choice").is(":visible")){
                        _this.selectTopicSub();
                    }
                    if($(".fill_blank").is(":visible")){
                        _this.fillTopicSub();
                    }
                    if(!$(".choice").is(":visible") && !$(".fill_blank").is(":visible")){
                    }
                }
            }
        },
        /*填空题添加空数*/
        addFillNum:function(status){
            var _this=this,
                currentEl = status.currentTarget,
                $index= $(currentEl).parents(".result-list").index(),
                _val=parseInt($(currentEl).siblings("input").val());
                if( _this.fillLength[$index]<99){
                    _val = _val+1;
                    $(currentEl).siblings("input").val(_val);
                    _this.fillLength[$index] = _val;
                }else{
                    alert("您的填空数最多不能超过99！");
                }
        },
        /*填空题减少空数*/
        SubFillNum:function(status){
            var _this=this,
                currentEl = status.currentTarget,
                $index= $(currentEl).parents(".result-list").index(),
                _val=parseInt($(currentEl).siblings("input").val());
                if($(currentEl).hasClass("topic-close")){
                    _this.topicLength>2?_this.topicLength--:_this.topicLength=0;
                    var CurrentIndex = $(currentEl).parents(".result-list").index();
                    _this.fillLength.splice(CurrentIndex,1);
                }else{
                    if(_this.fillLength[$index]>1){
                        _val = _val-1;
                        $(currentEl).siblings("input").val(_val);
                        _this.fillLength[$index] = _val;
                    }else{
                        alert("填空数至少有一个！");
                    }
                }
        },
        /*选择题的页面增加题型结构*/
        selectTopicAdd:function(){
            var _this = this,
                currentCheckNum=_this.startTopicNum[0].topicCheck.length,
                topicCheck=[];
            for(var i =0;i<currentCheckNum;i++){
                topicCheck.push({"text":String.fromCharCode(65+i),"ishow":false});
            }
            _this.startTopicNum.push({topicCheck});
        },
        /*选择题的页面减少题型结构*/
        selectTopicSub:function(){
            var _this = this;
            _this.startTopicNum.splice(_this.topicLength-1,1);
        },
        /*填空题的页面增加题型结构*/
        fillTopicAdd:function(){
            var _this=this,
                currentFillNum = _this.fillLength.length;
            _this.fillLength.push(1);
        },
        fillTopicSub:function(){
            var _this=this;
            _this.fillLength.splice(_this.topicLength-1,1);

        },
        /*设置增加选项*/
        addNumCheck:function(){
            var _this = this,
                currentCheckNum=_this.startTopicNum[0].topicCheck.length;
            if(currentCheckNum<8){
                currentCheckNum+=1;
                _this.checkLength+=1;
                $.each(_this.startTopicNum,function(i){
                    _this.startTopicNum[i].topicCheck.push({"text":String.fromCharCode(65+currentCheckNum-1),"ishow":false});
                })
            }else{
                alert("选项不能超过8项");
            }

        },
        /*设置减少选项*/
        subNumCheck:function(){
            var _this = this,
                currentCheckNum=_this.startTopicNum[0].topicCheck.length;
            if(currentCheckNum >2) {
                currentCheckNum-=1;
                _this.checkLength-=1;
                $.each(_this.startTopicNum, function (i) {
                    _this.startTopicNum[i].topicCheck.splice(currentCheckNum, 1);
                })
            }else{
                alert("至少要有2个选项");
            }
        },
        entrySubmit:function(status){
            var _this = this,
                currentEl=status.currentTarget,
                koDiscipline=_this.subject,/*科目*/
                sections,/*非英语英语的章节id*/
                volume="",/*英语的册id*/
                comboFormat,/*英语的章节*/
                contOfQuery= CKEDITOR.instances.ckeditor1.getData(),/*题目内容*/
                contOfAnalysis=CKEDITOR.instances.ckeditor3.getData(),/*题目分析*/
                contOfKey="",/*题目答案*/
                optionCount=_this.topicLength,/*选择个数*/
                blankCount=null,/*填空个数*/
                responseFormat,/*作答类型(选择，填空，解答)*/
                koSource,/*来源*/
                sourceTime=$("#subYear").val(),/*来源时间*/
                sourceLoca= $("#subArea").length>0?$("#subArea").val():"",/*来源地*/
                sourceLocaTitle=$("#subArea").length>0?$("#subArea option:selected").text():"",/*来源地值*/
                sounCount,/*小题数*/
                fieldOfSon={
                    "contOfKey":[],/*选择题答案*/
                    "blankCount":[]/*填空题的空数*/
                };
            $(".dec_blank").length>0?blankCount=parseInt($(".dec_blank").val()):blankCount=null;
            $(".dec_option").length>0?sounCount=parseInt($(".dec_option").val()):sounCount=1;
            $(".topic-type").length>0?responseFormat=$(".topic-type .active").attr("data-name"):responseFormat="";
            _this.section==undefined?sections="":sections=_this.section;
            _this.comboFormat==undefined?comboFormat="":comboFormat=_this.comboFormat;
            $(".topic-class").length>0?koSource=$(".topic-class .active").attr("data-name"):koSource="";
/**********************************赋值区域**********************************/
            /*赋值单题题目答案-单选一题*/
            if($(".choice").is(":visible") && _this.topicLength<2){
                $.each($(".check-result li.active"),function(){
                    contOfKey+=$(this).text();
                })
            }
            /*填空题答案*/
            if($(".fill_blank").is(":visible")){
                contOfKey=CKEDITOR.instances.ckeditor2.getData();
            }
            /*解答题答案*/
            if(!$(".choice").is(":visible") && !$(".fill_blank").is(":visible")){
                contOfKey=CKEDITOR.instances.ckeditor2.getData();
            }
            /*if($(".topic-type li.active").attr("data-name")!="select" && koDiscipline!="english"){
                contOfKey=CKEDITOR.instances.ckeditor2.getData();
            }*/
            /*赋值单题题目数量*/
            if($(".fill_blank").is(":visible")){
                if($(".choice .result-list").length<2){
                    blankCount=parseInt($(".fill_blank .fill_num").val());
                }
            }else{
                blankCount=null;
            }
            /*赋值选择题多题答案*/
            if(($(".topic-type li.active").attr("data-name")=="select" || koDiscipline=="english")  && _this.topicLength>=2){
                    var sonText = "",
                        sonCont = [];
                for(var i=0;i<$(".choice .result-list").length;i++){
                    for(var j=0;j<$(".choice .result-list").eq(i).find(".active").length;j++){
                        sonText+=$(".choice .result-list").eq(i).find(".active").eq(j).text();
                    }
                    sonCont.push(sonText);
                    sonText="";
                }
                fieldOfSon.contOfKey=sonCont;
            }
            /*赋值填空题多题答案*/
            if($(".topic-type li.active").attr("data-name")=="fillin" && _this.topicLength>=2){
                var sonNum="",
                    sonBlank=[]
                for(var i = 0;i<$(".fill_blank .result-list").length;i++){
                    sonNum+=parseInt($(".fill_blank .result-list").eq(i).find(".fill_num").val());
                    sonBlank.push(sonNum);
                    sonNum="";
                }
                fieldOfSon.blankCount=sonBlank;
            }
/**********************************判断区域**********************************/
            if(contOfQuery==""){
                alert("题目内容不能为空!");
                return false
            }
            if($(".choice .result-list").length<2 &&  contOfKey==""){
                alert("题目答案不能为空!");
                return false
            }
            if(_this.topicLength>=2){
                if($(".topic-type li.active").attr("data-name")=="select"){
                    $.each(fieldOfSon.contOfKey,function(i){
                        if(fieldOfSon.contOfKey[i]==""){
                            alert("第"+(i+1)+"小题答案不能为空");
                        }
                    })
                }
            }
            if(koDiscipline!="english" && $(".topic-class li.active").length<=0){
                alert("请选择题目来源!");
                return false
            }
            if($(".topic-class li.active").attr("data-name")=="FromPast" && (sourceTime==0||sourceLoca==0)){
                alert("来源时间和来源区域不能为空！");
                return false
            }
            if(contOfQuery==""){
                alert("题目内容不能为空！");
                return false
            }
            var allData={
                "koDiscipline":koDiscipline,/*科目*/
                "section":sections,/*非英语英语的章节id*/
                "comboFormat":comboFormat,/*英语的章节*/
                "contOfQuery":contOfQuery,/*题目内容*/
                "contOfAnalysis":contOfAnalysis,/*题目分析*/
                "contOfKey":contOfKey,/*题目答案*/
                "optionCount":optionCount,/*选择个数*/
                "blankCount":blankCount,//值出错,填空个数
                "responseFormat":responseFormat,/*作答类型(选择，填空，解答)*/
                "koSource":koSource,/*来源*/
                "sourceTime":sourceTime,/*来源时间*/
                "sourceLoca":sourceLoca,/*来源地*/
                "sourceLocaTitle":sourceLocaTitle,/*来源地*/
                "sonCount":sounCount,//值出错,小题数
                "fieldOfSon":fieldOfSon/*选择题答案,填空题的空数*/
            }
            if(koDiscipline=="english"){
                allData.volume=_this.volume;
                console.log(_this.topicLength);
            }
            console.log(allData);
            /*提交是编辑还是录入*/
            if(GetQueryString("id")){
                $.ajax({
                    url:config.XK_MS_PREFIX+"/quesbanks/core/questions/"+GetQueryString("id"),
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(allData),
                    type: 'PATCH',
                    success:function(){
                        alert("修改成功!");
                        if($(currentEl).hasClass("save-back")){
                            setTimeout(function(){
                                window.location.href="../subject/"
                            },500);
                            return false
                        }
                        if($(currentEl).hasClass("save-next")){
                            //history.replaceState(null,null,'Entry.html?id='++"&numm="+(_this.topicNum+1)+"&edit=true");
                            window.location.href="Entry.html?id="+id+"&numm="+(_this.topicNum+1)+"&edit=true";
                        }
                    }
                })
            }else {
                $.ajax({
                    url:config.XK_MS_PREFIX+"/quesbanks/core/questions/",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(allData),
                    type:"POST",
                    success:function(){
                        alert("添加题目成功!");
                        if($(currentEl).hasClass("save-back")){
                            setTimeout(function(){
                               // window.history.back();
                            },500);
                            return false
                        }
                        if($(currentEl).hasClass("save-next")){
                            window.location.href='Entry.html?count='+(_this.countNum+1);
                        }
                    }
                })
            }
        }
    }
})
/*取url的关键字*/
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}