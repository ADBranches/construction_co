// src/App.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.jsx";

// Public pages
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Projects from "./pages/Projects.jsx";
import Quote from "./pages/Quote.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProjects from "./pages/admin/AdminProjects.jsx";
import AdminProjectEdit from "./pages/admin/AdminProjectEdit.jsx";
import AdminServices from "./pages/admin/AdminServices.jsx";
import AdminInquiries from "./pages/admin/AdminInquiries.jsx";

function App() {
  return (
    <MainLayout>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/projects/:slug" element={<AdminProjectEdit />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/inquiries" element={<AdminInquiries />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
