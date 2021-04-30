function statistics(){

    var parameters = '';
    var url        = app_url+'user-statistics?loginuser='+window.localStorage.getItem("loginuser");
    var method     = 'GET';
    var param      = CallMethod(method, url, onSuccessStatistics, parameters);
    function onSuccessStatistics(param){


        $('.friend-requests-popover-link').attr('data-original-title','Friend Requests ('+ param.data.newFriendsRequestCount +')');
        $('.messages-popover-link').attr('data-original-title','Recent ('+ param.data.getMessageCount +')');

        var messages_top_bar_html = '';
              var friend_requests_top_bar_html = `<div class='bg-white rounded block-area friend-requests friend-requests-header-popover'> <div  class='block-body'> `;
           $.each(param.data.newFriendsRequest, function (key, value){
            friend_requests_top_bar_html += `<div class='request' id="req-`+ key +`"> <div class='media'> <a class='requester-img pull-left' href='javascript:void(0)' onclick="otherProfile(\`` + value.firstname + `\`,\`` + value.id + `\`);"> <img src='`+ ( !isEmpty( value.userimg)? value.userimg : '' ) +`' class='img' alt='Photo' style="width: 50; height: 50px;"> </a> <div class='media-body'> <div class='user-details'> <p class='user-name'><a href='javascript:void(0)' onclick="otherProfile(\`` + value.firstname + `\`,\`` + value.id + `\`;">  ` +( !isEmpty(value.firstname)? value.firstname : '' )+` `+ ( !isEmpty(value.lastname)? value.lastname : '' )+`</a></p> <p class='mutual-friends gray-text fs-14'> <span> `+ value.count_mutual_friends +` mutual friends</span> <span class='pull-right'> <button class='btn btn-success add-btn'  onclick="acceptReq(\`` + value.user_id + `\`,\`` + value.list_id + `\`,\`` + key + `\`)"><i class='fas fa-check'></i></button> <button class='btn btn-default remove-btn' onclick="canceleReq(\`` + value.user_id + `\`,\`` + value.list_id + `\`,\`` + key + `\`)"><i class='fas fa-times'></i></button> </span> </p> </div> </div> </div> </div>`;

           });
            friend_requests_top_bar_html += `<div class='request'> <div class='row nmarg'> <div class='col-lg-6 col-md-6 col-sm-6 col-xs-6 npad-x text-left'> <a href='friends-requests.html'>See All</a> </div> <div class='col-lg-6 col-md-6 col-sm-6 col-xs-6 npad-x text-right'> <a href='friends-search.html'>Find Friends</a> </div> </div> </div> </div> </div>`;


        messages_top_bar_html  += `<div class='bg-white rounded block-area friend-requests friend-requests-header-popover'> <div  class='block-body'>`;
                $.each(param.data.getNewMessage, function (key, value){
                messages_top_bar_html  += `<div class='request' id="req-`+key+`"> <div class='media'> <a class='requester-img pull-left' href='javascript:void(0)' onclick="otherProfile(\`` + value.firstname + `\`,\`` + value.id + `\`);"> <img src='`+ value.picture +`' class='img' alt='Photo'> </a> <div class='media-body'> <div class='user-details'> <p class='user-name'><a href='javascript:void(0)' onclick="otherProfile(\`` + value.firstname + `\`,\`` + value.id + `\`);">  ` +( !isEmpty(value.firstname)? value.firstname : '' )+` `+ ( !isEmpty(value.lastname)? value.lastname : '' )+` </a></p> <p class='mutual-friends gray-text fs-14'> <span> `+  value.text +`</span> </p> </div> </div> </div> </div>`;
                     });
        messages_top_bar_html  += `<div class='request'> <div class='row nmarg'> <div class='col-lg-6 col-md-6 col-sm-6 col-xs-6 npad-x'> <a href='my-messages.html'>See All</a> </div> <div class='col-lg-6 col-md-6 col-sm-6 col-xs-6 npad-x'> <a href='javascript:void(0)'>Mark All as Read</a> </div> </div> </div> </div> </div>`;

        $('.messages-popover-link').attr('data-content', messages_top_bar_html);
        $('.friend-requests-popover-link').attr('data-content', friend_requests_top_bar_html);
        $('#user-re-count').text(param.data.newFriendsRequestCount );
        $('#messages-popover-count').text(param.data.getMessageCount );


    }



}
