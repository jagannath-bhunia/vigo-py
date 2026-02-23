
var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');

$.ajaxSetup({
    headers: {'X-CSRF-TOKEN': CSRF_TOKEN}
});

var id = $('input[type="hidden"]#id').val();

$(document).ready(function(){

    $('#finalSubmitBtn').click(function(){

        if(!validateBasic()){
            return  false;
        }
        // var schedule_id = $('input[type="hidden"]#schedule_id').val();
        // var permit_id = $('input[type="hidden"]#permit_id').val();
        // var inspection_date = $('input[type="text"]#inspection_date').val();
        // var inspector_id = $('select#inspector_id').val();

        // var formData = new FormData();
        // formData.append('schedule_id',schedule_id);
        // formData.append('permit_id', permit_id);
        // formData.append('permit_type', permitType);
        // formData.append('permit_number', $('#permit_number').val());
        // formData.append('inspector_id',inspector_id);
        // formData.append('inspection_date',inspection_date);
        var myForm  = document.getElementById("frmScheduleData");
        formData = new FormData(myForm);
        $.ajax({
            url: submitSchedule,
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
                $('#overlay').hide();

                Swal.fire({
                    // position: 'top-end',
                    icon: 'success',
                    title: response.message,
                    showConfirmButton: false,
                    timer: 2000
                });
                setTimeout(function(){
                    window.location.href = url;
                },2000);

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
                    error_title = 'Have some problem while saving Scheduler, Please try again later';
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


    var permit_number = $('#permit_number').val();
    $('#permit_number').removeClass('border-danger');
    if(permit_number == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please fill the Permit Number'
        });
        $('#permit_number').addClass(' border-danger');
        return false;
    }

    var inspection_date = $('#inspection_date').val();
    $('#inspection_date').removeClass('border-danger');
    if(inspection_date == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please fill Inspection Date'
        });
        $('#inspection_date').addClass(' border-danger');
        return false;
    }


    var inspector_id = $('#inspector_id').val();
    $('#inspector_id').removeClass('border-danger');
    if(inspector_id == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please Select Inspector Name'
        });
        $('#inspector_id').addClass(' border-danger');
        return false;
    }

    return true;
}







