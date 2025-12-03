import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
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
    return user && user.token? true : false;
  });
  const [isRole, setIsRole] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token && (user.user.role === "Admin" || user.user.role === "Seller") ? true : false;
  });
  
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} isRole ={isRole} setIsRole={setIsRole} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-product" element={isRole? <AddProductPage /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage setIsRole= {setIsRole} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<SignupPage setIsRole= {setIsRole} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/edit-product/:id" element={isRole? <EditProductPage /> : <Navigate to="/login" />} />
            <Route path="/products/:id" element={<ProductPage isRole={isRole} />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
