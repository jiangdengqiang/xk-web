;$(function($){
     var method = {
        /*select选框*/
        selecterUI:function(){
            $(".selectpicker").each(function(){
                /*$(this).selectpicker({
                });*/
            })
        },
        /*手风琴*/
        accordion:function(){
            //$(".module-accordion").bt_accordion();
            /*$(".module-accordion").each(function(){
                $(this).find(".module-list").on("click",function(){
                    if($(this).hasClass("open")){
                        $(this).removeClass("open");
                        $(this).find(".module-list-two").stop().slideUp(250)
                    }else {
                        $(".module-accordion").find(".module-list-two").slideUp(250);
                        $(this).addClass("open").siblings(".module-list").removeClass("open") && $(this).find(".module-list-two").stop().slideDown(400);
                    }
                })
            })*/
        },
        checkedMethod:function(){
            $(".mark-install a").checkBtn();
            $(".mark-install a").click(function(){
                if($(this).hasClass("checked")){
                    $(".edit-list-answer").show();
                }else{
                    $(".edit-list-answer").hide();
                }
            })
        },
        /*添加用户*/
        addUser:function(){
            $("#add-user").click(function(){
                $(this).betaLayer({
                    type:"iframe",
                    title:"用户权限管理>新增用户",
                    width:650,
                    height:358
                });
            })
        },
        /*题目查重*/
        problemLayer:function(){
            $("#btn-repeat").bind("click",function(){
                $(this).betaLayer({
                    type:"iframe",
                    title:"重题浏览",
                    width:700,
                    height:450
                });
            })
        },
        showContent:function(){
            $(document).on("click",".looking,.theme-content",function(){
                $(this).parents(".theme-list").find(".result-msg").stop().slideToggle(300);
            });
        },
        /*计算高度*/
        heightWrap:function(){
                $(".main-left").heightResponse({"mainId":".main-left"});
                $(".main-right").heightResponse({"mainId":".main-right","childrenObj":[".scroll-bar"]});
                /*录入页面的*/
                $(".entry-edit").heightResponse({"mainId":".entry-edit","heightSpace":250});
            /*批量审核*/
            if($(".module-check").length>0){$(".module-check").heightResponse({"mainId":".module-check","heightSpace":200})}
            /*批量移动*/
            if($(".scroll-menu").length>0){
                $(".main-right").heightResponse({"mainId":".main-right","heightSpace":80});
                $(".main-left").heightResponse({"mainId":".main-left","heightSpace":80});
            }
            /*var windowHeight = $(window).height()-150,
                h1 = $(".module-marking").outerHeight(true),
                h2 = $(".module-marking-filter").outerHeight(true),
                h3 = $(".page").outerHeight(true),
                scrollHeight = (windowHeight-h1-h2-h3)-80;
            /!*批量移动*!/
            if($(".scroll-menu").length>0){
                $(".main-right").css("height",windowHeight-120+'px');
                $(".main-left").css("height",windowHeight-120+'px');
            }else{
                $(".main-right").css("height",windowHeight+'px');
                $(".main-left").css("height",windowHeight+'px');
                $(".scroll-bar").css("height",scrollHeight+'px');
            }
            if($(".entry-edit").length>0) {

                $(".entry-edit").css("height",(windowHeight-$(".entry-edit").offset().top)-34+'px');
            }
            if($(".module-check").length>0){
                $(".module-check").css("height",(windowHeight-$(".module-check").offset().top)-34+'px');
            }
            $(window).resize(function(){
                /!*题目管理*!/
                windowHeight = $(window).height()-150;
                scrollHeight = (windowHeight-h1-h2-h3)-80;
                /!*题目录入*!/
                if($(".entry-edit").length>0) {
                    $(".entry-edit").css("height",(windowHeight-$(".entry-edit").offset().top)-34+'px');
                }
                /!*批量审核*!/
                if($(".module-check").length>0){
                    $(".module-check").css("height",(windowHeight-$(".module-check").offset().top)-34+'px');
                }
                /!*批量移动*!/
                if($(".scroll-menu").length>0){
                    $(".main-right").css("height",windowHeight-80+'px');
                    $(".main-left").css("height",windowHeight-80+'px');
                }else{
                    $(".main-right").css("height",windowHeight+'px');
                    $(".main-left").css("height",windowHeight+'px');
                    $(".scroll-bar").css("height",scrollHeight+'px');
                }
            });*/
        },
        /*二级菜单导航*/
        hoverMenu:function(){
            $(".top_nav li,.userImg").mouseover(function(){
                $(this).find(".submenu").fadeIn(300);
            });
            $(".top_nav li,.userImg").mouseleave(function(){
                $(this).find(".submenu").fadeOut(100);
            });
        },
        /*时间日期插件*/
        datetimepicker:function(){
            if($(".start-time").length>0||$(".end-time").length>0){
                $(".start-time,.end-time").datetimepicker({
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    language: 'zh-CN',
                    autoclose: 1,
                    todayBtn: true,
                })
            }
        },
         ajaxUrl:function(){
            if($("#login").length==0){
             $.ajaxSetup({
                 beforeSend:function(e,obj){
                     var token=localStorage.getItem("token");
                     obj.url.indexOf("?")>0 ? obj.url=obj.url+'&token='+token : obj.url=obj.url+'?token='+token;
                 },
                 global:true
             });
            }
         }
    }
    method.selecterUI();
    method.accordion();
    method.checkedMethod();
    method.problemLayer();
    method.addUser();
    method.showContent();
    method.heightWrap();
    method.hoverMenu();
    method.ajaxUrl();
    method.datetimepicker();
    $(window).load(function(){
        //$(".module-accordion").bt_accordion();
    })
})