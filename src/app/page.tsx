import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar - glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="HaleelAI" className="h-10" />
            <span className="text-xl font-bold text-gray-900">
              Haleel<span className="text-emerald-600">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-emerald-900 animate-gradient" />

        {/* Decorative floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl animate-pulse-glow" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Floating subject icons */}
          <div className="hidden md:block absolute top-32 left-[10%] text-4xl opacity-20 animate-float">
            <span role="img" aria-label="math">+</span>
          </div>
          <div className="hidden md:block absolute top-48 right-[12%] text-3xl opacity-15 animate-float-delayed">
            <span className="text-blue-300 font-mono">f(x)</span>
          </div>
          <div className="hidden md:block absolute bottom-40 left-[15%] text-3xl opacity-15 animate-float-delayed">
            <span className="text-emerald-300 font-mono">H2O</span>
          </div>
          <div className="hidden md:block absolute bottom-32 right-[18%] text-3xl opacity-20 animate-float">
            <span className="text-yellow-300 font-mono">&pi;</span>
          </div>
        </div>

        {/* Hero Content - Split Layout */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Text */}
          <div className="text-left">
            {/* Badge */}
            <div className="animate-slide-up inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-blue-100 text-sm font-medium px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Trusted by 5,000+ students across Ghana
            </div>

            <h1 className="animate-slide-up-delay-1 text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Ace Your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                BECE
              </span>
              {" & "}
              <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                WASSCE
              </span>
              <br />
              <span className="shimmer-text">With Confidence</span>
            </h1>

            <p className="animate-slide-up-delay-2 text-lg md:text-xl text-blue-100/80 mb-10 max-w-lg leading-relaxed">
              Practice with real past questions, take AI-powered mock exams, and
              track your progress. Everything you need to excel in one place.
            </p>

            {/* Portal Entry Cards */}
            <div className="animate-slide-up-delay-3 grid sm:grid-cols-2 gap-4 max-w-lg mb-8">
              {/* JHS Portal */}
              <Link
                href="/signup?level=JHS"
                className="portal-card portal-card-jhs group relative bg-white rounded-2xl p-5 text-left shadow-xl shadow-blue-900/10"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                        JHS Portal
                      </h3>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        BECE
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                    Start Practicing
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* SHS Portal */}
              <Link
                href="/signup?level=SHS"
                className="portal-card portal-card-shs group relative bg-white rounded-2xl p-5 text-left shadow-xl shadow-emerald-900/10"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        SHS Portal
                      </h3>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        WASSCE
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                    Start Practicing
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Social proof avatars */}
            <div className="animate-slide-up-delay-4 flex items-center gap-3">
              <div className="flex -space-x-3">
                <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80" alt="Student" className="w-9 h-9 rounded-full border-2 border-white/30 object-cover" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" alt="Student" className="w-9 h-9 rounded-full border-2 border-white/30 object-cover" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" alt="Student" className="w-9 h-9 rounded-full border-2 border-white/30 object-cover" />
                <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80" alt="Student" className="w-9 h-9 rounded-full border-2 border-white/30 object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-blue-200/70 text-xs mt-0.5">Loved by 5,000+ Ghanaian students</p>
              </div>
            </div>
          </div>

          {/* Right side - Image Collage */}
          <div className="hidden md:block relative">
            <div className="relative w-full h-[500px]">
              {/* Main hero image */}
              <div className="absolute top-4 right-0 w-[85%] h-[320px] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/40 animate-slide-up-delay-1">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800"
                  alt="African students studying together"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating smaller image */}
              <div className="absolute bottom-8 left-0 w-[55%] h-[200px] rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/30 border-4 border-white/20 animate-slide-up-delay-2">
                <img
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600"
                  alt="Students in classroom"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Stats floating card */}
              <div className="absolute bottom-0 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">10,000+</p>
                    <p className="text-xs text-gray-500">Past Questions</p>
                  </div>
                </div>
              </div>
              {/* AI badge floating */}
              <div className="absolute top-0 left-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl px-4 py-2 shadow-xl animate-float-delayed">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                  <span className="text-white text-sm font-semibold">AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave divider */}
      <div className="relative -mt-1">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80V20C240 60 480 0 720 20C960 40 1200 80 1440 40V80H0Z" fill="white" />
        </svg>
      </div>

      {/* Stats Bar */}
      <section className="relative z-20 max-w-5xl mx-auto px-4 w-full -mt-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {[
            { value: "10K+", label: "Questions", color: "text-blue-600" },
            { value: "5K+", label: "Students", color: "text-emerald-600" },
            { value: "50+", label: "Topics", color: "text-amber-600" },
            { value: "AI", label: "Powered", color: "text-purple-600" },
          ].map((stat) => (
            <div key={stat.label} className="stat-item text-center py-6 px-4">
              <div className={`text-2xl md:text-3xl font-extrabold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Excel
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Built specifically for Ghanaian students preparing for BECE and WASSCE examinations.
            </p>
          </div>

          {/* Features with image */}
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Feature image */}
            <div className="hidden lg:block lg:col-span-2 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600"
                  alt="Students in classroom"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl px-5 py-3 shadow-lg">
                <p className="text-white font-bold text-lg">100%</p>
                <p className="text-white/80 text-xs">WAEC Aligned</p>
              </div>
            </div>

            {/* Feature cards */}
            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-5">
              {[
                {
                  title: "Past Questions Bank",
                  desc: "Thousands of BECE & WASSCE past questions organized by subject, topic, and year.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                  ),
                  gradient: "from-blue-500 to-blue-700",
                  shadow: "shadow-blue-500/20",
                },
                {
                  title: "Timed Mock Exams",
                  desc: "Simulate real exam conditions with timed tests and detailed performance summaries.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  ),
                  gradient: "from-amber-500 to-orange-600",
                  shadow: "shadow-amber-500/20",
                },
                {
                  title: "AI-Powered Practice",
                  desc: "Get instant explanations, personalized questions, and smart recommendations.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                    </svg>
                  ),
                  gradient: "from-purple-500 to-violet-700",
                  shadow: "shadow-purple-500/20",
                },
                {
                  title: "Progress Tracking",
                  desc: "Monitor scores, identify weak subjects, and watch your improvement over time.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                  ),
                  gradient: "from-emerald-500 to-green-700",
                  shadow: "shadow-emerald-500/20",
                },
                {
                  title: "WAEC Syllabus Aligned",
                  desc: "Every question follows the official WAEC syllabus. Core and elective subjects covered.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                  ),
                  gradient: "from-cyan-500 to-teal-700",
                  shadow: "shadow-cyan-500/20",
                },
                {
                  title: "Mobile Friendly",
                  desc: "Study anywhere, anytime. Works perfectly on all phones and tablets.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  ),
                  gradient: "from-rose-500 to-pink-700",
                  shadow: "shadow-rose-500/20",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="feature-card bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.shadow} shadow-lg flex items-center justify-center text-white mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Student Photo Strip */}
      <section className="py-12 bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-600 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-6 justify-center flex-wrap md:flex-nowrap">
            {[
              { src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=300", alt: "Students studying" },
              { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300", alt: "Classroom learning" },
              { src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=300", alt: "Students celebrating" },
              { src: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=300", alt: "Students with books" },
            ].map((photo, i) => (
              <div key={i} className="w-56 h-36 rounded-xl overflow-hidden shadow-lg border-2 border-white/20 flex-shrink-0">
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-center text-white/80 text-sm font-medium mt-6">
            Join thousands of students across Ghana who are acing their exams with HaleelAI
          </p>
        </div>
      </section>

      {/* Wave divider */}
      <div className="relative">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0V40C360 10 720 60 1080 30C1260 15 1380 25 1440 20V0H0Z" fill="white" />
        </svg>
      </div>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Start in 3 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Choose Your Level",
                desc: "Select JHS (BECE) or SHS (WASSCE) to get a personalized experience for your exam.",
                color: "from-blue-600 to-blue-700",
              },
              {
                step: "02",
                title: "Pick a Subject",
                desc: "Browse all core and elective subjects aligned with the WAEC syllabus.",
                color: "from-emerald-600 to-emerald-700",
              },
              {
                step: "03",
                title: "Practice & Improve",
                desc: "Answer questions, get instant feedback with explanations, and track your improvement.",
                color: "from-amber-500 to-orange-600",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200" />
                )}
                <div
                  className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} text-white font-extrabold text-xl items-center justify-center shadow-lg mb-5 relative z-10`}
                >
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Preview */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full mb-4">
              Subjects
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Complete WAEC Coverage
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              All core subjects for both BECE and WASSCE, plus popular electives for SHS.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* JHS Subjects */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  JHS
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">BECE Subjects</h3>
                  <p className="text-xs text-gray-500">Junior High School</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Mathematics", "English Language", "Integrated Science", "Social Studies", "ICT", "RME", "French", "Creative Arts", "Career Technology"].map((s) => (
                  <span key={s} className="bg-white text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* SHS Subjects */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-8 border border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  SHS
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">WASSCE Subjects</h3>
                  <p className="text-xs text-gray-500">Senior High School</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Core Maths", "English", "Integrated Science", "Social Studies", "Physics", "Chemistry", "Biology", "Economics", "Elective Maths", "Geography", "Government", "Accounting"].map((s) => (
                  <span key={s} className="bg-white text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Students Celebrating Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800"
              alt="Happy students celebrating their exam results"
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                Your Success Story Starts Here
              </h3>
              <p className="text-blue-100/90 text-base md:text-lg max-w-lg">
                Every year, HaleelAI students celebrate outstanding results in their BECE and WASSCE exams. You could be next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wave divider */}
      <div className="relative">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V20C480 50 960 0 1440 30V60H0Z" fill="#f9fafb" />
        </svg>
      </div>

      {/* Testimonials / Social Proof */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full mb-4">
              Student Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Loved by Students
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Kwame A.",
                level: "SHS 3",
                text: "HaleelAI helped me identify my weak topics in Core Maths. I went from scoring 40% to 78% in just 2 months of practice!",
                color: "border-blue-200",
                avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200",
              },
              {
                name: "Abena M.",
                level: "JHS 3",
                text: "The mock BECE exams feel exactly like the real thing. The instant explanations helped me understand topics I used to struggle with.",
                color: "border-emerald-200",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
              },
              {
                name: "Yaw K.",
                level: "SHS 2",
                text: "The AI practice is incredible. It generates questions on exactly the topics I need to improve. Best study tool I have ever used.",
                color: "border-amber-200",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
              },
            ].map((t) => (
              <div
                key={t.name}
                className={`bg-white rounded-2xl p-7 border-2 ${t.color} shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.level}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-emerald-800 shadow-2xl">
            {/* Background image overlay */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800"
                alt="Students graduating"
                className="w-full h-full object-cover opacity-15"
              />
            </div>

            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10 p-10 md:p-16 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Free to get started
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Ready to Start Practicing?
              </h2>
              <p className="text-blue-100/80 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of Ghanaian students preparing for their exams with HaleelAI. Your success journey begins now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup?level=JHS"
                  className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-900/30 text-base"
                >
                  JHS Portal (BECE)
                </Link>
                <Link
                  href="/signup?level=SHS"
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/30 text-base"
                >
                  SHS Portal (WASSCE)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.svg" alt="HaleelAI" className="h-8" />
                <span className="text-lg font-bold text-white">
                  Haleel<span className="text-emerald-400">AI</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                The #1 AI-powered platform for Ghanaian students to practice BECE & WASSCE
                past questions, take mock exams, and track academic performance.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Portals</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/signup?level=JHS" className="hover:text-white transition-colors">
                    JHS Portal (BECE)
                  </Link>
                </li>
                <li>
                  <Link href="/signup?level=SHS" className="hover:text-white transition-colors">
                    SHS Portal (WASSCE)
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2026 HaleelAI. All rights reserved.</p>
            <p className="text-xs text-gray-500">Made with care for Ghanaian students &mdash; haleelai.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
