//import React from 'react';
import AppRoutes from './routes/AppRoutes';

import { StudentProvider } from './contexts/StudentContext';
import { FacultyProvider } from './contexts/FacultyContext';
import './App.css';

function App() {
  return (
    <FacultyProvider>
      <StudentProvider>
        <div className="app">
          <AppRoutes />
        </div>
      </StudentProvider>
    </FacultyProvider>
  );
}

export default App;