import Home from './Components/Routes/home'
import About from './Components/Routes/about'
import AppSimulation from './Components/Routes/AppSimulation'
import Contact from './Components/Routes/Contact'
import FuturePredict from './Components/Routes/FuturePredict'
import SignUp from './Components/Routes/SignUp'
import Login from './Components/Routes/Login'
import PatientProfile from './Components/Routes/PatientProfile'
import LabEngProfile from './Components/Routes/LabEngProfile'
import Layout from './Components/Routes/Layout'
import ErrorBoundary from './Components/Routes/ErrorBountry'
import { Routes, Route } from 'react-router-dom'
import './index.css'
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="simulation" element={<AppSimulation />} />
        <Route path="contact" element={<Contact />} />
        <Route path="future-predict" element={<FuturePredict />} />
        <Route path="SignUp" element={<SignUp />} />
        <Route path="Login" element={<Login />} />
        <Route path="PatientProfile" element={<PatientProfile />} />
        <Route path="LabEngProfile" element={<LabEngProfile />} />
        <Route path="*" element={<ErrorBoundary />} />
      </Route>
    </Routes>
  )
}
