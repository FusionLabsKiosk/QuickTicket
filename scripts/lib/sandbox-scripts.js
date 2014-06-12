(function(window, JSON) {
    //Sandbox scope
    var sandbox = {};
    window.sandbox = sandbox;
    
    sandbox.returnMessage = function(event, message) {
        message = sandbox.deepCopySafeMessage(message || {});
        message.source = event.data.source;
        message.script = event.data.script;
        
        event.source.postMessage(message, event.origin);
    };
    
    /* Used to remove functions when passing an object with window.postMessage */
    sandbox.deepCopySafeMessage = function(object) {
        return JSON.parse(JSON.stringify(object));
    };
    
    function messageHandler(e) {
        if (e.data.loadCheck) {
            e.source.postMessage({
                'loaded': true
            }, e.origin);
        }
        else if (e.data.script) {
            if (!e.data.source) {
                e.data.source = 'Unknown' + Math.floor((Math.random() * 999) + 100);
            }
            
            if (window[e.data.script] && window[e.data.script].messageHandler) {
                window[e.data.script].messageHandler(e);
            }
        }
    }
    
    var initialize = function() {
        window.addEventListener('message', messageHandler);
    };
    initialize();        
}(window, JSON));
