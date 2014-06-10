var slider = {};

slider.Event = {
    BEFORE_OPEN: 'before-open',
    AFTER_OPEN: 'after-open',
    BEFORE_CLOSE: 'before-open',
    AFTER_CLOSE: 'before-open'
};
slider.Direction = {
    LEFT: 'left',
    RIGHT: 'right'
};
slider.DURATION = 2000;
slider.PROCESSING = '#page-processing';
slider.STORAGE = '#pages';


slider.navigateTo = function(page, direction, beforeOpen, param) {
    if (typeof beforeOpen === 'function') {
        var processPage = $('<div/>').addClass('slide').append($(slider.PROCESSING));
        processPage.on(slider.Event.AFTER_OPEN, function() {
            var target = $('<div/>').addClass('slide').append($(page));
            target.on(slider.Event.BEFORE_OPEN, function() {
                beforeOpen(param);
            });
            slider.open(target, direction);
        });
        slider.open(processPage, direction);
    }
    else {
        var target = $('<div/>').addClass('slide').append($(page));
        slider.open(target, direction);
    }
};

slider.open = function(page, direction) {
    direction = direction === slider.Direction.LEFT ? slider.Direction.LEFT : slider.Direction.RIGHT;
    direction = slider.Direction.LEFT;
    
    var center = $('.slider').find('.slide.center');
    center.trigger(slider.Event.BEFORE_CLOSE);
    center.animate({
        left: slider.Direction.LEFT ? '100%' : '-100%'
    }, slider.DURATION, function() {
        center.removeClass('center').detach().appendTo(slider.STORAGE);
        center.trigger(slider.Event.AFTER_CLOSE);
    });
     
    var target = $(page);
    target.trigger(slider.Event.BEFORE_OPEN);
    target.addClass(direction);
    $('.slider').append(target);
    target.animate({
        left: 0
    }, slider.DURATION, function() {
        target.removeClass(direction).addClass('center');
        target.trigger(slider.Event.AFTER_OPEN);
    });
    
};