// src/App.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminDonations from "./pages/admin/AdminDonations";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import Donate from "./pages/Donate.jsx";

function App() {
  return (
    <Routes>
      {/* Shared navbar/footer wrapper */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/admin/campaigns" element={<AdminCampaigns />} />
        <Route path="/admin/donations" element={<AdminDonations />} />
      </Route>
    </Routes>
  );
}

export default App;
