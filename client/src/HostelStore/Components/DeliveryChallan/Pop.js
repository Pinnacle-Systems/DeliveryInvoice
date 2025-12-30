import { useState } from "react";
import secureLocalStorage from "react-secure-storage";

const PopUp = ({
  setIsPrintOpen, onClose, setPrintModalOpen, nextprocess, formclose
}) => {

  const branchId = secureLocalStorage.getItem(
    sessionStorage.getItem("sessionId") + "currentBranchId"
  )
  const [searchCustomerType, setsearchCustomerType] = useState("");
  const [searchBillDate, setSearchBillDate] = useState("");
  const [searchDueDate, setSearchDueDate] = useState("");
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [dataPerPage, setDataPerPage] = useState("10");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [searchInvoiceNo, setSearchInvoiceNo] = useState('');
  const [taxType, setTaxType] = useState("ALL");



  return (
    <div id='registrationFormReport' className="flex flex-col   ">
      <div className="md:flex md:items-center  page-heading h-[60px]">
        <div className="heading text-center md:mx-10">
          Do you want to view the Delivery Challan print format?
        </div>

      </div>

      <div className="md:flex md:justify-around items-center p-5 h-[40%] border  rounded-lg shadow-md">
        <div>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
            onClick={() => {
              onClose()
              setPrintModalOpen(true)


            }}
          >
            YES
          </button>
        </div>
        <div>
          <button className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
            onClick={() => { 
              setIsPrintOpen(false)
              if(nextprocess == "close"){
                  formclose()
              }
             }}

          >
            NO
          </button>
        </div>
      </div>



    </div>
  )
}

export default PopUp