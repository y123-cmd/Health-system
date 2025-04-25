import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ClientDetail from './pages/ClientDetail';
import ClientForm from './pages/ClientForm';
import ProgramList from './pages/ProgramList';
import ProgramForm from './pages/ProgramForm';
import EnrollmentForm from './pages/EnrollmentForm';

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/edit/:id" element={<ClientForm />} />
          <Route path="/programs" element={<ProgramList />} />
          <Route path="/programs/new" element={<ProgramForm />} />
          <Route path="/programs/edit/:id" element={<ProgramForm />} />
          <Route path="/enrollments/new" element={<EnrollmentForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;