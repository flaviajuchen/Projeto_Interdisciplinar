import React, { useState, useEffect } from "react";

import api from "../../services/api";

import Modal from "../../components/Modal";
import Input from "../../components/Input";
import TituloTabela from "../../components/TituloTabela";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import { MdModeEditOutline } from "react-icons/md";
import { BiSolidTrash } from "react-icons/bi";
import { VscSearchStop } from "react-icons/vsc";

type ProducaoProps = {
  id: number | undefined;
  nome: string;
  funcao: string;
};

export default function Producao() {
  const [dados, setDados] = useState<ProducaoProps[]>([]);
  const [nomeColaborador, setNomeColaborador] = useState<string>("");
  const [funcaoColaborador, setFuncaoColaborador] = useState<string>("");

  const [messagemSnackBar, setMessagemSnackBar] = useState<string>("");
  const [tipoSnackBar, setTipoSnackBar] = useState<string>("");

  const [producaoRemover, setProducaoRemover] = useState<ProducaoProps>({
    id: undefined,
    nome: "",
    funcao: "",
  });

  const [producaoEditando, setProducaoEditando] = useState<ProducaoProps>({
    id: undefined,
    nome: "",
    funcao: "",
  });

  const [carregando, setCarregando] = useState<boolean>(true);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);

  const [abrirModalAdicionar, setAbrirModalAdicionar] = useState(false);
  const [abrirModalEditar, setAbrirModalEditar] = useState(false);
  const [abrirModalDeletar, setAbrirModalDeletar] = useState(false);

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

  function fecharModalAdicionar() {
    setAbrirModalAdicionar(false);
  }

  function openModalAdicionar() {
    setAbrirModalAdicionar(true);
  }

  function confirmarModalAdicionar() {
    if (nomeColaborador === "" || funcaoColaborador === "") {
      return;
    }

    adicionarProducao();

    setNomeColaborador("");
    setFuncaoColaborador("");

    setAbrirModalAdicionar(false);
  }

  function fecharModalEditar() {
    setAbrirModalEditar(false);
  }

  function confirmarModalEditar(id: number | undefined) {
    if (producaoEditando.nome === "" || producaoEditando.funcao === "") {
      return;
    }

    if (id !== undefined) {
      editarProducao(id);
    }

    setProducaoEditando({ id: undefined, nome: "", funcao: "" });

    setAbrirModalEditar(false);
  }

  function fecharModalRemover() {
    setAbrirModalDeletar(false);
  }

  function confirmarModalRemover(id: number | undefined) {
    if (id !== undefined) {
      removerProducao(id);
      getProducao();
    }

    setAbrirModalDeletar(false);
  }

  async function adicionarProducao() {
    try {
      await api.post("createProducao", {
        nome: nomeColaborador,
        funcao: funcaoColaborador,
      });

      setTipoSnackBar("sucesso");
      setMessagemSnackBar("Colaborador cadastrado com sucesso");
      setOpenSnackBar(true);

      getProducao();
    } catch (error) {
      setTipoSnackBar("erro");
      setMessagemSnackBar("Ocorreu um erro ao cadastrar o colaborador");
      setOpenSnackBar(true);

      console.error("Erro ao cadastrar colaborador:", error);
    }
  }

  async function editarProducao(id: number) {
    try {
      await api.put(`updateProducao/${id}`, {
        nome: producaoEditando.nome,
        funcao: producaoEditando.funcao,
      });

      setTipoSnackBar("sucesso");
      setMessagemSnackBar("Colaborador editado com sucesso");
      setOpenSnackBar(true);

      getProducao();
    } catch (error) {
      setTipoSnackBar("erro");
      setMessagemSnackBar("Ocorreu um erro ao editar colaborador");
      setOpenSnackBar(true);
      console.error("Erro ao editar colaborador:", error);
    }
  }

  async function removerProducao(id: number) {
    try {
      await api.delete(`deleteProducao/${id}`);

      setTipoSnackBar("sucesso");
      setMessagemSnackBar("Colaborador deletado com sucesso");
      setOpenSnackBar(true);

      getProducao();
    } catch (error) {
      setTipoSnackBar("erro");
      setMessagemSnackBar("Ocorreu um erro ao deletar colaborador");
      setOpenSnackBar(true);
      console.error("Erro ao deletar colaborador:", error);
    }
  }

  async function getProducao() {
    try {
      const { data } = await api.get("readProducao");

      setDados(data);

      setCarregando(false);
    } catch (error) {
      setTipoSnackBar("erro");
      setMessagemSnackBar("Ocorreu um erro ao carregar os dados");
      setOpenSnackBar(true);

      console.log(error);

      setCarregando(false);
    }
  }

  useEffect(() => {
    getProducao();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-start">
      {carregando ? (
        <div className="flex items-center justify-center w-full h-full">
          <CircularProgress color="inherit" size={45} />
        </div>
      ) : (
        <>
          <TituloTabela
            titulo="Setor de Produção"
            tituloButton="Adicionar colaborador"
            abrirModalAdicionar={openModalAdicionar}
          />
          <div className=" flex items-center justify-center w-full mt-1 ">
            {dados.length === 0 ? (
              <div className="flex items-center justify-center flex-col w-full h-96 ">
                <VscSearchStop color="#565656" size={35} />
                <p className="text-gray-500 text-lg">
                  Nenhum colaborador encontrado
                </p>
              </div>
            ) : (
              <table
                className={`bg-white w-10/12 divide-y text-left rounded-md`}
              >
                <thead className={`bg-rose-500 text-base font-medium `}>
                  <tr>
                    <th className="px-6 py-3">Nome</th>
                    <th className="px-6 py-3">Função</th>
                    <th className="px-6 py-3"></th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className={`divide-y`}>
                  {dados.map(({ id, nome, funcao }, index) => (
                    <React.Fragment key={id}>
                      <tr key={index} className={` text-sm font-medium`}>
                        <td className="px-6 py-3">{nome}</td>
                        <td className="px-6 py-3">{funcao}</td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => {
                              setAbrirModalEditar(true);
                              setProducaoEditando({
                                id: id,
                                nome: nome,
                                funcao: funcao,
                              });
                            }}
                            className="p-1 hover:bg-rose-200 rounded-full transition"
                          >
                            <MdModeEditOutline size={21} color="#374151" />
                          </button>
                        </td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => {
                              setAbrirModalDeletar(true);
                              setProducaoRemover({
                                id: id,
                                nome: nome,
                                funcao: funcao,
                              });
                            }}
                            className="p-1 hover:bg-rose-200 rounded-full transition "
                          >
                            <BiSolidTrash size={21} color="#374151" />
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {openSnackBar && (
            <Snackbar
              open={openSnackBar}
              autoHideDuration={4000}
              onClose={handleClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={handleClose}
                severity={tipoSnackBar === "sucesso" ? "success" : "error"}
                sx={{ width: "100%" }}
              >
                {messagemSnackBar}
              </Alert>
            </Snackbar>
          )}
          {abrirModalAdicionar && (
            <Modal
              title="Adicionar Colaborador"
              textButton="Adicionar"
              confirmarModal={confirmarModalAdicionar}
              cancelarModal={fecharModalAdicionar}
              fecharModal={fecharModalAdicionar}
            >
              <div className="relative p-6 flex-auto">
                <p className="mb-4 text-gray-700 text-lg ">
                  Dados do colaborador:
                </p>
                <Input
                  name="editar"
                  placeholder="Nome colaborador"
                  type="text"
                  value={nomeColaborador}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNomeColaborador(e.target.value)
                  }
                />
                <Input
                  name="editar"
                  placeholder="Função colaborador"
                  type="text"
                  value={funcaoColaborador}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFuncaoColaborador(e.target.value)
                  }
                />
              </div>
            </Modal>
          )}
          {abrirModalEditar && (
            <Modal
              title="Editar colaborador"
              textButton="Editar"
              confirmarModal={() => confirmarModalEditar(producaoEditando.id)}
              cancelarModal={fecharModalEditar}
              fecharModal={fecharModalEditar}
            >
              <div className="relative p-6 flex-auto">
                <p className="mb-4 text-gray-700 text-lg ">
                  Detalhes do colaborador:
                </p>
                <Input
                  name="editar"
                  placeholder="Nome do colaborador"
                  type="text"
                  value={producaoEditando.nome}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProducaoEditando((prevProducaoEditando) => ({
                      ...prevProducaoEditando,
                      nome: e.target.value,
                    }))
                  }
                />
                <Input
                  name="editar"
                  placeholder="Função do colaborador"
                  type="text"
                  value={producaoEditando.funcao}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProducaoEditando((prevProducaoEditando) => ({
                      ...prevProducaoEditando,
                      funcao: e.target.value,
                    }))
                  }
                />
              </div>
            </Modal>
          )}
          {abrirModalDeletar && (
            <>
              <Modal
                title="Deseja Confirmar?"
                textButton="Remover"
                confirmarModal={() => confirmarModalRemover(producaoRemover.id)}
                cancelarModal={fecharModalRemover}
                fecharModal={fecharModalRemover}
              >
                <div className="relative p-6 flex-auto">
                  <p className="text-gray-600 text-lg font-normal leading-relaxed">
                    Você realmente deseja remover o colaborador
                    <span className="font-medium text-gray-700">
                      {" "}
                      {producaoRemover.nome}{" "}
                    </span>
                    do sistema?
                  </p>
                </div>
              </Modal>
            </>
          )}
        </>
      )}
    </div>
  );
}
