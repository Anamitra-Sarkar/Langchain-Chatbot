# 🚀 Deployment Guide

## Quick Deploy to Vercel

### Prerequisites
- Vercel account (free tier works)
- GitHub account
- Optional: OpenAI or HuggingFace API key

### Steps

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from Project Directory**
```bash
cd /path/to/Langchain-Chatbot
vercel
```

4. **Configure Environment Variables**

In Vercel Dashboard → Project Settings → Environment Variables, add:

**Required:**
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., https://your-app.vercel.app)

**Optional (but recommended for production):**
- `OPENAI_API_KEY`: Your OpenAI API key
- `HUGGINGFACEHUB_API_TOKEN`: Your HuggingFace API token
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

5. **Redeploy After Adding Environment Variables**
```bash
vercel --prod
```

### Enable Vercel Postgres (Optional)

```bash
vercel postgres create
```

Then add the connection string to environment variables:
- `DATABASE_URL`

### Verify Deployment

1. Visit your Vercel URL
2. Test chat functionality (works with mock AI by default)
3. Check streaming is working
4. Test authentication if Google OAuth is configured

## Production Checklist

- [ ] All environment variables configured
- [ ] NEXTAUTH_SECRET is secure and random
- [ ] NEXTAUTH_URL matches your domain
- [ ] API keys stored as environment variables (not in code)
- [ ] Google OAuth configured (optional)
- [ ] Database connected (optional, uses in-memory fallback)
- [ ] Custom domain configured (optional)
- [ ] Rate limiting enabled with Vercel KV (optional)

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify NEXTAUTH_SECRET is set
- Check build logs in Vercel dashboard

### Chat Not Streaming
- Ensure Edge runtime is enabled for chat endpoint (it is by default)
- Check browser console for errors
- Verify API endpoint is responding

### Authentication Issues
- Verify NEXTAUTH_SECRET and NEXTAUTH_URL are correct
- Check Google OAuth credentials if using Google sign-in
- Ensure callback URL is whitelisted in Google Console

### Database Connection Issues
- App will work with in-memory storage if database is not connected
- Check DATABASE_URL format
- Verify Vercel Postgres is provisioned

## Scaling Considerations

- **Edge Functions**: Chat endpoint runs on Edge for global performance
- **Serverless Functions**: API routes scale automatically
- **Database**: Use Vercel Postgres with connection pooling
- **Rate Limiting**: Implement with Vercel KV
- **CDN**: Static assets served via Vercel Edge Network

## Security Best Practices

1. Always use environment variables for secrets
2. Rotate NEXTAUTH_SECRET periodically
3. Use secure API keys with minimal permissions
4. Enable rate limiting for production
5. Implement proper CORS policies
6. Monitor API usage and costs

## Support

For issues or questions:
- Check the README.md
- Review the .env.example
- Open a GitHub issue
- Contact support@example.com
