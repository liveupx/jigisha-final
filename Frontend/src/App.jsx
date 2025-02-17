import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Body from './components/Body'
import Home from './components/Home'
import AppointmentModal from './components/AppointmentModel'
import Layout from './admin-panel/Layout'
import Dashboard from './admin-panel/Dashboard'
import Appointments from './admin-panel/Appointments'
import Doctors from './admin-panel/Doctors'
import Gallery from './admin-panel/Gallery'
import Services from './admin-panel/Services'
import AboutUs from './admin-panel/AboutUs'


function App() {
  return (
    <>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/' element={<Body />} > 
            <Route path='/' element={<Home />} />
            <Route path='/appointment' element={<AppointmentModal />} />
          </Route>

          <Route path="/admin" element={<Layout title="Dashboard" />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="services" element={<Services />} />
            <Route path="about-us" element={<AboutUs />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App