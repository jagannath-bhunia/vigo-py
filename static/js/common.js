$(document).ready(function () {

    $('button#uploadNote').click(function () {
        //var item_id = $(this).attr('data-itemId');
        var thisElement = $(this);
        var note_id = $('#note_id').val();
        var note = $('textarea#note').val();

        if (!note) {
            $('textarea#note').addClass(' border-danger');
            return false;
        }
        var formData = new FormData();
        formData.append('note_id', note_id);
        formData.append('note', note);
        formData.append('permitId', permitId);
        formData.append('permitType', permitType);
        $.ajax({
            url: uploadNotesRoute,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            async: false,
            beforeSend: () => {

            },
            success: (data) => {
                console.log(data.message);
                Swal.fire({
                    // position: 'top-end',
                    icon: 'success',
                    title: data.message,
                    showConfirmButton: false,
                    timer: 2000
                });
                console.log(data.note);
                var newRow = //'<tr class="note_row bg-success" data-id = ' + data.note.id +'>'
                    '  <td >' + data.created_at.split(',')[0] + '</td>'
                    + ' <td >' + authUser + '</td>'
                    + ' <td >' + note + '</td>'
                    + ' <td >'
                    + ' <button type="button" class="btn btn-info btn-xs text-white" onclick="editNote($(this));" data-note="' + note + '">Edit</button>'
                    + ' <button type="button" class="btn btn-danger btn-xs btn-flat" onclick="deleteNote($(this));">Delete</button>'
                    + ' </td>';
                // +'</tr>';
                // hideThisModal(thisElement);
                $('#addNoteModal').modal('hide');
                if (note_id) {
                    $('tr[data-id = "' + note_id + '"].note_row').html('')
                    $('tr[data-id = "' + note_id + '"].note_row').html(newRow);
                    $('tr[data-id = "' + note_id + '"].note_row').addClass(' bg-success');
                } else {
                    var newRow = '<tr class="note_row bg-success" data-id = ' + data.note.id + '>' + newRow + '<tr>';

                    const table = $('table#notes').DataTable();
                    const tr = $(newRow);
                    table.row.add(tr[0]).draw();
                }
            },
            error: (xhr, status, error) => {
                //debugger;
                console.log('Notes Error:-' + xhr.responseJSON.message);
                $('#overlay').hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Notes Error: ' + error,
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

        if (!docName) {
            $('input[type="text"]#docName').addClass(' border-danger');
            return false;
        }
        if ($('#file')[0].files.length === 0 && !doc_id) {
            $('#file').addClass(' border-danger');
            return false;
        }
        var formData = new FormData();
        formData.append('doc_id', doc_id);
        formData.append('docName', docName);
        formData.append('document', $('input[type="file"]#file')[0].files[0]);
        formData.append('note', note);
        formData.append('permitId', permitId);
        formData.append('permitType', permitType);
        $.ajax({
            url: uploadDocumentRoute,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            async: false,
            beforeSend: function () {
                $('button#uploadDoc').prop('disabled', true);
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
                var row_content = '<td >' + document.doc_name + '</td>'
                    + '<td >'
                    + '<a href="' + getViewDocURL(document.id) + '" target="_blank" class="btn btn-info btn-xs btn-flat text-white"><i class="fas fa-eye"></i></a>'
                    + '</td>'
                    + '<td >' + document.note + '</td>'
                    + '<td >' + authUser + '</td>'
                    + '<td >'
                    + '<button type="button" class="btn btn-info btn-xs btn-flat text-white" onclick="editDoc($(this));">Edit</button>'
                    + '<button type="button" class="btn btn-danger btn-xs btn-flat" onclick="deleteDoc($(this));">Delete</button>'
                    + '</td>';

                if (doc_id) {
                    $('tr[data-id = "' + doc_id + '"].doc_row').html('')
                    $('tr[data-id = "' + doc_id + '"].doc_row').html(row_content);
                    $('tr[data-id = "' + doc_id + '"].doc_row').addClass(' bg-success');
                }
                else {
                    var newRow = '<tr class="doc_row bg-success" data-id = "' + document.id + '">' + row_content + '<tr>';
                    if ($('table#documents tbody tr td').html().trim() == 'No data available in table') {
                        $('table#documents tbody').html('');
                    }
                    $('table#documents tbody').append(newRow);
                }
                $('#addDocModal').modal('hide');
                $('button#uploadDoc').prop('disabled', false);

            },
            error: function (xhr, status, error) {
                //debugger;
                console.log('Document Error:-' + xhr.responseJSON.message);
                $('#overlay').hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Document Error: ' + error,
                });
                $('button#uploadDoc').prop('disabled', false);
            }
        });
    });
    $('select#paymentMode').change(function () {
        $(this).removeClass('border-danger');
        if ($(this).val() == 'Check' || $(this).val() == 'Travelers Check') {
            $('.onSelectPaymentModeCheck').show('slow');
            $('.onSelectPaymentModeDebit').hide('slow');
            $('.onSelectPaymentModeDebit').find('input[type="text"]').val('');
        }
        else if ($(this).val() == 'Credit') {
            $('.onSelectPaymentModeDebit').show('slow');
            $('.onSelectPaymentModeCheck').hide('slow');
            $('.onSelectPaymentModeCheck').find('input[type="text"]').val('');
        }
        else {
            $('.onSelectPaymentModeDebit').hide('slow');
            $('.onSelectPaymentModeDebit').find('input[type="text"]').val('');
            $('.onSelectPaymentModeCheck').hide('slow');
            $('.onSelectPaymentModeCheck').find('input[type="text"]').val('');
        }
        $('.onSelectPaymentModeDebit').find('input[type="text"]').prop('readonly', false);
        $('.onSelectPaymentModeCheck').find('input[type="text"]').prop('readonly', false);

    });

    $('select#paidFor').change(function () {
        $('input#amountPaid').attr("readonly", true);

        if ($(this).val() == 'permit_fee') {
            //$('input[type="number"]#amountPaid').val(permit_fee > 0 ? permit_fee : permit_fee.toFixed(2));
            $('input[type="number"]#amountPaid').val($('#total_fee').val());

        }
        if ($(this).val() == 'additional_fee') {
            $('input#amountPaid').attr("readonly", false);
            $('input#amountPaid').val(0);

        }

    });

    $('input[name="discOrAdd"]').change(function () {
        //console.log($(this).val());
        if ($(this).val() == "a" || $(this).val() == "d") {
            $('input#discOrAddAmount').prop('readonly', false);
            $('div.discOrAddNote').show('slow');
        }
        else {
            $('div.discOrAddNote').show('hide');
        }
    });

    $('#plan_review_payment_mode').change(function () {
        if ($(this).val() == 'Check' || $(this).val() == 'Travelers Check') {
            $('.onSelectPlanReviewPaymentMode').show('slow');
        }
        else {
            $('.onSelectPlanReviewPaymentMode').hide('slow');
            $('.onSelectPlanReviewPaymentMode').find('input[type="text"]').val('');
        }
    });

    $('button#uploadPayment').click(function () {
        var thisElement = $(this);
        if ($('input[type="text"]#collectedOn').val() == ''
            || !validateDateMDY($('input[type="text"]#collectedOn').val())) {
            $('input[type="text"]#collectedOn').addClass(' border-danger');
            return false;
        }
        else {
            $('input[type="text"]#collectedOn').removeClass('border-danger');
        }



        if ($('select#paidFor').val() == '') {
            $('select#paidFor').addClass(' border-danger');
            return false;
        }
        else {
            $('select#paidFor').removeClass('border-danger');
            if ($('select#paidFor').val() == 'permit_fee' && totalPermitFeesCount > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Permit Fee Already Paid',
                });
                return false;
            }
        }

        var discOrAdd = "";
        if ($('input[name="discOrAdd"]').is(':checked') == true) {
            discOrAdd = $('input[name="discOrAdd"]:checked').val();
        }


        var disc_or_add_text = "";
        var discOrAddNote = $('textarea#discOrAddNote').val();
        //alert(discOrAdd);
        if ((discOrAdd == "a" || discOrAdd == "d") && !discOrAddNote) {
            //alert('hi');
            $('textarea#discOrAddNote').addClass(' border-danger');
            return false;
        }
        else {
            $('textarea#discOrAddNote').removeClass('border-danger');
        }
        //return  false;
        var amountPaid = $('input[type="number"]#amountPaid').val();
        var discOrAddAmount = $('input[type="number"]#discOrAddAmount').val();
        var fees = amountPaid;

        if (discOrAdd == "a") {
            //fees = parseFloat(amountPaid) + parseFloat(discOrAddAmount);
            disc_or_add_text = discOrAddAmount ? ('+$' + discOrAddAmount) : '';
        }
        if (discOrAdd == "d") {
            if (parseFloat(amountPaid) < parseFloat(discOrAddAmount)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Discount / Addition Amount should not be greater than Amount Paid',
                });
                $('input[type="number"]#discOrAddAmount').addClass('border-danger');
                return false;
            }
            //fees = amountPaid - discOrAddAmount;
            disc_or_add_text = discOrAddAmount ? ('-$' + discOrAddAmount) : '';
        }
        var fd = new FormData();
        fd.append('permitId', permitId);
        fd.append('permitType', permitType);
        fd.append('permitNumber', $('#permit_number').val());
        fd.append('paidFor', $('select#paidFor').val());
        fd.append('amountPaid', amountPaid);
        fd.append('paymentMode', $('select#paymentMode').val());
        fd.append('checkNumber', $('input[type="text"]#checkNumber').val());
        // fd.append('debitCardNumber', $('input[type="text"]#debitCardNumber').val());
        fd.append('receiptNumber', $('input[type="text"]#receiptNumber').val());
        fd.append('collectedOn', $('input[type="text"]#collectedOn').val());

        fd.append('discOrAdd', discOrAdd == 'undefined' ? "" : discOrAdd);
        fd.append('discOrAddAmount', discOrAddAmount);
        fd.append('discOrAddNote', discOrAddNote);

        $.ajax({

            url: submitPaymentUrl,
            type: "POST",
            data: fd,
            contentType: false,
            processData: false,
            async: false,
            beforeSend: function () {
                thisElement.prop('disabled', true);
                $('#overlay').show();
            },
            success: function (data) {


                $('#overlay').hide();
                thisElement.prop('disabled', false);
                var collectedOn = $('input[type="text"]#collectedOn').val();
                var permit = data.permit;
                // var permitExpDate = permit.expirationDate;
                // if(permitExpDate){
                //     //$('#permit_expiration_date').val(moment(permitExpDate,'YYYY-MM-DD').format('MM/DD/YYYY'));
                // }
                var newRow = '<tr class="history_row bg-success" data-id = ' + data.payment.id + '>' +

                    '<td >' + data.payment.invoice_number + '</td>' +
                    //'<td >' + data.permit_class +'</td>' +
                    '<td >' + $('select#paidFor option:selected').text() + '</td>' +
                    '<td >' + '$' + fees + '</td>' +
                    '<td >' + disc_or_add_text + '</td>' +
                    '<td >' + $('select#paymentMode').val() + '</td>' +
                    '<td >' + moment(collectedOn).format('MM/DD/YYYY') + '</td>' +
                    '<td >' + $('input[type="text"]#receiptNumber').val() + '</td>' +
                    '<td >' + authUser + '</td>' +
                    /*'<td>' +
                    '    <button type="button" class="btn btn-info btn-xs btn-flat text-white"\n' +
                    '            onclick="viewThisPayment('+data.payment.id+');"><i class="fas fa-eye"></i></button>' +
                    '</td>'*/
                    '<td>' +
                    '    <a href="' + getDownloadInvoiceUrl(data.payment.id) + '" type="button"' +
                    '       class="btn btn-primary btn-xs btn-flat text-white"><i class="fa fa-download"></i></a>' +
                    '</td>' +
                    ' +</tr>';

                /* if($('table#payments tbody tr td').html().trim() == 'No data available in table'){
                    $('table#payments tbody').html('');
                }

                $('table#payments tbody').append(newRow); */

                const paymentsTable = $('table#payments').DataTable();
                const paymentsTr = $(newRow);
                paymentsTable.row.add(paymentsTr[0]).draw();


                //$('div#submitPaymentModal').hide('slow');
                if ($("select#paidFor").val() == "plan_review") {
                    $("select#paidFor option[value='plan_review']").hide();
                    $("#progressbar li#pending_review").addClass(" active text-success");
                    $("input#btnPlaceInUnderReview").parent('fieldset').show();
                }

                if ($("select#paidFor").val() == "permit_fee") {
                    $("select#paidFor option[value='permit_fee']").hide();
                    $("#progressbar li#active").addClass(" active text-success");
                }

                $('#submitPaymentModal').modal('hide');

                thisElement.prop('disabled', false);

                Swal.fire({
                    // position: 'top-end',
                    icon: 'success',
                    title: data.message,
                    showConfirmButton: false,
                    timer: 2000
                });
                //console.log(data.emailResponse);
                if ($("select#paidFor").val() == "permit_fee") {
                    /*updatePermitStatus(permitId,permitType,'active');*/
                }
            },
            error: function (xhr, status, error) {

                //debugger;
                console.log('Payment Error:' + error);
                $('#overlay').hide();
                if (xhr.responseJSON.message !== "undefined") {
                    var error_title = xhr.responseJSON.message;
                }
                else {
                    var error_title = error;
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Payment Error: ' + error_title,
                });
                thisElement.prop('disabled', false);
            }
        });

    });

    $('div.modal').on('hide.bs.modal', function () {
        /*alert('test');*/
        $(this).find("input[type='text']").val("");
        $(this).find("input[type='number']").val("");
        $(this).find("input[type='hidden']").val("");

        $(this).find("input").removeClass('border-danger');

        $(this).find("select").not('#paymentMode').val("").change();
        $(this).find("select").prop('disabled', false);

        $(this).find("select").removeClass('border-danger');

        $(this).find("textarea").val("").prop('readonly', false);
        $(this).find("textarea").removeClass('border-danger');

        $(this).find('input[type="radio"]').prop("checked", false);
        $(this).find(".hideOnLoad").hide("slow");

        $(this).find('input[type="file"]').removeClass('border-danger');
        $(this).find('input[type="file"]').val('').prop('readonly', false);
        $(this).find('input[type="file"]').prop('disabled', false);
        $(this).find('label.custom-file-label').text('Select The File');
        $(this).find("button").show();
        /*$('#'+element).hide("slow");*/

        //for payment modal
        $("input#receiptNumber").prop('readonly', false);
        $("input#discOrAddAmount").prop('readonly', true);
        $('div#addDocModal').find('input#docName').prop('readonly', false);
        $('div#addDocModal').find('input#receivedDate').prop('disabled', false);
        $("input#collectedOn").prop('disabled', false);
        /*$(this).modal('hide');*/

    });

    $("input#permit_number").autocomplete({
        source: function (request, response) {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            })
            $.ajax({
                url: permitSearchUrl,
                type: 'POST',
                dataType: "JSON",
                data: {
                    permitType: permitType,
                    query: request.term
                },
                success: function (data) {
                    response(data);
                    console.log(data[0]);
                    if (data[0].id == '') {
                        $('input#permit_id').val('');
                    }
                }
            });
        },
        minLength: 1,
        select: function (event, ui) {
            if (ui.item.id == '') {
                $('input#permit_number').val('');
                $('input#permit_id').val('');
                $('input#est_name').val('');
                $('input#micro_market_name').val('');
                // $('input#owner_cellphone').val('');
                // $('input#owner_address').val('');
                // $('input#owner_city').val('');
                // $('input#owner_state').val('');
                // $('input#owner_zip').val('');
            } else {
                $('input#permit_number').val(ui.item.label);
                $('input#permit_id').val(ui.item.id);
                $('input#est_name').val(ui.item.est_name);
                $('input#micro_market_name').val(ui.item.micro_market_name);
                // $('input#owner_cellphone').val(ui.item.cellphone);
                // $('input#owner_address').val(ui.item.address);
                // $('input#owner_city').val(ui.item.city);
                // $('input#owner_state').val(ui.item.state);
                // $('input#owner_zip').val(ui.item.zip);
            }
            return false;
        }
    });

    $('button#uploadSchedule').click(function () {

        var thisElement = $(this);
        var schedule_id = $('input[type="hidden"]#schedule_id').val();
        var permit_id = $('input[type="hidden"]#permit_id').val();
        var inspection_date = $('input[type="text"]#inspection_date');
        var inspector_id = $('select#inspector_id');



        // if(!validateDateMDY(inspection_date.val())){
        //     inspection_date.addClass(' border-danger');
        //     return false;
        // }else{
        //     inspection_date.removeClass('border-danger');
        // }
        // if(!inspector_id.val()){
        //     inspector_id.addClass(' border-danger');
        // }
        // else{
        //     inspector_id.removeClass(' border-danger');
        // }
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        var formData = new FormData();
        formData.append('schedule_id', schedule_id);
        formData.append('permit_id', permit_id);
        formData.append('permit_type', permitType);
        formData.append('permit_number', $('#permit_number').val());
        formData.append('inspector_id', inspector_id.val());
        formData.append('inspection_date', inspection_date.val());



        $.ajax({

            url: submitSchedule,
            type: "POST",
            data: formData,
            dataType: "json",
            contentType: false,
            processData: false,
            cache: false,
            async: false,
            beforeSend: function () {
                $('#overlay').show();
            },
            success: function (response) {
                $('#overlay').hide();

                Swal.fire({
                    // position: 'top-end',
                    icon: 'success',
                    title: 'Schedule Upload',
                    showConfirmButton: false,
                    timer: 2000
                });
                console.log(response.data);
                // var newRow = `<tr class="schedule_row bg-success" data-id = "${response.data.id}">
                var newRow = `<td class = "customFont">${response.data.type}</td>
                                <td class = "customFont">${moment(response.data.inspectionDate).format('MM/DD/YYYY')}</td>

                                <td>${inspectorId.find("option:selected").text()}</td>
                                <td class = "customFont"><button type="button" class="btn btn-success btn-xs btn-flat">Active</button></td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-info btn-xs btn-flat text-white"
                                    data-id="${response.data.id}" onclick="editSchedule(${response.data.id});">
                                        <i class="fas fa-edit"></i> </button>
                                    <button type="button" class="btn btn-danger btn-xs btn-flat text-white show_confirm"
                                    data-id="${response.data.id}"  onclick="deleteSchedule($(this));"><i class="fas fa-trash"></i></button>

                                </td>`;
                // </tr>`;
                /* if($('table#schedules tbody tr td').html().trim() == 'No data available in table'){
                    $('table#schedules tbody').html('');
                }
                $('table#schedules tbody').append(newRow); */

                if (schId) {
                    $('tr[data-id = "' + schId + '"].schedule_row').html('')
                    $('tr[data-id = "' + schId + '"].schedule_row').html(newRow);
                    $('tr[data-id = "' + schId + '"].schedule_row').addClass(' bg-success');

                }
                else {
                    const schedulesTable = $('table#schedules').DataTable();
                    newRow = `<tr class="schedule_row bg-success" data-id = "${response.data.id}">${newRow}</tr>`;
                    const schedulesTr = $(newRow);
                    schedulesTable.row.add(schedulesTr[0]).draw();

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (typeof jqXHR.responseJSON !== 'undefined') {
                    console.log(jqXHR.responseJSON.message);
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Problem while Creating Schedule: ' + errorThrown,
                });
                $('#overlay').hide();
            }
        });
        //hideThisModal(thisElement);
        $("div#addScheduleModal").modal('hide');
    });

    $('button#uploadScheduleForEdit').click(function () {

        var thisElement = $(this);
        var schId = $('input[type="hidden"]#schId').val();
        var inspectionDate = $('input[type="text"]#inspectionDate');
        var inspectorId = $('select#inspectorId');



        if (!validateDateMDY(inspectionDate.val())) {
            inspectionDate.addClass(' border-danger');
            return false;
        } else {
            inspectionDate.removeClass('border-danger');
        }
        // if(!validateTimeHHmm(scheduleTime.val())){
        //     //alert('no schedule date');
        //     scheduleTime.addClass(' border-danger');
        //     return false;
        // }else{
        //     scheduleTime.removeClass('border-danger');
        // }
        if (!inspectorId.val()) {
            inspectorId.addClass(' border-danger');
        }
        else {
            inspectorId.removeClass(' border-danger');
        }
        if ($('select#type').length) {
            var type = $('select#type');
            if (!type.val()) {
                type.addClass(' border-danger');
                return false;
            } else {
                type.removeClass('border-danger');
            }
        }

        var formData = new FormData();
        formData.append('schId', schId);
        formData.append('permitId', permitId);
        formData.append('permitType', permitType);
        formData.append('permitNumber', $('#permitNumber').val());
        formData.append('inspectorId', inspectorId.val());
        formData.append('inspectionDate', inspectionDate.val());
        // formData.append('inspection_time',scheduleTime.val());
        if ($('select#type').length) {
            formData.append('type', type.val());
        }


        $.ajax({

            url: submitSchedule,
            type: "POST",
            data: formData,
            dataType: "json",
            contentType: false,
            processData: false,
            cache: false,
            async: false,
            beforeSend: function () {
                $('#overlay').show();
            },
            success: function (response) {
                $('#overlay').hide();

                Swal.fire({
                    // position: 'top-end',
                    icon: 'success',
                    title: 'Schedule Upload',
                    showConfirmButton: false,
                    timer: 2000
                });
                console.log(response.data);
                // var newRow = `<tr class="schedule_row bg-success" data-id = "${response.data.id}">
                var newRow = `<td class = "customFont">${moment(response.data.inspection_date).format('MM/DD/YYYY')}</td>

                                <td>${inspectorId.find("option:selected").text()}</td>
                                <td class = "customFont"><button type="button" class="btn btn-success btn-xs btn-flat">Assigned</button></td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-info btn-xs btn-flat text-white"
                                    data-id="${response.data.id}" onclick="editSchedule(${response.data.id});">
                                        <i class="fas fa-edit"></i> </button>
                                    <button type="button" class="btn btn-danger btn-xs btn-flat text-white show_confirm"
                                    data-id="${response.data.id}"  onclick="deletePermitSchedule($(this));"><i class="fas fa-trash"></i></button>

                                </td>`;
                // </tr>`;
                /* if($('table#schedules tbody tr td').html().trim() == 'No data available in table'){
                    $('table#schedules tbody').html('');
                }
                $('table#schedules tbody').append(newRow); */

                if (schId) {
                    $('tr[data-id = "' + schId + '"].schedule_row').html('')
                    $('tr[data-id = "' + schId + '"].schedule_row').html(newRow);
                    $('tr[data-id = "' + schId + '"].schedule_row').addClass(' bg-success');

                }
                else {
                    const schedulesTable = $('table#schedules').DataTable();
                    newRow = `<tr class="schedule_row bg-success" data-id = "${response.data.id}">${newRow}</tr>`;
                    const schedulesTr = $(newRow);
                    schedulesTable.row.add(schedulesTr[0]).draw();

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (typeof jqXHR.responseJSON !== 'undefined') {
                    console.log(jqXHR.responseJSON.message);
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Problem while Creating Schedule: ' + errorThrown,
                });
                $('#overlay').hide();
            }
        });
        //hideThisModal(thisElement);
        $("div#addScheduleModal").modal('hide');
    });









    $('button#btnDocAddMore').on({
        "mouseover": function () {
            $(this).addClass(' bg-info');
        },
        "mouseout": function () {
            $(this).removeClass(' bg-info');
        },
        "click": function () {
            var maxDocId = 0;
            $('div.docRow').each(function () {
                var docId = parseInt($(this).attr('data-item-id'));
                if (maxDocId < docId) {
                    maxDocId = docId;
                }
            });
            maxDocId++;
            var doc = $('div[data-item-id = "1"].docRow').clone();
            var newDoc = doc.clone();
            newDoc.find('div.removeDoc').removeClass(' d-none');
            newDoc.find('label.custom-file-label').text('Select The File');
            var htmlToInsert = `<div class="row docRow" data-item-id = "${maxDocId}">`;
            htmlToInsert += newDoc.html() + `</div>`;
            htmlToInsert = htmlToInsert.replace(/_Item1/g, "_Item" + maxDocId);

            // console.log(htmlToInsert);
            $(htmlToInsert).insertBefore($(this));
        }
    });

    $('button#btnNoteAddMore').on({
        "mouseover": function () {
            $(this).addClass(' bg-info');
        },
        "mouseout": function () {
            $(this).removeClass(' bg-info');
        },
        "click": function () {
            var maxNoteId = 0;
            $('div.noteRow').each(function () {
                var noteId = parseInt($(this).attr('data-item-id'));
                if (maxNoteId < noteId) {
                    maxNoteId = noteId;
                }
            });
            maxNoteId++;
            var note = $('div[data-item-id = "1"].noteRow').clone();
            var newNote = note.clone();
            newNote.find('div.removeNote').removeClass(' d-none');
            newNote.find('input[type="text"]').removeClass(' border-danger');
            var htmlToInsert = `<div class="row noteRow" data-item-id = "${maxNoteId}">`;
            htmlToInsert += newNote.html() + `</div>`;
            htmlToInsert = htmlToInsert.replace(/_Item1/g, "_Item" + maxNoteId);

            // console.log(htmlToInsert);
            $(htmlToInsert).insertBefore($(this));
        }
    });

});


function changePermitStatus(status, element) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(function (result) {
        //console.log(result.value);
        if (result.value) {
            //alert('hi');
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            var formData = new FormData();
            formData.append('permit_status', status);
            $.ajax({
                url: changePermitStatusUrl,
                type: "POST",
                data: formData,
                dataType: "json",
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $('#overlay').show();
                },
                success: function (response) {
                    window.location.reload();
                    $('#overlay').hide();
                    // var title = "";
                    // element.parent('fieldset').next().show('slow');
                    // element.parent('fieldset').hide('slow');
                    // if(status == 'under-review'){
                    //     $("#progressbar li#under_review").addClass(" active text-success");
                    //     title = 'The permit is in Under Review';
                    // }

                    // if(status == 'pre-opening'){
                    //     $("#progressbar li#pre_opening").addClass(" active text-success");
                    //     //$("input#btnPlaceInPreOpening").hide('slow');
                    //     title = 'The permit is in Pre-Opening';
                    // }

                    // if(status == 'inspection'){
                    //     $("#progressbar li#inspection").addClass(" active text-success");
                    //     title = 'The permit is in Inspection';
                    // }

                    // if(status == 'pd-to-be-active'){
                    //     $("#progressbar li#pd-to-be-active").addClass(" active text-success");
                    //     title = 'The permit is in Pending Payment';
                    // }

                    // if(status == 'schedule_a_job'){
                    //     title = 'Jobs Scheduled Successfully!';
                    // }

                    Swal.fire({
                        // position: 'top-end',
                        icon: 'success',
                        title: response.message,
                        showConfirmButton: false,
                        timer: 2000
                    });

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseJSON.message);
                    Swal.fire({
                        icon: 'error',
                        title: 'Problem while updating permit status: ' + errorThrown,
                    });
                }
            });
        }
        else {

        }

    });
}

// function showModal(modal){
//     console.log(modal);
//     $("div#"+modal).show("slow");
// }
var editNote = (element) => {
    var note_id = element.closest('tr').attr('data-id');
    var note = element.attr('data-note');

    console.log(note_id);
    $('#addNoteModal').modal('show');
    $('#note_id').val(note_id);
    $('#note').val(note);
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
        if (result.value) {
            var note_id = element.closest('tr').attr('data-id');
            //console.log(note_id);
            var fd = new FormData();
            fd.append('note_id', note_id);
            $.ajax({
                url: deleteNoteUrl,
                type: "POST",
                data: fd,
                dataType: "JSON",
                cache: false,
                contentType: false,
                processData: false,
                async: false,
                beforeSend: function () {

                },
                success: function (data) {

                    element.closest('tr').addClass(' bg-danger');
                    setTimeout(function () {
                        element.closest('tr').hide("slow");
                    }, 1000);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('Note Error: ' + xhr.responseJSON.message);

                    Swal.fire({
                        icon: 'error',
                        title: 'Notes Error while Removing: ' + errorThrown,
                    });
                }

            });
        }
    });
}
function editDoc(element) {
    var doc_id = element.parents('tr').attr('data-id');
    //console.log(doc_id);
    var fd = new FormData();
    fd.append('doc_id', doc_id);
    $.ajax({
        url: getDocumentRoute,
        type: "POST",
        data: fd,
        dataType: "JSON",
        cache: false,
        contentType: false,
        processData: false,
        async: false,
        beforeSend: function () {

        },
        success: function (data) {
            //console.log(data.doc_details);
            var doc_details = data.doc_details;
            $('div#addDocModal').find('input#doc_id').val(doc_details.id);
            $('div#addDocModal').find('input#docName').val(doc_details.doc_name);
            $('div#addDocModal').find('input#docName').prop('readonly', true);
            $('div#addDocModal').find('input#file').prop('disabled', true);
            $('div#addDocModal').find('label.custom-file-label').text(doc_details.file_name);
            if (doc_details.receivedDate) {
                $('div#addDocModal').find('input#receivedDate').val(moment(doc_details.receivedDate).format('MM/DD/YYYY'));
            }
            $('div#addDocModal').find('input#receivedDate').prop('disabled', true);
            $('div#addDocModal').find('input#note').val(doc_details.note);
            $('#addDocModal').modal();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Document Error: ' + xhr.responseJSON.message);

            Swal.fire({
                icon: 'error',
                title: 'Document Error while Removing: ' + errorThrown,
            });
        }

    });

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
        if (result.value) {
            var doc_id = element.closest('tr').attr('data-id');
            //console.log(doc_id);
            var fd = new FormData();
            fd.append('doc_id', doc_id);
            $.ajax({
                url: deleteDocumentUrl,
                type: "POST",
                data: fd,
                dataType: "JSON",
                cache: false,
                contentType: false,
                processData: false,
                async: false,
                beforeSend: function () {

                },
                success: function (data) {

                    element.closest('tr').addClass(' bg-danger');
                    setTimeout(function () {
                        element.closest('tr').hide("slow");
                    }, 1000);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('Document Error: ' + xhr.responseJSON.message);

                    Swal.fire({
                        icon: 'error',
                        title: 'Document Error while Removing: ' + errorThrown,
                    });
                }

            });
        }
    });

}

function editSchedule(schId) {
    var fd = new FormData();
    fd.append('schId', schId);
    $.ajax({
        url: edit_schedules,
        type: "POST",
        data: fd,
        //dataType: "JSON",
        cache: false,
        contentType: false,
        processData: false,
        async: false,
        beforeSend: function () {
        },
        success: function (data) {
            console.log(data.sch_details);
            var sch_details = data.sch_details;
            $('div#addScheduleModal').find('input#schId').val(sch_details.id);
            $('div#addScheduleModal').find('input#inspectionDate').val(moment(sch_details.inspection_date).format('MM/DD/YYYY'));
            // $('div#addScheduleModal').find('input#inspection_schedule_time').val((sch_details.inspection_time));
            $('div#addScheduleModal').find('select#inspectorId').val(sch_details.inspector_id).trigger('change');
            $('div#addScheduleModal').find('select#type').val(sch_details.type);


            //showModal('addScheduleModal');
            $('div#addScheduleModal').modal();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Document Error: ' + xhr.responseJSON.message);

            Swal.fire({
                icon: 'error',
                title: 'Document Error while Removing: ' + errorThrown,
            });
        }
    });


}

function deletePermitSchedule(element) {
    let scheduleId = element.attr('data-id');
    var url = scheduleDelete.replace(':schedule_id', scheduleId);
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete this Schedule?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(function (result) {
        if (result.value) {
            var fd = new FormData();
            fd.append('_method', 'DELETE');
            fd.append('_token', CSRF_TOKEN);
            $.ajax({
                url: url,
                type: "POST",
                data: fd,
                dataType: "json",
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $('#overlay').show();
                },
                success: function (response) {
                    $('#overlay').hide();


                    Swal.fire({
                        // position: 'top-end',
                        icon: 'success',
                        title: 'Deleted',
                        showConfirmButton: false,
                        timer: 2000
                    });

                    element.closest('tr').addClass(' bg-danger');
                    setTimeout(function () {
                        element.closest('tr').hide("slow");
                    }, 3000);

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseJSON.message);
                    Swal.fire({
                        icon: 'error',
                        title: 'Problem while deleting Schedule: ' + errorThrown,
                    });
                }
            });
        }
    });


}









function hideThisModal(element) {
    element.parents("div.modal").find("input[type='text']").val("");
    element.parents("div.modal").find("input[type='number']").val("");
    element.parents("div.modal").find("input[type='hidden']").val("");

    element.parents("div.modal").find("input").removeClass('border-danger');

    element.parents("div.modal").find("select").not('#payment_mode').val("").change();
    element.parents("div.modal").find("select").prop('disabled', false);

    element.parents("div.modal").find("select").removeClass('border-danger');

    element.parents("div.modal").find("textarea").val("").prop('readonly', false);
    element.parents("div.modal").find("textarea").removeClass('border-danger');

    element.parents("div.modal").find('input[type="radio"]').prop("checked", false);
    element.parents("div.modal").find(".hideOnLoad").hide("slow");

    element.parents("div.modal").find('input[type="file"]').removeClass('border-danger');
    element.parents("div.modal").find('input[type="file"]').val('').prop('readonly', false);
    element.parents("div.modal").find('input[type="file"]').prop('disabled', false);
    element.parents("div.modal").find('label.custom-file-label').text('Select The File');
    element.parents("div.modal").find("button").show();
    element.parents("div.modal").hide("slow");

    //for payment modal
    $("input#receipt_number").prop('readonly', false);
    $("input#disc_or_add_amount").prop('readonly', true);
    $('div#addDocModal').find('input#document_name').prop('readonly', false);
    $('div#addDocModal').find('input#submission_date').prop('disabled', false);
    $("input#fee_collected_on").prop('disabled', false);



}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function showFileName(element) {
    var fileName = element.val().split("\\").pop();
    element.siblings(".custom-file-label").removeClass(' border-danger')
    element.siblings(".custom-file-label").addClass("selected").html(fileName);
}

function deleteRow(element) {
    element.closest('tr').remove();
}

function savePermitDocuments(permitId, permitType = "") {
    var total = $('tr.docRow').length;
    // var totalDone = 0;
    var i = 0;

    $('div.docRow').each(function () {
        i++;
        var itemId = $(this).attr('data-item-id');
        if ($('#doc_Item' + itemId)[0].files.length > 0) {
            var docName = $('#docName_Item' + itemId).val();
            // var receivedDate = $('#receivedDate_Item'+itemId).val();
            var note = $('#docNotes_Item' + itemId).val();

            var formData = new FormData();
            formData.append('docName', docName);
            formData.append('document', $('#doc_Item' + itemId)[0].files[0]);
            // formData.append('receivedDate', receivedDate);
            formData.append('note', note);
            formData.append('permitId', permitId);
            formData.append('itemId', itemId);
            formData.append('permitType', permitType);

            /// Save Inspection Details
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: uploadDocumentRoute,
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                async: false,
                beforeSend: function () {

                },
                success: function (data) {
                    if (i == total) {
                        //window.location.href = permits_url;
                    }
                },
                error: function (xhr, status, error) {
                    //debugger;
                    console.log('Document Error:-' + xhr.responseJSON.message);
                    $('#overlay').hide();
                    Swal.fire({
                        icon: 'error',
                        title: 'Document Error: ' + error,
                    });
                }
            }).always(function () {

            });
        }
    });

}

function savePermitNotes(permitId, permitType = "") {
    var total = $('noteRow.noteRow').length;
    // var totalDone = 0;
    var i = 0;

    $('div.noteRow').each(function () {
        i++;
        var itemId = $(this).attr('data-item-id');
        var note = $('input#permitNote_Item' + itemId).val();
        if (note) {
            var formData = new FormData();
            formData.append('note', note);
            formData.append('permitId', permitId);
            formData.append('permitType', permitType);
            formData.append('itemId', itemId);

            /// Save Inspection Details
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: uploadNotesRoute,
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                async: false,
                beforeSend: function () {

                },
                success: function (data) {
                    if (i == total) {
                        //window.location.href = permits_url;
                    }
                },
                error: function (xhr, status, error) {
                    //debugger;
                    console.log('Notes Error:-' + xhr.responseJSON.message);
                    $('#overlay').hide();
                    Swal.fire({
                        icon: 'error',
                        title: 'Notes Error: ' + error,
                    });
                }
            }).always(function () {

            });
        }
    });

}

function viewThisPayment(history_id) {
    var fd = new FormData();
    fd.append('history_id', history_id);
    $.ajax({
        url: view_payment_details,
        type: "POST",
        data: fd,
        //dataType: "JSON",
        cache: false,
        contentType: false,
        processData: false,
        async: false,
        beforeSend: function () {
        },
        success: function (history) {
            //console.log(history);

            $("input#collectedOn").val(moment(history.payment_details.collectedOn, 'YYYY-MM-DD').format('MM/DD/YYYY'));
            $("input#collectedOn").prop('disabled', true);

            $("select#paymentMode").prop('disabled', true);
            // $("select#paymentMode").val(history.payment_details.paymentMode).change();

            $("input#checkNumber").prop('readonly', true);
            $("input#checkNumber").val(history.payment_details.checkNumber);

            $("input#debitCardNumber").prop('readonly', true);
            $("input#debitCardNumber").val(history.payment_details.debitCardNumber);

            $("input#receiptNumber").prop('readonly', true);
            $("input#receiptNumber").val(history.payment_details.receiptNumber);

            $("select#paidFor").prop('disabled', true);
            $("select#paidFor").val(history.payment_details.paidFor);

            //$("input#amountPaid").prop('readonly', true);
            $("input#amountPaid").val(history.payment_details.amountPaid);

            $("button#uploadPayment").hide();



            if (history.payment_details.discOrAdd == "a") {
                $("#addition").prop("checked", true);
            }
            if (history.payment_details.discOrAdd == "d") {
                $("#discount").prop("checked", true);
            }
            $('input#discOrAddAmount').val(history.payment_details.discOrAddAmount).prop('readonly', true);
            if (history.payment_details.discOrAdd == "a" || history.payment_details.discOrAdd == "d") {
                $('div.discOrAddNote').show('slow');
                $('textarea#discOrAddNote').val(history.payment_details.discOrAddNote).prop('readonly', true);
            }
            else {
                $('div.discOrAddNote').hide('slow');
            }
            $('div#submitPaymentModal').show('slow');
        },
        error: function (xhr, status, error) {
            console.log('Payment View Error: ' + xhr.responseText);

            Swal.fire({
                icon: 'error',
                title: 'Notes Error while Removing: ' + errorThrown,
            });
        }
    });


}

function openCalender(element) {
    element.daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 2016,
        maxYear: parseInt(moment().format('YYYY')) + 4,
        autoUpdateInput: false,
        applyButtonClasses: 'btn-info rounded-0',
    });
    element.on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('L'));
    });
    element.on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
}
