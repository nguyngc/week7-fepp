import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProductPage = ({ isRole }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const deleteProduct = async (id) => {
        if (!isRole) return;

        const currentUser = JSON.parse(localStorage.getItem("user"));
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + currentUser?.token
                }
            });
            if (!res.ok) {
                throw new Error("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log("id: ", id);
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const onDeleteClick = (productId) => {
        if (!isRole) return;

        const confirm = window.confirm(
            "Are you sure you want to delete this listing?" + productId
        );
        if (!confirm) return;

        deleteProduct(productId);
        navigate("/");
    };

    const onEditClick = (productId) => {
        if (!isRole) return;

        navigate(`/edit-product/${productId}`)
    };

    return (
        <div className="product-preview">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <h2>{product.title}</h2>
                    <p>Category: {product.category}</p>
                    <p>Description: {product.description}</p>
                    <p>Price: {product.price}</p>
                    <p>StockQuantity: {product.stockQuantity}</p>
                    <p>Supplier: {product.supplier.name}</p>
                    <p>Email: {product.supplier.contactEmail}</p>
                    <p>Phone: {product.supplier.contactPhone}</p>
                    <p>Rating: {product.supplier.rating}</p>
                    {isRole && (
                        <>
                            <button onClick={() => onDeleteClick(product.id)}>delete</button>
                            <button onClick={() => onEditClick(product.id)}>edit</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductPage;