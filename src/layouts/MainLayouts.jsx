import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayouts() {
  return (
    <div className="flex flex-col min-h-svh overflow-x-hidden">
      <Header />
      <div className="flex flex-col flex-grow pt-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
