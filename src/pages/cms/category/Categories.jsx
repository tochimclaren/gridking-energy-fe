import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ErrorMessage from '../../../components/alerts/ErrorMessage';
import Loader from '../../../components/alerts/Loader';
import Empty from '../../../components/alerts/Empty';
import Modal from '../../../components/utils/Modal';
import CategoryForm from '../../../components/cms/category/CategoryForm';

function Products() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [categories, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const endpoint = `${BASE_URL}/category`
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    useEffect(() => {
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        const getAppliance = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axios.get(`${BASE_URL}/category`)
                const { data } = response.data
                setProducts(data)
                setIsLoading(false);
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Request canceled', err.message);
                } else {
                    setError(err instanceof Error ? err.message : 'An error occurred');
                    setIsLoading(false);
                }
            }
        }
        getAppliance()
    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    // Loading state
    if (isLoading) {
        <Loader />
    }
    // Error state
    if (error) {
        <ErrorMessage message={error} />
    }
    // Empty state
    if (!categories || categories.length === 0) {
        <Empty />
    }

    // Content when everything is loaded successfully
    return (
        <div className="p-4 w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Categories</h2>
            <button onClick={toggleModal} className="bg-blue-500 text-white py-2 px-4 mb-4 rounded">
                Add Categories
            </button>
            <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full table-auto divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Slug
                            </th>
                            <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category, index) => (
                            <tr
                                key={category._id}
                                className={`transition-colors duration-150 ease-in-out hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {category.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {category.slug}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link to="/cms/categories/edit" state={{ category }} className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors duration-150">
                                        Edit
                                    </Link>
                                    <Link to="/cms/categories/delete" state={{ category }} className="text-red-600 hover:text-red-900 transition-colors duration-150">
                                        Delete
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={toggleModal}>
                <CategoryForm title={'Create Category'} endpoint={endpoint} />
                <button
                    onClick={toggleModal}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
                    Close
                </button>
            </Modal>
        </div>
    );
}

export default Products