import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ResultPage } from './pages/ResultPage';
import { NotFoundPage } from './pages/NotFoundPage';
import Preloader from './components/Preloader';
import { PageTransition } from './components/PageTransition';

function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
}

export default App;