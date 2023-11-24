import { IoAddOutline } from "react-icons/io5";

type TituloTabelaProps = {
  tipoUsuario?: string | null;
  button?: boolean;
  titulo: string;
  tituloButton?: string;
  abrirModalAdicionar?: () => void;
};

export default function TituloTabela({
  tipoUsuario,
  titulo,
  tituloButton,
  button,
  abrirModalAdicionar,
}: TituloTabelaProps) {
  return (
    <div className="flex items-center justify-center w-full mt-20 mb-10">
      <div className="flex items-center justify-between w-10/12">
        <h1 className="font-semibold text-3xl">{titulo}</h1>
        {(tipoUsuario !== "empregado" || button) && (
          <button
            onClick={abrirModalAdicionar}
            className="flex items-center justify-center bg-rose-600 hover:bg-rose-700 transition rounded-md px-4 py-2 font-semibold text-gray-200 text-md"
          >
            <IoAddOutline color="#f0f0f0" size={20} /> {tituloButton}
          </button>
        )}
      </div>
    </div>
  );
}
