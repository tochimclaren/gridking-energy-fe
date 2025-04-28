import { useLocation } from 'react-router-dom';
import DetailView from '../../../components/utils/DetailView';

const CategoryDetail = () => {
    const location = useLocation();
    const category = location.state?.category;

    if (!category) {
        return <div className="text-center mt-10 text-red-500">Category data not available.</div>;
    }

    return (
        <div className="w-full max-w-full overflow-x-auto">
            <DetailView data={category} title={category.title} excludeKeys={['__v', '_id']} />
        </div>
    );
};

export default CategoryDetail;
