import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import ChatPage from './components/ChatPage/ChatPage';
import './App.css'

const fileUploadCss = {
  cursor: 'pointer',
  border: 'none',
  height: '100%',
  backgroundColor: 'white',
  fontWeight: '500',
  textAlign: 'center',
  width: '60%',
};

export const fileUploadStyle = {
  '&::file-selector-button': fileUploadCss,

};


function App() {


  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route exaxt path='/chat' element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
