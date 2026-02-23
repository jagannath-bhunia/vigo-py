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

// var permit_id = $('input[type="hidden"]#id').val();
// var permit_type_id = $('input#permit_type_id').val();
// var permit_type = $('input[type="hidden"]#permit_type').val();
// var permit_number = $('input#permit_number').val();
// var permit_fee = $('input[type="hidden"]#permit_fee_amount_db').val();

$(document).ready(function () {


    $('#finalSubmitBtn').click(function(){

        var formData = new FormData();
        console.log(permit_id,permit_number)
        formData.append('inspectionId', inspectionId);
        formData.append('followUp', $('#followUp').val());


        if($('input[name="_method"]').val() == 'POST' || $('input[name="_method"]').val() == 'PUT'){
            formData.append('receivedSignature',signaturePadReceived.toDataURL().split(',')[1]);
            formData.append('inspectedSignature',signaturePadInspected.toDataURL().split(',')[1]);
        }

        // formData.append('_token',$('input[name="_token"]').val());
        // formData.append('_method',$('input[name="_method"]').val());

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




});

function removeImage(element) {
    var itemId = element.parents('div.inspectionRow').attr('data-item-id');
    console.log(itemId)
    $('#preview_' + itemId).attr('src', '../../../dist/img/preview.png');
    $('#close1_' + itemId).css({ 'display': 'none' });
    $('#image_' + itemId).val("");

}
$('.img-wrap .close').on('click', function () {
    var id = $(this).closest('.img-wrap').find('img').data('id');
    alert('remove picture: ' + id);
});
function showFileName(element) {
    var fileName = element.val().split("\\").pop();
    element.siblings(".custom-file-label").addClass("selected").html(fileName);
}





$("#permit_number").autocomplete({
    source: function (request, response) {
        $('#id').val('');
        $.ajax({
            url: permit_search,
            type: 'POST',
            dataType: "JSON",
            data: {
                query: request.term,
            },
            success: function (data) {

                if (data.length > 0) {
                    response($.map(data, function (item) {
                        // console.log(item);
                        return {


                            value: item.label,
                            permitId: item.id,
                            parcel: item.parcel,
                            subdivision: item.subdivision,
                            lot: item.lot,
                            lot_size: item.lot_size,
                            bedroom: item.bedroom,
                            jetted_tubs: item.jetted_tubs,
                            bath: item.bath,
                            address: item.address,



                            ownerName: item.ownerName,
                            ownerAddress: item.ownerAddress,
                            ownerEmail: item.ownerEmail,
                            ownerZip: item.ownerZip,
                            ownerPhone: item.ownerPhone,
                            distance_from_water_supply: item.distance_from_water_supply,


                        };
                    }));
                }
                else {
                    $('#permit_number').val('');
                    $('#address').val('');

                    $('#permit_id').val('');
                    $('#parcel').val('');
                    $('#subdivision').val('');
                    $('#lot').val('');
                    $('#lot_size').val('');
                    $('#bedroom').val('');
                    $('#jetted_tubs').val('');
                    $('#bath').val('');

                    $('#ownerName').val('');
                    $('#ownerAddress').val('');
                    $('#ownerEmail').val('');
                    $('#ownerZip').val('');
                    $('#ownerPhone').val('');
                    $('#distance_from_water_supply').val();

                }
            }
        });
    },
    minLength: 1,
    select: function (event, ui) {
        if (ui.item.id == '') {
            $('#permit_number').val('');
            $('#address').val('');

            $('#permit_id').val('');
            $('#parcel').val('');
            $('#subdivision').val('');
            $('#lot').val('');
            $('#lot_size').val('');
            $('#bedroom').val('');
            $('#jetted_tubs').val('');
            $('#bath').val('');

            $('#ownerName').val('');
            $('#ownerAddress').val('');
            $('#ownerEmail').val('');
            $('#ownerZip').val('');
            $('#ownerPhone').val('');
            $('#distance_from_water_supply').val();

        } else {
            console.log(ui.item);
            $('#permit_number').val(ui.item.label);
            $('#address').val(ui.item.address).prop('readonly', true);

            $('#permit_id').val(ui.item.permitId);
            $('#parcel').val(ui.item.parcel);
            $('#subdivision').val(ui.item.subdivision);
            $('#lot').val(ui.item.lot);
            $('#lot_size').val(ui.item.lot_size);
            $('#bedroom').val(ui.item.bedroom);
            $('#jetted_tubs').val(ui.item.jetted_tubs);
            $('#bath').val(ui.item.bath);

            $('#ownerName').val(ui.item.ownerName);
            $('#ownerAddress').val(ui.item.ownerAddress);
            $('#ownerEmail').val(ui.item.ownerEmail);
            $('#ownerZip').val(ui.item.ownerZip);
            $('#ownerPhone').val(ui.item.ownerPhone);
            $('#distance_from_water_supply').val(ui.item.distance_from_water_supply).prop('readonly', true);

        }
        return false;
    }
});


$("#address").autocomplete({
    source: function (request, response) {
        $('#id').val('');
        $.ajax({
            url: address_search,
            type: 'POST',
            dataType: "JSON",
            data: {
                query: request.term,
            },
            success: function (data) {

                if (data.length > 0) {
                    response($.map(data, function (item) {
                        // console.log(item);
                        return {


                            value: item.label,
                            permitId: item.id,
                            parcel: item.parcel,
                            subdivision: item.subdivision,
                            lot: item.lot,
                            lot_size: item.lot_size,
                            bedroom: item.bedroom,
                            jetted_tubs: item.jetted_tubs,
                            bath: item.bath,
                            permitNumber: item.permit_number,

                            ownerName: item.ownerName,
                            ownerAddress: item.ownerAddress,
                            ownerEmail: item.ownerEmail,
                            ownerZip: item.ownerZip,
                            ownerPhone: item.ownerPhone,


                        };
                    }));
                }
                else {
                    $('#permit_number').val('');
                    $('#address').val('');

                    $('#permit_id').val('');
                    $('#parcel').val('');
                    $('#subdivision').val('');
                    $('#lot').val('');
                    $('#lot_size').val('');
                    $('#bedroom').val('');
                    $('#jetted_tubs').val('');
                    $('#bath').val('');

                    $('#ownerName').val('');
                    $('#ownerAddress').val('');
                    $('#ownerEmail').val('');
                    $('#ownerZip').val('');
                    $('#ownerPhone').val('');

                }
            }
        });
    },
    minLength: 1,
    select: function (event, ui) {
        if (ui.item.id == '') {
            $('#permit_number').val('');
            $('#address').val('');

            $('#permit_id').val('');
            $('#parcel').val('');
            $('#subdivision').val('');
            $('#lot').val('');
            $('#lot_size').val('');
            $('#bedroom').val('');
            $('#jetted_tubs').val('');
            $('#bath').val('');

            $('#ownerName').val('');
            $('#ownerAddress').val('');
            $('#ownerEmail').val('');
            $('#ownerZip').val('');
            $('#ownerPhone').val('');






        } else {


            console.log(ui.item);
            $('#address').val(ui.item.label);
            $('#permit_number').val(ui.item.permitNumber).prop('readonly', true);

            $('#permit_id').val(ui.item.permitId);
            $('#parcel').val(ui.item.parcel);
            $('#subdivision').val(ui.item.subdivision);
            $('#lot').val(ui.item.lot);
            $('#lot_size').val(ui.item.lot_size);
            $('#bedroom').val(ui.item.bedroom);
            $('#jetted_tubs').val(ui.item.jetted_tubs);
            $('#bath').val(ui.item.bath);

            $('#ownerName').val(ui.item.ownerName);
            $('#ownerAddress').val(ui.item.ownerAddress);
            $('#ownerEmail').val(ui.item.ownerEmail);
            $('#ownerZip').val(ui.item.ownerZip);
            $('#ownerPhone').val(ui.item.ownerPhone);

        }
        return false;
    }
});



function toggle(element,point)
{
    var Oldclass = element.className.split(" ")[7];
    var name  = element.name.split('_')[0];
    var clicked = false;
    const val = (Oldclass == 'btn-default') ? name.split('btn')[0].toUpperCase(): "";

    switch (name)
    {

        case 'Yesbtn':
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
        case 'Nobtn':
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

function setPreviewFirst(element) {
    var itemId = event.target.dataset.itemId;
    if (element.files && element.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(element).closest('div.row').find(`#preview_1_${itemId}`).attr('src', e.target.result).width(48).height(48);
        };
        reader.readAsDataURL(element.files[0]);
    }
}

function removeImageFirst(element){
    var itemId = event.target.dataset.itemId;

    // var itemId = element.data('data-item-id');

     console.log(itemId)
    // element.parents('div.fileUploadContainer').find('img').attr('src','../../../dist/img/preview.png');
    // element.parents('div.fileUploadContainer').find('input[type="file"]').val("");
    // element.parents('div.fileUploadContainer').find('input[type="hidden"]').val("0");

    $('#preview_1_' + itemId).attr('src', '../../../dist/img/preview.png');
    $('#close_1_' + itemId).css({ 'display': 'none' });
    $('#image_1_' + itemId).val("");

}


function setPreviewSecond(element) {
    var itemId = event.target.dataset.itemId;
    if (element.files && element.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(element).closest('div.row').find(`#preview_2_${itemId}`).attr('src', e.target.result).width(48).height(48);
        };
        reader.readAsDataURL(element.files[0]);
    }
}

function removeImageSecond(element){
    var itemId = event.target.dataset.itemId;
    $('#preview_2_' + itemId).attr('src', '../../../dist/img/preview.png');
    $('#close_2_' + itemId).css({ 'display': 'none' });
    $('#image_2_' + itemId).val("");

}


function setPreviewThird(element) {
    var itemId = event.target.dataset.itemId;
    if (element.files && element.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(element).closest('div.row').find(`#preview_3_${itemId}`).attr('src', e.target.result).width(48).height(48);
        };
        reader.readAsDataURL(element.files[0]);
    }
}

function removeImageThird(element){
    var itemId = event.target.dataset.itemId;
    console.log(itemId);

    $('#preview_3_' + itemId).attr('src', '../../../dist/img/preview.png');
    $('#close_3_' + itemId).css({ 'display': 'none' });
    $('#image_3_' + itemId).val("");

    console.log($('#image_3_'+ itemId).val());

}








function checkTotalImages(el) {
    // Count uploaded images that are NOT using the default preview image
    let totalUploadedImg = $('.fileUploadContainer img').filter(function () {
        return $(this).attr('src').split('/').pop().trim() !== 'preview.png';
    }).length;

    // Check if the maximum limit is reached
    if (totalUploadedImg < 30) {
        return true;
    } else {
        alert('Maximum ' + 30 + ' images can be uploaded');
        return false;
    }
}

function removeInspection(element) {
    element.closest('div.inspectionRow').remove();
}

// function validateBasic() {
//     var permit_fee_id = $('#permit_fee_id').val();
//     $('#permit_fee_id').removeClass('border-danger');
//     if (permit_fee_id == '') {
//         Swal.fire({
//             icon: 'info',
//             title: 'Please select Establishment Type'
//         });
//         $('#permit_fee_id').addClass(' border-danger');
//         return false;
//     }

//     var fileDate = $('#permit_file_date').val();
//     $('#permit_file_date').removeClass('border-danger');
//     if (fileDate != '') {
//         //alert(fileDate);
//         if (!validateDateMDY(fileDate)) {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Date Format is not valid'
//             });
//             $('#permit_file_date').addClass(' border-danger');
//             return false;
//         }
//     }
//     else {
//         Swal.fire({
//             icon: 'info',
//             title: 'Please enter file date.'
//         });
//         $('#permit_file_date').addClass(' border-danger');
//         return false;
//     }

//     var expirationDate = $('#permit_expiration_date').val();
//     $('#permit_expiration_date').removeClass('border-danger');
//     if (expirationDate != '') {
//         if (!validateDateMDY(expirationDate)) {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Date Format is not valid'
//             });
//             $('#permit_expiration_date').addClass(' border-danger');
//             return false;
//         }
//     } else {
//         /* Swal.fire({
//             icon: 'info',
//             title: 'Please enter expiration date.'
//         });
//         $('#permit_expiration_date').addClass(' border-danger');
//         return false; */
//     }

//     var owner_name = $('#owner_name').val();
//     $('#owner_name').removeClass('border-danger');
//     if (owner_name == '') {
//         Swal.fire({
//             icon: 'info',
//             title: 'Please fill Owner Name'
//         });
//         $('#owner_name').addClass(' border-danger');
//         return false;
//     }

//     var owner_email = $('input#owner_email').val();
//     $('input#owner_email').removeClass('border-danger');
//     if (owner_email !== '' && !isEmail(owner_email)) {
//         Swal.fire({
//             icon: 'error',
//             title: 'Email Format is not Correct'
//         });
//         $('input#owner_email').addClass(' border-danger');
//         return false;
//     }

//     var territory_id = $('#territory_id').val();
//     $('#territory_id').removeClass('border-danger');
//     if (territory_id == '') {
//         Swal.fire({
//             icon: 'info',
//             title: 'Please select Territory'
//         });
//         $('#territory_id').addClass(' border-danger');
//         return false;
//     }

//     var est_name = $('#est_name').val();
//     $('#est_name').removeClass('border-danger');
//     if (est_name == '') {
//         Swal.fire({
//             icon: 'info',
//             title: 'Please fill the Establishment Name'
//         });
//         $('#est_name').addClass(' border-danger');
//         return false;
//     }



//     var mailing_address = $('#mailing_address').val();
//     $('#mailing_address').removeClass('border-danger');
//     if (mailing_address == '') {
//         Swal.fire({
//             icon: 'info',
//             title: 'Please fill The Mailing Address'
//         });
//         $('#mailing_address').addClass(' border-danger');
//         return false;
//     }

//     /* var fmc_user_id = $('#fmc_user_id').val();
//      $('#manager_name').removeClass('border-danger');
//      if(fmc_user_id == ''){
//          Swal.fire({
//              icon: 'info',
//              title: 'Please select Manager'
//          });
//          $('#manager_name').addClass(' border-danger');
//          return false;
//      }*/

//     return true;
// }

function makeTabActiveById(id,currentPage) {
    //var prevId = id - 1;border-danger
    if (id == 2) {
        var permitId = $('#permit_id').val();
        $('#permit_number').removeClass('border-danger');
        if(permitId == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Enter Permit Number'
            });
            $('#permit_number').addClass(' border-danger');
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
        var date = $('#inspectionDate').val();
        $('#inspectionDate').removeClass('border-danger');
        if(date == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Select Inspection Date'
            });
            $('select#inspectionDate').addClass(' border-danger');
            return false;
        }
        console.log(id,currentPage);
        if(id > currentPage){
            var myForm  = document.getElementById(" ");
            var formData = new FormData();
            formData.append('permitId', $('#permit_id').val());
            formData.append('permitNumber', $('#permit_number').val());
            formData.append('scheduleId', $('#schedule_id').val());
            formData.append('inspectorId', $('#inspectorId').val());


            formData.append('soilType', $('#soil_type').val());
            formData.append('absorptionFieldSize', $('#absorption_field_size').val());
            formData.append('distanceFromWaterSupply', $('#distance_from_water_supply').val());
            formData.append('additionalComment', $('#additionalComment').val());
            formData.append('inspectionDate', $('#inspectionDate').val());

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

    } else if (id == 3) {

        if(id > currentPage){

            saveInspectionDetails(inspectionId);
            setTimeout(function(){
                $('#overlay').hide();
            },5000);

        }


    } else {

    }
    $('#navTabLi' + id + '>a').removeClass('disabled');
    var nextTab;
    $('.nav-link').map(function (element) {
        if ($(this).hasClass("active")) {
            // nextTab = $(this).parent().next('li');
            nextTab = $('#navTabLi' + id)
        }
    });
    nextTab.find('a').trigger('click');
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}


if ($('input[name="_method"]').val() == 'POST' || $('input[name="_method"]').val() == 'PUT') {
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

var totalUploadedImg = 0;

$('input[type="file"].upload').each(function(){
    var image_name = $(this).closest('div.form-group').find('img').attr('src').split("/").pop();
    if(image_name.trim() != 'preview.png')
    {
        totalUploadedImg++;
    }
});



function saveInspectionDetails(inspectionId){
    var total = $('div.panel').length;
    var totalDone = 0;
    var i = 0;



    $('div.inspectionRow').each(function(){
        i++;
        // var looping_id = $(this).parents('div.tab-pane').attr('data-looping-id');

        var item_id = $(this).attr('data-item-id');

        var comment_by_sub = "";
        if($('#comment_'+item_id).length){
            comment_by_sub = $('#comment_'+item_id).val().trim();
        }

        var manufacturer = "";
        if($('#manufacturer_1').length){
            manufacturer = $('#manufacturer_1').val().trim();
        }

        var size = "";
        if($('#size_1').length){
            size = $('#size_1').val().trim();
        }

        var riser_provided = "";
        if($('#riser_provided_1').length){
            riser_provided = $('#riser_provided_1').val().trim();
        }

        var man_hole_provided = "";
        if($('#man_hole_provided_1').length){
            man_hole_provided = $('#man_hole_provided_1').val().trim();
        }

        var baffled = "";
        if($('#baffled_1').length){
            baffled = $('#baffled_1').val().trim();
        }

        var pump_manufacturer = "";
        if($('#pump_manufacturer_1').length){
            pump_manufacturer = $('#pump_manufacturer_1').val().trim();
        }

        var model = "";
        if($('#model_1').length){
            model = $('#model_1').val().trim();
        }


        var manufacturer2 = "";
        if($('#manufacturer_2').length){
            manufacturer2 = $('#manufacturer_2').val().trim();
        }

        var size2 = "";
        if($('#size_2').length){
            size2 = $('#size_2').val().trim();
        }

        var riser_provided2 = "";
        if($('#riser_provided_2').length){
            riser_provided2 = $('#riser_provided_2').val().trim();
        }

        var man_hole_provided2 = "";
        if($('#man_hole_provided_2').length){
            man_hole_provided2 = $('#man_hole_provided_2').val().trim();
        }

        var baffled2 = "";
        if($('#baffled_2').length){
            baffled2 = $('#baffled_2').val().trim();
        }

        var pump_manufacturer2 = "";
        if($('#pump_manufacturer_2').length){
            pump_manufacturer2 = $('#pump_manufacturer_2').val().trim();
        }

        var model2 = "";
        if($('#model_2').length){
            model2 = $('#model_2').val().trim();
        }









        var bed_depth = "";
        if($('#bed_depth_'+item_id).length){
            bed_depth = $('#bed_depth_'+item_id).val().trim();
        }

        var bed_width = "";
        if($('#bed_width_'+item_id).length){
            bed_width = $('#bed_width_'+item_id).val().trim();
        }

        var bed_length = "";
        if($('#bed_length_'+item_id).length){
            bed_length = $('#bed_length_'+item_id).val().trim();
        }



        // if($(this).find('input[type="file"]').length){
        //     var image = $(this).find('input[type="file"]')[0].files[0];

        // }else{
        //     var image = '';
        // }





        var yesBtnValue = $("#Yesbtn_" + item_id).val();
        var noBtnValue = $("#Nobtn_" + item_id).val();

            // console.log(yesBtnValue,noBtnValue);

        if(comment_by_sub!="" || $('#image_1_' + item_id)[0].files.length > 0 || $('#image_2_' + item_id)[0].files.length > 0 || $('#image_3_' + item_id)[0].files.length > 0 || yesBtnValue!="" || noBtnValue!="")
        {
            var formData = new FormData();
            formData.append('inspection_id', inspectionId);
            formData.append('item_id', item_id);
            formData.append('comment_by_sub', comment_by_sub);
            // formData.append("image", image);
            // formData.append("image_two", image_two);
            // formData.append("image_three", image_three);

            if ($('#image_1_' + item_id)[0].files.length > 0){
                formData.append('image', $('#image_1_' + item_id)[0].files[0]);
            }



            if ($('#image_2_' + item_id)[0].files.length > 0){
                formData.append('image_two', $('#image_2_' + item_id)[0].files[0]);
            }



            if ($('#image_3_' + item_id)[0].files.length > 0){
                formData.append('image_three', $('#image_3_' + item_id)[0].files[0]);
            }


            formData.append('yesBtnValue', yesBtnValue);
            formData.append('noBtnValue', noBtnValue);

            formData.append("manufacturer", manufacturer);
            formData.append("size", size);
            formData.append("riser_provided", riser_provided);
            formData.append("man_hole_provided", man_hole_provided);
            formData.append("baffled", baffled);
            formData.append("pump_manufacturer", pump_manufacturer);
            formData.append("model", model);

            formData.append("manufacturer2", manufacturer2);
            formData.append("size2", size2);
            formData.append("riser_provided2", riser_provided2);
            formData.append("man_hole_provided2", man_hole_provided2);
            formData.append("baffled2", baffled2);
            formData.append("pump_manufacturer2", pump_manufacturer2);
            formData.append("model2", model2);



            formData.append("bed_depth", bed_depth);
            formData.append("bed_width", bed_width);
            formData.append("bed_length", bed_length);


            //console.log(manufacturer,size,riser_provided,man_hole_provided,baffled,pump_manufacturer,model,bed_depth,bed_width,bed_length);


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

