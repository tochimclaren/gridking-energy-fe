import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CategoryList from '../../../components/cms/category/CategoryList';
import { Plus } from 'lucide-react';
import DeleteModal from '../../../components/utils/DeleteModal';



const Categories: React.FC = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [categories, setCategories] = useState<Category[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const navigate = useNavigate()

    const handleAddCategory = () => {
        navigate('/cms/categories/create')
    };

    const handleEditCategory = (category: Category) => {
        navigate(`/cms/categories/${category._id}/update`, { state: { category } });
    };
    const handleViewCategory = (category: Category) => {
        navigate(`/cms/categories/${category._id}/detail`, { state: { category } })
    }

    const handleDeleteCategory = (category: Category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };
    const handleImageView = (data: Category) => {
        navigate(`/cms/images`, { state: { refId: data._id, refModel: 'Category', data: data } })
    }

    const confirmDelete = async (category: Category) => {
        try {
            await axios.delete(`${BASE_URL}/category/${category._id}`);
            setCategories(categories.filter(c => c._id !== category._id));
            setShowDeleteModal(false);
            setSelectedCategory(null);
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Failed to delete product. Please try again.');
        }
    };

    const handleAddSubcategory = (parentCategory: Category) => {
        // Navigate to add subcategory page or implement your own logic
        console.log('Add subcategory to:', parentCategory);
        // Example: router.push(`/categories/add?parentId=${parentCategory._id}`);
    };

    return (
        <div className="w-full p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <button
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={handleAddCategory}
                >
                    <Plus size={16} className="mr-1" />
                    Add Category
                </button>
            </div>

            <div className="bg-white rounded-lg p-4">
                <CategoryList
                    apiUrl={`${BASE_URL}/category`}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                    onView={handleViewCategory}
                    onImageView={handleImageView}
                    onAddSubcategory={handleAddSubcategory}
                />
            </div>

            <DeleteModal
                data={selectedCategory}
                show={showDeleteModal}
                title="Delete Category"
                onClose={() => setShowDeleteModal(false)}
                onConfirmDelete={confirmDelete}
            />
        </div>
    );
};

export default Categories;
