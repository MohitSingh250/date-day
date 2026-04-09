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
 * ============================================================
 */

// Handle POST requests from the website
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Append a new row with all tracked data
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

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing — visit the URL in browser to check)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Date Day tracker is running! 💕' }))
    .setMimeType(ContentService.MimeType.JSON);
}
