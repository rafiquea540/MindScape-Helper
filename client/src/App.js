import React, { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Loading from './components/Loading'
import { Admin, Protected, Public } from './middleware/route'
import DoctorDashboard from './pages/DoctorDashboard'
import Dynamo from './pages/Dynamo'
import EmergencyArsenal from './pages/EmergencyArsenal'
import EmotionContextPage from './pages/EmotionContextPage'
import ForgotPassword from './pages/ForgotPassword'
import Library from './pages/Library'
import Login from './pages/Login'
import MindScan from './pages/MindScan'
import Oasis from './pages/Oasis'
import PatientHome from './pages/PatientHome'
import Personalization from './pages/Personalization'
import PsychometricDataPage from './pages/PsychometricDataPage'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import Slots from './pages/Slots'
import SuicideRiskAnalysis from './pages/SuicideRiskAnalysis'
import UserProgressPage from './pages/UserProgressPage'
import VerifyOTP from './pages/VerifyOTP'
import './styles/app.css'

const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Appointments = lazy(() => import('./pages/Appointments'))
const Doctors = lazy(() => import('./pages/Doctors'))
const Profile = lazy(() => import('./pages/Profile'))
const Notifications = lazy(() => import('./pages/Notifications'))
const ApplyDoctor = lazy(() => import('./pages/ApplyDoctor'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Error = lazy(() => import('./pages/Error'))

function App() {
  return (
    <Router>
      <Toaster />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify' element={<VerifyOTP />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route
            path='/register'
            element={
              <Public>
                <Register />
              </Public>
            }
          />
          <Route
            path='/emergency'
            element={
              <Protected>
                <EmergencyArsenal />
              </Protected>
            }
          />
          <Route
            path='/patient-home'
            element={
              <Protected>
                <PatientHome />
              </Protected>
            }
          />
          <Route
            path='/risk-analysis'
            element={
              <Protected>
                <SuicideRiskAnalysis />
              </Protected>
            }
          />
          <Route
            path='/progress'
            element={
              <Protected>
                <UserProgressPage />
              </Protected>
            }
          />
          <Route
            path='/mind-scan'
            element={
              <Protected>
                <MindScan />
              </Protected>
            }
          />
          <Route
            path='/personalization'
            element={
              <Protected>
                <Personalization />
              </Protected>
            }
          />
          <Route
            path='/library'
            element={
              <Protected>
                <Library />
              </Protected>
            }
          />
          <Route
            path='/emotion'
            element={
              <Protected>
                <EmotionContextPage />
              </Protected>
            }
          />
          <Route
            path='/psychometric'
            element={
              <Protected>
                <PsychometricDataPage />
              </Protected>
            }
          />
          <Route
            path='/oasis'
            element={
              <Protected>
                <Oasis />
              </Protected>
            }
          />
          <Route
            path='/dynamo'
            element={
              <Protected>
                <Dynamo />
              </Protected>
            }
          />
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route
            path='/appointments'
            element={
              <Protected>
                <Appointments />
              </Protected>
            }
          />
          <Route
            path='/notifications'
            element={
              <Protected>
                <Notifications />
              </Protected>
            }
          />
          <Route
            path='/applyfordoctor'
            element={
              <Protected>
                <ApplyDoctor />
              </Protected>
            }
          />
          <Route
            path='/slots'
            element={
              <Protected>
                <Slots />
              </Protected>
            }
          />
          <Route
            path='/doctor-home'
            element={
              <Protected>
                <DoctorDashboard />
              </Protected>
            }
          />
          <Route
            path='/profile'
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
          <Route
            path='/dashboard/users'
            element={
              <Admin>
                <Dashboard type={'users'} />
              </Admin>
            }
          />
          <Route
            path='/dashboard/analytics'
            element={
              <Admin>
                <Analytics type={'users'} />
              </Admin>
            }
          />
          <Route
            path='/dashboard/doctors'
            element={
              <Admin>
                <Dashboard type={'doctors'} />
              </Admin>
            }
          />
          <Route
            path='/dashboard/appointments'
            element={
              <Protected>
                <Dashboard type={'appointments'} />
              </Protected>
            }
          />
          <Route
            path='/dashboard/applications'
            element={
              <Protected>
                <Dashboard type={'applications'} />
              </Protected>
            }
          />
          <Route path='*' element={<Error />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
