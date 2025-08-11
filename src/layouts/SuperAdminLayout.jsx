import { Outlet } from "react-router";

import { ToastContainer } from "react-toastify";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";

export const SuperAdminLayout = () => {
  return (
    <>
      <section className=" max-h-[100vh] overflow-hidden flex w-full bg-secondaryOne dark:bg-darkBlue/95">
        <Sidebar />
        <div className="w-full">
          <Header />
          <main className="overflow-hidden max-w-[calc(100vw-14rem)]">
            <Outlet />
          </main>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};
