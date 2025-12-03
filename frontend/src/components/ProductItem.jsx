import { Link } from "react-router-dom";

const ProductItem = ({ product }) => {
  return (
    <div className="job-preview">
      <h2> {product.title}</h2>
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
      <p>Supplier: {product.supplier.name}</p>
      <Link
        to={`/products/${product.id}`}
        style={{ color: "red" }}
      >
        View Product
      </Link>
    </div>
  );
};

export default ProductItem;
