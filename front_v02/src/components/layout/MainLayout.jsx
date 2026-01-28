// src/components/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function MainLayout() {
  return (
    <div
      className="min-h-screen flex flex-col 
                 bg-[#f6fef9] text-[#003023]
                 antialiased selection:bg-[#83c441]/30"
    >
      {/* sticky navbar */}
      <div className="backdrop-blur-xl bg-white/60 shadow-sm sticky top-0 z-40">
        <Navbar />
      </div>

      <main
        className="flex-1 pt-6 md:pt-10
                   animate-fadeIn"
      >
        <div
          className="
            mx-auto w-full 
            max-w-7xl 
            px-4 sm:px-6 lg:px-8
            py-6 md:py-10
            bg-white/70 backdrop-blur-md
            rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]
          "
        >
          {/* 👇 this is where Home/Services/Projects/etc render */}
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
