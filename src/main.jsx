
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./Pages/App.jsx";
import Results from "./Pages/Results";
import Quiz from "./Pages/Quiz";
import { Toaster} from 'sonner'

import { BrowserRouter as Router, Routes, Route } from "react-router";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/myUi/ProtectedRoute";

createRoot(document.getElementById("root")).render(
    <UserProvider>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/quiz" element={<ProtectedRoute><Quiz/>  </ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results/>  </ProtectedRoute>} />
        </Routes>
      </Router>
    </UserProvider>
);