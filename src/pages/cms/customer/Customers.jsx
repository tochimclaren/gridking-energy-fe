import React from 'react'
import { useState } from 'react';
import Modal from '../../../components/utils/Modal';
import CustomerForm from '../../../components/cms/customer/CustomerForm';

function Customers() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    return (
        <div className="p-4 w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Customers</h2>
            <button onClick={toggleModal} className="bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600 transition-colors">
                Add Customer
            </button>
            <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full table-auto divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                Phone
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                            Service Interested In
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                            state
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                Created At
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                Updated At
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200"></tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={toggleModal}>
                <CustomerForm title={'Create Customer'}/>
                <button
                    onClick={toggleModal}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors">
                    Close
                </button>
            </Modal>
        </div>
    )
}

export default Customers