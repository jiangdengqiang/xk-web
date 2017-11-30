var zTree,
    start,
    allMark={},
    /*打标知识点*/
    markSult=[],
    /*小题数*/
    allData=[
        {"title":"2.1","name":""},
        {"title":"2.2","name":""},
        {"title":"2.3","name":""}
    ],
    markStr=[],
    ztreeLabel=[];
var setting = {
    check: {
        enable: true,
    },
    view: {
        dblClickExpand: false,
        showLine: false,
        addDiyDom: addDiyIcon,
        showIcon: false
    },
    data:{
        key:{
            children:"son",
            name:"title"
        },
        simpleData: {
            enable: false
        }
    },
    callback:{
        beforeClick:beforeClick,
        onCheck:zTreeOnCheck
    }
};
/*不显示图标*/
/*function showIconForTree(treeId, treeNode) {
    return !treeNode.isParent;
}*/
/*ztree点击树节点事件*/
function beforeClick(treeId, treeNode) {
    zTree.expandNode(treeNode);
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}
/*ztree节点checkbox改变事件*/
function zTreeOnCheck(e, treeId, treeNode){
    var nodes = zTree.getCheckedNodes(true);
        markSult=[],
        sonNode=$("#marking-section li.active").text();
        list="";
    $(".mark-group-data").html("");
    nodes.length > 0?$("#marking-section li.active .sign i").addClass("icon-check_mark").removeClass("icon-exclamation_mark"):$("#marking-section li.active .sign i").addClass("icon-exclamation_mark").removeClass("icon-check_mark");
    for (var i=0; i< nodes.length; i++) {
        markSult=[];
        markSult.push(nodes);
        if($("#marking-section li").length>0){
            list+="<li data-id='"+nodes[i]._id+"'><span class='mark-group-num'>"+sonNode+"</span><span class='mark-group-txt'>"+nodes[i].name+"</span><i class='icon-close'></i></li>";
        }else{
            list+="<li data-id='"+nodes[i]._id+"'><span class='mark-group-num'>"+$(".quest-num").text()+"</span><span class='mark-group-txt'>"+nodes[i].name+"</span><i class='icon-close'></i></li>";
        }
    }
    $(".mark-group-data").append(list);
    allData.forEach(function(e,i,arr){
        if(allData[i].title==sonNode){
            allData[i].name=markSult[0];
        }
    })
}
/*ztree添加结构*/
function addDiyIcon(treeId, treeNode){
    var aObj = $("#" + treeNode.tId + "_a");
    //$("#ztree").children("#"+treeNode.tId).children(aObj).children("#"+treeNode.tId+"_ico").addClass("icon-source");
    //$("#ztree").children("#"+treeNode.tId).children("a").append("<i class='icon-source'></i>");
    aObj.each(function(i,v){
        if(aObj.hasClass("level2")){
            aObj.append("<i class='icon-knowledgepoint_mark'></i>");
        }else{
            aObj.append("<i class='icon-source'></i>");
        }
    })
}
$(function(){
    $(".mark-left").heightResponse({"el":".mark-left"});
    $(".mark-right").heightResponse({"el":".mark-right"});
    var opts = $.extend({},config,opts),
        myurl=GetQueryString("son_id"),
        son_id;
    if(myurl !=null && myurl.toString().length>1) {
        son_id=GetQueryString("son_id");
    }
    var vm = new Vue({
        el:"#markMain",
        data:{
            mark:{},//打标题目数据
            markTopicData:{},
            /*当前题目编号*/
            topicNum:GetQueryString("num"),
            /*取值难度*/
            difficulty:[],
            currentSubject:JSON.parse(localStorage.getItem('localData')).subject_en,
            chapterName:JSON.parse(localStorage.getItem('localData')).chapter_name,
            /*小题数目*/
            sonName:[
                {
                title:"2.1"
                },
                {
                    title:"2.2"
                },
                {
                    title:"2.3"
                },
            ],
            /*每题的知识点*/
            topicMark:[],
            labelArray:{},/*标签数据*/
            isLabel:true,
            titleLabel:{
                "QuestionEnglishComboObjectiveKind":{"name":"考察类型"},
                "QuestionMaterialKind":{"name":"文章类型"},
                "EnglishMatchingMaterialLengthDeg":{"name":"文章篇幅"},
                "EnglishClozeMaterialLengthDeg":{"name":"文章篇幅"},
                "QuestionDifficultyKind":{"name":"题目难度"},
            },
            ztreeEn:[]

        },
        mounted:function(){
            /*打标题目的数据排版*/
            this.markTopic();
            /*BOT树节点数据*/
            this.markTree();
            /*英语打标标签选项*/
            this.markLabel();
        },
        methods:{
            /*打标题目的数据排版*/
            markTopic:function(){
                var _this = this;
                $.ajax({url:opts.XK_MS_PREFIX+"/quesbanks/core/questions/"+son_id,success:function(res){
                    _this.markTopicData=res;
                    setTimeout(function(){
                        var math = document.getElementById("mark-left");
                        MathJax.Hub.Queue(["Typeset",MathJax.Hub,math]);
                    },100)
                    _this.sonTopicTitile();
                }})
            },
            /*题目难度标签*/
            markLabel:function(){
                var _this = this;
                if(_this.currentSubject=="english"){
                    var  comboformat=_this.stringReplace(_this.chapterName,"-");
                    $.ajax({url:opts.XK_MS_PREFIX+"/propertysets/question-e2-"+comboformat,success:function(data){
                        _this.labelArray=data.properties;
                        if(_this.labelArray.length==0){
                            _this.isLabel=false;
                        }
                    }})
                }else{
                    $.ajax({url:opts.XK_MS_PREFIX+"/propertysets/question-e2-"+_this.currentSubject,success:function(data){
                        _this.labelArray=data.properties;
                        if(_this.labelArray.length==0){
                            _this.isLabel=false;
                        }
                    }})
                }
            },
            /*小题树标签*/
            sonTopicTitile:function(){
              var _this = this;
              $.ajax({url:config.XK_MS_PREFIX+"/quesbanks/core/questions/"+son_id,success:function(data){
                    _this.mark=data;
              }})
            },
            /*替换或者去掉某个字符串*/
            stringReplace:function(obj,type){
                var _this = this;
                return obj.replace(new RegExp(type,'g'),"");
            },
            /*BOT树节点数据*/
            markTree:function(){
                var _this = this;
                if(_this.currentSubject!="english"){
                    $.ajax({
                        url:config.XK_MS_PREFIX+"/bok-nodes/?where={\"edition\": \"std-17\",\"koLyro\":\"discipline\",\"name\":\""+_this.currentSubject+"\"}",
                        async : false,
                        cache:false,
                        success:function(data){
                            var sub_id = data._items[0]._id;
                            $.ajax({
                                url:config.XK_MS_PREFIX+"/bok-nodes/"+sub_id+"/sonward?structure=tree",
                                async : false,
                                cache:false,
                                success:function(data){
                                    console.log(data);
                                    start=data._items[0].son;
                                    start.forEach(function(item,index,arr){
                                        item.nocheck=true;
                                       // item.chkDisabled=true
                                        start[index].son.forEach(function(sonItem){
                                           sonItem.nocheck=true;
                                            //sonItem.chkDisabled=true
                                        })
                                    });
                                }})
                        }})
                }else {
                    $.ajax({
                        url:config.XK_MS_PREFIX+"/"+_this.chapterName+"-english-bok-nodes/?where={\"edition\": \"std-17\"}&structure=tree",
                        async : false,
                        cache:false,
                        success:function(data){
                            $.each(data.msg,function(i,v){
                               if(Array.prototype.isPrototypeOf(data.msg[i])){
                                   _this.ztreeEn.push(data.msg[i][0]);
                               }
                            })
                            start=_this.ztreeEn;
                            start.forEach(function(item,index,arr){
                                item.nocheck=true;
                                // item.chkDisabled=true
                                start[index].son.forEach(function(sonItem){
                                    sonItem.nocheck=true;
                                    //sonItem.chkDisabled=true
                                })
                            });
                    }})
                }
                zTree=$.fn.zTree.init($("#ztree"),setting,start);
            },
            /*选择标签的难易度*/
            labelStatus:function(status){
                var _this = this,
                    currentEl=status.currentTarget,
                    $index=$(currentEl).parents(".mark-topic").index();
                $(currentEl).addClass("active").siblings("li").removeClass("active");
                /*取值标签难度*/
                _this.difficulty[$index]=$(currentEl).attr("data-name");
            },
            /*选择小题节点*/
            sonNameStatus:function(status){
                var _this = this,
                    currentEl=status.currentTarget,
                    index = $(currentEl).index(),
                    lists="";
                var treeObj = $.fn.zTree.getZTreeObj('ztree'),
                    nodes = treeObj.getCheckedNodes();
                treeObj.checkAllNodes(false);
                $.each(allData,function(i){
                    if($(currentEl).text()==allData[i].title && allData[i].name!=""){
                        var allName=allData[i].name;
                        allName.forEach(function(e,j,arr){
                            treeObj.checkNode(allName[j], true, false);
                        })
                    }
                });
                //_this.markTree();
                $(".mark-group-data").html("");
                $(currentEl).addClass("active").siblings("li").removeClass("active");
                if(allData[index].hasOwnProperty("name")){
                    for(var i=0;i<allData[index].name.length;i++){
                     lists+="<li><span class='mark-group-num'>"+allData[index].title+"</span><span class='mark-group-txt'>"+allData[index].name[i].title+"</span><i class='icon-close'></i></li>";
                    }
                    $(".mark-group-data").append(lists);
                }
            },
            /*打标页面提交*/
            markSubmits:function(status){
                var _this = this;
                _this.topicMark = allData;
                //console.log(allData);
                /*取值小题ID*/
                if(parseInt(_this.mark.sonCount)>=2){
                    $.each(_this.mark.son,function(i,v){
                        markStr.push({"_id":v});
                    })
                }else{
                    markStr.push({
                        "_id":_this.mark._id,
                        "taginfo":{
                            "difficulty":_this.difficulty,
                            "boknCat":"59ed97e71d41c8098fbfff42"
                        }
                    });
                }
                //console.log(_this.difficulty);
                console.log(markStr);
                /*if($("#tag-rating li.active").length<=0){
                    alert("请给题目添加难度标签！");
                    return false
                }
                if($("#marking-section li.active").length!=$("#marking-section li").length){
                    alert("每个小题都需要打标");
                    return false
                }*/
                $.ajax({
                    url:config.XK_MS_PREFIX+"/quesbanks/core/questions/tagging",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(markStr),
                    type:"PATCH",
                    success:function(data){
                        window.location.href="../subject/";
                }})
            }
        }
    });
    /*点击删除知识点*/
    $(document).on("click",".mark-group-data .icon-close",function(){
        var currentEl=$(this),
            _index =$(this).parents("li").index(),
            treeObj = $.fn.zTree.getZTreeObj('ztree');
        $.each(allData,function(i){
            if($(currentEl).siblings(".mark-group-num").text()==allData[i].title){
                var allName=allData[i].name;
                allName.forEach(function(e,j,arr){
                    if($(currentEl).siblings(".mark-group-txt").text()==allName[j].title){
                        treeObj.checkNode(allName[j],false, false);
                        allName.splice(j,1);
                        $(".mark-group-data li").eq(_index).remove();
                    }
                })
            }
        })
    })
});
/*取url的关键字*/
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}