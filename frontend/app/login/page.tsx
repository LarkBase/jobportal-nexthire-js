import AuthLayout from "./layout"; // Adjust the import path as needed
import SignInForm from "../../components/SignInForm"; // Adjust the import path as needed

export default function LoginPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}