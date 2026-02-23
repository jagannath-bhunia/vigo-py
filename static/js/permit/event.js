if ($('table.dataTable').length) {
    $('table.dataTable').DataTable({
        /* responsive: true,
        columnDefs: [
            { orderable: false, targets: 6 },
        ] */
    });
}

var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
$.ajaxSetup({
    headers: { 'X-CSRF-TOKEN': CSRF_TOKEN }
});

$(document).ready(function () {
    $('#finalSubmitBtn').click(function () {
        if(!validateBasic()){
            return  false;
        }
        formData = new FormData();
        // formData.append('permit_number',$('#permit_number').val());
        formData.append('today_date', $('#today_date').val());
        // formData.append('event_name', $('#event_name').val());

        // formData.append('event_location', $('#event_location').val());
        formData.append('organizer_name', $('#organizer_name').val());
        formData.append('organizer_email', $('#organizer_email').val());
        // formData.append('organizer_address', $('#organizer_address').val());
        // formData.append('organizer_city', $('#organizer_city').val());

        // formData.append('organizer_state', $('#organizer_state').val());
        // formData.append('organizer_zip', $('#organizer_zip').val());
        // formData.append('person_in_charge_name', $('#person_in_charge_name').val());
        // formData.append('person_in_charge_phone', $('#person_in_charge_phone').val());
        // formData.append('person_in_charge_fax', $('#person_in_charge_fax').val());
        // formData.append('event_start_date', $('#event_start_date').val());
        // formData.append('event_end_date', $('#event_end_date').val());

        // formData.append('event_time', $('#event_time').val());
        // formData.append('no_of_people_exp_daily', $('#no_of_people_exp_daily').val());
        // formData.append('no_of_people_during_pick_two_hours', $('#no_of_people_during_pick_two_hours').val());
        // formData.append('none', $('#none').prop('checked') == true ? 1 : 0);
        // formData.append('man', $('#man').val());
        // formData.append('women', $('#women').val());
        // formData.append('number_of_toilets', $('#number_of_toilets').val());
        // formData.append('no_of_food_stand', $('#no_of_food_stand').val());
        formData.append('_token', $('input[name="_token"]').val());
        formData.append('_method', $('input[name="_method"]').val());

        $.ajax({
            url: event_save_url,
            type: 'POST',
            dataType: 'json',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                $('#overlay').show();
            },
            success: function (response) {
                saveEastablishment(response.event.id);
                // savePermitNotes(response.permit.id,permitType);
                window.location.href = redirectAfterSave;

            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#overlay').hide();
                var errors = jqXHR.responseJSON;
                errorTitle = "";
                if (errors.errorType == 'validation') {
                    Object.keys(errors.message).filter(function (key) {
                        $('#' + key).addClass('border-danger');
                        var parentId = $('#' + key).parents('div.tab-pane').attr('id');
                        $('a#' + parentId + '-tab').trigger('click');
                        console.log(errors.message);
                    });
                }

            }
        });

    });

    $('button#btnEventAddMore').on({
        "mouseover": function () {
            $(this).addClass(' bg-info');
        },
        "mouseout": function () {
            $(this).removeClass(' bg-info');
        },
        "click": function () {
            var maxEventId = 0;
            $('div.eventRow').each(function () {
                var eventId = parseInt($(this).attr('data-item-id'));
                if (maxEventId < eventId) {
                    maxEventId = eventId;
                }
            });
            maxEventId++;
            var event = $('div[data-item-id = "1"].eventRow').clone();
            var event = event.clone();

            event.find('div.establishment_col').find('label').attr('for', 'est_name'+maxEventId);
            event.find('div.establishment_col').find('input').attr('est_name', 'est_name_Item'+maxEventId).attr('id', 'est_name_Item'+maxEventId).attr("value","");

            event.find('div.contact_person_col').find('label').attr('for', 'contact_person'+maxEventId);
            event.find('div.contact_person_col').find('input').attr('contact_person_Item', 'contact_person_Item'+maxEventId).attr('id', 'contact_person_Item'+maxEventId).attr("value","");

            event.find('div.phone_number_col').find('label').attr('for', 'phone_number'+maxEventId);
            event.find('div.phone_number_col').find('input').attr('phone_number_Item', 'phone_number_Item'+maxEventId).attr('id', 'phone_number_Item'+maxEventId).attr("value","");

            event.find('div.removeEvent').removeClass(' d-none');
            var htmlToInsert = `<div class="row eventRow" data-item-id = "${maxEventId}" data-est-id = " ">`;
            htmlToInsert += event.html() + `</div>`;
            htmlToInsert = htmlToInsert.replace(/_Item1/g, "_Item" + maxEventId);

            // console.log(htmlToInsert);
            $(htmlToInsert).insertBefore($(this));
            $('#phone_number_Item'+maxEventId).inputmask();
        }
    });

});

function removeEvent(element) {
    element.closest('div.eventRow').remove();
}

function saveEastablishment(eventId) {
    var total = $('tr.eventRow').length;
    // var totalDone = 0;
    console.log(total);
    var i = 0;

    $('div.eventRow').each(function () {
        i++;
        var itemId = $(this).attr('data-item-id');
        var estID = $(this).attr('data-est-id');

        var estName = $('#est_name_Item' + itemId).val();
        var contact_person = $('#contact_person_Item' + itemId).val();
        var phone_number = $('#phone_number_Item' + itemId).val();
        console.log(estID);

        var formData = new FormData();
        formData.append('phone_number', phone_number);
        formData.append('contact_person', contact_person);
        formData.append('estName', estName);
        formData.append('eventID', eventId);
        formData.append('itemId', itemId);
        formData.append('estID', estID);

        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            url: AddEstRoute,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            async: false,
            beforeSend: function () {

            },
            success: function (data) {
                if (i == total) {
                    //window.location.href = permits_url;
                }
            },
            error: function (xhr, status, error) {
                //debugger;
                console.log('Document Error:-' + xhr.responseJSON.message);
                $('#overlay').hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Document Error: ' + error,
                });
            }
        }).always(function () {

        });
    });

}

function validateBasic(){
    var event_name = $('#event_name').val();
    $('#event_name').removeClass('border-danger');
    if(event_name == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please Enter Event Name',
        });
        $('#event_name').addClass(' border-danger');
        return false;
    }

    var organizer_name = $('#organizer_name').val();
    $('#organizer_name').removeClass('border-danger');
    if(organizer_name == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please fill the Organizer Name'
        });
        $('#organizer_name').addClass(' border-danger');
        return false;
    }
    var organizer_email = $('#organizer_email').val();
    $('#organizer_email').removeClass('border-danger');
    if(organizer_email == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please fill the Organizer Email'
        });
        $('#organizer_email').addClass(' border-danger');
        return false;
    }
    var event_start_date = $('#event_start_date').val();
    $('#event_start_date').removeClass('border-danger');
    if(event_start_date == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please Fill Event Start Date'
        });
        $('#event_start_date').addClass(' border-danger');
        return false;
    }

    var event_end_date = $('#event_end_date').val();
    $('#event_end_date').removeClass('border-danger');
    if(event_end_date == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please Fill Event End Date'
        });
        $('#event_end_date').addClass(' border-danger');
        return false;
    }


    return true;
}
