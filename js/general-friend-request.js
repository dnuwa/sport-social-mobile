

function acceptReq(user_id, list_id, key){


    var data = '&userid='+ user_id + '&listid=' + list_id +'&can=2';
    var parameters = '';
    var url        = app_url+'sendRequest?loginuser='+ window.localStorage.getItem("loginuser")+ data;
    var method     = 'GET';
    var param      = CallMethod(method, url, onSuccessNewFriends, parameters);
    function onSuccessNewFriends(param){
        if(param.data.status == true){
            $("#req-"+key).hide();
            showAlertMessage(type = 'success', "Friend request accepted");

        }else{
            showAlertMessage(type = 'success', "Erorr 404");


        }


    }
}
function canceleReq(user_id, list_id, key){

    alertify.confirm("You want to unfriend?",function(e){
        if(e) {
            var data = '&userid='+ user_id + '&listid=' + list_id +'&can=1';
            var parameters = '';
            var url        = app_url+'sendRequest?loginuser='+ window.localStorage.getItem("loginuser")+ data;
            var method     = 'GET';
            var param      = CallMethod(method, url, onSuccessNewFriends, parameters);
            function onSuccessNewFriends(param){
                if(param.data.status == true){
                    $("#req-"+key).hide();

                    showAlertMessage(type = 'error', "Unfriend Successfully");

                }else{
                    showAlertMessage(type = 'error', "There's an error ");

                }


            }
            return true;
        } else {
            return false;
        }

    }).set({title: "Alert message"});






}
function sureCancelReq( user_id ,firstname = '' , lastname = '', list_id, key){







    alertify.confirm(firstname+ '  ' + lastname ,function(e){
        if(e) {
            var data = '&userid='+ user_id + '&listid=' + list_id +'&can=1';
            var parameters = '';
            var url        = app_url+'sendRequest?loginuser='+ window.localStorage.getItem("loginuser")+ data;
            var method     = 'GET';
            var param      = CallMethod(method, url, onSuccessNewFriends, parameters);
            function onSuccessNewFriends(param){
                if(param.data.status == true){
                    $("#req-"+key).hide();

                    showAlertMessage(type = 'error', "Unfriend Successfully");

                }else{
                    showAlertMessage(type = 'error', "There's an error ");

                }


            }
            return true;
        } else {
            return false;
        }

    }).set({title: "Confirm Unfriend"});






}
function sendReq(user_id, key){


    var data = '&userid='+ user_id +'&can=0';
    var parameters = '';
    var url        = app_url+'sendRequest?loginuser='+ window.localStorage.getItem("loginuser")+ data;
    var method     = 'GET';
    var param      = CallMethod(method, url, onSuccessNewFriends, parameters);
    function onSuccessNewFriends(param){
        if(param.data.status == true){
            $("#req-"+key).hide();
            showAlertMessage(type = 'success', "Friend request sent");
            // $("#message-req").html('<div class="alert alert-success alert-dismissible"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><ul><li>Friend request sent</li></ul></div>');

        }else{
            showAlertMessage(type = 'success', "Server error");
            // $("#message-req").html('<div class="alert alert-danger alert-dismissible"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><ul><li></li></ul></div>');

        }


    }
}
