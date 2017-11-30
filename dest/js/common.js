;(function($){
    $.fn.extend({
        "betaLayer":function(options){
            var defaults = {
                'title':'标题',//标题
                'type':'confirm',//弹出框风格
                'width':'400',
                'height':'200',
                'closeBtn':true,
                'msg' :'你确定要删除此题吗？',
                'url':'',
                'clickSure':function(){},
                'clickCancel':function(){}
            };
            var opts = $.extend({},defaults,options),
                PublicContainer =
                            "<div class=\"beta-bg\"></div>"+
                            "<div class=\"beta-layer beta-slide-down\""+
                            "style=\"width:"+opts.width+"px;" +"height:"+opts.height+'px;' +"margin-left:"+-(opts.width)/2+"px;"+"\n"+"margin-top:"+-(opts.height)/2+"px;" +"\">\n" +
                            "<div class=\"beta-top\">\n" +
                            "<span class=\"beta-title\">"+opts.title+"</span>\n" +
                            "<span class=\"beta-close-btn\">×</span>\n" +
                            "</div>"+
                            "</div>";
                layer = {
                    "confirm":function(){
                        var confirmContent ="<div class=\"beta-layer-content\">\n" +
                            "            <i class=\"icon-exclamation_mark\"></i>\n" +
                            "            <span>"+opts.msg+"</span>\n" +
                            "        </div>\n" +
                            "        <div class=\"layer-btn\">\n" +
                            "            <a href=\"javascript:;\" class=\"sureBtn\">确定</a>\n" +
                            "            <a href=\"javascript:;\" class=\"cancelBtn\">取消</a>\n" +
                            "        </div>";
                        $(".beta-top").after(confirmContent);
                        $("body").unbind().delegate(".layer-btn a","click",function(){
                            if($(this).hasClass("sureBtn")){
                                layerBtn.closeFrame($(this));
                                return false;
                            }
                            if($(this).hasClass("cancelBtn")){
                                layerBtn.closeFrame($(this));
                                return false;
                            }
                        })
                    },
                    "iframe":function(){
                        if($(".layer-data")){
                            var move = $(".layer-data").clone();
                        }
                        var confirmContent ="<div class=\"beta-layer-content beta-iframe\"></div>\n" +
                            "        <div class=\"layer-btn\">\n" +
                            "            <a href=\"javascript:;\" class=\"sureBtn\">确定</a>\n" +
                            "            <a href=\"javascript:;\" class=\"cancelBtn\">取消</a>\n" +
                            "        </div>";
                        $(".beta-top").after(confirmContent);
                        move.appendTo(".beta-iframe");
                        $("body").unbind().delegate(".layer-btn a","click",function(){
                            if($(this).hasClass("sureBtn")){
                                layerBtn.closeFrame($(this));
                                return false;
                            }
                            if($(this).hasClass("cancelBtn")){
                                layerBtn.closeFrame($(this));
                                return false;
                            }
                        })

                    }
                },
                layerBtn = {
                    "closeFrame":function($this){
                        $this.parents(".beta-layer").animate({'top':'45%','opacity':0},500,function(){
                            $(this).remove();
                            $(".beta-bg").fadeOut(200,function(){
                                $(this).remove();
                                if($this.hasClass("sureBtn"))opts.clickSure();
                                if($this.hasClass("cancelBtn"))opts.clickCancel();
                            });
                        });
                    }
                };
                this.each(function(){
                    var $this = $(this);
                    switch(opts.type){
                        case 'confirm':
                            $("body").append(PublicContainer);
                            layer.confirm($this);
                            break;
                        case 'iframe':
                            $("body").append(PublicContainer);
                            layer.iframe($this);
                            break;
                    }
                });
                if(opts.closeBtn){
                    $(document).delegate(".beta-close-btn","click",function(){
                        layerBtn.closeFrame($(this));
                    });
                }
                if($(".beta-bg")){
                    $(".beta-bg").unbind().bind("click",function(){
                        $(this).siblings(".beta-layer").animate({'top':'45%','opacity':0},500,function(){
                            $(this).remove();
                            $(".beta-bg").fadeOut(200,function(){
                                $(this).remove();
                            });
                        });
                    })
                }
        },
        "checkBtn":function(options){
            var opts = $.extend({},options);
            this.each(function(){
                var $this = $(this);
                $this.click(function(){
                    $this.toggleClass("checked");
                })
            })
        },
        "bt_accordion":function(options){
            var defaults = {
                "index":0
            }
            var opts = $.extend({},defaults,options);
            this.each(function(){
                var _this = $(this);
                if(opts.index>=0){
                    if(_this.find(".module-list-two")){
                        _this.find(".module-list").eq(opts.index).addClass("open");
                        _this.find(".module-list").eq(opts.index).find(".module-list-two").show();
                        _this.find(".module-list").eq(opts.index).find(".module-list-two").find("li:first").addClass("active");
                    }else {
                        _this.find(".module-list").eq(opts.index).addClass("open");
                    }
                }
                _this.unbind().on("click",".module-list-one",function(){
                    if($(this).parent().hasClass("open")){
                        $(this).parent().removeClass("open");
                        $(this).siblings(".module-list-two").stop().slideUp(250);
                    }else {
                        $(this).parent().siblings(".module-list").find(".module-list-two").slideUp(250);
                        $(this).parent().addClass("open").siblings(".module-list").removeClass("open");
                        $(this).siblings(".module-list-two").stop().slideDown(400);
                    }
                })
            });
        },
        "heightResponse":function(options){
            var defaults ={
                "mainId":"",
                "childrenObj":[],/*子集需要自动算高度*/
                "resize":true,/*是否需要高度随着浏览器大小自适应*/
                "heightSpace":150/*高度中间的间隙*/
            }
            var opts = $.extend({},defaults,options);
            this.each(function(){
                var $this=$(this),
                    windowHeight = $(window).height()-(opts.heightSpace);
                $this.css("height",windowHeight+'px');
                if(opts.childrenObj.length>0){
                    $.each(opts.childrenObj,function(i){
                        $(opts.childrenObj[i]).css("height",(windowHeight-$(opts.childrenObj[i]).offset().top)+'px');
                    })
                }
                if(opts.resize){
                    $(window).resize(function(){
                        windowHeight = $(window).height() - (opts.heightSpace);
                        $(opts.mainId).css("height", windowHeight + 'px');
                        if (opts.childrenObj.length > 0) {
                            $.each(opts.childrenObj, function (i) {
                                if($(opts.childrenObj[i]).length>0){
                                    $(opts.childrenObj[i]).css("height", (windowHeight - $(opts.childrenObj[i]).offset().top) + 'px');
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})(jQuery);