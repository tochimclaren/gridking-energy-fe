import { useState, useEffect } from 'react';
import Table from '../../../components/tables/Table';
import axios from 'axios';
import DeleteModal from '../../../components/utils/DeleteModal';

function Newsletters() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    });

    const fetchData = async (page: number, limit: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/newsletter`, {
                params: {
                    page,
                    limit
                }
            });
            const { data, pagination: pageMeta } = response.data;
            console.log("Fetched newsletters:", data); // Debugging line to check fetched data

            setNewsletters(data);
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



    const handleDelete = (product: Newsletter) => {
        setSelectedNewsletter(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async (newsletter: Newsletter) => {
        try {
            await axios.delete(`${BASE_URL}/newsletter/${newsletter.email}`);
            setNewsletters(newsletters.filter(n => n._id !== newsletter.email));
            setShowDeleteModal(false);
            setSelectedNewsletter(null);
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Failed to delete product. Please try again.');
        }
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
        return <div className="text-center p-4 w-full">Loading data...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-600 w-full">{error}</div>;
    }

    return (
        <div className="w-full max-w-full overflow-x-auto">
            <Table
                title="Subscribed Newsletter Email List"
                headers={[
                    { key: 'email', label: 'Email', sortable: true },
                    { key: 'subscribedAt', label: 'Subscribed At', sortable: true },
                ]}
                data={newsletters}
                keyField="_id"
                selectable
                onRowSelect={(selected) => console.log('Selected rows:', selected)}
                // Enable action buttons
                showActions={true}
                onDelete={handleDelete}
                actionLabels={{ update: 'Edit', delete: 'Remove', view: 'View', images: 'Images' }}
                className="w-full" // Add this to ensure the table itself takes full width
                pagination={{
                    page: pagination.page,
                    limit: pagination.limit,
                    total: pagination.total,
                    onPageChange: onPageChange,
                    onLimitChange: onLimitChange
                }}
            />
            <DeleteModal
                data={selectedNewsletter}
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirmDelete={confirmDelete}
            />
        </div>
    );
}

export default Newsletters;