# First Liturgy

A short, plain-English guide to the Orthodox Church for people from a Protestant background.

If you grew up Protestant and found yourself at an Orthodox Divine Liturgy (icons, incense, chanting and a lot of standing), this site explains what's going on, what Orthodox Christians actually believe, and how people join. It's meant as a first step, not the last word.

## What's inside

| # | Page | What it covers |
|---|---|---|
| 1 | The big picture | What Orthodoxy is, a short history, and five mindset shifts |
| 2 | Common misconceptions | Protestant assumptions, revisited |
| 3 | Mary and the saints | Honour, not worship, and why it matters |
| 4 | The Divine Liturgy | The Sunday service, step by step |
| 5 | Inside the church | A tappable floor plan, plus icons, candles and gestures |
| 6 | The church year | Pascha dates, the major feasts and fasting |
| 7 | Serbian traditions | Slava, Christmas on 7 January, and a few phrases |
| 8 | Becoming Orthodox | How people actually join |
| 9 | Keep learning | Books, podcasts and a glossary |

## Principles

- **Short.** Each page takes a few minutes to read.
- **Plain.** Every term is explained in plain words.
- **Honest.** Where practice varies between churches, the site says so.
- **Unofficial.** This isn't a church publication. Your priest is always the best guide.

## Running it locally

It's a static site with no build step and no dependencies. Open `public/index.html` in a browser, or serve the folder:

```sh
python3 -m http.server -d public
```

## Deploying

The site is hosted on Cloudflare Pages:

- Framework preset: None
- Build command: (empty)
- Build output directory: `public`

`public/_headers` sets a strict Content Security Policy and other security headers. The site loads no third-party scripts, fonts or trackers.

## Corrections

Spotted a mistake, or something that's explained badly? Please [open an issue](../../issues).

## Licence

- **Content** (the writing): [CC BY-SA 4.0](LICENSE-CONTENT.md). Share it, print it or translate it freely with credit, under the same licence.
- **Code** (styles, scripts, templates): [GPL-3.0](LICENSE).

Made in NZ.
