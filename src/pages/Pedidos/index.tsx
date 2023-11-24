import React, { useState, useEffect } from "react";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { format } from "date-fns";

import Select from "../../components/Select";
import SelectDefault from "../../components/SelectDefault";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import TituloTabela from "../../components/TituloTabela";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import api from "../../services/api";

import { MdModeEditOutline } from "react-icons/md";
import { BiSolidTrash } from "react-icons/bi";
import { VscSearchStop } from "react-icons/vsc";

type PedidosProps = {
  id: number | undefined;
  dataEmissao?: string | Date;
  dataFinalizacao?: string | Date;
  preco: number | undefined;
  tipo: string;
  gerenteResponsavel: string | null;
  vendedorResponsavel: string | null;
  producaoResponsavel: string | null;
};

type DadosProps = {
  id: number;
  tipo: string;
  nome?: string;
  preco?: number;
};

export default function Pedidos() {
  const [dados, setDados] = useState<PedidosProps[]>([]);

  const [tipos, setTipos] = useState<DadosProps[]>([]);
  const [gerentes, setGerentes] = useState<DadosProps[]>([]);
  const [vendedores, setVendedores] = useState<DadosProps[]>([]);
  const [producao, setProducao] = useState<DadosProps[]>([]);

  const [pedidoDataEmissao, setPedidoDataEmissao] = useState<
    string | Date | null
  >("");
  const [pedidoDataFinalizacao, setPedidoDataFinalizacao] = useState<
    string | Date | null
  >("");

  const [pedidoProduto, setPedidoProduto] = useState<string>("");
  const [pedidoQuantidade, setPedidoQuantidade] = useState<number | undefined>(
    undefined
  );
  const [pedidoVendedor, setPedidoVendedor] = useState<string>("");
  const [pedidoProducao, setPedidoProducao] = useState<string>("");
  const [pedidoGerente, setPedidoGerente] = useState<string>("");

  const [pedidoEditando, setPedidoEditando] = useState<PedidosProps>({
    id: undefined,
    preco: undefined,
    tipo: "",
    gerenteResponsavel: "",
    vendedorResponsavel: "",
    producaoResponsavel: "",
  });

  const [pedidoRemover, setPedidoRemover] = useState<PedidosProps>({
    id: undefined,
    dataEmissao: "",
    dataFinalizacao: "",
    preco: undefined,
    tipo: "",
    gerenteResponsavel: "",
    vendedorResponsavel: "",
    producaoResponsavel: "",
  });

  const [messagemSnackBar, setMessagemSnackBar] = useState<string>("");
  const [tipoSnackBar, setTipoSnackBar] = useState<string>("");
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);

  const [carregando, setCarregando] = useState<boolean>(true);
  const [abrirModalAdicionar, setAbrirModalAdicionar] =
    useState<boolean>(false);
  const [abrirModalEditar, setAbrirModalEditar] = useState(false);
  const [abrirModalDeletar, setAbrirModalDeletar] = useState(false);

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

  const handleProdutoChange = (value: string | null) => {
    setPedidoProduto(value || "");
  };

  const handleGerenteChange = (value: string | null) => {
    setPedidoGerente(value || "");
  };

  const handleVendedorChange = (value: string | null) => {
    setPedidoVendedor(value || "");
  };

  const handleProducaoChange = (value: string | null) => {
    setPedidoProducao(value || "");
  };

  function openModalAdicionar() {
    setAbrirModalAdicionar(true);
  }

  function fecharModalAdicionar() {
    setAbrirModalAdicionar(false);
  }

  function fecharModalEditar() {
    setAbrirModalEditar(false);
  }

  function fecharModalRemover() {
    setAbrirModalDeletar(false);
  }

  function confirmarModalAdicionar() {
    adicionarPedido();
  }

  function confirmarModalEditar(id: number | undefined) {
    if (
      pedidoEditando.vendedorResponsavel === "" ||
      pedidoEditando.tipo === "" ||
      pedidoEditando.gerenteResponsavel === "" ||
      pedidoEditando.producaoResponsavel === "" ||
      pedidoDataEmissao === "" ||
      pedidoDataFinalizacao === "" ||
      pedidoQuantidade === undefined ||
      pedidoQuantidade === 0
    ) {
      return;
    }

    if (id !== undefined) {
      editarPedido(id);
    }

    setPedidoEditando({
      id: undefined,
      dataEmissao: "",
      dataFinalizacao: "",
      preco: undefined,
      tipo: "",
      gerenteResponsavel: "",
      vendedorResponsavel: "",
      producaoResponsavel: "",
    });

    setAbrirModalEditar(false);
  }

  function confirmarModalRemover(id: number | undefined) {
    if (id !== undefined) {
      removerPedido(id);
      getPedidos();
    }
    setAbrirModalDeletar(false);
  }

  async function getPedidos() {
    try {
      const { data } = await api.get("readPedido");

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

  async function getTipo() {
    try {
      const { data } = await api.get("readTabelaDePrecos");
      setTipos(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getGerente() {
    try {
      const { data } = await api.get("readGerente");
      setGerentes(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getVendedor() {
    try {
      const { data } = await api.get("readEmpregado");
      setVendedores(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getProducao() {
    try {
      const { data } = await api.get("readProducao");
      setProducao(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function adicionarPedido() {
    if (
      pedidoDataEmissao === "" ||
      pedidoProduto === "" ||
      pedidoGerente === "" ||
      pedidoProducao === "" ||
      pedidoQuantidade === undefined
    ) {
      return;
    }

    let precoCalculado;

    const produtoSelecionado = tipos.find(
      (produto) => produto.tipo === pedidoProduto
    );

    if (produtoSelecionado) {
      const valorProduto = produtoSelecionado.preco;
      precoCalculado = valorProduto! * pedidoQuantidade;
    }

    const dataAtual = new Date();

    try {
      const dataEmissaoFormatada = pedidoDataEmissao
        ? format(new Date(pedidoDataEmissao), "dd/MM/yyyy")
        : null;

      const dataFinalizacaoFormatada = format(dataAtual, "dd/MM/yyyy");

      await api.post("createPedido", {
        dataEmissao: dataEmissaoFormatada,
        dataFinalizacao: dataFinalizacaoFormatada,
        preco: precoCalculado,
        tipo: pedidoProduto,
        gerenteResponsavel: pedidoGerente,
        vendedorResponsavel: pedidoVendedor,
        producaoResponsavel: pedidoProducao,
      });

      setTipoSnackBar("sucesso");
      setMessagemSnackBar("Pedido cadastrado com sucesso");
      setOpenSnackBar(true);

      setPedidoDataEmissao("");
      setPedidoGerente("");
      setPedidoVendedor("");
      setPedidoProducao("");
      setPedidoQuantidade(undefined);

      setAbrirModalAdicionar(false);

      getPedidos();
    } catch (error) {
      setTipoSnackBar("erro");
      setMessagemSnackBar("Ocorreu um erro ao cadastrar o empregado");
      setOpenSnackBar(true);

      console.error("Erro ao cadastrar empregado:", error);
    }
  }

  async function editarPedido(id: number) {
    try {
      let precoCalculado;

      const produtoSelecionado = tipos.find(
        (produto) => produto.tipo === pedidoEditando.tipo
      );

      if (produtoSelecionado) {
        const valorProduto = produtoSelecionado.preco;
        precoCalculado = valorProduto! * pedidoQuantidade!;
      }

      const dataEmissaoFormatada = pedidoDataEmissao
        ? format(new Date(pedidoDataEmissao), "dd/MM/yyyy")
        : null;

      const dataFinalizacaoFormatada = pedidoDataFinalizacao
        ? format(new Date(pedidoDataFinalizacao), "dd/MM/yyyy")
        : null;

      await api.put(`updatePedido/${id}`, {
        dataEmissao: dataEmissaoFormatada,
        dataFinalizacao: dataFinalizacaoFormatada,
        tipo: pedidoEditando.tipo,
        preco: precoCalculado,
        gerenteResponsavel: pedidoEditando.gerenteResponsavel,
        vendedorResponsavel: pedidoEditando.vendedorResponsavel,
        producaoResponsavel: pedidoEditando.producaoResponsavel,
      });

      setTipoSnackBar("sucesso");
      setMessagemSnackBar("Pedido editado com sucesso");
      setOpenSnackBar(true);

      getPedidos();
    } catch (error) {
      setTipoSnackBar("erro");
      setMessagemSnackBar("Ocorreu um erro ao editar pedido");
      setOpenSnackBar(true);
      console.error("Erro ao editar pedido:", error);
    }
  }

  async function removerPedido(id: number) {
    try {
      await api.delete(`deletePedido/${id}`);

      setTipoSnackBar("sucesso");
      setMessagemSnackBar("Pedido deletado com sucesso");
      setOpenSnackBar(true);

      getPedidos();
    } catch (error) {
      setTipoSnackBar("erro");
      setMessagemSnackBar("Ocorreu um erro ao deletar pedido");
      setOpenSnackBar(true);
      console.error("Erro ao deletar pedido:", error);
    }
  }

  useEffect(() => {
    getPedidos();
    getTipo();
    getGerente();
    getVendedor();
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
            tipoUsuario={tipoUsuario}
            titulo="Pedidos"
            tituloButton="Adicionar Pedido"
            button={true}
            abrirModalAdicionar={openModalAdicionar}
          />
          <div className=" flex items-center justify-center w-full mt-1 ">
            {dados.length === 0 ? (
              <div className="flex items-center justify-center flex-col w-full h-96 ">
                <VscSearchStop color="#565656" size={35} />
                <p className="text-gray-500 text-lg">
                  Nenhum pedido encontrado
                </p>
              </div>
            ) : (
              <table
                className={`bg-white w-10/12 divide-y text-left rounded-md`}
              >
                <thead className={`bg-rose-500 text-base font-medium `}>
                  <tr>
                    <th className="px-6 py-3">id</th>
                    <th className="px-6 py-3">Data Emissão</th>
                    <th className="px-6 py-3">Data Finalização</th>
                    <th className="px-6 py-3">Tipo</th>
                    <th className="px-6 py-3">Gerente</th>
                    <th className="px-6 py-3">Vendedor</th>
                    <th className="px-6 py-3">Produção</th>
                    <th className="px-6 py-3">Valor</th>
                    {tipoUsuario === "empregado" ? null : (
                      <>
                        <th className="px-6 py-3"></th>
                        <th className="px-6 py-3"></th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className={`divide-y`}>
                  {dados.map(
                    ({
                      id,
                      dataEmissao,
                      dataFinalizacao,
                      tipo,
                      gerenteResponsavel,
                      vendedorResponsavel,
                      producaoResponsavel,
                      preco,
                    }) => (
                      <React.Fragment key={id}>
                        <tr className={` text-sm font-medium`}>
                          <td className="px-6 py-3">{id}</td>
                          <td className="px-6 py-3">
                            {dataEmissao !== null &&
                            typeof dataEmissao === "string"
                              ? dataEmissao
                              : dataEmissao?.toString()}
                          </td>
                          <td className="px-6 py-3">
                            {dataFinalizacao !== null &&
                            typeof dataFinalizacao === "string"
                              ? dataFinalizacao
                              : dataFinalizacao?.toString()}
                          </td>
                          <td className="px-6 py-3">{tipo}</td>
                          <td className="px-6 py-3">{gerenteResponsavel}</td>
                          <td className="px-6 py-3">{vendedorResponsavel}</td>
                          <td className="px-6 py-3">{producaoResponsavel}</td>
                          <td className="px-6 py-3">{formatarPreco(preco)}</td>
                          {tipoUsuario === "empregado" ? null : (
                            <>
                              <td className="px-6 py-3">
                                <button
                                  onClick={() => {
                                    setAbrirModalEditar(true);
                                    setPedidoEditando({
                                      id: id,
                                      preco: preco,
                                      tipo: tipo,
                                      gerenteResponsavel: gerenteResponsavel,
                                      vendedorResponsavel: vendedorResponsavel,
                                      producaoResponsavel: producaoResponsavel,
                                    });
                                  }}
                                  className="p-1 hover:bg-rose-200 rounded-full transition"
                                >
                                  <MdModeEditOutline
                                    size={21}
                                    color="#374151"
                                  />
                                </button>
                              </td>
                              <td className="px-6 py-3">
                                <button
                                  onClick={() => {
                                    setAbrirModalDeletar(true);
                                    setPedidoRemover({
                                      id: id,
                                      dataEmissao: dataEmissao,
                                      dataFinalizacao: dataFinalizacao,
                                      preco: preco,
                                      tipo: tipo,
                                      gerenteResponsavel: gerenteResponsavel,
                                      vendedorResponsavel: vendedorResponsavel,
                                      producaoResponsavel: producaoResponsavel,
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
                    )
                  )}
                </tbody>
              </table>
            )}
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
                title="Deseja confirmar?"
                textButton="Adicionar"
                cancelarModal={fecharModalAdicionar}
                fecharModal={fecharModalAdicionar}
                confirmarModal={confirmarModalAdicionar}
              >
                <div className="relative p-6 flex-auto">
                  <div className="relative w-full">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          label="Data de Emissão"
                          format="DD/MM/YYYY"
                          value={pedidoDataEmissao || null}
                          onChange={(newValue) =>
                            setPedidoDataEmissao(newValue)
                          }
                          className="mt-4 border outline-gray-400 border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <Select
                    tipo="tipo"
                    dados={tipos}
                    tituloSelect="Selecione o produto"
                    onChange={handleProdutoChange}
                  />
                  <Select
                    tipo="nome"
                    dados={gerentes}
                    tituloSelect="Selecione o gerente"
                    onChange={handleGerenteChange}
                  />
                  <Select
                    tipo="nome"
                    dados={vendedores}
                    tituloSelect="Selecione o vendedor"
                    onChange={handleVendedorChange}
                  />
                  <Select
                    tipo="nome"
                    dados={producao}
                    tituloSelect="Selecione produção"
                    onChange={handleProducaoChange}
                  />
                  <Input
                    name="quantidade"
                    placeholder="Digite a quantidade do produto"
                    type="number"
                    value={pedidoQuantidade}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPedidoQuantidade(Number(e.target.value))
                    }
                  />
                </div>
              </Modal>
            )}
            {abrirModalEditar && (
              <Modal
                title="Editar pedido"
                textButton="Editar"
                confirmarModal={() => {
                  confirmarModalEditar(pedidoEditando.id);
                }}
                cancelarModal={fecharModalEditar}
                fecharModal={fecharModalEditar}
              >
                <div className="relative p-6 flex-auto">
                  <div className="relative w-full">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          label="Data de Emissão"
                          format="DD/MM/YYYY"
                          value={pedidoDataEmissao || null}
                          onChange={(newValue) =>
                            setPedidoDataEmissao(newValue)
                          }
                          className="mt-4 border outline-gray-400 border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <div className="relative w-full">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          label="Data de Finalização"
                          format="DD/MM/YYYY"
                          value={pedidoDataFinalizacao || null}
                          onChange={(newValue) =>
                            setPedidoDataFinalizacao(newValue)
                          }
                          className="mt-4 border outline-gray-400 border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <SelectDefault
                    tipo="tipo"
                    dados={tipos}
                    tituloSelect="Selecione o produto"
                    defaultValue={pedidoEditando.tipo}
                    onChange={(value: string | null) =>
                      setPedidoEditando((prevPedidoEditando) => ({
                        ...prevPedidoEditando,
                        tipo: value || "",
                      }))
                    }
                  />
                  <SelectDefault
                    tipo="nome"
                    dados={gerentes}
                    tituloSelect="Selecione o gerente"
                    defaultValue={pedidoEditando.gerenteResponsavel}
                    onChange={(value: string | null) =>
                      setPedidoEditando((prevPedidoEditando) => ({
                        ...prevPedidoEditando,
                        gerenteResponsavel: value || "",
                      }))
                    }
                  />
                  <SelectDefault
                    tipo="nome"
                    dados={vendedores}
                    tituloSelect="Selecione o vendedor"
                    defaultValue={pedidoEditando.vendedorResponsavel}
                    onChange={(value: string | null) =>
                      setPedidoEditando((prevPedidoEditando) => ({
                        ...prevPedidoEditando,
                        vendedorResponsavel: value || "",
                      }))
                    }
                  />
                  <SelectDefault
                    tipo="nome"
                    dados={producao}
                    tituloSelect="Selecione produção"
                    defaultValue={pedidoEditando.producaoResponsavel}
                    onChange={(value: string | null) =>
                      setPedidoEditando((prevPedidoEditando) => ({
                        ...prevPedidoEditando,
                        producaoResponsavel: value || "",
                      }))
                    }
                  />
                  <Input
                    name="quantidade"
                    placeholder="Digite a quantidade do produto"
                    type="number"
                    value={pedidoQuantidade}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPedidoQuantidade(Number(e.target.value))
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
                  confirmarModal={() => {
                    confirmarModalRemover(pedidoRemover.id);
                  }}
                  cancelarModal={fecharModalRemover}
                  fecharModal={fecharModalRemover}
                >
                  <div className="relative p-6 flex-auto">
                    <p className="text-gray-600 text-lg font-normal leading-relaxed">
                      Você realmente deseja remover o pedido
                      <span className="font-medium text-gray-700">
                        {" "}
                        {pedidoRemover.id}{" "}
                      </span>
                      do sistema?
                    </p>
                  </div>
                </Modal>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
