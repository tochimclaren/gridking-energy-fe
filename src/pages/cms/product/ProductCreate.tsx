import { toast } from 'react-toastify';
import ProductForm from '../../../components/cms/product/ProductForm'

const ProductCreate = () => {
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
    <div className="h-full w-full overflow-y-auto">
      <ProductForm onSuccess={handleSuccess} />
    </div>
  )
}

export default ProductCreate