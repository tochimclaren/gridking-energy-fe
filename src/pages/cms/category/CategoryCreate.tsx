import { toast } from "react-toastify";
import CategoryForm from "../../../components/cms/category/CategoryForm"

const CategoryCreate = () => {

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
            <CategoryForm onSuccess={handleSuccess} />
        </div>
    )
}

export default CategoryCreate