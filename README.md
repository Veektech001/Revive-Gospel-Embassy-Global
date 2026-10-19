# Revive Gospel Embassy website (frontend)

React 19 + Vite + Tailwind CSS + React Router.

## Run it

```bash
npm install
npm run dev      # local development at http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

## Where things live

| What you want to change | File |
| --- | --- |
| Phone, email, addresses, service times, social links | `src/data/church.js` |
| Sermons (title, date, audio link) | `src/data/sermons.js` |
| Brothers / Sisters Conclave / Workers WhatsApp links | `src/data/groups.js` |
| Leader names, roles, bios, photos | `src/data/leaders.js` |
| Bank details on the Give page | `src/data/giving.js` |
| Where forms send data (once the backend exists) | `src/lib/api.js` |
| Colours and fonts | `tailwind.config.js`, `src/index.css` |

Search the project for `TODO` to find every placeholder still waiting for real content.

## Structure

```
src/
  App.jsx                 routes
  pages/                  one file per page (Home, About, Leadership, FirstTime, Sermons, Give, NotFound)
  components/layout/      Navbar, Footer, ScrollToTop
  components/home/        sections used only on the homepage
  components/shared/      pieces reused across pages (cards, forms, headings)
  data/                   all editable content
  lib/api.js              form submission helpers
```

## Hosting note

The site uses clean URLs (`/about`, `/sermons`). When you deploy, configure the host to
serve `index.html` for every route (Netlify: `_redirects` file with `/* /index.html 200`;
Vercel does this automatically for Vite).
