import React from 'react'
import CreateAccountForm from '../../components/cms/auth/CreateAccountForm'
import { AuthProvider } from '../../context/AuthContext'

function CreateAccount() {
  return (
    <AuthProvider>
      <CreateAccountForm />
    </AuthProvider>
  )
}

export default CreateAccount