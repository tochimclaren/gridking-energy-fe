import { useState, useEffect } from 'react';
import Table from '../../../components/tables/Table';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../../../components/utils/DeleteModal';
import CreateButton from '../../../components/utils/CreateButton';

function Products() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    });

    const navigate = useNavigate();
    const fetchData = async (page: number, limit: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/product`, {
                params: {
                    page,
                    limit
                }
            });
            const { data, pagination: pageMeta } = response.data;
            console.log(pageMeta)

            setProducts(data);
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



    const handleUpdate = (product: Product) => {
        navigate(`/cms/products/${product._id}/update`, {
            state: { product }
        });
    };

    const handleDelete = (product: Product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async (product: Product) => {
        try {
            await axios.delete(`${BASE_URL}/product/${product._id}`);
            setProducts(products.filter(p => p._id !== product._id));
            setShowDeleteModal(false);
            setSelectedProduct(null);
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Failed to delete product. Please try again.');
        }
    };

    const handleView = (product: Product) => {
        navigate(`/cms/products/${product._id}/detail`, {
            state: { product } // Passing product data via state
        });
    };

    const handleImageView = (data: Product) => {
        navigate(`/cms/images`, { state: { refId: data._id, refModel: 'Product', data: data } })
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
        return <div className="text-center p-4 w-full">Loading data...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-600 w-full">{error}</div>;
    }

    return (
        <div className="w-full max-w-full overflow-x-auto">
            <Table
                title="Products"
                headers={[
                    { key: 'name', label: 'Name', sortable: true },
                    { key: 'slug', label: 'Slug', sortable: true },
                    {
                        key: 'category',
                        label: 'Category',
                        sortable: true,
                        render: (value, row) => value && value.name ? value.name : 'N/A'
                    },
                    {
                        key: 'status',
                        label: 'Status',
                        sortable: true,
                        render: (value) => (
                            <span className={`px-2 py-1 rounded-full text-xs ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {value}
                            </span>
                        )
                    }
                ]}
                data={products}
                keyField="_id"
                selectable
                createBtn={<CreateButton link='/cms/products/create' />}
                onRowSelect={(selected) => console.log('Selected rows:', selected)}
                // Enable action buttons
                showActions={true}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onView={handleView}
                onImages={handleImageView}
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
                data={selectedProduct}
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirmDelete={confirmDelete}
            />
        </div>
    );
}

export default Products;