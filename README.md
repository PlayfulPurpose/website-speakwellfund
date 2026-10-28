# Speak Well Fund website

The website for [speakwellfund.com](https://speakwellfund.com): plain HTML, CSS and a little JavaScript, hosted on GitHub Pages.

## What's where

- `index.html`, `speakers.html`, `organisations.html`, `fund.html`, `about.html`, `get-involved.html`: the six pages
- `assets/css/styles.css`: all the styling. Colours, fonts and spacing are at the top under `:root`
- `assets/js/main.js`: the mobile menu, scroll animations and the sign-up form
- `assets/img/logo.png`: the logo
- `CNAME`: tells GitHub Pages to serve the site at speakwellfund.com

## Colour code

Speakers are blue, organisations purple and fund builders green. Orange and yellow are only for section backgrounds.

## Sign-up form

The form on `get-involved.html` sends to Formspree. The endpoint is set once, at the top of `assets/js/main.js` (`FORM_ENDPOINT`).
