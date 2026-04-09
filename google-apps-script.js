/**
 * ============================================================
 *  Google Apps Script — Date Day Response Tracker
 * ============================================================
 *  HOW TO USE:
 *  1. Open your Google Sheet → Extensions → Apps Script
 *  2. Delete the default code and paste THIS entire file
 *  3. Click Save (💾)
 *  4. Deploy → New deployment → Web app
 *       • Execute as: Me
 *       • Who has access: Anyone
 *  5. Authorize & copy the Web App URL
 *  6. Paste that URL into script.js as GOOGLE_SHEET_URL
 *
 *  TO UPDATE: Deploy → Manage deployments → Edit (pencil) →
 *             Version: New version → Deploy
 * ============================================================
 */

// Handle GET requests — saves visitor data to the sheet
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var p = e.parameter;

    // Only save if there's actual data (not just a health check)
    if (p.finalAnswer) {
      sheet.appendRow([
        p.timestamp       || new Date().toLocaleString(),
        p.finalAnswer     || '',
        p.noClickCount    || 0,
        p.yesTeaseCount   || 0,
        p.timeOnPage      || 0,
        p.device          || '',
        p.browser         || '',
        p.screenSize      || '',
        p.referrer        || ''
      ]);

      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success', message: 'Data saved!' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Health check (no data params)
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'Date Day tracker is running! 💕' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle POST requests (backup — in case POST is used)
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp       || new Date().toLocaleString(),
      data.finalAnswer     || '',
      data.noClickCount    || 0,
      data.yesTeaseCount   || 0,
      data.timeOnPage      || 0,
      data.device          || '',
      data.browser         || '',
      data.screenSize      || '',
      data.referrer        || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
