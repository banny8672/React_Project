import {
  LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

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

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2" onClick={() => navigate('/add-product')}>
          <Plus size={16} />
          Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          "Total Earning",
          "Views",
          "Total Sales",
          "Subscriptions",
        ].map((title) => (
          <Card key={title}>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">{title}</div>
              <div className="text-xl font-bold">$112,893.00</div>
              <div className="text-xs text-green-500 mt-1">↑ 70.5%</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Overview</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Indra Maulana</div>
                    <div className="text-sm text-gray-500">Indramaulana@gmail.com</div>
                  </div>
                  <div className="text-green-600 font-semibold">+$1500.00</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Monthly Growth</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Sales Distribution</h2>
            <div className="h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#6366f1">
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#bfdbfe" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Top Sales Products</h2>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">{index + 1}. {product.name}</div>
                  </div>
                  <div className="text-blue-600 font-semibold">{product.sales} sales</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
