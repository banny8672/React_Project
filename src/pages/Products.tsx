import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

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

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Product</h2>
        <Button className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2" onClick={() => navigate('/add-product')}>
          <Plus size={16} />
          Add New Product
        </Button>
      </div>

      <Tabs defaultValue="published" onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <Input placeholder="Search" className="w-1/3" />
                <div className="space-x-2">
                  <Button variant="outline">Filter</Button>
                  <Button variant="outline">Download</Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox checked={selected.length === products.length} onCheckedChange={() => {
                        setSelected(selected.length === products.length ? [] : products.map(p => p.id));
                      }} />
                    </TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox checked={selected.includes(product.id)} onCheckedChange={() => toggleSelect(product.id)} />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.views}</TableCell>
                      <TableCell>{product.pricing}</TableCell>
                      <TableCell>{product.revenue}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
