# FitMatePro - Your Personal Fitness & Wellness Coach

> Transforming fitness through AI-powered personalized nutrition, workout tracking, and progress analytics.

## 🎯 About

FitMatePro is a comprehensive fitness and wellness application that combines AI coaching, personalized meal planning, advanced workout tracking, and intelligent progress analytics to help users achieve their health goals.

---

## ✨ Key Features

### 🍽️ Personalized Meal Planning
- **AI-Generated Meal Plans**: Weekly plans based on goals, preferences, and dietary restrictions
- **Recipe Database**: Searchable library with detailed nutritional information
- **Smart Shopping Lists**: Auto-generated from meal plans
- **Macro Tracking**: Real-time calorie and macro tracking

### 💪 Advanced Workout Logging
- **Detailed Exercise Tracking**: Log sets, reps, weight, RPE, and duration
- **Progressive Overload**: Visualize strength and volume gains over time
- **Exercise Library**: Comprehensive database with instructions and videos
- **Workout History**: Complete history with search and filters

### 📊 Intelligent Progress Reports
- **Automated Weekly Reports**: AI-generated insights and recommendations
- **Visual Analytics**: Interactive charts showing trends
- **Goal Tracking**: Monitor progress toward fitness goals
- **Body Composition**: Track photos, measurements, and body fat %

### 🔔 Smart Notifications
- **Workout Reminders**: Customizable time-based alerts
- **Meal Timing**: Pre/post workout nutrition alerts
- **Hydration Reminders**: Consistent water intake tracking
- **Goal Check-ins**: Weekly progress review prompts

### 🧠 AI Personal Coach
- **24/7 Availability**: Chat with your AI coach anytime
- **Personalized Tips**: Customized fitness and nutrition advice
- **Progress Insights**: Data-driven recommendations
- **Motivation**: Stay accountable and motivated

### 💰 Affiliate Marketing
- **Contextual Recommendations**: Products suggested at optimal moments
- **Recipe-Product Pairing**: Kitchen tools with recipes
- **Supplement Suggestions**: Based on nutrition gaps
- **Revenue Tracking**: Analytics dashboard

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Router** for navigation
- **TanStack Query** for state management
- **Recharts** for data visualization

### Backend
- **Supabase** (PostgreSQL database)
- **Supabase Auth** for authentication
- **Supabase Storage** for images
- **Supabase Edge Functions** for serverless logic
- **Row Level Security** for data protection

### Integrations
- **Stripe** for payments
- **OpenAI/Claude** for AI features (optional)
- **Spoonacular API** for recipes (optional)
- **Google Vision** for food recognition (optional)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ (or 22.12+)
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd fitmatepro

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Run development server
npm run dev

# Open http://localhost:8080
```

### Database Setup

```bash
# Run migrations
supabase db push

# Seed initial data (optional)
supabase db seed
```

---

## 📁 Project Structure

```
fitmatepro/
├── src/
│   ├── components/         # React components
│   │   ├── nutrition/      # Meal planning & recipes
│   │   ├── workout/        # Workout logging
│   │   ├── progress/       # Analytics & reports
│   │   ├── notifications/  # Notification system
│   │   ├── shop/           # Affiliate products
│   │   └── ui/             # shadcn/ui components
│   ├── pages/              # Route components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities
│   └── integrations/       # External services
├── supabase/
│   ├── migrations/         # Database migrations
│   └── functions/          # Edge functions
├── public/                 # Static assets
└── docs/                   # Documentation
```

---

## 📚 Documentation

### Planning & Strategy
- **COACHAI_REVAMP_PLAN.md** - Comprehensive feature plan (legacy name, now FitMatePro)
- **IMPLEMENTATION_ROADMAP.md** - Step-by-step guide
- **IMPLEMENTATION_CHECKLIST.md** - Task tracking
- **QUICK_START.md** - Quick start guide

### Development
- Database schema: `supabase/migrations/`
- API documentation: `docs/api.md`
- Component docs: `docs/components.md`

---

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (actions, CTAs)
- **Success**: Green (goals met, completed)
- **Motivation**: Orange (energy, action)
- **Wellness**: Blue (calm, health)

### Key Principles
- **Mobile-first**: Responsive design
- **Accessibility**: WCAG 2.1 compliant
- **Performance**: Fast load times
- **User-centric**: Intuitive UX

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint
```

---

## 📦 Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy
npm run deploy
```

---

## 🔐 Environment Variables

Create a `.env.local` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_OPENAI_API_KEY=your_openai_key (optional)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📊 Features Roadmap

### ✅ Completed
- [x] User authentication
- [x] Basic nutrition tracking
- [x] Workout planning
- [x] Product recommendations
- [x] Mental wellness tracking

### 🚧 In Progress
- [ ] Enhanced meal planning
- [ ] Advanced workout logging
- [ ] Automated progress reports
- [ ] Notification system

### 📅 Planned
- [ ] Photo food recognition
- [ ] Barcode scanner
- [ ] Wearable integrations
- [ ] Social features
- [ ] Advanced analytics

---

## 🎯 Success Metrics

### User Engagement
- DAU/MAU: Target 40%+
- Average sessions: 10+ minutes
- Feature adoption: 60%+

### Retention
- 30-day retention: 70%+
- 90-day retention: 50%+
- Subscription conversion: 15%+

### Revenue
- Affiliate revenue per user
- Subscription revenue growth
- User lifetime value

---

## 🐛 Known Issues

- Node.js version compatibility (upgrade recommended)
- Offline support limitations
- Photo upload optimization needed

See [Issues](https://github.com/your-repo/issues) for full list.

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

**Product**: Your Team  
**Design**: Your Designer  
**Development**: Your Dev Team  

---

## 🙏 Acknowledgments

- **shadcn** for UI components
- **Supabase** for backend infrastructure
- **Tailwind CSS** for styling
- **OpenAI** for AI capabilities
- **Community** for feedback and support

---

## 📞 Support

- **Documentation**: Check `docs/` folder
- **Issues**: GitHub Issues
- **Email**: support@fitmatepro.com

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/your-repo&type=Date)](https://star-history.com/#your-username/your-repo&Date)

---

**Built with ❤️ for your fitness journey**

*Transform your health, one workout and one meal at a time.*


