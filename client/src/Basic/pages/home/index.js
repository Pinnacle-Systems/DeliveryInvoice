import React, { useState } from "react";
import { AppHeader, AppFooter } from "../../components";
import Modal from "../../../UiComponents/Modal";
import { BranchAndFinyearForm, LogoutConfirm } from "../../components";
import ActiveTabList from "../../components/ActiveTabList";
import secureLocalStorage from "react-secure-storage";
import SuperAdminHeader from "../../components/SuperAdminHeader";

const Home = () => {
  const [isGlobalOpen, setIsGlobalOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  const isSuperAdmin = secureLocalStorage.getItem(
    sessionStorage.getItem("sessionId") + "superAdmin"
  );
  return (
    <>
      <Modal
        isOpen={isGlobalOpen}
        onClose={() => {
          setIsGlobalOpen(false);
        }}
        widthClass={""}
      >
        <BranchAndFinyearForm setIsGlobalOpen={setIsGlobalOpen} />
      </Modal>
      <Modal
        isOpen={logout}
        onClose={() => {
          setLogout(false);
        }}
        widthClass={""}
      >
        <LogoutConfirm setLogout={setLogout} />
      </Modal>
      <div className="flex flex-col h-screen">
        <div>
          {isSuperAdmin ? (
            <SuperAdminHeader
              setIsGlobalOpen={setIsGlobalOpen}
              setLogout={setLogout}
            />
          ) : (
            <AppHeader setIsGlobalOpen={setIsGlobalOpen} setLogout={setLogout} />
          )}
        </div>
        <div className="flex-1">
          <ActiveTabList />
        </div>
        {/* <AppFooter /> */}
      </div>
    </>
  );
};
export default Home;
