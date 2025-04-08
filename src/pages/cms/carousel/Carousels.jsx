import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ErrorMessage from '../../../components/alerts/ErrorMessage';
import Loader from '../../../components/alerts/Loader';
import Empty from '../../../components/alerts/Empty';
import Modal from '../../../components/utils/Modal';
import CarouselForm from '../../../components/cms/carousel/CarouselForm';


function Carousels() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [carousels, setCarousel] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const endpoint = `${BASE_URL}/carousel`
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const refModel = "Carousel"

    useEffect(() => {
        const getCarousel = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axios.get(endpoint)
                const { data } = response
                setCarousel(data)
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
        getCarousel()
    }, [])

    // Loading state
    if (isLoading) {
        <Loader />
    }
    // Error state
    if (error) {
        <ErrorMessage message={error} />
    }
    // Empty state
    if (!carousels || carousels.length === 0) {
        <Empty />
    }

    // Content when everything is loaded successfully
    return (
        <div className="p-4 w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Carousels</h2>
            <button onClick={toggleModal} className="bg-blue-500 text-white py-2 px-4 rounded mb-4">
                Add Carousel
            </button>
            <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full table-auto divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Active
                            </th>
                            <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order
                            </th>
                            <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Images
                            </th>
                            <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {carousels.map((carousel, index) => (
                            <tr
                                key={carousel._id}
                                className={`transition-colors duration-150 ease-in-out hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {carousel.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {carousel.active}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {carousel.order}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <Link to="/cms/images" state={{ data: carousel, refModel }}>Images</Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {carousel.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                    <Link to="/cms/carousels/edit" state={{ carousel }} className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors duration-150">
                                        Edit
                                    </Link>
                                    <Link to="/cms/carousels/delete" state={{ carousel }} className="text-red-600 hover:text-red-900 transition-colors duration-150">
                                        Delete
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={toggleModal}>
                <CarouselForm title={'Create Carousel'} endpoint={endpoint} />
                <button
                    onClick={toggleModal}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
                    Close
                </button>
            </Modal>
        </div>
    );
}

export default Carousels