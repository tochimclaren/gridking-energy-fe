import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryItem from './CategoryItem';

interface ApiResponse {
  success: boolean;
  count: number;
  data: Category[];
}

interface CategoryListProps {
  apiUrl?: string; // Optional prop to override default API URL
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onView?:(category:Category)=>void;
  onImageView?: (data: Category) => void;
  onAddSubcategory?: (parentCategory: Category) => void;
}



const CategoryList: React.FC<CategoryListProps> = ({ 
  apiUrl = '/api/categories',
  onEdit,
  onDelete,
  onAddSubcategory,
  onImageView,
  onView,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(apiUrl);
      setCategories(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch categories');
      setLoading(false);
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [apiUrl]);

    if (loading) {
        return <div className="p-4">Loading data...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">{error}</div>;
    }

  return (
    <div className="space-y-1">
      {categories.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No categories found
        </div>
      ) : (
        categories.map(category => (
          <CategoryItem 
            key={category._id} 
            category={category} 
            level={0}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onImageView={onImageView}
            onAddSubcategory={onAddSubcategory}
          />
        ))
      )}
    </div>
  );
};

export default CategoryList;