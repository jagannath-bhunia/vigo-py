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
    var cateringFee = 50;
    var LateFee = 150;


    var totalfeesamount = 0;
    var totalFeeAmountVal = 0;
    var total = 0;
    var amount = 0;

    $('#permit_fee_id').change(function () {
        let master_fee_id = $(this).val();
        var totaldays = $('#number_of_days_event').val();
        if (master_fee_id) {
            $.ajax({
                url: get_permit_fee_ajax,
                type: "POST",
                data: { master_fee_id: master_fee_id },
                dataType: "JSON",
                beforeSend: function () {
                    $('#overlay').show();
                },
                success: function (response) {
                    //console.log(response);
                    $('#overlay').hide();
                    $('#feeVal99').html('$' + response.unit_type)
                    $('#feeTitle').html('' + response.classifications);
                    $('#feeVal').html('$' + parseFloat(response.base_charge).toFixed(2));


                    amount = response.base_charge;
                    total = amount * totaldays;
                    totalfeesamount = response.base_charge;
                    if (totaldays > 0) {
                        if (amount == 40) {
                            if (total <= 110) {
                                totalfeesamount = total;
                            } else {
                                totalfeesamount = 110;
                            }
                        } else if (amount == 50) {
                            if (total <= 130) {
                                totalfeesamount = total;
                            } else {
                                totalfeesamount = 130;
                            }
                        }
                    }

                    console.log(totalfeesamount);

                    $('#permit_fee_amount').val(response.base_charge);

                    laFee = parseFloat($('#lateFee').val());
                    totalFee = totalfeesamount + laFee;
                    totalFeeVal = (parseFloat(totalFee)).toFixed(2);
                    $('#totalFee').text('$' + totalFeeVal);
                    $('#total_amount').val(totalfeesamount);
                    $('#feeCalcRow').removeClass('d-none');
                },
                error: function (response) {
                    $('#overlay').hide();
                }
            });
        } else {
            laFee = parseFloat($('#lateFee').val());
            totalFee = laFee;
            totalFeeVal = (parseFloat(totalFee)).toFixed(2);
            $('#permit_processing_fee').val(0);
            $('#feeTitle').html('');
            $('#feeVal').html('');
            $('#permit_fee_amount').val(0);
            $('#totalFee').text('$' + totalFeeVal);
            $('#total_amount').val(totalfeesamount);
        }

    });

    const actualLateFee = parseFloat(LateFee);
    $('#lateFeeCalculate').click(function () {
        if ($('#permit_fee_id').val()) {
            let isChecked = $(this).prop('checked');
            var totalFee = 0;
            var estFee = 0;
            var totaldays = $('#number_of_days_event').val();

            if (isChecked) {
                $('input[type="hidden"]#lateFee').val(actualLateFee);
                $('#feeLateVal').text('$' + actualLateFee + '.00');
                lFee = actualLateFee;
            }
            else {
                $('input[type="hidden"]#lateFee').val(0);
                $('#feeLateVal').text('$0.00');
                lFee = 0;
            }

            estFee = parseFloat($('#permit_fee_amount').val());


            amount = parseFloat($('#permit_fee_amount').val());
            total = amount * totaldays;
            totalfeesamount = parseFloat($('#permit_fee_amount').val());
            if (totaldays > 0) {
                if (amount == 40) {
                    if (total <= 110) {
                        totalfeesamount = total;
                    } else {
                        totalfeesamount = 110;
                    }
                } else if (amount == 50) {
                    if (total <= 130) {
                        totalfeesamount = total;
                    } else {
                        totalfeesamount = 130;
                    }
                }
            }
            totalFee = totalfeesamount + lFee;
            $('#totalFee').text('$' + totalFee + '.00');
            $('#total_amount').val(totalfeesamount);
        } else {
            $(this).prop('checked', false);
            alert('please Select Fees Category')
        }
    });


    $("input#organizer_name").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: eventSearch,
                type: 'POST',
                dataType: "JSON",
                data: {
                    _token: CSRF_TOKEN,
                    query: request.term
                },
                success: function (data) {
                    if (data.length > 0) {
                        response($.map(data, function (item) {
                            console.log(item);
                            return {
                                value: item.label,
                                eventId: item.id,
                                organizer_name: item.organizer_name,
                                organizer_email: item.organizer_email,

                            };
                        }));
                    }
                    else {
                        $('#event_id').val('');
                        $('#organizer_name').val('');
                        $('#organizer_email').val('');


                    }
                }
            });
        },
        minLength: 1,
        select: function (event, ui) {
            if (ui.item.id == '') {
                $('#event_id').val('');
                $('#organizer_name').val('');
                $('#organizer_email').val('');

            } else {
                $('#event_id').val(ui.item.eventId);
                $('#organizer_name').val(ui.item.organizer_name);
                $('#organizer_email').val(ui.item.organizer_email);


            }
            return false;
        }
    });








    $("input#owner_name").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: live_search_owner,
                type: 'POST',
                dataType: "JSON",
                data: {
                    _token: CSRF_TOKEN,
                    query: request.term
                },
                success: function (data) {
                    response(data);
                    // console.log(data[0].id);
                    if (data[0].id == '') {
                        $('input#owner_id').val('');
                    }
                }
            });
        },
        minLength: 1,
        select: function (event, ui) {
            if (ui.item.id == '') {
                $('input#owner_name').val('');
                $('input#owner_id').val('');
                $('input#owner_email').val('');
                $('input#owner_home_phone').val('');
                $('input#owner_cell_phone').val('');
                $('input#owner_address').val('');
                $('input#owner_city').val('');
                $('input#owner_state').val('');
                $('input#owner_zip').val('');
            } else {
                $('input#owner_name').val(ui.item.label);
                $('input#owner_id').val(ui.item.id);
                $('input#owner_email').val(ui.item.email);
                $('input#owner_home_phone').val(ui.item.phone);
                $('input#owner_cell_phone').val(ui.item.cellphone);
                $('input#owner_address').val(ui.item.address);
                $('input#owner_city').val(ui.item.city);
                $('input#owner_state').val(ui.item.state);
                $('input#owner_zip').val(ui.item.zip);
            }
            return false;
        }
    });

    // $("input#event_name").autocomplete({
    //     source: function (request, response) {
    //         $.ajax({
    //             url: eventSearch,
    //             type: 'POST',
    //             dataType: "JSON",
    //             data: {
    //                 _token: CSRF_TOKEN,
    //                 query: request.term
    //             },
    //             success: function (data) {
    //                 if (data.length > 0) {
    //                     response($.map(data, function (item) {
    //                         console.log(item.fee);
    //                         return {
    //                             value: item.label,
    //                             eventId: item.id,
    //                             event_name: item.event_name,
    //                             event_location: item.event_location,
    //                             event_start_date: item.event_start_date,
    //                             event_end_date: item.event_end_date,
    //                             event_time: item.event_time,
    //                             number_of_days_event: item.number_of_days_event,
    //                             fee: item.fee,
    //                         };
    //                     }));
    //                 }
    //                 else {
    //                     $('#event_id').val('');
    //                     $('#event_name').val('');
    //                     $('#event_location').val('');
    //                     $('#start_date_of_event').val('');
    //                     $('#end_date_of_event').val('');
    //                     $('#number_of_days_event').val('');
    //                     $('#time_of_enent').val('');
    //                     // $('#totalFees').text('');
    //                     // $('#permit_fee_amount').val('');
    //                     // $('#numberOfDaysOfOperation').val('');
    //                     // $('#permitFees').val('');

    //                 }
    //             }
    //         });
    //     },
    //     minLength: 1,
    //     select: function (event, ui) {
    //         if (ui.item.id == '') {
    //             $('#event_id').val('');
    //             $('#event_name').val('');
    //             $('#event_location').val('');
    //             $('#start_date_of_event').val('');
    //             $('#end_date_of_event').val('');
    //             $('#number_of_days_event').val('');
    //             $('#time_of_enent').val('');
    //             $('#total_amount').val('');
    //             // $('#permit_fee_amount').val('');
    //             //$('#numberOfDaysOfOperation').val('');
    //             // $('#permitFees').val('');

    //         } else {


    //             var amount = $('#permit_fee_amount').val();
    //             var latefee = parseFloat($('#lateFee').val());
    //             var day = ui.item.number_of_days_event;

    //             total = amount * day;

    //             if (amount == 40) {
    //                 if (total <= 110) {
    //                     totalfeesamount = total;
    //                 } else {
    //                     totalfeesamount = 110;
    //                 }
    //             } else if (amount == 50) {
    //                 if (total <= 130) {
    //                     totalfeesamount = total;
    //                 } else {
    //                     totalfeesamount = 130;
    //                 }
    //             } else {
    //                 totalfeesamount = 0;
    //             }


    //             totalfeesamount = totalfeesamount;
    //             console.log(totalfeesamount, latefee);
    //             totalFeeAmountVal = (parseFloat(totalfeesamount + latefee)).toFixed(2);

    //             $('#event_id').val(ui.item.eventId);
    //             $('#event_name').val(ui.item.event_name);
    //             $('#event_location').val(ui.item.event_location);
    //             $('#start_date_of_event').val(ui.item.event_start_date);
    //             $('#end_date_of_event').val(ui.item.event_end_date);
    //             $('#number_of_days_event').val(ui.item.number_of_days_event);
    //             $('#time_of_enent').val(ui.item.event_time);
    //             $('#total_amount').val(totalfeesamount);

    //             $('#totalFee').text('$' + totalFeeAmountVal);

    //             // $('#permit_fee_amount').val(ui.item.fee);
    //             // $('#numberOfDaysOfOperation').val(ui.item.eventTotalDays);
    //             // $('#permitFees').val(ui.item.fee);

    //         }
    //         return false;
    //     }
    // });

    $('#final_submit_btn').click(function(){
        if(!validateBasic()){
            return  false;
        }
        let crtified_professional = $('input[name="food_manager"]').is(':checked');
        var food_manager = '';
        food_manager = crtified_professional==true ?  $('input[name="food_manager"]:checked').val() : '';

        let food_safety = $('input[name="food_safety_manager"]').is(':checked');
        var food_safety_manager = '';
        food_safety_manager = food_safety==true ? $('input[name="food_safety_manager"]:checked').val() : '';

        let serv= $('input[name="serv_safe"]').is(':checked');
        var serv_safe = null;
        serv_safe = serv==true ? $('input[name="serv_safe"]:checked').val() : '';



        var myForm  = document.getElementById("frmPermitInfoData");
        formData = new FormData(myForm);
        formData.append('food_manager',food_manager);
        formData.append('food_safety_manager',food_safety_manager);
        formData.append('serv_safe',serv_safe);


        $.ajax({
            url: permit_save_url,
            type: 'POST',
            dataType: 'json',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function(){
                $('#overlay').show();
            },
            success:function(response){
                if(response.status == true){
                    Swal.fire({
                        icon: 'success',
                        title: response.message
                    });
                }
                setTimeout(function(){
                    window.location.href = permits_url;
                 },3000);

            },
            error:function(jqXHR, textStatus, errorThrown){
                $('#overlay').hide();
                var error = jqXHR.responseJSON;
                var error_title = "";
                if(typeof error.message !== 'undefined'){
                    console.log(error.message);
                    error_title = 'Permit save error:-'+errorThrown;
                }
                else
                {
                    error_title = 'Have some problem while saving permit, Please try again later';
                }

                Swal.fire({
                    icon: 'error',
                    title: error_title
                });

            }
        });

    });


});
function feesCalculation(e){
    console.log(e.val());
    var amount = $('#permit_fee_amount').val();
    var latefee = parseFloat($('#lateFee').val());
    var day = e.val();

    total = amount * day;

    if (amount == 40) {
        if (total <= 110) {
            totalfeesamount = total;
        } else {
            totalfeesamount = 110;
        }
    } else if (amount == 50) {
        if (total <= 130) {
            totalfeesamount = total;
        } else {
            totalfeesamount = 130;
        }
    } else {
        totalfeesamount = 0;
    }


    totalfeesamount = totalfeesamount;
    console.log(totalfeesamount, latefee);
    totalFeeAmountVal = (parseFloat(totalfeesamount + latefee)).toFixed(2);
    $('#total_amount').val(totalfeesamount);

    $('#totalFee').text('$' + totalFeeAmountVal);


}

function validateBasic(){
    var permit_fee_id = $('#permit_fee_id').val();
    $('#permit_fee_id').removeClass('border-danger');
    if(permit_fee_id == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please select Fee Category'
        });
        $('#permit_fee_id').addClass(' border-danger');
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
    var est_name = $('#est_name').val();
    $('#est_name').removeClass('border-danger');
    if(est_name == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please fill the Establishment Name'
        });
        $('#est_name').addClass(' border-danger');
        return false;
    }




    var owner_name = $('#owner_name').val();
    $('#owner_name').removeClass('border-danger');
    if(owner_name == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please fill Owner Name'
        });
        $('#owner_name').addClass(' border-danger');
        return false;
    }


    return true;
}


