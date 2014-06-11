var spreadsheet = {};

spreadsheet.MACRO_URL = 'https://script.google.com/macros/s/AKfycbw4AvoXKYaURCkaCmjwi7zQO54GCP45YaNnGQ0d8slA0ZGxiEw/exec';
spreadsheet.SPREADSHEET_ID = '1PSIXV-k_r0r53dVFIIqO72ZCCSXWNxa7-Ijl4Yjm0Fc';

spreadsheet.saveReceipt = function(receipt) {
    var row = [
        JSON.stringify(receipt)
    ];
    var params = {
        'spreadsheetId': spreadsheet.SPREADSHEET_ID,
        'action': 'post',
        'row': JSON.stringify(row)
    };
    
    $.ajax(spreadsheet.MACRO_URL, {
        data: params
    }).success(function(data) {
        console.log(data);
    });
};

spreadsheet.getReceiptById = function(id, callback) {
    spreadsheet.getAllReceipts(function(receipts) {
        for (var i = 0; i < receipts.length; i++) {
            if (receipts[i].id === id) {
                callback(receipts[i]);
                return;
            }
        }
        callback();
    });
};
spreadsheet.getReceiptByCard = function(card, callback) {
    var hash = swiper.generateCardHash(card);
    spreadsheet.getAllReceipts(function(receipts) {
        for (var i = 0; i < receipts.length; i++) {
            if (receipts[i].cardHash === hash) {
                callback(receipts[i]);
                return;
            }
        }
        callback();
    });
};

spreadsheet.getAllReceipts = function(callback) {
    var params = {
        'spreadsheetId': spreadsheet.SPREADSHEET_ID,
        'action': 'get'
    };
    
    $.ajax(spreadsheet.MACRO_URL, {
        data: params
    }).success(function(data) {
        var receiptObjects = [];
        
        var response = JSON.parse(data);
        if (response.status === 200) {
            var receipts = response.data;
            receipts.reverse();
            for (var i = 0; i < receipts.length; i++) {
                receiptObjects.push(JSON.parse(receipts[i]));
            }
        }
        else {
            console.log(response.message);
        }
        callback(receiptObjects);
    });
};