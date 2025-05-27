import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';

const Sidebar = () => {
    const [storeOpen, setStoreOpen] = useState(true);
    const [analyticOpen, setAnalyticOpen] = useState(false);
    const [financeOpen, setFinanceOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();
    const isMobile = useIsMobile();

    // Auto-close sidebar on mobile
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(true);
        }
    }, [isMobile]);

    return (
        <>
            {/* Mobile toggle button */}
            <button 
                className={`md:hidden fixed top-20 left-4 z-20 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md`}
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <Menu size={20} />
            </button>

            {/* Sidebar overlay for mobile */}
            {isMobile && sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-10"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div 
                className={`${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transform transition-transform duration-200 ease-in-out fixed md:static z-20 
                md:translate-x-0 w-64 h-[calc(100vh-4rem)] md:h-full bg-white dark:bg-gray-800 
                dark:text-white flex flex-col p-4 overflow-y-auto`}
            >
                <nav className="flex flex-col space-y-2 text-gray-700 text-sm dark:text-white hover:text-gray-800">
                    {user.role === 'Manager' &&
                        <button 
                            className="text-left font-medium py-2 hover:bg-gray-200 hover:text-gray-800 rounded flex items-center justify-between" 
                            onClick={() => {
                                navigate('/dashboard');
                                if (isMobile) setSidebarOpen(false);
                            }}
                        >
                            Dashboard
                            <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    }

                    <div className='dark:text-white hover:text-gray-800'>
                        <button
                            onClick={() => setStoreOpen(!storeOpen)}
                            className="w-full text-left font-medium py-2 hover:bg-gray-200 hover:text-gray-800 rounded flex items-center justify-between"
                        >
                            Store
                            <svg
                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${storeOpen ? 'rotate-90' : 'rotate-0'}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        {storeOpen && (
                            <div className="pl-6 mt-1 flex flex-col space-y-1 ">
                                <button 
                                    className="text-left py-1 text-gray-600 hover:text-gray-900 dark:text-white" 
                                    onClick={() => {
                                        navigate('/products');
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                >
                                    Product
                                </button>
                                <button 
                                    className="text-left py-1 text-gray-600 hover:text-gray-900 dark:text-white" 
                                    onClick={() => {
                                        navigate('/add-product');
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                >
                                    Add Product
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            onClick={() => setAnalyticOpen(!analyticOpen)}
                            className="w-full text-left font-medium py-2 hover:bg-gray-200 hover:text-gray-800 rounded flex items-center justify-between"
                        >
                            Analytic
                            <svg
                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${analyticOpen ? 'rotate-90' : 'rotate-0'}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        {analyticOpen && (
                            <div className="pl-6 mt-1 flex flex-col space-y-1">
                                <button 
                                    className="text-left py-1 text-gray-600 hover:text-gray-900 dark:text-white"
                                    onClick={() => {
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                >
                                    Traffic
                                </button>
                                <button 
                                    className="text-left py-1 text-gray-600 hover:text-gray-900 dark:text-white"
                                    onClick={() => {
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                >
                                    Earning
                                </button>
                            </div>
                        )}
                    </div>

                    {user.role === 'Manager' &&
                        <div>
                            <button
                                onClick={() => setFinanceOpen(!financeOpen)}
                                className="w-full text-left font-medium py-2 hover:text-gray-800 hover:bg-gray-200 rounded flex items-center justify-between"
                            >
                                Finances
                                <svg
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${financeOpen ? 'rotate-90' : 'rotate-0'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            {financeOpen && (
                                <div className="pl-6 mt-1 flex flex-col space-y-1">
                                    <button 
                                        className="text-left py-1 text-gray-600 hover:text-gray-900 dark:text-white"
                                        onClick={() => {
                                            if (isMobile) setSidebarOpen(false);
                                        }}
                                    >
                                        Payment
                                    </button>
                                    <button 
                                        className="text-left py-1 text-gray-600 hover:text-gray-900 dark:text-white"
                                        onClick={() => {
                                            if (isMobile) setSidebarOpen(false);
                                        }}
                                    >
                                        Payout
                                    </button>
                                </div>
                            )}
                        </div>
                    }

                    <div>
                        <button
                            onClick={() => setAccountOpen(!accountOpen)}
                            className="w-full text-left font-medium py-2 hover:text-gray-800 hover:bg-gray-200 rounded flex items-center justify-between"
                        >
                            Account Setting
                            <svg
                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${accountOpen ? 'rotate-90' : 'rotate-0'}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        {accountOpen && (
                            <div className="pl-6 mt-1 flex flex-col space-y-1">
                                <button 
                                    className="text-left py-1 text-gray-600 hover:text-gray-900 dark:text-white"
                                    onClick={() => {
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                >
                                    My Profile
                                </button>
                                <button 
                                    className="text-left py-1 text-gray-600 hover:text-gray-900 dark:text-white"
                                    onClick={() => {
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                >
                                    Security
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            onClick={() => setHelpOpen(!helpOpen)}
                            className="w-full text-left font-medium py-2 hover:text-gray-800 hover:bg-gray-200 rounded flex items-center justify-between"
                        >
                            Help And Support
                            <svg
                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${helpOpen ? 'rotate-90' : 'rotate-0'}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;