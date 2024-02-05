function exitModal(exitbtn){
    $(exitbtn).closest('modalcontainer').fadeOut(200);
}

function addModalForm(formParameters,modalTitle,modalFinish){
    $('modaltitle').html(modalTitle);
    let form = '<table class="formTableDesign">';
    for (let parameter of formParameters['parameters']){
        form += addModalOption(parameter['displayName'],parameter['type'],parameter['options']);
    }
    form += '</table>';

    modalDecisions = "";
    if (modalFinish == 'Save'){
        modalDecisions += '<optionbtn class="btn btn-green">SAVE</optionbtn><optionbtn class="btn btn-red" onclick="exitModal(this)">EXIT</optionbtn>';
    }
    else {
        modalDecisions += '<optionbtn class="btn btn-green">CREATE</optionbtn><optionbtn class="btn btn-red" onclick="exitModal(this)">EXIT</optionbtn>';
    }
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

$(document).ready(function(){

    /* CHARTJS Settings */
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

    $('main').on('click','nav ul li',function(){ /* GET NEW PAGES */
        let pagename = $(this).attr('pagename');
        if (pagename){
            $.ajax({
                type: 'GET',
                url: "../pages/"+pagename+'.html',
                success: function(html){
                    $('title').html("NexoAssets - "+pagename);
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