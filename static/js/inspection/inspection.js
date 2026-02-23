
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


var inspectionId = 0;

$(document).ready(function(){




    $('#finalSubmitBtn').click(function(){

        var formData = new FormData();
        formData.append('inspectionId', inspectionId);
        formData.append('generalComment', $('#generalComment').val());
        formData.append('inspectorSignatureDate', $('#inspectorSignatureDate').val());
        // formData.append('_token',$('input[name="_token"]').val());
        // formData.append('_method',$('input[name="_method"]').val());
        if($('input[name="_method"]').val() == 'POST' || $('input[name="_method"]').val() == 'PUT'){
            formData.append('inspectorSignature',signaturePadinspectorSignature.toDataURL().split(',')[1]);

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
            },
            success:function(response){ 


                 Swal.fire({
                    icon: 'success',
                    title: 'Inspection Complete !!'
                });
            //    window.location.href = inspection_url;

            setTimeout(function () {
                window.location.href = inspection_url;
            }, 2000);



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

    });

});



function saveInspectionDetails(inspectionId){
    var total = $('div.panel').length;
    var totalDone = 0;
    var i = 0;

    

    $('div.inspectionRow').each(function(){
        i++;
        var section_id = $(this).parents('div.tab-pane').attr('data-section-id');
        var looping_id = $(this).parents('div.tab-pane').attr('data-looping-id');

        // var subSection_id = $(this).attr('data-subsection-id');
        var subSection_id = $(this).attr('data-item-id');

        var comment_by_sub = "";
        if($('#comment_'+subSection_id+'-loop-'+looping_id).length){
            comment_by_sub = $('#comment_'+subSection_id+'-loop-'+looping_id).val().trim();

        }
        

        // if($("#image_" + subSection_id+'-loop-'+looping_id)[0].files.length){
        if($(this).find('input[type="file"]').length){
            var image = $(this).find('input[type="file"]')[0].files[0];

        }else{
            var image = '';
        }

        var yesBtnValue = $("#Yesbtn_" + subSection_id + "-loop-" + looping_id).val();
        var noBtnValue = $("#Nobtn_" + subSection_id + "-loop-" + looping_id).val();
        var naBtnValue = $("#NAbtn_" + subSection_id + "-loop-" + looping_id).val();

        /* var cooler_one = $("#cooler_one").val();
        var cooler_two = $("#cooler_two").val();
        var freezer_one = $("#freezer_one").val();
        var freezer_two = $("#freezer_two").val();
        var dry_storage = $("#dry_storage").val();
        var sanitizer_sink = $("#sanitizer_sink").val(); */


        //console.log('comment:'+comment, 'image:'+image,'image type:'+typeof image, 'yesBtnValue:'+yesBtnValue, 'noBtnValue:'+noBtnValue, 'naBtnValue:'+naBtnValue);
        
        if(comment_by_sub!="" || (image!='' && typeof image!='undefined') || yesBtnValue!="" || noBtnValue!="" || naBtnValue!="")
        {
            var formData = new FormData();
            formData.append('inspection_id', inspectionId);
            formData.append('section_id', section_id);
            formData.append('sub_section_id', subSection_id);
            formData.append('comment_by_sub', comment_by_sub);
            formData.append("image", image);

            formData.append('yesBtnValue', yesBtnValue);
            formData.append('noBtnValue', noBtnValue);
            formData.append('naBtnValue', naBtnValue);

            if(subSection_id == "29"){
                formData.append('cooler_one', $("#cooler_one").val());
                formData.append('cooler_two', $("#cooler_two").val());
                formData.append('freezer_one', $("#freezer_one").val());
                formData.append('freezer_two', $("#freezer_two").val());
            }
            
            if(subSection_id == "38"){
                formData.append('dry_storage', $("#dry_storage").val());
            }

            if(subSection_id == "81"){
                formData.append('sanitizer_sink', $("#sanitizer_sink").val());
            }

            console.log(yesBtnValue,noBtnValue,naBtnValue);

        
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

var totalUploadedImg = 0;
$('input[type="file"].upload').each(function(){
    var image_name = $(this).closest('div.form-group').find('img').attr('src').split("/").pop();
    if(image_name.trim() != 'preview.png')
    {
        totalUploadedImg++;
    }
});
$("#schoolName" ).autocomplete({
    source: function( request, response ) {
        $.ajax({
            url: schoolSearch,
            type: 'POST',
            dataType: "JSON",
            data: {
                query: request.term
            },

            success: function( data ) {

                if(data.length>0)
                {
                     console.log(data);
                    response($.map(data, function (item) {
                            return {
                                value: item.label,
                                id:item.id,
                                name : item.name,
                                street : item.street,
                                city : item.city,
                                state : item.state,
                                zip : item.zip,
                                manager_name : item.manager_name,
                                manager_email : item.manager_email,
                                manager_phone : item.manager_phone,

                        };
                    }));
                }
                else
                {
                    $('#schoolId').val('');
                    $('#schoolName').val('');
                    $('#street').val('');
                    $('#city').val('');
                    $('#zip').val('');
                    $('#state').val('');
                    $('#manager_name').val('');
                    $('#manager_email').val('');
                    $('#manager_phone').val('');
                }
            }
        });
    },
    minLength: 2,
    select: function (event, ui) {
        console.log(ui.item.no_of_student);
        if(ui.item.id == ''){
            $('#schoolId').val('');
            $('#schoolName').val('');
            $('#street').val('');
            $('#city').val('');
            $('#zip').val('');
            $('#state').val('');
            $('#manager_name').val('');
            $('#manager_email').val('');
            $('#manager_phone').val('');
        }else{
            $('#schoolId').val(ui.item.id);
            $('#schoolName').val(ui.item.value);
            $('#street').val(ui.item.street);
            $('#city').val(ui.item.city);
            $('#zip').val(ui.item.zip);
            $('#state').val(ui.item.state);
            $('#manager_name').val(ui.item.manager_name);
            $('#manager_email').val(ui.item.manager_email);
            $('#manager_phone').val(ui.item.manager_phone);

            
           

        }
        return false;
    }
});


function unselectOthers(element)
{
    element.parents('.row').siblings('.row').find('a').removeClass('active').css({"color": "#17a2b8"});
    element.css({"color": "white"});
}

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
        };
        reader.readAsDataURL(element.files[0]);
        if(image_name.trim() == 'preview.png' && totalUploadedImg < totalSupportedImages)
        {
            totalUploadedImg++;
        }

    }
}

function removeImage(element){
    element.parents('div.fileUploadContainer').find('img').attr('src','../../../dist/img/preview.png');
    element.parents('div.fileUploadContainer').find('input[type="file"]').val("");
}


function toggle(element, point) {
    var Oldclass = element.className.split(" ")[7];
    var name = element.name.split('_')[0];
    var clicked = false;
    const val = (Oldclass == 'btn-default') ? name.split('btn')[0].toUpperCase() : "";

    switch (name) {
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

        

        case 'NAbtn':
            $(element).removeClass(Oldclass);
            if (Oldclass != 'btn-primary') {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-primary');
                $(element).val(val);
                //$(element).parent().find('input[name*=status]').val(element.value);
                $(element).parents('div.panel').find('span.checkboxes').removeClass('d-none');
            }else {
                $(element).removeClass('btn-primary');
                $(element).addClass('btn-default');
                $(element).val("");
                //$(element).parent().find('input[name*=status]').val('');
                $(element).parents('div.panel').find('span.checkboxes').addClass(' d-none');
                $(element).parents('div.panel').find('span.checkboxes').find('input[type="checkbox"]').prop("checked", false);
            }
            $(element).siblings('button').removeClass('btn-primary btn-danger btn-secondary btn-success btn-warning btn-info bg-purple bg-orange bg-yellow bg-gray').addClass('btn-default');
            $(element).siblings('button').val("");
        break;
    }
}





function makeTabActiveById(id,currentPage)
{
    //var prevId = id - 1;border-danger

    if(id == 2){

         var schoolName = $('#schoolName').val();
        $('#schoolName').removeClass('border-danger');
        if(schoolName == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Enter School Name'
            });
            $('#schoolName').addClass(' border-danger');
            return false;
        }
         
        // var unitNo = $('#unitNo').val();
       
        // $('select#unitNo').removeClass('border-danger');
        // if(unitNo == ''){
        //     Swal.fire({
        //         icon: 'info',
        //         title: 'Please Select Unit No'
        //     });
        //     $('select#unitNo').addClass(' border-danger');
        //     return false;
        // }



        var inspector = $('#inspector').val();
        $('select#inspector').removeClass('border-danger');
        if(inspector == ''){
            Swal.fire({
                icon: 'info',
                title: 'Please Select inspector'
            });
            $('select#inspector').addClass(' border-danger');
            return false;
        } 



        console.log(id,currentPage);
        if(id > currentPage){
            var myForm  = document.getElementById("inspectionForm");
            var formData = new FormData();
            formData.append('schoolId', $('#schoolId').val());
            formData.append('scheduleId', $('#scheduleId').val());
            formData.append('schoolName', $('#schoolName').val());
            formData.append('schoolAddress', $('#schoolAddress').val());
            formData.append('schoolIdNumber', $('#schoolIdNumber').val());
            formData.append('noOfStudent', $('#noOfStudent').val());
            formData.append('noOfClass', $('#noOfClass').val());
            formData.append('noOfToilate', $('#noOfToilate').val());
            formData.append('inspector', $('#inspector').val());
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
                //async: false,
                beforeSend: function(){
                    $('#overlay').show();
                },
                success:function(response){
    
                    console.log(response.inspectionId);
                    // saveInspectionDetails(response.inspectionId,);
                    inspectionId = response.inspectionId;
    
                    //  Swal.fire({
                    //     icon: 'success',
                    //     title: 'Inspection Upload Success'
                    // });
                //    window.location.href = inspection_url;
    
                // setTimeout(function () {
                //     window.location.href = inspection_url;
                // }, 2000);
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

    }else{



        



    }
    $('#navTabLi'+id+'>a').removeClass('disabled');
    var nextTab;
    $('.nav-link').map(function(element) {
        if($(this).hasClass("active")) {
            // nextTab = $(this).parent().next('li');
            nextTab = $('#navTabLi'+id)
        }
    });
    nextTab.find('a').trigger('click');
}

if($('input[name="_method"]').val() == 'POST' || $('input[name="_method"]').val() == 'PUT'){
    var inspectorSignature = document.getElementById("inspectorSignature");
    var inspectorSignatureclearButton = inspectorSignature.querySelector("[data-action=clear]");
    var inspectorSignatureCanvas = inspectorSignature.querySelector("canvas");
    var signaturePadinspectorSignature;
    signaturePadinspectorSignature = new SignaturePad(inspectorSignatureCanvas);
    inspectorSignatureclearButton.addEventListener("click", function (event) {
        signaturePadinspectorSignature.clear();
    });


}