import { useLocation } from "react-router-dom"
import UserUpdateForm from "../../components/cms/auth/UserUpdateForm"
import axios from "axios"

const UserUpdate = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const location = useLocation()
  const user = location.state?.user

  const onUpdateUser = async (userId: string, data: User): Promise<void> => {

    console.log(userId)
    console.log(user._id)
    console.log(data)
    try {
      await axios.put(`${BASE_URL}/user/update/${user._id}`, data);
    } catch (error) {
      // Re-throw the error to be handled by the component
      throw error instanceof Error 
        ? error 
        : new Error('Failed to update user');
    }
  };

  return (
    <div className="w-full">
      <UserUpdateForm user={user} onUpdateUser={onUpdateUser} />
    </div>
  )
}

export default UserUpdate