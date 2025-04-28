import { useLocation } from 'react-router-dom';
import DetailView from '../../../components/utils/DetailView';

const QuoteDetail = () => {
    const location = useLocation();
    const quote = location.state?.quote;

    if (!quote) {
        return <div className="text-center mt-10 text-red-500">Quote data not available.</div>;
    }

    return (
        <div className="w-full max-w-full overflow-x-auto">
            <DetailView data={quote} title={quote.name} excludeKeys={['__v', '_id']} />
        </div>
    );
};

export default QuoteDetail;
