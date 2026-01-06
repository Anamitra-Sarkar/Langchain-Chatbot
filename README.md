# 🚀 AI Chat Platform

A production-ready, fully deployable AI Chat Platform built with Next.js 14 and designed exclusively for Vercel hosting.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## ✨ Features

- 🤖 **Multi-Provider AI Support**: OpenAI, HuggingFace, and Mock providers
- 🌊 **Real-time Streaming**: Token-by-token streaming responses using Edge Functions
- �� **Authentication**: NextAuth with Google OAuth and Email (Magic Link)
- 💾 **Persistent Storage**: Vercel Postgres with in-memory fallback
- 🎨 **Modern UI**: Glassmorphism design with sky-blue theme
- 🛠️ **Built-in Tools**: 
  - Canvas (Drawing + Sticky Notes)
  - Code Generator
  - Image Generator
  - Voice Input
  - Web Search
- 📱 **Responsive**: Mobile-first design
- 🧪 **Tested**: Unit and integration tests
- 🚦 **CI/CD**: GitHub Actions workflow
- ⚡ **Vercel-Native**: 100% compatible with Vercel deployment

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           Vercel Edge Network               │
│  ┌─────────────────────────────────────┐   │
│  │      Next.js 14 App Router           │   │
│  │  ┌────────────┐   ┌──────────────┐  │   │
│  │  │  Frontend  │   │  API Routes  │  │   │
│  │  │  (React)   │◄──┤  Serverless  │  │   │
│  │  └────────────┘   └──────────────┘  │   │
│  │         │                │           │   │
│  │         │                ├──► Edge   │   │
│  │         │                │    Chat   │   │
│  │         ▼                │    Stream │   │
│  │    ┌──────────┐          │           │   │
│  │    │NextAuth  │          │           │   │
│  │    │   Auth   │          │           │   │
│  │    └──────────┘          ▼           │   │
│  └────────────────────────────────────  │   │
│              │              │            │   │
│              ▼              ▼            │   │
│     ┌──────────────┬──────────────┐     │   │
│     │   Postgres   │   Vercel KV  │     │   │
│     │   Database   │ Rate Limiting│     │   │
│     └──────────────┴──────────────┘     │   │
└─────────────────────────────────────────────┘
                     │
                     ▼
         ┌──────────────────────┐
         │   AI Providers        │
         │  - OpenAI             │
         │  - HuggingFace        │
         │  - Mock (Fallback)    │
         └──────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/Anamitra-Sarkar/Langchain-Chatbot.git
cd Langchain-Chatbot
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Minimum required for local development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Optional: Add AI provider keys
OPENAI_API_KEY=sk-...
HUGGINGFACEHUB_API_TOKEN=hf_...
```

4. **Run development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

### Required

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth secret key | Generate with `openssl rand -base64 32` |

### AI Providers (Optional - works without any)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for GPT models |
| `HUGGINGFACEHUB_API_TOKEN` | HuggingFace API token |

### Authentication (Optional)

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `EMAIL_SERVER_HOST` | SMTP server for magic links |
| `EMAIL_SERVER_USER` | SMTP username |
| `EMAIL_SERVER_PASSWORD` | SMTP password |

### Database (Optional - uses in-memory fallback)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Vercel Postgres connection string |
| `POSTGRES_URL` | Postgres URL |

### Tools (Optional)

| Variable | Description |
|----------|-------------|
| `TAVILY_API_KEY` | Tavily API key for web search |

## 📦 Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Anamitra-Sarkar/Langchain-Chatbot)

### Manual Deployment

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
vercel
```

4. **Add Environment Variables**

In Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add all required environment variables
- Redeploy if needed

5. **Enable Vercel Postgres (Optional)**

```bash
vercel postgres create
```

Then add the connection string to environment variables.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run type checking
npm run type-check

# Run linter
npm run lint
```

## 🏗️ Project Structure

```
Langchain-Chatbot/
├── app/
│   ├── api/              # API routes (Serverless + Edge)
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── chat/         # Chat streaming (Edge)
│   │   ├── conversations/# CRUD operations
│   │   └── tools/        # Tool endpoints
│   ├── chat/             # Chat page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (redirects to chat)
├── components/
│   ├── chat/             # Chat components
│   ├── layout/           # Layout components
│   ├── ui/               # Reusable UI components
│   └── tools/            # Tool components
├── lib/
│   ├── ai/               # AI provider system
│   ├── auth/             # Authentication config
│   ├── db/               # Database layer
│   ├── utils/            # Utility functions
│   └── config.ts         # App configuration
├── types/                # TypeScript types
├── __tests__/            # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🔒 Security Features

- ✅ Input validation and sanitization
- ✅ CSRF protection
- ✅ Rate limiting (with Vercel KV)
- ✅ Secure session management
- ✅ API key encryption
- ✅ Prompt injection mitigation
- ✅ XSS prevention
- ✅ No API keys exposed to frontend

## 🎯 Core Functionality

### Chat System

- **Streaming Responses**: Real-time token-by-token streaming using Edge Functions and Web Streams API
- **Multi-Provider**: Automatically selects available AI provider (OpenAI → HuggingFace → Mock)
- **Conversation Management**: Create, read, update, delete conversations
- **Message History**: Persistent message storage with timestamps
- **Markdown Support**: Render formatted text and code blocks
- **Syntax Highlighting**: Code blocks with copy functionality

### Tools

1. **Canvas Tool**: Interactive drawing with sticky notes and persistence
2. **Code Generator**: AI-powered code generation with language detection
3. **Image Generator**: Text-to-image generation (with mock fallback)
4. **Voice Input**: Browser speech-to-text integration
5. **Web Search**: Tavily-powered search with mock fallback

### Authentication

- **Email Magic Links**: Passwordless authentication
- **Google OAuth**: One-click sign-in
- **Session Management**: Secure JWT-based sessions
- **Protected Routes**: Automatic authentication checks
- **Anonymous Mode**: Chat without signing in (with upgrade prompt)

## 📊 Performance

- ⚡ **Edge Functions**: Sub-100ms cold start for chat streaming
- 🚀 **Optimized Build**: Next.js 14 App Router with automatic code splitting
- 📦 **Small Bundle**: Tree-shaking and dynamic imports
- 🎯 **Web Vitals**: Optimized for Core Web Vitals

## 🛣️ Roadmap

- [ ] Multi-modal support (images, audio, video)
- [ ] Collaborative chats
- [ ] Custom AI model fine-tuning
- [ ] Plugin system for custom tools
- [ ] Mobile apps (React Native)
- [ ] Advanced analytics dashboard
- [ ] Team workspaces
- [ ] API for third-party integrations

## 🐛 Known Limitations

- Database requires Vercel Postgres for full persistence (falls back to in-memory)
- Email provider requires SMTP configuration for magic links
- Image generation is mocked without API key
- Web search is mocked without Tavily API key
- Rate limiting requires Vercel KV

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/Anamitra-Sarkar/Langchain-Chatbot/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Anamitra-Sarkar/Langchain-Chatbot/discussions)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Deployed on [Vercel](https://vercel.com/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Syntax highlighting by [Prism](https://prismjs.com/)

---

Made with ❤️ for the developer community
