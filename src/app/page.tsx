import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-700">
            haleel<span className="text-emerald-600">.org</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/login" className="text-gray-600 hover:text-blue-700 font-medium px-4 py-2">
              Log In
            </Link>
            <Link href="/signup" className="btn-primary text-sm">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Practice BECE & WASSCE Past Questions Online
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Revise smarter, take mock exams, and track your performance.
          </p>

          {/* Portal Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Link
              href="/signup?level=JHS"
              className="card hover:shadow-lg hover:border-blue-200 transition-all group p-8"
            >
              <div className="text-5xl mb-4">&#127891;</div>
              <h2 className="text-2xl font-bold text-blue-700 mb-2 group-hover:text-blue-800">
                Enter JHS Portal
              </h2>
              <p className="text-gray-500">
                BECE past questions, mock exams, and revision for Junior High School students.
              </p>
              <div className="mt-4 inline-block bg-blue-50 text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm">
                BECE Preparation
              </div>
            </Link>

            <Link
              href="/signup?level=SHS"
              className="card hover:shadow-lg hover:border-emerald-200 transition-all group p-8"
            >
              <div className="text-5xl mb-4">&#127891;</div>
              <h2 className="text-2xl font-bold text-emerald-600 mb-2 group-hover:text-emerald-700">
                Enter SHS Portal
              </h2>
              <p className="text-gray-500">
                WASSCE past questions, mock exams, and revision for Senior High School students.
              </p>
              <div className="mt-4 inline-block bg-emerald-50 text-emerald-700 font-semibold px-4 py-2 rounded-lg text-sm">
                WASSCE Preparation
              </div>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white border-t border-gray-100 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-12">Why haleel.org?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Past Questions",
                  desc: "Access thousands of BECE and WASSCE past questions organized by subject, topic, and year.",
                  icon: "&#128218;",
                },
                {
                  title: "Mock Exams",
                  desc: "Take timed mock exams that simulate the real BECE and WASSCE experience.",
                  icon: "&#9202;",
                },
                {
                  title: "Track Progress",
                  desc: "Monitor your performance, identify weak subjects, and improve your scores over time.",
                  icon: "&#128200;",
                },
              ].map((f) => (
                <div key={f.title} className="text-center">
                  <div className="text-4xl mb-3" dangerouslySetInnerHTML={{ __html: f.icon }} />
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} haleel.org. All rights reserved.</p>
      </footer>
    </div>
  );
}
