import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated, isRole, setIsRole}) => {
  const navigation = useNavigate();
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsRole(false);
    localStorage.removeItem("user");
    navigation("/");
  }

  return (
    <nav className="navbar">
      <h1>Product Search</h1>
      <div className="links">
        <a href="/">Home</a>
        {!isAuthenticated && (
          <>
            <Link to={'/signup'}>Signup</Link>
            <Link to={'/login'}>Login</Link>
            
          </>
        )}
        {isRole && (<a href="/add-product">Add Product</a>)}
        {isAuthenticated && (
          <>
            
            <a>
              Welcome
            </a>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;