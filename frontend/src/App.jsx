import { Route, Routes } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Home from "./components/Home";
import CreatePage from "./components/Createpage";
import EditPage from "./components/EditPage";
import Bugdetails from "./components/Bugdetails";
import Archive from "./components/Archive";
import Dashboard from "./components/Dashboard";
import BugPages from "./components/BugPages";
import Drafts from "./components/Drafts";

function App() {
  return (
    <div className="min-w-screen min-h-screen overflow-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bug-pages" element={<BugPages />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/create" element={<CreatePage />} />
        <Route path="/:bugId/edit" element={<EditPage />} />

        <Route path="/:bugId/bugdetails" element={<Bugdetails />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
