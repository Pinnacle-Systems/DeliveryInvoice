import React, { useEffect, useState, useRef, useCallback } from 'react';

import FormHeader from '../../../Basic/components/FormHeader';
import { toast } from "react-toastify"
import { DisabledInput, DropdownInput, TextInput } from "../../../Inputs"
import ReportTemplate from '../../../Basic/components/ReportTemplate';
import { PaymentType } from '../../../Utils/DropdownData';
import {
  useGetPaymentQuery,
  useGetPaymentByIdQuery,
  useAddPaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} from '../../../redux/services/PaymentService.js';
import { useGetPartyQuery } from '../../../redux/services/PartyMasterService';
import { useGetPartyByIdQuery } from '../../../redux/services/PartyMasterService';
import { useGetSalesBillByIdQuery} from "../../../redux/services/SalesBillService";

import { getCommonParams, getDateFromDateTime } from '../../../Utils/helper';
import Modal from "../../../UiComponents/Modal";
import PurchaseBillFormReport from './PurchaseBillFormReport';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { paymentModes } from '../../../Utils/DropdownData';
import PartyDropdownSearch from './PartyDropdownSearch.js';
import { dropDownListObject } from '../../../Utils/contructObject.js';
import { toWords } from 'number-to-words'
import e from 'cors';

const MODEL = "Payments";

export default function Form() {
  const today = new Date().toISOString().split('T')[0]; 

  const { branchId, companyId, finYearId, userId } = getCommonParams();

  const [form, setForm] = useState(true);
  const [date, setDate] = useState(getDateFromDateTime(today));
  const [docId, setDocId] = useState("");
  const [formReport, setFormReport] = useState(false) 
  const [id, setId] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [cvv, setCvv] = useState(today);
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentRefNo, setPaymentRefNo] = useState('');
  const [partyId, setPartyId] = useState("");
  const [paymentType, setPaymentType] = useState(PaymentType[0].value);
  const [paidAmount, setPaidAmount] = useState('');
  const [discount,setDiscount] = useState('')
  const [balanceAmount, setBalanceAmount] = useState('');
  const [totalBillAmount, setTotalBillAmount] = useState('');


  const [searchValue, setSearchValue] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const childRecord = useRef(0);


  const dispatch = useDispatch()


  const { data: allData, isLoading, isFetching } = useGetPaymentQuery({ params: { branchId, finYearId }, searchParams: searchValue });
  console.log(allData,"alladata")
  const { data: singleData } = useGetPaymentByIdQuery(id, { skip: !id });
  const {
    data: PartyData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
} = useGetPartyByIdQuery(supplierId, { skip: !supplierId });

console.log(PartyData,"partyData")

  const syncFormWithDb = useCallback(
    (data) => {
      if (id) setReadOnly(true);
      else setReadOnly(false);
      if (data?.docId) {
        setDocId(data.docId);
      }
      if (data?.createdAt) setDate(moment.utc(data?.createdAt).format("YYYY-MM-DD"));
      setPaidAmount(data?.paidAmount || '');
      setDiscount (data?.discount || 0)
      setSupplierId(data?.partyId || '')
      setPaymentMode(data?.paymentMode || '');
      setPaymentRefNo(data?.paymentRefNo || '');
      setPartyId(data?.partyId || '');
      setTotalBillAmount(data?.totalBillAmount || '')
      childRecord.current = data?.childRecord ? data?.childRecord : 0;
    }, [id])


  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [syncFormWithDb, singleData])


  const [addData] = useAddPaymentMutation();
  const [updateData] = useUpdatePaymentMutation();
  const [removeData] = useDeletePaymentMutation();
  const getNextDocId = useCallback(() => {

    if (id || isLoading || isFetching) return
    if (allData?.nextDocId) {
      setDocId(allData.nextDocId)
    }
  }, [allData, isLoading, isFetching, id])

  useEffect(getNextDocId, [getNextDocId])



  const data = {
    id,
    branchId,
    paymentMode,
    cvv,
    paidAmount,
    discount,
    supplierId,
    paymentType,
    finYearId,
    userId,
    totalBillAmount
  }
  const validateData = (data) => {
    return data?.supplierId && data?.paidAmount && data?.paymentMode
  }

  const handleSubmitCustom = async (callback, data, text) => {
    try {
      let returnData = await callback(data).unwrap();
      if (returnData.statusCode === 0) {
        setId("")
        syncFormWithDb(undefined)
        toast.success(text + "Successfully");
      } else {
        toast.error(returnData?.message)
      }
      dispatch({
        type: `partyMaster/invalidateTags`,
        payload: ['Party'],
      });
    } catch (error) {
      console.log("handle")
    }

  }
  const saveData = () => {
    if (!validateData(data)) {
      toast.info("Please fill all required fields...!", { position: "top-center" })
      return
    }
    if (data?.amount < 0) {
      toast.info("Amount Cannot be Negative...!!!", { position: "top-center" })
      return
    }
    if (!window.confirm("Are you sure save the details ...?")) {
      return
    }
    if (id) {
      handleSubmitCustom(updateData, data, "Updated")
    } else {
      handleSubmitCustom(addData, data, "Added")
    }
  }

  const deleteData = async () => {
    if (id) {
      if (!window.confirm("Are you sure to delete...?")) {
        return
      }
      try {
        await removeData(id).unwrap();
        setId("");
        toast.success("Deleted Successfully");
        dispatch({
          type: `partyMaster/invalidateTags`,
          payload: ['Party'],
        });
      } catch (error) {
        toast.error("something went wrong")
      }
      ;
    }
  }

  const handleKeyDown = (event) => {
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === 's') {
      event.preventDefault();
      saveData();
    }
  }

  const onNew = () => {
    setId("");
    getNextDocId();
    setReadOnly(false);
    setForm(true);
    setSearchValue("")
    syncFormWithDb(undefined);

  }
  const { data: supplierList } = useGetPartyQuery({ params: { branchId, finYearId } });

  const supplierData = supplierList?.data ? supplierList.data : [];
  const handleChange = (e) => {
    const value = e.target.value;
    // Only accept numeric values
    if (/^\d*$/.test(value)) {
      setPaidAmount(value);
    }
  };
  const handleChange1 = (e) =>{
    const value  = e.target.value;
    setDiscount(value)

  }

  function onDataClick(id) {
    setId(id);
    onNew();
    setForm(true);
  }
  const tableHeaders = [
    "Code", "Name", "Status"
  ]
  const tableDataNames = ["dataObj.code", "dataObj.name", 'dataObj.active ? ACTIVE : INACTIVE']
    console.log(paymentType,"paymenttype")
    useEffect(() => {
      const newAmount = paymentType === 'PURCHASEBILL' 
        ? ((PartyData?.data?.soa +PartyData?.data?.totalPurchaseNetBillValue)-PartyData?.data?.totalPaymentPurchaseBill) 
        : ((PartyData?.data?.coa+ PartyData?.data?.totalSalesNetBillValue)-PartyData?.data?.totalPaymentSalesBill)
  
      setTotalBillAmount(newAmount);
    }, [paymentType, PartyData]);
  if (!form)
    return <ReportTemplate
      heading={MODEL}
      tableHeaders={tableHeaders}
      tableDataNames={tableDataNames}
      loading={
        isLoading || isFetching
      }
      setForm={setForm}
      data={allData?.data ? allData?.data : []}
      onClick={onDataClick}
      onNew={onNew}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
    />

  return (


    <div onKeyDown={handleKeyDown} className='md:items-start md:justify-items-center grid h-full bg-gray-200'>
      <Modal

        isOpen={formReport}
        onClose={() => setFormReport(false)}
        widthClass={"px-2 h-[90%] w-[90%]"}

      >
        <PurchaseBillFormReport onClick={(id) => { setId(id); setFormReport(false) }} />
      </Modal>
      <div className='flex flex-col frame w-full h-full'>
        <FormHeader
          onNew={onNew}
          model={MODEL}
          openReport={() => setFormReport(true)}
          saveData={saveData}
          setReadOnly={setReadOnly}
          deleteData={deleteData}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />

<div className="flex justify-center h-[80%] bg-gray-200">
  <form
    onSubmit={saveData}
    className="bg-white p-3 rounded-lg h-auto mt-5 shadow-lg w-full max-w-lg"
  >
    <h2 className="text-3xl font-bold mb-4 text-center text-emerald-700">
      Payment Form
    </h2>
    <div className="grid grid-cols-2 gap-4">
  <div className="mb-3">
    <label className="block text-gray-700 mb-1">Transaction No</label>
    <input
      type="text"
      value={docId}
      className="w-full px-2 py-1 border border-gray-300 rounded-md text-emerald-600 text-sm"
      readOnly
    />
  </div>
  <div className="mb-3">
    <label htmlFor="paymentType" className="block text-gray-700 mb-1">
      Payment Type
    </label>
    <select
      id="paymentType"
      value={paymentType}
      onChange={(e) => setPaymentType(e.target.value)}
      className="w-full px-2 py-1 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      {PaymentType.map((type) => (
        <option key={type.value} value={type.value}>
          {type.show}
        </option>
      ))}
    </select>
  </div>
</div>

    <div className="mb-3">
      <div className="p-2 w-full">
        <DropdownInput
          name="Customer"
          className="text-sm"
          options={dropDownListObject(
            id
              ? supplierData
              : paymentType === "PURCHASEBILL"
              ? supplierData.filter((value) => value.isSupplier && value.active)
              : supplierData.filter((value) => value.isCustomer && value.active),
            "name",
            "id"
          )}
          value={supplierId}
          setValue={setSupplierId}
          required={true}
          readOnly={readOnly}
          disabled={childRecord.current > 0}
        />
      </div>
      <div className="p-2 w-full">
        <DropdownInput
          name="Payment Mode"
          className="text-sm"
          options={paymentModes}
          value={paymentMode}
          setValue={setPaymentMode}
          required={true}
          readOnly={readOnly}
        />
      </div>
    </div>
    <div className="flex space-x-4 mb-3">
      <div className="w-1/2">
        <label className="block text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Select Date"
        />
      </div>
      <div className="w-1/2">
      <label className="block text-gray-700 mb-1">Outstanding Amount</label>
      <input
  type="text"
  value={(Number(totalBillAmount) || 0).toFixed(2)}
  onChange={(e) => setTotalBillAmount(e.target.value)}
  className="w-full px-2 py-1 border border-gray-300 text-red-500 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
  placeholder="0"
/>

    </div>


    </div>
    <div className="flex space-x-4 mb-3">
    <div className="w-1/2">
      <label className="block text-gray-700 mb-1">Paid Amount</label>
      <input
        type="text"
        value={(paidAmount)}
        onChange={handleChange}
        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        placeholder="0"
      />
    </div>
      <div className="w-1/2">
        <label className="block text-gray-700 mb-1">Balance Amount</label>
        <input
  type="text"
  value={((Number(totalBillAmount) - Number(paidAmount) - Number(discount)) || 0).toFixed(2)}
  onChange={(e) => setBalanceAmount(e.target.value)}
  className={`w-full px-2 py-1 border border-gray-300 rounded-md ${
    (Number(totalBillAmount) - Number(paidAmount)) < 0 ? 'text-red-500' : 'text-green-800'
  } focus:outline-none focus:ring-2 font-semibold focus:ring-emerald-500`}
  placeholder="0"
/>

      </div>
    </div>
    <div className='w-full'>
    {paidAmount && (
        <p className="text-sm text-gray-800 mt-2">
          Amount in words:<span className='text-green-800 text-sm uppercase font-semibold'> {toWords(parseInt(paidAmount))}</span> 
        </p>
      )}
    </div>
    <div className="absolute top-20 right-0 w-58 max-w-xs">
      <input
        type="text"
        placeholder="Enter discount"
        value={discount}
        onChange={handleChange1}
        className="w-full py-2 px-4 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-bl-md">
      discount
      </span>
    </div>
    <button
      type="submit" 
      className="w-full bg-emerald-700 text-white py-2 mt-5 rounded-md hover:bg-emerald-800 transition duration-200"
    >
      {id ? 'Update Payment' : 'Add Payment'}
    </button>
  </form>
</div>

      </div>
    </div>
  )
}
