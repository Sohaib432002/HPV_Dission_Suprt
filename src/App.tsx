import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './Components/Routes/Layout'
import Home from './Components/Routes/home'
import NotFound from './Components/Routes/ErrorBountry'
import './index.css'

// Heavy / authenticated pages load on demand (charts, PDF tooling, ML flow).
// Layout wraps the <Outlet /> in <Suspense>, so the navbar stays put while they load.
const About = lazy(() => import('./Components/Routes/about'))
const Contact = lazy(() => import('./Components/Routes/Contact'))
const AppSimulation = lazy(() => import('./Components/Routes/AppSimulation'))
const FuturePredict = lazy(() => import('./Components/Routes/FuturePredict'))
const SampleImages = lazy(() => import('./Components/Routes/SampleImages'))
const SignUp = lazy(() => import('./Components/Routes/SignUp'))
const Login = lazy(() => import('./Components/Routes/Login'))
const PatientProfile = lazy(() => import('./Components/Routes/PatientProfile'))
const LabEngProfile = lazy(() => import('./Components/Routes/LabEngProfile'))

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="simulation" element={<AppSimulation />} />
        <Route path="contact" element={<Contact />} />
        <Route path="future-predict" element={<FuturePredict />} />
        <Route path="sample-images" element={<SampleImages />} />
        <Route path="SignUp" element={<SignUp />} />
        <Route path="Login" element={<Login />} />
        <Route path="PatientProfile" element={<PatientProfile />} />
        <Route path="LabEngProfile" element={<LabEngProfile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
