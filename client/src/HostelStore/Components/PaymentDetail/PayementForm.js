import { useCallback, useEffect, useRef, useState } from "react";
import FormHeader from "../../../Basic/components/FormHeader"
import { getCommonParams, getDateFromDateTime } from "../../../Utils/helper";
import { paymentModes, PaymentType } from "../../../Utils/DropdownData";
import { useDispatch } from "react-redux";
import { useAddPaymentMutation, useDeletePaymentMutation, useGetPaymentByIdQuery, useGetPaymentQuery, useUpdatePaymentMutation } from "../../../redux/services/PaymentService";
import { useGetPartyByIdQuery, useGetPartyQuery } from "../../../redux/services/PartyMasterService";
import moment from "moment";
import { toast } from "react-toastify";
import { DropdownInputNew } from "../../../Inputs";
import { dropDownListObject } from "../../../Utils/contructObject";
import { toWords } from "number-to-words";
import { HiOutlineRefresh } from "react-icons/hi";
import { FiEdit2, FiPrinter, FiSave } from "react-icons/fi";
import { FaFileAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const PaymentForm = ({ id, setId, onClose }) => {


    const today = new Date().toISOString().split('T')[0];

    const { branchId, companyId, finYearId, userId } = getCommonParams();

    const [form, setForm] = useState(true);
    const [date, setDate] = useState(getDateFromDateTime(today));
    const [docId, setDocId] = useState("");
    const [formReport, setFormReport] = useState(false)
    const [readOnly, setReadOnly] = useState(false);
    const [cvv, setCvv] = useState(today);
    const [paymentMode, setPaymentMode] = useState('');
    const [paymentRefNo, setPaymentRefNo] = useState('');
    const [partyId, setPartyId] = useState("");
    const [paymentType, setPaymentType] = useState("INVOICE");
    const [paidAmount, setPaidAmount] = useState('');
    const [discount, setDiscount] = useState('')
    const [balanceAmount, setBalanceAmount] = useState('');
    const [totalBillAmount, setTotalBillAmount] = useState('');
    const [totalPayAmount, setTotalPayAmount] = useState('')
    const [purchaseOrderForm, setPurchaseOrderForm] = useState("")

    const [searchValue, setSearchValue] = useState("");
    const [supplierId, setSupplierId] = useState("");

    const childRecord = useRef(0);


    const dispatch = useDispatch()
    // const { data: allData, isLoading, isFetching } = useGetPaymentQuery({ params: { branchId, finYearId }, searchParams: searchValue });

    // const getNextDocId = useCallback(() => {

    //     if (id || isLoading || isFetching) return
    //     if (allData?.nextDocId) {
    //         setDocId(allData.nextDocId)
    //     }
    // }, [allData, isLoading, isFetching, id])

    // useEffect(getNextDocId, [getNextDocId])


    const { data: singleData } = useGetPaymentByIdQuery(id, { skip: !id });
    const {
        data: PartyData,
        isFetching: isSingleFetching,
        isLoading: isSingleLoading,
    } = useGetPartyByIdQuery(supplierId, { skip: !supplierId });

    console.log(PartyData, "partyData")

    const syncFormWithDb = useCallback(
        (data) => {
            // if (id) setReadOnly(true);
            // else setReadOnly(false);
            setDocId(data?.docId ? data?.docId : "New");
            if (data?.createdAt) setDate(moment.utc(data?.createdAt).format("YYYY-MM-DD"));
            setPaidAmount(data?.paidAmount || '');
            setDiscount(data?.discount || 0)
            setSupplierId(data?.partyId || '')
            setPaymentMode(data?.paymentMode || '');
            setPaymentType(data?.paymentType || 'INVOICE')
            setPaymentRefNo(data?.paymentRefNo || '');
            setTotalPayAmount(PartyData?.data?.soa ? data?.totalPaymentPurchaseBill : data?.totalPaymentSalesBill)
            setPartyId(data?.partyId || '');
            setTotalBillAmount(data?.totalBillAmount || '')
            setCvv(data?.cvv  ?moment.utc(data?.cvv).format("YYYY-MM-DD") : "")
            childRecord.current = data?.childRecord ? data?.childRecord : 0;
            
        }, [id])


    useEffect(() => {
        syncFormWithDb(singleData?.data);
    }, [syncFormWithDb, singleData])


    useEffect(() => {
        if (!id) {


            setTotalBillAmount(PartyData?.data?.coa + PartyData?.data?.totaloutstanding - PartyData?.data?.totalPaymentAgainstInvoice);
        }
    }, [paymentType, PartyData]);

    const [addData] = useAddPaymentMutation();
    const [updateData] = useUpdatePaymentMutation();
    const [removeData] = useDeletePaymentMutation();



    const data = {
        id,
        branchId,
        paymentMode,
        cvv,
        paidAmount,
        paymentRefNo,
        discount,
        supplierId,
        paymentType,
        finYearId,
        userId,
        totalBillAmount,
        totalAmount: parseFloat(paidAmount) + parseFloat(discount)

    }
    const validateData = (data) => {
        return data?.supplierId && data?.paidAmount && data?.paymentType && data?.paymentMode
    }

    const handleSubmitCustom = async (callback, data, text, nextProcess) => {
        try {
            let returnData = await callback(data).unwrap();
            if (returnData.statusCode === 0) {
                setId("")
                syncFormWithDb(undefined)
                Swal.fire({
                    icon: 'success',
                    title: `${text || 'Saved'} Successfully`,
                    // showConfirmButton: false,
                    // timer: 2000
                });

                if (returnData.statusCode === 0) {
                    if (nextProcess === "new") {
                        onNew()
                        syncFormWithDb(undefined)
                        setReadOnly(false);

                    }
                    if (nextProcess === "close") {
                        onClose()
                    }
                }
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
    const saveData = (nextProcess) => {
        if (!validateData(data)) {
            Swal.fire({
                title: "Please fill all required fields...!",
                icon: "error",

            }); return
        }
        if (data?.amount < 0) {
            // toast.info("Amount Cannot be Negative...!!!", { position: "top-center" })
            Swal.fire({
                title: "Amount Cannot be Negative...!!!",
                icon: "error",

            });
            return
        }
        if (!window.confirm("Are you sure save the details ...?")) {
            return
        }
        if (id) {
            handleSubmitCustom(updateData, data, "Updated", nextProcess)
        } else {
            handleSubmitCustom(addData, data, "Added", nextProcess)
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
    const handleChange1 = (e) => {
        const value = e.target.value;
        setDiscount(value)

    }
    const inputRef = useRef(null);
    const customerRef = useRef(null)
    const customerDate = useRef(null)

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <>


            <div onKeyDown={handleKeyDown} className='md:items-start md:justify-items-center grid  '>

                <div className='flex flex-col  w-full '>
                    {/* <FormHeader
                        onNew={onNew}
                        // model={MODEL}
                        openReport={() => setFormReport(true)}
                        saveData={saveData}
                        setReadOnly={setReadOnly}
                        deleteData={deleteData}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                    /> */}
                    <div className="w-full  mx-auto rounded-md shadow-lg px-2 overflow-y-auto">
                        <div className="flex justify-between items-center mb-1">
                            <h1 className="text-2xl font-bold text-gray-800">Payment</h1>
                            <button
                                onClick={() => {
                                    // onNew()
                                    onClose()
                                    //   RequirementRefetch()
                                }
                                }
                                className="text-indigo-600 hover:text-indigo-700"
                                title="Open Report"
                            >
                                <FaFileAlt className="w-5 h-5" />
                            </button>
                        </div>

                    </div>

                    <div className="flex justify-center mt-0">
                        <div
                            onSubmit={saveData}
                            className="bg-white p-5 rounded-xl shadow-lg w-full max-w-lg mx-auto mt-2"
                        >
                            {/* <h2 className="text-4xl font-extrabold mb-6 text-center text-emerald-700">
                                Payment Form
                            </h2> */}
                            <div className="grid grid-cols-2 items-center justify-center gap-6">
                                <div className="mb-2">
                                    <label className="block text-gray-600  font-medium mb-1">Payment  No</label>
                                    <input
                                        type="text"
                                        value={docId}
                                        className="w-full px-3 py-1 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                                        readOnly
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="paymentType" className="block text-gray-600 font-medium mb-1">
                                        Payment Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        // id="paymentType"
                                        value={paymentType}
                                        onChange={(e) => setPaymentType(e.target.value)}
                                        className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-emerald-500"
                                    >
                                        <option value="" disabled>Select a payment type</option>
                                        {PaymentType.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.show}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="mb-2">
                                    <label htmlFor="paymentType" className="block text-gray-600 font-medium ">
                                        Customer <span className="text-red-500">*</span>
                                    </label>
                                    <DropdownInputNew
                                        // name="Customer"
                                        ref={inputRef}

                                        className="block text-gray-600 font-medium mb-2"
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
                                        required
                                        readOnly={readOnly}
                                        disabled={childRecord.current > 0}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="paymentType" className="block text-gray-600 font-medium ">
                                        Payment Mode <span className="text-red-500">*</span>
                                    </label>
                                    <DropdownInputNew

                                        // name="Payment Mode"
                                        className="text-sm"
                                        options={paymentModes}
                                        value={paymentMode}
                                        setValue={setPaymentMode}
                                        required
                                        readOnly={readOnly}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-3">
                                <div>
                                    <label className="block text-gray-600 font-medium mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        className="w-full px-3  border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500"
                                        placeholder="Select Date"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 font-medium mb-2">Outstanding Amount</label>
                                    <input
                                        type="text"
                                        // value={id 
                                        //   ? Number(totalBillAmount) - Number(PartyData?.data?.totalDiscount || 0)
                                        //   : (Number(totalBillAmount || 0) - Number(PartyData?.data?.totalDiscount || 0))
                                        // }
                                        value={(Number(totalBillAmount || 0) - Number(PartyData?.data?.totalDiscount || 0)).toFixed(3)}
                                        onChange={(e) => setTotalBillAmount(e.target.value)}
                                        className="w-full px-3 py-1 border border-gray-300 text-red-500 font-semibold rounded-lg focus:outline-none focus:ring-emerald-500"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-3">

                                <div>
                                    <label className="block text-gray-600 font-medium mb-2">Reference No</label>
                                    <input
                                        type="text"
                                        onChange={(e) => setPaymentRefNo(e.target.value)}
                                        value={paymentRefNo}
                                        className="w-full px-3 py-1 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-emerald-500"
                                        placeholder="Reference No"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 font-medium mb-2">Paid Amount<span className="text-red-500">*</span> </label>
                                    <input
                                        type="text"
                                        value={paidAmount}
                                        onChange={handleChange}
                                        className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 mb-5">

                                <div>
                                    <label className="block text-gray-600 font-medium mb-2">Balance Amount</label>
                                    <input
                                        type="text"
                                        // value={id? Number(totalBillAmount)-Number(PartyData?.data?.totalDiscount)-Number(paidAmount):((Number(totalBillAmount) - Number(paidAmount) - Number(discount)- (Number(PartyData?.data?.totalDiscount) || 0)) || 0).toFixed(2)}
                                        value={((Number(totalBillAmount) - Number(paidAmount) - Number(discount) - (Number(PartyData?.data?.totalDiscount) || 0)) || 0).toFixed(3)}
                                        onChange={(e) => setBalanceAmount(e.target.value)}
                                        className={`w-full px-3 py-1 border border-gray-300 rounded-lg ${(Number(totalBillAmount) - Number(paidAmount)) < 0 ? 'text-red-500' : 'text-green-800'
                                            } focus:outline-none focus:ring-emerald-500 font-semibold`}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* {paidAmount && ( */}
                            <div className="mb-5">
                                <p className="text-sm text-gray-700">
                                    Amount in words: <span className="text-green-700 font-semibold">{toWords(parseInt(paidAmount ? paidAmount : 0))}</span>
                                </p>
                            </div>
                            {/* )} */}

                            <div className="absolute top-40 right-0 w-58 max-w-xs">
                                <input
                                    type="text"
                                    placeholder="Enter discount"
                                    value={discount}
                                    onChange={handleChange1}
                                    onFocus={(e) => e.target.select()}
                                    className="w-full py-2 px-4 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-bl-md">
                                    Discount Amount
                                </span>
                            </div>


                        </div>

                    </div>

                    <div className="flex flex-col md:flex-row gap-2 justify-between mt-4">
                        {/* Left Buttons */}
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={() => saveData("close")} className="bg-indigo-500 text-white px-4 py-1 rounded-md hover:bg-indigo-600 flex items-center text-sm">
                                <HiOutlineRefresh className="w-4 h-4 mr-2" />
                                Save & Close
                            </button>
                            <button onClick={() => saveData("new")} className="bg-indigo-500 text-white px-4 py-1 rounded-md hover:bg-indigo-600 flex items-center text-sm">
                                <FiSave className="w-4 h-4 mr-2" />
                                Save & New
                            </button>

                            {/* <button onClick={() => saveData("draft")} className="bg-indigo-500 text-white px-4 py-1 rounded-md hover:bg-indigo-600 flex items-center text-sm">
                            <HiOutlineRefresh className="w-4 h-4 mr-2" />
                            Draft Save
                        </button> */}
                        </div>

                        {/* Right Buttons */}
                        <div className="flex gap-2 flex-wrap">
                            {/* <button className="bg-emerald-600 text-white px-4 py-1 rounded-md hover:bg-emerald-700 flex items-center text-sm">
                                                               <FiShare2 className="w-4 h-4 mr-2" />
                                                               Email
                                                           </button> */}
                            <button className="bg-yellow-600 text-white px-4 py-1 rounded-md hover:bg-yellow-700 flex items-center text-sm"
                                onClick={() => setReadOnly(false)}
                            >
                                <FiEdit2 className="w-4 h-4 mr-2" />
                                Edit
                            </button>
                            {/* <button className="bg-emerald-600 text-white px-4 py-1 rounded-md hover:bg-emerald-700 flex items-center text-sm"
                          onClick={() => {
                            setPrintModalOpen(true)
                          }}
                        >
                          <FaEye className="w-4 h-4 mr-2" />
                          Preview
                        </button> */}
                            {/* <button className="bg-slate-600 text-white px-4 py-1 rounded-md hover:bg-slate-700 flex items-center text-sm"
                                onClick={() => {
                                    // handlePrint()
                                    // setPrintModalOpen(true)
                                }}
                            >
                                <FiPrinter className="w-4 h-4 mr-2" />
                                Invoice
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentForm