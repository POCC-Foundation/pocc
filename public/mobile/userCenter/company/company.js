function bEditCompany() {
//    if ($(".serviceImage").length < 1)
//    {
//        alert($(".serviceImage").attr("src"))
//        alert('请至少上传一张logo');
//        return false;
//    }
    if ($("#people").val() === null || $("#people").val() === "") {
        alert('请填写人数');
        return false;
    }
    if ($("#address").val() === null || $("#address").val() === "") {
        alert('请填写地址');
        return false;
    }
    if ($("#cType").val() === null || $("#cType").val() === "") {
        alert('请填写企业类型');
        return false;
    }
    if ($("#city").val() === null || $("#city").val() === "") {
        alert('请填写城市');
        return false;
    }
   return true;
//    $('#submit').submit(); //提交表单
}
function showError(str)
{
    $('.title-msg').show();
    $('.title-msg .col').text(str);
    setTimeout(function () {
        $('.title-msg').hide(2000)
    }, 3000);
}
 
 
 

//<<<<<<< .mine
//    $(".load-file").before(imageHtml);
//}
//function getAllImagePath()
//{
////    alert("in   #getAllImagePath")
//    var imageStr = "";
//    $(".serviceImage").each(function (index, e) {
//        if (index == 0)
//        {
//            alert("index")
//            imageStr = $(e).attr("src");
//        } else {alert("in index!=0")
//            imageStr = imageStr + ":" + $(e).attr("src");
//        }
//    });
//    $("#serviceImage").val(imageStr);
////    alert($("#serviceImage").val())
//}
//
//=======
//>>>>>>> .r76


  