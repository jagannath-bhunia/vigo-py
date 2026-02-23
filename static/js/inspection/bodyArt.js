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

var permit_id = $('input[type="hidden"]#id').val();
var permit_type_id = $('input#permit_type_id').val();
var permit_type = $('input[type="hidden"]#permit_type').val();
var permit_number = $('input#permit_number').val();
var permit_fee = $('input[type="hidden"]#permit_fee_amount_db').val();

$(document).ready(function(){


    $('#finalSubmitBtn').click(function(){
        // if(!validateBasic()){
        //     return  false;
        // }inspectionForm
        // var myForm  = document.getElementById("inspectionForm");
        var formData = new FormData();
        formData.append('inspectionId', inspectionId);
        formData.append('followUp', $('#followUpDate').val());

        formData.append('generalComment', $('#generalComment').val());
        formData.append('receivedSignatureDate', $('#receivedSignatureDate').val());
        formData.append('inspectedSignatureDate', $('#inspectedSignatureDate').val());
        formData.append('receivedBy', $('#receivedBy').val());
        formData.append('inspectedBy', $('#inspectedBy').val());



        if($('input[name="_method"]').val() == 'POST' || $('input[name="_method"]').val() == 'PUT'){
            formData.append('receivedSignature',signaturePadReceived.toDataURL().split(',')[1]);
            formData.append('inspectedSignature',signaturePadInspected.toDataURL().split(',')[1]);
        }



        $.ajax({
            url: final_submit_url,
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

                Swal.fire({
                    icon: 'success',
                    title: 'Inspection Upload Success'
                });
                window.location.href = inspection_url;

            },
            error:function(jqXHR, textStatus, errorThrown){
                $('#overlay').hide();
                var error = jqXHR.responseJSON;
                var error_title = "";
                if(typeof error.message !== 'undefined'){
                    console.log(error.message);
                    error_title = 'Inspection save error:-'+errorThrown;
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

    $('#inspectionDate').focusout(function() {
        var date = $(this).val();
        date = moment(date,'MM/DD/YYYY').format('YYYY-MM-DD');
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 11);
        newDate = moment(newDate,'YYYY-MM-DD').format('MM/DD/YYYY');
        $('#releaseDate').val(newDate);
    });

});
function removeTemperature(element){
    element.closest('div.tempRow').remove();
}
var totalUploadedImg = 0;

$('input[type="file"].upload').each(function(){
    var image_name = $(this).closest('div.form-group').find('img').attr('src').split("/").pop();
    if(image_name.trim() != 'preview.png')
    {
        totalUploadedImg++;
    }
});

function setPreview(element)
{
    if (element.files && element.files[0]) {
        var image_name = $(element).closest('div.form-group').find('img').attr('src').split("/").pop();
        var reader = new FileReader();

        reader.onload = function (e) {
            $(element).closest('div.form-group').find('img')
                .attr('src', e.target.result)
                .width(48)
                .height(48);
                $(element).closest('div.form-group').find('input[type="hidden"]').val("1");
        };
        reader.readAsDataURL(element.files[0]);


        if(image_name.trim() == 'preview.png' && totalUploadedImg < totalSupportedImages)
        {
            totalUploadedImg++;
        }

    }
}

function checkTotalImages(el)
{
    var image_name = $(el).closest('div.form-group').find('img').attr('src').split("/").pop();
    if(image_name.trim() != 'preview.png' || totalUploadedImg < totalSupportedImages)
    {
        return true;
    }
    else
    {
        alert('maximum '+ totalSupportedImages+' item images can be uploaded');
        return false;
    }


}
function removeImage(element){
    // var itemId = element.parents('div.panel').attr('data-itemId');
    // console.log(itemId)
    element.parents('div.fileUploadContainer').find('img').attr('src','../../../dist/img/preview.png');
    // element.parents('div.fileUploadContainer').find('span.img-close').css({'display':'none'});
    element.parents('div.fileUploadContainer').find('input[type="file"]').val("");
    element.parents('div.fileUploadContainer').find('input[type="hidden"]').val("0");

}
$('.img-wrap .close').on('click', function() {
    var id = $(this).closest('.img-wrap').find('img').data('id');
    alert('remove picture: ' + id);
});

function toggle(element,point)
{
    var Oldclass = element.className.split(" ")[7];
    var name  = element.name.split('_')[0];
    var clicked = false;
    const val = (Oldclass == 'btn-default') ? name.split('btn')[0].toUpperCase(): "";

    switch (name)
    {

        case 'Cbtn':
            $(element).removeClass(Oldclass);
            if (Oldclass != 'btn-success') {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-success');
                $(element).val(val);
                //$(element).parent().find('input[name*=status]').val(element.value);
                $(element).parents('div.panel').find('span.checkboxes').removeClass('d-none');
            }else {
                $(element).removeClass('btn-success');
                $(element).addClass('btn-default');
                $(element).val("");
                //$(element).parent().find('input[name*=status]').val('');
                $(element).parents('div.panel').find('span.checkboxes').addClass(' d-none');
                $(element).parents('div.panel').find('span.checkboxes').find('input[type="checkbox"]').prop("checked", false);
            }
            $(element).siblings('button').removeClass('btn-primary btn-danger btn-secondary btn-success btn-warning btn-info bg-purple bg-orange bg-yellow bg-gray').addClass('btn-default');
            $(element).siblings('button').val("");
        break;
        case 'Ncbtn':
            $(element).removeClass(Oldclass);
            if (Oldclass != 'bg-purple') {
                $(element).removeClass('btn-default');
                $(element).addClass('bg-purple');
                $(element).val(val);
                //$(element).parent().find('input[name*=status]').val(element.value);
            }else {
                $(element).removeClass('bg-purple');
                $(element).addClass('btn-default');
                $(element).val("");
                //$(element).parent().find('input[name*=status]').val('');
            }
            $(element).siblings('button').removeClass('btn-primary btn-danger btn-secondary btn-success btn-warning btn-info bg-purple bg-orange bg-yellow bg-gray').addClass('btn-default');
            $(element).siblings('button').val("");
        break;


    }
}

// function saveInspectionDetails(inspectionId){
//     $('div.inspectionRow').each(function(){
//         var item_id = $(this).attr('data-item-id');

//         var formData = new FormData();
//         formData.append('inspectionId',inspectionId);
//         formData.append('itemId',item_id);
//         formData.append('foodCodeId',$('#foodCodeId_'+item_id).val())
//         formData.append('C',$('#C_'+item_id).val());
//         formData.append('CN',$('#CN_'+item_id).val());
//         formData.append('R',$('#R_'+item_id).val());
//         formData.append('comment',$('#comment_'+item_id).val());
//         formData.append('correctedBy',$('#correctedBy_'+item_id).val());
//         if($('#image_'+item_id)[0].files.length > 0){
//             formData.append('image',$('#image_'+item_id)[0].files[0]);

//         }
//         $.ajax({
//             url: save_inspection_details,
//             type: "POST",
//             data: formData,
//             dataType: "json",
//             async: false,
//             cache: false,
//             contentType: false,
//             processData: false,
//             success:function(response){},
//             error:function(jqXHR, textStatus, errorThrown){
//                 var error = jqXHR.responseJSON;
//                 var error_title = "";
//                 if(typeof error.message !== 'undefined'){
//                     console.log(error.message);
//                     error_title = 'Inspection Details save error: '+errorThrown;
//                 }
//                 else
//                 {
//                     error_title = 'Have some problem while saving Abstruct and Surveys, Please try again later';
//                 }

//                 Swal.fire({
//                     icon: 'error',
//                     title: error_title
//                 });
//             }
//         });
//     });
// }


$("#est_name" ).autocomplete({
        source: function( request, response ) {
            $('#id').val('');
            $.ajax({
                url: permit_search,
                type: 'POST',
                dataType: "JSON",
                data: {
                    query: request.term
                },
                success: function( data ) {
                    if(data.length>0)
                    {
                        response($.map(data, function (item) {
                             return {
                                value: item.label,
                                permitId: item.id,
                                permit_number : item.permit_number,
                                est_address : item.est_address,

                                ownerId: item.ownerId,
                                ownerName : item.ownerName,
                                ownerAddress: item.ownerAddress,
                                ownerCity: item.ownerCity,
                                ownerState: item.ownerState,
                                ownerZip: item.ownerZip,
                                ownerPhone: item.ownerPhone,
                            };
                        }));
                    }
                    else
                    {
                        $('#permitId').val('');
                        $('#permit_number').val('');
                        $('#est_name').val('');
                        $('#est_address').val('');

                        $('#ownerId').val('');
                        $('#owner_name').val('');
                        $('#owner_phone').val('');


                    }
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if(ui.item.id == ''){
                $('#permitId').val('');
                $('#permit_number').val('');
                $('#est_name').val('');
                $('#est_address').val('');

                $('#ownerId').val('');
                $('#owner_name').val('');
                $('#owner_phone').val('');



            }else{
                $('#permitId').val(ui.item.permitId);
                $('#permit_number').val(ui.item.permit_number);
                $('#est_name').val(ui.item.value);
                $('#est_address').val(ui.item.est_address);

                $('#ownerId').val(ui.item.ownerId);
                $('#owner_name').val(ui.item.ownerName);
                $('#owner_phone').val(ui.item.ownerPhone);


            }
            return false;
        }
});



function unselectOthers(element)
{
    element.parents('.row').siblings('.row').find('a').removeClass('active').css({"color": "#17a2b8"});
    element.css({"color": "white"});
}


function validateBasic(){
    var permit_fee_id = $('#permit_fee_id').val();
    $('#permit_fee_id').removeClass('border-danger');
    if(permit_fee_id == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please select Establishment Type'
        });
        $('#permit_fee_id').addClass(' border-danger');
        return false;
    }

    var fileDate = $('#permit_file_date').val();
    $('#permit_file_date').removeClass('border-danger');
    if(fileDate!=''){
        //alert(fileDate);
        if(!validateDateMDY(fileDate)){
            Swal.fire({
                icon: 'warning',
                title: 'Date Format is not valid'
            });
            $('#permit_file_date').addClass(' border-danger');
            return false;
        }
    }
    else {
        Swal.fire({
            icon: 'info',
            title: 'Please enter file date.'
        });
        $('#permit_file_date').addClass(' border-danger');
        return false;
    }

    var expirationDate = $('#permit_expiration_date').val();
    $('#permit_expiration_date').removeClass('border-danger');
    if(expirationDate!=''){
        if(!validateDateMDY(expirationDate)){
            Swal.fire({
                icon: 'warning',
                title: 'Date Format is not valid'
            });
            $('#permit_expiration_date').addClass(' border-danger');
            return false;
        }
    } else {
        /* Swal.fire({
            icon: 'info',
            title: 'Please enter expiration date.'
        });
        $('#permit_expiration_date').addClass(' border-danger');
        return false; */
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

    var owner_email = $('input#owner_email').val();
    $('input#owner_email').removeClass('border-danger');
    if(owner_email !== '' && !isEmail(owner_email)){
        Swal.fire({
            icon: 'error',
            title: 'Email Format is not Correct'
        });
        $('input#owner_email').addClass(' border-danger');
        return false;
    }

    var territory_id = $('#territory_id').val();
    $('#territory_id').removeClass('border-danger');
    if(territory_id == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please select Territory'
        });
        $('#territory_id').addClass(' border-danger');
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



    var mailing_address = $('#mailing_address').val();
    $('#mailing_address').removeClass('border-danger');
    if(mailing_address == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please fill The Mailing Address'
        });
        $('#mailing_address').addClass(' border-danger');
        return false;
    }


    return true;
}

function makeTabActiveById(id,currentPage)
{
    if(id == 2){




        var est_name = $('#est_name').val();
        $('#est_name').removeClass('border-danger');
        if(est_name == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Enter Establishment Name'
            });
            $('#est_name').addClass(' border-danger');
            return false;
        }


        var date = $('#inspection_date').val();
        $('#inspection_date').removeClass('border-danger');
        if(date == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Select Date'
            });
            $('select#inspection_date').addClass(' border-danger');
            return false;
        }

        var inspector = $('#inspector_id').val();
        $('select#inspector_id').removeClass('border-danger');
        if(inspector == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Select Inspector'
            });
            $('select#inspector_id').addClass(' border-danger');
            return false;
        }

        var type_of_operation = $('#type_of_operation').val();
        $('#type_of_operation').removeClass('border-danger');
        if(type_of_operation == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Type Of Operation'
            });
            $('#type_of_operation').addClass(' border-danger');
            return false;
        }
        var purpose_id = $('#purpose_id').val();
        $('#purpose_id').removeClass('border-danger');
        if(purpose_id == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Select Purpose'
            });
            $('#purpose_id').addClass(' border-danger');
            return false;
        }



        console.log(id,currentPage);
        if(id > currentPage){
            var myForm  = document.getElementById(" ");
            var formData = new FormData();
            formData.append('permitId', $('#permitId').val());
            formData.append('est_name', $('#est_name').val());
            formData.append('est_address', $('#est_address').val());

            formData.append('owner_name', $('#owner_name').val());
            formData.append('owner_phone', $('#owner_phone').val());

            formData.append('permit_number', $('#permit_number').val());
            formData.append('inspection_date', $('#inspection_date').val());
            // formData.append('enrolled', $('#enrolled').val());
            // formData.append('license', $('#license').val());
            formData.append('inspector_id', $('#inspector_id').val());
            formData.append('purpose_id', $('#purpose_id').val());
            formData.append('type_of_operation', $('#type_of_operation').val());

            formData.append('scheduleId', $('#scheduleId').val());

            // formData.append('manager', $('#manager').val());


            formData.append('_token',$('input[name="_token"]').val());
            formData.append('_method',$('input[name="_method"]').val());

            $.ajax({
                url: inspection_save_url,
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
                    console.log(response.inspectionId);
                    inspectionId = response.inspectionId;
                $('#overlay').hide();
                },
                error:function(jqXHR, textStatus, errorThrown){
                    $('#overlay').hide();
                    var error = jqXHR.responseJSON;
                    var error_title = "";
                    if(typeof error.message !== 'undefined'){
                        console.log(error.message);
                        error_title = 'Inspection save error:-'+errorThrown;
                    }
                    else
                    {
                        error_title = 'Have some problem while saving Inspection, Please try again later';
                    }

                    Swal.fire({
                        icon: 'error',
                        title: error_title
                    });

                }
            });
        }










    } else if(id == 3){
        if(id > currentPage){
            saveInspectionDetails(inspectionId);
            setTimeout(function(){
                $('#overlay').hide();
            },3000);
        }

    }else{
    }
    $('#navTabLi'+id+'>a').removeClass('disabled');
    var nextTab;
    $('.nav-link').map(function(element) {
        if($(this).hasClass("active")) {
            nextTab = $('#navTabLi'+id)
        }
    });
    nextTab.find('a').trigger('click');
}







function saveInspectionDetails(inspectionId){
    var total = $('div.panel').length;
    var totalDone = 0;
    var i = 0;

    // console.log(inspectionId);

    $('div.inspectionRow').each(function(){
        i++;
        var section_id = $(this).parents('div.tab-pane').attr('data-section-id');
        var looping_id = $(this).parents('div.tab-pane').attr('data-looping-id');

        var item_id = $(this).attr('data-item-id');

        var comment_by_sub = "";
        if($('#comment_'+item_id+'-loop-'+looping_id).length){
            comment_by_sub = $('#comment_'+item_id+'-loop-'+looping_id).val().trim();
        }


        if($(this).find('input[type="file"]').length){
            var image = $(this).find('input[type="file"]')[0].files[0];

        }else{
            var image = '';
        }

        var cBtnValue = $("#Cbtn_" + item_id + "-loop-" + looping_id).val();
        var ncBtnValue = $("#Ncbtn_" + item_id + "-loop-" + looping_id).val();


        // console.log(cBtnValue);
        // console.log(ncBtnValue);
        // console.log(comment_by_sub);
        // console.log(image);


        if(comment_by_sub!="" || (image!='' && typeof image!='undefined') || cBtnValue!="" || ncBtnValue!="")
        {
            var formData = new FormData();
            formData.append('inspection_id', inspectionId);
            formData.append('section_id', section_id);
            formData.append('item_id', item_id);
            formData.append('comment_by_sub', comment_by_sub);
            formData.append("image", image);

            formData.append('cBtnValue', cBtnValue);
            formData.append('ncBtnValue', ncBtnValue);



            // console.log(cBtnValue,ncBtnValue,looping_id,comment_by_sub);


            $.ajax({
                headers: {
                    'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content')
                },
                url: submit_detail_route,
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                async: false,
                beforeSend: function () {
                    //$('#pleaseWaitDialog').modal('show');
                    //$("#progress-bar").width(i + '%');
                    $('#overlay').show();
                },
                success: function (data) {
                    //console.log(data.Id);
                    var per = (i * 100) / total;
                    //$("#progress-bar").width(per + '%');
                    //$('#overlay').hide();
                },
                error: function (jqXhr,status,error){
                    var submitDetailsError = jqXhr.responseText;
                    console.log(submitDetailsError);
                }
            }).always(function () {
                totalDone++;
                if (totalDone == total){
                    //window.location.href =  inspection_url;
                }
            });


        }


    });
}














function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

if($('input[name="_method"]').val() == 'POST' || $('input[name="_method"]').val() == 'PUT'){
    var received = document.getElementById("receivedSignature");
    var receivedclearButton = received.querySelector("[data-action=clear]");
    var receivedCanvas = received.querySelector("canvas");
    var signaturePadReceived;
    signaturePadReceived = new SignaturePad(receivedCanvas);
    receivedclearButton.addEventListener("click", function (event) {
        signaturePadReceived.clear();
    });

    var inspected = document.getElementById("inspectedSignature");
    var inspectedclearButton = inspected.querySelector("[data-action=clear]");
    var inspectedCanvas = inspected.querySelector("canvas");
    var signaturePadInspected;
    signaturePadInspected = new SignaturePad(inspectedCanvas);
    inspectedclearButton.addEventListener("click", function (event) {
        signaturePadInspected.clear();
    });



}



