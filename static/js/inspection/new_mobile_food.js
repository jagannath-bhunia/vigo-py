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

var permit_id = $('input[type="hidden"]#permitId').val();
// var permit_type_id = $('input#permit_type_id').val();
// var permit_type = $('input[type="hidden"]#permit_type').val();
var permit_number = $('input#permit_number').val();

$(document).ready(function(){

    $('button#btnTempAddMore').on({
        "mouseover": function(){
            $(this).addClass(' bg-info');
        },
        "mouseout": function(){
            $(this).removeClass(' bg-info');
        },
        "click": function(){
            var maxInspectionId = 0;
            $('div.tempRow').each(function(){
                var inspectionId = parseInt($(this).attr('data-item-id'));
                if(maxInspectionId < inspectionId){
                    maxInspectionId = inspectionId;
                }
            });
            maxInspectionId++;
            var inspection = $('div[data-item-id = "1"].tempRow').clone();
            var newInspection = inspection.clone();
            newInspection.find('div.removeTemp').removeClass(' d-none');
            newInspection.find('input[name*=item_id]').val(maxInspectionId);
            newInspection.find('h6.temperature').text('Temperature_'+maxInspectionId);
            newInspection.find('input.location').attr("value","");
            newInspection.find('input.temp').attr("value","");

            var htmlToInsert = `<div class="row tempRow" data-item-id = "${maxInspectionId}">`;
            htmlToInsert += newInspection.html() + `</div>`;
            htmlToInsert = htmlToInsert.replace(/_1/g,"_"+maxInspectionId);
            $(htmlToInsert).insertBefore($(this));
        }
    });

    $('#finalSubmitBtn').click(function(){
        // if(!validateBasic()){
        //     return  false;
        // }inspectionForm
        // var myForm  = document.getElementById("inspectionForm");
        console.log($('input[type="hidden"]#permitId').val());
        console.log($('input#permit_number').val());

        var formData = new FormData();
        formData.append('inspectionId', inspectionId);
        formData.append('followUp', $('#followUp').val());

        formData.append('generalComment', $('#generalComment').val());
        formData.append('receivedSignatureDate', $('#receivedSignatureDate').val());
        formData.append('inspectedSignatureDate', $('#inspectedSignatureDate').val());
        formData.append('receivedBy', $('#receivedBy').val());
        formData.append('inspectedBy', $('#inspectedBy').val());
        formData.append('time_out', $('#time_out').val());

        formData.append('permitId',$('input[type="hidden"]#permitId').val());
        formData.append('permitNumber',$('input#permit_number').val());




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
        case 'Outbtn':
            //$(element).removeClass(Oldclass);
            if(Oldclass!='btn-danger')
            {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-danger');
                $(element).val(val);
            }
            else
            {
                $(element).removeClass('btn-danger');
                $(element).addClass('btn-default');
                $(element).val("");
            }
            $(element).siblings('button').removeClass('btn-success btn-secondary btn-primary btn-warning btn-info').addClass('btn-default');
            $(element).siblings('button').val("");

            break;
        case 'Inbtn':
            $(element).removeClass(Oldclass);
            if(Oldclass!='btn-success')
            {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-success');
                $(element).val(val);
            }
            else
            {
                $(element).removeClass('btn-success');
                $(element).addClass('btn-default');
                $(element).val("");
            }
            var out_btn_val = $(element).siblings('button[name*=Outbtn]')[0].value;
            $(element).siblings('button').removeClass('btn-danger btn-secondary btn-primary btn-warning btn-info').addClass('btn-default');
            $(element).siblings('button').val("");

            break;
        case 'Nobtn':
            $(element).removeClass(Oldclass);

            if(Oldclass!='btn-primary')
            {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-primary');
                $(element).val(val);
            }
            else
            {
                $(element).removeClass('btn-primary');
                $(element).addClass('btn-default');
                $(element).val("");
            }
            var out_btn_val = $(element).siblings('button[name*=Outbtn]')[0].value;
            $(element).siblings('button').removeClass('btn-danger btn-secondary btn-success btn-warning btn-info').addClass('btn-default');
            $(element).siblings('button').val("");

            break;
        case 'Nabtn':
            $(element).removeClass(Oldclass);
            if(Oldclass!='btn-warning')
            {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-warning');
                $(element).val(val);
            }
            else
            {
                $(element).removeClass('btn-warning');
                $(element).addClass('btn-default');
                $(element).val("");
            }
            var out_btn_val = $(element).siblings('button[name*=Outbtn]')[0].value;
            $(element).siblings('button').removeClass('btn-danger btn-secondary btn-success btn-primary btn-info').addClass('btn-default');
            $(element).siblings('button').val("");

            break;
        case 'Cosbtn':
            var out_btn_val = $(element).siblings('button[name*=Outbtn]')[0].value;
            if(out_btn_val!="")
            {
                $(element).removeClass(Oldclass);
                if(Oldclass!='btn-secondary')
                {
                    $(element).removeClass('btn-default');
                    $(element).addClass('btn-secondary');
                    $(element).val(val);
                }
                else
                {
                    $(element).removeClass('btn-secondary');
                    $(element).addClass('btn-default');
                    $(element).val("");
                }
                $(element).siblings('button[name*=Rbtn]').removeClass('btn-info').addClass('btn-default');
                $(element).siblings('button[name*=Rbtn]').val("");
            }

            break;
        case 'Rbtn':
            var out_btn_val = $(element).siblings('button[name*=Outbtn]')[0].value;
            if(out_btn_val!="")
            {
                $(element).removeClass(Oldclass);
                if (Oldclass != 'btn-info')
                {
                    $(element).removeClass('btn-default');
                    $(element).addClass('btn-info');
                    $(element).val(val);
                }
                else
                {
                    $(element).removeClass('btn-info');
                    $(element).addClass('btn-default');
                    $(element).val("");
                }
                $(element).siblings('button[name*=Cosbtn]').removeClass('btn-secondary').addClass('btn-default');
                $(element).siblings('button[name*=Cosbtn]').val("");
            }

            break;
    }
}

function submitSectionWiseInspectionDetails()
{
    console.log(inspectionId);
    saveInspectionDetails(inspectionId);
}

function saveInspectionDetails(inspectionId){
    $('div.panel').each(function(){




        var item_id = $(this).attr('data-item-id');
        // let looping_id = codeAndComments.getAttribute("data-looping-id");
        var point = $('#point_'+item_id).val();
        var out = $('#Outbtn_'+item_id).val();
        var inbtn = $('#Inbtn_'+item_id).val();
        var no = $('#Nobtn_'+item_id).val();
        var na = $('#Nabtn_'+item_id).val();
        var cos = $('#Cosbtn_'+item_id).val();
        var r = $('#Rbtn_'+item_id).val();

        var comment = $('#comment_'+item_id).val();

        // var codeId = $('#code_'+item_id).val();
        var description = $('#description_'+item_id).val();

        var image = $('#image_'+item_id)[0].files[0];

        var formData = new FormData();
        formData.append('inspectionId',inspectionId);
        formData.append('itemId',item_id);
        formData.append('point', point);

        formData.append('out', out);
        formData.append('in', inbtn);
        formData.append('no', no);
        formData.append('na', na);
        formData.append('cos', cos);
        formData.append('r', r);
        formData.append('comment',comment);
        // formData.append('code_id',selectedItems);

        // formData.append('selected_codes', JSON.stringify(selectedItems));


        for(let i=1;i<=5;i++){
            formData.append('code_' + i + '_' + item_id, $('#code_' + i + '_' + item_id).val());
            formData.append('description_' + i + '_' + item_id, $('#description_' + i + '_' + item_id).val());
            formData.append('looping_id' + i + '_' + item_id, i);


        }





        formData.append('description',description);

        // if($('#image_'+item_id)[0].files.length > 0){
            formData.append('image',image);
            formData.append("hasFile", $("#hasFile_" + item_id).val());
        // }
        if(comment!="" || typeof image!="undefined" || out!="" || inbtn!="" || no!=""
                        || na!="" || cos!="" || r!="" )
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
                success:function(response){},
                error:function(jqXHR, textStatus, errorThrown){
                    var error = jqXHR.responseJSON;
                    var error_title = "";
                    if(typeof error.message !== 'undefined'){
                        console.log(error.message);
                        error_title = 'Inspection Details save error: '+errorThrown;
                    }
                    else
                    {
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



function showCodeDescription(e) {

    // var baseDesc = $(e.target).find('option:selected').data('data-base-description');
    // var itemId = $(e.target).find('option:selected').data('data-item-id');
    var itemId = e.target.options[e.target.selectedIndex].getAttribute("data-item-id");
    var baseDesc = e.target.options[e.target.selectedIndex].getAttribute("data-base-description");
    var loopId = e.target.options[e.target.selectedIndex].getAttribute("loop_id");


    $("#description_" + loopId + "_" + itemId).val(baseDesc);
    console.log("#description_" + loopId + "_" + itemId);








}

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

                console.log(data)
                if(data.length>0)
                {
                    response($.map(data, function (item) {
                         return {
                            value: item.label,
                            permitId: item.id,
                            permit_number : item.permit_number,
                            est_address : item.est_address,
                            est_city : item.est_city,
                            est_state : item.est_state,
                            est_zip : item.est_zip,
                            est_phone : item.est_phone,
                            contact: item.contact,
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
                    $('#est_city').val('');
                    $('#est_state').val('');
                    $('#est_zip').val('');
                    $('#est_phone').val('');

                    $('#contact').val('');
                    $('#owner_name').val('');
                    $('#ownerAddress').val('');
                    $('#ownerCity').val('');
                    $('#ownerState').val('');
                    $('#ownerZip').val('');
                    $('#ownerPhone').val('');

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
            $('#est_city').val('');
            $('#est_state').val('');
            $('#est_zip').val('');
            $('#est_phone').val('');
            $('#contact').val('');
            $('#owner_name').val('');
            $('#ownerAddress').val('');
            $('#ownerCity').val('');
            $('#ownerState').val('');
            $('#ownerZip').val('');
            $('#ownerPhone').val('');


        }else{
            $('#permitId').val(ui.item.permitId);
            $('#permit_number').val(ui.item.permit_number);
            $('#est_name').val(ui.item.label);
            $('#est_address').val(ui.item.est_address);
            $('#est_city').val(ui.item.est_city);
            $('#est_state').val(ui.item.est_state);
            $('#est_zip').val(ui.item.est_zip);
            $('#est_phone').val(ui.item.est_phone);

            $('#contact').val(ui.item.contact);
            $('#owner_name').val(ui.item.ownerName);
            $('#ownerAddress').val(ui.item.ownerAddress);
            $('#ownerCity').val(ui.item.ownerCity);
            $('#ownerState').val(ui.item.ownerState);
            $('#ownerZip').val(ui.item.ownerZip);
            $('#ownerPhone').val(ui.item.ownerPhone);

        }
        return false;
    }
});



function makeTabActiveById(id, currentPage)
{
    if(id == 2){
        var permitId = $('#permitId').val();
        $('#est_name').removeClass('border-danger');
        if(permitId == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Selest the Establishment Name'
            });
            $('#est_name').addClass(' border-danger');
            return false;
        }

        var inspection_date = $('#inspection_date').val();
        $('#inspection_date').removeClass('border-danger');
        if(inspection_date!=''){
            if(!validateDateMDY(inspection_date)){
                Swal.fire({
                    icon: 'warning',
                    title: 'Date Format is not valid'
                });
                $('#inspection_date').addClass(' border-danger');
                return false;
            }
        }
        else {
            Swal.fire({
                icon: 'info',
                title: 'Please enter Inspection date.'
            });
            $('#inspection_date').addClass(' border-danger');
            return false;
        }
        var inspector_id = $('#inspector_id').val();
        $('#inspector_id').removeClass('border-danger');
        if(inspector_id == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please select Inspector'
            });
            $('#inspector_id').addClass(' border-danger');
            return false;
        }



        var purpose_id = $('#purpose_id').val();
        $('#purpose_id').removeClass('border-danger');
        if(purpose_id == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please select Inspection Purpose'
            });
            $('#purpose_id').addClass(' border-danger');
            return false;
        }





        if(id > currentPage){

            var formData = new FormData();
            formData.append('permitId', $('#permitId').val());
            formData.append('permit_number', $('#permitNumber').val());

            formData.append('est_name', $('#est_name').val());
            formData.append('owner_name', $('#owner_name').val());
            formData.append('est_address', $('#est_address').val());
            formData.append('est_phone', $('#est_phone').val());
            formData.append('time_in', $('#time_in').val());
            formData.append('person_in_charge', $('#person_in_charge').val());
            formData.append('inspection_date', $('#inspection_date').val());
            formData.append('inspector_id', $('#inspector_id').val());
            formData.append('purpose_id', $('#purpose_id').val());
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
            saveInspectionDetails(inspectionId);
            setTimeout(function(){
                $('#overlay').hide();
            },5000);
        }
    }else if(id == 4){
        if(id > currentPage){
            console.log(id);

            saveNewFoodTemp(inspectionId);
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

function saveNewFoodTemp(inspection_id)
{
    console.log(inspection_id);
    var locationArray = $('input[name="location[]"]').map(function(){
        return this.value;
    }).get();

    var tempArray = $('input[name="temp[]"]').map(function(){
        return this.value;
    }).get();

    $.ajax({
        headers: {
            'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content')
        },
        url: mobile_temperature_submit_route,
        type: "POST",
        data: {
            inspection_id:inspection_id,
            locations:locationArray,
            temps:tempArray
        },
        success: function (data) {
        },
        error: function (xhr,status,error) {
            alert('Error: '+error);
        }
    }).done(function () {

    });

}
