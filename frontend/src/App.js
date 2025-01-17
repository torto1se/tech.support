import { Route, Routes } from "react-router-dom";
import RegistrationPage from "./components/RegistrationPage";
import LoginPage from "./components/LoginPage";
import TaskPage from "./components/TaskPage";
import TaskHistory from "./components/TaskHistory";


function App() {
  return (
  <>
    <Routes>
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/task" element={<TaskPage />} />
      <Route path="/task-history" element={<TaskHistory />} />
    </Routes>
  </>
  )
}

export default App;
