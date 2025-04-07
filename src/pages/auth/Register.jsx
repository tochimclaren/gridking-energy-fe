import React from 'react'
import RegisterForm from '../../components/cms/auth/RegisterForm';
import { AuthProvider } from "../../context/AuthContext";

function Register() {

  return (
    <AuthProvider>
        <RegisterForm />
    </AuthProvider>
  )
}

export default Register