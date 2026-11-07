# How to make changes

Everything is done on github.com in your own copy (fork) of this repo.
No software to install.

## The basic loop (use this for every change)

1. On GitHub, open the file you want to change (usually `index.html`).
2. Click the **pencil icon** (top right of the file) to edit.
3. Press **Ctrl+F** (Cmd+F on Mac) to find the text you want to change.
4. Change only the words between the tags, for example
   `<p class="where">Venue Name</p>` → `<p class="where">The Grand Hall</p>`.
   Don't delete the `<p ...>` / `</p>` parts around it.
5. Click **Commit changes** → **Commit changes**.
6. Wait about a minute, then open your site and refresh. If it looks wrong,
   see "Undo a mistake" at the end.

Tip: change one thing at a time and check the site after each commit.

---

## What to change and where

All of these are in **`index.html`** unless it says otherwise.

### Envelope (the first screen)
| What you see | Search for |
|---|---|
| "You are cordially invited" | `cordially` |
| "Nikah ceremony of" | `Nikah ceremony of` |
| Names on the letter | `letter-names` |
| Date on the letter | `letter-date` |
| "Tap anywhere to open" | `Tap anywhere` |

### First page (the invitation)
| What you see | Search for |
|---|---|
| Grandmother / host | `Grandmother Name` |
| "w/o Late …" line | `Grandfather Name` |
| "invites you to the Nikah ceremony of her granddaughter" | `invites you` (change to grandson etc.) |
| Bride's and groom's names | `names-stacked` |
| Parents' lines (D/o, S/o) | `Father Name` |
| Day and time | `class="day"` |
| Date | `class="when"` |
| "followed by dinner at" | `followed by` |
| Venue | `Venue Name` |
| Map button link | `maps.google.com` → paste your Google Maps share link |

To remove a line completely (e.g. no grandparent line), delete the whole line
from `<p` to `</p>`.

### Second page (welcome and duʿā)
| What you see | Search for |
|---|---|
| "We warmly welcome you…" | `warmly welcome` (`<br />` = new line) |
| Arabic duʿā | `class="dua"` |
| Its translation | `dua-en` |

### RSVP page
| What you see | Search for |
|---|---|
| "Kindly respond by …" | `Kindly respond` |
| Phone number shown | `rsvp-number` |
| WhatsApp button | `wa.me/` → `https://wa.me/` + number with country code, digits only, e.g. `https://wa.me/971501234567` |
| Number of guests allowed | `<option>` (add or delete `<option>6</option>` etc.) |

### Countdown page
| What you see | Search for |
|---|---|
| "Counting down" | `Counting down` |
| "A & Y" monogram | `monogram` → change the `A` and `Y` inside `class="glyph"` |

### Countdown date and time — `script.js`
Near the top: `weddingDate: "2026-10-31T20:00:00",`
Format is `YEAR-MONTH-DAYTHOUR:MINUTE:00` in 24-hour time, e.g. 7:30 PM on
14 Feb 2027 → `"2027-02-14T19:30:00"`.

### Browser tab title and link preview
Top of `index.html`: the `<title>` line and the `description` line.

---

## Bigger changes

### Arabic letters on the wax seal
Search `seal-mono` and `wax-mono` (there are two seals). Change the two letters
inside `class="glyph"`. The middle `و` means "and" — leave it.
Different letters have different natural sizes, so if one looks too big or
small, ask someone techy to adjust it in `styles.css` (search `glyph:first-child`).

### Colours
Line 2 of `index.html`: `data-theme="royal"`. Other options are `maroon`,
`rose`, `gold` and `emerald`. Only `royal` has been polished for this design,
so check the others on your phone before sharing.

### Opening animation
In `script.js`: `intro: "envelope",` → `intro: "doors",` for opening doors
instead of the envelope.

### Quran verse on the first page
Search `intro-ayah` for the Arabic and `intro-ayah-en` for the translation.
Keep the reference (surah and ayah number) next to it.

---

## Undo a mistake

1. In your repo, click the **commits** link (the clock icon / "N commits").
2. Find the last commit that worked and click the `<>` (browse files) button to
   see the file as it was, or simply open the broken file, click the pencil, and
   fix or paste back the old text.
3. Vercel keeps every version too: Vercel → your project → **Deployments** →
   pick an older one → **⋯** → **Promote to Production** puts the old site back
   instantly.
