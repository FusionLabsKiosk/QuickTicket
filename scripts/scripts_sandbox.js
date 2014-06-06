/* Rotten Tomatoes Sandbox */
var rotten = {};
rotten.API_KEY = 'e7xdbjgd572szexwqpxjfhb2';
rotten.IN_THEATERS_URL = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json';
rotten.event;

rotten.messageHandler = function(e) {
    rotten.event = e;
    rotten.getInTheaters();
};

rotten.getInTheaters = function() {
    var param = {
        'apikey': rotten.API_KEY,
        'page_limit': 20,
        'page': 1,
        'callback': 'rotten.postMessage'
    };
    var url = [];
    url.push(rotten.IN_THEATERS_URL);
    url.push('?');
    for (var key in param) {
        url.push(key);
        url.push('=');
        url.push(param[key]);
        url.push('&');
    }
    url.pop();
    
    var script = document.getElementById('jsonp');
    if (script !== null) {
        document.body.removeChild(script);
    }
    script = document.createElement('script');
    script.id = 'jsonp';
    script.src = url.join('');
    document.body.appendChild(script);
};

rotten.postMessage = function(data) {
    rotten.event.source.postMessage({
        'script': 'rotten',
        'movies': deepCopySafeMessage(data.movies)
    }, rotten.event.origin);
};


window.onload = function() {
    window.addEventListener('message', messageHandler);
};

function messageHandler(e) {
    if (e.data.loadCheck) {
        e.source.postMessage({
            'loaded': true
        }, e.origin);
    }
    else if (e.data.script === 'rotten') {
        rotten.messageHandler(e);
    }
}

/* Used to remove functions when passing an object with window.postMessage */
function deepCopySafeMessage(object) {
    return JSON.parse(JSON.stringify(object));
}