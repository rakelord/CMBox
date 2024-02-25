function createMDIIcon(iconName,type){
    let icon = document.createElement('span');
    icon.classList.add('material-symbols-outlined');
    if (type == "navdropdown"){
        icon.classList.add('navdropdown');
    }
    else if (type == "navicon"){
        icon.classList.add('navicon');
    }
    icon.appendChild(document.createTextNode(iconName));
    return icon;
}

function createNavigationButton(navigationJsonObject,navigationParent){
    let navPanel = document.querySelector(navigationParent + ' ul');
    let navBtn = document.createElement('li');
    navBtn.setAttribute('navid', navigationJsonObject.unique_id);

    let navIcon = createMDIIcon(navigationJsonObject.icon,"navicon");

    let Title = document.createElement('div');
    Title.classList.add('navtitle');
    Title.appendChild(navIcon);
    Title.appendChild(document.createTextNode(navigationJsonObject.display_name));
    navBtn.appendChild(Title);

    // If the button is a parent (dropdown)
    if (navigationJsonObject.is_parent){
        navBtn.classList.add('navparent');
        navBtn.addEventListener("click", toggleNavigationDropdown);

        let expandBtn = createMDIIcon("expand_more","navdropdown");
        Title.appendChild(expandBtn);
    }
    else {
        navBtn.addEventListener("click", changePage);
        navBtn.setAttribute('pagename', navigationJsonObject.page_name);
    }

    let alreadyExist = document.querySelector('[navid="'+navigationJsonObject.unique_id+'"]');
    if (!alreadyExist){
        // If the button has a parent
        if (navigationJsonObject.parent_id){
            let parentObject = document.querySelector('[navid="'+navigationJsonObject.parent_id+'"]');
            if (parentObject){
                parentObject.nextSibling.appendChild(navBtn);
                if (navigationJsonObject.is_parent){
                    parentObject.nextSibling.appendChild(document.createElement('ul'));
                }
            }
        }
        else {
            let alreadyExist = document.querySelector('[navid="'+navigationJsonObject.unique_id+'"]');
            navPanel.appendChild(navBtn);
            if (navigationJsonObject.is_parent){
                navPanel.appendChild(document.createElement('ul'));
            }
        }
    }

    $(navigationParent).html(navPanel);
}

function onFirstLoadNavigation(){
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
}

function loadNavigationPanel(){
    $.ajax({
        type: 'GET',
        url: apiUrl+"navigation",
        success: function(apiOutput){
            for (let i = 0; i < apiOutput.length; i++) {
                $.each(apiOutput,function(_index, navigation){
                    createNavigationButton(navigation,'nav');
                });
            }
            onFirstLoadNavigation();
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

function changePage(){
    let pagename = $(this).attr('pagename');
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

    if (!this.classList.contains('navparent')){
        $(this).closest('nav').find('li').removeClass('selected');
        $(this).addClass('selected');
    }
}

function toggleNavigationDropdown(){
    if ($(this).next().is(':visible')){
        $(this).next().slideToggle(200);
        $(this).removeClass('listopen');
        $(this).find('.navdropdown').animate({rotate: '360deg'},100);
    }
    else {
        $(this).next().slideToggle(200);
        $(this).addClass('listopen');
        $(this).find('.navdropdown').animate({rotate: '180deg'},100);
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
    loadNavigationPanel();
});