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

var permit_id = $('input[type="hidden"]#id').val();
var permit_type_id = $('input#permit_type_id').val();
var permit_type = $('input[type="hidden"]#permit_type').val();
var permit_number = $('input#permit_number').val();
var permit_fee = $('input[type="hidden"]#permit_fee_amount_db').val();

$(document).ready(function () {

    $('button#btnInspectionAddMore').on({
        "mouseover": function () {
            $(this).addClass(' bg-info');
        },
        "mouseout": function () {
            $(this).removeClass(' bg-info');
        },
        "click": function () {
            var maxInspectionId = 0;
            $('div.inspectionRow').each(function () {
                var inspectionId = parseInt($(this).attr('data-item-id'));
                if (maxInspectionId < inspectionId) {
                    maxInspectionId = inspectionId;
                }
            });
            maxInspectionId++;
            var inspection = $('div[data-item-id = "1"].inspectionRow').clone();
            var newInspection = inspection.clone();
            newInspection.find('div.removeInspection').removeClass(' d-none');
            newInspection.find('img#preview_1').attr("src", defult_item_image);
            newInspection.find('input[name*=item_id]').val(maxInspectionId);
            newInspection.find('span[name*=close_1]').attr("value", "");

            newInspection.find('input#foodCode_1').attr("value", "");
            newInspection.find('input#foodCodeDescription_1').attr("value", "");
            newInspection.find('input#status_1').attr("value", "");
            newInspection.find('button#C_1').removeClass('btn-success').addClass('btn-default');
            newInspection.find('button#CN_1').removeClass('btn-success').addClass('btn-default');
            newInspection.find('button#R_1').removeClass('btn-info').addClass('btn-default');
            newInspection.find('button#C_1').attr("value", "");
            newInspection.find('button#CN_1').attr("value", "");
            newInspection.find('button#R_1').attr("value", "");
            newInspection.find('textarea#comment_1').text("");
            newInspection.find('input#correctedBy_1').attr("value", "");
            var htmlToInsert = `<div class="row inspectionRow" data-item-id = "${maxInspectionId}">`;
            htmlToInsert += newInspection.html() + `</div>`;
            htmlToInsert = htmlToInsert.replace(/_1/g, "_" + maxInspectionId);
            // console.log(htmlToInsert);
            $(htmlToInsert).insertBefore($(this));
        }
    });

    $('#finalSubmitBtn').click(function () {
        // if(!validateBasic()){
        //     return  false;
        // }inspectionForm
        // var complaintId = $('#complaintId').val();
        // var myForm = document.getElementById("inspectionForm");
        // var formData = new FormData(myForm);

        var formData = new FormData();
        formData.append('permitId', $('#permitId').val());
        formData.append('scheduleId', $('#scheduleId').val());

        formData.append('inspectionId', inspectionId);
        formData.append('followUp', $('#followUp').val());
        // formData.append('status', $('#status').val());
        formData.append('generalComment', $('#generalComment').val());
        formData.append('receivedSignatureDate', $('#receivedSignatureDate').val());
        formData.append('inspectedSignatureDate', $('#inspectedSignatureDate').val());
        formData.append('receivedBy', $('#receivedBy').val());
        formData.append('inspectedBy', $('#inspectedBy').val());
        formData.append('document',$('#document')[0].files[0]);

        if ($('input[name="_method"]').val() == 'POST' || $('input[name="_method"]').val() == 'PUT') {
            formData.append('receivedSignature', signaturePadReceived.toDataURL().split(',')[1]);
            formData.append('inspectedSignature', signaturePadInspected.toDataURL().split(',')[1]);
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
            beforeSend: function () {
                $('#overlay').show();
            },
            success: function (response) {

                Swal.fire({
                    icon: 'success',
                    title: 'Inspection Upload Success'
                });
                // if (complaintId) {
                //     window.location.href = complaint_inspection_url;

                // } else {

                // }
                window.location.href = inspection_url;

            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#overlay').hide();
                var error = jqXHR.responseJSON;
                var error_title = "";
                if (typeof error.message !== 'undefined') {
                    console.log(error.message);
                    error_title = 'Inspection save error:-' + errorThrown;
                }
                else {
                    error_title = 'Have some problem while saving permit, Please try again later';
                }

                Swal.fire({
                    icon: 'error',
                    title: error_title
                });

            }
        });

    });


    $('#inspectionDate').focusout(function () {
        var date = $(this).val();
        date = moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD');
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 11);
        newDate = moment(newDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
        $('#releaseDate').val(newDate);
    });

});

$("#estName").autocomplete({
    source: function (request, response) {
        $('#id').val('');
        $.ajax({
            url: permit_search,
            type: 'POST',
            dataType: "JSON",
            data: {
                query: request.term,
                permitType: permitType
            },
            success: function (data) {
                if (data.length > 0) {
                    response($.map(data, function (item) {
                        return {
                            value: item.label,
                            permitId: item.id,
                            permitNumber: item.permit_number,
                            estAddress: item.est_address,
                            estCity: item.est_city,
                            estState: item.est_state,
                            estZip: item.est_zip,
                            estPhone: item.est_phone,
                            estHomePhone: item.est_home_phone,
                            ownerId: item.owner_id,
                            ownerName: item.owner_name,
                            ownerAddress: item.owner_address,
                            ownerCity: item.owner_city,
                            ownerState: item.owner_state,
                            ownerZip: item.owner_zip,
                            ownerHomePhone: item.owner_home_phone,
                            ownerCellPhone: item.owner_cell_phone,

                            event_location: item.event_location,
                            event_phone: item.event_phone,
                            organizer_address: item.organizer_address,
                            organizer_city: item.organizer_city,
                            organizer_state: item.organizer_state,
                            organizer_zip: item.organizer_zip,


                        };
                    }));
                }
                else {
                    $('#permitId').val('');
                    $('#permitNumber').val('');
                    $('#estName').val('');
                    $('#estAddress').val('');
                    $('#estCity').val('');
                    $('#estState').val('');
                    $('#estZip').val('');
                    $('#estPhone').val('');

                    $('#ownerId').val('');
                    $('#ownerName').val('');
                    $('#ownerAddress').val('');
                    $('#ownerCity').val('');
                    $('#ownerState').val('');
                    $('#ownerZip').val('');
                    $('#ownerPhone').val('');

                }
            }
        });
    },
    minLength: 1,
    select: function (event, ui) {
        if (ui.item.id == '') {
            $('#permitId').val('');
            $('#permitNumber').val('');
            $('#estName').val('');
            $('#estAddress').val('');
            $('#estCity').val('');
            $('#estState').val('');
            $('#estZip').val('');
            $('#estPhone').val('');
            $('#ownerId').val('');
            $('#ownerName').val('');
            $('#ownerAddress').val('');
            $('#ownerCity').val('');
            $('#ownerState').val('');
            $('#ownerZip').val('');
            $('#ownerPhone').val('');


        } else {
            $('#permitId').val(ui.item.permitId);
            $('#permitNumber').val(ui.item.permitNumber);
            $('#estName').val(ui.item.value);
            $('#estAddress').val(ui.item.estAddress);
            $('#estCity').val(ui.item.estCity);
            $('#estState').val(ui.item.estState);
            $('#estZip').val(ui.item.estZip);
            $('#estPhone').val(ui.item.estPhone);

            $('#ownerId').val(ui.item.ownerId);
            $('#ownerName').val(ui.item.ownerName);
            $('#ownerAddress').val(ui.item.ownerAddress);
            $('#ownerCity').val(ui.item.ownerCity);
            $('#ownerState').val(ui.item.ownerState);
            $('#ownerZip').val(ui.item.ownerZip);
            $('#ownerHomePhone').val(ui.item.ownerHomePhone);
            $('#ownerCellPhone').val(ui.item.ownerCellPhone);

        }
        return false;
    }
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


function saveInspectionDetails(inspectionId) {
    $('div.inspectionRow').each(function () {
        var item_id = $(this).attr('data-item-id');

        var formData = new FormData();
        formData.append('inspectionId', inspectionId);
        formData.append('itemId', item_id);
        formData.append('foodCodeId', $('#foodCodeId_' + item_id).val())
        formData.append('C', $('#C_' + item_id).val());
        formData.append('CN', $('#CN_' + item_id).val());
        formData.append('R', $('#R_' + item_id).val());
        formData.append('comment', $('#comment_' + item_id).val());
        formData.append('correctedBy', $('#correctedBy_' + item_id).val());
        // console.log( $('#correctedBy_' + item_id).val());

        if ($('#image_' + item_id)[0].files.length > 0) {
            formData.append('image', $('#image_' + item_id)[0].files[0]);
        }
        $.ajax({
            url: save_inspection_details,
            type: "POST",
            data: formData,
            dataType: "json",
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) { },
            error: function (jqXHR, textStatus, errorThrown) {
                var error = jqXHR.responseJSON;
                var error_title = "";
                if (typeof error.message !== 'undefined') {
                    console.log(error.message);
                    error_title = 'Inspection Details save error: ' + errorThrown;
                }
                else {
                    error_title = 'Have some problem while saving Abstruct and Surveys, Please try again later';
                }

                Swal.fire({
                    icon: 'error',
                    title: error_title
                });
            }
        });
    });
}

function fetchFoodCode(element) {
    var data_inspection_row = element.parents('div.inspectionRow').attr('data-item-id');
    element.autocomplete({
        source: function (request, response) {
            $.ajax({
                url: live_search_food_code,
                type: 'POST',
                dataType: "JSON",
                data: { _token: CSRF_TOKEN, query: request.term },
                success: function (data) { response(data); }
            });
        },
        minLength: 1,
        select: function (event, ui) {
            if (ui.item.id == '') {
                $('input[type="hidden"]#foodCodeId_' + data_inspection_row).val('');
                element.val('');
                // $('input[type="text"]#foodCode_'+data_inspection_row).val('');
                $('input[type="text"]#foodCodeDescription_' + data_inspection_row).val('');

            } else {
                $('input[type="hidden"]#foodCodeId_' + data_inspection_row).val(ui.item.id);
                element.val(ui.item.label);
                // $('input[type="text"]#foodCode_'+data_inspection_row).val(ui.item.code);
                $('input[type="text"]#foodCodeDescription_' + data_inspection_row).val(ui.item.description);

            }
            return false;
        }
    });
}



function toggle(element, point) {
    var Oldclass = element.className.split(" ")[7];
    var name = element.name.split('_')[0];
    const val = (Oldclass == 'btn-default') ? 1 : "";
    switch (name) {
        case 'C':
            $(element).removeClass(Oldclass);
            if (Oldclass != 'btn-success') {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-success');
                $(element).val(val);
            }
            else {
                $(element).removeClass('btn-success');
                $(element).addClass('btn-default');
                $(element).val("");
            }
            $(element).siblings('button').removeClass('btn-success btn-info').addClass('btn-default');
            $(element).siblings('button').val("");
            break;
        case 'CN':
            $(element).removeClass(Oldclass);
            if (Oldclass != 'btn-success') {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-success');
                $(element).val(val);
            }
            else {
                $(element).removeClass('btn-success');
                $(element).addClass('btn-default');
                $(element).val("");
            }
            $(element).siblings('button').removeClass('btn-success btn-info').addClass('btn-default');
            $(element).siblings('button').val("");
            break;
        case 'R':
            var out_btn_val_c = $(element).siblings('button[name*=C]')[0].value;
            var out_btn_val_cn = $(element).siblings('button[name*=CN]')[0].value;
            if (out_btn_val_c != "" || out_btn_val_cn != "") {
                if (Oldclass != 'btn-info') {
                    $(element).removeClass('btn-default');
                    $(element).addClass('btn-info');
                    $(element).val(val);
                }
                else {
                    $(element).removeClass('btn-info');
                    $(element).addClass('btn-default');
                    $(element).val("");
                }
            }
            break;
    }
}

function setPreview(element) {
    if (element.files && element.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(element).closest('div.row').find('img').attr('src', e.target.result).width(48).height(48);
        };
        reader.readAsDataURL(element.files[0]);
    }
}

function removeInspection(element) {
    element.closest('div.inspectionRow').remove();
}

function validateBasic() {
    var permit_fee_id = $('#permit_fee_id').val();
    $('#permit_fee_id').removeClass('border-danger');
    if (permit_fee_id == '') {
        Swal.fire({
            icon: 'info',
            title: 'Please select Establishment Type'
        });
        $('#permit_fee_id').addClass(' border-danger');
        return false;
    }

    var fileDate = $('#permit_file_date').val();
    $('#permit_file_date').removeClass('border-danger');
    if (fileDate != '') {
        //alert(fileDate);
        if (!validateDateMDY(fileDate)) {
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
    if (expirationDate != '') {
        if (!validateDateMDY(expirationDate)) {
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
    if (owner_name == '') {
        Swal.fire({
            icon: 'info',
            title: 'Please fill Owner Name'
        });
        $('#owner_name').addClass(' border-danger');
        return false;
    }

    var owner_email = $('input#owner_email').val();
    $('input#owner_email').removeClass('border-danger');
    if (owner_email !== '' && !isEmail(owner_email)) {
        Swal.fire({
            icon: 'error',
            title: 'Email Format is not Correct'
        });
        $('input#owner_email').addClass(' border-danger');
        return false;
    }

    var territory_id = $('#territory_id').val();
    $('#territory_id').removeClass('border-danger');
    if (territory_id == '') {
        Swal.fire({
            icon: 'info',
            title: 'Please select Territory'
        });
        $('#territory_id').addClass(' border-danger');
        return false;
    }

    var est_name = $('#est_name').val();
    $('#est_name').removeClass('border-danger');
    if (est_name == '') {
        Swal.fire({
            icon: 'info',
            title: 'Please fill the Establishment Name'
        });
        $('#est_name').addClass(' border-danger');
        return false;
    }



    var mailing_address = $('#mailing_address').val();
    $('#mailing_address').removeClass('border-danger');
    if (mailing_address == '') {
        Swal.fire({
            icon: 'info',
            title: 'Please fill The Mailing Address'
        });
        $('#mailing_address').addClass(' border-danger');
        return false;
    }

    return true;
}

function makeTabActiveById(id,currentPage) {
    //var prevId = id - 1;border-danger
    if (id == 2) {
        var estName = $('#estName').val();
        $('#estName').removeClass('border-danger');
        if(estName == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Enter Establishment Name'
            });
            $('#estName').addClass(' border-danger');
            return false;
        }
        var date = $('#inspectionDate').val();
        $('#inspectionDate').removeClass('border-danger');
        if(date == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Select Inspection Date'
            });
            $('#inspectionDate').addClass(' border-danger');
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

        console.log(id,currentPage);
        if(id > currentPage){
            var myForm  = document.getElementById(" ");
            var formData = new FormData();
            formData.append('permitId', $('#permitId').val());
            formData.append('scheduleId', $('#scheduleId').val());
            formData.append('ownerId', $('#ownerId').val());

            formData.append('permitNumber', $('#permitNumber').val());
            formData.append('estName', $('#estName').val());
            formData.append('estAddress', $('#estAddress').val());
            formData.append('purpose', $('#purpose').val());
            formData.append('inspectorId', $('#inspectorId').val());

            formData.append('personIncharge', $('#personIncharge').val());
            formData.append('responsiblePersonEmail', $('#responsiblePersonEmail').val());
            formData.append('certifiedFoodHandler', $('#certifiedFoodHandler').val());
            formData.append('inspectionDate', $('#inspectionDate').val());
            formData.append('releaseDate', $('#releaseDate').val());
            formData.append('menuType', $('#menuType').val());
            formData.append('scheduleId', $('#scheduleId').val());

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
            console.log(inspectionId);
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
