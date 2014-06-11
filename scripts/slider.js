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
slider.DURATION = 350;
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
    
    var center = $('.slider').find('.slide.center');
    center.trigger(slider.Event.BEFORE_CLOSE);
    center.animate({
        left: direction === slider.Direction.LEFT ? '100%' : '-100%'
    }, slider.DURATION, function() {
        center.trigger(slider.Event.AFTER_CLOSE);
        center.children().appendTo(slider.STORAGE);
        center.detach();
    });
     
    var target = $(page);
    target.addClass(direction);
    $('.slider').append(target);
    target.trigger(slider.Event.BEFORE_OPEN);
    target.animate({
        left: 0
    }, slider.DURATION, function() {
        target.removeClass(direction).addClass('center');
        target.trigger(slider.Event.AFTER_OPEN);
    });    
};