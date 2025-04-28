import axios from 'axios';
import UserCreateForm from '../../components/cms/auth/UserCreateForm'

const UserCreate = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const onCreateUser = async (data: User): Promise<void> => {
    try {
      await axios.post(`${BASE_URL}/user/create`, data);
    } catch (error) {
      // Re-throw the error to be handled by the component
      throw error instanceof Error 
        ? error 
        : new Error('Failed to create user');
    }
  };

  return (
    <div className="w-full">
      <UserCreateForm onCreateUser={onCreateUser} />
    </div>
  )
}

export default UserCreate