/* Load Page */
function getPageInfo(pageName){
    $.ajax({
        type: 'GET',
        url: apiUrl+pageName+'?page_name='+pageName,
        success: function(apiOutput){
            let pageData = apiOutput[0];
            $('pagetitle').html('<span class="material-symbols-outlined pagetitleicon">'+pageData.icon+'</span>'+pageData.display_name);
        },
        error: function(){
            databaseError();
        }
    });
}

/* Load data to Tables */
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
                    let columnData = rowData[column];
                    if (column.endsWith('_date')){
                        columnData = getDate(rowData[column])+'</td>';
                    }
                    row += '<td>'+columnData+'</td>';
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

/* ADD Data */
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

/* REMOVE Data */
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