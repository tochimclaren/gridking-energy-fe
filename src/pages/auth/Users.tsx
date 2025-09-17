import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/tables/Table';
import axios from 'axios';
import DeleteModal from '../../components/utils/DeleteModal';
import CreateButton from '../../components/utils/CreateButton';


const Users = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    });

    const navigate = useNavigate();
    const fetchData = async (page: number, limit: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/user`, {
                params: {
                    page,
                    limit
                }
            });
            const { data, pagination: pageMeta } = response.data;
            console.log(pageMeta)

            setUsers(data);
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


    const handleUpdate = (user: User) => {
        navigate(`/cms/users/${user._id}/update`, {
            state: { user } // Passing appliance data via state
        });
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };
    const confirmDelete = async (user: User) => {
        try {
            await axios.delete(`${BASE_URL}/user/${user._id}`);
            setUsers(users.filter(u => u._id !== u._id));
            setShowDeleteModal(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user. Please try again.');
        }
    };
    const handleView = (user: User) => {
        navigate(`/cms/users/${user._id}/detail`, {
            state: { user } // Passing user data via state
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
        return <div className="p-4">Loading data...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-600">{error}</div>;
    }
    return (
        <div className="w-full max-w-full overflow-x-auto">
            <Table
                title="Users"
                headers={[
                    { key: 'email', label: 'Email', sortable: true },
                    {
                      key: 'admin',
                      label: 'Admin',
                      sortable: true,
                      render: (value, row) => value && value == true ? 'Yes' : 'No'
                  },
                  {
                    key: 'staff',
                    label: 'Staff',
                    sortable: true,
                    render: (value, row) => value && value == true ? 'Yes' : 'No'
                },
                    { key: 'createdAt', label: 'Created At', sortable: true },
                    { key: 'updatedAt', label: 'Updated At', sortable: true },
                ]}
                data={users}
                keyField="_id"
                selectable
                createBtn={<CreateButton link='/cms/users/create' />}
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
                data={selectedUser}
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirmDelete={confirmDelete}
            />
        </div>

    );

}
export default Users