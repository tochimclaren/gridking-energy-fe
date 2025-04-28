import { useLocation } from 'react-router-dom';
import DetailView from '../../../components/utils/DetailView';
import ImageUploader from '../../../components/cms/images/ImageUploader';
import UploadPDF from '../../../components/cms/download/UploadPdf';


const ProductDetail = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const location = useLocation();
    const product = location.state?.product;

    if (!product) {
        return <div className="text-center mt-10 text-red-500">Product data not available.</div>;
    }
    const handleUploadSuccess = () => {
        console.log('success')
    }

    const handleUploadError = () => {
        console.log('error')
    }

    return (
        <div className="w-full max-w-full overflow-x-auto">
            <div className="flex justify-between">
                <UploadPDF
                    refModel="Product"
                    refId={product._refId}
                    apiUrl={`${BASE_URL}/image/upload`}
                    onSuccess={(data) => console.log('Upload success:', data)}
                    onError={(error) => console.error('Upload failed:', error)}
                />
                <ImageUploader
                    refModel="Product"
                    refId={product._id}
                    apiUrl={`${BASE_URL}/image/Product/${product._id}`}
                    onSuccess={handleUploadSuccess}
                    onError={handleUploadError}
                />
            </div>
            <DetailView data={product} title={product.name} excludeKeys={['__v', '_id']} />
        </div>
    );
};

export default ProductDetail;
