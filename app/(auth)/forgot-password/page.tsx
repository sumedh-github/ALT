import { AuthShell } from "@/components/alt/auth-shell";
import { ForgotPasswordForm } from "@/components/alt/forgot-password-form";

export const metadata = {
  title: "Forgot Password | Avero Loose Theory"
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Reset Access"
      title="Recover Your Profile"
      body="Enter your email to receive reset instructions. For security, confirmation is displayed whether or not an account exists."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
