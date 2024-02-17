/* SUPPORTING FUNCTIONS */
function getDate(date){
    let dateOutput = new Date(date);
    return dateOutput.toLocaleString();
}

function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
    return true;
}

function databaseError(){
    $('modalcontainer').fadeIn(200);
    $('modalinputs').html(addModalForm("Database error, could not connect","Error",""));
}

/* MODAL CREATION */
function exitModal(exitbtn){
    $(exitbtn).closest('modalcontainer').fadeOut(200);
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var mainColumNames = "";
var apiUrl = "http://localhost:5126/";
function loadDataToTable(pageName,tableId,sectionType){
    $.ajax({
        type: 'GET',
        url: apiUrl+pageName,
        success: function(apiOutput){
            /* CREATE TABLE HEADER */
            let columnNames = Object.keys(apiOutput[0]);
            mainColumNames = columnNames;
            let tableHeader = '<tr><th><input type="checkbox" /></th>';
            $.each(columnNames, function(ci, column){
                tableHeader += '<th>'+capitalizeFirstLetter(column.replace("_"," "))+'</th>';
            });
            tableHeader += '</tr>';
            $('#'+tableId+' thead').append(tableHeader);

            /* CREATE TABLE BODY */
            $.each(apiOutput, function(ri, rowData){
                let row = '<tr><td><input type="checkbox" /></td>';
                $.each(columnNames, function(ci, column){
                    if (column.endsWith('_date')){
                        row += '<td>'+getDate(rowData[column])+'</td>';
                    }
                    else {
                        row += '<td>'+rowData[column]+'</td>';
                    }
                });
                row += '</tr>';
                $('#'+tableId+' tbody').append(row);
            });
        },
        beforeSend: function(){
            $(sectionType).children().eq(0).fadeIn(200);
        },
        error: function(){
            databaseError();
        },
        complete: function(){
            $(sectionType).children().eq(0).fadeOut(200);
        }
    });
}

function addToMainTable(PageTitle){
    let Params = {
        "parameters": []
    };
    let skipInputs = ["creation_date","changed_date"];
    $.each(mainColumNames, function(ci, column){
        if (!(skipInputs).includes(column)){
            Params.parameters.push({
                "displayName": capitalizeFirstLetter(column.replace("_"," ")),
                "type": "text",
                "options": null,
            })
        }
    });
    openCreateModal(Params,"New "+PageTitle);
}

function deleteFromMainTable(selectedObjects){
    let objectsToDelete = [];
    $.each(selectedObjects, function(index, object){
        objectsToDelete += $(object).parent().next('td').text();
    });
    if (isEmpty(objectsToDelete)){
        alert("You need to select an item!");
        return "";
    }
    if (confirm("Are you sure you want to delete item(s)? "+objectsToDelete)){
        alert("DELETED");
    }
}

function getPageInfo(pageName){
    $.ajax({
        type: 'GET',
        url: apiUrl+pageName+'?page_name='+pageName,
        success: function(apiOutput){
            let pageData = apiOutput[0];
            $('pagetitle').html('<span class="material-symbols-outlined" style="margin-right: 10px;font-size: 32">'+pageData.icon+'</span>'+pageData.display_name);
        },
        error: function(){
            databaseError();
        }
    });
}

$(document).ready(function(){

    /* CHARTJS Default Settings */
    Chart.defaults.color = "white";
    Chart.defaults.borderColor = "black";
    Chart.defaults.font.size = 16;

    /* NAVIGATION */
    $('.navparent').each(function(){
        let newBtnText = this.innerHTML+'<span class="material-symbols-outlined">expand_more</span>';
        $(this).html(newBtnText)
    });
    $('.navparent').next().hide();

    $('.navparent').on('click',function(){ /* Open a Navigation list */
        if ($(this).next().is(':visible')){
            $(this).next().slideToggle(200);
            $(this).removeClass('listopen');
            $(this).find('span').animate({rotate: '360deg'},100);
        }
        else {
            $(this).next().slideToggle(200);
            $(this).addClass('listopen');
            $(this).find('span').animate({rotate: '180deg'},100);
        }
    });

    $('navtoggler').on('click',function(){
        let navtree = $('nav').find('ul:first-child');
        let navtoggler = $(this).find('span');
        if ($(navtree).is(':visible')){
            $(navtoggler).animate({rotate: '90deg'},100);
        }
        else {
            $(navtoggler).animate({rotate: '270deg'},100);
        }
        navtree.slideToggle(200);
    });

    $('main').on('click','nav ul li',function(){ /* GET NEW PAGES */
        let pagename = $(this).attr('pagename');
        if (pagename){
            $.ajax({
                type: 'GET',
                url: "../pages/template_page.html",
                success: function(html){
                    $('title').html("NexoAssets - "+capitalizeFirstLetter(pagename));
                    $('page').html(html);
                },
                beforeSend: function(){
                    $('mainpage').children().eq(0).fadeIn(200);
                },
                complete: function(){
                    $('mainpage').children().eq(0).fadeOut(200);
                }
            });

            window.history.pushState(null, document.title, "index.html?page="+pagename);
        }

        if (!this.classList.contains('navparent')){
            $(this).closest('nav').find('li').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    /* Open a pre-selected page='<pagename>' otherwise go to Home */
    function FindNavigationParents(Btn){
        let parent = $(Btn).closest('ul').prev();
        for(let i = 0;i <= 10;i++){
            parent.click();
            parent = $(parent).closest('ul').prev();
        }
    }
    let urlParams = new URLSearchParams(window.location.search);
    let startPage = urlParams.get('page');
    if (startPage){
        let startPageBtn = $('li[pagename="'+startPage+'"]');
        startPageBtn.click();
        FindNavigationParents(startPageBtn);
    }
    else {
        $('li[pagename="home"]').click();
    }
});