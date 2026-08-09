# Photoboard — setup guide

Two files:
- **AppsScript-Code.gs** — backend that turns a Google Sheet into a photo API
- **index.html** — the webapp itself (open it in any browser)

## 1. Create the Google Sheet backend
1. Go to https://sheets.google.com and create a new blank spreadsheet.
2. **Extensions → Apps Script**.
3. Delete the placeholder code, paste in everything from `AppsScript-Code.gs`.
4. **Deploy → New deployment → gear icon → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, approve the permission prompts.
6. Copy the **Web app URL** (ends in `/exec`).

## 2. Add the URL to index.html
1. Open `index.html` in a text editor.
2. Near the top of the `<script>` section, find this line:
   ```js
   const apiUrl = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace the placeholder with your Web app URL, e.g.:
   ```js
   const apiUrl = 'https://script.google.com/macros/s/XXXXXXXXXXXX/exec';
   ```
4. Save the file.

## 3. Run the webapp
1. Open `index.html` in your browser (double-click it, or host it anywhere).
2. Choose a photo, add an optional caption, click **Pin it**.
3. Your photo is now a row in the "Photos" tab of your spreadsheet, and shows up on the corkboard below.
4. Click **Remove** on any photo to delete it from both the page and the sheet.

## Notes & limits
- Photos are stored as compressed base64 text directly in the sheet (no Google Drive needed). The app auto-resizes/compresses each photo before upload to keep it well under Google Sheets' ~50,000-character cell limit — very large or highly detailed photos may still be rejected; just try a smaller one.
- Because "Who has access" is set to Anyone, anyone who has your web app URL can add/read/delete photos. Don't share `index.html` (or the URL inside it) publicly if that matters to you. For real privacy, you'd want to add an access-key check in the script — happy to add that if you want it.
- If you edit the Apps Script later, you must create a **new deployment version** for changes to take effect.
