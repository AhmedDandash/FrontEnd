# Vercel Deployment Guide

## 🚀 How the API Connection Works

### Local Development

- Uses Next.js **rewrites** (proxy) to route API calls
- All requests to `/api/*` are proxied to your backend
- Bypasses CORS issues automatically
- `NEXT_PUBLIC_API_BASE_URL` is empty → uses relative paths

### Production (Vercel)

- **Now uses the same proxy approach** as local
- No direct API calls → no CORS issues
- Works identically to your local environment

---

## 📋 Deployment Steps

### 1. Environment Variables in Vercel

Go to your Vercel project:
**Dashboard → Your Project → Settings → Environment Variables**

Add these variables for **Production**:

| Variable Name              | Value                        | Note              |
| -------------------------- | ---------------------------- | ----------------- |
| `NEXT_PUBLIC_API_BASE_URL` | _(leave empty)_              | Uses proxy        |
| `NEXT_PUBLIC_API_TIMEOUT`  | `30000`                      | 30 second timeout |
| `NEXT_PUBLIC_ENV`          | `production`                 | Environment flag  |
| `BACKEND_API_URL`          | `https://sigma26.runasp.net` | Your backend URL  |

⚠️ **Important**: The `BACKEND_API_URL` is **NOT** prefixed with `NEXT_PUBLIC_` because it's only used in `next.config.js` (server-side), not in the browser.

### 2. Deploy to Vercel

#### Option A: Via Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

#### Option B: Via Git (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Vercel will auto-deploy on every push

### 3. Verify Deployment

After deployment, test your API calls:

1. Open browser DevTools → Network tab
2. Make an API request in your app
3. Verify the request goes to `/api/*` (not directly to backend)
4. Check response is successful

---

## 🔧 How the Proxy Works

```
Browser Request:
  fetch('/api/Auth/login')
       ↓
Next.js Middleware (rewrites):
  Proxies to https://sigma26.runasp.net/api/Auth/login
       ↓
Backend Response:
  Returns data
       ↓
Browser receives response from /api/Auth/login
```

**Benefits:**

- ✅ No CORS issues
- ✅ API keys/secrets hidden
- ✅ Same behavior local & production
- ✅ Easy to change backend URL

---

## 🔄 Changing Backend URL

To point to a different backend (e.g., staging):

### In Vercel Dashboard:

Update `BACKEND_API_URL` environment variable and redeploy

### Locally:

Update `.env.local`:

```env
BACKEND_API_URL=https://your-staging-backend.com
```

---

## 🐛 Troubleshooting

### Issue: API calls return 404

**Solution**: Ensure `NEXT_PUBLIC_API_BASE_URL` is empty in Vercel env vars

### Issue: API calls still have CORS errors

**Solution**: Check that rewrites are working. In browser DevTools:

- Request URL should be `/api/...` (relative)
- Not `https://sigma26.runasp.net/api/...` (absolute)

### Issue: Environment variables not updating

**Solution**:

1. Update variables in Vercel dashboard
2. Go to Deployments tab
3. Click "Redeploy" on latest deployment

### Issue: 502 Bad Gateway

**Possible causes**:

- Backend is down
- `BACKEND_API_URL` is incorrect
- Backend takes too long to respond (increase timeout)

---

## 📊 Performance Considerations

### Proxy vs Direct Calls

- **Proxy (current)**: Adds ~10-50ms latency but solves CORS
- **Direct calls**: Faster but requires CORS configuration on backend

### When to Use Direct Calls

If your backend properly supports CORS, you can:

1. Set `NEXT_PUBLIC_API_BASE_URL=https://sigma26.runasp.net` in Vercel
2. Remove or disable rewrites in `next.config.js`

---

## 🔐 Security Notes

1. **Never expose backend URL** if it contains sensitive endpoints
2. **Use environment variables** for all API URLs
3. **The proxy hides your backend architecture** from users
4. **Consider rate limiting** on your backend

---

## ✅ Checklist Before Deployment

- [ ] All environment variables set in Vercel
- [ ] `NEXT_PUBLIC_API_BASE_URL` is empty
- [ ] `BACKEND_API_URL` points to correct backend
- [ ] Tested locally with production build: `npm run build && npm start`
- [ ] Verified API calls work in DevTools
- [ ] Backend accepts requests from Vercel domain

---

## 📞 Need Help?

1. Check Vercel deployment logs: Dashboard → Deployments → [Your Deployment] → View Logs
2. Check function logs: Dashboard → Your Project → Logs
3. Test locally first: `npm run build && npm start`

---

**🎉 Your Vercel deployment now works exactly like your local environment!**
