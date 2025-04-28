import { toast } from 'react-toastify';
import GalleryForm from '../../../components/cms/gallery/GalleryForm'
import { useLocation } from 'react-router-dom'


const GalleryUpdate = () => {
  const location = useLocation()
  const gallery = location.state?.gallery;
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
      <GalleryForm galleryId={gallery._id} onSuccess={handleSuccess}/>
    </div>
  )
}

export default GalleryUpdate