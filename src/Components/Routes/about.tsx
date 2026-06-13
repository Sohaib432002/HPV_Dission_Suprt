/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'

import { useTheme } from '../ThemeContext'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const { theme } = useTheme()
  const [isAuth, setIsAuth] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('access')
    setIsAuth(!!token)
  }, [])

  const handleSimulationClick = () => {
    if (!isAuth) navigate('/Login')
    else navigate('/simulation')
  }

  return (
    <div
      className={` ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900'
          : 'bg-gray-50'
      }   text-white min-h-screen`}
    >
      {/* HERO SECTION */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        {/* 🔥 Animated Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-3xl animate-pulse"></div>

          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
            className="w-full h-full object-cover opacity-20"
          />

          {/* Overlay */}
          <div
            className={`absolute  inset-0 ${theme === 'dark' ? 'bg-black/70  backdrop-blur-sm' : 'bg-black/10'} backdrop-blur-sm`}
          ></div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* TITLE */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">
              Human Papillomavirus
            </span>
            <br />
            <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-500'}`}>
              Research & Simulation Platform
            </span>
          </h1>

          {/* SUBTITLE */}
          <p
            className={`text-lg md:text-xl leading-relaxed mb-6 ${
              theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
            }`}
          >
            A next-generation digital research environment that integrates
            <span className="text-cyan-400 font-semibold"> AI-powered image analysis</span>,
            <span className="text-blue-400 font-semibold"> mathematical modeling</span>, and
            <span className="text-purple-400 font-semibold"> epidemiological simulation</span>
            to understand, predict, and control HPV infection dynamics.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-col md:flex-row gap-6 justify-center">
            {/* PRIMARY BUTTON */}
            <button
              onClick={handleSimulationClick}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white rounded font-semibold shadow-xl
           hover:scale-102 curser-pointer transition-transform duration-100"
            >
              Open Simulation Lab
            </button>

            {/* SECONDARY BUTTON */}
          </div>

          {/* FEATURES ROW */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              {
                title: 'AI Image Analysis',
                desc: 'Deep learning models classify cervical cells for infection detection.',
                icon: '🧠',
              },
              {
                title: 'Mathematical Modeling',
                desc: 'Differential equations simulate HPV infection dynamics.',
                icon: '📊',
              },
              {
                title: 'Predictive Simulation',
                desc: 'Forecast infection trends and evaluate interventions.',
                icon: '📈',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-6 rounded backdrop-blur-md transition duration-300 hover:scale-102 ${
                  theme === 'dark'
                    ? 'bg-slate-900/70 border border-slate-700 hover:border-cyan-400'
                    : 'bg-white shadow-lg border border-gray-200 hover:border-blue-400'
                }`}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-cyan-400">{item.title}</h3>
                <p className={theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HPV OVERVIEW */}
      <section
        className={`max-w-7xl  ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'} ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900'
            : 'bg-gray-50'
        } py-28 px-6 mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center relative`}
      >
        {/* BACKGROUND EFFECT */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 opacity-20 blur-3xl animate-pulse"></div>
          <img
            src="https://images.unsplash.com/photo-1581093588401-22b62d8c7c64"
            className="w-full h-full object-cover opacity-10"
            alt="HPV microscopic visualization"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* IMAGE */}
        <div className="relative">
          <img
            src="https://www.pharmacyplanet.com/media/wysiwyg/What_is_HPV.jpg"
            className="rounded shadow-2xl hover:scale-105 transition-transform duration-500"
            alt="HPV illustration"
          />
        </div>

        {/* CONTENT */}
        <div className="relative space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">
            What is Human Papillomavirus (HPV)?
          </h2>

          <p
            className={` ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'} text-lg md:text-xl leading-relaxed`}
          >
            Human Papillomavirus (HPV) is one of the most common viral infections affecting humans.
            It spreads primarily through skin-to-skin contact, especially during sexual activity.
          </p>

          <p
            className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}  text-lg md:text-xl leading-relaxed`}
          >
            There are over 200 types of HPV. Most infections are harmless and resolve naturally, but
            certain high-risk strains can cause cervical cancer and other cancers if persistent.
          </p>

          <p
            className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}  text-lg md:text-xl leading-relaxed`}
          >
            Persistent infection with high-risk HPV strains accounts for nearly all cervical cancer
            cases worldwide, making early detection and vaccination critical for public health.
          </p>

          {/* EXPANDED CONTENT / FUNCTIONALITY */}

          {/* TAGS */}
          <div className="pt-4">
            <span
              className={`px-5  py-2 text-sm rounded-full font-medium tracking-wide border bg-cyan-500/20 border-cyan-500 ${theme === 'dark' ? 'text-cyan-30' : 'text-cyan-900'}`}
            >
              AI Analysis • Epidemiology • Simulation • Vaccination • Research
            </span>
          </div>
        </div>
      </section>
      {/* TRANSMISSION */}
      <section className={`py-24 px-6 bg-[#0f172a]  transition-colors duration-500`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-16 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">
            How HPV Spreads
          </h2>

          <p
            className={`max-w-3xl mx-auto mb-12 text-lg md:text-xl leading-relaxed  text-slate-300`}
          >
            Understanding the modes of HPV transmission is essential for prevention and early
            detection. HPV can spread through various forms of contact, and persistent infections
            may lead to serious health complications.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {/* CARD 1 */}
            <div
              className={`relative bg-gradient-to-tr from-cyan-900/50 via-blue-900/50 to-purple-900/50 p-8 rounded shadow-xl backdrop-blur-sm border border-cyan-500/20 hover:scale-102 transition-transform duration-200`}
            >
              <h3 className="text-cyan-400 text-2xl font-semibold mb-4">Sexual Contact</h3>
              <p className={`text-lg text-slate-300 leading-relaxed`}>
                HPV is most commonly transmitted through vaginal, anal, or oral sexual contact.
                Using protection and regular screenings significantly reduce the risk of infection.
              </p>
            </div>

            {/* CARD 2 */}
            <div
              className={`relative bg-gradient-to-tr from-cyan-900/50 via-blue-900/50 to-purple-900/50 p-8 rounded shadow-xl backdrop-blur-sm border border-cyan-500/20 hover:scale-102 transition-transform duration-200`}
            >
              <h3 className="text-cyan-400 text-2xl font-semibold mb-4">Skin-to-Skin Contact</h3>
              <p className={`text-lg text-slate-300 leading-relaxed`}>
                Direct contact with infected skin or mucosal surfaces, even without sexual activity,
                can transmit HPV. Maintaining awareness and hygiene can help reduce exposure.
              </p>
            </div>

            {/* CARD 3 */}
            <div
              className={`relative bg-gradient-to-tr from-cyan-900/50 via-blue-900/50 to-purple-900/50 p-8 rounded shadow-xl backdrop-blur-sm border border-cyan-500/20 hover:scale-102 transition-transform duration-200`}
            >
              <h3 className="text-cyan-400 text-2xl font-semibold mb-4">Persistent Infection</h3>
              <p className={`text-lg text-slate-300 leading-relaxed`}>
                If the immune system cannot clear HPV, the infection may persist and increase the
                risk of cervical and other HPV-related cancers. Vaccination and early detection are
                crucial preventive measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MATHEMATICAL MODEL */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center transition-all duration-500">
        {/* IMAGE */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1579154204601-01588f351e67"
            className="rounded shadow-2xl hover:scale-105 transition-transform duration-500"
            alt="HPV Mathematical Visualization"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-blue-900/20 to-purple-900/20 rounded pointer-events-none"></div>
        </div>

        {/* CONTENT */}
        <div className="relative space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">
            Mathematical Modeling
          </h2>

          <p
            className={`text-lg md:text-xl  ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} leading-relaxed text-slate-300`}
          >
            Mathematical modeling provides a structured way to understand how HPV spreads and
            progresses within a population. By breaking down the population into compartments
            representing different infection stages, we can simulate disease dynamics, predict
            outcomes, and evaluate prevention strategies such as vaccination or screening programs.
          </p>

          <div className="bg-slate-900 p-8 rounded shadow-xl backdrop-blur-sm border border-cyan-500/20 space-y-4 font-mono text-cyan-300 text-sm md:text-base">
            <p>
              <span className="font-semibold text-cyan-400">
                dS<sub>1</sub>/dt
              </span>{' '}
              = A − (δ + μ) S<sub>1</sub> &nbsp;&nbsp;{' '}
              <span className="text-slate-400">// Newly susceptible population</span>
            </p>
            <p>
              <span className="font-semibold text-cyan-400">
                dS<sub>2</sub>/dt
              </span>{' '}
              = δ S<sub>1</sub> − (μ + m) S<sub>2</sub> − (1−m) β S<sub>2</sub> I &nbsp;&nbsp;{' '}
              <span className="text-slate-400">// Susceptible at risk</span>
            </p>
            <p>
              <span className="font-semibold text-cyan-400">dI/dt</span> = (1−m) β S<sub>2</sub> I −
              (μ + 1) I &nbsp;&nbsp; <span className="text-slate-400">// Infected population</span>
            </p>
            <p>
              <span className="font-semibold text-cyan-400">dR/dt</span> = m S<sub>2</sub> + n I − μ
              R &nbsp;&nbsp; <span className="text-slate-400">// Recovered population</span>
            </p>
            <p>
              <span className="font-semibold text-cyan-400">dC/dt</span> = (1−n) I − μ C
              &nbsp;&nbsp; <span className="text-slate-400">// Cancerous population</span>
            </p>
          </div>

          <p
            className={`text-lg md:text-xl  ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} leading-relaxed text-slate-300`}
          >
            Here, <span className="font-semibold text-cyan-400">S</span> represents susceptible
            cells,
            <span className="font-semibold text-cyan-400"> I</span> represents infected cells, and
            <span className="font-semibold text-cyan-400"> C</span> represents cancerous cells. The
            equations show how each compartment evolves over time based on infection rates,
            recovery, and progression to cancer.
          </p>

          <p
            className={`text-lg md:text-xl  ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} leading-relaxed text-slate-300`}
          >
            Using these models, researchers can simulate different scenarios, assess public health
            interventions, and improve our understanding of HPV transmission dynamics.
          </p>
        </div>
      </section>

      {/* AI IMAGE ANALYSIS */}
      <section className="py-24 px-6 transition-colors duration-500 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* CONTENT */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">
              AI Image Analysis
            </h2>

            <p className="text-lg md:text-xl leading-relaxed text-slate-300">
              Artificial intelligence (AI) techniques are leveraged to analyze cervical microscopy
              images, enabling rapid and highly accurate detection of infected cells. This
              automation accelerates diagnostic workflows, reduces human error, and ensures
              consistent results across large-scale screenings.
            </p>

            <p className="text-lg md:text-xl leading-relaxed text-slate-300">
              Advanced deep learning models classify cells into infected and normal categories,
              generating rich datasets for epidemiological modeling, predictive simulations, and
              public health decision-making. The AI-driven insights provide actionable guidance for
              prioritizing vaccination programs and targeted intervention strategies.
            </p>

            <p className="text-lg md:text-xl leading-relaxed text-slate-300">
              By combining AI with statistical modeling, healthcare professionals can better
              understand HPV transmission dynamics, monitor outbreaks in real-time, and evaluate the
              effectiveness of preventive measures such as screening and immunization campaigns.
            </p>

            {/* TAGS */}
            <div className="pt-4">
              <span className="inline-block px-6 py-2 text-sm rounded-full font-medium tracking-wide border border-cyan-500 bg-cyan-500/20 text-cyan-300 backdrop-blur-sm shadow-sm">
                AI • Deep Learning • Image Processing • Epidemiology • Simulation
              </span>
            </div>
          </div>

          {/* IMAGE */}
          <div className="relative group overflow-hidden rounded">
            <img
              src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b"
              className="rounded shadow-2xl transition-transform duration-500 group-hover:scale-105"
              alt="Cervical microscopy AI analysis"
            />
            <div className="absolute inset-0 rounded bg-gradient-to-tr from-cyan-900/20 via-blue-900/20 to-purple-900/20 pointer-events-none transition-opacity duration-500 group-hover:opacity-80"></div>
            <div className="absolute inset-0 rounded border border-cyan-500/20 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* PREVENTION */}
      <section className="py-24 px-6 transition-colors duration-500 ">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">
            Global Impact of Cervical Cancer
          </h2>

          <p
            className={`text-lg md:text-xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-900'}  max-w-3xl mx-auto leading-relaxed`}
          >
            Cervical cancer remains a major global health challenge, largely caused by persistent
            HPV infection. Understanding its prevalence, mortality, and public health implications
            helps guide vaccination, screening, and intervention strategies.
          </p>

          {/* STATS CARDS */}
          <div className="grid md:grid-cols-3 gap-10">
            {/* CARD 1 */}
            <div className="relative bg-slate-900 p-10 rounded shadow-xl backdrop-blur-sm border border-cyan-500/20 hover:scale-105 transition-transform duration-500">
              <h3 className="text-5xl md:text-6xl font-extrabold text-cyan-400 mb-4">600K+</h3>
              <p className="text-lg md:text-xl text-slate-300">
                New cervical cancer cases worldwide each year, highlighting the urgent need for
                preventive strategies and early detection.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="relative bg-slate-900 p-10 rounded shadow-xl backdrop-blur-sm border border-cyan-500/20 hover:scale-105 transition-transform duration-500">
              <h3 className="text-5xl md:text-6xl font-extrabold text-cyan-400 mb-4">99%</h3>
              <p className="text-lg md:text-xl text-slate-300">
                Of cervical cancer cases are caused by HPV infection, emphasizing the critical role
                of vaccination programs in prevention.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="relative bg-slate-900 p-10 rounded shadow-xl backdrop-blur-sm border border-cyan-500/20 hover:scale-105 transition-transform duration-500">
              <h3 className="text-5xl md:text-6xl font-extrabold text-cyan-400 mb-4">300K+</h3>
              <p className="text-lg md:text-xl text-slate-300">
                Deaths occur annually due to cervical cancer, reflecting the need for improved
                access to screening and treatment globally.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#0f172a] py-24 px-6 transition-colors duration-500 text-center">
        {/* HEADING */}
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text mb-12">
          Prevention & Control
        </h2>

        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          Preventing HPV infection and cervical cancer requires a combination of vaccination,
          regular screening, and early treatment. These interventions are proven to significantly
          reduce infection rates and improve public health outcomes worldwide.
        </p>

        {/* PREVENTION CARDS */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {/* CARD 1 */}
          <div className="relative bg-slate-900 p-8 rounded shadow-xl backdrop-blur-sm border border-cyan-500/20 hover:scale-105 transition-transform duration-500">
            <h3 className="text-cyan-400 text-2xl font-semibold mb-4">HPV Vaccination</h3>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Vaccination is one of the most effective methods to prevent HPV infection and cervical
              cancer, offering long-term protection and reducing the prevalence of high-risk HPV
              strains.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="relative bg-slate-900 p-8 rounded shadow-xl backdrop-blur-sm border border-cyan-500/20 hover:scale-105 transition-transform duration-500">
            <h3 className="text-cyan-400 text-2xl font-semibold mb-4">Screening</h3>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Regular cervical screening helps detect early cellular abnormalities before they
              develop into cancer, enabling timely intervention and improved survival rates.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="relative bg-slate-900 p-8 rounded shadow-xl backdrop-blur-sm border border-cyan-500/20 hover:scale-105 transition-transform duration-500">
            <h3 className="text-cyan-400 text-2xl font-semibold mb-4">Early Treatment</h3>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Early diagnosis and treatment significantly reduce mortality caused by cervical
              cancer, ensuring better outcomes and higher quality of life for patients.
            </p>
          </div>
        </div>
      </section>
      {/* MISSION */}
      <section className="py-24 px-6 transition-colors duration-500 text-center ">
        {/* HEADING */}
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text mb-8">
          Our Mission
        </h2>

        {/* DESCRIPTION */}
        <p
          className={`text-lg md:text-xl ${theme == 'dark' ? 'text-slate-300' : 'text-slate-900'}   max-w-4xl mx-auto leading-relaxed`}
        >
          Our mission is to integrate advanced mathematical modeling, artificial intelligence, and
          simulation techniques to gain deeper insights into HPV infection dynamics. By leveraging
          these innovative technologies, we aim to support global public health initiatives,
          optimize vaccination and screening strategies, and ultimately reduce the burden of
          cervical cancer worldwide.
        </p>

        {/* SUBTEXT / TAGLINE */}
        <p className="text-cyan-400 text-lg md:text-xl mt-6 font-semibold">
          Science. Prevention. Impact.
        </p>
      </section>
    </div>
  )
}

export default About
