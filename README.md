# Revive Gospel Embassy website

The website and online services of Revive Gospel Embassy (RGE), Agbani, Enugu State.

| Folder | What it is | Guide |
| --- | --- | --- |
| [`Frontend/`](Frontend) | The website (React + Vite + Tailwind) | [Frontend/README.md](Frontend/README.md) |
| [`Backend/`](Backend) | The API: member accounts, sermon uploads and downloads, forms (Express + MongoDB + Cloudinary) | [Backend/README.md](Backend/README.md) |

## Run both on your computer

Open two terminals:

```bash
# Terminal 1: the API
cd Backend
npm install
npm run dev            # http://localhost:5000  (needs Backend/.env, see Backend/README.md)

# Terminal 2: the website
cd Frontend
npm install
npm run dev            # http://localhost:5173  (needs Frontend/.env with VITE_API_URL=http://localhost:5000)
```

When deploying, set the **root directory** to `Frontend` for the website host (Vercel/Netlify)
and to `Backend` for the API host (Render).
