function loadNavigationPanel(){
    $.ajax({
        type: 'GET',
        url: apiUrl+"navigation",
        success: function(apiOutput){
            let alreadyLoaded = [];

            let navPanel = document.createElement('ul');

            for (let i = 0; i < apiOutput.length; i++) {
                $.each(apiOutput,function(index, navigation){
                    if (!alreadyLoaded.includes(navigation.unique_id)){
                        let navBtn = document.createElement('li');
                        alreadyLoaded.push('navid'+navigation.unique_id);
                        navBtn.setAttribute('navid', navigation.unique_id);
                        
                        let navIcon = document.createElement('span');
                        navIcon.classList.add('material-symbols-outlined');
                        navIcon.classList.add('navicon');
                        navIcon.appendChild(document.createTextNode(navigation.icon));

                        let Title = document.createElement('div');
                        Title.classList.add('navtitle');
                        
                        Title.appendChild(navIcon);
                        Title.appendChild(document.createTextNode(navigation.display_name));
                        navBtn.appendChild(Title);
                        
                        if (navigation.dropdown){
                            navBtn.classList.add('navparent');
                            navBtn.addEventListener("click", toggleNavigationDropdown);

                            let expandBtn = document.createElement('span');
                            expandBtn.classList.add('material-symbols-outlined');
                            expandBtn.classList.add('navdropdown');
                            expandBtn.appendChild(document.createTextNode("expand_more"));
                            Title.appendChild(expandBtn);
                        }
                        else {
                            navBtn.addEventListener("click", changePage);
                            navBtn.setAttribute('pagename', navigation.page_name);
                        }

                        if (navigation.parent_id){
                            let parentObject = document.querySelector('[navid="'+navigation.parent_id+'"]');
                            if (parentObject){
                                parentObject.nextSibling.appendChild(navBtn);
                                if (navigation.dropdown){
                                    parentObject.nextSibling.appendChild(document.createElement('ul'));
                                }

                                alreadyLoaded.push(navigation.unique_id);
                            }
                        }
                        else {
                            navPanel.appendChild(navBtn);
                            if (navigation.dropdown){
                                navPanel.appendChild(document.createElement('ul'));
                            }

                            alreadyLoaded.push(navigation.unique_id);
                        }
                    }
                    $('nav').html(navPanel);
                });
            }

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