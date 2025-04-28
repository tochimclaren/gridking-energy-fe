import { toast } from 'react-toastify';
import ApplianceForm from '../../../components/cms/appliance/ApplianceForm'

const ApplianceCreate = () => {
  const handleSuccess = () => {
    toast.success('Success!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="w-full">
      <ApplianceForm onSuccess={handleSuccess} />
    </div>
  )
}

export default ApplianceCreate