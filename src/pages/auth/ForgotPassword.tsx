// src/pages/ForgotPasswordPage.tsx
import { forgotPassword } from '../../services/auth.service';
import ForgotPasswordForm from '../../components/cms/auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
    const handleForgotPassword = async (email: string) => {
        await forgotPassword(email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                <ForgotPasswordForm onForgotPassword={handleForgotPassword} />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;