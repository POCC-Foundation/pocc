//验证码倒计时
var countdown=60;
function settime(obj) {
    if (countdown == 0) {   
        obj.removeAttribute("disabled");      
        obj.value="获取验证码";   
        countdown = 60;
        obj.style.cursor="pointer"
        return;  
    } else {   
        obj.setAttribute("disabled", true);   
        obj.value="重新发送(" + countdown + ")";   
        countdown--;   
        obj.style.cursor="auto"
    }   
setTimeout(function() {   
    settime(obj) }  
    ,1000)
}
$(function(){
	//登录页删除input内容
	$(".c-login dd .c-input").bind('input porpertychange',function(){
		if ($(this).children("input").val().length == 0){
			$(this).siblings(".c-del").hide();
		}else{
			$(this).siblings(".c-del").show();
		}
	})
	$(".c-login dd .c-del").click(function(){
		$(this).siblings(".c-input").children("input").val("");
	})
	//默认切换
	$(".c-slide>li").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
	})
	//列表页排序
	$(".c-tan>li").click(function(){
		$(this).addClass("active");
		$(".c-tanMain").hide()
		$(".c-tanMain").eq($(this).index()).show();
		$(".c-bg").show();
	})
	$(".c-bg").click(function(){
		$(".c-tan>li").removeClass("active");
		$(".c-tanMain").hide();
		$(".c-bg").hide();
	})
	$(".c-tanMain>dd").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
		$(this).parents(".c-tanMain").hide();
		console.log($(this).parents(".c-tanMain").index())
		$(".c-tan li").eq($(this).parents(".c-tanMain").index()).removeClass("active");
		$(".c-bg").hide();
	})
	//隐藏layer弹窗
	$(".c-close").click(function(){
		layer.closeAll();
	})
})
