
<!--   ./chatbox   -->

    function openChatbox(contact_id, receiver = null ) {
    // alert('contact_id'+ contact_id);
    window.localStorage.setItem('contactId', contact_id);
    window.localStorage.setItem("recId", receiver);

    var parameters = '';
    var url        = app_url+'messages-chat?id='+window.localStorage.getItem("loginuser")+'&loginuser='+window.localStorage.getItem("loginuser")+'&contact_id='+contact_id;

    var method     = 'POST';
    var param      = CallMethod(method, url, onSuccessLogin, parameters);
    function onSuccessLogin(param){

    var messageHTML = '';
    var messageHeaderHTML ='';


    $.each(param, function (time, value){
        messageHeaderHTML = '<div class="msg-header text-center"> <div><span class="pull-left"><i class="fa fa-arrow-left" onclick="closeChatbox()"></i></span> <img src="'+value.picture+'" class="img" alt="Photo"> <span class="pull-right"><i class="fa fa-times" onclick="closeChatbox()"></i></span></div> </div>';

        let className = 2;

    // alert(value.sender);

    if( parseInt(window.localStorage.getItem("loginuser")) === parseInt(value.sender)){
    className = 1;
}
    messageHTML += '<div class="container darker msg-box-'+ className +'"> <div class="msg-box-container"><span class="message-text">'+ value.text +'</span> <span class="time-left">'+ value.time +'</span></div> </div>';

});

    // alert(messageHTML);

    $('#message-container').html(messageHTML);
    $('#message-header').html(messageHeaderHTML);
    setTimeout(function() {
    $("#message-container").animate({ scrollTop: $('#message-container').prop("scrollHeight") }, 1000);
}, 100);

}
    document.getElementById("chatBox").style.display = "block";
}

    function closeChatbox() {
    document.getElementById("chatBox").style.display = "none";
}





$('document').ready(function (){
     // alert('here');

    var parameters = '';
    var url        = app_url+'messages?id='+window.localStorage.getItem("loginuser")+'&loginuser='+window.localStorage.getItem("loginuser");

    var method     = 'POST';
    var param      = CallMethod(method, url, onSuccessLogin, parameters);
    function onSuccessLogin(param) {

        if ( !isEmpty(param.data) && !isEmpty(param.data.login_error_status) && param.data.login_error_status === '1') {
            showExpireAlert('session-expire');
            session(param.data);
        } else {

        var myFriendHTML = '';

        $.each(param.contacts, function (key, value) {
            // console.log(value);
            myFriendHTML += '<li class="list-group-item message msg-list-group-item" onclick="openChatbox(\'' + value.id + '\',\'' + value.rcvid + '\')"> <div class="messages-body"> <div class="media"> <div class="media-left"> <img src="' + value.picture + '" class="media-object messager-img"> </div> <div class="media-body"> <h5 class="media-heading pl-2">' + value.first_name + '' + value.last_name + '</h5> <p></p> </div> </div> </div> </li>';

        });

        $('#my-friends').html(myFriendHTML);
    }


}
});

    function sendMessage() {
    let message = $('#message-content').val();
    if (message != '' && typeof message != 'undefined') {
    var parameters = '';
    var _url = app_url + 'send-message?id='+ window.localStorage.getItem("loginuser") +'&msg=' + message + '&tid=' + window.localStorage.getItem('contactId')+'&loginuser='+ window.localStorage.getItem("loginuser")+ '&recId='+window.localStorage.getItem("recId");

    var _method = 'POST';
    var response = CallMethod(_method, _url, onSuccess, parameters);

    function onSuccess(response) {

        // window.localStorage.setItem("tid" ,response.tid );
    $('#message-content').val('');
    var messageHTML = '';

    messageHTML = '<div class="container darker msg-box-1"> <div class="msg-box-container"><span class="message-text">'+ response.text +'</span> <span class="time-left">'+ response.date +'</span></div> </div>'
    $('#message-container').append(messageHTML);

    setTimeout(function() {
    $("#message-container").animate({ scrollTop: $('#message-container').prop("scrollHeight") }, 1000);
}, 100);
       if(response.firstMessage === true){
           // alert('here');
           location.reload();
       }

}
}
}

