import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Body from './components/Body'
import LandingPage from './components/LandingPage'


function App() {
  return (
    <>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/' element={<Body />} > 
            <Route path='/' element={<LandingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App