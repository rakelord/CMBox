function loadNavigationPanel(){
    $.ajax({
        type: 'GET',
        url: apiUrl+"navigation",
        success: function(apiOutput){
            let navPanel = document.createElement('ul');

            /* DROPDOWNS WITHOUT PARENTS */
            $.each(apiOutput,function(ni,navigation){
                if (navigation.dropdown && !navigation.parent_id){
                    /* Create dropdown */
                    let Dropdown = document.createElement('li');
                    Dropdown.classList.add('navparent');
                    Dropdown.addEventListener("click", toggleNavigationDropdown);
                    Dropdown.setAttribute('navid', navigation.unique_id);
                    
                    /* Create the title */
                    let Title = document.createElement('div');
                    Title.classList.add('navtitle');
                    let TitleText = document.createTextNode(navigation.display_name);
                    
                    /* Add the Expand button */
                    let expandBtn = document.createElement('span');
                    expandBtn.classList.add('material-symbols-outlined');
                    iconText = document.createTextNode("expand_more");
                    expandBtn.appendChild(iconText);
                    
                    /* Combine the object */
                    Title.appendChild(TitleText);
                    Title.appendChild(expandBtn);
                    Dropdown.appendChild(Title);
                    
                    /* Send to to the Navigation panel */
                    navPanel.appendChild(Dropdown);
                }
            });

            /* BUTTONS WITHOUT PARENTS */
            $.each(apiOutput,function(ni,navigation){
                if (!navigation.dropdown && !navigation.parent_id) {
                    /* Create button */
                    let NavigationButton = document.createElement('li');
                    NavigationButton.setAttribute('navid', navigation.unique_id);

                    /* Create the title */
                    let Title = document.createElement('div');
                    Title.classList.add('navtitle');
                    let TitleText = document.createTextNode(navigation.display_name);

                    /* Combine the object */
                    Title.appendChild(TitleText);
                    NavigationButton.appendChild(Title);

                    /* Send to to the Navigation panel */
                    navPanel.appendChild(NavigationButton);
                }
            });

            $.each(apiOutput,function(ni,navigation){
                if (navigation.dropdown){
                    /* Find parent */
                    $('li[navid='+navigation.parent_id+']').click();
                    
                    /* Create button */
                    let NavigationButton = document.createElement('li');
                    NavigationButton.setAttribute('navid', navigation.unique_id);
                }
            });

            $('nav').html(navPanel);

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
        },
        beforeSend: function(){
            $('leftpanel').children().eq(0).fadeIn(200);
        },
        error: function(){
            databaseError();
        },
        complete: function(){
            $('leftpanel').children().eq(0).fadeOut(200);
        }
    });
}

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

function toggleNavigationDropdown(){
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
    //loadNavigationPanel();
});