import { Outlet, useLocation } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import UserFooter from "./UserFooter";

export default function UserLayout() {
  const location = useLocation();

  const hideLayoutRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {/* {!hideLayout && <UserNavbar />}
      <Outlet />
      {!hideLayout && <UserFooter />} */}
      <div className="">
        {/* <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} /> */}
        {!hideLayout && (
          <header>
            <UserNavbar />
          </header>
        )}
        <div className="">
          {/* <Header setIsOpen={setIsSidebarOpen} /> */}

          <main className="flex-1 overflow-y-auto p-2 lg:p-8 bg-[var(--color-bg)]">
            <Outlet />
          </main>

          {!hideLayout && (
            <footer>
              <UserFooter />{" "}
            </footer>
          )}
        </div>
      </div>
    </>
  );
}
