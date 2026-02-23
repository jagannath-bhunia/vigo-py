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


    $('#final_submit_btn').click(function(){
        if(!validateBasic()){
            return  false;
        }
        formData = new FormData();
        formData.append('permit_status',$('#permit_status').val());

        formData.append('application_received_date',$('#permit_file_date').val());
        formData.append('experation_date',$('#permit_expiration_date').val());

        formData.append('est_name',$('#est_name').val());
        formData.append('est_phone',$('#est_phone').val());
        formData.append('est_address',$('#est_address').val());
        formData.append('est_city',$('#est_city').val());
        formData.append('est_state',$('#est_state').val());
        formData.append('est_zip',$('#est_zip').val());
        formData.append('mailing_address',$('#mailing_address').val());
        formData.append('manager_name',$('#manager_name').val());
        formData.append('manager_phone',$('#manager_phone').val());
        formData.append('manager_email',$('#manager_email').val());
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

        formData.append("is_copy_est",$("input[type='checkbox']#copyEstData").prop("checked") == true ? 1 : 0);
        formData.append("is_copy_owner",$("input[type='checkbox']#chkCopyOwnerData").prop("checked") == true ? 1 : 0);

        formData.append('applicant_name',$('#applicant_name').val());
        formData.append('applicant_address',$('#applicant_address').val());
        formData.append('applicant_city',$('#applicant_city').val());
        formData.append('applicant_state',$('#applicant_state').val());
        formData.append('applicant_zip',$('#applicant_zip').val());

        formData.append('risk',$('#risk').val());

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




 $('#chkCopyOwnerData').change(function (){
    let ischecked = $(this).is(':checked');
    let owner_name = $('#owner_name').val();
    let owner_address = $('#owner_address').val();
    let owner_city = $('#owner_city').val();
    let owner_state = $('#owner_state').val();
    let owner_zip = $('#owner_zip').val();

    if(!ischecked){
        $('#applicant_name').val('');
        $('#applicant_address').val('');
        $('#applicant_city').val('');
        $('#applicant_state').val('');
        $('#applicant_zip').val('');
    }else{
        $('#applicant_name').val(owner_name);
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
    }else{
        $('#applicant_name').val(est_name);
        $('#applicant_address').val(est_address);
        $('#applicant_city').val(est_city);
        $('#applicant_state').val(est_state);
        $('#applicant_zip').val(est_zip);
    }
    const checkbox = document.getElementById('chkCopyOwnerData');
    checkbox.checked = false;

});



function validateBasic(){

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
                 console.log(data[0]);
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

