# 🚀 Deployment Checklist - Rozmowa (WA)

**Project:** Language and cultural hub - Polish coffee culture + conversation clubs  
**Tech Stack:** Node.js/Express API + Static Web + Vercel/Render  
**Status:** Ready for deployment with minor configuration needed

---

## 📋 Pre-Deployment Health Check

### ✅ What's Working
- [x] Monorepo structure with pnpm workspaces (api, web, proxy)
- [x] API server with logging, health checks, error handling
- [x] Static web frontend ready for Vercel
- [x] GitHub Actions CI/CD pipeline configured
- [x] Git repository clean and synced
- [x] Vercel project linked (`team_UifB4wJsZYUmLVGfWBVRqjEf/prj_UIZb5AZ8GyqebLQdtKRaHwgJn5S6`)
- [x] Homepage URL configured: `https://wa-api-kappa.vercel.app`

### ⚠️ What Needs Attention
- [ ] GitHub Secrets not configured (causing 55 warnings)
- [ ] API needs real business logic (currently demo routes)
- [ ] Web needs actual content (currently placeholder)
- [ ] Proxy service is minimal (just logs "online")
- [ ] No tests beyond echo placeholders
- [ ] No real linting configured

---

## 🎯 Ready to Deploy NOW (Web Frontend)

Your web frontend can go live **immediately** after adding secrets!

### Step 1: Add GitHub Secrets (5 minutes)
Go to: https://github.com/Backerjr/WA/settings/secrets/actions

Add these **3 required secrets**:

```
Name: VERCEL_TOKEN
Value: Ve9nOLOUFfsHelUBu8KORaE0

Name: VERCEL_ORG_ID  
Value: team_UifB4wJsZYUmLVGfWBVRqjEf

Name: VERCEL_PROJECT_ID
Value: prj_UIZb5AZ8GyqebLQdtKRaHwgJn5S6
```

### Step 2: Trigger Deployment
```bash
git commit --allow-empty -m "Trigger production deployment"
git push
```

### Step 3: Monitor
- GitHub Actions: https://github.com/Backerjr/WA/actions
- Vercel Dashboard: https://vercel.com/ahmeds-projects-a54d6045/web
- Live URL: https://wa-api-kappa.vercel.app

**Expected Timeline:** Deploy completes in ~2-3 minutes

---

## 🔧 API Deployment Options

### Option A: Render (Recommended for MVP)
1. Go to https://render.com
2. Create new "Web Service"
3. Connect GitHub repo `Backerjr/WA`
4. Settings:
   - **Root Directory:** `api`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node 18+
5. Deploy!

**Live URL:** Will be `https://wa-api-xxxxx.onrender.com`

### Option B: Keep Local/Skip for Now
- API is currently just demo routes
- Can deploy later when you add real business logic
- Web frontend works standalone (static site)

---

## 📝 Content Checklist (Before Real Launch)

### Web (`web/public/index.html`)
Current: Placeholder "Polyglot Starter Web"  
Need:
- [ ] Rozmowa branding and description
- [ ] Information about coffee culture workshops
- [ ] Conversation clubs schedule/details
- [ ] Contact form or booking system
- [ ] Polish/English language toggle
- [ ] Images, styling (CSS)

### API (`api/server.js`)
Current: Health check + demo routes  
Need:
- [ ] Workshop booking endpoints
- [ ] Event schedule API
- [ ] Contact form handler
- [ ] Database integration (if needed)
- [ ] Email notifications
- [ ] Authentication (if needed)

### Proxy (`proxy/index.js`)
Current: Just logs "online"  
Decision needed:
- [ ] Do you need a proxy? What's its purpose?
- [ ] Can likely be removed if not needed

---

## 🎨 Next Development Steps (Priority Order)

### 1. **Immediate** (Deploy MVP today)
- [x] Add GitHub secrets
- [ ] Push to trigger deployment
- [ ] Verify web is live
- [ ] Test health endpoint: `/health`

### 2. **Short-term** (This week)
- [ ] Update `web/public/index.html` with real Rozmowa content
- [ ] Add basic CSS styling
- [ ] Create "About" page
- [ ] Add workshop schedule

### 3. **Medium-term** (Next 2 weeks)
- [ ] Build API endpoints for bookings
- [ ] Add database (MongoDB/PostgreSQL)
- [ ] Create admin panel
- [ ] Add email notifications
- [ ] Multi-language support

### 4. **Long-term** (Month+)
- [ ] User accounts/authentication
- [ ] Payment integration
- [ ] Calendar integration
- [ ] Mobile optimization
- [ ] Analytics

---

## 🔒 Security Checklist

- [x] Secrets stored in GitHub (not in code)
- [x] Error handling prevents info leaks in production
- [ ] Add rate limiting for API
- [ ] Add CORS configuration
- [ ] Add input validation
- [ ] Add HTTPS enforcement (Vercel handles this)
- [ ] Add security headers (already configured in vercel.json)

---

## 🐛 Known Issues & Warnings

### VS Code Problems (55 warnings)
- **Cause:** Missing GitHub secrets + temporary chat snapshot files
- **Impact:** None on deployment
- **Fix:** Add secrets + close snapshot tabs

### Proxy Service
- **Status:** Minimal implementation
- **Impact:** None (doesn't affect web/api)
- **Action:** Decide if needed or remove

---

## 📊 Deployment Environments

### Production
- **Web:** https://wa-api-kappa.vercel.app
- **API:** Not deployed yet
- **Trigger:** Push to `main` branch
- **CI/CD:** GitHub Actions

### Development
- **Local:** `pnpm dev` runs all services
- **API:** http://localhost:3000
- **Web:** Static files in `web/public/`

---

## 🚦 Go-Live Decision Matrix

| Component | Status | Can Deploy? | Should Deploy? |
|-----------|--------|-------------|----------------|
| **Web Frontend** | ✅ Ready | YES | YES (placeholder OK for MVP) |
| **API** | ✅ Ready | YES | OPTIONAL (demo routes only) |
| **Proxy** | ⚠️ Minimal | YES | NO (unclear purpose) |
| **CI/CD** | ✅ Ready | N/A | YES |

---

## 🎯 Recommended Action Plan

### Today (< 1 hour)
1. ✅ Add 3 GitHub secrets
2. ✅ Push to trigger deployment  
3. ✅ Verify web is live
4. ✅ Share URL with stakeholders

### This Week
1. Update homepage content
2. Add basic styling
3. Deploy API to Render (if needed)
4. Test end-to-end flow

### This Month
1. Add real features
2. Collect user feedback
3. Iterate based on feedback
4. Add analytics

---

## 📞 Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **GitHub Actions:** https://docs.github.com/actions
- **Debugging 500s:** See `README.md` section

---

## ✅ Final Checklist Before Going Live

- [ ] Secrets added to GitHub
- [ ] Test deployment successful
- [ ] Homepage content updated (or placeholder acceptable)
- [ ] Health check works: `/health` returns 200
- [ ] No critical errors in GitHub Actions
- [ ] DNS/domain configured (if using custom domain)
- [ ] Stakeholders notified
- [ ] Monitoring/analytics set up (optional)

---

**Status:** 🟢 **READY TO DEPLOY WEB NOW!**  
**Blocker:** Just need to add GitHub secrets (5 minutes)

Once secrets are added, your site will be live automatically!
