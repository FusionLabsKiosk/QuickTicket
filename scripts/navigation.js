//Navigation Namespace
var nav = {};

nav.SlidePosition = {
    LEFT: 'slide-left',
    RIGHT: 'slide-right'
};
nav.EVENT_BEFORE_OPEN = 'before-open';
nav.EVENT_AFTER_OPEN = 'after-open';
nav.EVENT_BEFORE_CLOSE = 'before-close';
nav.EVENT_AFTER_CLOSE = 'after-close';

nav.navigateTo = function(pageName, slidePos, prereq, params) {
    if (typeof prereq === 'function') {
        $('#page-processing').off(nav.EVENT_AFTER_OPEN);
        $('#page-processing').on(nav.EVENT_AFTER_OPEN, function() {
            prereq(params);
            console.log('page processing done for ' + pageName);
            nav.open(pageName, slidePos);
        });
        nav.open('#page-processing', slidePos);
        
        /*$(pageName).on(nav.EVENT_BEFORE_OPEN, function() {
            prereq(params);
            nav.open(pageName, slidePos);
        });*/
    }
    else {
        nav.open(pageName, slidePos);
    }
};

nav.open = function(pageName, slidePos) {
    var target = $(pageName);
    slidePos = slidePos === nav.SlidePosition.LEFT ? nav.SlidePosition.LEFT : nav.SlidePosition.RIGHT;
    var slideOpp = slidePos === nav.SlidePosition.LEFT ? nav.SlidePosition.RIGHT : nav.SlidePosition.LEFT;
    
    if (target.length > 0) {
        target.trigger(nav.EVENT_BEFORE_OPEN);
        
        var targetSlide = $('<div/>').addClass('slide').addClass(slidePos);
        target.detach().appendTo(targetSlide);
        targetSlide.appendTo('#slide-container');
        
        var currentSlide = $('.slide-center');
        currentSlide.removeClass('slide-center');
        
        var direction = slidePos === nav.SlidePosition.LEFT ? 'right' : 'left';
        var properties = {};
        properties[direction] = '0';
        targetSlide.animate(properties, {
            duration: 350,
            complete: function() {
                console.log('target animation complete');
            }
        });
        
        direction = slidePos === nav.SlidePosition.LEFT ? 'right' : 'left';
        properties = {};
        properties[direction] = '-100%';
        currentSlide.animate(properties, {
            duration: 350,
            complete: function() {
                console.log('current animation complete');
            }
        });
        
        /*var targetSlide = $('<div/>').addClass('slide').addClass(slidePos);
        target.detach().appendTo(targetSlide);
        targetSlide.appendTo('#slide-container');
        
        var currentSlide = $('.slide-center');
        currentSlide.removeClass('slide-center').addClass(slideOpp);
        
        targetSlide.on('webkitTransitionEnd', function() {
            console.log('transition ended');
            target.trigger(nav.EVENT_AFTER_OPEN);
            nav.closeTimeout(currentSlide.find('.page'));
        });
        nav.moveToCenter(targetSlide, slidePos);*/
    }
};

//TODO: Change this to JavaScript animation/event trigger
nav.closeTimeout = function(pageName) {
    setTimeout(function() {
        nav.close(pageName);
    }, 350);
};
nav.moveToCenter = function(slide, slidePos) {
    setTimeout(function() {
        slide.removeClass(slidePos).addClass('slide-center');
    }, 10);
};

nav.close = function(pageName) {
    var target = $(pageName);
    if (target.length > 0) {
        target.trigger(nav.EVENT_BEFORE_CLOSE);
        
        var targetSlide = target.closest('.slide');
        target.detach().appendTo('#pages');
        targetSlide.remove();        
        
        target.trigger(nav.EVENT_AFTER_CLOSE);
    }
};