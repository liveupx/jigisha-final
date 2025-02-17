import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Body from './components/Body'
import Home from './components/Home'
import AppointmentModal from './components/AppointmentModel'


function App() {
  return (
    <>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/' element={<Body />} > 
            <Route path='/' element={<Home />} />
            <Route path='/appointment' element={<AppointmentModal />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App