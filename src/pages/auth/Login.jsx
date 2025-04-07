import LoginForm from "../../components/cms/auth/LoginForm";
import { AuthProvider } from "../../context/AuthContext";

const Login = () => {
  return (
    <AuthProvider>
          <LoginForm />
    </AuthProvider> 
  );
};

export default Login;
