var vm = new Vue({
    el:"#countTable",
    data:{
        allTableData:{},/*资源库表格统计*/
        allSubject:[],
        roleAll:[],
        allSubArray:{},/*各个科目组合title和name;countData()方法能会调用*/
        token:localStorage.getItem("token"),
    },
    mounted:function(){
        this.countData();//查询所有资源库统计
        this.subjectData();//查询所有学科
        this.roleData();
    },
    methods:{
        /*所有科目*/
        subjectData:function(){
            var _this=this;
            $.ajax({url:config.XK_MS_PREFIX+"/mm/enums/QuestionDisciplineKind?token="+_this.token,success:function(data){
                _this.allSubject=data.literal;
                $.each(_this.allSubject,function(i,v){
                    var subName=v.name;
                    _this.allSubArray[subName]={"name":v.title};
                })
            }})
        },
        /*所有角色*/
        roleData:function(){
            var _this=this;
            $.ajax({url:config.XK_MS_PREFIX+"/roles/?token="+_this.token,success:function(data){
                _this.roleAll=data._items;
            }})
        },
        /*查询所有资源库统计*/
        countData:function(){
            var _this = this;
            $.ajax({
                url:config.XK_MS_PREFIX+"/quesbanks/core/job-stats/res-per-user-typed-tagged-checked/?token="+_this.token,
                cache:false,
                success:function(data){
                _this.countResult(data.summations);
            }})
        },
        /*数据处理*/
        countResult:function(dataSum){
            var _this = this,
                botnObj=[],
                comboFormat= {
                    "simple-selection": {"name": "单项选择"},
                    "reading-comprehension":{"name":"阅读理解"},
                    "matching": {"name":"信息匹配"},
                    "fill-word-in-sentence": {"name":"单句填空"},
                    "fill-word-in-text": {"name":"短文填空"},
                    "text-correction": {"name":"短文改错"},
                    "sentence-correction": {"name":"单句改错"},
                    "phrase-translation": {"name":"翻译短语"},
                    "pattern-transformation": {"name":"句型转换"},
                    "sentence-completion": {"name":"完成句子"},
                    "sentence-translation": {"name":"翻译句子"},
                    "cloze": {"name":"完形填空"}
                };
            _this.allTableData=dataSum;
            _this.allTableData.forEach(function(e,i,arr){
                if(_this.allTableData[i].partitions.length>0){
                    var partObj= _this.allTableData[i].partitions,
                        both1=[{"botn":1},{"botn":2},{"botn":3}];
                    partObj.forEach(function(e2,i2,arr2){
                        if(partObj[i2].by.chapterCat==1){
                            $.each(partObj[i2].summations,function(i3,v3){
                                botnObj.push(partObj[i2].summations[i3]);
                            })
                        }
                        if(partObj[i2].by.volumeCat){
                            $.each(partObj[i2].summations,function(iEn,vEn){
                                var fomat=partObj[i2].summations[iEn].botn.comboFormat;
                                partObj[i2].summations[iEn].botn.botntitle=partObj[i2].summations[iEn].botn.botntitle+","+comboFormat[fomat].name;
                                botnObj.push(partObj[i2].summations[iEn]);
                            })
                        }
                    });
                    _this.allTableData[i].partitions=botnObj;
                }
            })
            setTimeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },100);
        },
        /*搜索功能*/
        searchBtn:function(status){
            var _this= this,
                discipline="",
                role="",
                from="",
                to="",
                currentEl=status.currentTarget;

                if($("#allsubject").val()!="0"){
                    discipline=$("#allsubject").val();
                }
                if($("#role").val()!="0"){
                    role=$("#role").val();
                }
                if($(".start-time").val()!=""){
                    from=$(".start-time").val();
                }
                if($(".end-time").val()!=""){
                    to=$(".end-time").val();
                }
            $.ajax({
                url:config.XK_MS_PREFIX+"/quesbanks/core/job-stats/res-per-user-typed-tagged-checked/?discipline="+discipline+"&role="+role+"&from="+from+"&to="+to+"&token="+_this.token,
                cache:false,
                success:function(data){
                console.log(data);
                _this.countResult(data.summations);
            }})
        },
        clearFilter:function(status){
            var _this= this,
                currentEl=status.currentTarget;
            $('#allsubject,#role').selectpicker('val',"0");
            $(".start-time,.end-time,.search-key").val("");
        },
        /*选择章节进行跳转*/
        chooseMedicine:function(status){
            var _this = this,
                currentEl=status.currentTarget;
        }
    }
})