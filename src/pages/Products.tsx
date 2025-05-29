import { useContext, useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Search, Filter, Download, Trash2, Trash, Pencil } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { LanguageContext } from '@/contexts/LanguageContext';
import { useProducts, Product } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductTableComponent() {
  const [tab, setTab] = useState("published");
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { translations } = useContext(LanguageContext);
  const { products, deleteProduct } = useProducts();

  // Import useAuth hook
  const { user, canAccessStore } = useAuth();

  useEffect(() => {
    // Filter products based on search term and user's store access
    const filtered = products.filter(product =>
      // First check if user can access this store's products
      canAccessStore(product.store) &&
      // Then apply search filter
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm, user, canAccessStore]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      setSelected(prev => prev.filter(pid => pid !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selected.length} selected product(s)?`)) {
      selected.forEach(id => deleteProduct(id));
      setSelected([]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold">{translations.product || "Products"}</h2>
        <Button
          className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2 text-sm sm:text-base"
          onClick={() => navigate('/add-product')}
          size={isMobile ? "sm" : "default"}
        >
          <Plus size={isMobile ? 14 : 16} />
          {isMobile ? translations.add : translations.addNewProduct}
        </Button>
      </div>

      <Tabs defaultValue="published" onValueChange={setTab}>
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="published" className="flex-1 sm:flex-none">{translations.published}</TabsTrigger>
          <TabsTrigger value="draft" className="flex-1 sm:flex-none">{translations.draft}</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <Card>
            <CardContent className="p-2 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
                <div className="relative w-full sm:w-1/3 mb-2 sm:mb-0">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder={translations.searchProducts}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2 w-full sm:w-auto justify-end">
                  {selected.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                    className="flex items-center gap-1"
                  >
                    <Filter size={isMobile ? 14 : 16} />
                    {!isMobile && "Filter"}
                  </Button>
                  <Button
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                    className="flex items-center gap-1"
                  >
                    <Download size={isMobile ? 14 : 16} />
                    {!isMobile && "Export"}
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={selected.length === filteredProducts.length && filteredProducts.length > 0}
                          onCheckedChange={() => {
                            setSelected(selected.length === filteredProducts.length ? [] : filteredProducts.map(p => p.id));
                          }}
                        />
                      </TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className={isMobile ? "hidden sm:table-cell" : ""}>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className={isMobile ? "hidden sm:table-cell" : ""}>Stock</TableHead>
                      <TableHead>Manage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          {products.length === 0
                            ? "No products found. Click \"Add New Product\" to create one."
                            : "No products match your search criteria."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map(product => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Checkbox
                              checked={selected.includes(product.id)}
                              onCheckedChange={() => toggleSelect(product.id)}
                            />
                          </TableCell>
                          <TableCell className="max-w-[120px] sm:max-w-none truncate">
                            {product.name}
                          </TableCell>
                          <TableCell className={isMobile ? "hidden sm:table-cell" : ""}>
                            {product.category}
                          </TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell className={isMobile ? "hidden sm:table-cell" : ""}>
                            {product.stock}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1 sm:space-x-2">
                              <Button variant="outline" size="icon" onClick={() => navigate(`/edit-product/${product.id}`)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}