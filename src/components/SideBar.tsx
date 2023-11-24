import { AiOutlineHome, AiOutlineDollarCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import { FiUsers } from "react-icons/fi";
import { TbFiles } from "react-icons/tb";
import { MdOutlineAddShoppingCart, MdExitToApp } from "react-icons/md";

import { useLocation } from "react-router-dom";

const rotasGerente = [
  {
    Icone: AiOutlineHome,
    href: "/home",
  },
  {
    Icone: AiOutlineDollarCircle,
    href: "/tabelaPrecos",
  },
  {
    Icone: FiUsers,
    href: "/usuarios",
  },
  {
    Icone: MdOutlineAddShoppingCart,
    href: "/producao",
  },
  {
    Icone: TbFiles,
    href: "/pedidos",
  },
];

const rotasEmpregado = [
  {
    Icone: AiOutlineHome,
    href: "/home",
  },
  {
    Icone: AiOutlineDollarCircle,
    href: "/tabelaPrecos",
  },
  {
    Icone: TbFiles,
    href: "/pedidos",
  },
];

export default function SideBar() {
  const navigate = useNavigate();

  const tipoUsuario = sessionStorage.getItem("@Auth:TipoUsuario");

  const location = useLocation();

  const logout = () => {
    sessionStorage.removeItem("@Auth:Nome");
    sessionStorage.removeItem("@Auth:TipoUsuario");
    sessionStorage.removeItem("@Auth:Autenticado");

    navigate("/home");
  };

  return (
    <div className={`space-y-4 py-4 flex flex-col h-full bg-rose-50`}>
      <div className="h-5/6 flex items-center justify-center">
        <div className="flex flex-col h-3/4 justify-evenly">
          {tipoUsuario === "empregado" ? (
            <>
              {rotasEmpregado.map(({ href, Icone }) => {
                const isActive = location.pathname === href;

                return (
                  <a key={href} href={href}>
                    <div
                      className={`h-12 w-12 flex items-center justify-center p-1 transition rounded-full  ${
                        isActive
                          ? "bg-rose-500 hover:bg-rose-500 transition"
                          : "hover:bg-rose-300"
                      }`}
                    >
                      <Icone className="h-7 w-7" color="#313131" />
                    </div>
                  </a>
                );
              })}
            </>
          ) : (
            <>
              {rotasGerente.map(({ href, Icone }) => {
                const isActive = location.pathname === href;

                return (
                  <a key={href} href={href}>
                    <div
                      className={`h-12 w-12 flex items-center justify-center p-1 transition rounded-full  ${
                        isActive
                          ? "bg-rose-500 hover:bg-rose-500 transition"
                          : "hover:bg-rose-300"
                      }`}
                    >
                      <Icone className="h-7 w-7" color="#313131" />
                    </div>
                  </a>
                );
              })}
            </>
          )}
          <button onClick={() => logout()}>
            <div
              className={`h-12 w-12 flex items-center justify-center p-1 transition rounded-full hover:bg-rose-300`}
            >
              <MdExitToApp className="h-7 w-7" color="#313131" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
