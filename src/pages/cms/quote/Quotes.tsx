import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/tables/Table';
import axios from 'axios';
import DeleteModal from '../../../components/utils/DeleteModal';
import CreateButton from '../../../components/utils/CreateButton';


const Quotes = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    });


    const navigate = useNavigate();

    const fetchData = async (page: number, limit: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/quote`, {
                params: {
                    page,
                    limit
                }
            });
            const { data, pagination: pageMeta } = response.data;

            setQuotes(data);
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

    const handleUpdate = (quote: Quote) => {
        navigate(`/cms/quotes/${quote._id}/update`, {
            state: { quote } // Passing product data via state
        });
    };

    const handleDelete = (quote: Quote) => {
        setSelectedQuote(quote);
        setShowDeleteModal(true);
    };

    const confirmDelete = async (quote: Quote) => {
        try {
            await axios.delete(`${BASE_URL}/quote/${quote._id}`);
            setQuotes(quotes.filter(p => p._id !== quote._id));
            setShowDeleteModal(false);
            setSelectedQuote(null);
        } catch (err) {
            console.error('Error deleting Quote:', err);
            alert('Failed to delete product. Please try again.');
        }
    };
    const handleView = (quote: Quote) => {
        navigate(`/cms/quotes/${quote._id}/detail`, {
            state: { quote } // Passing product data via state
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
        return <div className="p-4 text-red-600">{error}</div>;
    }
    return (
        <div className="w-full max-w-full overflow-x-auto">
            <Table
                title="Quotes"
                headers={[
                    { key: 'fullName', label: 'Full Name', sortable: true },
                    { key: 'companyName', label: 'Company Name', sortable: true },
                    { key: 'townCity', label: 'Town/City', sortable: true },
                    { key: 'email', label: 'Email Address', sortable: true },
                    { key: 'phoneNumber', label: 'Phone Number', sortable: true },
                ]}
                data={quotes}
                keyField="_id"
                selectable
                onRowSelect={(selected) => console.log('Selected rows:', selected)}
                // Enable action buttons
                createBtn={<CreateButton link='/cms/quotes/create' />}
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
                data={selectedQuote}
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirmDelete={confirmDelete}
            />
        </div>
    );

}
export default Quotes