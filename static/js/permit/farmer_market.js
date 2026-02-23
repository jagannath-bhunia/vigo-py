if($('table.dataTable').length){
    $('table.dataTable').DataTable({
        /* responsive: true,
        columnDefs: [
            { orderable: false, targets: 6 },
        ] */
    });
}
var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
$.ajaxSetup({
    headers: {'X-CSRF-TOKEN': CSRF_TOKEN}
});

$(document).ready(function(){

    $('#permit_fee_id').change(function(){
        let master_fee_id = $(this).val();
        if(master_fee_id){

            $.ajax({
                url: get_permit_fee_ajax,
                type: "POST",
                data: {master_fee_id: master_fee_id},
                dataType:"JSON",
                beforeSend: function () {
                    $('#overlay').show();
                },
                success: function (response) {
                    //console.log(response);
                    $('#overlay').hide();
                    $('#feeVal99').html('$'+response.unit_type)
                    // $('#permit_processing_fee').val(response.unit_type);

                    $('#feeTitle').html(''+response.classifications);
                    $('#feeVal').html('$'+parseFloat(response.base_charge).toFixed(2));
                    $('#permit_fee_amount').val(response.base_charge);
                    $('#total_amount').val(response.base_charge);


                    // if($('#no_of_location').val() > 0){
                    //     var noOfLocation = $('#no_of_location').val();
                    // }else{
                    //     var noOfLocation = 1;
                    // }


                    //  console.log(noOfLocation);
                     totalFee = response.base_charge;

                    // totalFee = (response.base_charge * noOfLocation);
                    // var totalFeeVal = $('#permit_processing_fee').val();
                    // $('#permit_processing_fee').val(totalFeeVal);
                    totalFeeVal = (parseFloat(totalFee)).toFixed(2);
                    // console.log(parseFloat(totalFeeVal));
                    $('#totalFee').text('$'+totalFeeVal);
                    $('#feeCalcRow').removeClass('d-none');
                },
                error: function (response) {
                    $('#overlay').hide();
                }
            });

        }else{
            // var noOfLocation = $('#no_of_location').val();
            var totalFeeVal = "00.00";
            // totalFee =laFee + catFee;
            // var totalFeeVal = $('#permit_processing_fee').val();
            // $('#permit_processing_fee').val(totalFeeVal);
            // totalFeeVal = (parseFloat(totalFee)).toFixed(2);

            // $('#feeVal99').html('$ 0.00')
            $('#permit_processing_fee').val(0);

            $('#feeTitle').html('');
            $('#feeVal').html('');
            $('#permit_fee_amount').val(0);
            $('#total_amount').val(0);

            $('#totalFee').text('$'+totalFeeVal);
        }

    });

    // $('#no_of_location').change(function(){
    //     var permitFee = $('#permit_fee_amount').val();
    //     var noOfLocation = $('#no_of_location').val();
    //     console.log(permitFee,noOfLocation);
    //     var totalAmount =  (parseFloat(permitFee*noOfLocation)).toFixed(2);
    //     $('#totalFee').text('$'+totalAmount);
    // });

    $('#final_submit_btn').click(function(){
        if(!validateBasic()){
            return  false;
        }
        // console.log( $("input[type='checkbox']#copy_info").prop("copy_info"));
        formData = new FormData();
        formData.append('permit_status',$('#permit_status').val());
        formData.append('permit_fee_id',$('#permit_fee_id').val());
        formData.append('permit_fee_amount',$('#permit_fee_amount').val());

        formData.append('application_received_date',$('#permit_file_date').val());
        formData.append('experation_date',$('#permit_expiration_date').val());

        formData.append('vendor_name',$('#vendor_name').val());
        formData.append('market_name',$('#market_name').val());
        formData.append('sample_be_offered',$('#sample_be_offered').val());
        formData.append('type_of_food',$('#type_of_food').val());

        formData.append('mailing_address',$('#mailing_address').val());
        formData.append('renewal_of_permit',$('#renewal_of_permit').val());


        formData.append('owner_id',$('#owner_id').val());
        formData.append('owner_name',$('#owner_name').val());
        formData.append('owner_email',$('#owner_email').val());
        formData.append('owner_address',$('#owner_address').val());
        formData.append('owner_city',$('#owner_city').val());
        formData.append('owner_state',$('#owner_state').val());
        formData.append('owner_zip',$('#owner_zip').val());

        formData.append('home_phone',$('#home_phone').val());
        formData.append('cell_phone',$('#cell_phone').val());



        // formData.append('risk',$('#risk').val());

        formData.append('_token',$('input[name="_token"]').val());
        formData.append('_method',$('input[name="_method"]').val());

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

                console.log(response)

                //window.location.href = permits_url;
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


$( "input#owner_name" ).autocomplete({
    source: function( request, response ) {
        $.ajax({
            url: live_search_owner,
            type: 'POST',
            dataType: "JSON",
            data: {
                _token: CSRF_TOKEN,
                query: request.term
            },
            success: function( data ) {
                response( data );
                // console.log(data[0].id);
                if(data[0].id == ''){
                    $('input#owner_id').val('');
                }
            }
        });
    },
    minLength: 1,
    select: function (event, ui) {
        if(ui.item.id == ''){
            $('input#owner_name').val('');
            $('input#owner_id').val('');
            $('input#owner_email').val('');
            $('input#home_phone').val('');
            $('input#cell_phone').val('');
            $('input#owner_address').val('');
            $('input#owner_city').val('');
            $('input#owner_state').val('');
            $('input#owner_zip').val('');
        }else{
            $('input#owner_name').val(ui.item.label);
            $('input#owner_id').val(ui.item.id);
            $('input#owner_email').val(ui.item.email);
            $('input#home_phone').val(ui.item.phone);
            $('input#cell_phone').val(ui.item.cellphone);
            $('input#owner_address').val(ui.item.address);
            $('input#owner_city').val(ui.item.city);
            $('input#owner_state').val(ui.item.state);
            $('input#owner_zip').val(ui.item.zip);
        }
        return false;
    }
});


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

    var vendor_name = $('#vendor_name').val();
    $('#vendor_name').removeClass('border-danger');
    if(vendor_name == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please fill the Vendor Name'
        });
        $('#vendor_name').addClass(' border-danger');
        return false;
    }
    var market_name = $('#market_name').val();
    $('#market_name').removeClass('border-danger');
    if(market_name == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please Enter Market Name'
        });
        $('#market_name').addClass(' border-danger');
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
