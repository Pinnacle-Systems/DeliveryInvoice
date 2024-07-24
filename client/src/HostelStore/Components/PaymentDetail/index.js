import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PaymentType } from '../../../Utils/DropdownData';
import {
  useGetPayOutQuery,
  useGetPayOutByIdQuery,
  useAddPayOutMutation,
  useUpdatePayOutMutation,
  useDeletePayOutMutation,
} from "../../../redux/services/PayOut.Services";
import { getCommonParams } from "../../../Utils/helper";
import { useGetPartyQuery } from '../../../redux/services/PartyMasterService';
import {
  DropdownInput,
} from "../../../Inputs";
import { dropDownListObject } from "../../../Utils/contructObject";

const PaymentForm = () => {
  const [readOnly, setReadOnly] = useState(false);

  const [transactionNo, setTransactionNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [totalBillAmount, setTotalBillAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [paymentType, setPaymentType] = useState(PaymentType[0].value);
  const [searchValue, setSearchValue] = useState("");
  const { branchId, companyId, finYearId, userId } = getCommonParams();
  const [id, setId] = useState("");
  const [docId, setDocId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const childRecord = useRef(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { transactionNo, expiryDate, cvv, totalBillAmount, paidAmount, balanceAmount, paymentType, docId };
    if (id) {
      await updateData({ id, ...payload });
    } else {
      await addData(payload);
    }
    setTransactionNo('');
    setExpiryDate('');
    setCvv('');
    setTotalBillAmount('');
    setPaidAmount('');
    setBalanceAmount('');
    setPaymentType(PaymentType[0].value);
    setId('');
    setDocId('');
  };

  const params = { branchId, companyId, finYearId };

  const { data: allData, isLoading, isFetching } = useGetPayOutQuery({
    params,
    searchParams: searchValue,
    finYearId,
  });

  const getNextDocId = useCallback(() => {
    if (id || isFetching || isLoading) return;
    if (allData?.nextDocId) {
      setDocId(allData.nextDocId);
    }
  }, [allData, isLoading, isFetching, id]);
  console.log(docId, "docId");

  useEffect(getNextDocId, [getNextDocId]);
  console.log(paymentType, "paymentType");

  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetPayOutByIdQuery({ id }, { skip: !id });
  const { data: supplierList } = useGetPartyQuery({ params });
  const supplierData = supplierList?.data ? supplierList.data : [];

  const [addData] = useAddPayOutMutation();
  const [updateData] = useUpdatePayOutMutation();
  const [removeData] = useDeletePayOutMutation();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-emerald-700">
          Payment Form
        </h2>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Transaction No</label>
          <input
            type="text"
            value={docId}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-emerald-600 text-sm"
            readOnly
          />
        </div>
        <div className="mb-6">
          <label htmlFor="paymentType" className="block text-gray-700 mb-2">
            Payment Type
          </label>
          <select
            id="paymentType"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="w-full px-4 p-1 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {PaymentType.map((type) => (
              <option key={type.value} value={type.value}>
                {type.show}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <DropdownInput
            name="Customer"
            options={dropDownListObject(
              id
                ? supplierData
                : paymentType === "PURCHSEBILL"
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
        <div className="flex space-x-4 mb-6">
          <div className="w-1/2">
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Select Date"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 mb-2">Total Bill Amount</label>
            <input
              type="text"
              value={totalBillAmount}
              onChange={(e) => setTotalBillAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="123"
            />
          </div>
        </div>
        <div className="flex space-x-4 mb-6">
          <div className="w-1/2">
            <label className="block text-gray-700 mb-2">Paid Amount</label>
            <input
              type="text"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="123"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 mb-2">Balance Amount</label>
            <input
              type="text"
              value={balanceAmount}
              onChange={(e) => setBalanceAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="123"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-700 text-white py-3 rounded-md hover:bg-emerald-800 transition duration-200"
        >
          {id ? 'Update Payment' : 'Add Payment'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
