function getCountry(){

    var parameters = '';
    var url        = app_url+'country-list?';
    var method     = 'GET';
    var param      = CallMethod(method, url, onSuccessLogin, parameters);
    function onSuccessLogin(param){
        var countryOption  = '<option value="">Select Country</option>';
        $.each(param.data.countries, function (key, value){
            countryOption += '<option value="'+ value.id +'">'+ value.name +'</option>';
        });

        $('#country').html(countryOption);
        $('#country2').html(countryOption);


    }
}
function getState(stateID, countryID){


    var country_id  =   $('#'+countryID).val();
    var parameters = '';
    var url        = app_url+'get-state-city?country_id='+country_id;
    var method     = 'GET';
    var param      = CallMethod(method, url, onSuccessLogin, parameters);
    function onSuccessLogin(param){
        var stateOption  = '<option value="">Select an option</option>';
        $.each(param.data.state, function (key, value){
            stateOption += '<option value="'+ value.id +'">'+ value.name +'</option>';
        });
        $('#'+stateID).html(stateOption);




    }
}
function getStateCity(stateID, countryID, cityID){

    var country_id  =   $('#'+countryID).val();
    var parameters = '';
    var url        = app_url+'get-state-city?country_id='+country_id;
    var method     = 'GET';
    var param      = CallMethod(method, url, onSuccessLogin, parameters);
    function onSuccessLogin(param){
        // alert('here');
        var stateOption  = '<option value="">Select an option</option>';
        var cityOption  = '<option value="">Select an option</option>';
        $.each(param.data.state, function (key, value){
            stateOption += '<option value="'+ value.id +'">'+ value.name +'</option>';
            $.each(value.cities, function (key, value){

                cityOption += '<option value="'+ value.id +'">'+ value.name +'</option>';
            })
        });
        // alert(stateOption);
        $('#'+stateID).html(stateOption);
        $('#'+cityID).html(cityOption);




    }
}

function getCity(cityID, stateID){

    var state_id  =   $('#'+stateID).val();
    var parameters = '';
    var url        = app_url+'get-city?state_id='+state_id;
    var method     = 'GET';
    var param      = CallMethod(method, url, onSuccessLogin, parameters);
    function onSuccessLogin(param){
        var cityOption  = '<option value="">Select an option</option>';
        $.each(param.data.cities, function (key, value){
            cityOption += '<option value="'+ value.id +'">'+ value.name +'</option>';
        });

        $('#'+cityID).html(cityOption);




    }
}
