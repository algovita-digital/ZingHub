# ZingHub: Mini Car Vacuum Cleaner store

React (Vite) + Tailwind frontend, Node/Express + MongoDB (Mongoose) backend, Cloudinary for images.

## 1. Backend
```bash
cd backend
cp .env.example .env     # fill in MONGODB_URI, Cloudinary keys, ADMIN_KEY
npm install
npm run dev              # http://localhost:5000
```
The first product (Mini Vacuum Cleaner, ₹299) is created automatically on first start.

## 2. Frontend
```bash
cd frontend
cp .env.example .env     # set VITE_WHATSAPP_NUMBER (e.g. 919876543210)
npm install
npm run dev              # http://localhost:5173
```

## WhatsApp
Set `VITE_WHATSAPP_NUMBER` to your number (country code + number, digits only) so orders open
`wa.me/<number>?text=...` with the order pre-filled. Without it the site falls back to
`https://walink.me/6ourj3`, which opens your chat but cannot carry the order text.

## Managing product images
Open `http://localhost:5173/#admin`, enter your `ADMIN_KEY`, then upload, delete or pick the main image.
Until you upload images, the photos in `frontend/public/images` are shown.

## API
| Method | Path | Notes |
|---|---|---|
| POST | `/api/orders` | name, phone, address, quantity |
| GET | `/api/reviews` | approved reviews + average |
| POST | `/api/reviews` | multipart: name, rating, comment, image (optional) |
| GET | `/api/products/main` | product shown on the page |
| POST/DELETE/PATCH | `/api/products/:id/images...` | admin, `x-admin-key` header |
| GET | `/api/orders` | admin, list orders |

## Deploy
Backend: Render/Railway (set env vars, `CLIENT_URL` = your site URL). Frontend: Vercel/Netlify with `API_URL=https://your-api/api`.
