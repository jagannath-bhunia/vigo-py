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

    var cateringFee = 50;
    var LateFee = 250;
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
                    //  console.log(parseFloat(totalFeeVal));
                    $('#totalFee').text('$'+totalFeeVal);
                    $('#feeCalcRow').removeClass('d-none');
                },
                error: function (response) {
                    $('#overlay').hide();
                }
            });

        }else{
            catFee = parseFloat($('#cateringFee').val());
            laFee = parseFloat($('#lateFee').val());
            totalFee =laFee + catFee;
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
    const actualCateringFee = cateringFee;
    $('#cateringFeeCalculate').click(function(){

        if($('#permit_fee_id').val()){


            let isChecked = $(this).prop('checked');
            var totalFee = 0;
            var estFee = 0;
            var lFee = 0;

            if(isChecked){
                $('input[type="hidden"]#cateringFee').val(actualCateringFee);
                $('#feeCatVal').text('$'+actualCateringFee+'.00');

            catFee = actualCateringFee;

            }
            else{
                $('input[type="hidden"]#cateringFee').val(0);
                $('#feeCatVal').text('$0.00');
                catFee = 0;
            }
            estFee = parseFloat($('#permit_fee_amount').val());
            lFee = parseFloat($('#lateFee').val());

            totalFee = catFee + estFee + lFee ;
            $('#totalFee').text('$'+totalFee+'.00');

        }else{
            $(this).prop('checked',false);

            alert('please Select Fees Category')
        }



    });

    const actualLateFee = LateFee;
    $('#lateFeeCalculate').click(function(){
        if($('#permit_fee_id').val()){
        let isChecked = $(this).prop('checked');
        var totalFee = 0;
        var estFee = 0;
        if(isChecked){
            $('input[type="hidden"]#lateFee').val(actualLateFee);
            $('#feeLateVal').text('$'+actualLateFee+'.00');

           lFee = actualLateFee;

        }
        else{
            $('input[type="hidden"]#lateFee').val(0);
            $('#feeLateVal').text('$0.00');
            lFee = 0;
        }
        estFee = parseFloat($('#permit_fee_amount').val());
        catFee = parseFloat($('#cateringFee').val());

        totalFee = catFee + estFee + lFee;
        $('#totalFee').text('$'+totalFee+'.00');
    } else{
        $(this).prop('checked',false);

        alert('please Select Fees Category')
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

    return true;
}
