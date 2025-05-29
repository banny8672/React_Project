import React, { useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { LanguageContext } from '@/contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const { language, changeLanguage, translations } = useContext(LanguageContext);

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors flex flex-col">
      <header className="dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">Bitstore</h1>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <div className="relative w-full max-w-xs">
                  <input
                    type="text"
                    placeholder={translations.search + "..."}
                    className="pl-2 pr-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </span>
                </div>
                <Button size="sm" className='bg-blue-700 hover:bg-blue-800 dark:bg-purple-700'>
                  {translations.search}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 w-[380px]">
                <span className="font-medium">{user.name}</span>
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  {user.role}
                </span>
              </div>

              <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>

              <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600 dark:text-gray-300">
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{translations.logout}</span>
              </Button>

              <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={language}
                className="form-select w-full p-2 rounded"
              >
                <option value="en">{translations.en}</option>
                <option value="hi">{translations.hi}</option>
              </select>

            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-auto">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;