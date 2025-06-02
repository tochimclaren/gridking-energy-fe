import { useLocation } from "react-router-dom";
import ProductForm from "../../../components/cms/product/ProductForm"

const ProductUpdate = () => {
  const location = useLocation();
  const product = location.state?.data;

  return (
    <div className="h-full w-full overflow-y-auto">
      <ProductForm initialData={product} />
    </div>
  )
}

export default ProductUpdate