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
var totalUploadedImg = 0;

var permit_id = $('input[type="hidden"]#id').val();
var permit_type_id = $('input#permit_type_id').val();
var permit_type = $('input[type="hidden"]#permit_type').val();
var permit_number = $('input#permit_number').val();
var permit_fee = $('input[type="hidden"]#permit_fee_amount_db').val();

$(document).ready(function () {
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
                                ownerId: item.owner_id,
                                ownerName: item.owner_name,
                                ownerAddress: item.owner_address,
                                ownerCity: item.owner_city,
                                ownerState: item.owner_state,
                                ownerZip: item.owner_zip,
                                ownerHomePhone: item.owner_home_phone,
                                ownerCellPhone: item.owner_cell_phone,
                                pool_operator_name: item.pool_operator_name,

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
                        $('#pool_operator_name').val('');


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
                $('#pool_operator_name').val('');


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
                $('#pool_operator_name').val(ui.item.pool_operator_name);

            }
            return false;
        }
    });

    $('#finalSubmitBtn').click(function () {
        // if(!validateBasic()){
        //     return  false;
        // }inspectionForm
        var formData = new FormData();
        formData.append('permitId', $('#permitId').val());
        formData.append('scheduleId', $('#scheduleId').val());

        formData.append('inspectionId', inspectionId);
        formData.append('followUp', $('#followUp').val());
        formData.append('status', $('#status').val());
        formData.append('generalComment', $('#generalComment').val());
        formData.append('receivedSignatureDate', $('#receivedSignatureDate').val());
        formData.append('inspectedSignatureDate', $('#inspectedSignatureDate').val());
        formData.append('receivedBy', $('#receivedBy').val());
        formData.append('inspectedBy', $('#inspectedBy').val());
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
    $('#inspectionDate').focusout(function () {
        var date = $(this).val();
        date = moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD');
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 11);
        newDate = moment(newDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
        $('#releaseDate').val(newDate);
    });
    $('select#purpose').change(function (){

        var data = $('option:selected', this).attr("data-name");
        console.log(data);
        if(data == "Other"){
            $('div.otherPurpose').removeClass('hideOnLoad');
        }
        else {
            $('div.otherPurpose').addClass('hideOnLoad');
        }
    });
});
function unselectOthers(element)
{
    element.parents('.row').siblings('.row').find('a').removeClass('active').css({"color": "#17a2b8"});
    element.css({"color": "white"});
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
function setPreview(element) {
    if (element.files && element.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(element).closest('div.row').find('img').attr('src', e.target.result).width(48).height(48);
        };
        reader.readAsDataURL(element.files[0]);
    }
}

function toggle(element, point) {
    var Oldclass = element.className.split(" ")[7];
    var name = element.name.split('_')[0];
    const val = (Oldclass == 'btn-default') ? 1 : "";
    switch (name) {
        case 'Yesbtn':
            $(element).removeClass(Oldclass);
            if (Oldclass != 'btn-success') {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-success');
                $(element).val(val);
                $(element).parents('div.panel').find('span.checkboxes').removeClass('d-none');
            }else {
                $(element).removeClass('btn-success');
                $(element).addClass('btn-default');
                $(element).val("");
                $(element).parents('div.panel').find('span.checkboxes').addClass(' d-none');
                $(element).parents('div.panel').find('span.checkboxes').find('input[type="checkbox"]').prop("checked", false);
            }
            $(element).siblings('button').removeClass('btn-success').addClass('btn-default');
            $(element).siblings('button').val("");
        break;

    }
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

    /* var fmc_user_id = $('#fmc_user_id').val();
     $('#manager_name').removeClass('border-danger');
     if(fmc_user_id == ''){
         Swal.fire({
             icon: 'info',
             title: 'Please select Manager'
         });
         $('#manager_name').addClass(' border-danger');
         return false;
     }*/

    return true;
}

function makeTabActiveById(id,currentPage) {
    //var prevId = id - 1;border-danger
    if (id == 2) {
        var permitId = $('#permitId').val();
        $('#estName').removeClass('border-danger');
        if(permitId == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Select Establishment Name'
            });
            $('#estName').addClass(' border-danger');
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
            formData.append('permitId', $('#permitId').val());
            formData.append('est_name', $('#est_name').val());
            formData.append('est_address', $('#est_address').val());
            formData.append('permit_number', $('#permit_number').val());
            formData.append('inspectionDate', $('#inspectionDate').val());
            formData.append('purpose', $('#purpose').val());
            formData.append('otherPurpose', $('#otherPurpose').val());
            formData.append('inspector_id', $('#inspector_id').val());
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

    } else if(id == 3){
        if(id > currentPage){
            console.log(inspectionId);
            saveInspectionDetails(inspectionId);
            setTimeout(function(){
                $('#overlay').hide();
            },5000);
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
function saveInspectionDetails(inspectionId) {
    $('div.inspectionRow').each(function () {

        var item_id = $(this).attr('data-item-id');
        var yes = $('#Yesbtn_' + item_id).val();
        var other = $('#other_' + item_id).val();
        var comment = "";
        if($('#comment_'+item_id).length){
            comment = $('#comment_'+item_id).val().trim();
        }
        var image = $('#image_' + item_id)[0].files[0];
        var formData = new FormData();
        formData.append('inspectionId', inspectionId);
        formData.append('itemId', item_id);
        formData.append('Yes', $('#Yesbtn_' + item_id).val());
        formData.append('other', $('#other_' + item_id).val());
        formData.append('comment', comment);
        if ($('#image_' + item_id)[0].files.length > 0) {
            formData.append('image', $('#image_' + item_id)[0].files[0]);
        }
        if(comment!="" || typeof image!="undefined" || yes!="" || other!=""  )
        {
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
        }

    });
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


