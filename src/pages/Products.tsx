import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const products = Array.from({ length: 7 }).map((_, i) => ({
  id: i,
  name: "Product Name Place Here",
  views: 1400,
  pricing: '$' + i,
  revenue: '$' + i,
}));

export default function ProductTableComponent() {
  const [tab, setTab] = useState("published");
  const [selected, setSelected] = useState<number[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold">Product</h2>
        <Button 
          className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2 text-sm sm:text-base" 
          onClick={() => navigate('/add-product')}
          size={isMobile ? "sm" : "default"}
        >
          <Plus size={isMobile ? 14 : 16} />
          {isMobile ? "Add" : "Add New Product"}
        </Button>
      </div>

      <Tabs defaultValue="published" onValueChange={setTab}>
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="published" className="flex-1 sm:flex-none">Published</TabsTrigger>
          <TabsTrigger value="draft" className="flex-1 sm:flex-none">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <Card>
            <CardContent className="p-2 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
                <Input placeholder="Search" className="w-full sm:w-1/3 mb-2 sm:mb-0" />
                <div className="flex space-x-2 w-full sm:w-auto justify-end">
                  <Button variant="outline" size={isMobile ? "sm" : "default"}>Filter</Button>
                  <Button variant="outline" size={isMobile ? "sm" : "default"}>Download</Button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox 
                          checked={selected.length === products.length} 
                          onCheckedChange={() => {
                            setSelected(selected.length === products.length ? [] : products.map(p => p.id));
                          }} 
                        />
                      </TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className={isMobile ? "hidden sm:table-cell" : ""}>Views</TableHead>
                      <TableHead>Pricing</TableHead>
                      <TableHead className={isMobile ? "hidden sm:table-cell" : ""}>Revenue</TableHead>
                      <TableHead>Manage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
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
                          {product.views}
                        </TableCell>
                        <TableCell>{product.pricing}</TableCell>
                        <TableCell className={isMobile ? "hidden sm:table-cell" : ""}>
                          {product.revenue}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1 sm:space-x-2">
                            <Button size="sm" variant="outline" className="px-2 sm:px-4">
                              {isMobile ? "E" : "Edit"}
                            </Button>
                            <Button size="sm" variant="outline" className="px-2 sm:px-4">
                              {isMobile ? "D" : "Delete"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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