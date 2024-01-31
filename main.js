$(document).ready(function(){
    /* FIX Navigation Bar On Load */
    $('.navparent').each(function(){
        let newBtnText = '<svg xmlns="http://www.w3.org/2000/svg" fill="grey" viewBox="4 5 15 15" height="12"><title>arrow-down-thick</title><path d="M10,4H14V13L17.5,9.5L19.92,11.92L12,19.84L4.08,11.92L6.5,9.5L10,13V4Z" /></svg><div style="display: inline-block;margin-left: 8px">'+this.textContent+'</div><div style="width: 22px;display: inline-block"></div>';
        $(this).html(newBtnText)
    });
    $('.navnormal').each(function(){
        $(this).html('<div style="width: 20px;display: inline-block"></div>'+this.textContent+'<div style="width: 22px;display: inline-block"></div>');
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
});