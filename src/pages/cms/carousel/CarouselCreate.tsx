import { toast } from 'react-toastify';
import CarouselForm from '../../../components/cms/carousel/CarouselForm'

const CarouselCreate = () => {
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
            <CarouselForm onSuccess={handleSuccess}/>
        </div>
    )
}

export default CarouselCreate

