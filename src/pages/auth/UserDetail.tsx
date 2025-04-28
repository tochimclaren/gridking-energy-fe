import { useLocation } from 'react-router-dom';
import DetailView from '../../components/utils/DetailView';

const UserDetail = () => {
    const location = useLocation();
    const user = location.state?.user;

    if (!user) {
        return <div className="text-center mt-10 text-red-500">User data not available.</div>;
    }

    return (
        <div className="w-full max-w-full overflow-x-auto">
            <DetailView data={user} title={user.email} excludeKeys={['__v', '_id']} />
        </div>
    );
};

export default UserDetail;
