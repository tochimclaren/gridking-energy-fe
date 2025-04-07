import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ErrorMessage from '../../../components/alerts/ErrorMessage';
import Loader from '../../../components/alerts/Loader';
import Empty from '../../../components/alerts/Empty';
import Modal from '../../../components/utils/Modal';
import ProductForm from '../../../components/cms/product/ProductForm';

function Products() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const endpoint = `${BASE_URL}/product`
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const refModel = "Product"
    
    useEffect(() => {
        const getAppliance = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axios.get(endpoint)
                const products = response.data.products
                setProducts(products)
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

    // Loading state
    if (isLoading) {
        return <Loader />;
    }
    
    // Error state
    if (error) {
        return <ErrorMessage message={error} />;
    }
    
    // Empty state
    if (!products || products.length === 0) {
        return <Empty />;
    }
    
    // Content when everything is loaded successfully
    return (
        <div className="p-4 w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Products</h2>
            <button onClick={toggleModal} className="bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600 transition-colors">
                Add Product
            </button>
            <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full table-auto divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                                Hot Sell
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                Images
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product, index) => (
                            <tr
                                key={product._id}
                                className={`transition-colors duration-150 ease-in-out hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {String(product.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.category.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    {String(product.hotSell)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <Link to="/cms/images" state={{ data: product, refModel }} className="text-blue-600 hover:text-blue-800 transition-colors duration-150">
                                        View Images
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                    <div className="flex justify-center space-x-3">
                                        <Link to="/cms/products/edit" state={{ product }} className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150">
                                            Edit
                                        </Link>
                                        <Link to="/cms/products/delete" state={{ product }} className="text-red-600 hover:text-red-900 transition-colors duration-150">
                                            Delete
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={toggleModal}>
                <ProductForm title={'Create Product'} endpoint={endpoint} />
                <button
                    onClick={toggleModal}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors">
                    Close
                </button>
            </Modal>
        </div>
    );
}

export default Products;