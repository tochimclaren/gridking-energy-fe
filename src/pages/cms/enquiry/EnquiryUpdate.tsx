import { toast } from 'react-toastify'
import EnquiryForm from '../../../components/cms/enquiry/EnquiryForm'
import { useLocation } from 'react-router-dom'

const EnquiryUpdate = () => {
  const location = useLocation()
  const enquiry = location.state?.enquiry
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
      <EnquiryForm enquiryId={enquiry._id} onSuccess={handleSuccess}/>
    </div>
  )
}

export default EnquiryUpdate