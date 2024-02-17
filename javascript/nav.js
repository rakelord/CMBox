function changePage(navBtn){
    let pagename = $(navBtn).attr('pagename');
    if (pagename){
        $.ajax({
            type: 'GET',
            url: "../page.html",
            success: function(html){
                $('title').html("RekanAssets - "+capitalizeFirstLetter(pagename));
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

    if (!navBtn.classList.contains('navparent')){
        $(navBtn).closest('nav').find('li').removeClass('selected');
        $(navBtn).addClass('selected');
    }
}

function toggleNavigationDropdown(navBtn){
    if ($(navBtn).next().is(':visible')){
        $(navBtn).next().slideToggle(200);
        $(navBtn).removeClass('listopen');
        $(navBtn).find('span').animate({rotate: '360deg'},100);
    }
    else {
        $(navBtn).next().slideToggle(200);
        $(navBtn).addClass('listopen');
        $(navBtn).find('span').animate({rotate: '180deg'},100);
    }
}

function toggleNavigationMobile(toggler){
    let navtree = $('nav').find('ul:first-child');
    let navtoggler = $(toggler).find('span');
    if ($(navtree).is(':visible')){
        $(navtoggler).animate({rotate: '90deg'},100);
    }
    else {
        $(navtoggler).animate({rotate: '270deg'},100);
    }
    navtree.slideToggle(200);
}

$(document).ready(function(){
    /* Give all Nav parents a expand icon */
    $('.navparent').each(function(){
        let newBtnText = this.innerHTML+'<span class="material-symbols-outlined">expand_more</span>';
        $(this).html(newBtnText);
    });
    /* Hide all Navigation children on first load */
    $('.navparent').next().hide();

    /* Open a pre-selected page='<pagename>' otherwise go to Home */
    let urlParams = new URLSearchParams(window.location.search);
    let startPage = urlParams.get('page');
    if (startPage){
        let startPageBtn = $('li[pagename="'+startPage+'"]');
        startPageBtn.click();
        let parent = $(startPageBtn).closest('ul').prev();
        for(let i = 0;i <= 10;i++){
            parent.click();
            parent = $(parent).closest('ul').prev();
        }
    }
    else {
        $('li[pagename="home"]').click();
    }
});