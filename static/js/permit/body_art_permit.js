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
                    $('#feeTitle').html(''+response.classifications);
                    $('#feeVal').html('$'+parseFloat(response.base_charge).toFixed(2));
                    $('#permit_fee_amount').val(response.base_charge);
                    totalFee = response.base_charge;
                    totalFeeVal = (parseFloat(totalFee)).toFixed(2);
                    $('#totalFee').text('$'+totalFeeVal);
                    $('#feeCalcRow').removeClass('d-none');
                },
                error: function (response) {
                    $('#overlay').hide();
                }
            });

        }else{

            totalFee =0;
            totalFeeVal = (parseFloat(totalFee)).toFixed(2);
            $('#permit_processing_fee').val(0);
            $('#feeTitle').html('');
            $('#feeVal').html('');
            $('#permit_fee_amount').val(0);
            $('#totalFee').text('$'+totalFeeVal);
        }

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
                $('input#owner_cellphone').val('');
                $('input#owner_address').val('');
                $('input#owner_city').val('');
                $('input#owner_state').val('');
                $('input#owner_zip').val('');
            }else{
                $('input#owner_name').val(ui.item.label);
                $('input#owner_id').val(ui.item.id);
                $('input#owner_email').val(ui.item.email);
                $('input#owner_home_phone').val(ui.item.phone);
                $('input#owner_cellphone').val(ui.item.cellphone);
                $('input#owner_address').val(ui.item.address);
                $('input#owner_city').val(ui.item.city);
                $('input#owner_state').val(ui.item.state);
                $('input#owner_zip').val(ui.item.zip);
            }
            return false;
        }
    });



    $('#final_submit_btn').click(function(){

        if(!validateBasic()){
            return  false;
        }
        var myForm  = document.getElementById("frmPermitInfoData");
        formData = new FormData(myForm);

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
    return true;
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}


function changePermitStatus(status,element){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(function(result){
        //console.log(result.value);
        if(result.value)
        {
            //alert('hi');
            $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            var formData = new FormData();
            formData.append('permit_status',status);
            $.ajax({
                url: changePermitStatusUrl,
                type: "POST",
                data: formData,
                dataType: "json",
                contentType: false,
                processData: false,
                beforeSend: function(){
                    $('#overlay').show();
                },
                success: function(response){
                    window.location.reload();
                    // $('#overlay').hide();
                    // var title = "";
                    // element.parent('fieldset').next().show('slow');
                    // element.parent('fieldset').hide('slow');
                    // if(status == 'under-review'){
                    //     $("#progressbar li#under_review").addClass(" active text-success");
                    //     title = 'The permit is in Under Review';
                    // }

                    // if(status == 'pre-opening'){
                    //     $("#progressbar li#pre_opening").addClass(" active text-success");
                    //     //$("input#btnPlaceInPreOpening").hide('slow');
                    //     title = 'The permit is in Pre-Opening';
                    // }

                    // if(status == 'inspection'){
                    //     $("#progressbar li#inspection").addClass(" active text-success");
                    //     title = 'The permit is in Inspection';
                    // }

                    // if(status == 'pd-to-be-active'){
                    //     $("#progressbar li#pd-to-be-active").addClass(" active text-success");
                    //     title = 'The permit is in Pending Payment';
                    // }

                    // if(status == 'schedule_a_job'){
                    //     title = 'Jobs Scheduled Successfully!';
                    // }

                    Swal.fire({
                        // position: 'top-end',
                        icon: 'success',
                        title: title,
                        showConfirmButton: false,
                        timer: 2000
                      });

                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseJSON.message);
                    Swal.fire({
                        icon: 'error',
                        title: 'Problem while updating permit status: '+errorThrown,
                    });
                }
            });
        }
        else
        {

        }

    });
}
