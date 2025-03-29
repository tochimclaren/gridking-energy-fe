import { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorMessage from '../../components/alerts/ErrorMessage';
import Loader from '../../components/alerts/Loader';
import Empty from '../../components/alerts/Empty';
import Modal from '../../components/utils/Modal';
import ApplianceForm from '../../components/cms/ApplianceForm';


function Appliances() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [appliances, setAppliances] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const endpoint = `${BASE_URL}/appliance`

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const getAppliance = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${BASE_URL}/appliance`)
        const { data } = response.data
        setAppliances(data)
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
  if (!appliances || appliances.length === 0) {
    <Empty />
  }

  // Content when everything is loaded successfully
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Appliances</h2>
      <button onClick={toggleModal} className="bg-blue-500 text-white py-2 px-4 rounded">
        Add appliance
      </button>
      <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wattage
              </th>
              <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated At
              </th>
              <th scope="col" className="w-1/6 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appliances.map((appliance, index) => (
              <tr
                key={appliance._id}
                className={`transition-colors duration-150 ease-in-out hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {appliance.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {appliance.wattage} W
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(appliance.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(appliance.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors duration-150">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900 transition-colors duration-150">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <ApplianceForm title={'Create Appliance'} endpoint={endpoint} />
        <button
          onClick={toggleModal}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
        >
          Close
        </button>
      </Modal>
    </div>
  );
}

export default Appliances