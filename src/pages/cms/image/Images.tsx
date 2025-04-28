import { useLocation } from "react-router-dom";
import ImageGallery from "../../../components/cms/images/ImageGallery"
import ImageUploader from "../../../components/cms/images/ImageUploader";


const Images = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const location = useLocation()
  const { refId = '', refModel = '' } = location.state || {}

  const handleUploadSuccess = () => {
    console.log('success')
  }

  const handleUploadError = () => {
    console.log('error')
  }

  return (
    <div className="w-full">
      {refId && refModel !== null || undefined ?
        <div className="w-full">
          <ImageUploader 
            refId={refId} 
            refModel={refModel} 
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            apiUrl={`${BASE_URL}/image/upload`}/>
          <ImageGallery apiUrl={`${BASE_URL}/image`} refId={refId} refModel={refModel} />
        </div>
        :
        <ImageGallery apiUrl={`${BASE_URL}/image`} />}
    </div>
  )
}

export default Images