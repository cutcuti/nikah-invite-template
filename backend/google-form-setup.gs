/**
 * Creates the RSVP Google Form (+ a linked Google Sheet) and prints the
 * config snippet to paste into script.js.
 *
 * 1. Go to https://script.google.com → New project
 * 2. Paste this whole file, click Save, then Run `createRsvpForm`
 *    (approve the permissions prompt the first time)
 * 3. Open View → Logs / Execution log and copy the `googleForm: {...}` snippet
 *    into CONFIG in script.js
 */
function createRsvpForm() {
  const form = FormApp.create("Bride & Groom — RSVP");
  form.setDescription("RSVP responses from the wedding website.");
  form.setCollectEmail(false);

  const name = form.addTextItem().setTitle("Name").setRequired(true);
  const phone = form.addTextItem().setTitle("Phone");
  const attending = form.addMultipleChoiceItem().setTitle("Attending").setChoiceValues(["Yes", "No"]).setRequired(true);
  const guests = form.addListItem().setTitle("Guests").setChoiceValues(["1", "2", "3", "4", "5"]);
  const message = form.addParagraphTextItem().setTitle("Message");

  // Responses also land in a Google Sheet
  const sheet = SpreadsheetApp.create("Bride & Groom — RSVP responses");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // Build a pre-filled URL to discover each question's entry.NNN id
  const prefilled = form.createResponse()
    .withItemResponse(name.createResponse("x"))
    .withItemResponse(phone.createResponse("x"))
    .withItemResponse(attending.createResponse("Yes"))
    .withItemResponse(guests.createResponse("1"))
    .withItemResponse(message.createResponse("x"))
    .toPrefilledUrl();

  const ids = [...prefilled.matchAll(/(entry\.\d+)=/g)].map((m) => m[1]);
  const keys = ["name", "phone", "attending", "guests", "message"];
  const fields = Object.fromEntries(keys.map((k, i) => [k, ids[i]]));
  const action = form.getPublishedUrl().replace(/\/viewform.*$/, "/formResponse");

  Logger.log("Form (edit):   " + form.getEditUrl());
  Logger.log("Responses:     " + sheet.getUrl());
  Logger.log("\nPaste into CONFIG in script.js:\n\n  googleForm: " +
    JSON.stringify({ action: action, fields: fields }, null, 2).replace(/\n/g, "\n  ") + ",\n");
}
