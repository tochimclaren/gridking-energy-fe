// src/pages/ChangePasswordPage.tsx
import { changePassword } from '../../services/auth.service';
import ChangePasswordForm from '../../components/cms/auth/ChangePasswordForm';

const ChangePassword = () => {
    const handleChangePassword = async (data: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string
    }) => {
        await changePassword(data.currentPassword, data.newPassword);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Change Password</h1>
                <ChangePasswordForm onChangePassword={handleChangePassword} />
            </div>
        </div>
    );
};

export default ChangePassword;