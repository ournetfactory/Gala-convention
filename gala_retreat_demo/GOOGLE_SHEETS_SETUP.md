# Google Sheets Availability Setup — Step by Step

Follow these steps once. After setup, you manage bookings by simply editing a Google Sheet.

---

## Step 1: Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**
2. Name it: `Gala Retreat Bookings`
3. In **Row 1**, add these headers:

| A       | B         | C         | D     | E      |
|---------|-----------|-----------|-------|--------|
| Date    | Property  | GuestName | Phone | Status |

4. Add some test bookings:

| Date       | Property | GuestName | Phone       | Status   |
|------------|----------|-----------|-------------|----------|
| 2026-09-15 | hall     | Test      | 9876543210  | booked   |
| 2026-09-16 | hall     | Test      | 9876543210  | booked   |
| 2026-10-01 | farmhouse| Demo      | 1234567890  | booked   |

> **Important:** Date column must be in `YYYY-MM-DD` format (e.g., `2026-09-20`).
> Status must be exactly `booked` to show as unavailable. Use `cancelled` to free up a date.

---

## Step 2: Add the Apps Script

1. In your new Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `google_apps_script.js` (from this folder) and paste it in
4. Click the **💾 Save** icon (or Ctrl+S)
5. Name the project: `Gala Retreat API`

---

## Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the ⚙️ gear icon → select **Web app**
3. Fill in:
   - **Description:** `Gala Retreat Availability API`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Click **Deploy**
5. **Copy the Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx...xxx.../exec
   ```

---

## Step 4: Connect to Your Website

1. Open `script.js` in your website folder
2. Find the line near the top that says:
   ```js
   const GOOGLE_SHEETS_URL = '';
   ```
3. Paste your Web app URL inside the quotes:
   ```js
   const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbx...xxx.../exec';
   ```
4. Save the file and upload to your hosting

---

## How to Manage Bookings

### Add a booking:
Open the Google Sheet → Add a new row with the date, property, guest name, phone, and status `booked`

### Cancel a booking:
Change the **Status** column from `booked` to `cancelled`

### Check what's booked:
Just look at the sheet — all bookings are visible at a glance

### On mobile:
Open the Google Sheets app on your phone to add/cancel bookings on the go

---

## How It Works

- The website fetches booked dates from your Google Sheet every time someone opens the calendar
- Dates are filtered by property (hall / farmhouse)
- Past dates are automatically disabled
- If the Google Sheet is unreachable, the calendar falls back to demo mode (random dates)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Calendar shows demo dates | Check the `GOOGLE_SHEETS_URL` is correct in script.js |
| CORS error in browser | Re-deploy the Apps Script (Deploy → Manage → New deployment) |
| Dates not showing as booked | Make sure Status column says exactly `booked` (lowercase) |
| Wrong property showing | Make sure Property column says exactly `hall` or `farmhouse` |
