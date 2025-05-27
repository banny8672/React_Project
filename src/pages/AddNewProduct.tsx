import { useState } from 'react';
import {
  Home,
  BarChart3,
  Package,
  DollarSign,
  CreditCard,
  Settings,
  HelpCircle,
  Upload,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AddNewProduct() {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    description: '',
    tags: '',
    price: '',
    discount: '',
    discountCategory: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const isMobile = useIsMobile();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageDrop = (e, type) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'preview') {
          setPreviewImage(e.target.result);
        } else {
          setThumbnailImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (type: 'preview' | 'thumbnail') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          const result = event.target?.result as string;
          if (type === 'preview') {
            setPreviewImage(result);
          } else {
            setThumbnailImage(result);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const handleSave = () => {
    console.log('Product saved:', formData);
    alert('Product saved successfully!');
  };

  const handleDiscardChanges = () => {
    setFormData({
      productName: '',
      category: '',
      description: '',
      tags: '',
      price: '',
      discount: '',
      discountCategory: ''
    });
    setPreviewImage(null);
    setThumbnailImage(null);
  };

  return (
    <div className="flex">
      <div className="flex-1 overflow-auto">
        <div>
          <div className="rounded-lg shadow-sm">
            <Card className="flex flex-col sm:flex-row items-center justify-between dark:text-white p-2 sm:p-4 gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold">Add New Product</h2>
              <div className="flex space-x-2 sm:space-x-3">
                <button
                  onClick={handleDiscardChanges}
                  className="px-2 sm:px-4 py-1 sm:py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm sm:text-base"
                >
                  {isMobile ? "Discard" : "Discard Change"}
                </button>
                <button
                  onClick={handleSave}
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm sm:text-base"
                >
                  Save
                </button>
              </div>
            </Card>

            <Card className="p-2 sm:p-4 my-4">
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                  <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">General Information</h3>
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 sm:mb-2">Product Name</label>
                          <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleInputChange}
                            placeholder="Product Name"
                            className="pl-2 pr-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 sm:mb-2">Product Category</label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="pl-2 pr-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          >
                            <option value="">Product Category</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="home">Home & Garden</option>
                            <option value="sports">Sports</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 sm:mb-2">Description</label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            rows={isMobile ? 3 : 4}
                            className="pl-2 pr-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 sm:mb-2">Tag Keywords</label>
                          <textarea
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="Tag Keywords"
                            rows={isMobile ? 2 : 3}
                            className="pl-2 pr-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Pricing</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 sm:mb-2">Price</label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Pricing"
                            className="pl-2 pr-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 sm:mb-2">Discount</label>
                          <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleInputChange}
                            placeholder="Discount"
                            className="pl-2 pr-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium mb-1 sm:mb-2">Discount Category</label>
                          <select
                            name="discountCategory"
                            value={formData.discountCategory}
                            onChange={handleInputChange}
                            className="pl-2 pr-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          >
                            <option value="">Discount Category</option>
                            <option value="seasonal">Seasonal</option>
                            <option value="bulk">Bulk</option>
                            <option value="member">Member</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Preview Product</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">Drag And Your Image Here</p>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-blue-400 cursor-pointer transition-colors"
                        onDrop={(e) => handleImageDrop(e, 'preview')}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => handleImageClick('preview')}
                      >
                        {previewImage ? (
                          <img src={previewImage} alt="Preview" className="w-full h-32 sm:h-48 object-cover rounded-lg" />
                        ) : (
                          <div className="space-y-2 sm:space-y-4">
                            <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
                            <p className="text-gray-500 text-sm">Drag and drop here</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-1 sm:mb-2">Thumbnail Product</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">Drag And Your Image Here</p>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-blue-400 cursor-pointer transition-colors"
                        onDrop={(e) => handleImageDrop(e, 'thumbnail')}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => handleImageClick('thumbnail')}
                      >
                        {thumbnailImage ? (
                          <img src={thumbnailImage} alt="Thumbnail" className="w-full h-32 sm:h-48 object-cover rounded-lg" />
                        ) : (
                          <div className="space-y-2 sm:space-y-4">
                            <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
                            <p className="text-gray-500 text-sm">Drag and drop here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}