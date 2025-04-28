import { useLocation } from 'react-router-dom';
import CarouselForm from '../../../components/cms/carousel/CarouselForm'
import { toast } from 'react-toastify';


function UpdateCarousel() {
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
  const location = useLocation();
  const carousel = location.state?.carousel;
  return (
    <CarouselForm carouselId={carousel._id} onSuccess={handleSuccess} />
  )
}

export default UpdateCarousel