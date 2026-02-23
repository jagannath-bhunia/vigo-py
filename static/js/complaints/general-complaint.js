if($('table.dataTable').length){
    $('table.dataTable').DataTable({

    });
}
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
$(function () {
    $('[data-mask]').inputmask();

    $('#inputOrderedDateTime, #inputIllnessDateTime').daterangepicker({
        timePicker: true,
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 2020,
        maxYear: parseInt(moment().format('YYYY')),
        maxDate: new Date(),
        applyButtonClasses: 'btn-info rounded-0',
        autoUpdateInput: false
    }, function(chosen_date) {
        $(this.element[0]).val(chosen_date.format('MM/DD/YYYY hh:mm A'));
    });
    $('#inputTimeEaten, #inputTimeContactedInspector').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        timePickerIncrement: 1,
        locale: {
            format: 'hh:mm A'
        }
    }).on('show.daterangepicker', function (ev, picker) {
        picker.container.find(".calendar-table").hide();
    });

    $( "#permitNumber" ).autocomplete({
        source: function( request, response ) {
            var category = $('.category:checked').val();
            if(!category){
                alert( 'Please select a category');
                $("#permitNumber").val('');
                return false;
            }
            var complaintTypeId = $('.category:checked').val();
            var otherComplaint = $('#otherComplaint').val();
            $.ajax({
                url:liveSearchPermitNumber,
                type: 'POST',
                dataType: "JSON",
                data: {
                    query: request.term,
                    permitType:'septic',
                    otherComplaint:otherComplaint,
                    complaintTypeId:complaintTypeId
                },
                success: function( data ) {
                    response( data );
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if(ui.item.id == ''){
                $('#permitNumber').val('');
                $('#permit_id').val('');
                $('#ownerName').val('');
                $('#ownerAddress').val('');

                $('#owner_id').val('');
                $('#location').val('');
            }else{
                $('#permitNumber').val(ui.item.label);
                $('#permit_id').val(ui.item.id);
                $('#ownerName').val(ui.item.ownerName);
                $('#ownerAddress').val(ui.item.ownerAddress);
                $('#owner_id').val(ui.item.ownerId);
                $('#location').val(ui.item.location);
            }
            return false;
        }
    });


    $('button#uploadNote').click(function () {
        //var item_id = $(this).attr('data-itemId');
        var thisElement = $(this);
        var note = $('textarea#note').val();
        if(!note){
            $('textarea#note').addClass(' border-danger');
            return false;
        }
        var formData = new FormData();
        // var permit_id = $('input[type="hidden"]#id').val();
        // var permit_type = $('input[type="hidden"]#permit_type').val();
        formData.append('note', note);
        formData.append('complaint_id', $('#complaint_id').val());
        formData.append('complaintType',$('#complaintType').val());
        //formData.append('item_id', item_id);

        /// Save Inspection Details
        $.ajax({

            url: upload_notes_route,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            async:false,
            beforeSend: () => {

            },
            success: (data) => {
                //console.log(data.message);
                Swal.fire({
                    // position: 'top-end',
                    icon: 'success',
                    title: data.message,
                    showConfirmButton: false,
                    timer: 2000
                });


                console.log(data.created_at);

                var newRow = '<tr class="note_row bg-success" data-id = ' + data.note.id +'>'

                    +'   <td >' + data.created_at + '</td>'
                    +'   <td >' + authUser + '</td>'
                    +'   <td >' + note + '</td>'

                    +'   <td >'
                    //+'     <a href="javascript:void(0);" class="btn btn-info btn-xs btn-flat text-white">Edit</a>'

                    +'     <button type="button" class="btn btn-danger btn-xs btn-flat" onclick="deleteNote($(this));">Delete</button>'
                    +'   </td>'
                    +'</tr>';
                //$('div#addNoteModal').hide('slow');
                if($('input#uploadNotePurpose').val() == 'changeStatus'){
                    changeComplaintStatus('4',$(this),1);
                }


                hideModal('addNoteModal');
                // if($('table#notes tbody tr td').html().trim() == 'No data available in table'){
                //     $('table#notes tbody').html('');
                // }
                // $('table#notes tbody').append(newRow);
                const table = $('table#notes').DataTable();
                const tr = $(newRow);
                table.row.add(tr[0]).draw();
            },
            error: (xhr,status,error) => {
                //debugger;
                console.log('Notes Error:-'+xhr.responseJSON.message);
                $('#overlay').hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Notes Error: '+error,
                });
            }
        });
    });

    $('button#uploadDoc').click(function () {
        $('input[type="text"]#docName').removeClass('border-danger');
        var thisElement = $(this);
        var doc_id = $('input[type="hidden"]#doc_id').val();
        var docName = $('input[type="text"]#docName').val();
        var note = $('input[type="text"]#note').val();
        if(!docName){
            $('input[type="text"]#docName').addClass(' border-danger');
            return false;
        }
        if($('#file')[0].files.length === 0 && !doc_id){
            $('#file').addClass(' border-danger');
            return false;
        }
        var formData = new FormData();
        formData.append('doc_id',doc_id);
        formData.append('docName', docName);
        formData.append('document', $('input[type="file"]#file')[0].files[0]);

        formData.append('note', note);
        formData.append('complaint_id', $('#complaint_id').val());
        formData.append('complaintType',$('#complaintType').val());
        $.ajax({
            url: uploadDocumentRoute,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            async:false,
            beforeSend: function () {
                $('button#uploadDoc').prop('disabled',true);
                $('#overlay').show();
            },
            success: function (data) {
                $('#overlay').hide();

                var document = data.document;
                Swal.fire({
                    icon: 'success',
                    title: data.message,
                    showConfirmButton: false,
                    timer: 2000
                });
                var row_content = '<td >' + document.docName + '</td>'
                    +  '<td >'
                    +       '<a href="' + getViewDocURL(document.id) + '" target="_blank" class="btn btn-info btn-xs btn-flat text-white"><i class="fas fa-eye"></i></a>'
                    +   '</td>'
                    +  '<td >' + document.note + '</td>'
                    +  '<td >' + authUser + '</td>'
                    +  '<td >'
                    // +     '<button type="button" class="btn btn-info btn-xs btn-flat text-white" onclick="editDoc($(this));">Edit</button>'
                    +     '<button type="button" class="btn btn-danger btn-xs btn-flat" onclick="deleteDoc($(this));">Delete</button>'
                    +   '</td>';

                if(doc_id){
                    $('tr[data-id = "'+doc_id+'"].doc_row').html('')
                    $('tr[data-id = "'+doc_id+'"].doc_row').html(row_content);
                    $('tr[data-id = "'+doc_id+'"].doc_row').addClass(' bg-success');
                }
                else{
                    var newRow = '<tr class="doc_row bg-success" data-id = "' + document.id + '">' + row_content + '<tr>';
                    if($('table#documents tbody tr td').html().trim() == 'No data available in table'){
                        $('table#documents tbody').html('');
                    }
                    $('table#documents tbody').append(newRow);
                }

                $('#addDocModal').modal('hide');
                $('button#uploadDoc').prop('disabled',false);

            },
            error:function (xhr,status,error)
            {
                console.log('Document Error:-'+xhr.responseJSON.message);
                $('#overlay').hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Document Error: '+error,
                });
                $('button#uploadDoc').prop('disabled',false);
            }
        });
    });
});

function saveComplaint(saveType){
    //e.preventDefault();
    var complaint_id = '';
    if($('#complaint_id').length){
        complaint_id = $('#complaint_id').val();
    }
    var complaintNo = $("#complaintNo").val();
    var complaintNature = $("#complaintNature").val();
    if(complaintNature == ''){
        alert('Please enter details of complaints');
        $("#complaintNature").focus();
        return false;
    }
    var permitNumber = $("#permitNumber").val();
    var permit_id = $("#permit_id").val();
    var ownerName = $("#ownerName").val();
    var ownerPhone = $("#ownerPhone").val();

    var owner_id = $("#owner_id").val();
    var location = $("#location").val();
    var complainantName = $("#complainantName").val();
    var complainantAddress = $("#complainantAddress").val();
    // var complainantCity = $("#complainantCity").val();
    // var complainantState = $("#complainantState").val();
    // var complainantZip = $("#complainantZip").val();
    var complainantPhone = $("#complainantPhone").val();
    // var complainantEmail = $("#complainantEmail").val();
    var inspector_id = $("#inspector_id").val();
    var complainantDate = $("#complainantDate").val();
    var ownerAddress = $("#ownerAddress").val();
    var time = $("#time").val();
    var directions = $("#directions").val();
    var anonymous = $("#anonymous").val();
    var subject = $("#subject").val();
    var initial = $("#initial").val();
    var facility = $("#facility").val();
    var section = $("#section").val();
    var townshipStreet = $("#townshipStreet").val();
    var withOutPermit = $("#withOutPermit:checked").val();
    console.log(withOutPermit);
    if(complainantDate == ''){
        alert('Please select date');
        $("#complainantDate").focus();
        return false;
    }

    var category = $('.category:checked').map(function(){
        return this.value;
    }).get();

    // var inputScannedDoc = $("#inputScannedDoc")[0].files[0];

    // var myForm  = document.getElementById("frmPermitInfoData");

    var formdata = new FormData();
    formdata.append('complaint_id',complaint_id);
    formdata.append('complaintcategory',category);
    formdata.append('otherComplaint',$('#otherComplaint').val());

    formdata.append('complaintNo',complaintNo);
    formdata.append('complaintNature',complaintNature);
    formdata.append('permitNumber',permitNumber);
    formdata.append('permit_id',permit_id);
    formdata.append('ownerName',ownerName);
    formdata.append('ownerPhone',ownerPhone);

    
    formdata.append('owner_id',owner_id);
    formdata.append('location',location);
    formdata.append('complainantName',complainantName);
    formdata.append('complainantAddress',complainantAddress);
    // formdata.append('complainantCity',complainantCity);
    // formdata.append('complainantState',complainantState);
    // formdata.append('complainantZip',complainantZip);
    formdata.append('complainantPhone',complainantPhone);
    // formdata.append('complainantEmail',complainantEmail);
    formdata.append('complainantDate',complainantDate);
    formdata.append('inspector_id',inspector_id);
    // formdata.append('inputScannedDoc',inputScannedDoc);
    formdata.append('ownerAddress',ownerAddress);
    formdata.append('time',time);
    formdata.append('directions',directions);
    formdata.append('anonymous',anonymous);
    formdata.append('subject',subject);
    formdata.append('initial',initial);
    formdata.append('facility',facility);
    formdata.append('section',section);
    formdata.append('townshipStreet',townshipStreet);
    formdata.append('withOutPermit',withOutPermit? withOutPermit : 0);
    // formdata.append('inputScannedDoc',inputScannedDoc);
    $.ajax({
        url: septicComplaintsStore,
        type: "POST",
        data: formdata,
        contentType: false,
        processData: false,
        beforeSend: function(){
            $("#createComplaintProcessMsgBox").removeClass('d-none');
            $("#createComplaintErrorMsgBox").addClass('d-none');
        },
        success: function(response){
            $("#createComplaintProcessMsgBox").addClass('d-none');
            $("#createComplaintSuccessMsgBox").removeClass('d-none');

            var delay = 1500;
            setTimeout(() => {
                window.location.reload();

            }, delay);
        },
        error: function(jqXHR,status,errorThrown) {
            $("#createComplaintProcessMsgBox").addClass('d-none');
            $("#createComplaintSuccessMsgBox").addClass('d-none');
            $("#createComplaintErrorMsgBox").removeClass('d-none');
            var complaintError = jqXHR.responseJSON;
            if(typeof complaintError.message !== 'undefined'){
                console.log(complaintError.message);
            }
        }
    });
}



function saveDocument(complaint_id) {
    //console.log(complaint_id);
    $('div.document_row').each(function(){

        var data_id = $(this).attr('data-id');
        console.log(data_id);
        var formData = new FormData();
        formData.append('complaint_id',complaint_id);
        formData.append('item_id',data_id);
        if($('#inputScannedDoc_' + data_id).length)
        {
            formData.append("image", $("#inputScannedDoc_" + data_id)[0].files[0]);
        }
        formData.append("permit_type","septic");

        $.ajax({
            url: insert_document_url,
            data: formData,
            type: "POST",
            dataType: "JSON",
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response){

            },
            error:function(jqXHR, textStatus, errorThrown){
                var error = jqXHR.responseJSON;
                var error_title = "";
                if(typeof error.message !== 'undefined'){
                    console.log(error.message);
                    error_title = 'Watershed save error: '+errorThrown;
                }
                else
                {
                    error_title = 'Have some problem while saving Watershed, Please try again later';
                }

                Swal.fire({
                    icon: 'error',
                    title: error_title
                });
            }
        });
    });
}
var removeDocument = (element) => {
    var data_document = element.attr('data-document');
    $('div#document_row_'+data_document).remove();
}
$(document).ready(function(){
    $('button#btnAddDocument').on({
        "mouseover": function(){
            $(this).addClass(' bg-info');
        },
        "mouseout": function(){
            $(this).removeClass(' bg-info');
        },
        "click": function(){
            var maxDocument = 0;
            $('a.remove_document').each(function(){
                var data_document = parseInt($(this).attr('data-document'));
                if(maxDocument < data_document){
                    maxDocument = data_document;
                }
            });
            maxDocument++;
            var document = $('div#document_row_1');
            var newDocument = document.clone();
            newDocument.find('div.document').find('label').html('Document '+maxDocument);
            newDocument.find('div.document').find('input').attr('name', 'inputScannedDoc_'+maxDocument).attr('id', 'inputScannedDoc_'+maxDocument).attr("value","");
            newDocument.find('div.delete_document').find('a').attr('data-document', maxDocument);
            newDocument.find('div.delete_document').removeClass('d-none');

            newDocument.find('div.document').find('img').attr('id', 'preview_'+maxDocument);
            newDocument.find('div.document').find('img').attr('src', preview_image);
            newDocument.find('div.document').find('div.image').find('span').attr('id', 'close1_'+maxDocument).attr('data-image', maxDocument);


            var htmlToInsert = '<div class="row document_row" id="document_row_'+maxDocument+'" data-id = "'+maxDocument+'">';
            htmlToInsert += newDocument.html() + '</div>';
            //console.log(htmlToInsert);
            $(htmlToInsert).insertBefore($(this).parents('div.add_new_document_row'));
        }
    });




});
var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
function deleteComplaint(element){
    var id = element.attr('data-id');
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete this permit?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(function(result){
        if(result.value){
            var url = "{{route('septicDelete')}}";
            console.log(id);
            var fd = new FormData();
            // fd.append('_method','DELETE');
            fd.append('_token', CSRF_TOKEN);
            fd.append('id', id);
            $.ajax({
                url: "/complaints/septic/delete/"+id,
                type: "POST",
                data: fd,
                dataType: "json",
                contentType: false,
                processData: false,
                beforeSend: function(){
                    $('#overlay').show();
                },
                success: function(response){
                    $('#overlay').hide();


                    Swal.fire({
                        // position: 'top-end',
                        icon: 'success',
                        title: 'Deleted',
                        showConfirmButton: false,
                        timer: 2000
                    });

                    element.closest('tr').addClass(' bg-danger');
                    setTimeout(function(){
                        element.closest('tr').hide("slow");
                    },3000);

                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseJSON.message);
                    Swal.fire({
                        icon: 'error',
                        title: 'Problem while deleting permit: '+errorThrown,
                    });
                }
            });
        }
    });

}




// On Every click previewComplaintDetails function calling with related complaintId as a parameter
function previewComplaintDetails(complaintId){
    $('#complaintDetailsPreview').modal('show');
    $.ajax({
        url: "{{ url('frontdesk/previewComplaintDeatail') }}/"+complaintId,
        type: "POST",
        contentType: false,
        processData: false,
        // On success getting back the details values for all fields of the preview modal
        success: function(response){
            response.map(function(el){
                statusVal = '';
                statusClass = 'text-';
                // Setting status and text-class depending on status value
                if(el.status == 1){
                    statusVal = 'Pending';
                    statusClass += 'warning';
                }else if(el.status == 2){
                    statusVal = 'Attended';
                    statusClass += 'warning';
                }else if(el.status == 3){
                    statusVal = 'Resolved';
                    statusClass += 'success';
                }
                // Setting preview modal different field value with related data
                $("#inputComplaintID").val(el.complaintId);
                $("#inputLocation").val(el.location);
                $("#inputOwner").val(el.owner);
                $("#inputComplaintDate").val(el.date);
                $("#inputComplaintType").val(el.complaintType);
                $("#inputComplaintCategory").val(el.ComplaintCategory);
                $("#inputComplaintSubject").val(el.subject);
                $("#inputComplaintDetails").val(el.details);
                $("#inputStatus").addClass(statusClass).html(statusVal);
                var signPath = '';
                if(el.document != null){
                    signPath = ""+"/"+el.document;
                    // $("#inputScannedDoc").html('<img src="'+el.document+'" title="Signature" height="175px" >')
                }else{
                    signPath = "{{ asset('dist/img/permit_icon_2.png') }}";
                }
                $('#previewScannedSign').attr('src',signPath);
            })
        }
    })
}

function makeHiddenEmpty(inputFieldId,hdnFieldId)
{
    let val = $('#'+inputFieldId).val();
    if(val == ''){
        $('#'+hdnFieldId).val('');
        $('#hdnAddressId').val('');
        $("#txtAddress").val('');
        $("#txtEstb").val('');
        $("#txtCity").val('');
        $("#txtState").val('');
        $("#txtZip").val('');
    }
}

// New Complaint Image Preview
function setPreview(element){
    if (element.files && element.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(element).closest('div.input-group').find('img').attr('src', e.target.result).width(48).height(48);
        };
        reader.readAsDataURL(element.files[0]);
    }
}

// New Complaint Image Clear
function removeImage(element){
    var data_id = element.attr('data-image');
    console.log(data_id);
    // console.log(id)
    $('#preview_'+data_id).attr('src','../../../dist/img/preview.png');
    $('#close1_'+data_id).css({'display':'none'});
    $('#image2'+data_id).val("");
}

// New Complaint Image Clear Button Action
$('.img-wrap .close').on('click', function() {
    var id = $(this).closest('.img-wrap').find('img').data('id');
    alert('remove picture: ' + id);
});

function getinputGender(data){
    $("#hdninputGender").val(data)
}
function getSelectedSymptoms(data){
    $("#hdnspecificSymptom").val(data)
    if(data == 9){
        $("#otherSymptom").removeClass('d-none');
    }else{
        $("#otherSymptom").removeClass('d-none').addClass('d-none');
    }
}
function getinputDoctorConsulted(data){
    $("#hdninputDoctorConsulted").val(data)
}
function getinputHospital(data){
    $("#hdninputHospital").val(data)
}
function getinputConfirmed(data){
    $("#hdninputConfirmed").val(data)
    if(data == 1){
        $("#symptomsLabTest").removeClass('d-none');
    }else{
        $("#symptomsLabTest").removeClass('d-none').addClass('d-none');
    }
}
function showModal(modal,purpose = null){
    // alert(purpose);
    $('#'+modal).modal('show');
    if(purpose == 'changeStatus'){
        $('input#uploadNotePurpose').val('changeStatus');
    }
    else{
        $('input#uploadNotePurpose').val('');
    }
}

function hideModal(modal){
    $('#'+modal).modal('hide');
    $('#'+modal).find('input').val('');
    $('#'+modal).find('textarea').val('');
    $('input#uploadNotePurpose').val('');
}
function openCaseQuestionnaireModal(element){
    $('div#caseQuestionnairePreview').find('form')[0].reset();
    let dataComplaintId = element.attr('data-complaint-id');
    $('#complaint_id').val(dataComplaintId);
    let dataCaseHistoryId = element.attr('data-case-history-id');
    if(dataCaseHistoryId){
        let fd = new FormData();
        fd.append('id',dataCaseHistoryId);
        $.ajax({
            url: getCaseHistoryById,
            type: "POST",
            data:fd,
            contentType: false,
            processData: false,
            success: function(data, textStatus, jqXHR) {
                //console.log(data);
                $("#inputCaseHistoryComplaintDate").val(data.date_of_complaint ? moment(data.date_of_complaint,'YYYY-MM-DD').format('MM/DD/YYYY') : '');
                $("#inputComplaintTime").val(moment(data.time_of_complaint,'HH:mm:ss').format('hh:mm:ss A'));
                $('#case_history_id').val(data.id);
                $("#inputInspectorName").val(data.name_of_inspector);
                $("#inputDistrictColor").val(data.district_color);
                $("#inputTimeContactedInspector").val(data.time_contacted_inspector ? moment(data.time_contacted_inspector,'HH:mm:ss').format('hh:mm:ss A') : '');
                $("#inputName").val(data.name);
                $("#hdninputGender").val(data.gender);
                if(data.gender == 1){
                    $('#radioPrimary1').prop('checked',true);
                }

                if(data.gender == 2){
                    $('#radioPrimary2').prop('checked',true);
                }
                $('input[name="inputGender]').val(data.gender)
                $("#inputAge").val(data.age);
                $("#inputAddress").val(data.address);
                $("#inputPersonalCity").val(data.city);
                $("#inputZipCode").val(data.zip_code);
                $("#inputTelephoneNumber").val(data.telephone_number);
                $("#inputAltNumber").val(data.alt_number);
                $("#inputOccupation").val(data.occupation);
                $("#inputRestaurantName").val(data.name_of_restaurant);
                $("#inputRestaurantAddress").val(data.address_of_restaurant);
                $("#inputSuspectedCity").val(data.city_1);
                $("#inputMealBeverage").val(data.meal_ordered_w_Beverage);
                $("#inputOrderedDateTime").val(data.date_time_ordered ? moment(data.date_time_ordered,'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY hh:mm A') : '');
                $("#inputTimeEaten").val(moment(data.time_eaten,'HH:mm:ss').format('hh:mm A'));
                $("#inputFoodTypes").val(data.foodtypes_ingredients_of_meal);
                $("#inputBreakfast").val(data.breakfast);
                $("#inputLunch").val(data.lunch);
                $("#inputDinner").val(data.dinner);
                $("#inputVitalInformation").val(data.other_vital_information);
                $("#inputIllnessDateTime").val(data.date_and_time_illness_occured ? moment(data.date_and_time_illness_occured,'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY hh:mm A') : '');
                $("#hdnspecificSymptom").val(data.specific_symptoms);
                var inputOtherSymptom = '';
                if(data.specific_symptoms == 9){
                    $("#inputOtherSymptom").val(data.other_symptom);
                }
                $("#hdninputDoctorConsulted").val(data.doctor_consulted);
                if(data.doctor_consulted == 1){
                    $('#radioPrimary3').prop('checked',true);
                }
                if(data.doctor_consulted == 2){
                    $('#radioPrimary4').prop('checked',true);
                }

                $("#inputDoctorName").val(data.doctors_name);
                $("#inputDoctorPhoneNumber").val(data.doctors_phone_number);

                if(data.hospital == 1){
                    $('#radioPrimary5').prop('checked',true);
                }
                if(data.hospital == 2){
                    $('#radioPrimary6').prop('checked',true);
                }
                $("#hdninputHospital").val(data.hospital);
                $("#inputHospitalName").val(data.name_of_hospital);
                $("#inputHospitalPhoneNumber").val(data.hospitals_phone_number);
                $("#inputIllnessLength").val(data.length_of_illness);
                $("#hdninputConfirmed").val(data.confirmed);
                var inputSymptomsLabTest = '';
                if(data.confirmed == 1){
                    $('#radioPrimary7').prop('checked',true);
                    $("#inputSymptomsLabTest").val();
                }
                if(data.confirmed == 2){
                    $('#radioPrimary8').prop('checked',true);
                }
                $("#inputSuspectedOrganism").val(data.suspected_organism);
                $("#inputOtherInfoMedicine").val(data.other_information);
            }
        });
    }

    let inputComplaintNo = element.attr('data-complaint-number');
    $('#inputComplaintNo').val(inputComplaintNo);
    $('#caseQuestionnairePreview').modal('show');
}


function saveDocumentInEdit() {
    //console.log(complaint_id);

    var complaintId = $('#complaint_id').val();
    var documentDate = $('#documentDate').val();
    if(!validateDateMDY(documentDate)){
        $('#documentDate').addClass(' border-danger');
        return false;
    }
    var document = $('input[type="file"]#document')[0].files[0];
    if(!document){
        $('input[type="file"]#document').addClass(' border-danger');
        alert('Please select a file to upload');
        return false;
    }
    var formData = new FormData();
    formData.append('complaint_id',complaintId);
    formData.append('documentDate',documentDate);
    formData.append("document", document);
    formData.append('permit_type','septic');

    $.ajax({
        url: insertDocInEditUrl,
        data: formData,
        type: "POST",
        dataType: "JSON",
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response)
        {
            $('#documentDate').removeClass('border-danger');
            $('#documentDate').val('');
            $('#addDocModal').modal('hide');
            $('input[type="file"]#document').val('');
            $('input[type="file"]#document').siblings(".custom-file-label").addClass(" selected").html('Select the file');
            var doc = response.document;
            var newRow = `<tr class="doc_row bg-success" data-id = ${doc.id}>
                            <td >${doc.file_name}</td>
                            <td >
                                <a href="${getViewDocURL(doc.id)}" target="_blank"
                                class="btn btn-info btn-xs btn-flat text-white">
                                    <i class="fas fa-eye"></i>
                                </a>
                            </td>
                            <td >
                                ${doc.documentDate ? moment(doc.documentDate,'YYYY-MM-DD').format('MM/DD/YYYY') : ''}
                            </td>
                            <td >${authUser ? authUser :''}</td>

                            <td >

                                <button type="button" class="btn btn-danger btn-xs btn-flat"
                                        onclick="deleteDoc($(this));">Delete</button>
                            </td>
                        </tr>`;

            const table = $('table#documents').DataTable();
            const tr = $(newRow);
            table.row.add(tr[0]).draw();

            Swal.fire({
                // position: 'top-end',
                icon: 'success',
                title: response.message,
                showConfirmButton: false,
                timer: 2000
            });
        },
        error:function(jqXHR, textStatus, errorThrown){
            var error = jqXHR.responseJSON;
            var error_title = "";
            if(typeof error.message !== 'undefined'){
                console.log(error.message);
                error_title = 'Document save error: '+errorThrown;
            }
            else
            {
                error_title = 'Have some problem while saving Document, Please try again later';
            }

            Swal.fire({
                icon: 'error',
                title: error_title
            });
        }
    });

}

function showFileName(element)
{
    var fileName = element.val().split("\\").pop();
    // alert("File Name: " + fileName);
    element.siblings(".custom-file-label").addClass(" selected").html(fileName);
}

var deleteDoc = (element) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        //console.log(result.value);
        if(result.value)
        {
            var doc_id = element.closest('tr').attr('data-id');
            //console.log(doc_id);
            var fd = new FormData();
            fd.append('doc_id',doc_id);
            $.ajax({
                url: delete_document_route,
                type: "POST",
                data: fd,
                dataType: "JSON",
                cache: false,
                contentType: false,
                processData: false,
                async:false,
                beforeSend: function () {

                },
                success: function (data) {

                    element.closest('tr').hide('slow');
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log('Document Error: '+xhr.responseJSON.message);

                    Swal.fire({
                        icon: 'error',
                        title: 'Document Error while Removing: ' + errorThrown,
                    });
                }

            });
        }
    });

}

var deleteNote = (element) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        //console.log(result.value);
        if(result.value)
        {
            var note_id = element.closest('tr').attr('data-id');
            //console.log(note_id);
            var fd = new FormData();
            fd.append('note_id',note_id);
            $.ajax({
                url: delete_note_route,
                type: "POST",
                data: fd,
                dataType: "JSON",
                cache: false,
                contentType: false,
                processData: false,
                async:false,
                beforeSend: function () {

                },
                success: function (data) {

                    element.closest('tr').hide('slow');
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log('Note Error: '+xhr.responseJSON.message);

                    Swal.fire({
                        icon: 'error',
                        title: 'Notes Error while Removing: ' + errorThrown,
                    });
                }

            });
        }
    });
}
function changeComplaintStatus (status,element,btnNumber = null){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(function(result){
        // console.log(status);
        if(result.value)
        {
            //alert('hi');
            $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            var formData = new FormData();
            formData.append('complaint_status',status);
            $.ajax({
                url: changeComplaintStatusUrl,
                type: "POST",
                data: formData,
                dataType: "json",
                contentType: false,
                processData: false,
                beforeSend: function(){
                    $('#overlay').show();
                },
                success: function(response){
                    $('#overlay').hide();
                    var title = "";
                    element.parent('fieldset').hide('slow');
                    if(btnNumber !== 1)
                    {
                        element.parent('fieldset').next().show('slow');
                    }
                    else
                    {
                        element.parent('fieldset').next().hide('slow');
                    }

                    if(status == 3){
                        $("#progressbar li#inspection").addClass(" active text-success");
                        //$("input#btnPlaceInUnderReview").parent('fieldset').next().show();
                        //$("input#btnPlaceInUnderReview").hide('slow');
                        title = 'Complaint sent to inspection';
                    }

                    if(status == 4){
                        $("#progressbar li#inspection").addClass(" active text-success");
                        $("#progressbar li#closed").addClass(" active text-success");
                        //$("input#btnPlaceInPreOpening").hide('slow');
                        title = 'Complaint is Closed';
                        // $('#addNoteModal').modal('show');
                        $('input#btnPlaceInClosed').parents('fieldset').hide('slow');
                    }

                    if(status == 2){
                        $("#progressbar li#attended").addClass(" active text-success");
                        //$("input#btnPlaceInUnderReview").parent('fieldset').next().show();
                        //$("input#btnPlaceInUnderReview").hide('slow');
                        title = 'Complaint sent to Under Investigation';
                    }



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
                        title: 'Problem while updating Complaint Status: '+errorThrown,
                    });
                }
            });
        }
        else
        {

        }

    });
}
