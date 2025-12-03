const ProductItem = ({product}) => {
  return (
    <div className="job-preview">
      <h2> {product.title}</h2>
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
      <p>Supplier: {product.supplier.name}</p>
    </div>
  );
};

export default ProductItem;
