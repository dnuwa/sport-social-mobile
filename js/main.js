// var app_url = 'http://127.0.0.1:8000/api/';
// var image_url = 'http://127.0.0.1:8000';
// var image_url_PATH = 'http://127.0.0.1:8000/profiles/';
var image_url_PATH = 'https://sportsocial.org/public/profiles/';
var app_url = 'https://sportsocial.org/public/api/';
var image_url = 'https://sportsocial.org/public/';

statistics();
function islogin(data) {
    if (data.message_status === false || !window.localStorage.getItem('id')) {
        window.localStorage.setItem("restricted_url", document.referrer);
        window.location.href = 'login.html';
    } else {

        return true;
    }
}
function showExpireAlert(content) {
    // alertify.error(content).delay(3);
    showMessage(content, 'red', 'white');
}
function session(data) {
    if (data.login_error_status === '1' || !window.localStorage.getItem('id')) {
        window.location.href = 'login.html';
    } else {
        return 'ok';
    }
}

function handleData(name, data) {
    // ################## for login hook ###################################

    if (name == "Login") {

        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("id", data.user.userDetail.id);
        window.localStorage.setItem("loginuser", data.user.userDetail.id);
        window.localStorage.setItem("firstname", data.user.userDetail.firstname);
        window.localStorage.setItem("email", data.user.userDetail.email);
        window.localStorage.setItem("lastname", data.user.userDetail.lastname);
        window.localStorage.setItem("phone", data.user.phone);
        window.localStorage.setItem("profileImage", data.user.profileImage);
        window.localStorage.setItem("timelineImage", data.user.timelineImage);



        if(!isEmpty(window.localStorage.getItem("restricted_url"))){

            window.location.href = window.localStorage.getItem("restricted_url");
        }else {

            window.location.href = 'home.html';
        }


    }

    if (name == "profile-setting") {

        window.localStorage.setItem("firstname", data.userData.userDetail.firstname);
        window.localStorage.setItem("email", data.userData.userDetail.email);
        window.localStorage.setItem("lastname", data.userData.userDetail.lastname);
        window.localStorage.setItem("phone", data.userData.phone);
        window.localStorage.setItem("profileImage", data.userData.profileImage);
        window.localStorage.setItem("timelineImage", data.userData.timelineImage);

        location.reload();



    }
    if (name == "Signup") {

        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("id", data.user.userDetail.id);
        window.localStorage.setItem("loginuser", data.user.userDetail.id);
        window.localStorage.setItem("firstname", data.user.userDetail.firstname);
        window.localStorage.setItem("email", data.user.userDetail.email);
        window.localStorage.setItem("lastname", data.user.userDetail.lastname);
        window.localStorage.setItem("phone", data.user.phone);
        window.localStorage.setItem("profileImage", data.user.profileImage);
        window.localStorage.setItem("timelineImage", data.user.timelineImage);


        if(!isEmpty(window.localStorage.getItem("restricted_url"))){

            window.location.href = window.localStorage.getItem("restricted_url");
        }else {
            $('#verificationSection').show();
            $('#emailPasswordSection').hide();
            // window.location.href = 'sign-up-step-2.html';
        }
    }

}
function showAlert(content = '', header = '' ){
    alertify.confirm(content,function(e){
        if(e) {
            return true;
        } else {
            return false;
        }

    }).set({title: header});

}
function CallMethod(_method, _url, successCallback, parameters, contentType = false, async = true  ) {
    //show loading... image


    // var auth_url = '';
    // auth_url = _url + '&Authorization=' + window.localStorage.getItem("token");
    //    console.log(auth_url);
    // debugger;

    $.ajax({
        type: _method,
        url: _url,
        data: parameters,
        headers: {"Authorization": 'Bearer'+window.localStorage.getItem("token")},
        async: async,
        cache: true,
        contentType: contentType,
        dataType: "json",
        enctype: 'multipart/form-data',
        processData: false,
        success: successCallback,

        error: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 0) {
                showAlert(message = 'Please Check Your Internet Connection', header = 'Message');

            }
        }


    });
}

function isEmpty(value) {
    let response = true;
    if (value != null && value != 'null' && value != 'undefined' && value != '') {
        response = false;
    }
    return response;
}
function mypage(id){


    window.localStorage.setItem("page_id", id);
    window.location.href = 'page.html';
}
function group(id){


    window.localStorage.setItem("group_id", id);
    window.location.href = 'group.html';
}

function sideNav() {
    $("#current-user-profile").html(
        '<img src="' +
        window.localStorage.getItem("profileImage") +
        '" class="user-post-img" alt=""> <span class="form-control" data-target="#postModal" data-toggle="modal"> Post Your Sport Activity </span>'
    );
    var parameters = "";
    var url =
        app_url +
        "sidebar-statistics?loginuser=" +
        window.localStorage.getItem("loginuser");
    var method = "GET";
    var param = CallMethod(method, url, onSuccessSideBarStatistics, parameters);
    function onSuccessSideBarStatistics(param) {
        // console.log(param.data.groups);
        /**
         * <li> <a href="sport-matches.html"> <i class="fa fa-meetup nav-icon"></i> Sport Matches </a> </li> <li> <a href="sport-places.html"> <i class="fa fa-map-marker nav-icon"></i> Sport Places </a> </li> <li> <a href="sport-coaches.html"> <i class="fa fa-crosshairs nav-icon"></i> Sport Coach </a> </li>
         *
         */
        var sideNavHTML =
            '<div id="demo" class="sidenav top-60"> <div class="gn-scroller"> <ul class="gn-menu"> <div class="link-group link-group-no-heading"> <li> <a href="my-profile.html"> <i class="fa fa-user nav-icon"></i> My Profile </a> </li><li> <a href="sport-friend-invite.html"> <i class="fa fa-indent nav-icon"></i> Invite My Friends </a> </li> <li> <a href="sport-friends.html"> <i class="fa fa-thumbs-up nav-icon"></i> Sport Friends </a> </li> <li> <a href="my-posts.html"> <i class="fa fa-list-alt nav-icon"></i> Sport Posts </a> </li><li> <a href="sport-matches.html"> <i class="fa fa-futbol-o nav-icon"></i> Sport Matches </a> </li>  <li> <a href="sport-friend-requests.html"> <i class="fa fa-users nav-icon"></i> Invite Requests(' +
            param.data.dataStatistics.newFriendsRequestCount +
            ') </a> </li> <li class="py-1"> <a href="calendar.html"> <i class="fa fa-calendar nav-icon"></i> Sport Calendar </a> </li>  <div class="link-group link-group-with-heading text-primary d-none"> <span class="link-heading toggle-pages"><i class="fa fa-flag nav-icon"></i> MY PAGES </span> <div class="no-show pages-list" style="display: block;"> ';
        $.each(param.data.pages, function (key, value) {
            sideNavHTML +=
                '<li><a href="javascript:void(0);" onclick="mypage(' +
                value.id +
                ');" class="pl-5">' +
                value.name +
                "</a></li>";
        });
        // sideNavHTML  += '<li><a href="all-groups.html" class="pl-5" >Group 1</a></li>';
        sideNavHTML +=
            ' </div> </div> <div class="link-group link-group-with-heading text-primary d-none"> <span class="link-heading toggle-groups"><i class="fa fa-users nav-icon"></i> MY GROUPS </span> <div class="no-show groups-list" style="display: block;">';
        $.each(param.data.groups, function (key, value) {
            sideNavHTML +=
                ' <li><a href="javascript:void(0);" onclick="group(' +
                value.id +
                ');" class="pl-5">' +
                value.name +
                "</a></li> ";
        });

        sideNavHTML +=
            '</div> </div> <div class="link-group link-group-with-heading d-none"> <li class="pl-1"> <span class="link-heading pl-4"> CREATE </span> </li> <li><a href="create-page.html"><i class="fa fa-flag nav-icon"></i>Page</a></li> <li><a href="create-group.html"><i class="fa fa-users nav-icon"></i>Group</a></li> <li><a href="create-event.html"><i class="fa fa-calendar nav-icon"></i>Event</a></li>  </div> <div class="link-group link-group-with-heading px-0"> <li class="pl-1 d-none"> <span class="link-heading pl-4"> ACCOUNT SETTINGS </span> </li> <li> <a href="profile-setting.html"> <i class="fa fa-cogs nav-icon"></i> Settings </a> </li>  <li> <a href="javascript:void(0);" onclick="logout();"> <i class="fa fa-sign-out nav-icon"></i> Sign Out </a> </li> </div> </div> <br><br><br><br><br> </ul> </div><!-- /gn-scroller --> </div>';
        // var sideNavHTML  ='<div id="demo" class="sidenav top-60"> <div class="gn-scroller"> <ul class="gn-menu"> <div class="link-group link-group-no-heading"> <li> <a href="my-profile.html"> <i class="fa fa-user nav-icon"></i> My Profile </a> </li> <li> <a href="sport-friends.html"> <i class="fa fa-thumbs-up nav-icon"></i> Sport Friends </a> </li> <li> <a href="my-posts.html"> <i class="fa fa-list-alt nav-icon"></i> Sport Posts </a> </li> <li> <a href="sport-matches.html"> <i class="fa fa-meetup nav-icon"></i> Sport Matches </a> </li> <li> <a href="sport-places.html"> <i class="fa fa-map-marker nav-icon"></i> Sport Places </a> </li> <li> <a href="sport-coaches.html"> <i class="fa fa-crosshairs nav-icon"></i> Sport Coach </a> </li> <li> <a href="sport-friend-requests.html"> <i class="fa fa-users nav-icon"></i> Invite Requests(XX) </a> </li> <li> <a href="calendar.html"> <i class="fa fa-calendar nav-icon"></i> Sport Calendar </a> </li> <li> <a href="sport-events.html"> <i class="fa fa-calendar nav-icon"></i> My Sport Events </a> </li> <div class="link-group link-group-with-heading text-primary"> <span class="link-heading toggle-pages"><i class="fa fa-flag nav-icon"></i> MY PAGES </span> <div class="no-show pages-list"> <li><a href="all-pages.html" class="pl-5">Page 1</a></li> <li><a href="all-pages.html" class="pl-5">Page 2</a></li> <li><a href="all-pages.html" class="pl-5">Page 3</a></li> </div> </div> <div class="link-group link-group-with-heading text-primary"> <span class="link-heading toggle-groups"><i class="fa fa-users nav-icon"></i> MY GROUPS </span> <div class="no-show groups-list"> <li><a href="all-groups.html" class="pl-5">Group 1</a></li> <li><a href="all-groups.html" class="pl-5">Group 2</a></li> <li><a href="all-groups.html" class="pl-5">Group 3</a></li> </div> </div> <div class="link-group link-group-with-heading"> <span class="link-heading pl-4"> CREATE </span> <li><a href="create-page.html"><i class="fa fa-flag nav-icon"></i>Page</a></li> <li><a href="create-group.html"><i class="fa fa-users nav-icon"></i>Group</a></li> <li><a href="#"><i class="fa fa-calendar nav-icon"></i>Event</a></li> <li><a href="#"><i class="fa fa-tag nav-icon"></i>Pricing</a></li> </div> <div class="link-group link-group-with-heading px-0"> <span class="link-heading pl-4"> ACCOUNT SETTINGS </span> <li> <a href="profile-setting.html"> <i class="fa fa-cogs nav-icon"></i> Settings </a> </li> <li> <a href="index-3.html"> <i class="fa fa-unlock-alt nav-icon"></i> Login & Password </a> </li> <li> <a href="index.html"> <i class="fa fa-sign-out nav-icon"></i> Sign Out </a> </li> </div> </div> <br><br><br><br><br> </ul> </div><!-- /gn-scroller --> </div>';
        // var sideNavHTML  = '<div id="demo"  class="sidenav"> <div class="gn-scroller"> <ul class="gn-menu"> <div class="link-group link-group-no-heading"> <li><a href="my-sports.html"><i class="fas fa-futbol nav-icon"></i>My sports</a></li> <li><a href="home.html"><i class="fas fa-rss nav-icon"></i>Timeline</a></li> <li><a href="my-profile.html"><i class="fas fa-user-circle nav-icon"></i>About</a></li> <li><a href="friends.html"><i class="fa fa-thumbs-up nav-icon"></i>Sport Friends</a></li> <li><a href="my-groups.html"><i class="fas fa-users nav-icon"></i>Sport groups</a></li> <li><a href="sport-instructors.html"><i class="fas fa-user nav-icon"></i>My sport instructors</a></li> <li><a href="sport-places.html"><i class="fas fa-tags nav-icon"></i>My sport stores</a></li> <li><a href="my-photos.html"><i class="fas fa-images nav-icon"></i>My sport photos</a></li> <li><a href="my-videos.html"><i class="fas fa-play-circle nav-icon"></i>My sport videos</a></li> <li><a href="sport-pages.html"><i class="fas fa-flag nav-icon"></i>My pages</a></li> <li><a href="sport-matches-results.html"><i class="fas fa-list nav-icon"></i>My sport results</a></li> </div> <div class="link-group link-group-with-heading"><span class="link-heading"> ONLY VISIBLE TO YOU </span> <li><a href="my-sports.html"><i class="fas fa-chart-line nav-icon"></i>Active sports</a></li> <li><a href="friends-requests.html"><i class="fas fas fa-user-plus nav-icon"></i>Sport friend requests</a></li> <li><a href="my-messages.html"><i class="fas fa-comments nav-icon"></i>Messages</a></li> <li><a href="sport-matches.html"><i class="fas fa-football-ball nav-icon"></i>Sport skill matches</a></li> <li><a href="sport-matches-results.html"><i class="fas fa-user-plus nav-icon"></i>Sport match requests</a></li> <li><a href="my-calendar.html"><i class="fas fa-calendar-alt nav-icon"></i>Sport calendar</a></li> </div> <div class="link-group link-group-with-heading"><span class="link-heading"> CREATE </span> <li><a href="create-page.html"><i class="fas fa-flag nav-icon"></i>Page</a></li> <li><a href="create-group.html"><i class="fas fa-users nav-icon"></i>Group</a></li> <li><a href="create-event.html"><i class="fas fa-calendar nav-icon"></i>Event</a></li> </div> <div class="link-group link-group-with-heading"><span class="link-heading"> MY PAGES </span><li><a href="pricing.html"><i class="fas fa-tags nav-icon"></i>Pricing</a></li>' ;
        //    $.each(param.data.pages, function (key, value){
        //        sideNavHTML +=' <li><a href="javascript:void(0);" onclick="page('+ value.id +');"><i class="fas fa-flag nav-icon"></i>'+ value.name  +'</a></li>';
        //    });
        //     sideNavHTML += ' </div> <div class="link-group link-group-with-heading"><span class="link-heading"> MY GROUPS </span>' ;
        //     $.each(param.data.groups, function (key, value){
        //         sideNavHTML += '<li><a href="javascript:void(0)" onclick="group('+ value.id +');"><i class="fas fa-users nav-icon"></i>'+ value.name +'</a></li>';
        //     });
        //     sideNavHTML +=   '</div> <div class="link-group link-group-with-heading"><span class="link-heading"> ACCOUNT SETTINGS </span> <li><a href="profile-setting.html"><i class="fas fa-cogs nav-icon"></i>Settings</a></li> <li><a href="index-3.html"><i class="fas fa-unlock-alt nav-icon"></i>Login & Password</a></li> <li><a href="index.html"><i class="fas fa-sign-out-alt nav-icon"></i>Sign Out</a></li> </div> <br><br><br><br><br> </ul> </div><!-- /gn-scroller --> </div>';

        $("#side-nav").html(sideNavHTML);
        // console.log(sideNavHTML+ 'this');
    }
}


function bottomNav() {
    var parameters = "";
    var url =
        app_url +
        "user-statistics?loginuser=" +
        window.localStorage.getItem("loginuser");
    var method = "GET";
    var param = CallMethod(method, url, onSuccessTopBarStatistics, parameters);
    function onSuccessTopBarStatistics(param) {
        var bottomNavHTML = "";

        bottomNavHTML =
            '<div class="sub-header bottom-0"> <div class="row nmarg ss-bottom-nav" > ' +
            '<div class="d-flex npad text-center"> <span class="sub-header-icon w-100"> <a href="my-posts.html"> <img src="./images/svg000-home.svg" /> </a> </span> </div> ' +
            '<div class="d-flex npad text-center"> <span class="sub-header-icon w-100"> <a href="sport-friends.html"> <img src="./images/svg000-friends.svg" /> </a> </span> </div> ' +
            '<div class="d-flex npad text-center"> <span class="sub-header-icon w-100"> <a href="sport-friend-requests.html"> <img src="./images/svg000-connect.svg" /> </a> </span> </div> ' +
            '<div class="d-flex npad text-center"> <span class="sub-header-icon w-100"> <a href="sport-messages-list.html"> <img src="./images/svg000-message.svg" /> </a> <span class="counter"  >' +
            (!isEmpty(param.data) ? param.data.getMessageCount : 0) +
            '</span> </span> </div> <div class="d-flex npad text-center"> <span class="sub-header-icon w-100"> <a href="calendar.html"> <img src="./images/svg000-calendar.svg" /> </a> <span class="counter" >0</span> </span> </div> </div> </div>';
        // alert(bottomNavHTML);
        $("#bottom-nav").html(bottomNavHTML);
        // console.log(sideNavHTML+ 'this');
    }
}

function timelineProfilePhohtos(){
         var  timelineProfilePhohtosHTML = '<div class="timeline-profile-photos bg-white"> <div class="row nmarg"> <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 npad text-center"> <div class="timeline-bg-photo" id="timeline-img"> <img src="'+window.localStorage.getItem("profileImage")+'" class="bg-img" alt="Photo" > </div> <div class="timeline-user-photo"> <div class="media"> <a class="pull-left" href="#"> <span id="profile-img"><img class="media-object user-img" src="'+window.localStorage.getItem("profileImage")+'" alt="Photo"></span> </a> <div class="media-body"> <p class="user-profile-name text-left"><a href="#" class="bold-text white-text" id="user-profile-name"> '+window.localStorage.getItem("firstname")+'  '+window.localStorage.getItem("lastname")+'</a></p> </div> </div> </div> </div> </div> </div>';

         $('#timeline-profile-photos').html(timelineProfilePhohtosHTML);
}

$('document').ready(function (){

    sideNav();
    bottomNav();
    timelineProfilePhohtos();

});
function showMessage(message = 'Please Check Your Internet Connection', bg_color = 'white', forground = 'black', delay = 1000) {
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h6>" + message + "</h6></div>")
        .css({
            display: "block",
            opacity: 0.90,
            position: "fixed",
            padding: "15px 7px 7px 7px",
            "text-align": "center",
            width: "270px",
            backgroundColor: bg_color,
            color: forground,
            left: ($(window).width() - 284) / 2, //($(window).width() - 284) / 2
            top: ($(window).height() / 2) + ($(window).height() / 3) //
        })
        .appendTo('body').delay(delay)
        .fadeOut(200, function() {
            $(this).remove();
        });
}


function showAlertMessage(type = 'success', content) {

    if (type === 'success') {
        alertify.success(content);
    } else if (type === 'error') {
        alertify.error(content).delay(15);
    }
}

$(document).ajaxStart(function () {
    $('body').append(`<div class="bg-loading data-loader-on-data-load">Loading&#8230;</div>`);
    // $('.data-loader-on-data-load').click(function() {
    //     $('.data-loader-on-data-load').remove();
    // });
})
    .ajaxStop(function () {
        setTimeout(function () {
            $('.data-loader-on-data-load').remove();
        }, 1000);
    });


function otherProfile(username, user_id){

    window.localStorage.setItem('user_id', user_id);
    if(!isEmpty(username)){
        window.localStorage.setItem('username', username);
    }else{
        window.localStorage.setItem('username', "username");
    }

    window.location.href = 'user-profile.html';

}

function logout() {
    localStorage.clear();
    var parameters = '';
    var url = app_url+'logout?';

    var method = 'get';
    var param = CallMethod(method, url, onSuccessLogout, parameters);

    function onSuccessLogout(param) {

        if(param.data.message_status == true){

            localStorage.clear();
            window.location.href = 'login.html';
        }

    }
}




//

