import { toast } from 'react-toastify';
import ApplianceForm from '../../../components/cms/appliance/ApplianceForm'
import { useLocation } from 'react-router-dom'

const ApplianceUpdate = () => {
  const location = useLocation()
  const appliance = location.state?.appliance;

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
      <ApplianceForm applianceId={appliance._id} onSuccess={handleSuccess}/>
    </div>
  )
}

export default ApplianceUpdate