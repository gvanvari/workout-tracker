import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Login from './components/Auth/Login';
import AddSet from './components/Exercise/AddSet';
import ExerciseHistory from './components/Exercise/ExerciseHistory';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="container">
        <Header />
        <Navigation />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/add-set" element={
            <ProtectedRoute>
              <AddSet />
            </ProtectedRoute>
          } />
          <Route path="/exercise-history" element={
            <ProtectedRoute>
              <ExerciseHistory />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;