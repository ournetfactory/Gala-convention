/**
 * Google Apps Script — Gala Retreat Availability Backend
 *
 * SETUP:
 * 1. Create a Google Sheet with headers in Row 1:
 *    A: Date        (format: YYYY-MM-DD)
 *    B: Property    (hall / farmhouse)
 *    C: GuestName   (free text)
 *    D: Phone       (free text)
 *    E: Status      (booked / cancelled / pending)
 *
 * 2. In Google Sheets → Extensions → Apps Script → paste this code
 * 3. Deploy → New Deployment → Web app → Execute as: Me → Who has access: Anyone
 * 4. Copy the deployment URL and paste it into your website's script.js as GOOGLE_SHEETS_URL
 *
 * ADDING BOOKED DATES:
 *   Just add a row to the Google Sheet:
 *   Date: 2026-09-20  |  Property: hall  |  GuestName: John  |  Phone: 98765...  |  Status: booked
 *
 * CANCELLING:
 *   Change Status from "booked" to "cancelled" — it won't show as booked anymore.
 */

// ─── GET: Returns all booked dates for a given property ───
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var property = (e && e.parameter && e.parameter.property) ? e.parameter.property.toLowerCase() : '';
  var month = (e && e.parameter && e.parameter.month) ? parseInt(e.parameter.month, 10) : 0;
  var year  = (e && e.parameter && e.parameter.year)  ? parseInt(e.parameter.year, 10)  : 0;

  var data = sheet.getDataRange().getValues();
  var booked = [];

  for (var i = 1; i < data.length; i++) { // skip header row
    var rowDate     = data[i][0];  // Column A — Date
    var rowProperty = String(data[i][1]).toLowerCase(); // Column B — Property
    var rowStatus   = String(data[i][4]).toLowerCase(); // Column E — Status

    // Only include rows with status "booked" (ignore cancelled/pending)
    if (rowStatus !== 'booked') continue;

    // Filter by property if specified
    if (property && rowProperty !== property) continue;

    // Convert the date cell to YYYY-MM-DD string
    var dateStr = '';
    if (rowDate instanceof Date) {
      dateStr = Utilities.formatDate(rowDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    } else {
      dateStr = String(rowDate).substring(0, 10);
    }

    // Filter by month/year if specified
    if (month && year) {
      var parts = dateStr.split('-');
      if (parseInt(parts[1], 10) !== month || parseInt(parts[0], 10) !== year) continue;
    }

    booked.push(dateStr);
  }

  var output = ContentService.createTextOutput(
    JSON.stringify({ booked: booked })
  );
  output.setMimeType(ContentService.MimeType.JSON);

  // Allow CORS so the website can fetch this
  return output;
}

// ─── POST: Add a new booking (optional — for future admin form) ───
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var body = JSON.parse(e.postData.contents);

  var date      = body.date      || '';
  var property  = body.property  || '';
  var guestName = body.guestName || '';
  var phone     = body.phone     || '';
  var status    = body.status    || 'booked';

  sheet.appendRow([date, property, guestName, phone, status]);

  var output = ContentService.createTextOutput(
    JSON.stringify({ success: true, message: 'Booking added' })
  );
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ─── OPTIONS: Handle CORS preflight ───
function doOptions(e) {
  var output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.TEXT);
  return output;
}
