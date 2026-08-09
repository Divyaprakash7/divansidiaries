/**
 * PHOTOBOARD BACKEND
 * ------------------
 * This script turns a Google Sheet into a tiny photo API.
 * Photos are stored as compressed base64 strings in a "Photos" sheet.
 *
 * SETUP:
 * 1. Go to https://sheets.google.com and create a new blank spreadsheet.
 * 2. In the sheet, click Extensions > Apps Script.
 * 3. Delete any starter code and paste in this whole file.
 * 4. Click Deploy > New deployment.
 *    - Click the gear icon next to "Select type" and choose "Web app".
 *    - Description: anything (e.g. "Photoboard API").
 *    - Execute as: Me.
 *    - Who has access: Anyone.
 *    - Click Deploy, then Authorize access (approve the permissions).
 * 5. Copy the "Web app URL" you're given — it looks like:
 *    https://script.google.com/macros/s/XXXXXXXXXXXX/exec
 * 6. Paste that URL into the webapp (index.html) when it asks for it.
 *
 * NOTE: Every time you make code changes here, you must create a NEW
 * deployment (Deploy > Manage deployments > Edit > New version) for the
 * changes to go live at the same URL.
 */

const SHEET_NAME = 'Photos';

function doGet(e) {
  const sheet = getSheet_();
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1); // skip header row
  const photos = rows
    .filter(function (row) { return row[0]; }) // skip blank rows
    .map(function (row) {
      return {
        id: row[0],
        name: row[1],
        data: row[2],
        timestamp: row[3]
      };
    })
    .reverse(); // newest first

  return jsonResponse_({ success: true, photos: photos });
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    if (params.action === 'add') {
      const id = Utilities.getUuid();
      sheet.appendRow([id, params.name || 'photo', params.data, new Date().toISOString()]);
      return jsonResponse_({ success: true, id: id });
    }

    if (params.action === 'delete') {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === params.id) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      return jsonResponse_({ success: true });
    }

    return jsonResponse_({ success: false, error: 'Unknown action: ' + params.action });
  } catch (err) {
    return jsonResponse_({ success: false, error: err.message });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['id', 'name', 'data', 'timestamp']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
