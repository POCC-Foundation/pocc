var fileThis,set;
$.fn.extend({
    // 图片上传
    uploadImg:function(options){
        let _self = this,
            _this = $(this);
        let defaults = {len:5,aspectNum: 3,id:''};
        let settings = $.extend({},defaults, options);
        _self.checkImg = function (img) {
            var size = img / 1024
            // 验证图片格式
            if(!/image\/\w+/.test(img.type)){
                alert("请确保文件为图像类型");
                return false;
            }
            //验证图片大小
            if(size>5000){
                alert("单张图片不能大于5M");
                return false;
            }
        };
        _this.change(function () {
            fileThis = _this;
             set = settings;
            for(var i=0;i<this.files.length;i++){
                _self.checkImg(this.files[i])
                let cropperMask= $('<div class="cropper-mask" style="display: block" >\n' +
                    '  <div class="container">\n' +
                    '    <img class=\'image\' src=\'\' >\n' +
                    '  </div>\n' +
                    '  <div class="btn-cropper" onclick="btnCropper(this,fileThis,set,1)">\n' +
                    '    确定\n' +
                    '  </div>\n' +
                    '  <div class="btn-cropper qx" onclick="btnCropperCancel(this)">\n' +
                    '    取消\n' +
                    '  </div>\n' +
                    '<div class="btn-cropper qx cropper-left" onclick="cropperLeft(this)" style= "top:50px">顺时针</div>'+
                    '<div class="btn-cropper cropper-right" onclick="cropperRight(this)" style= "top:50px">逆时针</div>'+
                    '<div class="btn-cropper  cropper-reset" onclick="cropperReset(this)" style= "top:50px;left:50%;margin-left: -35px">重置</div>'+
                    '</div>');
                $(document.body).append(cropperMask)
               var imgDom=  $('.cropper-mask').eq(i).find('img');
                imgDom.attr('src',getObjectURL(this.files[i]))
                var options= {
                    aspectRatio:4 / settings.aspectNum,
                    viewMode : 1,
                    dragMode:'move',
                    cropBoxMovable:false,
                    cropBoxResizable:false,
                    minCropBoxWidth:$(window).width(),
                    toggleDragModeOnDblclick: false
                }
               imgDom.cropper(options)
                $('.cropper-mask .container').css('height',$(window).height()+'px');
                $('.cropper-mask .container').css('width',$(window).width()+'px');
                $('.cropper-mask').eq(0).css('z-index',200);
            }
        });
    },
  
});
// 确定裁剪
function btnCropper(self, fileThis, settings) {

        /**
         * 用ajax保存图片
         */
            
            var imageDate = $(self).siblings('.container').find('.image').cropper('getCroppedCanvas').toDataURL("image/jpeg",0.7);
 
            var data = {imgData:imageDate, object:'userlogo'};
           
            $.ajax({
                url: "/mzc/util/doUploadimg",
                        data: data,
                        type: "POST",
                        dataType: 'json',
                        success: function (re) { 
                            setUploadImage_x(re.imgUrl,settings.id);
                                ///   alert(re.imgUrl);
                            $(self).parents('.cropper-mask').remove();
                            $('.cropper-mask').eq(0).css('z-index', 200);
                        }
            });
}
// 取消裁剪
function btnCropperCancel(self) {
    $(self).parents('.cropper-mask').remove()
    $('.cropper-mask').eq(0).css('z-index',200)
}

function getObjectURL(file) {
    var url = null;
    if (window.createObjcectURL != undefined) {
        url = window.createOjcectURL(file);
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
 
 

