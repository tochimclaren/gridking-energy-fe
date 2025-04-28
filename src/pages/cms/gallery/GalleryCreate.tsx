import { toast } from 'react-toastify';
import GalleryForm from '../../../components/cms/gallery/GalleryForm'


const GalleryCreate = () => {
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
      <GalleryForm onSuccess={handleSuccess}/>
    </div>
  )
}

export default GalleryCreate