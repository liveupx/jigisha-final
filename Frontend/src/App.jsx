import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Body from './components/Body'
import Home from './components/Home'


function App() {
  return (
    <>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/' element={<Body />} > 
            <Route path='/' element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App