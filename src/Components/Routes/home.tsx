/* eslint-disable react-hooks/rules-of-hooks */
import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../ThemeContext'
import HPVModelDiagram from './HPV-model'

const home = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access')
    setIsAuth(!!token)
  }, [])

  const handleSimulationClick = () => {
    if (!isAuth) navigate('/Login')
    else navigate('/simulation')
  }

  const handlePredictionClick = () => {
    if (!isAuth) navigate('/Login')
    else navigate('/future-predict')
  }
  return (
    <div
      className={`relative overflow-hidden transition-colors duration-500
    ${theme === 'dark' ? 'bg-[#0c0f1a] text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-white text-gray-900'}`}
    >
      {/* Animated Background Circles */}
      <div className="absolute top-0 -left-16 w-96 h-96 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 opacity-20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 opacity-20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <section
        className={`relative max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-20 items-center overflow-hidden transition-colors duration-500
    ${theme === 'dark' ? 'bg-[#0c0f1a] text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-white text-gray-900'}`}
      >
        {/* Background Gradient Circles */}
        <div className="absolute top-0 -left-16 w-96 h-96 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 opacity-20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 opacity-20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        {/* Left Text Content */}
        <div className="space-y-6 relative z-10">
          <p className="text-cyan-400 mb-4 tracking-widest uppercase font-semibold">
            Biomedical Research Platform
          </p>

          <h1 className="text-6xl font-extrabold leading-tight tracking-tight relative">
            Modeling the{' '}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-text-gradient">
              Dynamics of HPV
            </span>
          </h1>

          <p
            className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-black'} leading-relaxed max-w-lg`}
          >
            Human Papillomavirus (HPV) is one of the most common viral infections associated with
            cervical cancer. This platform provides a computational environment where mathematical
            modeling, AI, and epidemiological simulations work together to explore infection
            dynamics and predict disease progression.
          </p>

          <div className="flex flex-wrap gap-6">
            <button
              onClick={handleSimulationClick}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white rounded font-semibold shadow-xl
          hover:scale-103  transition-transform duration-300"
            >
              Open Simulation Lab
            </button>

            <button
              onClick={handlePredictionClick}
              className="px-8 py-4 border border-cyan-400 text-cyan-400 rounded font-semibold
          hover:bg-cyan-500 hover:text-white hover:shadow-lg transition-all duration-300"
            >
              Run Prediction Model
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center relative z-10">
          <img
            src="./hpv-pic.jpg"
            alt="HPV virus"
            className="rounded shadow-2xl w-full max-w-md hover:scale-105 hover:shadow-[0_15px_30px_rgba(99,102,241,0.5)] transition-transform duration-500"
          />
        </div>
      </section>
      {/* Tailwind Animations */}
      {/* RESEARCH PURPOSE */}
      <section
        className={`relative py-32 px-6 overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900'
            : 'bg-gray-50'
        }`}
      >
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://cdn.pixabay.com/photo/2024/01/29/22/47/ai-generated-8540915_960_720.jpg"
            alt="HPV Cervical Cancer Research"
            className="w-full h-full object-cover opacity-30"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10">
          {/* TITLE */}
          <div className="max-w-6xl mx-auto text-center mb-20">
            <h2
              className={`text-4xl md:text-5xl font-extrabold mb-6 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-blue-200'
              }`}
            >
              Why Study HPV Through Simulation?
            </h2>

            <p
              className={`text-lg md:text-xl leading-relaxed max-w-4xl mx-auto ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-200'
              }`}
            >
              Human Papillomavirus (HPV) infection is highly prevalent and can lead to serious
              health issues, including cervical cancer. Studying HPV in real populations is
              challenging due to ethical, logistical, and temporal constraints. Computational
              simulations provide a controlled digital environment to model virus dynamics, evaluate
              interventions, and predict outcomes safely and efficiently.
            </p>
          </div>

          {/* FEATURES */}
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
            {[
              {
                icon: '🧬',
                title: 'Biological System Modeling',
                desc: 'Simulate interactions between healthy cells, infected cells, and immune responses to understand viral behavior and disease progression.',
                benefit:
                  'Explore mechanisms • Predict viral behavior • Identify intervention points',
              },
              {
                icon: '📊',
                title: 'Disease Spread Simulation',
                desc: 'Model population-level transmission considering vaccination, behavior, and screening to predict infection trends.',
                benefit: 'Assess risk • Optimize prevention • Forecast outbreaks',
              },
              {
                icon: '🧪',
                title: 'Testing Intervention Strategies',
                desc: 'Evaluate vaccination programs, screening policies, and treatments before real-world implementation.',
                benefit: 'Reduce infection • Improve policy • Save resources',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`p-10 rounded border backdrop-blur-md shadow-lg text-center transition-transform duration-300 hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-slate-900/70 border-slate-700 hover:border-cyan-400 text-slate-300'
                    : 'bg-white/80 border-gray-300 hover:border-blue-400 text-gray-900'
                }`}
              >
                <div className="text-6xl mb-5">{card.icon}</div>

                <h3
                  className={`text-2xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
                  }`}
                >
                  {card.title}
                </h3>

                <p className="leading-relaxed text-sm md:text-base mb-4">{card.desc}</p>

                <p className="text-sm opacity-80">
                  <span className="font-semibold">Benefits:</span> {card.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* MATHEMATICAL MODEL */}
      <section className={`max-w-9xl mx-auto   items-center`}>
        <HPVModelDiagram theme={theme} />
      </section>
      {/* AI IMAGE ANALYSIS */}

      <section
        className={`relative py-32 px-6 overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#0f172a] via-blue-900 to-indigo-900'
            : 'bg-gray-50'
        }`}
      >
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
            alt="HPV Research Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          {/* TEXT SIDE */}
          <div className="space-y-8">
            <h2
              className={`text-4xl md:text-5xl font-extrabold leading-tight ${
                theme === 'dark' ? 'text-cyan-400' : 'text-blue-200'
              }`}
            >
              AI-Driven Cellular Image Analysis
            </h2>

            <p
              className={`leading-relaxed text-lg md:text-xl ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-200'
              }`}
            >
              Advanced artificial intelligence models are leveraged to interpret complex cervical
              microscopy data with high precision. The platform processes biomedical images to
              identify subtle cellular patterns linked to HPV infection.
            </p>

            <p
              className={`leading-relaxed text-lg md:text-xl ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-200'
              }`}
            >
              Using deep learning classification, cells are automatically categorized into
              <span className="text-cyan-400 font-semibold"> healthy </span> and
              <span className="text-cyan-400 font-semibold"> infected </span> groups, enabling
              accurate quantification of infection severity.
            </p>

            <p
              className={`leading-relaxed text-lg md:text-xl ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-200'
              }`}
            >
              These extracted insights feed directly into simulation models, allowing biologically
              realistic predictions of HPV progression and supporting data-driven medical research.
            </p>

            {/* TAG */}
            <div>
              <span
                className={`inline-block px-6 py-2 text-sm rounded-full font-medium border ${
                  theme === 'dark'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-blue-100 border-blue-400 text-blue-700'
                }`}
              >
                Deep Learning • Biomedical Imaging • Predictive Analytics
              </span>
            </div>
          </div>

          {/* IMAGE GRID */}
          <div className="grid grid-cols-2 gap-6">
            {[
              'https://my.clevelandclinic.org/-/scassets/images/org/health/articles/11901-hpv-human-papilloma-virus',
              'https://lygosclinic.com/wp-content/uploads/2025/10/Psoriasis-2025-10-01T140734.866_result.webp',
              'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b',
              'https://louisiana-dermatology.com/wp-content/uploads/2022/11/AdobeStock_217042214-scaled.jpeg',
            ].map((src, idx) => (
              <div
                key={idx}
                className={`group p-2 rounded border shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                  theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-700 hover:border-cyan-400'
                    : 'bg-white border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={src}
                    alt={`Analysis ${idx + 1}`}
                    className="w-full h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* RESEARCH WORKFLOW */}
      <section className={`${theme === 'dark' ? '' : 'bg-gray-50'} max-w-7xl mx-auto py-32 px-6`}>
        {/* TITLE */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <h2
            className={`text-4xl md:text-5xl font-extrabold mb-6 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-800'}`}
          >
            Research Workflow
          </h2>
          <p
            className={`text-lg md:text-xl leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-gray-800'}`}
          >
            This platform integrates artificial intelligence, biomedical imaging, and mathematical
            modeling to analyze HPV infection dynamics. The workflow connects image analysis with
            epidemiological modeling to produce accurate simulations, predict disease spread, and
            support public health interventions.
          </p>
        </div>

        {/* WORKFLOW GRID */}
        <div className="grid md:grid-cols-2 gap-10 relative">
          {[
            {
              number: '01',
              icon: '📤',
              title: 'Image Upload',
              desc: `Cervical microscopy images are uploaded into the platform. Images are preprocessed to normalize brightness, remove noise, and standardize resolution for AI processing. High-quality images ensure accurate cellular analysis.`,
            },
            {
              number: '02',
              icon: '🧠',
              title: 'Cell Classification',
              desc: `Deep learning models, like CNNs, analyze each cell and classify it as healthy, infected, or abnormal. Feature extraction identifies cellular morphology, staining patterns, and HPV-specific markers.`,
            },
            {
              number: '03',
              icon: '📊',
              title: 'Parameter Estimation',
              desc: `From classified cells, the system calculates infection metrics like proportion of infected cells, viral load, and abnormal cell rate. These metrics are translated into epidemiological parameters such as transmission probability (β), recovery rate (η), and progression rate to precancerous/cancerous stages (C).`,
            },
            {
              number: '04',
              icon: '📈',
              title: 'Simulation & Prediction',
              desc: `Estimated parameters are integrated into a mathematical model to simulate HPV dynamics. Researchers can test interventions like vaccination campaigns or screening schedules and predict long-term disease trends safely in silico.`,
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className={`relative p-8 rounded border shadow-lg transition-transform duration-300 hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-slate-300 hover:border-cyan-400'
                  : 'bg-gradient-to-br from-white to-gray-100 border-gray-300 text-gray-900 hover:border-blue-400'
              }`}
            >
              {/* Step number badge */}
              <div
                className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md ${
                  theme === 'dark' ? 'bg-cyan-400 text-slate-900' : 'bg-blue-600 text-white'
                }`}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-4">{step.icon}</div>

              {/* Title */}
              <h3
                className={`text-xl md:text-2xl font-semibold mb-3 ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-blue-700'
                }`}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-line">
                {step.desc}
              </p>

              {/* Optional connecting line/arrows for visual workflow */}
            </div>
          ))}
        </div>
      </section>
      {/* PLATFORM FEATURES */}
      <section
        className={`${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'} ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900'
            : 'bg-gray-50'
        } py-28 px-6`}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-4xl md:text-5xl font-extrabold text-center mb-16 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-blue-800'
            }`}
          >
            Platform Capabilities
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: '📈',
                title: 'Interactive Graphs',
                desc: 'Visualize infection dynamics through real-time simulation graphs that show how cell populations evolve over time.',
              },
              {
                icon: '⚙️',
                title: 'Parameter Control',
                desc: 'Users can adjust epidemiological parameters to explore different infection scenarios.',
              },
              {
                icon: '🔮',
                title: 'Future Prediction',
                desc: 'The prediction module forecasts future HPV infection trends based on model inputs and simulation outputs.',
              },
            ].map((cap, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded border shadow-lg transition-transform duration-300 hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-slate-300 hover:border-cyan-400'
                    : 'bg-white border-gray-300 text-gray-900 hover:border-blue-400'
                }`}
              >
                <div className="text-5xl mb-4">{cap.icon}</div>
                <h3
                  className={`text-xl md:text-2xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-blue-700'
                  }`}
                >
                  {cap.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* PUBLIC HEALTH */}
      <section
        className={`relative py-32 px-6 overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#0f172a] via-blue-900 to-indigo-900'
            : 'bg-gray-50'
        }`}
      >
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1579154204601-01588f351e67"
            alt="HPV Public Health"
            className="w-full h-full object-cover opacity-25"
          />
          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="space-y-6">
            <h2
              className={`text-4xl md:text-5xl font-extrabold mb-6 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-blue-200'
              }`}
            >
              HPV and Public Health
            </h2>

            <p
              className={`text-lg md:text-xl leading-relaxed ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-200'
              }`}
            >
              Persistent infection with high-risk HPV types is the leading cause of cervical cancer.
              Early detection, vaccination, and screening programs play a crucial role in reducing
              mortality rates.
            </p>

            <p
              className={`text-lg md:text-xl leading-relaxed ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-200'
              }`}
            >
              Computational models allow researchers to evaluate intervention strategies, simulate
              potential outcomes, and understand the long-term impact of public health policies.
            </p>

            <p
              className={`text-lg md:text-xl leading-relaxed ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-200'
              }`}
            >
              This platform acts as a digital laboratory, enabling data-driven simulation
              experiments to explore HPV control strategies safely and effectively.
            </p>

            {/* TAG */}
            <div className="pt-4">
              <span
                className={`inline-block px-5 py-2 text-sm rounded-full font-medium border ${
                  theme === 'dark'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-white/70 border-blue-400 text-blue-800'
                }`}
              >
                Vaccination • Screening • Simulation
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* FINAL CTA */}
      <section
        className={`py-32 px-6 text-center ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900'
            : 'bg-gray-50'
        } ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'}`}
      >
        {/* TITLE */}
        <h2
          className={`text-5xl md:text-6xl font-extrabold mb-8 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-blue-800'
          }`}
        >
          Explore the HPV Simulation Environment
        </h2>

        {/* DESCRIPTION */}
        <p
          className={`text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed ${
            theme === 'dark' ? 'text-slate-300' : 'text-gray-800'
          }`}
        >
          Experiment with epidemiological parameters, visualize infection dynamics, and analyze
          future HPV trends through interactive computational simulations. Gain insights into
          infection progression and evaluate intervention strategies in a controlled digital
          environment.
        </p>

        {/* CTA BUTTON */}
        <button
          onClick={handleSimulationClick}
          className={`inline-block px-12 py-5 rounded font-semibold text-white shadow-lg transition transform hover:scale-105 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400'
          }`}
        >
          Launch Simulation
        </button>
      </section>
    </div>
  )
}

export default home
