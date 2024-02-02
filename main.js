$(document).ready(function(){

    /* CHARTJS Settings */
    Chart.defaults.color = "white";
    Chart.defaults.borderColor = "black";
    Chart.defaults.font.size = 16;

    /* FIX Navigation Bar On Load */
    $('.navparent').each(function(){
        let newBtnText = this.innerHTML+'<span class="material-symbols-outlined">expand_more</span>';
        $(this).html(newBtnText)
    });
    $('.navparent').next().hide();

    /* Open a Navigation list */
    $('.navparent').on('click',function(){
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

    $('main').on('click','nav ul li',function(){
        let pagename = $(this).attr('pagename');
        if (pagename){
            $.get("../pages/"+pagename+'.html',function(html){
                $('mainpage').html(html);
            });

            //window.location.search = "page="+pagename;
            window.history.pushState(null, document.title, "index.html?page="+pagename);
        }

        if (!this.classList.contains('navparent')){
            $(this).closest('nav').find('li').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    /* Go to home as standard */
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

    function FindNavigationParents(Btn){
        let parent = $(Btn).closest('ul').prev();
        for(let i = 0;i <= 10;i++){
            parent.click();
            parent = $(parent).closest('ul').prev();
        }
    }
});