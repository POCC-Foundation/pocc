/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

document.write("<div id=\"uploadImageDiv\" style=\"border-radius: 4px;margin:3%;display:none;position: absolute;top:0px;left:0px; width:94%;z-index:9999; height:90%; border: solid 1px #8090a0\">");
document.write("            <div id=\"closeUploadWindow\" style=\"position: absolute;top:10px;right:10px\">关闭</div>");
document.write( "           <iframe id=\"uploadframe_x\" name=\"uploadframe_x\" src=\"\" style=\" border:none; width: 100%; height:100%\" >");
document.write( "           </iframe>            ");
document.write( "</div>");
$(window).load(function () {
    $("#uploadImageButton").click(function () { 
        howImageUploadWindow(1)
    });
    $("#closeUploadWindow").click(function () { 
        $("#uploadframe_x").attr("src","");
        $("#uploadImageDiv").hide();
    });
});
function showImageUploadWindow(aspectratio)
{  
    $("#uploadframe_x").attr("src","/mzc/util/uploadimg?object=userLogo&cropper_aspectratio="+aspectratio);
    $("#uploadImageDiv").show();
}
function setUploadImage_x(urlImg)
{
    
    try{ 
        $("#uploadframe_x").attr("src","");
        $("#uploadImageDiv").hide();
        setUploadImage(urlImg);
    }catch(e)
    {
        
    }
    
}