import { FaFileAlt } from "react-icons/fa"
import { DateInputNew, DropdownInput, DropdownInputNew, ReusableInput, ReusableInputNew, ReusableSearchableInput, ReusableSearchableInputNew, ReusableSearchableInputNewCustomer, TextArea, TextAreaNew, TextInput, TextInputNew, TextInputNew1 } from "../../../Inputs";
import { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import { findFromList, isGridDatasValid } from "../../../Utils/helper";
import { deliveryTypes } from "../../../Utils/DropdownData";
import { toast } from "react-toastify";
import { FiEdit2, FiPrinter, FiSave } from "react-icons/fi";
import { HiOutlineRefresh } from "react-icons/hi";
import { dropDownListObject } from "../../../Utils/contructObject";
import DeliveryItems from "./DeliveryItems";
import { useGetStyleMasterQuery } from "../../../redux/services/StyleMasterService";
import { useGetStyleItemMasterQuery } from "../../../redux/services/StyleItemMasterService";
import { useGetUomQuery } from "../../../redux/services/UomMasterService";
import { useAddDeliveryChallanMutation, useGetDeliveryChallanByIdQuery, useUpdateDeliveryChallanMutation } from "../../../redux/services/DeliveryChallanService";
import Swal from "sweetalert2";
import { useGetPartyByIdQuery } from "../../../redux/services/PartyMasterService";
import { useGetColorMasterQuery } from "../../../redux/services/ColorMasterService";
import Modal from "../../../UiComponents/Modal";
import { PDFViewer } from "@react-pdf/renderer";
import tw from "../../../Utils/tailwind-react-pdf";
import DeliveryChallanPrint from "./PrintFormat-PO";
import { useGetBranchByIdQuery } from "../../../redux/services/BranchMasterService";
import { useGetHsnMasterQuery } from "../../../redux/services/HsnMasterServices";
import PopUp from "./Pop";

const ChallanForm = ({
    onClose, id, setId, readOnly, setReadOnly, docId, setDocId, poItems, setPoItems, setTempPoItems, onNew, taxTypeList, supplierList, params, termsData, branchList, hsnData,
}) => {

    const today = new Date()

    const [date, setDate] = useState(moment.utc(today).format('YYYY-MM-DD'));
    const [taxTemplateId, setTaxTemplateId] = useState("");
    const [payTermId, setPayTermId] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [poType, setPoType] = useState("Order Purchase");
    const [poMaterial, setPoMaterial] = useState("DyedYarn")
    const [supplierId, setSupplierId] = useState("");
    const [term, setTerm] = useState("")

    const [discountType, setDiscountType] = useState("");
    const [discountValue, setDiscountValue] = useState(0);
    const [orderId, setOrderId] = useState("")
    const [remarks, setRemarks] = useState("")
    const [PurchaseType, setPurchaseType] = useState('General Purchase')


    const [deliveryType, setDeliveryType] = useState("")
    const [deliveryTo, setDeliveryTo] = useState("")
    const [showExtraCharge, setShowExtraCharge] = useState(false)
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [tableDataView, setTableDataView] = useState(false)
    const [deliveryItems, setDeliveryItems] = useState([])
    const [dcNo, setDcNo] = useState("");
    const [dcDate, setDcDate] = useState()
    const allSuppliers = supplierList ? supplierList.data : []
    const [vehicleNo, setVechileNo] = useState("");
    const [isPrintOpen, setIsPrintOpen] = useState(false)
    const [nextprocess, setNextProcess] = useState("")


    const { branchId, finYearId, companyId } = params;


    const { data: styleList } = useGetStyleMasterQuery({ params: { ...params } });
    const { data: styleItemList } = useGetStyleItemMasterQuery({ params: { ...params } });
    const { data: uomList } = useGetUomQuery({ params: { ...params } });
    const { data: colorList } = useGetColorMasterQuery({ params: { ...params } });
    const { data: hsnList } = useGetHsnMasterQuery({ params: { ...params } });

    const { data: supplierDetails } =
        useGetPartyByIdQuery(supplierId, { skip: !supplierId });


    const [addData] = useAddDeliveryChallanMutation();
    const [updateData] = useUpdateDeliveryChallanMutation();



    const {
        data: singleData,
        isFetching: isSingleFetching,
        isLoading: isSingleLoading,
    } = useGetDeliveryChallanByIdQuery(id, { skip: !id });


    const { data: branchdata } = useGetBranchByIdQuery(branchId, { skip: !branchId });


    const syncFormWithDb = useCallback((data) => {




        setDate(data?.createdAt
            ? moment.utc(data.createdAt).format("YYYY-MM-DD")
            : moment.utc(new Date()).format("YYYY-MM-DD")
        );
        setDocId(data?.docId ? data?.docId : "New");

        setSupplierId(data?.supplierId || "");
        setDeliveryItems(
            (data?.DeliveryChallanItems || []).map(i => ({
                ...i,
                qty: i.qty ? parseFloat(i.qty).toFixed(3) : "",
                noOfBox: i.noOfBox ? parseFloat(i.noOfBox).toFixed(3) : ""
            }))
        );
        setDcNo(data?.dcNo ? data?.dcNo : "")

        setDcDate(data?.dcDate
            ? moment.utc(data.dcDate).format("YYYY-MM-DD")
            : undefined
        );

        setDueDate(data?.dueDate
            ? moment.utc(data.dueDate).format("YYYY-MM-DD")
            : ""
        );
        setDeliveryType(data?.deliveryType || "");
        setDeliveryTo(
            data?.deliveryTo ? data?.deliveryTo : ""
        );
        setRemarks(data?.remarks || "");
        setVechileNo(data?.vechineNo ? data?.vechineNo : "")
    }, [id]);




    useEffect(() => {
        if (id && singleData?.data) {
            syncFormWithDb(singleData.data);
        }

    }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);




    console.log(id, "id")


    const handleSubmitCustom = async (callback, data, text, nextProcess) => {
        try {
            let returnData;
            if (text === "Updated") {
                returnData = await callback(data).unwrap();
            } else {
                returnData = await callback(data).unwrap();
            }
            if (returnData.statusCode === 1) {
                toast.error(returnData.message);
            } else {
                Swal.fire({
                    icon: 'success',
                    title: `${text || 'Saved'} Successfully`,
                    showConfirmButton: false,
                    timer: 2000
                });
                console.log(returnData?.data,"returnData")
                setId(returnData?.data?.id)
                setIsPrintOpen(true)
                // if (nextProcess == "new") {
                //     syncFormWithDb(undefined);
                //     onNew()
                // }
                // if (nextProcess == "close") {
                //     syncFormWithDb(undefined);
                // }
          


            }
        } catch (error) {
            console.log("handle");
        }
    };



    let data = {

        supplierId, deliveryType, deliveryTo, branchId, finYearId, companyId, dcNo, dcDate,
        id,
        remarks,
        deliveryItems: deliveryItems?.filter(po => po.styleId), vehicleNo,


    }
    console.log(data, "data")


    const validateData = (data) => {
        let mandatoryFields = ["styleId", "styleItemId", "uomId", "qty"];





        return data.supplierId

            && isGridDatasValid(data?.deliveryItems, false, mandatoryFields)
            && data?.deliveryItems?.length !== 0



    }

    const saveData = (nextProcess) => {
        setNextProcess(nextProcess)
        if (!validateData(data)) {
            // Swal.fire({
            //     // title: "Total percentage exceeds 100%",
            //     title: "Please fill all required fields...!",

            // }); 
            Swal.fire({
                icon: 'success',
                title: `Please fill all required fields...!`,
                // showConfirmButton: false,
                // timer: 2000
            });
            return
        }
        if (!window.confirm("Are you sure save the details ...?")) {
            return
        }
        if (nextProcess == "draft" && !id) {
            console.log(nextProcess, "nextProcess")

            handleSubmitCustom(addData, data = { ...data, draftSave: true }, "Added", nextProcess);
        }


        else if (id && nextProcess == "draft") {

            handleSubmitCustom(updateData, data = { ...data, draftSave: true }, "Updated", nextProcess);
        }
        else if (id) {

            handleSubmitCustom(updateData, data, "Updated", nextProcess);
        } else {
            handleSubmitCustom(addData, data, "Added", nextProcess);
        }
    }


    const inputRef = useRef(null);
    const customerRef = useRef(null)
    const customerDate = useRef(null)

    useEffect(() => {
        if (id) return;
        inputRef.current?.focus();
    }, []);

    return (
        <>
            <Modal
                isOpen={isPrintOpen}
                // onClose={() => setIsPrintOpen(false)}
                widthClass={"px-2 h-[25%] w-[40%]"} >

                <PopUp setIsPrintOpen={setIsPrintOpen} onClose={() => setIsPrintOpen(false)} setPrintModalOpen={setPrintModalOpen}
                    nextprocess={nextprocess} formclose={onClose} syncFormWithDb={syncFormWithDb}  onNew={onNew}
                    id={id} />
            </Modal>
            <Modal
                isOpen={printModalOpen}
                onClose={() => {
                    setPrintModalOpen(false)
                    console.log(nextprocess,"nextprocess")
                    if (nextprocess == "close") {
                        onClose()
                    }
                    else if(nextprocess == "new"){
                        syncFormWithDb(undefined)
                    }
                }}
                widthClass={"w-[90%] h-[90%]"}
            >
                <PDFViewer style={tw("w-full h-full")}>
                    <DeliveryChallanPrint
                        tax={findFromList(taxTemplateId, taxTypeList?.data, "name")}
                        branchData={branchdata?.data}
                        data={id ? singleData?.data : "Null"}
                        singleData={id ? singleData?.data : "Null"}
                        date={id ? singleData?.data?.createdAt : date}
                        docId={docId ? docId : ""}
                        remarks={remarks}
                        discountType={discountType}
                        poType={poType}
                        discountValue={discountValue}
                        // ref={componentRef}
                        poNumber={docId} poDate={date} payTermId={payTermId}
                        deliveryItems={deliveryItems}
                        supplierDetails={supplierDetails ? supplierDetails?.data : null}
                        deliveryType={deliveryType}
                        deliveryToId={deliveryTo}
                        taxTemplateId={taxTemplateId}
                        // yarnList={yarnList}
                        uomList={uomList} colorList={colorList}
                        // taxDetails={taxDetails}
                        // deliveryTo={deliveryTo}
                        // taxGroupWise={taxGroupWise}
                        // transportMode={transportMode}
                        // transporter={transporter}
                        // vehicleNo={vehicleNo}
                        termsData={termsData}
                        term={term}
                        totalQty={
                            deliveryItems?.reduce((sum, next) => {
                                return sum + (Number(next?.qty) || 0);
                            }, 0)
                        }
                    // invoiceItems={invoiceItems}
                    // termsAndCondition={termsAndCondition}
                    // payTermList={payTermList}

                    />
                </PDFViewer>
            </Modal>
            <div className="w-full  mx-auto rounded-md shadow-lg px-2 mt-1 overflow-y-auto bg-white">
                <div className="flex justify-between items-center mb-1 ">
                    <h1 className="text-2xl font-bold text-gray-800  ">Delivery Challan</h1>
                    <button
                        onClick={() => {
                            onClose()
                        }
                        }
                        className="text-indigo-600 hover:text-indigo-700"
                        title="Open Report"
                    >
                        <FaFileAlt className="w-5 h-5" />
                    </button>
                </div>

            </div>
            <div className="space-y-3  py-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">



                    <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-1">
                        <h2 className="font-medium text-slate-700 mb-2">
                            Basic Details
                        </h2>
                        <div className="grid grid-cols-2 gap-1">
                            <ReusableInputNew label="Delivery Challan No" readOnly value={docId} />
                            <ReusableInputNew label="Delivery Challan Date" value={date} type={"date"} required={true} readOnly={true} disabled={readOnly} />



                        </div>

                    </div>

                    <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-3">
                        <h2 className="font-medium text-slate-700 mb-2">
                            Delivery Challan Details
                        </h2>
                        <div className="grid grid-cols-5 gap-2">


                            <div className="col-span-2"

                            >

                                <ReusableSearchableInputNewCustomer
                                    label="Customer Name"
                                    component="PartyMaster"
                                    placeholder="Search Customer Name"
                                    optionList={allSuppliers}
                                    setSearchTerm={(value) => { setSupplierId(value) }}
                                    searchTerm={supplierId}
                                    show={"isCustomer"}
                                    required={true}
                                    disabled={readOnly}
                                    ref={inputRef}
                                    nextRef={customerRef}
                                    id={id}
                                />




                            </div>

                            <div className="col-span-2">
                                <TextInputNew
                                    name="Contact Person Name"
                                    placeholder="Contact name"
                                    value={findFromList(supplierId, supplierList?.data, "contactPersonName")}
                                    disabled={true}
                                />
                            </div>


                            <div>
                                <TextInputNew
                                    name="Contact Number"
                                    placeholder="Contact name"
                                    value={findFromList(supplierId, supplierList?.data, "contactNumber")}

                                    disabled={true}


                                />

                            </div>

                            <div className="col-span-2">
                                <TextAreaNew
                                    name="Address"
                                    placeholder="Addres"
                                    value={findFromList(supplierId, supplierList?.data, "address")}
                                />
                            </div>

                            <div className="col-span-1">
                                <TextInputNew name="Customer Dc No"
                                    value={dcNo} setValue={setDcNo} readOnly={readOnly}
                                    ref={customerRef} nextRef={customerDate}
                                />

                            </div>



                            <div className="col-span-1">
                                <DateInputNew
                                    name="Customer Dc Date"
                                    value={dcDate}
                                    setValue={setDcDate}
                                    type={"date"}
                                    // required={true}
                                    // ref={dateRef}
                                    // nextRef={inputPartyRef}

                                    readOnly={readOnly}
                                />
                            </div>


                        </div>

                    </div>









                </div>
                <fieldset className=''>

                    <DeliveryItems deliveryItems={deliveryItems} setDeliveryItems={setDeliveryItems} styleList={styleList}
                        styleItemList={styleItemList} uomList={uomList} colorList={colorList} readOnly={readOnly} setReadOnly={setReadOnly}
                        hsnList={hsnList} id={id}
                    />

                </fieldset>






                <div className="grid grid-cols-5 gap-3">


                    <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm  col-span-2">

                        <h2 className="font-medium text-slate-700 mb-2 text-base">Delivery Details</h2>
                        <div className="grid grid-cols-4 gap-2">
                            <TextInputNew1 name="Vehicle No"
                                value={vehicleNo} setValue={setVechileNo} readOnly={readOnly} />


                            <div className="col-span-2">
                                <DropdownInputNew name="Delivery To" options={dropDownListObject(supplierList?.data?.filter(val => val.isCustomer), "name", "id")} value={deliveryTo} setValue={setDeliveryTo} readOnly={readOnly} />

                            </div>

                        </div>


                    </div>

                    <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-2">
                        <h2 className="font-medium text-slate-700 mb-2 text-base">Remarks</h2>
                        <textarea
                            readOnly={readOnly}
                            value={remarks}
                            onChange={(e) => {
                                setRemarks(e.target.value)
                            }}
                            className="w-full h-20 overflow-auto px-2.5 py-2 text-xs border border-slate-300 rounded-md  focus:ring-1 focus:ring-indigo-200 focus:border-indigo-500"
                            placeholder="Additional notes..."
                        />
                    </div>

                    <div className="border border-slate-200  bg-white rounded-md shadow-sm flex justify-between p-5">
                        <h2 className="font-medium text-slate-700 mb-2 text-base">
                            Total Qty
                        </h2>

                        <span className="text-md font-semibold text-slate-800 ">
                            {deliveryItems?.reduce((sum, next) => {
                                return sum + (Number(next?.qty) || 0);
                            }, 0).toFixed(3)} PCS
                        </span>
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
                        <button className="bg-slate-600 text-white px-4 py-1 rounded-md hover:bg-slate-700 flex items-center text-sm"
                            onClick={() => {
                                // handlePrint()
                                setPrintModalOpen(true)
                            }}
                        >
                            <FiPrinter className="w-4 h-4 mr-2" />
                            Print
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChallanForm;