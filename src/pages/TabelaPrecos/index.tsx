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

type TabelaPrecosProps = {
  id: number | undefined;
  tipo: string;
  preco: number | undefined;
};

export default function TabelaPrecos() {
  const [dados, setDados] = useState<TabelaPrecosProps[]>([]);
  const [nomeProduto, setNomeProduto] = useState<string>("");
  const [precoProduto, setPrecoProduto] = useState<number | undefined>(
    undefined
  );
  const [messagemSnackBar, setMessagemSnackBar] = useState<string>("");
  const [tipoSnackBar, setTipoSnackBar] = useState<string>("");

  const [produtoRemover, setProdutoRemover] = useState<TabelaPrecosProps>({
    id: undefined,
    tipo: "",
    preco: undefined,
  });

  const [produtoEditando, setProdutoEditando] = useState<TabelaPrecosProps>({
    id: undefined,
    tipo: "",
    preco: undefined,
  });

  const [carregando, setCarregando] = useState<boolean>(true);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [abrirModalAdicionar, setAbrirModalAdicionar] =
    useState<boolean>(false);
  const [abrirModalEditar, setAbrirModalEditar] = useState<boolean>(false);
  const [abrirModalDeletar, setAbrirModalDeletar] = useState<boolean>(false);

  const tipoUsuario = sessionStorage.getItem("@Auth:TipoUsuario");

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

  function formatarPreco(valor: number | undefined) {
    if (valor === undefined) {
      return "";
    }

    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function fecharModalAdicionar() {
    setAbrirModalAdicionar(false);
  }

  function openModalAdicionar() {
    setAbrirModalAdicionar(true);
  }

  function confirmarModalAdicionar() {
    if (nomeProduto === "" || precoProduto === undefined) {
      return;
    }

    adicionarProduto();

    setNomeProduto("");
    setPrecoProduto(undefined);

    setAbrirModalAdicionar(false);
  }

  function fecharModalEditar() {
    setAbrirModalEditar(false);
  }

  function confirmarModalEditar(id: number | undefined) {
    if (produtoEditando.tipo === "" || produtoEditando.preco === 0) {
      return;
    }

    if (id !== undefined) {
      editarProduto(id);
    }

    setProdutoEditando({ id: undefined, tipo: "", preco: undefined });
    setAbrirModalEditar(false);
  }

  function fecharModalRemover() {
    setAbrirModalDeletar(false);
  }

  function confirmarModalRemover(id: number | undefined) {
    if (id !== undefined) {
      removerProduto(id);
      getPrecos();
    }

    setAbrirModalDeletar(false);
  }

  async function adicionarProduto() {
    try {
      await api.post("createTabelaDePrecos", {
        tipo: nomeProduto,
        preco: precoProduto,
      });

      setTipoSnackBar("sucesso");
      setMessagemSnackBar("Produto cadastrado com sucesso");
      setOpenSnackBar(true);

      getPrecos();
    } catch (error) {
      setTipoSnackBar("erro");
      setMessagemSnackBar("Ocorreu um erro ao cadastrar o produto");
      setOpenSnackBar(true);

      console.error("Erro ao cadastrar produto:", error);
    }
  }

  async function editarProduto(id: number) {
    try {
      await api.put(`updateTabelaDePrecos/${id}`, {
        tipo: produtoEditando.tipo,
        preco: produtoEditando.preco,
      });

      setTipoSnackBar("sucesso");
      setMessagemSnackBar("Produto editado com sucesso");
      setOpenSnackBar(true);

      getPrecos();
    } catch (error) {
      setTipoSnackBar("erro");
      setMessagemSnackBar("Ocorreu um erro ao editar produto");
      setOpenSnackBar(true);
      console.error("Erro ao editar produto:", error);
    }
  }

  async function removerProduto(id: number) {
    try {
      await api.delete(`deleteTabelaDePrecos/${id}`);

      setTipoSnackBar("sucesso");
      setMessagemSnackBar("Produto deletado com sucesso");
      setOpenSnackBar(true);

      getPrecos();
    } catch (error) {
      setTipoSnackBar("erro");
      setMessagemSnackBar("Ocorreu um erro ao deletar produto");
      setOpenSnackBar(true);
      console.error("Erro ao deletar produto:", error);
    }
  }

  async function getPrecos() {
    try {
      const { data } = await api.get("readTabelaDePrecos");

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
    getPrecos();
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
            tipoUsuario={tipoUsuario}
            titulo="Tabela de Preços"
            tituloButton="Adicionar produto"
            abrirModalAdicionar={openModalAdicionar}
          />
          <div className="flex items-center justify-center w-full mt-1 ">
            {dados.length === 0 ? (
              <div className="flex items-center justify-center flex-col w-full h-96 ">
                <VscSearchStop color="#565656" size={35} />
                <p className="text-gray-500 text-lg">
                  Nenhum produto encontrado
                </p>
              </div>
            ) : (
              <table
                className={`bg-white w-10/12 divide-y text-left rounded-md`}
              >
                <thead className={`bg-rose-500 text-base font-medium `}>
                  <tr>
                    <th className="px-6 py-3">Tipo produto</th>
                    <th className="px-6 py-3">Preço</th>
                    <th className="px-6 py-3"></th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className={`divide-y`}>
                  {dados.map(({ id, tipo, preco }) => (
                    <React.Fragment key={id}>
                      <tr className={` text-sm font-medium`}>
                        <td className="px-6 py-3">{tipo}</td>
                        <td className="px-6 py-3">{formatarPreco(preco)}</td>
                        {tipoUsuario === "empregado" ? null : (
                          <>
                            <td className="px-6 py-3">
                              <button
                                onClick={() => {
                                  setAbrirModalEditar(true);
                                  setProdutoEditando({
                                    id: id,
                                    tipo: tipo,
                                    preco: preco,
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
                                  setProdutoRemover({
                                    id: id,
                                    tipo: tipo,
                                    preco: preco,
                                  });
                                }}
                                className="p-1 hover:bg-rose-200 rounded-full transition "
                              >
                                <BiSolidTrash size={21} color="#374151" />
                              </button>
                            </td>
                          </>
                        )}
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
              autoHideDuration={3000}
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
              title="Adicionar Produto"
              textButton="Adicionar"
              confirmarModal={confirmarModalAdicionar}
              cancelarModal={fecharModalAdicionar}
              fecharModal={fecharModalAdicionar}
            >
              <div className="relative p-6 flex-auto">
                <p className="mb-4 text-gray-700 text-lg ">
                  Detalhes do produto:
                </p>
                <Input
                  name="editar"
                  placeholder="Nome produto"
                  type="text"
                  value={nomeProduto}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNomeProduto(e.target.value)
                  }
                />
                <Input
                  name="editar"
                  placeholder="Preço produto"
                  type="number"
                  value={precoProduto || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPrecoProduto(Number(e.target.value))
                  }
                />
              </div>
            </Modal>
          )}
          {abrirModalEditar && (
            <Modal
              title="Editar Produto"
              textButton="Editar"
              confirmarModal={() => confirmarModalEditar(produtoEditando.id)}
              cancelarModal={fecharModalEditar}
              fecharModal={fecharModalEditar}
            >
              <div className="relative p-6 flex-auto">
                <p className="mb-4 text-gray-700 text-lg ">
                  Detalhes do produto:
                </p>
                <Input
                  name="editar"
                  placeholder="Nome produto"
                  type="text"
                  value={produtoEditando.tipo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProdutoEditando((prevProdutoEditando) => ({
                      ...prevProdutoEditando,
                      tipo: e.target.value,
                    }))
                  }
                />
                <Input
                  name="editar"
                  placeholder="Preço produto"
                  type="number"
                  value={produtoEditando.preco || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProdutoEditando((prevProdutoEditando) => ({
                      ...prevProdutoEditando,
                      preco: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </Modal>
          )}
          {abrirModalDeletar && (
            <Modal
              title="Deseja Confirmar?"
              textButton="Remover"
              confirmarModal={() => confirmarModalRemover(produtoRemover.id)}
              cancelarModal={fecharModalRemover}
              fecharModal={fecharModalRemover}
            >
              <div className="relative p-6 flex-auto">
                <p className="text-gray-600 text-lg font-normal leading-relaxed">
                  Você realmente deseja remover o produto
                  <span className="font-medium text-gray-700">
                    {" "}
                    {produtoRemover.tipo}{" "}
                  </span>
                  do sistema?
                </p>
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
}
