import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md rounded-3xl bg-[#f2f2f3] p-10 shadow-[0_16px_30px_rgba(0,0,0,0.25)]">
      <h1 className="text-5xl text-gray-700 font-medium mb-8">Login</h1>
      <p className="text-gray-500 text-xl mb-10">Pantalla de acceso en construcción.</p>
      <Link
        href="/grupos/4a/integrantes"
        className="inline-flex h-12 px-6 items-center justify-center rounded-xl bg-[#5c5ca8] text-white text-lg"
      >
        Ir al dashboard
      </Link>
    </div>
  );
}
