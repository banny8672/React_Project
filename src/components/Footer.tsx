import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

const Footer = () => {
  const { translations } = useContext(LanguageContext);
  
  return (
    <footer className="bg-white text-gray-700 pt-10 pb-5 border-t px-20 dark:bg-gray-800 rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="text-orange-500 text-2xl">⬡</div>
            <h1 className="text-xl font-bold dark:text-white">Opion</h1>
          </div>
          <p className="text-sm dark:text-white">
            {translations.shoppingDescription}
          </p>
          <div className="flex space-x-4 mt-4 text-2xl dark:text-white">
            <FaFacebook className="hover:text-blue-600 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaLinkedin className="hover:text-blue-700 cursor-pointer" />
          </div>
          <div className="mt-6 dark:text-white">
            <p className="font-semibold">{translations.subscribeToNewsletter}</p>
            <div className="flex mt-2">
              <input
                type="email"
                placeholder={translations.enterYourEmailHere}
                className="pl-2 pr-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button className="bg-black text-white px-4 rounded-r-md text-sm">{translations.send}</button>
            </div>
          </div>
        </div>

        <div className="dark:text-white">
          <h2 className="font-bold mb-3">{translations.service}</h2>
          <ul className="space-y-2 text-sm">
            <li>{translations.service}</li>
            <li>{translations.contactUs}</li>
            <li>{translations.affiliateProgram}</li>
            <li>{translations.aboutUs}</li>
          </ul>
        </div>

        <div className="dark:text-white">
          <h2 className="font-bold mb-3">Get Started</h2>
          <ul className="space-y-2 text-sm">
            <li>{translations.dashboard}</li>
            <li>Platform</li>
            <li>Workout Library</li>
            <li>App Design</li>
          </ul>
        </div>

        <div className="dark:text-white">
          <h2 className="font-bold mb-3">Get Started</h2>
          <ul className="space-y-2 text-sm">
            <li>{translations.aboutUs}</li>
          </ul>
        </div>
      </div>

      <div className="border-t mt-10 pt-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 px-16 dark:text-white dark:border-color-white">
        <span>© 2024 MaxFit</span>
        <div className="space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-gray-700">Twitter</a>
          <span>—</span>
          <a href="#" className="hover:text-gray-700">Instagram</a>
          <span>—</span>
          <a href="#" className="hover:text-gray-700">Facebook</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;