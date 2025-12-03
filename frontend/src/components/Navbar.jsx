import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigation = useNavigate();
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    navigation("/");
  }

  return (
    <nav className="navbar">
      <h1>Job Search</h1>
      <div className="links">
        <a href="/">Home</a>
        {!isAuthenticated && (
          <>
            <Link to={'/signup'}>Signup</Link>
            <Link to={'/login'}>Login</Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <a href="/add-job">Add Job</a>
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