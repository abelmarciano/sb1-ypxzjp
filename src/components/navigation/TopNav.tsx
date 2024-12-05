import React, { useState } from 'react';
import { NavMenu } from './NavMenu';
import { UserMenu } from './UserMenu';
import { NotificationsMenu } from './NotificationsMenu';
import { SearchBar } from './SearchBar';
import { MobileMenu } from './MobileMenu';
import { Bot, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TopNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1920px] mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-8">
            {/* Logo and brand */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900 leading-none">
                  CRM Énergies
                </h1>
                <p className="text-xs text-gray-500">
                  Agent IA connecté
                </p>
              </div>
            </Link>

            {/* Main navigation (desktop) */}
            <div className="hidden lg:flex flex-1 justify-center">
              <NavMenu />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <SearchBar />
              
              <div className="hidden sm:flex items-center gap-2">
                <NotificationsMenu />
                <div className="h-6 w-px bg-gray-200" />
                <UserMenu />
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}