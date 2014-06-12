var swiper = {};
swiper.EVENT_NAME = 'card-swipe';
swiper.TRACK_REGEX = /(%.*?\?)?(;.*?\?)?/;
swiper.TRACK_1_REGEX = /%([A-Z])([0-9]{1,19})\^([^\^]{2,26})\^([0-9]{4}|\^)([0-9]{3}|\^)([^\?]+)\?/;
swiper.TRACK_2_REGEX = /;([0-9]{1,19})=([0-9]{4}|=)([0-9]{3}|=)([^\?]+)\?/;

swiper.DUMMY_CARD = '%B4242424242424242^DOE/JOHN^15011011000?;B4242424242424242=15011011000?';

swiper.scanning = false;
swiper.swipeStart = 0;
swiper.triggers = [];
swiper.focus;
swiper.buffer = [];
swiper.delay = 250;
swiper.bypass = 96;

$(document).ready(function() {
    $(document).bind('keypress', swiper.swiped);
});

swiper.addTrigger = function(selector) {
    swiper.triggers.push(selector);
};
swiper.setFocus = function(selector) {
    swiper.focus = selector;
};
swiper.removeFocus = function() {
    swiper.focus = undefined;
};

swiper.swiped = function(e) {
    if (swiper.scanning) {
        e.preventDefault();
        
        if (swiper.swipeStart === 0) {
            swiper.swipeStart = Date.now();
        }
        if ((Date.now() - swiper.swipeStart) > swiper.delay) {
            swiper.swipeStart = 0;
            swiper.scanEnd = 0;
            swiper.buffer = [];
        }
        
        if (e.keyCode === swiper.bypass) {
            swiper.buffer = swiper.DUMMY_CARD.split('');
            e.keyCode = 13;
        }
        
        if (e.keyCode === 13) {
            if ((Date.now() - swiper.swipeStart) < swiper.delay) {
                var card = new swiper.Card(swiper.buffer.join(''));
                if (swiper.focus) {
                    $(swiper.focus).trigger(swiper.EVENT_NAME, card);
                }
                else {
                    for (var i = 0; i < swiper.triggers.length; i++) {
                        $(swiper.triggers[i]).trigger(swiper.EVENT_NAME, card);
                    }
                }
            }
            swiper.swipeStart = 0;
            swiper.buffer = [];
        }
        else {
            swiper.buffer.push(String.fromCharCode(e.keyCode));
        }
    }
};

swiper.Card = function(line) {
    
    var self = this;
    
    this.track1 = {};
    this.track1.valid = false;
    this.track2 = {};
    this.track2.valid = false;
    this.track3 = {};
    this.track3.valid = false;
    this.line = line;
    
    this.isValid = function() {
        return self.track1.valid || self.track2.valid;
    };
    this.getNumber = function() {
        if (self.track1.valid) {
            return self.track1.number;
        }
        else if (self.track2.valid) {
            return self.track2.number;
        }
        return -1;
    };
    this.getLast4 = function() {
        var numString = self.getNumber().toString();
        return parseInt(numString.substring(numString.length - 4));
    };
    this.getExpMonth = function() {
        if (self.track1.valid) {
            return self.track1.expMonth;
        }
        else if (self.track2.valid) {
            return self.track2.expMonth;
        }
        return -1;
    };    
    this.getExpYear = function() {
        if (self.track1.valid) {
            return self.track1.expYear;
        }
        else if (self.track2.valid) {
            return self.track2.expYear;
        }
        return -1;
    };
    this.getLastName = function() {
        if (self.track1.valid) {
            return self.track1.nameParts[0];
        }
        return '';
    };
    this.getFirstName = function() {
        if (self.track1.valid) {
            return self.track1.nameParts[1];
        }
        return '';
    };
    
    this.parse = function(line) {
        var tracks = line.match(swiper.TRACK_REGEX);
        self.track1.data = tracks[1];
        self.track2.data = tracks[2];
        self.track3.data = tracks[3];

        if (self.track1.data) {
            var t1 = self.track1.data.match(swiper.TRACK_1_REGEX);
            if (t1 !== null && t1.length === 7) {
                self.track1.valid = true;
                self.track1.format = t1[1];
                self.track1.number = parseFloat(t1[2]);
                self.track1.name = t1[3];
                self.track1.nameParts = self.track1.name.split('/');
                self.track1.exp = parseInt(t1[4]);
                self.track1.expYear = parseInt(t1[4].substring(0, 2));
                self.track1.expMonth = parseInt(t1[4].substring(3));
                self.track1.service = parseInt(t1[5]);
                self.track1.discretionary = t1[6];
            }
        }
        if (self.track2.data) {
            var t2 = self.track2.data.match(swiper.TRACK_2_REGEX);
            if (t2 !== null && t2.length === 5) {
                self.track2.valid = true;
                self.track2.number = parseFloat(t2[1]);
                self.track2.exp = parseInt(t2[2]);
                self.track2.expYear = parseInt(t2[2].substring(0, 2));
                self.track2.expMonth = parseInt(t2[2].substring(3));
                self.track2.service = parseInt(t2[3]);
                self.track2.discretionary = t2[4];
            }
        }
    };
    
    if (line) {
        self.parse(line);
    }
};

swiper.generateCardHash = function(card) {
    var s = card.line;
    var hash = 0;
    for (var i = 0; i < s.length; i++) {
        var c = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + c;
        hash = hash & hash;
    }
    //TODO: Make sure this hash is always the same, if not, use Stripe's fingerprint
    console.log('Card Hash (x' + card.getLast4() + '): ' + hash);
    return hash;
};