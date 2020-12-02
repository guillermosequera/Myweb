$(document).ready(function () {

    /*************** Proyectos ******************/
    
    var itemSelector = ".tm-gallery-item"; 
    var responsiveIsotope = [ [480, 4], [720, 6] ];
    var itemsPerPageDefault = 8;
    var itemsPerPage = defineItemsPerPage();
    var currentNumberPages = 1;
    var currentPage = 1;
    var currentFilter = '*';
    var filterValue = "";
    var pageAttribute = 'data-page';
    var pagerClass = 'isotope-pager';    
    var $container = $('.tm-gallery-container').isotope({ 
        itemSelector: itemSelector
    });

    function adjustGalleryLayout(currentPopup) {
        if(currentPopup == 'gallery') {
            // diseño después de cada carga de imagen
            $container.imagesLoaded().progress( function() {
                $container.isotope('layout');
            });
        }  
    }

    /************** Popup *****************/   

    $('#inline-popups').magnificPopup({
        delegate: 'a',
        removalDelay: 500, //retrasa la eliminación por X para permitir la animación externa
        callbacks: {
            beforeOpen: function() {
                this.st.mainClass = this.st.el.attr('data-effect');
            },
            open: function() {
                adjustGalleryLayout($.magnificPopup.instance.content.attr('id'));        
            }
        },
        midClick: true, //permitir la apertura de una ventana emergente con un clic del medio del mouse.
        showCloseBtn: false
    });

    $('.tm-close-popup').on( "click", function() {
        $.magnificPopup.close();
    });

    var popupInstance = $.magnificPopup.instance;

    $('.tm-btn-next').on("click", function(e) {                          
        popupInstance.next();
        adjustGalleryLayout(popupInstance.content.attr('id'));       
    });

    $('.tm-btn-contact').on("click", function(e) {
        popupInstance.goTo(4); 
    })

    // actualizar elementos basados ​​en filtros actuales
    function changeFilter(selector) { $container.isotope({ filter: selector }); }

    // toma todos los filtros marcados
    function goToPage(n) {
        currentPage = n;
        var selector = itemSelector;
        var exclusives = [];
        
        if(currentFilter != '*') {
            exclusives.push(selector + '.' + currentFilter);
        }    

       
        filterValue = exclusives.length ? exclusives.join('') : '*';

        
        var wordPage = currentPage.toString();
        filterValue += ('.'+wordPage);
        changeFilter(filterValue);
    }

    
    function defineItemsPerPage() {
        var pages = itemsPerPageDefault;

        for( var i = 0; i < responsiveIsotope.length; i++ ) {
            if( $(window).width() <= responsiveIsotope[i][0] ) {
                pages = responsiveIsotope[i][1];
                break;
            }
        }
        return pages;
    }

    function setPagination() {
    
        var SettingsPagesOnItems = function(){
            var itemsLength = $container.children(itemSelector).length;
            var pages = Math.ceil(itemsLength / itemsPerPage);
            var item = 1;
            var page = 1;
            var selector = itemSelector;
            var exclusives = [];
                
                if(currentFilter != '*') {
                    exclusives.push(selector + '.' + currentFilter);
                }                

                
                filterValue = exclusives.length ? exclusives.join('') : '*';
                
                
                $container.children(filterValue).each(function(){
                    
                    if( item > itemsPerPage ) {
                        page++;
                        item = 1;
                    }
                    
                    wordPage = page.toString();
                    
                    var classes = $(this).attr('class').split(' ');
                    var lastClass = classes[classes.length-1];
                    
                    if(lastClass.length < 4){
                        $(this).removeClass();
                        classes.pop();
                        classes.push(wordPage);
                        classes = classes.join(' ');
                        $(this).addClass(classes);
                    } else {
                        
                       $(this).addClass(wordPage); 
                    }
                    item++;
                });
            currentNumberPages = page;
        }();
        
    
        var CreatePagers = function() {
            
            var $isotopePager = ( $('.'+pagerClass).length == 0 ) ? $('<div class="'+pagerClass+' tm-paging"></div>') : $('.'+pagerClass);

            $isotopePager.html('');
            if(currentNumberPages > 1){
                for( var i = 0; i < currentNumberPages; i++ ) {
                    var $pager = '';

                    if(currentPage == i+1) {
                        $pager = $('<a href="javascript:void(0);" class="pager active tm-paging-link" '+pageAttribute+'="'+(i+1)+'"></a>');
                    } else {
                        $pager = $('<a href="javascript:void(0);" class="pager tm-paging-link" '+pageAttribute+'="'+(i+1)+'"></a>');
                    }
                        
                    $pager.html(i+1);

                    $pager.click(function(){
                        $('.tm-paging-link').removeClass('active');
                        $(this).addClass('active');
                        var page = $(this).eq(0).attr(pageAttribute);
                        goToPage(page);
                    });
                    $pager.appendTo($isotopePager);
                }
            }
            $container.after($isotopePager);
        }();
    }

    setPagination();
    goToPage(1);

    
    $('.tm-gallery-link').click(function(e) {        
        var filter = $(this).data('filter');        
        currentFilter = filter;
        setPagination();
        goToPage(1);
        $('.tm-gallery-link').removeClass('active');
        $(e.target).addClass('active');
    })

    
    $(window).resize(function(){
        itemsPerPage = defineItemsPerPage();
        setPagination();
        goToPage(1);
    });

    /************** Video  *********/

    function setVideoSize() {
        const vidWidth = 1280;
        const vidHeight = 720;
        const maxVidHeight = 400;
        let windowWidth = window.innerWidth;
        let newVidWidth = windowWidth;
        let newVidHeight = windowWidth * vidHeight / vidWidth;
        let marginLeft = 0;
        let marginTop = 0;
    
        if (newVidHeight < maxVidHeight) {
            newVidHeight = maxVidHeight;
            newVidWidth = newVidHeight * vidWidth / vidHeight;
        }
    
        if(newVidWidth > windowWidth) {
            marginLeft = -((newVidWidth - windowWidth) / 2);
        }
    
        if(newVidHeight > maxVidHeight) {
            marginTop = -((newVidHeight - $('#tm-video-container').height()) / 2);
        }
    
        const tmVideo = $('#tm-video');
    
        tmVideo.css('width', newVidWidth);
        tmVideo.css('height', newVidHeight);
        tmVideo.css('margin-left', marginLeft);
        tmVideo.css('margin-top', marginTop);
    }

    setVideoSize();

    
    let timeout;
    window.onresize = function () {
        clearTimeout(timeout);
        timeout = setTimeout(setVideoSize, 100);

        adjustIntroImg();
    };

    // Play/Pause video      
    const btn = $("#tm-video-control-button");

    btn.on("click", function (e) {
        const video = document.getElementById("tm-video");
        $(this).removeClass();

        if (video.paused) {
            video.play();
            $(this).addClass("fas fa-pause");
        } else {
            video.pause();
            $(this).addClass("fas fa-play");
        }
    });


    // Ajusta la imagen de introducción según el tamaño de la pantalla

    adjustIntroImg();

    function adjustIntroImg() {
        var img = 'img/';

        if(window.innerWidth > 650) {
            img += 'intro.jpg';
        } else {
            img += 'intro-big.jpg';
        }

        $('.tm-intro-img').attr('src', img);
    }
});