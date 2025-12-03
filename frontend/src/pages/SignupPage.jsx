import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const name = useField("text");
  const email = useField("email");
  const password = useField("password");
  const phoneNumber = useField("text");
  const gender = useField("text");
  const addressStreet = useField("text");
  const city = useField("text");
  const zipcode = useField("text");

  const { signup, error } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signup({
      name: name.value,
      email: email.value,
      password: password.value,
      name: name.value,
      phone_number: phoneNumber.value,
      gender: gender.value,
      address:{
        street: addressStreet.value,
        city: city.value,
        zipCode: zipcode.value
      }
    });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
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
        <label>Phone Number:</label>
        <input {...phoneNumber} />
        <label>Gender:</label>
        <input {...gender} />
        <label>Address:</label>
        <input {...addressStreet} />
        <label>City:</label>
        <input {...city} />
        <label>Zipcode:</label>
        <input {...zipcode} />
        <button>Sign up</button>
      </form>
    </div>
  );
};

export default Signup;