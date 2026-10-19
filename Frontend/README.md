# Revive Gospel Embassy website (frontend)

React 19 + Vite + Tailwind CSS + React Router.

## Run it

```bash
npm install
npm run dev      # local development at http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

## Connecting to the backend

Member accounts, sermon downloads and the admin page need the API in `../Backend`
(see `Backend/README.md`). Create `Frontend/.env` with:

```
VITE_API_URL=http://localhost:5000
```

Without it the site still runs in preview mode: sermons show the sample list, log-in links are hidden
and forms only pretend to send.

## Where things live

| What you want to change | File |
| --- | --- |
| Phone, email, addresses, service times, social links | `src/data/church.js` |
| Brothers / Sisters Conclave / Workers WhatsApp links | `src/data/groups.js` |
| Leader names, roles, bios, photos | `src/data/leaders.js` |
| Bank details on the Give page | `src/data/giving.js` |
| Talking to the backend (forms, login, downloads) | `src/lib/api.js`, `src/context/AuthContext.jsx` |
| Sample sermons shown when no backend is connected | `src/data/sermons.js` |
| Admin page (upload sermons, members, first-timers) | `src/pages/Admin.jsx`, `src/components/admin/` |
| Colours and fonts | `tailwind.config.js`, `src/index.css` |

Search the project for `TODO` to find every placeholder still waiting for real content.

## Structure

```
src/
  App.jsx                 routes
  pages/                  one file per page (Home, About, … Login, Register, Admin)
  context/                AuthContext: who is logged in
  components/layout/      Navbar, Footer, ScrollToTop
  components/home/        sections used only on the homepage
  components/shared/      pieces reused across pages (cards, forms, headings)
  data/                   all editable content
  lib/                    api.js (backend calls), useSermons.js (sermon loading)
```

## Hosting note

The site uses clean URLs (`/about`, `/sermons`). When you deploy, configure the host to
serve `index.html` for every route (Netlify: `_redirects` file with `/* /index.html 200`;
Vercel does this automatically for Vite).
