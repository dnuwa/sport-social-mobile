try{
    var $modal = $('#image-editor-modal');
    var image = document.getElementById('image-editor-image');
    var cropper;
    let current_uploader = null;
    let current_blob = null;
    let current_base64 = null;
    let current_content_type = null;
    let current_file = null;
}catch (e) {

}

$("body").on("change", ".dz-hidden-input", function(e) {
    $('#image-editor-save-button').hide();
    $('.image-editor-preview-container').css("background-image", "url(" + null + ")");
    $(".image-editor-preview-container").attr('src', null);
    var files = e.target.files;
    current_uploader = $('.dz-hidden-input');
    var done = function(url) {
        image.src = url;
        $('#image-editor-modal-caller').click();
    };
    var reader;
    var file;

    if (files && files.length > 0) {
        file = files[0];

        if (URL) {
            done(URL.createObjectURL(file));
        } else if (FileReader) {
            reader = new FileReader();
            reader.onload = function(e) {
                done(reader.result);
            };
            reader.readAsDataURL(file);
        }
        setCropper();
    }
});

function setCropper() {
    cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        // viewMode: 2,
        width: 500,
        height: 400,
        canvas_width: 500,
        canvas_height: 500,
        minContainerWidth: 500,
        minContainerHeight: 400,
        autoCrop: true,
        viewMode: 0,
        background: false,
        modal: true,
        zoomable: true,
        responsive: true,
    });
}
$('#image-editor-cancel-button').click(function() {
    if (!isEmpty(cropper)) {
        cropper.destroy();
    }
    cropper = null;
    $('#image-editor-save-button').hide();
    $('.upload-editor').val('');
});

$("#image-editor-crop").click(function() {
    $('#image-editor-save-button').show();
    canvas = cropper.getCroppedCanvas({
        width: 500,
        height: 500,
        minContainerWidth: 500,
        minContainerHeight: 500,
    });

    canvas.toBlob(function(blob) {
        url = URL.createObjectURL(blob);
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            $('.image-editor-preview').css("background-image", "url(" + this.result + ")");
            $('.image-editor-preview-container').css("background-image", "url(" + this.result + ")");
            $(".image-editor-preview-img").attr('src', this.result);
            current_base64 = this.result;
            current_blob = blob;
        }
    });
});

function getLI(upload) {
    var image = '';
    if ($.inArray(upload.extension, ["jpg", "jpeg", "png", "gif", "bmp"]) > -1) {
        image = '<img src="' + bsurl + '/files/' + upload.hash + '/' + upload.name + '?s=130">';
    } else {
        switch (upload.extension) {
            case "pdf":
                image = '<i class="fa fa-file-pdf-o"></i>';
                break;
            default:
                image = '<i class="fa fa-file-text-o"></i>';
                break;
        }
    }
    return '<li><a class="fm_file_sel" data-toggle="tooltip" data-placement="top" title="' + upload.name + '" upload=\'' + JSON.stringify(upload) + '\'>' + image + '</a></li>';
}

function uploadPic() {
    $.ajax({
        dataType: 'json',
        url: $('body').attr("bsurl") + "/" + adminRoute + "/upload_cropped_file",
        method: 'post',
        data: {
            image_base64: current_base64
        },
        success: function(result) {
            if (result.status === 'success') {
                $('#image-editor-cancel-button').click();
                var li = getLI(result.upload);
                $(".fm_file_selector ul").append(li);
            }
        }
    });
}

function saveCropImage() {
    uploadPic();
}


function isEmpty(value) {
    let response = true;
    if (value != null && value != 'null' && value != 'undefined' && value != '') {
        response = false;
    }
    return response;
}
