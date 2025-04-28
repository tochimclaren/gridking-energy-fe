import { toast } from "react-toastify";
import EnquiryForm from "../../../components/cms/enquiry/EnquiryForm"

const EnquiryCreate = () => {

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
      <EnquiryForm onSuccess={handleSuccess}/>
    </div>
  )
}

export default EnquiryCreate