import { useTheme } from '../ThemeContext'
const Contact = () => {
  const { theme } = useTheme()

  return (
    <div
      className={` text-white ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900'
          : 'bg-gray-200'
      } min-h-screen overflow-hidden transition-colors duration-500`}
    >
      {/* HERO SECTION */}
      <section className="relative py-20 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 via-blue-900/20 to-purple-900/30 blur-3xl"></div>

        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 relative">
          Contact Our{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
            HPV Research Lab
          </span>
        </h1>

        <p
          className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} max-w-3xl mx-auto text-lg md:text-xl leading-relaxed relative`}
        >
          Our research platform focuses on studying the transmission, progression, and prevention of
          Human Papillomavirus (HPV) and cervical cancer using mathematical models and computational
          simulation tools.
        </p>
      </section>

      {/* CONTACT GRID */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-10">
        {[
          {
            title: 'Research Collaboration',
            text: 'We collaborate with universities, medical researchers, epidemiologists, and healthcare professionals to study HPV transmission dynamics and cervical cancer prevention strategies.',
          },
          {
            title: 'Scientific Support',
            text: 'Our team provides technical support related to mathematical modeling, disease simulation, and computational analysis of epidemiological data.',
          },
          {
            title: 'Data & Prediction',
            text: 'Our prediction system analyzes real-time data to forecast HPV infection patterns and potential cervical cancer cases using computational modeling.',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={` ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-slate-900'} backdrop-blur-xl p-8 rounded border border-slate-700 transition-transform duration-500`}
          >
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">{item.title}</h3>
            <p className="text-slate-300 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </section>

      {/* CONTACT FORM + INFO */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-16">
        {/* FORM */}
        <div
          className={` ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-slate-900'} backdrop-blur-xl p-10 rounded border border-slate-700 shadow-2xl transition-transform duration-500`}
        >
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">Send us a Message</h2>
          <form className="space-y-6">
            {['Full Name', 'Email Address', 'Institution / Organization'].map(
              (placeholder, idx) => (
                <input
                  key={idx}
                  type={placeholder.includes('Email') ? 'email' : 'text'}
                  placeholder={placeholder}
                  className="w-full p-4 rounded bg-slate-800 border border-slate-700 focus:border-cyan-400 outline-none transition"
                />
              )
            )}
            <textarea
              rows={5}
              placeholder="Your Message..."
              className="w-full p-4 rounded bg-slate-800 border border-slate-700 focus:border-cyan-400 outline-none transition"
            ></textarea>
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded font-semibold transition-transform duration-300">
              Submit Inquiry
            </button>
          </form>
        </div>

        {/* CONTACT DETAILS */}
        <div className="space-y-3">
          {[
            { title: 'Email Address', value: 'research@hpv-lab.org' },
            { title: 'Phone', value: '+92 300 1234567' },
            {
              title: 'Research Location',
              value: 'Department of Biomedical Research\nHealth Science Institute\nPakistan',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={` ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-slate-900'} backdrop-blur-xl p-8 rounded border border-slate-700 transition-transform duration-500`}
            >
              <h3 className="text-2xl font-semibold text-cyan-400 mb-3">{item.title}</h3>
              <p className="text-slate-300 whitespace-pre-line">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="bg-[#0f172a] py-24 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
          Join Our Research Mission
        </h2>

        <p className="text-slate-300 max-w-4xl mx-auto text-lg md:text-xl leading-relaxed">
          Our mission is to advance scientific understanding of Human Papillomavirus infection and
          cervical cancer development through mathematical modeling, computational simulation, and
          predictive analytics. We welcome collaboration from global researchers and healthcare
          professionals.
        </p>
      </section>
    </div>
  )
}

export default Contact
