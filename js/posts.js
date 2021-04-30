
    let postsList = [];
    let SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
    let current_post_id = null;
    let feedType = '';


    function kFormatter(number){

    // what tier? (determines SI symbol)
    var tier = Math.log10(number) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier == 0) return number;

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
}

    /**
     * cancelPost
     */

    function cancelPost(){

        $('.editor-edit-btn').hide();
        $('.upload-editor').val('');
    }

    /**
     *
     * @ConfirmDeletePost
     */
    function ConfirmDeletePost() {
        let id = $('.delete-post-id').val();
        var _url = app_url + 'delete-post' + '?id=' + window.localStorage.getItem("loginuser") + '&post_id=' + id;
        var _method = 'post';
        var response = CallMethod(_method, _url, onSuccess, '');

        function onSuccess(response) {
            if (typeof response.data != 'undefined' && response.data.login_error_status === '1') {
                showExpireAlert('session-expire');
                session(response.data);
            } else if (typeof response.data != 'undefined' && response.data.state === 'success') {
                setTimeout(function() {
                    $('.deletePostModel .close').click();
                    $('.customer-post-container-' + id).hide();
                    showMessage('Post Deleted SuccessFully');
                }, 100);
            }
        }
    }

    /**
     * resetPostData
     */
    function resetPostData() {
        $('#crop-image-src').val('');
        $('#file').val('');
        $('.image-picker-file').val('');
        $('#edit_post_description').val('');
        $('.image-picker-file').val('');
        $('.cropper-image-preview').attr('src', 'images/img-placeholder-1.jpg');

    }

    /**
     *
     * showPosts
     * @param posts
     * @returns {string}
     */
    function showPosts(posts){

        postsList = posts;

    var postHTML = '';


    $.each(posts, function (key , value){
    var comments = '';
    var postImage = ``;
    let liked_by = value.liked_by;
    var  liked_by_count = '';
    var customer_post_delete = '';
    var shared_by_count = '';
    var shared_by = value.shared_by;

        var image_src = './images/image-placeholder.jpg';
        if (!isEmpty(value.pic)) {
            image_src = image_url + '/files/' + value.upload.hash + '/' + value.upload.name;
            fileExtension = value.upload.name.split('.').pop();
            console.log(fileExtension);
            if (['flv', 'avi', 'mov', 'mpg', 'wmv', 'm4v', 'mp3', 'wma', '3gp', 'mp4' ,'FLV' , 'AVI', 'MOV', 'MPG', 'WMV' , 'M4V', 'MP3', 'WMA', '3GP', 'MP4' ].includes(fileExtension)) {
                postImage = `<video style="width: 100%" controls><source src="` + image_src + `" type="video/` + fileExtension + `"><source src="mov_bbb.ogg" type="video/ogg">
                                Your browser does not support HTML video.
                            </video>`;
            } else if (['gif', 'jpeg', 'png', 'jpg' , 'PNG' , 'GIF' , 'JPEG', 'JPG'].includes(fileExtension)) {
                postImage = `
                                <a onclick="previewPhotoGallery(this,'`+image_src+`')" data-gallery="photoviewer-1" data-title="Image View" data-group="a" href="javascript:void(0)">
                                     <img  class="lazy img" src="` + image_src + `" alt="Photo">
                                </a>
                            `;
            }
        }

    var likedByBtn = `<div class="like p-2 cursor"><a href="javascript:void(0)" onclick="likePost('` + value.id + `')" class="interaction-btn  like_by_btn_` + value.id + `" ><i class="fa fa-thumbs-o-up" style="color: black;"></i><span class="ml-1" style="color: black;" >Like</span></a></div>`;
    var  sharedByBtn =`<div class="like p-2 cursor"><a href="javascript:void(0)" onclick="sharePost('` + value.id + `','` + image_src + `')" class="interaction-btn share_by_btn_` + value.id + `"  ><i class="fa fa-share" style="color: black;"></i><span class="ml-1" style="color:black;">Share</span></a></div>`;
    // var  sharedByBtn = `<div class="ui-block-b"> <a href="javascript:void(0)" onclick="sharePost('` + value.id + `')" class="ui-btn ui-btn-inline interaction-btn share_by_btn_` + value.id + `" style="    margin-left: -29px;" ><i class="fa fa-share fa-1x fa-pull-left fa-border"></i>Share</a> </div>`;



    if (liked_by != null) {
    let jsonLikeBy = JSON.parse(liked_by);
    liked_by_count = jsonLikeBy.length;
    if (jsonLikeBy.indexOf(parseInt(window.localStorage.getItem("loginuser"))) !== -1) {
        likedByBtn = `<div class="like p-2 cursor"><a href="javascript:void(0)" onclick="likePost('` + value.id + `')" class="interaction-btn like_by_btn_` + value.id + `" ><i class="fa fa-thumbs-o-up  like_by_btn_icon_` + value.id + `"" style ="color:black;"></i><span class="ml-1" style="color: black;">Like</span></a></div>`;
    // likedByBtn = `<span class="ui-block-a pr-1 cursor-pointer"> <a href="javascript:void(0)" onclick="likePost('` + value.id + `')" class="ui-btn ui-btn-inline interaction-btn like_by_btn_` + value.id + `" ><i class=" fa fa-thumbs-up fa-1x fa-pull-left fa-border     like_by_btn_icon_` + value.id + `"> </i><span  style="     margin-left: -38px; font-family:  arial!important;    "> Like</span></a></span>`;
}
}

    if (shared_by != null) {
    let jsonSharedBy = JSON.parse(shared_by);
    shared_by_count = jsonSharedBy.length;
    if (jsonSharedBy.indexOf(parseInt(window.localStorage.getItem("loginuser"))) !== -1) {
        sharedByBtn = `<div class="like p-2 cursor"><a href="javascript:void(0)" onclick="sharePost('` + value.id + `','` + image_src + `')" class="  ui-btn-active share_by_btn_` + value.id + `"><i class="fa fa-share" style="color: black;"></i><span class="ml-1" style="color: black;">Share</span></div>`;
    // sharedByBtn = `<div class="ui-block-b"> <a href="javascript:void(0)" onclick="sharePost('` + value.id + `')" class="ui-btn ui-btn-inline interaction-btn ui-btn-active share_by_btn_` + value.id + `" style="    margin-left: -29px;"><i class="fa fa-share  fa-1x fa-pull-left fa-border"></i>Share</a> </div>`;
}
}

        if ( parseInt(value.user.id) == parseInt( window.localStorage.getItem("loginuser"))) {
            customer_post_delete = `<div class="dropdown float-right post_option_container pos-option-` + value.id + `"  style=" display: inline-block; margin-top: -35px;">
                                        <button class="post_delete_container" type="button" data-toggle="dropdown" style="background: white; color: gray; border-color: white;">
                                            <i class="fa fa-ellipsis-h"></i>
                                        </button>
                                        <ul class="dropdown-menu post_delete_menu">
                                            <li class="cursor-pointer"  style="cursor: pointer"   data-toggle="modal" data-target=".deletePostModel" onclick="deletePost('` + value.id + `')" style="margin-left: 5px;" ><i class="fa fa-trash post-delete-css post_delete_btn_css cursor-pointer " style="margin-left: 10px;"></i>Delete Post</li>
                                            <li class="cursor-pointer"  style="cursor: pointer"  onclick="editPost('` + value.id + `','` + null + `','` + image_src + `')"  style="margin-left: 5px;"><i class="fa fa-pencil post-delete-css post_delete_btn_css cursor-pointer" style="margin-left: 10px;"></i>Edit Post </li>
<!--                                            <li class="cursor-pointer" data-toggle="modal" data-target=".hidePostModel" onclick="hidePost('` + value.id + `')" ><i class="fa fa-eye-slash post-delete-css post_delete_btn_css cursor-pointer"></i>Hide Post</li>-->
                                        </ul>
                                    </div>`;
        }

    var comment_length = value.comments.length;
    $.each(value.comments, function(key, comment) {

    let commentPic = 'images/default-user-image.png';

    if(!isEmpty(comment.user.profileImage)){
    commentPic = comment.user.profileImage;
}
    let like_by_side = '';
    let liked_count = `<span class = "comment-btns comment-like-count-`+comment.id+`"></span>`;
    let liked_by = `<a class="comment-btns" href="javascript:void(0)" onclick="likeComment('`+comment.id+ `','` + 0 +`')">Like</a>`;

    let comment_option = '';
    if(!isEmpty(comment.liked_by)){
    let userId = 0;
    if(!isEmpty(window.localStorage.getItem("loginuser"))){
    userId = parseInt(window.localStorage.getItem("loginuser"));
}
    let comment_like = JSON.parse(comment.liked_by);
    liked_count = `<span class = "comment-btns comment-like-count-`+comment.id+`">` + kFormatter(comment_like.length) + ' ' +`</span><span class = "comment-btns comment-like-count-sample-`+comment.id+`" style="display:none">` + comment_like.length + ' ' +`</span>`;
    liked_by = `<a class="comment-btns" href="javascript:void(0)" onclick="likeComment('`+comment.id+ `','` + comment_like.length +`')">Like</a>`;
    if($.inArray(userId, comment_like) !== -1){
    liked_by = `<a class="comment-btns comment-liked-already" href="javascript:void(0)">Like</a>`;
}
    if(comment_like.length > 0){
    like_by_side = `<span class="comment-like-span"  onclick="renderPostUserListWithRendering('` + comment.id + `','` + 'comment' + `','` + 'liked_by' +`')">
                                        <i class="fa fa-thumbs-up like-btn-css"></i>` + liked_count + `
                                    </span>`;
}
}
    if( !isEmpty(comment.user) &&   comment.user.id == window.localStorage.getItem("loginuser")){
    comment_option = `<ul class="list-unstyled list-inline media-detail pull-right"> <li> <div class="dropdown" > <i class="fa fa-ellipsis-h dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i> <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="left: -153px; padding-left: 20px;"> <a class="dropdown-item" href="javascript:void(0);"  onclick="editComment('`+ comment.id + `','` + value.id + `','` + comment.comment +`')"> <i class="fa fa-pencil cursor-pointer"></i> Edit Comment</a>  <a class="dropdown-item" href="javascript:void(0);" onclick="deleteComment('`+comment.id + `','` +value.id +`')"><i class="fa fa-pencil cursor-pointer"></i> Delete Comment</a> </div> </div> </li> </ul>`;
}


    //     comments += `<div class=" mb-1 ml-1 mr-1 text-left full-width mb-2 comment-overall_body-container-`+comment.id+`">
    //     <div class="comment-cont">
    //         <img onclick="network(`+comment.user.id+`,null);" src="` + commentPic + `" class="align-self-center user-img comment_pic_css">
    //         <div class="comment p-2 max-width-90 comment-list-container-`+comment.id+`">
    //             <span class="commenter bold-text"  onclick="network(`+comment.user.id+`,null);">` + comment.user.firstname + ' ' + comment.user.lastname + `</span>
    //             <p class="comment-text mb-0 breakword user-comment-`+comment.id+`">` + comment.comment + `</p>
    //             <div class="comment-like-container" id="comment-like-container-`+comment.id+`">
    //                 `+like_by_side+`
    //             </div>
    //         </div>
    //     </div>
    //     <div class="row comment-footer">
    //         <p class="mb-0 ml-4 comment-btns">`+comment.formatDate+`</p>
    //         <p class="mb-0 ml-1 not-liked-yet-`+comment.id+`">`+  liked_by+`</p>
    //         <p class="mb-0 ml-1 comment-reply"><a class="comment-btns" href="javascript:void(0)" onclick="replyComment('`+comment.id+`')">Reply</a></p>
    //         `+comment_option+`
    //     </div>
    // </div>`;

    comments += ` <div class="media   comment-overall_body-container-`+comment.id+`" style=" border-top: 1px dashed #DDDDDD; padding: 20px 0;"> <a class="user-feeds-profile-img pull-left" href="javascript:void(0);"  onclick="otherProfile(\``+ ( !isEmpty(comment.user.firstname)? comment.user.firstname : comment.user.lastname) +`\`,\``+ comment.user.id +`\`);" style="margin-right: 6px;"><img class="img media-object" src="`+ commentPic +`" alt="" style=" width: 50px;    height: 50px;  border-radius: 50%;  margin-left: 10px;"></a> <div class="media-body  comment-list-container-`+comment.id+`">`+ comment_option +`  <p class="user-name">` + comment.user.firstname + ' ' + comment.user.lastname + `</p>  <ul class="list-unstyled list-inline media-detail pull-left"> <li><i class="fa fa-calendar"></i>`+comment.formatDate+` </li> <li><p class="black-text mt-2  user-comment-`+comment.id+`">` + ( !isEmpty(comment.comment)? comment.comment : '' ) + `</p></li> <li>`+ like_by_side +`</li>  </ul> <ul class="list-unstyled list-inline media-detail pull-right"> <li class=""><p class="mb-0 ml-1 not-liked-yet-`+comment.id+`" style="color: #000000;">`+liked_by+`</li> </p> <li class="">  <p class="mb-0 ml-1 comment-reply" style="color:black;"><a class="comment-btns" href="javascript:void(0)" onclick="replyComment(`+comment.id+`)">Reply</a></p> </li> </ul>  </div> </div>` ;


});
        var post_author_detail = '';
        if(!isEmpty(value.owner_detail)){
            post_author_detail = `<p class="feed-connections gray-text fs-13 mb-0">
                                    `+value.owner_detail_pre_filled_string+` <a class="post-author-name" href="javascript:void(0)"   onclick="otherProfile(\``+ ( !isEmpty(value.owner_detail.firstname)? value.owner_detail.firstname : value.owner_detail.lastname) +`\`,\``+ value.owner_detail.id +`\`); "  rel="external" style="color: black">
                                        ` + value.owner_detail.firstname + ` ` + value.owner_detail.lastname + `
                                    </a>
                                </p>`;
        }
    var randon_number = Math.random().toString(36).substring(7);

    postHTML   +=  `<div class="bg-white rounded block-area  customer-post-container-` + value.id + `""> <div class="feed-header"> <div class="media"> <a class="user-feeds-profile-img pull-left" href="javascript:void(0)"  onclick="otherProfile(\``+ ( !isEmpty(value.user.firstname)? value.user.firstname : value.user.lastname) +`\`,\``+ value.user.id +`\`);" style="margin-right: 6px;"> <img src="`+ value.user.profileImage +`" class="img" alt="Photo" style=" width: 50px;    height: 50px;  border-radius: 50%;"> </a> <div class="media-body"> <div class="user-details"> <p class="user-name"><a href="javascript:void(0);"  onclick="otherProfile(\``+ ( !isEmpty(value.user.firstname)? value.user.firstname : value.user.lastname) +`\`,\``+ value.user.id +`\`);"> `+ value.user.firstname +` `+ value.user.lastname +` </a> ` + customer_post_delete +`</p> <p class="feed-date gray-text fs-14"> `+ value.posted_time +`\t</p> </div>  </div>  </div> <p class="feed-date black-text fs-14 show-read-more" style="word-break: break-all; padding-top: 10px; "> `+ (!isEmpty(value.shared_by_comment) ? value.shared_by_comment : value.description) + `\t</p></div> <div class="feed-photo">   ` + postImage + ` </div> `+ ( (!isEmpty(value.owner_id) && !isEmpty(value.description) && value.owner_id != window.localStorage.getItem("loginuser")) ?` <div class="feed-text feed-description card mb-0" style="padding-left: 10px; color: black;">`+ post_author_detail +` <p class="m-0 p-0 show-read-more" style="padding: 12px;"> ` + value.description + ` </p> </div> ` :   (!isEmpty(value.owner_id) && value.owner_id == window.localStorage.getItem("loginuser") && !isEmpty(value.description) && !isEmpty(value.shared_by_comment)) ?` <div class="feed-text feed-description card" style="padding-left: 10px;color:black;" > `+ post_author_detail +`<p class="m-0 p-0 show-read-more" style="padding: 12px;"> ` + value.description + ` </p> </div> ` : '' ) +`<div class="feed-footer"> <div class="impressions text-center bg-white"><div class="bg-white"> <div class="d-flex flex-row fs-12"> `+ likedByBtn+`  `+ sharedByBtn +` </div> </div>   </div> <div class="impressions-summary"> <div class=" text-center"><div class="media">  <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"> <a href="javascript:void(0)" onclick="renderPostUserList('` + value.id + `','` + 'post' + `','` + 'liked_by' +`')" class="col impression" style="white-space: nowrap; overflow: hidden;">`;

        postHTML   +=  `<span class="impression-number like-count` + value.id + `" style="color: black">` + kFormatter(liked_by_count) + `</span><span class="impression-number like-count-sample` + value.id + `" style="display:none;">` + (liked_by_count) + `</span><span class="impression-type" style="color: black">Likes</span>`;


      postHTML   +=  `</a> </div> <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">  <a href="javascript:void(0)" data-toggle="collapse" data-target=".comments_post_`+value.id+`" aria-expanded="false" class="col impression" style="white-space: nowrap; overflow: hidden;">`;

      postHTML   += `<span class="impression-number comment-count` + value.id + `" style="color: black;">` + kFormatter(value.comments.length) + `</span> <span class="impression-number comment-count-sample` + value.id + `" style="display:none; color:black;">` + (!isEmpty(value.comments.length)? value.comments.length: '' ) + `</span> <span class="impression-type" style="color: black;">Comments</span>`;

      postHTML   += `</a>  </div> <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"> <a href="javascript:void(0)" onclick="renderPostUserList('` + value.id + `','` + 'post' + `','` + 'shared_by' +`')" class="col impression" style="white-space: nowrap; overflow: hidden;">` ;

      postHTML   += `<span class="impression-number share-count` + value.id + `" style="color: black;">` + kFormatter(shared_by_count) + `</span> <span class="impression-number share-count-sample` + value.id + `" style="display:none; color:black" >` + shared_by_count + `</span> <span class="impression-type" style="color: black;">Shares</span>`;

       postHTML   += `</a>  </div> </div> </div>  <h6 data-toggle="collapse" data-target=".comments_post_` + value.id + `" style="cursor: pointer; margin-left: 8px;"> View Comments `+ ( comment_length ) +`</h6><div  class="collapse  comments_post_` + value.id + `" style="max-height: 400px; overflow-y: scroll; overflow-x: hidden;"> `+ comments +` </div> <div class="write-comment"> <div class="media"> <a class="user-feeds-profile-img pull-left" href="javascrpit:void(0);" style="margin-right: 6px;"  onclick="otherProfile(\``+ ( !isEmpty(value.user.firstname)? value.user.firstname : value.user.lastname) +`\`,\``+ value.user.id +`\`);"> <img src="`+ value.user.profileImage +`" class="user-img" alt="Photo" style=" width: 35px; height: 35px;  border-radius: 50%;"> </a> <div class="media-body"> <div class="comment-field input-group"> <input name="" class="form-control comment-input-`+randon_number+`" placeholder="Write a comment" onkeypress="if(event.keyCode == 13){commentPost('` + value.id + `','`+randon_number+`')}"> <div class="input-group-btn"><button class="btn" style="padding: .25rem 0.71rem; background: gray;" type="submit" onclick="commentPost('` + value.id + `','`+randon_number+`');"><i class="fa fa-paper-plane"></i></button></div>  </div> </div> </div> </div> </div> </div> </div>`;

    // postHTML   += `<div class="bg-white rounded block-area"> <div class="feed-header">   <div class="media"> <a class="user-feeds-profile-img pull-left" href="other-user-profile.html"> <img src="images/ss2.PNG" class="img" alt="Photo"> </a> <div class="media-body"> <div class="user-details"> <p class="user-name"><a href="other-user-profile.html"> `+ value.user.firstname +` `+ value.user.lastname +` Denis Ford </a></p><p class="feed-date gray-text fs-14" style="word-wrap: break-word"> `+ value.description +`\t</p> <p class="feed-date gray-text fs-14"> `+ value.posted_time +`\t</p> </div> </div> </div> </div> <div class="feed-photo"> ` + postImage + ` </div> <div class="feed-footer"> <div class="impressions text-center"> <div class="row nmarg"> <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 xs-pad"> <div class="impression"> <i class="fas fa-thumbs-up"></i> Like </div> </div> <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 xs-pad"> <div class="impression"> <i class="fas fa-comment-alt"></i> Comment </div> </div> <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 xs-pad"> <div class="impression"> <i class="fas fa-share"></i> Share </div> </div> </div> </div> <div class="impressions-summary"> <p class="bold-text"> Lorem Ipsum, John Doe and 80 others</p> </div> <div class="write-comment"> <div class="media"> <a class="user-feeds-profile-img pull-left" href="other-user-profile.html"> <img src="images/ss2.PNG" class="user-img" alt="Photo"> </a> <div class="media-body"> <div class="comment-field"> <input name="" class="form-control" placeholder="Write a comment"> </div> </div> </div> </div> </div> </div>`;

});
    return postHTML;


}


    /**
     *
     * loadPostScroll
     * @param type
     * @param userId
     */


    function loadPostScroll(type = '' , userId){
                   // alert(userId);
    var row = Number(scroll_row);
    var allcount = Number(scroll_all);

    row = row + postPerPage;
    if(row <= allcount){
    loadFeeds(type , userId);
    scroll_row = row;
}
}

    /**
     *
     * getLoadMoreButton
     * @param type
     * @param className
     * @param userId
     * @returns {string}
     */
    function getLoadMoreButton(type,className , userId){
          return  `<div class="mb-5 d-flex pb-5 load-more-feed"> <button class="btn btn-success mb-5 `+className+`" onclick="loadPostScroll(\``+ type +`\`,\``+ userId +`\`);"  >Load more stories</button> </div>`;
    // return `<div class="load-morebutton">
    //             <button class="btn btn-success mb-5 `+className+`" onclick="loadPostScroll(\``+ type +`\`,\``+ userId +`\`);" style="margin - right :6px;">
    //                 Load More
    //             </button>
    //         </div>`;
}

    /**
     * showLoadMoreButtons
     */

    function showLoadMoreButtons() {

    var maxLength = 300;
    $(".show-read-more").each(function () {

    var myStr = $(this).text();
    if ($.trim(myStr).length > maxLength) {
    var newStr = myStr.substring(0, maxLength);
    var removedStr = myStr.substring(maxLength, $.trim(myStr).length);
    $(this).empty().html(newStr);
    $(this).append('<div class="mb-5 d-flex pb-5 load-more-feed" > <a href="javascript:void(0);" class="read-more-for-feeds-only btn btn-success mb-5">Load more stories</a> </div> ');
    $(this).append('<span class="more-text">' + removedStr + '</span>');
}
});
    $(".read-more-for-feeds-only").click(function () {
    $(this).siblings(".more-text").contents().unwrap();
    $(this).remove();
});
}

    /**
     *
     * renderUserList
     * @param userList
     */
    function renderUserList(userList){
    let html = '';
    $.each(userList,function(key,user){
    let userImageSrc = 'images/default-user-image.png';
    if(!isEmpty(user.upload)){
    userImageSrc = image_url + 'files/' + user.upload.hash + '/' + user.upload.name;
}
    html += `<div class="comment-cont" style="padding: 7px;"><a class="user-feeds-profile-img pull-left" href="javascript:void(0);" style="margin-right: 6px;"  onclick="otherProfile(\``+ ( !isEmpty(user.firstname)? user.firstname : user.lastname) +`\`,\``+ user.id +`\`);">
                    <img onclick="otherProfile(\``+ ( !isEmpty(user.firstname)? user.firstname : user.lastname) +`\`,\``+ user.id +`\`);" src="` + userImageSrc + `" class="align-self-center img comment_pic_css" style="width: 35px;    height: 35px;  border-radius: 50%;" ></a>
                    <div class="comment p-2 max-width-90">
                        <span class="commenter bold-text"    onclick="otherProfile(\``+ ( !isEmpty(user.firstname)? user.firstname : user.lastname) +`\`,\``+ user.id +`\`);">` + user.firstname + ' ' + user.lastname + `</span>
                    </div>
                </div>`;
    // html += `<div class="comment-cont"><div class="bg-white rounded block-area"> <div class="feed-header"> <div class="media"> <a class="user-feeds-profile-img pull-left" href="other-user-profile.html"> <img src="` + userImageSrc + `" class="img" alt="Photo"> </a> <div class="media-body"> <div class="user-details"> <p class="user-name"><a href="other-user-profile.html"> ` + user.firstname + ' ' + user.lastname + ` </a></p> <p class="feed-date gray-text fs-14"></p> </div> </div> </div> </div></div>`;


});

    $('#post-user-list .user-list').html(html);
    if(isEmpty(userList) || userList.length == 0){
    $('#post-user-list .user-list').html(`<p class="text-center">No Record Found</p>`);
}
}
    function renderPostUserList(id,type,list_type = 'liked_by'){


    if(list_type == 'liked_by'){
    $('#post-user-list span#post-user-list-heading').html('Liked By List');
}else if(list_type == 'shared_by'){
    $('#post-user-list span#post-user-list-heading').html('Shared By List');
}
    let data = '';
    if(type == 'post'){
    data += '&post_id=' + id;
}else if(type == 'comment'){
    data += '&comment_id=' + id;
}
    $('#post-user-list-btn').click();
    var _url = app_url + 'get-post-user-lists' + '?id=' + window.localStorage.getItem("loginuser") + '&type=' + list_type +  data;
    var _method = 'get';
    var response = CallMethod(_method, _url, onSuccess, '');

    function onSuccess(response) {
    if (typeof response.data != 'undefined' && response.data.login_error_status === '1') {
    showExpireAlert('session-expire');
    session(response.data);
} else if (typeof response.data != 'undefined' && response.data.state === 'success') {
    renderUserList(response.data.list);
}
}
}

    /**
     *
     * likePost
     * @param id
     */
    function likePost(id) {

    var _url = app_url + 'like-post' + '?id=' + window.localStorage.getItem("loginuser") + '&post_id=' + id;
    var _method = 'post';
    var response = CallMethod(_method, _url, onSuccess, '');

    function onSuccess(response) {
    if (typeof response.data != 'undefined' && response.data.login_error_status === '1') {
    showExpireAlert('session-expire');
    session(response.data);
} else if (typeof response.data != 'undefined' && response.data.state === 'success') {
    let like_count = $('.like-count-sample' + id).html();

        if (like_count == "")
        {
            like_count = "0";
        }

        $('.like-count' + id).html( kFormatter(parseInt(like_count) + 1));
    $('.like-count-sample' + id).html((parseInt(like_count) + 1));
    setTimeout(function() {
    $('.like_by_btn_icon_' + id ).addClass(' comment-liked');
    $('.like_by_btn_icon_' + id ).removeClass('fa fa-heart-o');
    $('.like_by_btn_icon_' + id ).addClass('fa fa-heart');
}, 100);
}
}
}

    /**
     *
     * openCollapse
     * @param id
     */
    function openCollapse(id){
    if($('.comments_post_' + id).parent().find('.collapse.show').length == 0){
    $('.comments_post_' + id).addClass('collapse show');
}
}
    function scrollBottom(id){
    $('.comments_post_' + id).animate({ scrollTop: $('.comments_post_' + id).prop("scrollHeight")}, 1000);
}

    /**
     * commentPost
     * @param id
     * @param input_id
     */
    function commentPost(id,input_id) {
    let comment_count = $('.comment-count-sample' + id).html();
    let inputText = $('.comment-input-' + input_id).val();
    if (inputText.length > 0) {
    $('.comment-count' + id).html(kFormatter(parseInt(comment_count) + 1));
    $('.comment-count-sample' + id).html((parseInt(comment_count) + 1));
    var _url = app_url + 'comment-post' + '?id=' + window.localStorage.getItem("loginuser") + '&post_id=' + id + '&comment=' + inputText;
    var _method = 'post';
    var response = CallMethod(_method, _url, onSuccess, '');
    function onSuccess(response) {
    if (typeof response.data != 'undefined' && response.data.login_error_status === '1') {
    showExpireAlert('session-expire');
    session(response.data);
} else if (typeof response.data != 'undefined' && response.data.state === 'success') {
    openCollapse(id);
    var comments = '';
    let comment = response.data.comment;
    let liked_count = `<span class = "comment-btns comment-like-count-`+response.data.comment_id+`"></span>`;
    let liked_by = `<a class="comment-btns" href="javascript:void(0)" onclick="likeComment('`+response.data.comment_id+ `','` + 0 +`')">Like</a>`;
    let like_by_side = '';
    let comment_like = [];
    if(!isEmpty(comment.liked_by)){
    comment_like = JSON.parse(comment.liked_by);
}
    let userId = 0;
    if(!isEmpty(window.user_id)){
    userId = parseInt(window.user_id);
}
    liked_count = `<span class = "comment-btns comment-like-count-`+comment.id+`">` + kFormatter(comment_like.length) + ' ' +`</span><span class = "comment-btns comment-like-count-sample-`+comment.id+`" style="display:none">` + comment_like.length + ' ' +`</span>`;
    liked_by = `<a class="comment-btns" href="javascript:void(0)" onclick="likeComment('`+comment.id+ `','` + comment_like.length +`')">Like</a>`;
    if($.inArray(userId, comment_like) !== -1){
    liked_by = `<a class="comment-btns comment-liked-already" href="javascript:void(0)">Like</a>`;
}
    if(comment_like.length > 0){
    like_by_side = `<span class="comment-like-span"  onclick="renderPostUserListWithRendering('` + comment.id + `','` + 'comment' + `','` + 'liked_by' +`')">
                                        <i class="fa fa-thumbs-up like-btn-css"></i>` + liked_count + `
                                    </span>`;
}

    $('.comment-input-' + input_id).val('');
    comments += ` <div class="media  comment-overall_body-container-`+response.data.comment_id+`" style=" border-top: 1px dashed #DDDDDD; padding: 20px 0; width: 100%;"> <a class="user-feeds-profile-img pull-left" href="javascript:void(0)" onclick="otherProfile(\``+ ( !isEmpty(window.localStorage.getItem("firstname"))? window.localStorage.getItem("firstname") : window.localStorage.getItem("lastname")) +`\`,\``+ window.localStorage.getItem("loginuser") +`\`);" style="margin-right: 6px;"><img class="img media-object" src="`+ window.localStorage.getItem("profileImage") +`" alt=""  style="width: 50px;height: 50px;border-radius: 50%; margin-left: 10px;"></a> <div class="media-body  comment-list-container-`+id+`"> <ul class="list-unstyled list-inline media-detail pull-right"> <li> <div class="dropdown" > <i class="fa fa-ellipsis-h dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i> <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="left: -153px; padding-left: 20px;"> <a class="dropdown-item" href="javascript:void(0);"  onclick="editComment('`+ response.data.comment_id + `','` + id + `','` + inputText +`')"> <i class="fas fa-pencil cursor-pointer"></i> Edit Comment</a> <br> <a class="dropdown-item" href="javascript:void(0);" onclick="deleteComment('`+response.data.comment_id + `','` +id +`')"><i class="fas fa-pencil cursor-pointer"></i> Delete Comment</a> </div> </div> </li> </ul> <p class="user-name">` + window.localStorage.getItem("firstname")  + ' ' + window.localStorage.getItem("lastname") + `</p>  <ul class="list-unstyled list-inline media-detail pull-left"> <li><i class="fa fa-calendar"></i>Just Now</li> <li><p class="black-text mt-2  user-comment-`+id+`">` + inputText + `</p></li> <li id="comment-like-container-`+response.data.comment_id+`">`+ like_by_side +`</li>  </ul> <ul class="list-unstyled list-inline media-detail pull-right"> <li class=""><p class="mb-0 ml-1 not-liked-yet-`+id+`" style="color: black">`+liked_by+`</li> </p> <li class="">  <p class="mb-0 ml-1 comment-reply" style="color: black"><a class="comment-btns" href="javascript:void(0)" onclick="replyComment(`+ response.data.comment_id +`)">Reply</a></p></li> </ul>  </div> </div>` ;
    // comments = ` <div class="media  comment-overall_body-container-`+response.data.comment_id+`" style=" border-top: 1px dashed #DDDDDD; padding: 20px 0;"> <a class="user-feeds-profile-img pull-left" href="#" style="margin-right: 6px;"><img class="img media-object" src="`+ window.localStorage.getItem("profileImage")+ `" alt=""></a> <div class="media-body  comment-list-container-`+id+`"> <ul class="list-unstyled list-inline media-detail pull-right"> <li> <div class="dropdown" > <i class="fa fa-ellipsis-h dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i> <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="left: -153px; padding-left: 20px;"> <a class="dropdown-item" href="javascript:void(0);" onclick="editComment('`+ comment.id + `','` + value.id + `','` + comment.comment +`')"><i class="fas fa-pencil cursor-pointer"></i>Edit Comment</a> <br> <a class="dropdown-item" href="javascript:void(0);" onclick="deleteComment('`+comment.id + `','` +value.id +`')"><i class="fas fa-pencil cursor-pointer"></i> Delete Comment</a> </div> </div> </li> </ul> <p class="user-name">` + window.localStorage.getItem("firstname")  + ' ' + window.localStorage.getItem("lastname") + `</p> <p class="gray-text  user-comment-`+id+`">` + inputText + `</p> <ul class="list-unstyled list-inline media-detail pull-left"> <li><i class="fa fa-calendar"></i>Just Now</li> <li id="comment-like-container-`+response.data.comment_id+`">`+ like_by_side +`</li>  </ul> <ul class="list-unstyled list-inline media-detail pull-right"> <li class="">`+liked_by+`</li> <li class="">  <p class="mb-0 ml-1 comment-reply"><a class="comment-btns" href="javascript:void(0)" onclick="replyComment('`+ response.data.comment_id +`')">Reply</a></p></li> </ul> </div> </div>` ;

    $('.comments_post_' + id).append(comments);

    scrollBottom(id);
}
}
}
}

    /**
     *
     * sharePost
     * @param id
     */
    function sharePost(id, url) {
    $('#post-share-by-btn').click();
    $('#share-post-comment').html('');
    let postobject = postsList.find(post => parseInt(post.id) === parseInt(id));
    console.log(postobject);
    current_post_id = id;
    let customerPic = 'images/default-user-image.png';
    if(!isEmpty(window.localStorage.getItem("profileImage"))){
    customerPic = window.localStorage.getItem("profileImage");
}
        $('#post-share-by .post-share_container').html(`<div class="modal-content"> <form enctype="multipart/form-data" id="post-form"  action="javascript:void(0);" > <div class="modal-header d-flex  bg-grey"> <h4 class="" data-dismiss="modal"> <i class="fa fa-chevron-left"></i> </h4> <h5 class="modal-title">Share Post</h5>  </div> <div class="modal-body"> <div class="d-block"> <div class="d-flex"> <img src="`+customerPic+`" class="user-post-img" id="modal-post-profile-image" alt=""> <div> <h5 class="w-100" id="modal-profile-name">`+window.localStorage.getItem("firstname")+`  `+window.localStorage.getItem("firstname")+`</h5> <div class="d-flex"> <div class="btn-group mr-1"> <div class="btn-group"> <button type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown"> <span> <i class="fa fa-users"></i> </span> <span>Friends</span> <span class="caret"></span> </button> <ul class="dropdown-menu min-width-200" role="menu" > <li class="px-2 d-flex"> <input type="radio" class="mr-1 my-1" style="width: 10px;"/> <i class="fa fa-globe mr-2 py-1"></i> <span>Public</span> </li> <li class="px-2 d-flex"> <input type="radio" class="mr-1 my-1" style="width: 10px;"/> <i class="fa fa-users mr-2 py-1"></i> <span>All Friends</span> </li> <li class="px-2 d-flex" > <input type="radio" class="mr-1 my-1" style="width: 10px;"/> <i class="fa fa-users mr-2 py-1"></i> <span class="d-flex justify-content-between"> <span>Specific Friends</span> <i class="fa fa-chevron-right py-1 ml-3" data-toggle="modal" data-target="#specificFriends" onclick="tagFriend();"></i> </span> </li> <li class="px-2 d-flex" > <input type="radio" class="mr-1 my-1" style="width: 10px;"/> <i class="fa fa-users mr-2 py-1"></i> <span>Friends Except</span> <i class="fa fa-chevron-right py-1 ml-3" data-toggle="modal" data-target="#friendsExcept" onclick="tagFriend();"></i> </li> <li class="px-2 d-flex"> <input type="radio" class="mr-1 my-1" style="width: 10px;"/> <i class="fa fa-lock mr-2 py-1"></i> <span>Only Me</span> </li> </ul> </div> </div> <div class="btn-group"> <div class="btn-group"><button type="button" class="btn btn-light " data-target="#tagFriends" data-toggle="modal" onclick="tagFriend();" > <span> </span> <span>Tag</span> <span class="caret"></span> </button>  </div> </div> </div> </div> </div> <textarea cols="30" name="post_description" id="share-post-comment" rows="2" class="form-control b-0 my-2" placeholder="What is on your mind"></textarea> </div> <div class="d-block pb-5"> <img src="`+url+`" style="width: 100%;"  alt=""> <span>`+ postobject.description +`</span> </div><button class="btn btn-success br-25 pull-right mb-2"  id="share-now-btn" onclick="sharePostNow('`+id+`')" >Share</button> </div> </form> </div>`);

    //     $('#post-share-by .post-share_container').html(`
    //
    //     <div class="media user-feeds-profile-img">
    //      <a class="user-feeds-profile-img pull-left" href="javascript:void(0);" style=" margin-right: 6px;" onclick="otherProfile(\``+ ( !isEmpty(window.localStorage.getItem("firstname"))? window.localStorage.getItem("firstname") : window.localStorage.getItem("lastname")) +`\`,\``+ window.localStorage.getItem("loginuser") +`\`;">
    //         <img src="`+customerPic+`" class="align-self-center mr-2   ml-2 user-img user-reply-image" style=" width: 48px; ">
    //         </a>
    //         <div class="media-body">
    //             <div class="comment-field w-100">
    //                 <textarea id="share-post-comment" class="comment-input form-control reply-comment-input" placeholder="Please say something..."></textarea>
    //             </div>
    //         </div>
    //     </div>
    //     <button class="btn btn-primary float-right mr-2 mt-2" style="float: right;
    // margin-top: 10px;" id="share-now-btn" onclick="sharePostNow('`+id+`')">Share</button>
    // `);
    setTimeout(() => {
    $('#post-share-by .post-share_container #share-now-btn').removeClass('ui-btn ui-shadow ui-corner-all');
}, 100);
}

    /**
     *
     * sharePostNow
     * @param id
     */
    function sharePostNow(id){
    let comment = $('#share-post-comment').val();
    if(!isEmpty(current_post_id)){
    var _url = app_url + 'share-post' + '?id=' + window.localStorage.getItem("loginuser") + '&post_id=' + current_post_id +'&comment=' + comment;
    var _method = 'post';
    var response = CallMethod(_method, _url, onSuccess, '');
    function onSuccess(response) {
    if (typeof response.data != 'undefined' && response.data.login_error_status === '1') {
    showExpireAlert('session-expire');
    session(response.data);
} else if (typeof response.data != 'undefined' && response.data.state === 'success') {
    let share_count = $('.share-count-sample' + current_post_id).html();
    $('.share-count' + current_post_id).html(kFormatter(parseInt(share_count) + 1));
    $('.share-count-sample' + current_post_id).html((parseInt(share_count) + 1));
    setTimeout(function() {
    $('#post-share-by .close').click();
    refreshFeedBack();
}, 100);
    showMessage(response.data.message);
} else if (typeof response.data != 'undefined' && response.data.state === 'fail') {
    showMessage(response.data.message);
} else if (typeof response.data != 'undefined' && response.data.state === 'error') {
    showMessage(response.data.message);
}
}
}
}

    function refreshFeedBack(goback = true){
    // $('.postFeeds').html('');
    // $('.postFeedsEventSlider').html('');
    // scroll_row = 0;
    // if(goback){
    //     history.back()
    // };
    // loadFeeds(feedType);
    location.reload();
}

    /**
     * likeComment
     * @param id
     * @param count
     */
    function likeComment(id,count = 0){
    var _url = app_url + 'like-comment' + '?id=' + window.localStorage.getItem("loginuser") + '&comment_id=' + id;
    var _method = 'post';
    var response = CallMethod(_method, _url, onSuccess, '');

    function onSuccess(response) {
    if (typeof response.data != 'undefined' && response.data.login_error_status === '1') {
    showExpireAlert('session-expire');
    session(response.data);
} else if (typeof response.data != 'undefined' && response.data.state === 'success') {
    let container = $('.comment-list-container-'+id);
    let like_btn= $('.not-liked-yet-'+id);
    let like_count = parseInt(count);
    like_count++;
    let liked_count = `<span class = "comment-btns comment-like-count-`+id+`">` + kFormatter(like_count) + ' ' +`</span>`;
    like_btn.html(`<a class="comment-btns comment-liked-already" href="#">Like</a>`);
    if($('.comment-like-count-' + id).length > 0){
    let comment_like_sample = $('.comment-like-count-sample-' + id);
    $('.comment-like-count-' + id).html(kFormatter(parseInt(comment_like_sample.html()) + 1));
    comment_like_sample.html(parseInt(comment_like_sample) + 1);
}else{
    $('#comment-like-container-' + id).html(`<span class="comment-like-span" onclick="renderPostUserListWithRendering('` + id + `','` + 'comment' + `','` + 'liked_by' +`')">
                                                            <i class="fa fa-thumbs-up like-btn-css"></i><span class="comment-btns comment-like-count-`+id+`">1</span>
                                                        </span>`);
}
}
}
}


    /**
     *
     * replyComment
     * @param id
     */
    function replyComment(id){
    var _url = app_url + 'get-replies' + '?id=' + window.localStorage.getItem("loginuser") + '&parent_id=' + id;
    var _method = 'get';
    var response = CallMethod(_method, _url, onSuccess, '');
    function onSuccess(response) {
    if (typeof response.data != 'undefined' && response.data.login_error_status === '1') {
    showExpireAlert('session-expire');
    session(response.data);
} else if (typeof response.data != 'undefined' && response.data.state === 'success') {
    $('#post-comments-subcomments-btn').click();
    let customerPic = 'images/default-user-image.png';
    if(!isEmpty(window.localStorage.getItem("profileImage"))){
    customerPic = window.localStorage.getItem("profileImage");
}
    $('.reply-your-comment').html(`
                <div class="media-list p-50  w-100">


                        <div class="media  w-100">

                        <div class="col-sm-2" style="max-width: 11.666667%!important; padding-right: 0px!important; margin-left: -9px;"> <a href="javascript:void(0)" class="media-left">
                            <img src="`+customerPic+`"
                                class="img-fluid rounded-circle border-white border-3"  style=" height: 35px;  width: 35px;" alt="">
                        </a></div>
                        <div class="media-body" style="padding-left: 0px;"><div class="input-group" style="width: 105%;">

                                        <div class="comment-field"> <input name="" class="form-control comment-input-magp4h reply-comment-input"
                                         onkeypress="if(event.keyCode == 13){replyOnComment('`+id+`')}"
                                        type="text"
                                        placeholder="Reply a comment"> </div><div class="input-group-btn"><button class="btn btn-default send-btn" type="submit" onclick="replyOnComment('`+id+`');"><i class="fa fa-paper-plane"></i></button></div>

                                </div></div>





                        </div>

                </div>
            `);
    let replies = response.data.replies;
    $("#replies-list-div").html('');
    $.each(replies, function(key, reply) {
    let commentPic = 'images/default-user-image.png';

    if(!isEmpty(reply.user.user_image)){
    commentPic = image_url_PATH + reply.user.user_image['0'].img;
}
    let replies_options = '';
    if(reply.id != id){
    replies_options = `<div class="dropdown comment_option_container col-sm-2" >
                                            <button class="comment_option_container_dropdown replies-design" type="button" data-toggle="dropdown">
                                                <i class="fa fa-ellipsis-h"></i>
                                            </button>
                                            <ul class="dropdown-menu post_delete_menu p-0 m-0" style="padding: 10px; margin-left: -120px;     position: relative;">
                                                <li class="cursor-pointer" style="cursor: pointer;"  onclick="editComment('`+ reply.id + `','` + null + `','` + reply.comment +`')"><i class="fa fa-pencil post-delete-css post_delete_btn_css cursor-pointer" style="cursor: pointer;"></i>Edit Comment</li>
                                                <li class="cursor-pointer" style="cursor: pointer;" onclick="deleteComment('`+reply.id + `','` + null +`')"><i class="fa fa-trash post-delete-css post_delete_btn_css cursor-pointer" style="cursor: pointer;"></i>Delete Comment</li>
                                            </ul>
                                        </div>`;
}
    $("#replies-list-div").append(`<div class="media row">

                    <div class="comment-overall_body-container-`+reply.id+` " style=" width: 100%;">

                        <div class="comment-cont col-sm-10">

                        <a class="user-feeds-profile-img pull-left" style="    margin-right: 7px;">
                            <img   onclick="otherProfile(\``+ ( !isEmpty(reply.user.firstname)? reply.user.firstname : reply.user.lastname) +`\`,\``+ reply.user.id +`\`);" src="` + commentPic + `" class="align-self-center user-img comment_pic_css" style="width: 35px;height: 35px;border-radius: 50%;">
                          </a>

                            <div class="comment p-2 max-width-90 comment-list-container-`+reply.id+`">
                                <span class="commenter bold-text"   onclick="otherProfile(\``+ ( !isEmpty(reply.user.firstname)? reply.user.firstname : reply.user.lastname) +`\`,\``+ reply.user.id +`\`);" >` + reply.user.firstname + ' ' + reply.user.lastname + `</span> <p class="comment-text mb-0 breakword user-comment-`+reply.id+`">` + reply.comment + `</p> </div></div>`+replies_options+` </div> </div>`);
});
}
}
}

    /**
     *
     * replyOnComment
     * @param id
     * @param post_id
     */
    function replyOnComment(id,post_id){
    let inputText = $('.reply-comment-input').val();
    if (inputText.length > 0) {
    var _url = app_url + 'reply-comment' + '?id=' + window.localStorage.getItem("loginuser") + '&parent_id=' + id + '&comment=' + inputText + '&post_id=' + post_id;
    var _method = 'post';
    var response = CallMethod(_method, _url, onSuccess, '');
    function onSuccess(response) {
    if (typeof response.data != 'undefined' && response.data.login_error_status === '1') {
    showExpireAlert('session-expire');
    session(response.data);
} else if (typeof response.data != 'undefined' && response.data.state === 'success') {
    $('.reply-comment-input').val('');
    $("#replies-list-div").append(`
                <div class="comment-overall_body-container-`+response.data.post_commment.id+`">
                    <div class="comment-cont">
                        <img  onclick="otherProfile(\``+ ( !isEmpty(window.localStorage.getItem("firstname"))? window.localStorage.getItem("firstname") : window.localStorage.getItem("lastname")) +`\`,\``+ window.localStorage.getItem("loginuser") +`\`);" src="` + window.localStorage.getItem("profileImage") + `" class="align-self-center user-img comment_pic_css" style=" width: 35px; height: 35px; border-radius: 50%;">
                        <div class="comment p-2 max-width-90">
                            <span class="commenter bold-text"  onclick="otherProfile(\``+ ( !isEmpty(window.localStorage.getItem("firstname"))? window.localStorage.getItem("firstname") : window.localStorage.getItem("lastname")) +`\`,\``+ window.localStorage.getItem("loginuser") +`\`);">` + window.localStorage.getItem("firstname") + ` ` + window.localStorage.getItem("lastname") + `</span>
                            <p class="comment-text mb-0 breakword user-comment-`+response.data.post_commment.id+`">` + inputText + `</p>
                        </div>
                    </div>
                    <div class="dropdown comment_option_container">
                        <button class="comment_option_container_dropdown replies-design" type="button" data-toggle="dropdown">
                            <i class="fa fa-ellipsis-h"></i>
                        </button>
                        <ul class="dropdown-menu post_delete_menu p-0 m-0">
                            <li class="cursor-pointer" style="cursor: pointer;" onclick="editComment('`+ response.data.post_commment.id + `','` + null + `','` + inputText +`')"><i class="fa fa-pencil post-delete-css post_delete_btn_css cursor-pointer" style="cursor: pointer;"></i>Edit Comment</li>
                            <li class="cursor-pointer" style="cursor: pointer;" onclick="deleteComment('`+response.data.post_commment.id + `','` + null +`')"><i class="fa fa-trash post-delete-css post_delete_btn_css cursor-pointer" style="cursor: pointer;"></i>Delete Comment</li>
                        </ul>
                    </div>
                </div>
                `);
}
}
}
}


    /**
     * create_a_post
     */
    function create_a_post() {

    let image_src = $("#cropped-post-image").val();
    let tag_friend = window.localStorage.getItem("get_all_tag_friend");
        localStorage.removeItem("get_all_tag_friend");
    let post_description = $("#post_description").val();
    let customer_id_for_post = window.localStorage.getItem("loginuser");

        var formData = new FormData();
        if(isEmpty(image_src)){
            if($('#video')[0].files.length == 1) {

                formData.append('post_image', $('#video')[0].files[0]);
            }else{
                formData.append('post_image', $('#post-image')[0].files[0]);

            }
        }else{
            formData.append('cropped_post_image', image_src);
        }
        formData.append('content-type', 'description');
        formData.append('post_description', post_description);
        formData.append('id', customer_id_for_post);
        formData.append('tag_friend', tag_friend);

        var parameters = formData;
        var _url = app_url + 'create-post';
        var _method = 'POST';
    var response = CallMethod(_method, _url, onSuccess, parameters);

    function onSuccess(response) {

    if (typeof response.data != 'undefined' && response.data.login_error_status === '1') {
    showExpireAlert('session-expire');
    session(response.data);
} else {
    if (typeof response.data != 'undefined' && typeof response.data.errors != 'undefined') {
    let errors_html = '';
    $.each(response.data.errors, function (key, value) {
    errors_html += '<div class="alert alert-danger alert-dismissible fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>' + value + '</strong></div>';
});
    $('.error').show();
    $('.error').html(errors_html);
    location.href = '#event_slider';
} else {
        location.reload();
}
}
}
}

    /**
     *
     * editComment
     * @param id
     * @param postId
     * @param comment
     */
    function editComment(id,postId,comment){
    $('#edit-comment-form').trigger('reset');
    $('#post_id_hidden_for_comment').val(postId);
    $('#comment_id_hidden').val(id);
    $('#edit_comment_description').html(comment);
    $('#post-comment-btn').click();
}

    /**
     * updateComment
     */
    function updateComment(){
    let comment_id = $('#comment_id_hidden').val();
    let post_id = $('#post_id_hidden_for_comment').val();
    let comment = $('#edit_comment_description').val();
    var parameters = '';
    var _url = app_url + 'update-comment?loginuser=' + window.localStorage.getItem("loginuser") +
    '&comment_id=' + comment_id +
    '&post_id=' + post_id +
    '&comment=' + comment;
    var _method = 'POST';
    var result = CallMethod(_method, _url, onSuccess, parameters);

    function onSuccess(result) {
    if (result.data.login_error_status === '1') {
    showExpireAlert('session-expire');
    session(result.data);
} else {
    $('.user-comment-' + comment_id).html(comment);
    $('#post-comment .close').click();
}
}
}

    /**
     *
     * @param id
     * @param postId
     */
    function deleteComment(id,postId){
    alertify.confirm('labels changed!').set({title:"Confirm"},{'labels':{ok:'Yes', cancel:'No'}});
    alertify.confirm("Are You sure you want to remove your comment?",
    function(){
    var parameters = '';
    var _url = app_url + 'remove-comment?loginuser=' + window.localStorage.getItem("loginuser") + '&comment_id=' + id;
    var _method = 'POST';
    var result = CallMethod(_method, _url, onSuccess, parameters);

    function onSuccess(result) {
    if (result.data.login_error_status === '1') {
    showExpireAlert('session-expire');
    session(result.data);
} else {
    $('.comment-overall_body-container-' + id).remove();
    let comment_count = $('.comment-count-sample' + postId).html();
    $('.comment-count' + postId).html(kFormatter(parseInt(comment_count) - 1));
    $('.comment-count-sample' + postId).html(parseInt(comment_count) - 1);
}
}
},
    function(){

});
}

    /**
     *
     * deletePost
     * @param id
     */
    function deletePost(id) {
        $('.delete-post-id').val(id);
    }


    function editPost(id, description, url) {
        let postobject = postsList.find(post => parseInt(post.id) === parseInt(id));
        resetPostData();
        $('#post_hidden_id').val(id);
        if (!isEmpty(postobject.owner_id) && !isEmpty(postobject.description) && ((postobject.owner_id == window.user_id && !isEmpty(postobject.shared_by_comment)) || postobject.owner_id != window.user_id)) {
            $('#edit_post_description').val(postobject.shared_by_comment);
            $('#post-content-type').val('shared_by_comment');
        } else {
            $('#edit_post_description').val(postobject.description);
            $('#post-content-type').val('description');
        }
        // alert(url);
        $('#file-upload-image').attr('src',  url);
        // $('.image-editor-preview').css("background-image", "url(" + url + ")");
        // $('.image-editor-preview-container').css("background-image", "url(" + url + ")");
        // $(".image-editor-preview-img").attr('src', url);
        // $("#image-editor-image").attr('src', url);

        $('#update-post-model').click();
    }

    /**
     *
     * editpostfilereadURL
     * @param input
     */
    function editpostfilereadURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $("#file-upload-image").attr("src", e.target.result);
                $("#file-image-title").html(input.files[0].name);
            };

            reader.readAsDataURL(input.files[0]);
        } else {
            removeUpload();
        }
    }

    /**
     *
     * updatePost
     */
    function updatePost() {


        let image_src = $("#edit-cropped-post-image").val();
        let post_description = $("#edit_post_description").val();
        let post_hidden_id = $("#post_hidden_id").val();
        let customer_id_for_post = window.localStorage.getItem("loginuser");


        var formData = new FormData();
        if(isEmpty(image_src)){
            formData.append('post_image', $('#edit-post-image')[0].files[0]);
        }else{
            formData.append('cropped_post_image', image_src);
        }
        formData.append('content-type', 'description');
        formData.append('post_description', post_description);
        formData.append('id', customer_id_for_post);
        formData.append('post_id', post_hidden_id);

        var parameters = formData;


        // let image_src = $("#edit-post-image").val();
        // var formData = new FormData();
        // formData.append('post_image', $('#edit-post-image')[0].files[0]);
        //
        // var parameters = formData;


        // let data = $('#edit-post-form').serialize();
        // let formData = new FormData();
        // if (!isEmpty(image_src)) {
        //     formData.append('image_src', image_src);
        // }
        // console.log('image_src', image_src);

        var _url = app_url + 'create-post';
        var _method = 'POST';
        var response = CallMethod(_method, _url, onSuccess, parameters);

        function onSuccess(response) {
            if (typeof response.data != 'undefined' && response.data.login_error_status === '1') {
                showExpireAlert('session-expire');
                session(response.data);
            } else {
                if (typeof response.data != 'undefined' && typeof response.data.errors != 'undefined') {
                    let errors_html = '';
                    $.each(response.data.errors, function(key, value) {
                        errors_html += '<div class="alert alert-danger alert-dismissible fade in"><a href="javascript:void(0)" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>' + value + '</strong></div>';
                    });
                    $('.error').show();
                    $('.error').html(errors_html);
                } else {
                    $('#update-a-post-model .closebtn').click();
                    cancelPost();
                    refreshFeedBack();
                }
            }
        }
    }





