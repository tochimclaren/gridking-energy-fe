import { toast } from "react-toastify";
import CategoryForm from "../../../components/cms/category/CategoryForm"
import { useLocation } from "react-router-dom"

const CategoryUpdate = () => {
  const location = useLocation();
  const category = location.state?.category;

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
    <CategoryForm categoryId={category._id} onSuccess={handleSuccess}/>
    </div>
  )
}

export default CategoryUpdate