import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/tables/Table';
import axios from 'axios';
import DeleteModal from '../../../components/utils/DeleteModal';
import CreateButton from '../../../components/utils/CreateButton';


const Gallery = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    });

    const navigate = useNavigate();

    const fetchData = async (page: number, limit: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/gallery`, {
                params: {
                    page,
                    limit
                }
            });
            const { data, pagination: pageMeta } = response.data;

            setGalleries(data);
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
    
    const handleUpdate = (gallery: Gallery) => {
        navigate(`/cms/galleries/${gallery._id}/update`, {
            state: { gallery } // Passing product data via state
        });
    };

    const handleDelete = (gallery: Gallery) => {
        setSelectedGallery(gallery);
        setShowDeleteModal(true);
    };

    const confirmDelete = async (gallery: Gallery) => {
        try {
            await axios.delete(`${BASE_URL}/gallery/${gallery._id}`);
            setGalleries(galleries.filter(p => p._id !== gallery._id));
            setShowDeleteModal(false);
            setSelectedGallery(null);
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Failed to delete product. Please try again.');
        }
    };
    const handleView = (gallery: Gallery) => {
        navigate(`/cms/galleries/${gallery._id}/detail`, {
            state: { gallery } // Passing product data via state
        });
    };
    const handleImageView = (data: Gallery) => {
        navigate(`/cms/images`, { state: { refId: data._id, refModel: 'Gallery' } })
        
    }
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
                title="Galleries"
                headers={[
                    { key: 'name', label: 'Name', sortable: true },
                    { key: 'description', label: 'Description', sortable: true },
                    {
                        key: 'isPublic',
                        label: 'Is Public',
                        sortable: true,
                        render: (value) => (
                            <span className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {value ? 'Yes' : 'No'}
                            </span>
                        )
                    }
                ]}
                data={galleries}
                keyField="_id"
                selectable
                onRowSelect={(selected) => console.log('Selected rows:', selected)}
                // Enable action buttons
                createBtn={<CreateButton link='/cms/galleries/create' />}
                showActions={true}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onView={handleView}
                onImages={handleImageView}
                actionLabels={{ update: 'Edit', delete: 'Remove', view: 'View',images: 'Images' }}
                pagination={{
                    page: pagination.page,
                    limit: pagination.limit,
                    total: pagination.total,
                    onPageChange: onPageChange,
                    onLimitChange: onLimitChange
                }}
            />
            <DeleteModal
                data={selectedGallery}
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirmDelete={confirmDelete}
            />
        </div>
    );

}
export default Gallery