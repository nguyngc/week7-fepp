import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronic");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [rating, setRating] = useState(1);

  const navigate = useNavigate();
  
  const submitForm = async(e) => {
    e.preventDefault();
    
    const newProduct = {
      title,
      category,
      description,
      price,
      stockQuantity,
      supplier: {
        name: supplierName,
        contactEmail,
        contactPhone,
        rating
      }
    }
    
    const currentUser = JSON.parse(localStorage.getItem("user"));
    
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(newProduct),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + currentUser?.token
      }
    });
    const data = await res.json;
    console.log(data);

    if (res.ok) {
      navigate("/");
    } else {
      console.log(data.error)
    }
  };

  return (
    <div className="create">
      <h2>Add a New Product</h2>
      <form onSubmit={submitForm}>
        <label>Product title:</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Product category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Electronic">Electronic</option>
          <option value="Clothing">Clothing</option>
          <option value="Furniture">Furniture</option>
          
        </select>

        <label>Product Description:</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label>Price:</label>
        <input
          type="text"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <label>StockQuantity:</label>
        <input
          type="text"
          required
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
        />
        <label>Supplier Name:</label>
        <input
          type="text"
          required
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
        />
        <label>Contact Email:</label>
        <input
          type="text"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <label>Contact Phone:</label>
        <input
          type="text"
          required
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
        <label>Rating:</label>
        <input
          type="text"
          required
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <button>Add Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;