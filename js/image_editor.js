var $modal = $('#image-editor-modal');
var image = document.getElementById('image-editor-image');
var cropper;
let current_uploader = null;
let current_blob = null;
let current_base64 = null;
let current_content_type = null;
let current_file = null;
// image-editor-preview image-editor-preview-container

$("body").on("change", ".upload-editor", function(e) {
    if (!isEmpty($(this).val())) {
        $('.editor-edit-btn').show();
        $('#image-editor-save-button').hide();
        $('.image-editor-preview-container').css("background-image", "url(" + null + ")");
        $(".image-editor-preview-container").attr('src', null);
        var files = e.target.files;
        current_uploader = $(this);
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
    } else {
        $('.editor-edit-btn').hide();
    }
});

function setCropper() {
    cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        // viewMode: 2,
        width: 500,
        height: 300,
        canvas_width: 500,
        canvas_height: 300,
        minContainerWidth: 500,
        minContainerHeight: 300,
        autoCrop: true,
        viewMode: 3,
        scalable:true,
        rotatable:true,
        background: false,
        modal: true,
        zoomable: true,
        responsive: false,
    });
}
$('#image-editor-cancel-button').click(function() {
    if (!isEmpty(cropper)) {
        cropper.destroy();
    }
    cropper = null;
    $('#image-editor-save-button').hide();
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

function saveCropImage() {
    current_file = new File([current_blob], Math.random().toString(36).substring(7) + '.png');
    $images = $('.upload-editor');
    $.each($images, function(key, image) {
        $('.upload-editor')[key].files[0] = current_file;
    });
    $('.upload-editor-hidden-file').val(current_base64);
    $('#image-editor-cancel-button').click();
}


function isEmpty(value) {
    let response = true;
    if (value != null && value != 'null' && value != 'undefined' && value != '') {
        response = false;
    }
    return response;
}

function imageEditorEdit() {
    $(".upload-editor").trigger("change");
}