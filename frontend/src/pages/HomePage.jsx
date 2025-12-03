import { useState, useEffect } from "react";
import ProductListings from "../components/ProductListings";

const Home = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      console.log(data);
      setProducts(data);
    }

    fetchData();
  }, []);

  return (
    <div className="home">
      <ProductListings products={products} />
    </div>
  );
};

export default Home;
