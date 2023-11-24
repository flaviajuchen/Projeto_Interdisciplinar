import React from "react";
import { IoCloseSharp } from "react-icons/io5";

type Props = {
  title: string;
  children: React.ReactNode;
  textButton: string;
  confirmarModal?: () => void;
  cancelarModal?: () => void;
  fecharModal?: () => void;
  loading?: React.ReactNode;
};

export default function Modal({
  confirmarModal,
  cancelarModal,
  fecharModal,
  title,
  children,
  textButton,
  loading,
}: Props) {
  return (
    <div className="justify-center items-center flex bg-black bg-opacity-20 backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative w-[500px] my-6 mx-auto max-w-3xl">
        {/*content*/}
        <div className="border-0 rounded shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          {/*header*/}
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-2xl font-semibold text-gray-700">{title}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-black   float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={fecharModal}
            >
              <IoCloseSharp color="#374151" />
            </button>
          </div>
          {/*body*/}
          {children}
          {/*footer*/}
          <div className="flex items-center justify-end py-4 px-6 border-t border-solid border-slate-200 rounded-b">
            <button
              className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={cancelarModal}
            >
              Cancelar
            </button>
            <button
              className={` text-white ${
                textButton === "Remover"
                  ? "active:bg-red-700 bg-red-700"
                  : "active:bg-emerald-600 bg-emerald-600"
              }  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
              type="button"
              //   disabled={disabled}
              onClick={confirmarModal}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2 my-1">
                  <div className="w-2 h-2 rounded-full animate-pulse dark:bg-[white]"></div>
                  <div className="w-2 h-2 rounded-full animate-pulse dark:bg-[white]"></div>
                  <div className="w-2 h-2 rounded-full animate-pulse dark:bg-[white]"></div>
                </div>
              ) : (
                `${textButton}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
