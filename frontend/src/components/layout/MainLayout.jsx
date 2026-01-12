// src/components/layout/MainLayout.jsx
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--brisk-cream,#f6fef9)] text-[var(--brand-contrast,#1f1f1f)]">
      <Navbar />

      <main className="flex-1">
        {/* single content container for all public pages */}
        <div className="container py-8 md:py-10">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
