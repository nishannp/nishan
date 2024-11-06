// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Home } from './pages/Home';
import { WriteReview } from './pages/WriteReview';
import { ReviewPage } from './pages/ReviewPage';
import { GlobalStyle } from './components/GlobalStyle';

function App() {
  return (
    <HelmetProvider>
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/writing" element={<WriteReview />} />
        <Route path="/review/:id" element={<ReviewPage />} />
      </Routes>
    </Router>
    </HelmetProvider>
  );
}

export default App;