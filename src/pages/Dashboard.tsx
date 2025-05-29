import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { LanguageContext } from '@/contexts/LanguageContext';
import UserDashboard from '@/components/UserDashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { translations } = useContext(LanguageContext);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">{translations.dashboard}</h1>
        <Button 
          className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2 text-sm sm:text-base" 
          onClick={() => navigate('/add-product')}
          size={isMobile ? "sm" : "default"}
        >
          <Plus size={isMobile ? 14 : 16} />
          {isMobile ? translations.add : translations.addNewProduct}
        </Button>
      </div>

      {/* User-specific dashboard */}
      <UserDashboard />
    </div>
  );
}