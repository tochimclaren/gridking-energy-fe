import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/tables/Table';
import axios from 'axios';
import DeleteModal from '../../../components/utils/DeleteModal';
import CreateButton from '../../../components/utils/CreateButton';


const Appliance = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [appliances, setAppliances] = useState<Appliance[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAppliance, setSelectedAppliance] = useState<Appliance | null>(null);

    const navigate = useNavigate();
    const fetchData = async (page: number, limit: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/appliance`, {
                params: {
                    page,
                    limit
                }
            });
            const { data, pagination: pageMeta } = response.data;

            setAppliances(data);
            setPagination({
                page: pageMeta.currentPage,
                limit: pageMeta.limit,
                total: pageMeta.totalItems
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch data. Please try again later.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.page, pagination.limit);
    }, [pagination.page, pagination.limit]);

    const handleUpdate = (appliance: Appliance) => {
        navigate(`/cms/appliances/${appliance._id}/update`, {
            state: { appliance } // Passing appliance data via state
        });
    };

    const handleDelete = (appliance: Appliance) => {
        setSelectedAppliance(appliance);
        setShowDeleteModal(true);
    };
    const confirmDelete = async (appliance: Appliance) => {
        try {
            await axios.delete(`${BASE_URL}/appliance/${appliance._id}`);
            setAppliances(appliances.filter(p => p._id !== appliance._id));
            setShowDeleteModal(false);
            setSelectedAppliance(null);
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Failed to delete product. Please try again.');
        }
    };
    const handleView = (appliance: Appliance) => {
        navigate(`/cms/appliances/${appliance._id}/detail`, {
            state: { appliance } // Passing appliance data via state
        });
    };

    const onPageChange = async (page: number) => {
        setPagination(prev => ({
            ...prev,
            page
        }));
    };

    const onLimitChange = async (limit: number) => {
        setPagination(prev => ({
            ...prev,
            limit,
            page: 1 // Reset to first page when changing limit
        }));
    };

    if (loading) {
        return <div className="text-center p-4">Loading data...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-600">{error}</div>;
    }
    return (
        <div className="w-full max-w-full overflow-x-auto">
            <Table
                title="Appliance"
                headers={[
                    { key: 'name', label: 'Name', sortable: true },
                    { key: 'wattage', label: 'Wattage', sortable: true },
                    {
                        key: 'isSensitive',
                        label: 'Sensitive',
                        sortable: true,
                        render: (value) => (
                            <span className={`px-2 py-1 rounded-full text-xs ${value === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {value === true ? 'Yes' : 'No'}
                            </span>
                        )
                    },
                    { key: 'createdAt', label: 'Created At', sortable: true },
                    { key: 'updatedAt', label: 'Updated At', sortable: true },
                ]}
                data={appliances}
                keyField="_id"
                selectable
                createBtn={<CreateButton link='/cms/appliances/create' />}
                onRowSelect={(selected) => console.log('Selected rows:', selected)}

                // Enable action buttons
                showActions={true}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onView={handleView}
                actionLabels={{ update: 'Edit', delete: 'Remove', view: 'View' }}
                pagination={{
                    page: pagination.page,
                    limit: pagination.limit,
                    total: pagination.total,
                    onPageChange: onPageChange,
                    onLimitChange: onLimitChange
                }}
            />
            <DeleteModal
                data={selectedAppliance}
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirmDelete={confirmDelete}
            />
        </div>

    );

}
export default Appliance