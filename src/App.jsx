import React, { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './Context/Theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pageloder from './Components/Pageloder';

const HomeMusic = React.lazy(() => import('./pages/HomeMusic'));
const CreateMusic = React.lazy(() => import('./pages/CreateMusic'));
const LocalFeed = React.lazy(() => import('./pages/LocalFeed'));
const YourPost = React.lazy(() => import('./pages/YourPost'));
const About = React.lazy(() => import('./pages/About'));
const Album = React.lazy(() => import('./pages/Album'));


function AppContent() {


  return (

      <Suspense fallback={<Pageloder />}>

        <Router>
          <Toaster
            position="top-left"
            reverseOrder={false}
            />
          <Routes>
            <Route path='/' element={<HomeMusic />} />
            <Route path='/create-music' element={<CreateMusic />} />
            <Route path='/Local-feed' element={<LocalFeed />} />
            <Route path='/your-post' element={<YourPost />} />
            <Route path='/about' element={<About />} />
            <Route path='/album' element={<Album />} />
          </Routes>
        </Router>
      </Suspense>
           
  );
}
function App(){
  return(
    <ThemeProvider>
      <AppContent/>
    </ThemeProvider>
  )
}
export default App