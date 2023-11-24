export default function Home() {
  const name = sessionStorage.getItem("@Auth:Nome");

  return (
    <div className="w-full h-full items-center flex justify-center flex-col">
      <h1 className="font-semibold text-2xl">Bem-Vindo(a)</h1>
      <h1 className="font-semibold text-2xl mt-2">{name}</h1>
    </div>
  );
}
