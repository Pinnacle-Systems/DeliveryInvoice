import React, { useState } from "react";
import { AppHeader, AppFooter } from "../../components";
import Modal from "../../../UiComponents/Modal";
import { BranchAndFinyearForm, LogoutConfirm } from "../../components";
import ActiveTabList from "../../components/ActiveTabList";
import secureLocalStorage from "react-secure-storage";
import SuperAdminHeader from "../../components/SuperAdminHeader";
import Sidebar from "../../components/sidebar";
import Header from "../../../HostelStore/Components/Header";

const Home = () => {
  const [isGlobalOpen, setIsGlobalOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  const isSuperAdmin = secureLocalStorage.getItem(
    sessionStorage.getItem("sessionId") + "superAdmin"
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(false);

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
            <>
              <SuperAdminHeader
                setIsGlobalOpen={setIsGlobalOpen}
                setLogout={setLogout}

              />
              <div className="p-1 bg-gray-100 " >

                <ActiveTabList />

              </div>
            </>

          ) :
            (
              // <div className="flex-1">
              //     </div>
              <>

                <div className="mb-[40px]" >
                  <Header profile={profile} setProfile={setProfile} />

                </div>

                <div className="p-1 bg-gray-100 " >

                  <ActiveTabList />

                </div>

                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isMainDropdownOpen={isMainDropdownOpen} setIsMainDropdownOpen={setIsMainDropdownOpen} />
              </>

            )}
        </div>
        {/* <div className="mt-[30px]  p-5 bg-gray-100  ">

          <ActiveTabList />

        </div> */}
        {/* <AppFooter /> */}
      </div>
    </>
  );
};
export default Home;
