import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  async function entrarNaDashboard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          senha: password,
        }),
      });
      const responseData = await response.json();

      if (response.ok) {
        if (responseData.autenticado) {
          sessionStorage.setItem("@Auth:Nome", responseData.nome);
          sessionStorage.setItem("@Auth:TipoUsuario", responseData.tipo);
          sessionStorage.setItem("@Auth:Autenticado", responseData.autenticado);

          navigate("/home");
          setLoading(false);
        } else {
          console.error("Falha na requisição:", response.status);
          setSnackbarMessage("E-mail ou senha incorretos!");
          setSnackbarOpen(true);
          setLoading(false);
        }
      } else {
        console.error("Falha na requisição:", response.status);
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setLoading(false);
    }
  }

  return (
    <>
      <section className="bg-rose-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 "
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            Grafica
          </a>
          <div className="w-full bg-white rounded-lg shadow-lg  md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Faça login em sua conta
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                action="#"
                onSubmit={entrarNaDashboard}
              >
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 ">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    id="email"
                    className="bg-gray-50 outline-gray-400 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Exemplo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 ">
                    Senha
                  </label>
                  <input
                    required
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-50 border outline-gray-400 border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>

                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={6000}
                  onClose={handleSnackbarClose}
                >
                  <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackbarClose}
                    severity="error"
                  >
                    {snackbarMessage}
                  </MuiAlert>
                </Snackbar>
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 transition text-white font-semibold text-base rounded-lg px-5 py-2.5 text-center"
                >
                  {loading ? "Carregando..." : "Entrar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
