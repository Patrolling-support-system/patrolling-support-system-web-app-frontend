import React, { useState } from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Login} from './Login'
import { Home } from './Home';
import {CreateTask} from './CreateTask'
import { ViewTask } from './viewTasks';
import { AccountSettings } from './AccountSettings';
import {ResetPasswordForm} from './Forms/ResetPasswordForm'
import {ChangePasswordForm} from './Forms/ChangePasswordForm'
import { TaskDetails } from './TaskDetails';

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route exact path="/home" element={<Home/>} />
        <Route exact path="/createTask" element={<CreateTask/>} />
        <Route exact path="/viewTasks" element={<ViewTask/>} />
        <Route path="/viewTasks/:taskId" element={<TaskDetails/>} />
        <Route exact path="/AccountSettings" element={<AccountSettings/>} />
        <Route exact path="/ResetPassword" element={<ResetPasswordForm/>} />
        <Route exact path="/changePassword" element={<ChangePasswordForm/>} />
      </Routes>
    </Router>
  );

  // return (
  //   <div className="App">
  //     <Login></Login>
  //   </div>
  // );
}

export default App;
