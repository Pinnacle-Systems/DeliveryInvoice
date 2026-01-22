import React, { useEffect, useState, useRef, useCallback } from "react";

import { useGetPartyQuery, useGetPartyByIdQuery } from "../../../redux/services/PartyMasterService";

import { toast } from "react-toastify";


import moment from "moment";


import { findFromList, getCommonParams, isGridDatasValid } from "../../../Utils/helper";




import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import { useGetProductByIdQuery } from "../../../redux/services/ProductMasterService";
import ChallanForm from "./DeliveryChallanForm";
import { useGetBranchQuery } from "../../../redux/services/BranchMasterService";
import DeliveryChallanFormReport from "./DeliveryChallanReport";
import { useDeleteDeliveryChallanMutation } from "../../../redux/services/DeliveryChallanService";



export default function Form() {

  const today = new Date()
  const componentRef = useRef();

  const [readOnly, setReadOnly] = useState(false);
  const [docId, setDocId] = useState("new")
  const [id, setId] = useState("");
  const [date, setDate] = useState(moment.utc(today).format('YYYY-MM-DD'));
  const [taxTemplateId, setTaxTemplateId] = useState("");
  const [payTermId, setPayTermId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [transType, setTransType] = useState("GreyYarn");
  const [supplierId, setSupplierId] = useState("");

  const [discountType, setDiscountType] = useState("Percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [poItems, setPoItems] = useState([]);
  const [tempPoItems, setTempPoItems] = useState([]);


  const [remarks, setRemarks] = useState("")


  const [searchValue, setSearchValue] = useState("");
  const [deliveryType, setDeliveryType] = useState("")
  const [deliveryToId, setDeliveryToId] = useState("")

  const childRecord = useRef(0);
  const [purchaseOrderForm, setPurchaseOrderForm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [selectedFinYear, setSelectedFinYear] = useState('2023-2024');
  const { branchId, companyId, finYearId, userId } = getCommonParams()

  const params = {
    branchId, companyId, finYearId , isAddessCombined : true
  };



  const { data: supplierList } = useGetPartyQuery({ params: { ...params } });
  const { data: branchList } = useGetBranchQuery({ params: { ...params } });



  const [removeData] = useDeleteDeliveryChallanMutation();


























  const handleView = (id) => {

    setId(id)
    setPurchaseOrderForm(true)
    setReadOnly(true);
  };

  const handleEdit = (id) => {
    setReadOnly(false);
    setId(id)
    setPurchaseOrderForm(true)
  };



  const handleDelete = async (id, childRecord) => {
    if (id) {
      if (childRecord) {
        Swal.fire({
          icon: "error",
          title: "Child record Exists",
          // text: deldata.data?.message || "Data cannot be deleted!",
        });
        return;
      }
      if (!window.confirm("Are you sure to delete...?")) {
        return;
      }
      try {
        let deldata = await removeData(id).unwrap();
        if (deldata?.statusCode == 1) {
          Swal.fire({
            icon: "error",
            title: "Child record Exists",
            text: deldata.data?.message || "Data cannot be deleted!",
          });
          return;
        }
        setId("");
        Swal.fire({
          title: "Deleted Successfully",
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Submission error",
          text: error.data?.message || "Something went wrong!",
        });
      }
    }
  };


  const onNew = () => {
    setId("");
    setReadOnly(false);
    setPoItems([])
    setTempPoItems([])
    setDocId("New")


  }


  return (



    <>
      {purchaseOrderForm ? (

        <ChallanForm onClose={() => { setPurchaseOrderForm(false); setReadOnly(prev => !prev) }} supplierList={supplierList}
          branchList={branchList} docId={docId} params={params} id={id} setId={setId} setDocId={setDocId} readOnly={readOnly} setReadOnly={setReadOnly}
        />

      ) : (
        <div className="p-2 bg-[#F1F1F0] ">
          <div className="flex flex-col sm:flex-row justify-between bg-white py-1 px-1 items-start sm:items-center mb-4 gap-x-4 rounded-tl-lg rounded-tr-lg shadow-sm border border-gray-200">

            <h1 className="text-2xl font-bold text-gray-800  shadow-2xl">Delivery Challan</h1>
            <button
              className="hover:bg-green-700 bg-white border border-green-700 hover:text-white text-green-800 px-4 py-1 rounded-md flex items-center gap-2 text-sm"
              onClick={() => { setPurchaseOrderForm(true); onNew() }}
            >
              <FaPlus /> Create New
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm ">
            <DeliveryChallanFormReport
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              itemsPerPage={10}
            />
          </div>

        </div>
      )}
    </>
  );
}