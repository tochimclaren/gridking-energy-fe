import { useLocation } from 'react-router-dom';
import DetailView from '../../../components/utils/DetailView';
import ImageUploader from '../../../components/cms/images/ImageUploader';

const CarouselDetail = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const location = useLocation();
    const carousel = location.state?.carousel;

    if (!carousel) {
        return <div className="text-center mt-10 text-red-500">Carousel data not available.</div>;
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
                refId={carousel._id}
                apiUrl={`${BASE_URL}/image/Carousel/${carousel._id}`}
                onSuccess={handleUploadSuccess}
                onError={handleUploadError}
            />
            <DetailView data={carousel} title={carousel.title} excludeKeys={['__v', '_id']} />
        </div>
    );
};

export default CarouselDetail;
