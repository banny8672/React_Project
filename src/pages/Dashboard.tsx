import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  AreaChart, Area, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

// Static data - could be moved to a separate file if used elsewhere
const data = [
  { name: "Jan", value: 1500 },
  { name: "Feb", value: 4500 },
  { name: "Mar", value: 1200 },
  { name: "Apr", value: 4800 },
  { name: "May", value: 3000 },
  { name: "Jun", value: 3300 },
  { name: "Jul", value: 4400 },
  { name: "Aug", value: 0 },
  { name: "Sep", value: 1000 },
  { name: "Oct", value: 3100 },
  { name: "Nov", value: 1600 },
  { name: "Dec", value: 3000 },
];

const topProducts = [
  { name: "Wireless Headphones", sales: 2300 },
  { name: "Smartphone X2", sales: 1900 },
  { name: "Laptop Pro 15", sales: 1600 },
  { name: "Gaming Mouse", sales: 1400 },
  { name: "4K Monitor", sales: 1200 },
];

// Reusable chart container component
const ChartContainer = ({ title, children }) => (
  <Card>
    <CardContent className="p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="h-48 sm:h-64">{children}</div>
    </CardContent>
  </Card>
);

// Color palette for consistent styling
const COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  lightBlue: "#bfdbfe"
};

export default function Dashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Stat cards data
  const statCards = [
    { title: "Total Earning", value: "$112,893.00", change: "↑ 70.5%" },
    { title: "Views", value: "$112,893.00", change: "↑ 70.5%" },
    { title: "Total Sales", value: "$112,893.00", change: "↑ 70.5%" },
    { title: "Subscriptions", value: "$112,893.00", change: "↑ 70.5%" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
        <Button 
          className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2 text-sm sm:text-base" 
          onClick={() => navigate('/add-product')}
          size={isMobile ? "sm" : "default"}
        >
          <Plus size={isMobile ? 14 : 16} />
          {isMobile ? "Add" : "Add New Product"}
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-2 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-500">{card.title}</div>
              <div className="text-base sm:text-xl font-bold">{card.value}</div>
              <div className="text-xs text-green-500 mt-1">{card.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* First row of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartContainer title="Overview">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={!isMobile || { fontSize: 10, width: 10 }} />
              <YAxis tick={!isMobile || { fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
            <div className="space-y-2 sm:space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm sm:text-base">Indra Maulana</div>
                    <div className="text-xs sm:text-sm text-gray-500">Indramaulana@gmail.com</div>
                  </div>
                  <div className="text-green-600 font-semibold text-sm sm:text-base">+$1500.00</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second row of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartContainer title="Monthly Growth">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" tick={!isMobile || { fontSize: 10, width: 10 }} />
              <YAxis tick={!isMobile || { fontSize: 10 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={COLORS.success} 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Sales Distribution</h2>
            <div className="h-48 sm:h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={data} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={isMobile ? 60 : 80} 
                    fill={COLORS.primary}
                  >
                    {data.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={[COLORS.primary, COLORS.success, COLORS.warning, COLORS.danger][index % 4]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <ChartContainer title="Revenue Trend">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="name" tick={!isMobile || { fontSize: 10, width: 10 }} />
              <YAxis tick={!isMobile || { fontSize: 10 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={COLORS.primary} 
                fill={COLORS.lightBlue} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Top Sales Products</h2>
            <div className="space-y-2 sm:space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex justify-between items-center border-b pb-2">
                  <div className="truncate pr-2" style={{ maxWidth: isMobile ? '70%' : '80%' }}>
                    <div className="font-medium text-sm sm:text-base truncate">
                      {index + 1}. {product.name}
                    </div>
                  </div>
                  <div className="text-blue-600 font-semibold text-sm sm:text-base whitespace-nowrap">
                    {product.sales} sales
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}