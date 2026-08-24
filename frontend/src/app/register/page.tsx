import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <RegisterForm />
      </div>
    </main>
  );
}