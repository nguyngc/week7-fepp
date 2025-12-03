import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
// pages & components
import Home from "./pages/HomePage";
import AddProductPage from "./pages/AddProductPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage"
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProductPage from "./pages/ProductPage";
import EditProductPage from "./pages/EditProductPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? true : false;
  });
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-product" element={isAuthenticated ? <AddProductPage /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<SignupPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/edit-product/:id" element={isAuthenticated ? <EditProductPage /> : <Navigate to="/login" />} />
            <Route path="/products/:id" element={<ProductPage isAuthenticated={isAuthenticated} />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
