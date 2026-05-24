import { AuthShell } from "@/components/alt/auth-shell";
import { RegisterForm } from "@/components/alt/register-form";

export const metadata = {
  title: "Register | Avero Loose Theory"
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Create Account"
      title="Join The Oversized Theory"
      body="Build your ALT client profile for faster checkout, saved details, and early access release updates."
    >
      <RegisterForm />
    </AuthShell>
  );
}
