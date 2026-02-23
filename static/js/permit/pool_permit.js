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

    // var cateringFee = 50;
    // var LateFee = 250;
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


                    // catFee = parseFloat($('#cateringFee').val());
                    // laFee = parseFloat($('#lateFee').val());

                    // console.log( catFee,laFee);

                    totalFee = response.base_charge;
                    // var totalFeeVal = $('#permit_processing_fee').val();
                    // $('#permit_processing_fee').val(totalFeeVal);
                    totalFeeVal = (parseFloat(totalFee)).toFixed(2);
                    // console.log(parseFloat(totalFeeVal));
                    $('#totalFee').text('$'+totalFeeVal);
                    $('#feeCalcRow').removeClass('d-none');

                    var dateString = $('#application_date').val();
                    var dateObject = new Date(dateString); // Convert input to Date object
                    console.log(dateObject);
                    var currentYear = dateObject.getFullYear();

                    // Define the Secondary Date Range (May 1 - Sep 30)
                    var startDateSec = new Date(currentYear, 0, 1); // May 1 of current year
                    var endDateSec = new Date(currentYear, 8, 30); // Sep 30 of current year

                    // Define the Annual Date Range (May 1 - April 30 next year)
                    var startDateAnu = new Date(currentYear, 4, 1); // May 1
                    var endDateAnu = new Date(currentYear + 1, 3, 30); // April 30 next year

                    // Determine the secondary year
                    var nextYearSec = (dateObject >= startDateSec && dateObject <= endDateSec) ? currentYear : currentYear + 1;

                    // Determine the annual year
                    var nextYearAnu = (dateObject >= startDateAnu && dateObject <= endDateAnu) ? currentYear : currentYear + 1;

                    console.log("Next Year (Secondary):", nextYearSec);
                    console.log("Next Year (Annual):", nextYearAnu);



                    
                    if(response.classifications == 'Annual Pool Permit'){
                        $('#exp_date').val('04/30/' + nextYearAnu);
                    }

                    if(response.classifications == 'Seasonal Pool Permit' || response.classifications == 'Not for Profit Permit'){
                        $('#exp_date').val('09/30/' + nextYearSec);
                    }



                },
                error: function (response) {
                    $('#overlay').hide();
                }
            });

        }else{
            // catFee = parseFloat($('#cateringFee').val());
            // laFee = parseFloat($('#lateFee').val());
            totalFee = 0;
            // var totalFeeVal = $('#permit_processing_fee').val();
            // $('#permit_processing_fee').val(totalFeeVal);
            totalFeeVal = (parseFloat(totalFee)).toFixed(2);
            // $('#feeVal99').html('$ 0.00')
            $('#permit_processing_fee').val(0);

            $('#feeTitle').html('');
            $('#feeVal').html('');
            $('#permit_fee_amount').val(0);
            $('#totalFee').text('$'+totalFeeVal);
        }

    });

    $('#final_submit_btn').click(function(){

        if(!validateBasic()){
            return  false;
        }
        var myForm  = document.getElementById("frmPermitInfoData");
        formData = new FormData(myForm);
        formData.append("is_copy_pool_facility",$("input[type='checkbox']#copyEstData").prop("checked") == true ? 1 : 0);
        formData.append("is_copy_owner",$("input[type='checkbox']#chkCopyOwnerData").prop("checked") == true ? 1 : 0);

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

    $('#chkCopyOwnerData').change(function (){
        let ischecked = $(this).is(':checked');
        let owner_name = $('#owner_name').val();
        let owner_email = $('#owner_email').val();
        let owner_home_phone = $('#owner_home_phone').val();
        let owner_cell_phone = $('#owner_cell_phone').val();
        let owner_address = $('#owner_address').val();
        let owner_city = $('#owner_city').val();
        let owner_state = $('#owner_state').val();
        let owner_zip = $('#owner_zip').val();
        let owner_id = $('#owner_id').val();



        if(!ischecked){
            $('#applicant_id').val('');

            $('#applicant_name').val('');
            $('#applicant_email').val('');
            $('#applicant_home_phone').val('');
            $('#applicant_cell_phone').val('');
            $('#applicant_address').val('');
            $('#applicant_city').val('');
            $('#applicant_state').val('');
            $('#applicant_zip').val('');

        }else{
            $('#applicant_id').val(owner_id);
            $('#applicant_name').val(owner_name);
            $('#applicant_email').val(owner_email);
            $('#applicant_home_phone').val(owner_home_phone);
            $('#applicant_cell_phone').val(owner_cell_phone);
            $('#applicant_address').val(owner_address);
            $('#applicant_city').val(owner_city);
            $('#applicant_state').val(owner_state);
            $('#applicant_zip').val(owner_zip);

        }
        const checkbox = document.getElementById('copyEstData');
        checkbox.checked = false;
    });

    $('#copyEstData').change(function (){
        let ischecked = $(this).is(':checked');

        let est_name = $('#est_name').val();
        let establishment_home_phone = $('#establishment_home_phone').val();
        let establishment_cell_phone = $('#establishment_cell_phone').val();
        let est_address = $('#est_address').val();
        let est_city = $('#est_city').val();
        let est_state = $('#est_state').val();
        let est_zip = $('#est_zip').val();



        if(!ischecked){
            $('#applicant_name').val('');
            $('#applicant_address').val('');
            $('#applicant_city').val('');
            $('#applicant_state').val('');
            $('#applicant_zip').val('');
            $('#applicant_home_phone').val('');
            $('#applicant_cell_phone').val('');
            $('#applicant_email').val('');

        }else{
            $('#applicant_name').val(est_name);
            $('#applicant_address').val(est_address);
            $('#applicant_city').val(est_city);
            $('#applicant_state').val(est_state);
            $('#applicant_zip').val(est_zip);
            $('#applicant_home_phone').val(establishment_home_phone);
            $('#applicant_cell_phone').val(establishment_cell_phone);
        }
        const checkbox = document.getElementById('chkCopyOwnerData');
        checkbox.checked = false;
        $('#applicant_email').val('');
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
            $('input#owner_home_phone').val('');
            $('input#owner_cell_phone').val('');
            $('input#owner_address').val('');
            $('input#owner_city').val('');
            $('input#owner_state').val('');
            $('input#owner_zip').val('');
        }else{
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

    var applicant_name = $('#applicant_name').val();
    $('#applicant_name').removeClass('border-danger');
    if(applicant_name == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please Enter Application Name'
        });
        $('#applicant_name').addClass(' border-danger');
        return false;
    }


    return true;
}

