import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';
import { TRADES_LIST } from '../data/surveyQuestions.js';

const HOW = [
  { step: '1', icon: '💬', title: 'Describe your problem', body: 'Answer a few quick questions so we understand exactly what you need.' },
  { step: '2', icon: '🔍', title: 'Get matched instantly', body: 'We find verified professionals in your area who specialise in your job.' },
  { step: '3', icon: '📅', title: 'Pick a time', body: "See the provider's live calendar and choose a slot that suits you." },
  { step: '4', icon: '💰', title: 'Get a price estimate', body: 'Know the cost upfront — guaranteed within ±20% of the final bill.' },
];

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight">
            Home repairs, done right.
            <br />
            <span className="text-brand-100">Book in minutes.</span>
          </h1>
          <p className="text-base sm:text-xl text-brand-100 mb-8 sm:mb-10 max-w-2xl mx-auto">
            D-Bell connects you with trusted local professionals for any job around your home or office.
          </p>

          {user?.role === 'CUSTOMER' ? (
            <Link
              to="/book"
              className="inline-block bg-white text-brand-700 font-bold text-base sm:text-lg px-8 py-4 rounded-2xl hover:bg-brand-50 transition-colors shadow-lg"
            >
              Book a Service →
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="bg-white text-brand-700 font-bold text-base px-8 py-4 rounded-2xl hover:bg-brand-50 transition-colors shadow-lg"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white font-bold text-base px-8 py-4 rounded-2xl hover:bg-brand-800 transition-colors"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trade grid */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
          What can we help you with?
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
          {TRADES_LIST.map((t) => (
            <Link
              key={t.slug}
              to={user?.role === 'CUSTOMER' ? `/book?trade=${t.slug}` : '/register'}
              className="group flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-brand-300 hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-200">
                {t.icon}
              </span>
              <span className="font-semibold text-gray-700 group-hover:text-brand-700 text-xs sm:text-sm text-center leading-tight">
                {t.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-14">
            How D-Bell works
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {HOW.map((h) => (
              <div key={h.step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  {h.icon}
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-1">{h.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-brand-700 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { value: '15+', label: 'Expert providers' },
            { value: '10', label: 'Services offered' },
            { value: '±20%', label: 'Price guarantee' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-4xl font-extrabold">{s.value}</p>
              <p className="text-brand-200 text-xs sm:text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Provider CTA */}
      <section className="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Are you a professional?</h2>
        <p className="text-gray-500 text-sm sm:text-lg mb-6 sm:mb-8">
          Join D-Bell, set your own hours, and grow your client base.
        </p>
        <Link to="/register?role=provider" className="btn-primary text-base px-8 py-3">
          Apply as a Provider →
        </Link>
      </section>
    </div>
  );
}
