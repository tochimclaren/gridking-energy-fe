import { toast } from 'react-toastify';
import { useLocation } from "react-router-dom";
import ImageGallery from "../../../components/cms/images/ImageGallery"
import ImageUploader from "../../../components/cms/images/ImageUploader";


const Images = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const location = useLocation()
  const { refId = '', refModel = '' } = location.state || {}
  const {name} = location.state?.product || "Upload Image"

  

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

  const handleError = (error: any) => {
    const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed. Please try again.';
    
    toast.error(errorMessage, {
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
      {refId && refModel !== null || undefined ?
        <div className="w-full">
          <h3 className="text-center text-gray-600 font-bold">Upload Image for: {name}</h3>
          <ImageUploader 
            refId={refId} 
            refModel={refModel} 
            onSuccess={handleSuccess}
            onError={handleError}
            apiUrl={`${BASE_URL}/image/upload`}/>
          <ImageGallery apiUrl={`${BASE_URL}/image`} refId={refId} refModel={refModel} />
        </div>
        :
        <ImageGallery apiUrl={`${BASE_URL}/image`} />}
    </div>
  )
}

export default Images