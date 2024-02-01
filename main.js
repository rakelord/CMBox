$(document).ready(function(){
    /* FIX Navigation Bar On Load */
    $('.navparent').each(function(){
        let newBtnText = this.textContent+'<svg style="padding: 0px 8px" xmlns="http://www.w3.org/2000/svg" fill="lightgrey" viewBox="4 5 15 15" height="12"><title>arrow-down-thick</title><path d="M10,4H14V13L17.5,9.5L19.92,11.92L12,19.84L4.08,11.92L6.5,9.5L10,13V4Z" /></svg><div style="display: inline-block;margin-left: 8px">';
        $(this).html(newBtnText)
    });
    $('.navparent').next().hide();

    /* Open a Navigation list */
    $('.navparent').on('click',function(){
        if ($(this).next().is(':visible')){
            $(this).next().slideToggle(200);
            $(this).removeClass('listopen');
            $(this).find('svg').animate({rotate: '360deg'},100);
        }
        else {
            $(this).next().slideToggle(200);
            $(this).addClass('listopen');
            $(this).find('svg').animate({rotate: '180deg'},100);
        }
    });

    $('main').on('click','nav ul li',function(){
        let pagename = $(this).attr('pagename');
        if (pagename){
            $.get("../pages/"+pagename+".html",function(html){
                $('mainpage').html(html);
            });
        }
    });
});