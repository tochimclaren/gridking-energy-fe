import { useLocation } from 'react-router-dom';
import DetailView from '../../../components/utils/DetailView';
import ImageUploader from '../../../components/cms/images/ImageUploader';

const GalleryDetail = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const location = useLocation();
    const gallery = location.state?.gallery;

    if (!gallery) {
        return <div className="text-center mt-10 text-red-500">Gallery data not available.</div>;
    }

    const handleUploadSuccess = () => {
        console.log('success')
    }

    const handleUploadError = () => {
        console.log('error')
    }
    return (
      <div className="w-full max-w-full overflow-x-auto">
            <ImageUploader
                refModel="Product"
                refId={gallery._id}
                apiUrl={`${BASE_URL}/image/Gallery/${gallery._id}`}
                onSuccess={handleUploadSuccess}
                onError={handleUploadError}
            />
            <DetailView data={gallery} title={gallery.name} excludeKeys={['__v', '_id']} />
        </div>
    );
};

export default GalleryDetail;
