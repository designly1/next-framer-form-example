import RegistrationForm from "@/components/RegistrationForm";
import { RegistrationFormProvider } from "@/contexts/RegistrationFormContext";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-around">
      <RegistrationFormProvider>
        <RegistrationForm />
      </RegistrationFormProvider>
    </main>
  );
}
