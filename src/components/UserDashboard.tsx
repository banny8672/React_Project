import React, { useMemo, useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts, Product } from '@/contexts/ProductContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  Cell, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

// Color palette for consistent styling
const COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  lightBlue: "#bfdbfe"
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { products } = useProducts();
  const { translations } = useContext(LanguageContext);

  // Filter products based on user's store access
  const userProducts = useMemo(() => {
    if (!user) return [];
    
    // Manager can see all products
    if (user.role.toLowerCase() === 'manager' || user.store === 'all') {
      return products;
    }
    
    // Other users can only see products from their store
    return products.filter(product => product.store === user.store);
  }, [products, user]);

  // Calculate total inventory value
  const totalInventoryValue = useMemo(() => {
    return userProducts.reduce((total, product) => total + (product.price * product.stock), 0);
  }, [userProducts]);

  // Calculate low stock items (less than 10 units)
  const lowStockItems = useMemo(() => {
    return userProducts.filter(product => product.stock < 10).length;
  }, [userProducts]);

  // Calculate products by category
  const productsByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    
    userProducts.forEach(product => {
      if (categories[product.category]) {
        categories[product.category]++;
      } else {
        categories[product.category] = 1;
      }
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [userProducts]);

  // Calculate inventory value by store
  const inventoryByStore = useMemo(() => {
    const storeValues: Record<string, number> = {};
    
    userProducts.forEach(product => {
      const value = product.price * product.stock;
      if (storeValues[product.store]) {
        storeValues[product.store] += value;
      } else {
        storeValues[product.store] = value;
      }
    });
    
    return Object.entries(storeValues).map(([name, value]) => ({ name, value }));
  }, [userProducts]);

  // Get top products by value
  const topProducts = useMemo(() => {
    return [...userProducts]
      .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
      .slice(0, 5)
      .map(product => ({
        name: product.name,
        value: product.price * product.stock
      }));
  }, [userProducts]);

  // Get recent products (assuming createdAt is available)
  const recentProducts = useMemo(() => {
    return [...userProducts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [userProducts]);

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">{translations.totalProducts}</h3>
            <p className="text-2xl font-bold">{userProducts.length}</p>
            <p className="text-xs text-green-500">
              {user.store === 'all' ? 'All stores' : `${user.store}`}
            </p>
          </CardContent>
        </Card>

        {/* Total Inventory Value */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">{translations.inventoryValue}</h3>
            <p className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</p>
            <p className="text-xs text-green-500">{translations.totalValueOfAllProducts}</p>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">{translations.lowStockItems}</h3>
            <p className="text-2xl font-bold">{lowStockItems}</p>
            <p className="text-xs text-orange-500">Items with less than 10 units</p>
          </CardContent>
        </Card>

        {/* User Role Info */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">{translations.userRole}</h3>
            <p className="text-2xl font-bold">{user.role}</p>
            <p className="text-xs text-blue-500">{user.name}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products by Category */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">{translations.productsByCategory}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productsByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill={COLORS.primary}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {productsByCategory.map((_, index) => (
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

        {/* Inventory Value by Store (Only for Manager) */}
        {user.role.toLowerCase() === 'manager' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">{translations.inventoryValueByStore}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inventoryByStore}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                    <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Products by Value */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">{translations.topProductsByValue}</h3>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-blue-600 font-semibold">${product.value.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">{translations.recentProducts}</h3>
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.category}</div>
                  </div>
                  <div className="text-green-600 font-semibold">${product.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;