//import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ListPage from './ListPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define the routes */}
          <Route path="/" element={<Home />} />
          <Route path="/listpage" element={<ListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


