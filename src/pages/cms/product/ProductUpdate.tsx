import { useLocation } from "react-router-dom";
import ProductForm from "../../../components/cms/product/ProductForm"

const ProductUpdate = () => {
      const location = useLocation();
      const product = location.state?.product;
  return (
    <ProductForm initialData={product}/>
  )
}

export default ProductUpdate