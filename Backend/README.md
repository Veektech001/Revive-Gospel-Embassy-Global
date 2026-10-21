# RGE Backend (API)

Express + MongoDB API for the Revive Gospel Embassy website.

- **Members** create an account and log in to listen to and download sermons.
- **Admins** (the media team) upload, edit, hide and delete sermons from the website's `/admin` page,
  and can see members, first-timer forms and newsletter subscribers.
- **Audio files** are stored privately on **Cloudinary**. Members never see the real file address.
  When a logged-in member clicks Download, the API creates a link that expires after 10 minutes.

---

## 1. One-time setup (about 20 minutes)

### a) MongoDB Atlas (the database, free)
1. Sign up at **mongodb.com/atlas** and create a free **M0** cluster.
2. *Database Access* → add a database user with a password.
3. *Network Access* → add IP address `0.0.0.0/0` (allow from anywhere, needed for hosting).
4. *Connect* → *Drivers* → copy the connection string. Put the database name `rge` before the `?`, e.g.
   `mongodb+srv://rgeuser:PASSWORD@cluster0.abcde.mongodb.net/rge?retryWrites=true&w=majority`

### b) Cloudinary (audio storage, free tier)
1. Sign up at **cloudinary.com**.
2. On the dashboard, copy **Cloud name**, **API Key** and **API Secret**.

### c) Create your `.env` file
In the `Backend` folder, copy `.env.example` to a new file called `.env` and fill it in.
To make a `JWT_SECRET`, run this in the terminal and paste the result:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> Never upload `.env` to GitHub. It's already listed in `.gitignore`.

---

## 2. Run it on your computer

```bash
cd Backend
npm install
npm run create-admin -- "Your Name" you@example.com "a-strong-password"
npm run dev
```

You should see `✓ MongoDB connected` and `✓ RGE API running on http://localhost:5000`.

Then connect the website: in the `Frontend` folder create a file called `.env` containing

```
VITE_API_URL=http://localhost:5000
```

and restart `npm run dev` there. Open http://localhost:5173/admin and log in with the admin account.

**Without Cloudinary** (empty Cloudinary settings) files are saved in `Backend/uploads/`. Fine for
testing on your computer, but use Cloudinary for the real site.

**Without email settings** password-reset emails are printed in the backend terminal instead of sent.
For real emails, fill in the `SMTP_` settings (a Gmail account with an
[App Password](https://support.google.com/accounts/answer/185833) works).

---

## 3. Put it online

**Backend → Render.com (free plan)**
1. New → *Web Service* → connect the GitHub repo.
2. Root directory: `Backend` · Build command: `npm install` · Start command: `npm start`.
3. Add every value from your `.env` under *Environment*, with
   `NODE_ENV=production`, `FRONTEND_URL=https://your-website-address` and
   `PUBLIC_API_URL=https://your-api.onrender.com`.
4. After it deploys, open `https://your-api.onrender.com/api/health`. It should say `{"ok":true}`.

> Render's free plan sleeps after 15 minutes without visitors, so the first request after a quiet
> spell takes about 30 seconds. The paid plan avoids this.

**Website → Vercel or Netlify (free)**
- Root directory `Frontend`, build command `npm run build`, output folder `dist`.
- Environment variable `VITE_API_URL=https://your-api.onrender.com`.

---

## 4. Everyday use (media team)

1. Go to `yourwebsite/admin` and log in.
2. **Sermons** tab → fill in title, date, series → choose the recording (any audio format, up to 300 MB) → *Upload sermon*.
   The server automatically converts it to a **64 kbps mono MP3** (about 29 MB per hour) before storing it,
   so members use as little mobile data as possible. Long sermons take a few minutes to process.
3. Untick *Show on the website* to save a hidden draft. Use *Hide* / *Show* / *Edit* / *Delete* in the list.
4. **Members** tab → *Make admin* gives someone upload access.

To change the quality, set `AUDIO_BITRATE` in `.env` (e.g. `48k` for even smaller files, `96k` for higher quality).
It only affects sermons uploaded after the change.

---

## API reference

| Method | Path | Who | What |
|---|---|---|---|
| POST | `/api/auth/register` | anyone | Create member account → `{ token, user }` |
| POST | `/api/auth/login` | anyone | Log in → `{ token, user }` |
| GET | `/api/auth/me` | member | Current user |
| POST | `/api/auth/forgot-password` | anyone | Email a reset link |
| POST | `/api/auth/reset-password` | anyone | `{ token, password }` |
| GET | `/api/sermons?search=&series=&page=&limit=` | anyone | List published sermons |
| GET | `/api/sermons/series` | anyone | Series names |
| GET | `/api/sermons/:id` | anyone | One sermon |
| GET | `/api/sermons/:id/download?mode=download\|listen` | member | Short-lived file link |
| GET | `/api/sermons/admin/all` | admin | All sermons incl. hidden, with download counts |
| POST | `/api/sermons` | admin | Multipart: `title, date, series, speaker, description, published, audio, image` |
| PATCH | `/api/sermons/:id` | admin | Same fields, all optional |
| DELETE | `/api/sermons/:id` | admin | Deletes sermon and its files |
| GET | `/api/users` · PATCH `/api/users/:id/role` | admin | Members list · make/remove admin |
| POST / GET | `/api/visitors` | anyone / admin | First-timer form |
| POST / GET | `/api/newsletter` | anyone / admin | Newsletter sign-up |

Send the token as `Authorization: Bearer <token>`.

## Tests

`npm test` runs 12 automated tests against a MongoDB at `TEST_MONGODB_URI`
(default `mongodb://127.0.0.1:27017/rge_test`). The test database is wiped on every run, so
never point it at the real one.
