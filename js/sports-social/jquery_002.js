/*
 *	jQuery FullCalendar Extendable Plugin
 *	An Ajax (PHP - Mysql - jquery) script that extends the functionalities of the fullcalendar plugin
 *  Dependencies:
 *   - jquery
 *   - jquery Ui
 * 	 - jquery spectrum (since 2.0)
 *   - jquery timepicker (since 1.6.4)
 *   - jquery Fullcalendar
 *   - Twitter Bootstrap
 *  Author: Paulo Regina
 *  Website: www.pauloreg.com
 *  Contributions: Patrik Iden, Jan-Paul Kleemans, Bob Mulder
 *	Version 3.0, February - 2017
 *          3.1.2, February - 2018
 *          3.1.5, September - 2018
 *          3.1.5.2, January - 2019
 *          3.2, September - 2019
 *  Fullcalendar 3.2.0
 *	Released Under Envato Regular or Extended Licenses
 */
let longPressDelay = 150;
let selectLongPressDelay = 150;
function refreshCalendar() {
    try {disableSlots = [];} catch (error) {}
    $('#calendar').fullCalendar("refetchEvents");
}

function updateCalendar(e = null, is_confirm = false) {
    $('#meeting-updating-note').html('');
    $('#meeting-updating-note').val('');
    if (e !== null) {
        $('#g_startDate').val(moment(e.start).format("YYYY-MM-DD"));
        $('#g_startTime').val(moment(e.start).format("HH:mm"));
        $('#g_endDate').val(moment(e.end).format("YYYY-MM-DD"));
        $('#g_endTime').val(moment(e.end).format("HH:mm"));
        $('#g_is_valid').val(moment(e.end).isValid());
        $('#g_id').val(e.id);
    }
    $.ajax({
        url: app_url + 'meeting/event/get/detail',
        method: 'get',
        data: {
            'id': $('#g_id').val(),
            'customer': window.localStorage.getItem("calendar_user_id"),
            'Authorization': window.localStorage.getItem("token"),
        },
        success: function(result) {
            let type = result.type;

            //Just remove this line from if condition (result.meeting_with == window.localStorage.getItem("loginuser") || )
            if (result.userid == window.localStorage.getItem("loginuser")) {
                if (is_confirm || type != '0') {
                    $.ajax({
                        url: app_url + 'meeting/event/update' + '?customer=' + window.localStorage.getItem("calendar_user_id") + '&Authorization=' + window.localStorage.getItem("token"),
                        method: 'post',
                        dataType: 'JSON',
                        data: {
                            'id': $('#g_id').val(),
                            'startDate': $('#g_startDate').val(),
                            'startTime': $('#g_startTime').val(),
                            'endDate': $('#g_endDate').val(),
                            'endTime': $('#g_endTime').val(),
                            'user_id': $('#meeting_with').val(),
                            'message': $('#meeting-updating-note').val(),
                            'customer': window.localStorage.getItem("calendar_user_id"),
                            'Authorization': window.localStorage.getItem("token"),
                        },
                        success: function(result) {
                            refreshCalendar();
                            if (result.state === 'success') {
                                showAlert('success', 'Successfully Updated');
                            } else if (result.state === 'error') {
                                showAlert('error', result.message);
                            }
                            $('#meeting-updating-note').html('');
                            $('#meeting-updating-note').val('');
                            $('.before_update_meeting_get_message_model-cancel-btn').click();
                        },
                        error: function(data) {
                            refreshCalendar();
                        }
                    });
                } else {
                    $('.before_update_meeting_get_message_model-btn').click();
                }
            } else {
                refreshCalendar();
            }
        }
    });
}

! function(y, g) {
    y.fn.extend({
        FullCalendarExt: function(e) {
            let __calendarModal = '#calendarModal';
            // if(!isEmpty(window.localStorage.getItem('meeting_type')) && window.localStorage.getItem('meeting_type') == 'suggest_meeting'){
            //     __calendarModal = '#calendarModal-1';
            // }
            var view = $('#calendar').fullCalendar('getView');
            let disableSlots = [];
            var t = "token=" + y("#cal_token").val() + '&customer=' + window.localStorage.getItem("calendar_user_id") + '&Authorization=' + window.localStorage.getItem("token") + '&login_user_id=' + window.localStorage.getItem("loginuser") + '&request_meeting_type=' + window.localStorage.getItem("meeting_request_meeting_type"),
                a = {
                    calendarSelector: "#calendar",
                    loadingSelector: "#loading",
                    lang: "en",
                    token: "",
                    ajaxJsonFetch: app_url + "meeting/cal_events?eid=" + window.localStorage.getItem('event_id') + "&" + t + '&view_type=' + view.title,
                    ajaxUiUpdate: app_url + "includes/cal_update.php?" + t,
                    ajaxEventQuickSave: app_url + "includes/cal_quicksave.php?" + t,
                    ajaxEventDelete: app_url + "meeting/del_events?" + t,
                    ajaxEventEdit: app_url + "includes/cal_edit_update.php?" + t,
                    ajaxEventExport: app_url + "meetingk/cal_export?" + t,
                    ajaxRepeatCheck: app_url + "meeting/del_events?" + t,
                    ajaxAcceptEvent: app_url + "meeting/accept_events?" + t,
                    ajaxRetrieveDescription: app_url + "meeting/cal_description?" + t,
                    ajaxImport: app_url + "importer.php?" + t,
                    jsonConfig: app_url + "includes/form.json",
                    modalSelector: __calendarModal,
                    modalPromptSelector: "#cal_prompt",
                    modalEditPromptSelector: "#cal_edit_prompt_save",
                    formAddEventSelector: "form#add_event",
                    formFilterSelector: "form#filter-category select",
                    formSearchSelector: "form#search",
                    newEventText: "Add New Event",
                    successAddEventMessage: "Successfully Added Event",
                    successDeleteEventMessage: "Successfully Deleted Event",
                    successUpdateEventMessage: "Successfully Updated Event",
                    failureAddEventMessage: "Failed To Add Event",
                    failureDeleteEventMessage: "Failed To Delete Event",
                    failureUpdateEventMessage: "Failed To Update Event",
                    generalFailureMessage: "Failed To Execute Action",
                    ajaxError: "Failed to load content",
                    emptyForm: "Form cannot be empty",
                    unableToOpenEvent: "Something went wrong. Unable to open event",
                    eventText: "Event: ",
                    repetitiveEventActionText: "This is a repetitive event, what do you want to do?",
                    isRTL: !1,
                    weekNumberTitle: "W",
                    defaultColor: "#587ca3",
                    yearType: "agendaYear",
                    weekType: "agendaWeek",
                    dayType: "agendaDay",
                    listType: "listYear",
                    editable: !0,
                    ignoreTimezone: !0,
                    lazyFetching: !0,
                    filter: !0,
                    quickSave: !0,
                    navLinks: !0,
                    firstDay: 0,
                    gcal: !1,
                    gcalUrlText: "View on Google",
                    version: "modal",
                    defaultView: "year",
                    aspectRatio: 0.0,
                    weekends: !0,
                    weekNumbers: !1,
                    weekNumberCalculation: "iso",
                    hiddenDays: [],
                    theme: !1,
                    themePrev: "circle-triangle-w",
                    themeNext: "circle-triangle-e",
                    themeToday: "circle-triangle-e",
                    titleFormatMonth: "",
                    titleFormatYear: "",
                    titleFormatWeek: "",
                    titleFormatDay: "",
                    columnFormatMonth: "",
                    columnFormatYear: "",
                    columnFormatWeek: "",
                    columnFormatDay: "",
                    timeFormat: "H:mm",
                    weekMode: !0,
                    allDaySlot: !0,
                    allDayText: "all-day",
                    axisFormat: "h(:mm)a",
                    slotDuration: "00:30:00",
                    // minTime: "06:00:00",
                    // maxTime: "30:00:00",
                    minTime: "00:00:00",
                    maxTime: "24:00:00",
                    nextDayThreshold: "06:00:00",
                    slotEventOverlap: !0,
                    enableDrop: !0,
                    enableResize: !0,
                    savedRedirect: "index.php",
                    removedRedirect: "index.php",
                    updatedRedirect: "index.php",
                    ajaxLoaderMarkup: '<div class="loadingDiv"></div>',
                    prev: "left-single-arrow",
                    next: "right-single-arrow",
                    today: "right-single-arrow",
                    prevYear: "left-double-arrow",
                    nextYear: "right-double-arrow",
                    otherSource: !1,
                    modalFormBody: y("#modal-form-body").html(),
                    icons_title: !1,
                    fc_extend: {},
                    eventLimit: !0,
                    eventLimitClick: "popover",
                    palette: [
                        ["#0b57a4", "#8bbdeb", "#000000", "#2a82d7", "#148aa5", "#3714a4", "#587ca3", "#a50516"],
                        ["#fb3c8f", "#1b4f15", "#1b4f15", "#686868", "#3aa03a", "#ff0080", "#fee233", "#fc1cad"],
                        ["#7f2b14", "#000066", "#2b4726", "#fd7222", "#fc331c", "#af31f2", "#fc0d1b", "#2b8a6d"],
                        ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"]
                    ]
                },
                c = y.extend(a, e);
            1 == c.gcal && (c.weekType = "", c.dayType = "");
            var r = {},
                o = {
                    locale: c.lang,
                    editable: c.editable,
                    eventLimit: c.eventLimit,
                    eventLimitClick: c.eventLimitClick,
                    navLinks: c.navLinks,
                    defaultView: c.defaultView,
                    aspectRatio: c.aspectRatio,
                    weekends: c.weekends,
                    weekNumbers: c.weekNumbers,
                    weekNumberCalculation: c.weekNumberCalculation,
                    weekNumberTitle: c.weekNumberTitle,
                    views: {
                        year: {
                            titleFormat: c.titleFormatYear,
                            columnFormat: c.columnFormatYear
                        },
                        month: {
                            titleFormat: c.titleFormatMonth,
                            columnFormat: c.columnFormatMonth
                        },
                        week: {
                            titleFormat: c.titleFormatWeek,
                            columnFormat: c.columnFormatWeek
                        },
                        day: {
                            titleFormat: c.titleFormatDay,
                            columnFormat: c.columnFormatDay
                        },
                    },
                    isRTL: c.isRTL,
                    hiddenDays: c.hiddenDays,
                    theme: c.theme,
                    buttonIcons: {
                        prev: c.prev,
                        next: c.next,
                        prevYear: c.prevYear,
                        nextYear: c.nextYear
                    },
                    themeButtonIcons: {
                        prev: c.themePrev,
                        next: c.themeNext,
                        today: c.themeToday
                    },
                    allDaySlot: c.allDaySlot,
                    allDayText: c.allDayText,
                    slotLabelFormat: c.axisFormat,
                    slotDuration: c.slotDuration,
                    minTime: c.minTime,
                    maxTime: c.maxTime,
                    slotEventOverlap: c.slotEventOverlap,
                    fixedWeekCount: c.weekMode,
                    timeFormat: c.timeFormat,
                    header: {
                        left: "prevYear" + ',' + 'prev,today,next' + ',' + 'nextYear',
                        center: "title",
                        right: "month," + c.weekType + "," + c.dayType + "," + c.listType
                    },
                    monthNames: c.monthNames,
                    monthNamesShort: c.monthNamesShort,
                    dayNames: c.dayNames,
                    dayNamesShort: c.dayNamesShort,
                    buttonText: {
                        year: c.year,
                        month: c.month,
                        week: c.week,
                        day: c.day,
                        today: "Today",
                        // prevYear: parseInt(new Date().getFullYear(), 10) - 1,
                        // nextYear: parseInt(new Date().getFullYear(), 10) + 1
                    },
                    ignoreTimezone: c.ignoreTimezone,
                    firstDay: c.firstDay,
                    lazyFetching: c.lazyFetching,
                    selectable: c.quickSave,
                    selectHelper: c.quickSave,
                    eventStartEditable: c.enableDrop,
                    eventDurationEditable: c.enableResize,
                    nextDayThreshold: c.nextDayThreshold,
                    loading: function(e) {
                        0 == e ? y(c.loadingSelector).hide() : 1 == e && y(c.loadingSelector).show()
                    },
                    select: function(e, t, a, o) {
                        let target = $(a.target);
                        let isSelectGreenEvent = target.hasClass('availiable-time');
                        if(isSelectGreenEvent){
                            confirmPopUp(e,t);
                        }else{
                            let start = moment(e).format("HH:mm:ss");
                            let end = moment(t).format("HH:mm:ss");
                            if(!isEmpty(disableSlots) && ($.inArray(start, disableSlots) > -1 || $.inArray(end, disableSlots) > -1)){
                                showMessage('You cannot create event on this time.','#b40d17','#fff');
                                $('.fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end.fc-draggable.fc-resizable.fc-helper').hide();
                            }else{
                                calendar.view = o.name, "modal" == c.version && (calendar.quickModal(e, t, a), y(c.calendarSelector).fullCalendar("unselect")), "month" !== o.name && moment(e._d).format("HH:mm") !== moment(t._d).format("HH:mm") && (y('#event-type option[value="false"]').prop("selected", !0), y("#event-type-select").show()
                                // , y("#event-type-selected").show()
                                );
                                if(!isEmpty(disableSlots) && disableSlots.length > 0){
                                    $('.hide-only-for-disable-slots').hide();
                                    $('#calendarModal .modal-body').attr("style", 'min-height: 60vh !important;');
                                }
                            }
                        }
                    },
                    eventSources: [c.otherSource, {
                        url: c.ajaxJsonFetch
                    }],
                    eventDrop: function(e) {
                        if(e.type != -1){
                            updateCalendar(e);
                        }else{
                            refreshCalendar();
                        }
                    },
                    eventResize: function(e) {
                        if(e.type != -1){
                            updateCalendar(e);
                        }else{
                            refreshCalendar();
                        }
                    },
                    editable:true,
                    longPressDelay:longPressDelay,
                    selectLongPressDelay:selectLongPressDelay,
                    eventAllow:true,
                    eventDataTransform: function(eventData){
                        return eventData;
                    },
                    viewRender: function(view) {
                        var d = $('#calendar').fullCalendar('getDate');
                        let calendar_header_toolbar_date = $('#calendar .fc-toolbar.fc-header-toolbar div.fc-center>h2');
                        let default_date = d.format('dddd MMMM DD, YYYY');
                        $('#calendarHeader p').html(default_date);
                        $('#calendar .fc-toolbar.fc-header-toolbar div.fc-center').html(`<p class="m-0 mt-1 calendar_header_title">Tap on your Availability to set your availability or set time blocked.</p>`);
                        $('#calendar .fc-toolbar.fc-header-toolbar div.fc-center').show();
                        if(view.name != 'agendaDay'){
                            $('#calendar .fc-toolbar.fc-header-toolbar div.fc-center').hide();
                        }
                        if(view.name == 'agendaDay'){
                            $('#calendar th.fc-day-header.fc-widget-header').html('<p class="text-center m-0 ">Your Appointment</p>');
                        }
                        if(view.name == 'listYear'){
                            setTimeout(function(){
                                $('.calendar-extend').hide();
                            },1000);
                        }else{
                            $('.calendar-extend').show();
                        }
                    },
                    eventAfterAllRender : function( view ) {
                        startLoaders();
                        try {disableSlots = [];} catch (error) {}
                        // if(!isEmpty(window.localStorage.getItem("event_id")) || !isEmpty(window.localStorage.getItem('meeting_type'))){
                            var parameters = '';
                            var _url = app_url + 'getEventDetailWithCustomers?current_login_user_id=' + window.localStorage.getItem("loginuser") + '&calendar_user_id=' + window.localStorage.getItem("calendar_user_id") + '&event_id=' + window.localStorage.getItem("event_id");
                            var _method = 'GET';
                            var response = CallMethod(_method, _url, onSuccess, parameters,true,true,true);

                            function onSuccess(response) {
                                if (typeof response.data != 'undefined' && response.data.login_error_status === '1') {
                                    showExpireAlert('session-expire');
                                    session(response.data);
                                } else {
                                    if
                                    (
                                        response.success 
                                        && view.name == 'agendaDay'
                                    ){
                                        let current_date = $('.fc-row.fc-week.fc-widget-content .fc-day.fc-widget-content').attr('data-date');
                                        let event_name = !isEmpty(response.data.event_detail) ?  response.data.event_detail.title : '';
                                        let event_click_function = !isEmpty(response.data.event_detail) 
                                                                    ? `onclick="eventsdetailshow('`+response.data.event_detail.id+`')"`
                                                                        : '';
                                        $('.fc-row.fc-week.fc-widget-content .fc-day.fc-widget-content').html('Your Meeting');
                                        $('#calendar .fc-day-grid.fc-unselectable .fc-content-skeleton tr').html(`
                                            <td class="fc-axis" style="width:48px"></td>
                                            <td class="event-name-css" `+event_click_function+`>
                                                ` + event_name + `
                                            </td>
                                        `);
                                        $('.fc-row.fc-week.fc-widget-content .fc-day.fc-widget-content').addClass('text-center your-meeting m-0 p-0');
                                        if($('.availible-slote-title').length === 0){
                                            $('.fc-row.fc-week.fc-widget-content .fc-axis.fc-widget-content').parent().append('<td class="time-slot-1 slot-header-1 availible-slote-title" >Your Availibility</td>'); 
                                        }
                                        let time_slots = $('.fc-slats>table>tbody').find('tr');
                                        let currentUserEventStartDate = !isEmpty(response.data.currentUserEventJoinDetail) ? (response.data.currentUserEventJoinDetail.sdate + ' ' + (!isEmpty(response.data.currentUserEventJoinDetail.stime) ? response.data.currentUserEventJoinDetail.stime : '00:00:00')) : null;
                                        let currentUserEventEndDate = !isEmpty(response.data.currentUserEventJoinDetail) ?  (response.data.currentUserEventJoinDetail.edate + ' ' + (!isEmpty(response.data.currentUserEventJoinDetail.etime) ? response.data.currentUserEventJoinDetail.etime : '00:00:00')) : null;
                                        
                                        let date_time_iteration_index = 0;
                                        let date_time_iteration_index_empty_slot = 0;

                                        for (let index = 0; index < time_slots.length; index++) {
                                            let date_time = time_slots[index].dataset.time;
                                            let date_time_object = time_slots[index];

                                            let current_date_without_time_start = moment(moment(current_date).format('YYYY-MM-DD') + ' ' + "00:00:00");
                                            let current_date_without_time_end = moment(moment(current_date).format('YYYY-MM-DD') + ' ' + "23:59:59");
                                        
                                            current_date = moment(current_date).format('YYYY-MM-DD') + ' ' + date_time;
                                            current_date = moment(current_date);

                                            //disable fields if it is not of event range
                                            if(!isEmpty(window.localStorage.getItem("event_id"))  && !current_date.isBetween(currentUserEventStartDate, currentUserEventEndDate)){
                                                let slots = $(date_time_object).find(".fc-widget-content");
                                                slots.css('background-color','#b40d17');
                                                slots.css('color','#fff');
                                                slots.click(function(event){
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    showMessage('You cannot create event on this time.','#b40d17','#fff');
                                                    return false;
                                                });
                                                disableSlots.push(date_time);
                                            }

                                            // Comapring Time
                                            if(!isEmpty(response.data.currentUserEventJoinDetail) && current_date.isBetween(currentUserEventStartDate, currentUserEventEndDate)){
                                                if ($(".time-slot-1-"+date_time_iteration_index).length == 0) {
                                                    $(date_time_object).append("<td class='time-slot-1 availiable-time time-slot-text time-slot-1-"+date_time_iteration_index+"'></td>");
                                                    if(!isEmpty(window.localStorage.getItem("event_id"))){
                                                        /**
                                                         * Click Listener 
                                                         */
                                                        $('.time-slot-1-'+date_time_iteration_index).click(function(event){
                                                            updateAvailibilityPopUp(window.localStorage.getItem("calendar_user_id"),window.localStorage.getItem("event_id"));
                                                        });
                                                    }
                                                }
                                                date_time_iteration_index++;
                                            }else if(isEmpty(window.localStorage.getItem("event_id")) && isEmpty(window.localStorage.getItem('meeting_type'))){
                                                if ($(".time-slot-1-"+date_time_iteration_index).length == 0) {
                                                    $(date_time_object).append("<td class='time-slot-1 availiable-time time-slot-text time-slot-1-"+date_time_iteration_index+"'></td>");
                                                }
                                                date_time_iteration_index++;
                                            }else{
                                                if ($(".empty-time-slots-1-"+date_time_iteration_index_empty_slot).length == 0 && (moment(currentUserEventStartDate).isBetween(current_date_without_time_start, current_date_without_time_end) || moment(currentUserEventEndDate).isBetween(current_date_without_time_start, current_date_without_time_end) || current_date_without_time_start.isBetween(currentUserEventStartDate, currentUserEventEndDate) || current_date_without_time_end.isBetween(currentUserEventStartDate, currentUserEventEndDate))) {
                                                    $(date_time_object).append("<td class='empty-time-slots empty-time-slots-1-"+date_time_iteration_index_empty_slot+"'></td>");
                                                    date_time_iteration_index_empty_slot++;
                                                }
                                            } 
                                            /**********************************************/

                                            $('.fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end.fc-draggable.fc-resizable').removeClass('width-100-percent');
                                        }
                                    }else{
                                            
                                        $('.slot-header-1').hide();
                                        $('.slot-header-2').hide();
                                        $('.fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end.fc-draggable.fc-resizable').addClass('width-100-percent');
                                    }
                                }
                            }
                    },
                    eventRender: function (e, t, a) {
                        if (t.attr("href")) t.attr("data-toggle", "modal"), t.attr("href", "javascript:void(0)"), t.attr("onclick", 'calendar.openModalGcal("' + encodeURI(e.title) + '","' + e.url + '");');
                        else {
                            if (1 == c.icons_title) {
                                var o = t.find(".fc-title").text().replace(/\[(.*?)\]/gi, '<i class="$1"></i>');
                                t.find(".fc-title").html(o)
                            }
                            var n = e.color,
                                l = moment(e.start).format("YYYY-MM-DD"),
                                r = moment(e.start).format("HH:mm"),
                                d = moment(e.end).format("YYYY-MM-DD"),
                                i = moment(e.end).format("HH:mm");
                            if (0 == moment(e.end).isValid()) d = l, i = r;
                            null !== e.end && "month" == a.name && ("H:mm" != c.timeFormat && "h:mm" != c.timeFormat || (timeformat = e.start.format("H:mm") + " - " + e.end.format("H:mm"), t.find(".calendar-extend .fc-extend-time").html(timeformat))), "modal" == c.version && (t.attr("data-toggle", "modal"), t.attr("href", "javascript:void(0)"), t.attr("data-id", e.original_id), t.attr("data-rep_id", e.id), t.attr("data-title", encodeURIComponent(e.title)), t.attr("data-url", encodeURIComponent(e.url)), t.attr("data-eventstart", e.start), t.attr("data-eventend", e.end), t.attr("data-color", n), t.attr("data-d_startdate", l), t.attr("data-d_starttime", r), t.attr("data-d_enddate", d), t.attr("data-d_endtime", i), t.attr("onclick", "calendar.openModal(this)"))
                        }
                        t.attr("style", "background-color: #fff !important;");
                        t.find('.fc-content .fc-time').attr("style", "color: #000 !important;");
                        t.find('.fc-content .fc-title').attr("style", "color: #000 !important;");
                        if (!isEmpty(e) && !isEmpty(e.type) && (e.type == -1 || (e.type == 2 && !isEmpty(window.localStorage.getItem("event_id"))))) {
                            t.attr("onclick", '');
                            t.find(".fc-title").html('Blocked');
                            t.addClass('blocked_meetings');
                            t.find(".fc-time").html('');
                            t.find(".fc-time").attr('data-start', '');
                            t.find(".fc-time").attr('data-full', '');
                            t.find(".fc-time:after").css('display', 'none');
                            t.find(".fc-time-grid-event").attr('disabled', 'disabled');
                            t.attr("data-color", (!isEmpty(e.text_color) ? e.text_color : '#fff'));
                            t.find('.fc-content .fc-title').attr("style", "color: " + (!isEmpty(e.text_color) ? e.text_color : '#fff') + " !important;");
                            t.attr("style", "background-color: #63080d !important;color: #fff !important;");
                            t.addClass('left-51');
                        } else {
                            t.append(`
                                <div class="calendar-extend">
                                    <p class="fc-extend-time m-0 p-0"></p>
                                    <p class="fc-extend-title m-0 p-0"></p>
                                </div>
                            `);
                            t.find('.calendar-extend').attr("style", "background-color: " + e.color + " !important;");
                        }
                        if (!isEmpty(e) && !isEmpty(e.type) && e.type == -1) {
                            t.attr("onclick", `confirmPopUp('` + moment(e.start).format('YYYY-MM-DD HH:mm:ss') + `','` + moment(e.end).format('YYYY-MM-DD HH:mm:ss') + `','` + e.id + `',` + false + `)`);
                        }
                        t.find(".calendar-extend .fc-extend-time").html(moment(e.start).format("H:mm") + " - " + moment(e.end).format("H:mm"));
                        t.find('.calendar-extend .fc-extend-title').html(`<span style="`+ e.text_color +` !important" >`+e.title+`</span>`);
                        y(t.find('.calendar-extend .fc-extend-title')).off().on("click", function (event) {
                            event.preventDefault();
                            network(e.customer_id);
                        });
                        t.find(".fc-title").html(!isEmpty(e.appointment_title) ? e.appointment_title : '');
                        t.find(".fc-time").html('');
                        t.find(".fc-time").attr('data-start', '');
                        t.find(".fc-time").attr('data-full', '');
                        t.find(".fc-time:after").css('display', 'none');
                        t.find(".fc-title").parent().attr("style", "background-color: " + e.color + " !important;");
                        if (!isEmpty(e) && !isEmpty(e.text_color)) {
                            t.find('.fc-title').attr("style", "color: " + e.text_color + " !important;");
                            t.find('.calendar-extend .fc-extend-time').attr("style", "color: " + e.text_color + " !important;");
                            t.find('.calendar-extend .fc-extend-title').attr("style", "color: " + e.text_color + " !important;");
                        }
                        t.addClass('height-min parent-event');
                        t.hover(function(){
                            $(this).addClass("height-max");  //Add the active class to the area is hovered
                        }, function () {
                            $(this).removeClass("height-max");
                        });
                    }
                },
                n = y.extend(o, c.fc_extend);
            y(c.calendarSelector).fullCalendar(n), calendar.openModal = function(e) {
                r.id = y(e).data("id"), r.rep_id = y(e).data("rep_id"), r.title = y(e).data("title"), r.url = y(e).data("url"), r.eventStart = y(e).data("eventstart"), r.eventEnd = y(e).data("eventend"), r.color = y(e).data("color"), r.d_startDate = y(e).data("d_startdate"), r.d_startTime = y(e).data("d_starttime"), r.d_endDate = y(e).data("d_enddate"), r.d_endTime = y(e).data("d_endtime"), 1 == c.icons_title && (r.title = r.title.replace(/\[(.*?)\]/gi, '<i class="$1"></i>')), r.title = decodeURIComponent(r.title), y("#modal-form-body").hide(), y("#details-body").show(), r.ExpS = r.d_startDate + " " + r.d_startTime, r.ExpE = r.d_endDate + " " + r.d_endTime, y.ajax({
                    type: "POST",
                    url: c.ajaxRetrieveDescription,
                    data: {
                        id: r.id,
                        cid: $('#calendar_customer_id').val(),
                        title: encodeURIComponent(r.title),
                        start: r.d_startDate,
                        mode: "edit"
                    },
                    cache: false,
                    beforeSend: function() {
                        y(".loadingDiv").show();
                        //  y(".modal-footer").hide();
                    },
                    error: function() {
                        y(".loadingDiv").hide(), console.log(c.ajaxError)
                    },
                    success: function(e) {
                        let result = JSON.parse(e);
                        $('#delete-event').html('Delete');
                        $('#accept-event').hide();
                        $('#edit-event').hide();
                        $('#delete-event').hide();
                        if (result.meeting.meeting_with == window.localStorage.getItem("loginuser") || result.meeting.userid == window.localStorage.getItem("loginuser")) {
                            if (e) {
                                let parseData = JSON.parse(e);
                                $('#meeting_id').val(parseData.meeting.id);
                                $("#edit-event").show();
                                if(parseData.meeting.type != -1){
                                    if (parseData.meeting.type == 0) {
                                        updateModel(true);
                                        $('#title').val(parseData.meeting.title);
                                        parseData.notification != 'undefined' &&
                                            parseData.notification != null &&
                                            parseData.notification === 1 ?
                                            y('#notification').click() && y('#notification').prop("checked", true) :
                                            '';
                                        y("#notify_number").val(parseData.notify_number);
                                        $('.event-update-btn').show();
                                        $('.event-save-btn').hide();
                                        if (parseInt(window.localStorage.getItem('loginuser')) === parseInt(parseData.userid)) {
                                            $('#delete-event').show();
                                        } else {
                                            $('#delete-event').hide();
                                        }
                                        var t = JSON.parse(e),
                                            a = t.description.replace("$null", ""),
                                            o = t.color.replace("$null", ""),
                                            n = t.category.replace("$null", "");
                                        r.description_editable = t.description_editable.replace("&amp;", "&"), r.description = a.replace("&amp;", "&"), r.category = n.replace("&amp;", "&"), r.color = o, r.data = t;
                                        var l = JSON.parse(JSON.stringify(t));
                                        y("#details-body-title").html(r.title),
                                            function(r, d) {
                                                f(d, ["all-day", "categorie", "categories", "category", "color", "description", "description_editable", "end", "start", "id", "repeat_id", "repeat_type", "title", "url", "user_id"]);
                                                var i = "";
                                                y.getJSON(c.jsonConfig).then(function(e) {
                                                    if (0 < y(".custom-fields").children().length && 0 < Object.keys(d).length)
                                                        for (var t in Object.keys(d).every(function(e) {
                                                                return "" === d[e] || null === d[e]
                                                            }) || (i = "<hr />"), d) {
                                                            var a = d[t],
                                                                o = [];
                                                            "file" == t && (a = a !== g && "undefined" !== a ? '<a target="_blank" href="' + a + '">' + a + "</a>" : "");
                                                            var n = u(e, "<" + t + ">");
                                                            if (0 < a.length || y.isArray(a) && null !== a)
                                                                if (y.isArray(a) && null !== a) {
                                                                    for (var l = 0; l < a.length; l++) o.push(h(e, a[l]));
                                                                    i += "<h5><strong>" + n + "</strong></h5><p>" + o.join(", ") + '</p><p class="custom-field-sep" style="margin-bottom: 0; height: 2px;">&nbsp;</p>'
                                                                } else i += "<h5><strong>" + n + "</strong></h5><p>" + a + '</p><p class="custom-field-sep" style="margin-bottom: 0; height: 2px;">&nbsp;</p>'
                                                        }
                                                    y("#details-body-content").html(r + i)
                                                }).fail(function() {
                                                    y("#details-body-content").html(r)
                                                })
                                            }(a, l), y("#export-event").show(),
                                            $('#event_description_model_popup').click();
    
                                        $('#startDate').val(parseData.meeting.startDate);
                                        $('#meeting-date').html(parseData.meeting.startDate);
                                        $('#startTime').val(parseData.meeting.startTime);
                                        $('#endDate').val(parseData.meeting.endDate);
                                        $('#endTime').val(parseData.meeting.endTime);
    
                                        let time_zone_value = parseData.meeting.hour_tz.replace("+", "") + '*' + parseData.meeting.php_tz;
                                        
                                        setTimeout(() => {
                                            $('.time-zone-list').val(time_zone_value);
                                            $(".time-zone-list option[value='" + time_zone_value + "']").attr("selected", "selected");
                                            $("#event-list").val(parseData.meeting.event_id);
                                            $("#event-list option[value='" + parseData.meeting.event_id + "']").attr("selected", "selected");
                                        }, 3000,[time_zone_value,parseData]);
    
                                        $('#colorp').val(parseData.meeting.color);
                                        $('#colorpicker').farbtastic('#colorp');
                                        $.farbtastic($('#colorpicker')).setColor(parseData.meeting.color);
                                        // $('#colorp').spectrum("set", parseData.meeting.color);
                                        // $('#colorp').ColorPicker("set", parseData.meeting.color);
                                        $('.description').val(parseData.meeting.description);
    
                                        if (parseData.meeting.meeting_with > 0) {
                                            $('#otherField').val(parseData.meeting.meeting_with);
                                            $('#sendoption').val('yes');
                                            $('#otherFieldDiv').show();
                                            $('#tzp').show();
                                        } else {
                                            $('#sendoption').val('');
                                            $('#otherFieldDiv').hide();
                                            $('#tzp').hide();
                                        }
    
                                    } else {
                                        $("#edit-event").hide();
                                        $('#calendarModal_popup').click();
                                        $('#colorpicker').farbtastic('#colorp');
                                        $('#modal-form-body').show();
                                        $('#is_event').val('-1');
                                        $('.nav-item a').removeClass('active');
                                        if (parseData.meeting.type == 1) {
                                            $('.tab-pane').removeClass('show active');
                                            $('#pills-event').addClass('show active');
                                            $('#pills-event-tab').click();
                                            $('#pills-event-tab').addClass('active');
                                            $('#is_event').val(parseData.meeting.type);
                                            $("#type").val(parseData.meeting.type);
                                        } else if (parseData.meeting.type == 2) {
                                            $('#pills-out-of-Office-tab').click();
                                            $('#pills-out-of-Office-tab').addClass('active');
                                        } else if (parseData.meeting.type == 3) {
                                            $('#pills-contact-tab').click();
                                            $('#pills-contact-tab').addClass('active');
                                        } else if (parseData.meeting.type == 4) {
                                            $('#pills-task-tab').click();
                                            $('#pills-task-tab').addClass('active');
                                        } else if (parseData.meeting.type == 5) {
                                            $('#pills-appointment-tab').click();
                                            $('#pills-appointment-tab').addClass('active');
                                        }
                                        $('#startDate').val(parseData.meeting.startDate);
                                        $('#meeting-date').html(parseData.meeting.startDate);
                                        $('#startTime').val(parseData.meeting.startTime);
                                        $('#endDate').val(parseData.meeting.endDate);
                                        $('#endTime').val(parseData.meeting.endTime);
    
                                        let time_zone_value = parseData.meeting.hour_tz.replace("+", "") + '*' + parseData.meeting.php_tz;
                                        
                                        setTimeout(() => {
                                            $('.time-zone-list').val(time_zone_value);
                                            $(".time-zone-list option[value='" + time_zone_value + "']").attr("selected", "selected");
                                            $("#event-list").val(parseData.meeting.event_id);
                                            $("#event-list option[value='" + parseData.meeting.event_id + "']").attr("selected", "selected");
                                        }, 3000,[time_zone_value,parseData]);
    
                                        $('#colorp').val(parseData.meeting.color);
                                        $('#colorpicker').farbtastic('#colorp');
                                        $('#colorpicker').farbtastic('#color-picker-representer');
                                        $.farbtastic($('#colorpicker')).setColor(parseData.meeting.color);
                                        // $('#colorp').spectrum("set", parseData.meeting.color);
                                        // $('#colorp').ColorPicker("set", parseData.meeting.color);
                                        $('.description').val(parseData.meeting.description);
                                        $('#title').val(parseData.meeting.title);
                                        $('#location').val(parseData.meeting.location);
                                        $('#seeAnotherField2').val(parseData.meeting.private);
                                        if (parseData.meeting.repeatThis !== null) {
                                            $('#seeAnotherField3').val(parseData.meeting.repeatThis);
                                        }
                                        if (parseData.meeting.meeting_with > 0) {
                                            $('#otherField').val(parseData.meeting.meeting_with);
                                            $('#sendoption').val('yes');
                                            $('#otherFieldDiv').show();
                                            $('#tzp').show();
                                        } else {
                                            $('#sendoption').val('');
                                            $('#otherFieldDiv').hide();
                                            $('#tzp').hide();
                                        }
                                        $('#meeting_id').val(parseData.meeting.id);
                                        if (!isThisCurrentUserCalendar) {
                                            $('.update-btn').hide();
                                            $('.save-btn').hide();
                                        } else {
                                            $('.update-btn').show();
                                            $('.save-btn').hide();
                                        }
                                    }
                                    if(!isEmpty(parseData) && !isEmpty(parseData.can_write) && parseData.can_write == '0'){
                                        $('#edit-event').hide();
                                        $('#export-event').hide();
                                        if(result.meeting.apr == 0 && result.meeting.meeting_with == window.localStorage.getItem("loginuser") && !isEmpty(window.localStorage.getItem("meeting_request_meeting_type")) && (window.localStorage.getItem("meeting_request_meeting_type") === 4 || window.localStorage.getItem("meeting_request_meeting_type") === '4')){
                                            $('#accept-event').show();
                                            $('#edit-event').show();
                                            $('#delete-event').show();
                                            $('#export-event').hide();
                                            $('#delete-event').html('Reject Request');
                                        }
                                    }else{
                                        if(result.meeting.apr == 0 && result.meeting.meeting_with == window.localStorage.getItem("loginuser") && !isEmpty(window.localStorage.getItem("meeting_request_meeting_type")) && (window.localStorage.getItem("meeting_request_meeting_type") === 4 || window.localStorage.getItem("meeting_request_meeting_type") === '4')){
                                            $('#accept-event').show();
                                            $('#edit-event').show();
                                            $('#delete-event').show();
                                            $('#export-event').hide();
                                            $('#delete-event').html('Reject Request');
                                        }
                                    }
                                }
                            } else showAlert('error', c.unableToOpenEvent)
                        }
                    }
                }), y("#delete-event").off().on("click", function(e) {
                    m(r.id), e.preventDefault()
                }), y("#export-event").off().on("click", function(e) {
                    p(r.id, r.title, r.ExpS, r.ExpE), e.preventDefault()
                }), y("#edit-event").off().on("click", function(e) {
                    y('.before_update_meeting_get_message_model-cancel-btn').click();
                    y('#calendarModal_popup').click();
                    $('#colorpicker').farbtastic('#colorp');
                    y("#export-event, #delete-event, #edit-event, #add-event").hide();
                    y("#update_meeting_request").show();
                    y('#event_description_model_popup_close').click();
                    y("#reg").hide();
                    y("#repeat-type-select, #repeat-type-selected").hide();
                    // y("#event-type-selected").show();
                    y("#modal-form-body").show();
                }), y("#accept-event").off().on("click", function(e) {
                    e.preventDefault();
                    accept(r.id);
                })
            }, calendar.data = function() {
                return {
                    id: r.id,
                    title: r.title,
                    url: r.url,
                    start: r.eventStart,
                    end: r.eventEnd,
                    description: r.description,
                    color: r.color
                }
            }, calendar.openModalGcal = function(e, t) {

                y("#modal-form-body").hide(), y("#details-body").show(), y("#details-body-title").html(e), y("#details-body-content").html('<a target="_blank" href="' + t + '">' + c.gcalUrlText + "</a>"), y("#export-event, #delete-event, #edit-event").hide(),
                    // y("#save-changes").hide(),
                    y("#add-event").hide(),
                    // y(".modal-footer").hide();
                    $('#calendarModal_popup').click();
                    $('#colorpicker').farbtastic('#colorp');
            }, calendar.quickModal = function(e, t, a) {

                document.getElementById("modal-form-body").reset(), y("#modal-form-body").html(c.modalFormBody);
                reinitPicker('#startDate');
                reinitPicker('#endDate');
                reinitPicker('#startTime');
                reinitPicker('#endTime');
                refreshSelect();
                var o = moment(e).format("YYYY-MM-DD"),
                    n = moment(e).format("HH:mm"),
                    l = moment(t).format("YYYY-MM-DD"),
                    r = moment(t).format("HH:mm");
                if (0 == moment(t).isValid()) l = o, r = n;
                y("#startDate").val(o), y("#startTime").val(n),$('#meeting-date').html(o), y("#endDate").val(l), y("#endTime").val(r), y("#details-body").hide(), y("#event-type-select").show(), y("#event-type-selected").hide(), y("#repeat-type-select").show(), y("#repeat-type-selected").hide(),
                    // y("#save-changes").hide(),
                    y("#export-event, #delete-event, #edit-event").hide(),
                    y("#update_meeting_request").hide(), y("#add-event").show().css("width", "100%");
                // y(".modal-footer").show();
                y("#modal-form-body").show(), y("#details-body-title").html(c.newEventText);
                $('#calendarModal_popup').click();
                $('#colorpicker').farbtastic('#colorp');
                setEventCalendar();
                y("#event-type").on("change", function() {
                    var e = y(this).val();
                    "false" == e ? (y("#event-type-select").show()
                    // , y("#event-type-selected").show()
                    ) : "true" == e && (y("#event-type-select").show(), y("#event-type-selected").hide())
                }), y("#repeat_select").on("change", function() {
                    var e = y(this).val();
                    "no" !== e ? (y("#repeat-type-select").show(), y("#repeat-type-selected").show()) : "no" == e && (y("#repeat-type-select").show(), y("#repeat-type-selected").hide())
                }), y("#add-event").off().on("click", function(e) {
                    0 == y("input[name=title]").val().length ? showAlert('error', c.emptyForm) : (formData = new FormData(y("#modal-form-body").get(0)), y("#file")[0] && formData.append("file", y("#file")[0].files[0]), d(formData)), e.preventDefault()
                })
            };
            var d = function(e) {
                    y.ajax({
                        url: c.ajaxEventQuickSave,
                        data: e,
                        type: "POST",
                        cache: !1,
                        processData: !1,
                        contentType: !1,
                        beforeSend: function() {
                            y(".loadingDiv").show();
                            // y(".modal-footer").hide();
                        },
                        error: function() {
                            y(".loadingDiv").hide(), console.log(c.ajaxError)
                        },
                        success: function(e) {

                            y(".loadingDiv").hide(), 1 == e ? ($('#calendarModal_popup_close').click(), y(c.calendarSelector).fullCalendar("refetchEvents")) : (showAlert('error', c.failureAddEventMessage) /*, y(".modal-footer").show()*/ )
                            $('#colorpicker').farbtastic('#colorp');
                        }
                    })
                },
                l = function(t, a) {
                    var e = "id=" + t;
                    y.ajax({
                        type: "POST",
                        url: c.ajaxRepeatCheck,
                        data: e,
                        cache: !1,
                        beforeSend: function() {
                            y(".loadingDiv").show()
                        },
                        error: function() {
                            y(".loadingDiv").hide(), console.log(c.ajaxError)
                        },
                        success: function(e) {


                            y(".loadingDiv").hide(), "REP_FOUND" == e ? ($('#calendarModal_popup_close').click(), y(c.modalEditPromptSelector + " .modal-header").html("<h4>" + c.eventText + r.title + "</h4>"), y(c.modalEditPromptSelector + " .modal-body-custom").css("padding", "15px").html(c.repetitiveEventActionText), y(c.modalEditPromptSelector).modal("show"), y('[data-option="save-this"]').unbind("click").on("click", function(e) {
                                i(t, a), $(c.modalEditPromptSelector).modal("hide"), y(c.modalSelector).modal("hide"), e.preventDefault()
                            }), y('[data-option="save-repetitives"]').unbind("click").on("click", function(e) {
                                i(t, a, "true"), $(c.modalEditPromptSelector).modal("hide"), y(c.modalSelector).modal("hide"), e.preventDefault()
                            })) : i(t, a)
                        },
                        error: function(e) {
                            showAlert('error', c.generalFailureMessage);
                        }
                    })
                },
                i = function(e, t, a) {
                    a === g ? editFormData.append("id", e) : (editFormData.append("id", e), editFormData.append("rep_id", r.rep_id), editFormData.append("method", "repetitive_event")), editFormData.append("otitle", r.title), y.ajax({
                        type: "POST",
                        url: c.ajaxEventEdit,
                        data: t,
                        cache: !1,
                        processData: !1,
                        contentType: !1,
                        beforeSend: function() {
                            y(".loadingDiv").show()
                        },
                        error: function() {
                            y(".loadingDiv").hide(), console.log(c.ajaxError)
                        },
                        success: function(e) {

                            y(".loadingDiv").hide(), "" == e ? ($('#calendarModal_popup_close').click(), y(c.calendarSelector).fullCalendar("refetchEvents")) : showAlert('error', c.failureUpdateEventMessage)
                        },
                        error: function(e) {
                            showAlert('error', c.failureUpdateEventMessage)
                        }
                    })
                },
                m = function(a) {
                    var t = "id=" + a;
                    y.ajax({
                        type: "POST",
                        url: c.ajaxRepeatCheck,
                        data: {
                            id: a
                        },
                        cache: !1,
                        beforeSend: function() {
                            y(".loadingDiv").show()
                        },
                        error: function() {
                            y(".loadingDiv").hide(), console.log(c.ajaxError)
                        },
                        success: function(e) {

                            if (e == 1) {
                                location.reload();
                            }
                            y(".loadingDiv").hide(), "REP_FOUND" == e ? ($('#calendarModal_popup_close').click(), y(c.modalPromptSelector + " .modal-header").html("<h4>" + c.eventText + r.title + "</h4>"), y(c.modalPromptSelector + " .modal-body").html(c.repetitiveEventActionText), y(c.modalPromptSelector).modal("show"), y('[data-option="remove-this"]').unbind("click").on("click", function(e) {
                                s(t), $(c.modalPromptSelector).modal("hide"), e.preventDefault()
                            }), y('[data-option="remove-repetitives"]').unbind("click").on("click", function(e) {
                                var t = "id=" + a + "&rep_id=" + r.rep_id + "&method=repetitive_event&delete=yes";
                                s(t), $(c.modalPromptSelector).modal("hide"), e.preventDefault()
                            })) : s(t)
                        },
                        error: function(e) {
                            showAlert('error', c.generalFailureMessage)
                        }
                    })
                },
                accept = function(id) {
                    let accept_url = app_url + "meeting/accept_events?" + t + '&id=' + id;
                    y.ajax({
                        type: "POST",
                        url: accept_url,
                        cache: !1,
                        beforeSend: function() {
                            y(".loadingDiv").show()
                        },
                        error: function() {
                            y(".loadingDiv").hide(), console.log(c.ajaxError)
                        },
                        success: function(e) {
                            showAlert('success', e.message);
                            refreshCalendar();
                            $('#event_description_model_popup_close').click();
                        },
                        error: function(e) {
                            showAlert('error', c.generalFailureMessage)
                        }
                    })
                },
                s = function(e) {
                    var t = e + "&title=" + encodeURIComponent(r.title) + "&start=" + r.d_startDate;
                    y.ajax({
                        type: "POST",
                        url: c.ajaxEventDelete,
                        data: t,
                        cache: !1,
                        beforeSend: function() {
                            y(".loadingDiv").show()
                        },
                        error: function() {
                            y(".loadingDiv").hide(), console.log(c.ajaxError)
                        },
                        success: function(e) {

                            y(".loadingDiv").hide(), "success" == e.status ?
                                ($('#event_description_model_popup_close').click(), y(c.calendarSelector).fullCalendar("refetchEvents"), showAlert('success', e.message)) :
                                showAlert('error', c.failureDeleteEventMessage);
                        }
                    })
                },
                p = function(e, t, a, o) {
                    var n = a,
                        l = o,
                        r = "&method=export&id=" + encodeURIComponent(e) + "&title=" + encodeURIComponent(t) + "&start_date=" + encodeURIComponent(n) + "&end_date=" + encodeURIComponent(l);
                    window.location = c.ajaxEventExport + r
                };
            calendar.calendarImport = function() {

                txt = "import=" + encodeURIComponent(y("#import_content").val()), y.post(c.ajaxImport, txt, function(e) {
                    showAlert('error', e), y(c.calendarSelector).fullCalendar("refetchEvents"), $("#cal_import").modal("hide"), y("#import_content").val("")
                })
            };
            var f = function(e, t) {
                for (var a = 0; a < t.length; a++) e.hasOwnProperty(t[a]) && delete e[t[a]]
            };
            if (1 == c.filter) {
                function v() {
                    value = y(c.formSearchSelector + " input").val(), construct = "search=" + encodeURIComponent(value), y.post("includes/loader.php", construct, function(e) {
                        y(c.calendarSelector).fullCalendar("refetchEvents")
                    })
                }
                y(c.formFilterSelector).on("change", function(e) {
                    selected_value = y(this).val(), construct = "filter=" + encodeURIComponent(selected_value), y.post("includes/loader.php", construct, function(e) {
                        y(c.calendarSelector).fullCalendar("refetchEvents")
                    }), e.preventDefault()
                }), y(c.formSearchSelector).keypress(function(e) {
                    13 == e.which && (v(), e.preventDefault())
                }), y(c.formSearchSelector + " button").on("click", function(e) {
                    v()
                }), window.onbeforeunload = function() {
                    var e = new FormData;
                    e.append("search", ""), e.append("filter", y(c.formFilterSelector + " option:selected").val()), navigator.sendBeacon("includes/loader.php", e)
                }
            }

            function u(e, t) {
                var a = "";
                for (var o in e)
                    if (e.hasOwnProperty(o)) {
                        var n = e[o].fields;
                        for (var l in n) n.hasOwnProperty(l) && Object.keys(n).forEach(function(e) {
                            if (!n[e].includes(t) && !n[e].includes(t.replace(">", "[]>"))) return !1;
                            a = e
                        })
                    }
                return a
            }

            function h(e, t) {
                var a = [];
                for (var o in e) e.hasOwnProperty(o) && ("object" == typeof e[o] ? a = a.concat(h(e[o], t)) : o == t && a.push(e[o]));
                return a
            }
        }
    })
}(jQuery);
var editFormData, formData, calendar = {};