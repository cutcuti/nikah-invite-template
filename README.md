# Nikah Invitation

A single-page digital Nikah invitation: envelope opening, the invitation card,
a welcome page with duʿā, a countdown, and an RSVP form.

## Make it yours

Step-by-step instructions for every change are in [GUIDE.md](GUIDE.md).

1. **Names, family, date and venue** – edit the text in `index.html`
   (search for "Amina", "Yusuf", "Name" and "Venue").
2. **Date for the countdown** – change `weddingDate` at the top of `script.js`.
3. **Contact number** – edit `.rsvp-number` and the `wa.me/` link in `index.html`.
4. **Map** – replace the `https://maps.google.com` link with your venue's Google Maps link.

## RSVPs (optional)

Without setup the form runs in demo mode (nothing is saved). To collect replies
in a Google Sheet:

1. Open <https://script.google.com>, create a project, paste
   `backend/google-form-setup.gs`, and run `createRsvpForm`.
2. Copy the `googleForm: {...}` block from the log into `CONFIG` in `script.js`.

## Publish

It is plain HTML/CSS/JS. Import the repo into [Vercel](https://vercel.com/new)
(or any static host) and it deploys as is.
