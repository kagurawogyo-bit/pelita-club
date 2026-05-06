"use client";

import { useState } from "react";
import DashboardNav from "./DashboardNav";
import ThemeToggle from "./ThemeToggle";

export default function DashboardLayoutClient({
  role,
  children
}: {
  role: string;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="dashboard-theme-container" style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div className="dashboard-bg"></div>

      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div className={`glass-sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        <DashboardNav role={role} onNavClick={() => setIsSidebarOpen(false)} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <header style={{ 
          height: '72px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 40px', 
          gap: '24px',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border-glass)',
          zIndex: 10
        }}>
          <button className="hamburger-btn" onClick={toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto' }}>
            <ThemeToggle />
            
            <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)', display: 'var(--desktop-only, block)' }}></div>

            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="btn-logout">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span className="hide-mobile">Keluar</span>
              </button>
            </form>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '40px', position: 'relative' }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        .glass-sidebar-container {
          width: 280px;
          height: 100vh;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 768px) {
          .glass-sidebar-container {
            position: fixed;
            left: -280px;
            z-index: 50;
          }
          
          .glass-sidebar-container.open {
            left: 0;
            box-shadow: 20px 0 50px rgba(0,0,0,0.2);
          }

          .sidebar-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            z-index: 45;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .sidebar-overlay.active {
            opacity: 1;
            visibility: visible;
          }

          header {
            padding: 0 20px !important;
          }

          main {
            padding: 24px 20px !important;
          }

          .hide-mobile {
            display: none;
          }
          
          .hamburger-btn {
            display: flex !important;
          }
        }

        .hamburger-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          padding: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
