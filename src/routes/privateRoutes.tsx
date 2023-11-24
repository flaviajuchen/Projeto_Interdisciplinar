import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoutes() {
  const userid =
    sessionStorage.getItem("@Auth:Autenticado") == "true" ? true : false;
  return <>{userid ? <Outlet /> : <Navigate to="/" />}</>;
}
