function exitModal(exitbtn){
    $(exitbtn).closest('modalcontainer').fadeOut(200);
}

function databaseError(){
    $('modalcontainer').fadeIn(200);
    $('modalinputs').html(addModalForm("Database error, could not connect","Error",""));
}

function addModalForm(formParameters,modalTitle,modalDecision){
    $('modaltitle').html(modalTitle);
    let form;
    if (typeof formParameters === 'string'){ /* IF WE ONLY SEND STRING THEN OUTPUT TEXT ONLY */
        form = formParameters;
    }
    else {
        form = '<table class="formTableDesign">';
        for (let parameter of formParameters['parameters']){
            form += addModalOption(parameter['displayName'],parameter['type'],parameter['options']);
        }
        form += '</table>';
    }
    

    modalDecisions = addModalDecision(modalDecision);
    $('modaldecision').html(modalDecisions);

    return form;
}

function addModalOption(displayName,type,options){
    let row = "<tr>";
    if (type == 'select'){
        row += '<td>'+displayName+'</td><td><select class="formvalue js-example-basic-single">';
        for (let option of options){
            row += '<option value="'+option+'">'+option+'</option>';
        }
        row += '</select></td>';
        row += '</tr>';
        return row;
    }
    row += '<td>'+displayName+'</td><td><input class="formvalue" type="'+type+'" /></td>';
    row += '</tr>';
    return row;
}

function addModalDecision(modalType) {
    if (modalType == 'CREATE'){
        return '<optionbtn class="btn btn-green">CREATE</optionbtn><optionbtn class="btn btn-red" onclick="exitModal(this)">EXIT</optionbtn>';
    }
    else if (modalType == 'SAVE'){
        return '<optionbtn class="btn btn-green">SAVE</optionbtn><optionbtn class="btn btn-red" onclick="exitModal(this)">EXIT</optionbtn>';
    }
    return '<optionbtn class="btn btn-blue" onclick="exitModal(this)">OK</optionbtn>';
}

function openCreateModal(Parameters,Title) {
    $('modalcontainer').fadeIn(200);
    $('modalinputs').html(addModalForm(Parameters,Title,"CREATE"));
    $('.js-example-basic-single').select2();
}
function openEditAssetModal(Parameters,Title) {
    $('modalcontainer').fadeIn(200);
    $('modalinputs').html(addModalForm(Parameters,Title,"SAVE"));
    $('.js-example-basic-single').select2();
}