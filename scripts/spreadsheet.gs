function doGet(event) {
  var response = {};
  response.message = '';
  response.status = 200;
  response.data = {};
  
  //Retrieve spreadsheet by ID or return error message
  if (!event || !event.parameter) {
    response.message = 'No parameters given';
    response.status = 400;
    return ContentService.createTextOutput(JSON.stringify(response));    
  }
  var id = event.parameter.spreadsheetId;  
  var ss = SpreadsheetApp.openById(id);
  if (ss.getSheets().length < 1) {
    response.message = 'Empty spreadsheet';
    response.status = 400;
    return ContentService.createTextOutput(JSON.stringify(response));
  }
  
  //Retrieve sheet (default first sheet unless sheetIndex is specified)
  sheetIndex = 0;
  if (event.parameter.sheetIndex) {
    if (event.parameter.sheetIndex < ss.getSheets().length - 1) {
      sheetIndex = event.parameter.sheetIndex;
    }
  }
  var sheet = ss.getSheets()[sheetIndex];
  
  var action = event.parameter.action;
  if (action === 'get') {
    var range = sheet.getDataRange();
    var values = range.getValues();    
    if (values.length < 1) {
      response.message = 'Empty spreadsheet';
      response.status = 400;
      return ContentService.createTextOutput(JSON.stringify(response));
    }
    
    response.message = 'Success';
    response.status = 200;
    response.data = values;
    return ContentService.createTextOutput(JSON.stringify(response));    
  }
  else if (action === 'post') {    
    var row = JSON.parse(event.parameter.row);
    if (Object.prototype.toString.call(row) !== '[object Array]') {
      response.message = 'Invalid row parameter';
      response.status = 400;
      return ContentService.createTextOutput(JSON.stringify(response));
    }
    sheet.appendRow(row);
    response.message = 'Success';
    response.status = 200;
    return ContentService.createTextOutput(JSON.stringify(response));
  }
  else {
    response.message = 'Invalid action';
    response.status = 400;
    return ContentService.createTextOutput(JSON.stringify(response));
  }
}