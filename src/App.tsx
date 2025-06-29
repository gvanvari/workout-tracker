import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Login from './components/Auth/Login';
import AddSet from './components/Exercise/AddSet';
import ExerciseHistory from './components/Exercise/ExerciseHistory';
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Navigation />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/add-set" element={<AddSet />} />
        <Route path="/exercise-history" element={<ExerciseHistory />} />
      </Routes>
    </Router>
  );
};

export default App;