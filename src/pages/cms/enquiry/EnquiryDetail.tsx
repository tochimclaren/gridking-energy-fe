import { useLocation } from 'react-router-dom';
import DetailView from '../../../components/utils/DetailView';

const EnquiryDetail = () => {
    const location = useLocation();
    const enquiry = location.state?.enquiry;

    if (!enquiry) {
        return <div className="text-center mt-10 text-red-500">Enquiry data not available.</div>;
    }

    return (
        <div className="w-full max-w-full overflow-x-auto">
            <DetailView data={enquiry} title={enquiry.name} excludeKeys={['__v', '_id']} />
        </div>
    );
};

export default EnquiryDetail;
