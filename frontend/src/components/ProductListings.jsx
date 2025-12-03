import ProductItem from "./ProductItem";

const ProductListings = ({products}) => {
  return (
    <div className="job-list">
      {products.map(p => (
        <ProductItem key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductListings;
