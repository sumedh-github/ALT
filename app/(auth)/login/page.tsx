import { AuthShell } from "@/components/alt/auth-shell";
import { LoginForm } from "@/components/alt/login-form";

export const metadata = {
  title: "Login | Avero Loose Theory"
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Client Login"
      title="Return to ALT"
      body="Access your profile, order history, and drop notifications."
    >
      <LoginForm />
    </AuthShell>
  );
}
