import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
    const [storeOpen, setStoreOpen] = useState(true);
    const [analyticOpen, setAnalyticOpen] = useState(false);
    const [financeOpen, setFinanceOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="w-64 h-full bg-white dark:bg-gray-800 dark:text-white flex flex-col p-4">
            <nav className="flex flex-col space-y-2 text-gray-700 text-sm dark:text-white hover:text-gray-800">

                {user.role === 'Manager' &&
                    <button className="text-left font-medium py-2 hover:bg-gray-200 hover:text-gray-800 rounded flex items-center justify-between" onClick={() => navigate('/dashboard')}>
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
                            <button className="text-left py-1 text-gray-600 hover:text-gray-900 dark:text-white" onClick={() => navigate('/products')}>Product</button>
                            <button className="text-left py-1 text-gray-600 hover:text-gray-900 dark:text-white" onClick={() => navigate('/add-product')}>Add Product</button>
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
                            <button className="text-left py-1 text-gray-600 hover:text-gray-900">Traffic</button>
                            <button className="text-left py-1 text-gray-600 hover:text-gray-900">Earning</button>
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
                                <button className="text-left py-1 text-gray-600 hover:text-gray-900">Payment</button>
                                <button className="text-left py-1 text-gray-600 hover:text-gray-900">Payout</button>
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
                            <button className="text-left py-1 text-gray-600 hover:text-gray-900">My Profile</button>
                            <button className="text-left py-1 text-gray-600 hover:text-gray-900">Security</button>
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
    );
};

export default Sidebar;
