import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsAuthenticated, setIsRole }) => {
  const navigate = useNavigate();
  const name = useField("text");
  const email = useField("email");
  const password = useField("password");
  // const phoneNumber = useField("text");
  // const gender = useField("text");
  // const dob = useField("date");
  // const membership = useField("text");
  const role = useField("text");
  const address = useField("text");
   

  const { signup, error } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signup({
      name: name.value,
      email: email.value,
      password: password.value,
      // phone_number: phoneNumber.value,
      // gender: gender.value,
      // date_of_birth: dob.value,
      // membership_status: membership.value,
      role: role.value || "Admin",
      address: address.value
    });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      setIsRole(role.value=== "Admin" || role.value==="Seller");
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...name} />
        <label>Email address:</label>
        <input {...email} />
        <label>Password:</label>
        <input {...password} />
        {/* <label>Phone Number:</label>
        <input {...phoneNumber} />
        <label>Gender:</label>
        <input {...gender} />
        <label>Day of Birth:</label>
        <input {...dob} />
        <label>Membership Status:</label>
        <input {...membership} /> */}
        <label>Role:</label>
        <select {...role} required>
          <option value="">select option</option>
          <option value="Admin">Admin</option>
          <option value="Buyer">Buyer</option>
          <option value="Seller">Seller</option> 
        </select>
        
        <label>Address:</label>
        <input {...address} />
        
        <button>Sign up</button>
      </form>
    </div>
  );
};

export default Signup;