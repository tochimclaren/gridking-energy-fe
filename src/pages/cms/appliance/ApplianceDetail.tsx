import { useLocation } from 'react-router-dom';
import DetailView from '../../../components/utils/DetailView';

const ApplianceDetail = () => {
    const location = useLocation();
    const appliance = location.state?.appliance;

    if (!appliance) {
        return <div className="text-center mt-10 text-red-500">Appliance data not available.</div>;
    }

    return (
        <div className="w-full max-w-full overflow-x-auto">
            <DetailView data={appliance} title={appliance.name} excludeKeys={['__v', '_id']} />
        </div>
    );
};

export default ApplianceDetail;
