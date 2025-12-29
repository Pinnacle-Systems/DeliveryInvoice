import React, { useEffect, useState, useRef, useCallback } from "react";

import secureLocalStorage from "react-secure-storage";
import {
    useGetPartyQuery,
    useGetPartyByIdQuery,
    useAddPartyMutation,
    useUpdatePartyMutation,
    useDeletePartyMutation,
} from "../../../redux/services/PartyMasterService";

import { useGetCityQuery } from "../../../redux/services/CityMasterService";

import FormHeader from "../../../Basic/components/FormHeader";
import FormReport from "../../../Basic/components/FormReportTemplate";
import { toast } from "react-toastify";
import { TextInput, DropdownInput, CheckBox, RadioButton, TextArea, DateInput, MultiSelectDropdown, ReusableTable, TextInputNew, DropdownInputNew, ToggleButton, TextAreaNew } from "../../../Inputs";
import ReportTemplate from "../../../Basic/components/ReportTemplate";
import { dropDownListObject, dropDownListMergedObject, multiSelectOption } from '../../../Utils/contructObject';
import moment from "moment";
import Modal from "../../../UiComponents/Modal";

import { Loader } from '../../../Basic/components';
import { useDispatch } from "react-redux";
import { findFromList } from "../../../Utils/helper";
import { Check, LayoutGrid, Paperclip, Plus, Power, Table } from "lucide-react";
import { statusDropdown } from "../../../Utils/DropdownData";
import ArtDesignReport from "./ArtDesignReport";
import Swal from "sweetalert2";


const MODEL = "Party Master";


export default function Form({ partyId }) {

    console.log(partyId, "[partyId")
    const [form, setForm] = useState(false);

    const [readOnly, setReadOnly] = useState(false);

    const [id, setId] = useState("");
    const [panNo, setPanNo] = useState("");
    const [name, setName] = useState("");
    const [aliasName, setAliasName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [tinNo, setTinNo] = useState("");
    const [cstNo, setCstNo] = useState("");
    const [cinNo, setCinNo] = useState("");
    const [faxNo, setFaxNo] = useState("");
    const [website, setWebsite] = useState("");
    const [code, setCode] = useState("");
    const [soa, setSoa] = useState("")
    const [coa, setCoa] = useState("")
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [contactPersonName, setContactPersonName] = useState("");
    const [gstNo, setGstNo] = useState("");
    const [costCode, setCostCode] = useState("");
    const [contactMobile, setContactMobile] = useState('');
    const [cstDate, setCstDate] = useState("");
    const [email, setEmail] = useState("");
    const [isSupplier, setIsSupplier] = useState(false);
    const [isCustomer, setIsCustomer] = useState(true);
    const [active, setActive] = useState(true);
    const [view, setView] = useState("all");
    const [isClient, setClient] = useState();
    const [partyCode, setPartyCode] = useState("");
    const [landMark, setlandMark] = useState("");
    const [country, setCountry] = useState('')
    const [contact, setContact] = useState('')
    const [designation, setDesignation] = useState('')
    const [department, setDepartment] = useState('')
    const [contactPersonEmail, setContactPersonEmail] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [alterContactNumber, setAlterContactNumber] = useState('')
    const [bankname, setBankName] = useState('')
    const [bankBranchName, setBankBranchName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [ifscCode, setIfscCode] = useState('')
    const [formReport, setFormReport] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [reportName, setReportName] = useState("Customer/Supplier Name")
    const [searchValue, setSearchValue] = useState("");
    const [msmeNo, setMsmeNo] = useState("")


    const childRecord = useRef(0);
    const dispatch = useDispatch()


    const companyId = secureLocalStorage.getItem(
        sessionStorage.getItem("sessionId") + "userCompanyId"
    )

    const userId = secureLocalStorage.getItem(
        sessionStorage.getItem("sessionId") + "userId"
    )
    const params = {
        companyId
    };
    const { data: cityList, isLoading: cityLoading, isFetching: cityFetching } =
        useGetCityQuery({ params });



    const { data: allData, isLoading, isFetching } = useGetPartyQuery({ params, searchParams: searchValue });

    const {
        data: singleData,
        isFetching: isSingleFetching,
        isLoading: isSingleLoading,
    } = useGetPartyByIdQuery(id, { skip: !id });

    const [addData] = useAddPartyMutation();
    const [updateData] = useUpdatePartyMutation();
    const [removeData] = useDeletePartyMutation();

    const syncFormWithDb = useCallback((data) => {

        setPanNo(data?.panNo ? data?.panNo : "");
        setName(data?.name ? data?.name : "");

        setAliasName(data?.aliasName ? data?.aliasName : "");

        setDisplayName(data?.displayName ? data?.displayName : "");
        setAddress(data?.address ? data?.address : "");
        setTinNo(data?.tinNo ? data?.tinNo : "");
        setCstNo(data?.cstNo ? data?.cstNo : "");
        setCinNo(data?.cinNo ? data?.cinNo : "");
        setFaxNo(data?.faxNo ? data?.faxNo : "");
        setCinNo(data?.cinNo ? data?.cinNo : "");
        setCoa(data?.coa ? data?.coa : "");
        setSoa(data?.soa ? data?.soa : "")

        setContactPersonName(data?.contactPersonName ? data?.contactPersonName : "");
        setGstNo(data?.gstNo ? data?.gstNo : "");
        setCostCode(data?.costCode ? data?.costCode : "");
        setCstDate(data?.cstDate ? moment.utc(data?.cstDate).format('YYYY-MM-DD') : "");
        setCode(data?.code ? data?.code : "");
        setPincode(data?.pincode ? data?.pincode : "");
        setWebsite(data?.website ? data?.website : "");
        setEmail(data?.email ? data?.email : "");
        setCity(data?.cityId ? data?.cityId : "");
        setIsSupplier((data?.isSupplier ? data.isSupplier : false));
        setIsCustomer((data?.isCustomer ? data.isCustomer : true));
        setActive(id ? (data?.active ? data.active : false) : true);
        setContactMobile((data?.contactMobile ? data.contactMobile : ''));
        setlandMark(data?.landMark ? data?.landMark : '')
        setContact(data?.contact ? data?.contact : '')
        setDesignation(data?.designation ? data?.designation : "")
        setDepartment(data?.department ? data?.department : "")
        setContactPersonEmail(data?.contactPersonEmail ? data?.contactPersonEmail : "")
        setContactNumber(data?.contactNumber ? data?.contactNumber : "")
        setAlterContactNumber(data?.alterContactNumber ? data?.alterContactNumber : "")
        setBankName(data?.bankname ? data?.bankname : "")
        setBankBranchName(data?.bankBranchName ? data?.bankBranchName : "")
        setAccountNumber(data?.accountNumber ? data?.accountNumber : "")
        setIfscCode(data?.ifscCode ? data?.ifscCode : '')
        setAttachments(data?.attachments ? data?.attachments : [])




    }, [id]);

    useEffect(() => {
        syncFormWithDb(singleData?.data);
    }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

    const data = {
        name, isSupplier, isCustomer, code, aliasName, displayName, address, cityId: city, pincode, panNo, tinNo, cstNo, cstDate, cinNo,
        faxNo, email, website, contactPersonName, gstNo, costCode, contactMobile,
        active, companyId, coa: coa ? coa : "", soa,
        id, userId,
        landMark, contact, designation, department, contactPersonEmail, contactNumber, alterContactNumber, bankname,
        bankBranchName, accountNumber, ifscCode, attachments ,msmeNo
    }

    const validateData = (data) => {
        return data.name && data?.active && data?.address && data?.cityId && data?.pincode && (data?.isCustomer || data?.isSupplier)

    }

    console.log(data, "data")

    const handleSubmitCustom = async (callback, data, text) => {
        try {
            const formData = new FormData();
            for (let key in data) {

                console.log(key, "key")
                if (key == 'attachments') {
                    formData.append(key, JSON.stringify(data[key].map(i => ({ ...i, filePath: (i.filePath instanceof File) ? i.filePath.name : i.filePath }))));
                    data[key].forEach(option => {
                        if (option?.filePath instanceof File) {
                            formData.append('images', option.filePath);
                        }
                    });
                } else {
                    formData.append(key, data[key]);
                }
            }
            console.log(formData, "formData")

            let returnData;
            if (text === "Updated") {
                returnData = await callback({ id, body: formData }).unwrap();
            } else {
                returnData = await callback(formData).unwrap();
            }
            dispatch({
                type: `accessoryItemMaster/invalidateTags`,
                payload: ['AccessoryItemMaster'],
            });
            dispatch({
                type: `CityMaster/invalidateTags`,
                payload: ['City/State Name'],
            });
            dispatch({
                type: `CurrencyMaster/invalidateTags`,
                payload: ['Currency'],
            });
            setId("")
            syncFormWithDb(undefined)
            setForm(false)
            // if(returnData?.data)
            Swal.fire({
                title: text + "  " + "Successfully",
                icon: "success",

            });
        } catch (error) {
            console.log("handle");
        }
    };


    const countryNameRef = useRef(null);

    useEffect(() => {
        if (form && countryNameRef.current) {
            countryNameRef.current.focus();
        }
    }, [form]);
    const saveData = () => {


        if (!validateData(data)) {
            Swal.fire({
                title: 'Please fill all required fields...!',
                icon: 'error',
            });
            return
        }
        if (!window.confirm("Are you sure save the details ...?")) {
            return;
        }

        if (id) {
            handleSubmitCustom(updateData, data, "Updated");
        } else {
            handleSubmitCustom(addData, data, "Added");
        }
    }


    const deleteData = async (id) => {
        if (id) {
            if (!window.confirm("Are you sure to delete...?")) {
                return;
            }
            try {
                let deldata = await removeData(id).unwrap();
                console.log(deldata, "deldata")
                if (deldata?.statusCode == 1) {
                    Swal.fire({
                        icon: 'error',
                        // title: 'Submission error',
                        text: deldata?.message || 'Something went wrong!',
                    });
                    return;
                } dispatch({
                    type: `accessoryItemMaster/invalidateTags`,
                    payload: ['AccessoryItemMaster'],
                });
                setId("");
                dispatch({
                    type: `CityMaster/invalidateTags`,
                    payload: ['City/State Name'],
                });
                dispatch({
                    type: `CurrencyMaster/invalidateTags`,
                    payload: ['Currency'],
                });
                syncFormWithDb(undefined);
                Swal.fire({
                    title: "Deleted Successfully",
                    icon: "success",

                });
            } catch (error) {
                toast.error("something went wrong");
            }
        }
    };

    const handleKeyDown = (event) => {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if ((event.ctrlKey || event.metaKey) && charCode === "s") {
            event.preventDefault();
            saveData();
        }
    };

    const onNew = () => {
        setReadOnly(false);
        setForm(true);
        setSearchValue("");
        setId("");
        syncFormWithDb(undefined);
    };

    function onDataClick(id) {
        setId(id);
        setForm(true);
    }
    const tableHeaders = ["Name", "Alias Name"]
    const tableDataNames = ["dataObj.name", 'dataObj.aliasName']


    // if (!form)
    //     return (
    //         <ReportTemplate
    //             heading={MODEL}
    //             tableHeaders={tableHeaders}
    //             tableDataNames={tableDataNames}
    //             loading={
    //                 isLoading || isFetching
    //             }
    //             setForm={setForm}
    //             data={allData?.data}
    //             onClick={onDataClick}
    //             onNew={onNew}
    //             searchValue={searchValue}
    //             setSearchValue={setSearchValue}
    //         />
    //     );
    const handleView = (id) => {
        setId(id);
        setForm(true);
        setReadOnly(true);
        console.log("view");
    };
    const handleEdit = (id) => {
        setId(id);
        setForm(true);
        setReadOnly(false);
        console.log("Edit");
    };

    const ACTIVE = (
        <div className="bg-gradient-to-r from-green-200 to-green-500 inline-flex items-center justify-center rounded-full border-2 w-6 border-green-500 shadow-lg text-white hover:scale-110 transition-transform duration-300">
            <Power size={10} />
        </div>
    );
    const INACTIVE = (
        <div className="bg-gradient-to-r from-red-200 to-red-500 inline-flex items-center justify-center rounded-full border-2 w-6 border-red-500 shadow-lg text-white hover:scale-110 transition-transform duration-300">
            <Power size={10} />
        </div>
    );


    const columns = [
        {
            header: "S.No",
            accessor: (item, index) => index + 1,
            className: "font-medium text-gray-900 w-12  text-center",
        },



        {
            header: reportName,
            accessor: (item) => item?.name,
            //   cellClass: () => "font-medium text-gray-900",
            className: "font-medium text-gray-900 text-left uppercase w-72",
        },


        {
            header: "Status",
            accessor: (item) => (item.active ? ACTIVE : INACTIVE),
            //   cellClass: () => "font-medium text-gray-900",
            className: "font-medium text-gray-900 text-center uppercase w-16",
        },

    ];

    const handleChange = (type) => {

        setIsSupplier(type == 'supplier');
        setIsCustomer(type == "client")
    };

    if (!cityList || cityFetching || cityLoading) {
        return <Loader />
    }

    let filterParty;



    if (view == "Customer") {
        filterParty = allData?.data?.filter(item => item.isCustomer)
    }
    if (view === "Supplier") {
        filterParty = allData?.data?.filter(item => item.isSupplier)
    }
    if (view == "all") {
        filterParty = allData?.data
    }
    //   const { data: currencyList } = useGetCurrencyMasterQuery({ params });



    return (
        // <div
        //     onKeyDown={handleKeyDown}
        //     className="md:items-start md:justify-items-center grid h-full bg-theme"
        // >

        //     <div className="flex flex-col frame w-full h-full">
        //         <FormHeader
        //             onNew={onNew}
        //             onClose={() => {
        //                 setForm(false);
        //                 setSearchValue("");
        //             }}
        //             model={MODEL}
        //             saveData={saveData}
        //             setReadOnly={setReadOnly}
        //             deleteData={deleteData}

        //         />
        //         <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-x-2">
        //             <div className="col-span-3 grid md:grid-cols-2 border h-[520px] overflow-auto">
        //                 <div className='col-span-3 grid md:grid-cols-2 border'>
        //                     <div className='mr-1 md:ml-2'>

        //                         <fieldset className='frame my-1 flex'>
        //                             <legend className='sub-heading'>Official Details</legend>
        //                             <div className='flex flex-col justify-start gap-4 mt- flex-1'>
        //                                 <TextInput name="Party Code" type="text" value={code} setValue={setCode} readOnly={readOnly}  disabled={(childRecord.current > 0)} />
        //                                 <TextInput name="Party Name" type="text" value={name} 
        //                                 setValue={setName} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)}
        //                                   onBlur={(e) => {
        //                                       if(aliasName) return
        //                                       setAliasName(e.target.value)
        //                                     }
        //                                 } />
        //                                 <TextInput name="Alias Name" type="text"  value={aliasName} setValue={setAliasName} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <TextArea name="Address" value={address} setValue={setAddress} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <DropdownInput name="City/State Name" options={dropDownListMergedObject(id ? cityList.data : cityList.data.filter(item => item.active), "name", "id")} value={city} setValue={setCity} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <TextInput name="Pan No" type="pan_no" value={panNo} setValue={setPanNo} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <TextInput name="Pincode" type="number" value={pincode} setValue={setPincode} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <CheckBox name="Supplier" readOnly={readOnly} value={isSupplier} setValue={setIsSupplier} />
        //                                 <CheckBox name="Customer" readOnly={readOnly} value={isCustomer} setValue={setIsCustomer} />
        //                             </div>
        //                         </fieldset>
        //                         <fieldset className='frame my-1'>
        //                             <legend className='sub-heading'>Opening payment</legend>
        //                             <div className='grid grid-cols-1 gap-2 my-2'>
        //                                {isCustomer && <TextInput name="Customer Opening Amount" type="text" value={coa} setValue={setCoa} readOnly={readOnly} disabled={(childRecord.current > 0)} />} 
        //                                {isSupplier && <TextInput name="Supplier Opening Amount" type="text" value={soa} setValue={setSoa} readOnly={readOnly} disabled={(childRecord.current > 0)} />} 
        //                                                                   </div>
        //                         </fieldset>
        //                     </div>
        //                     <div className='mr-1'>
        //                         <fieldset className='frame my-1'>
        //                             <legend className='sub-heading'>Contact Details</legend>
        //                             <div className='grid grid-cols-1 gap-2 my-2'>
        //                                 <TextInput name="Email Id" type="text" value={email} setValue={setEmail} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <TextInput name="Website" type="text" value={website} setValue={setWebsite} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <TextInput name="Contact Person Name" type="text" value={contactPersonName} setValue={setContactPersonName} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <TextInput name="Contact Mobile" type="text" value={contactMobile} setValue={setContactMobile} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <TextInput name="GST No" type="text" value={gstNo} setValue={setGstNo} readOnly={readOnly} />

        //                                 <TextInput name="Cost Code" type="text" value={costCode} setValue={setCostCode} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                             </div>
        //                         </fieldset>
        //                         <fieldset className='frame my-1'>
        //                             <legend className='sub-heading'>Party Info</legend>
        //                             <div className='grid grid-cols-1 gap-2 my-2'>
        //                                 <TextInput name="Tin No" type="text" value={tinNo} setValue={setTinNo} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <DateInput name="CST Date" value={cstDate} setValue={setCstDate} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <TextInput name="CST No" type="text" value={cstNo} setValue={setCstNo} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <TextInput name="Cin No" type="text" value={cinNo} setValue={setCinNo} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <TextInput name="Fax No" type="text" value={faxNo} setValue={setFaxNo} readOnly={readOnly} disabled={(childRecord.current > 0)} />
        //                                 <CheckBox name="Active" readOnly={readOnly} value={active} setValue={setActive} />
        //                             </div>
        //                         </fieldset>

        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="frame hidden md:block overflow-x-hidden">
        //                 <FormReport
        //                     searchValue={searchValue}
        //                     setSearchValue={setSearchValue}
        //                     setId={setId}
        //                     tableHeaders={tableHeaders}
        //                     tableDataNames={tableDataNames}
        //                     data={allData?.data}
        //                     loading={
        //                         isLoading || isFetching
        //                     }
        //                 />
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <>


            <div onKeyDown={handleKeyDown}>

                <div className="w-full  mx-auto rounded-md shadow-lg px-2 py-1 overflow-y-auto mt-1">

                    <div className='w-full flex justify-between mb-2 items-center px-0.5'>
                        <h1 className="text-xl font-bold text-gray-800">Customer/Supplier Master </h1>
                        <div className="flex items-center gap-4 text-md">
                            <button
                                onClick={() => {
                                    setForm(true);
                                    onNew();
                                    syncFormWithDb(undefined)
                                }}
                                className="bg-white border text-xs border-indigo-600 text-indigo-600 hover:bg-indigo-700 hover:text-white px-4 py-1 rounded-md shadow transition-colors duration-200 flex items-center gap-2"
                            >
                                <Plus size={12} />
                                <span className=" ">
                                    Add New Customer/Supplier
                                </span>
                            </button>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { setView("all"); setReportName("Customer/Supplier Name") }}
                                    className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 ${view === "all"
                                        ? "bg-indigo-100 text-indigo-600"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <Table size={16} />
                                    All
                                </button>
                                <button
                                    onClick={() => { setView("Customer"); setReportName("Customer Name") }}
                                    className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 ${view === "Customer"
                                        ? "bg-indigo-100 text-indigo-600"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <Table size={16} />
                                    Customer
                                </button>
                                <button
                                    onClick={() => { setView("Supplier"); setReportName("Supplier Name") }}
                                    className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 ${view === "Supplier"
                                        ? "bg-indigo-100 text-indigo-600"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <LayoutGrid size={16} />
                                    Supplier
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
                {/* <Mastertable
                    // header={'Party list'}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    onDataClick={onDataClick}
                    tableHeaders={tableHeaders}
                    tableDataNames={tableDataNames}
                    data={allData?.data}
                    loading={
                        isLoading || isFetching
                    }
                    setReadOnly={setReadOnly}
                    deleteData={deleteData}
                /> */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-3 w-">
                    <ReusableTable
                        columns={columns}
                        data={filterParty || []}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={deleteData}
                        itemsPerPage={15}
                    />
                </div>









                {form === true && (


                    <Modal
                        isOpen={form}
                        form={form}
                        widthClass={"w-[90%] h-[95%]"}
                        onClose={() => {
                            setForm(false);
                        }}
                    >






                        <div className="h-full flex flex-col bg-gray-200 ">
                            <div className="border-b py-2 px-4 mx-3 flex justify-between items-center sticky top-0 z-10 bg-white mt-3 ">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-md font-semibold text-gray-800">
                                        {id ? (!readOnly ? "Edit Customer/Supplier" : "Customer/Supplier Master") : "Add New Customer/Supplier"}
                                    </h2>

                                </div>


                                <div className="flex gap-2">
                                    {/* <div className="  ">
                  <button
                    onClick={() => {
                      if (name) {

                        // setBranchModelOpen(true)
                        // setBranchForm(false)
                      }
                      else {
                        Swal.fire({
                          icon: 'warning',
                          title: `Enter ${isSupplier ? "Supplier Details" : "Customer Details"} `,
                          showConfirmButton: false,
                          timer: 2000
                        });
                      }

                    }}
                    readOnly={readOnly}
                    className="bg-white border text-xs border-indigo-600 text-indigo-600 hover:bg-indigo-700 hover:text-white px-4 py-1 rounded-md shadow transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Branch
                  </button>
                </div> */}
                                    <div>
                                        {!readOnly && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setForm(false);
                                                    setSearchValue("");
                                                    setId(false);
                                                }}
                                                className="px-2 py-1 text-red-600 hover:bg-red-600 hover:text-white border border-red-600 text-xs rounded"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {!readOnly && (
                                            <button
                                                type="button"
                                                onClick={saveData}
                                                className="px-2 py-1 hover:bg-green-600 hover:text-white rounded text-green-600 
                  border border-green-600 flex items-center gap-1 text-xs"
                                            >
                                                <Check size={14} />
                                                {id ? "Update" : "Save"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto p-3">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">




                                    <div className="lg:col-span-4 space-y-3 ">
                                        <div className="bg-white p-3 rounded-md border border-gray-200 h-[330px]">
                                            <h3 className="font-medium text-gray-800 mb-2 text-sm">Basic Details</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-row items-center gap-2 ">
                                                    <div className="flex items-center gap-2 ">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            checked={isCustomer}
                                                            onChange={() => handleChange('client')}
                                                            readOnly={readOnly}
                                                        />
                                                        <label className="block text-xs font-bold text-gray-600 mt-1">Customer</label>
                                                    </div>
                                                    <div className="flex flex-row gap-2">

                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            checked={isSupplier}
                                                            onChange={() => handleChange('supplier')}
                                                            readOnly={readOnly}

                                                        />
                                                        <label className="block text-xs font-bold text-gray-600 mt-1">Supplier</label>
                                                    </div>
                                                    <div className="col-span-4 flex flex-row ">







                                                    </div>
                                                </div>


                                                <div className="col-span-2">
                                                    <TextInputNew
                                                        name={isSupplier ? "Supplier Name" : "Customer Name"}
                                                        type="text"
                                                        value={name}
                                                        inputClass="h-8"
                                                        ref={countryNameRef}
                                                        setValue={setName}
                                                        required={true}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        onBlur={(e) => {
                                                            if (aliasName) return;
                                                            setAliasName(e.target.value);
                                                        }}

                                                        className="focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <TextInputNew
                                                        name="Alias Name"
                                                        type="text"
                                                        inputClass="h-8"
                                                        value={aliasName}
                                                        setValue={setAliasName}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        className="focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <TextInputNew
                                                        name="Code"
                                                        type="text"
                                                        value={partyCode}

                                                        setValue={setPartyCode}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        className="focus:ring-2 focus:ring-blue-100 w-10"
                                                    />
                                                </div>
                                                <div className="col-span-1" >
                                                    <TextInputNew
                                                        name="Opening Amount" type="text"
                                                        value={coa} setValue={setCoa} readOnly={readOnly}
                                                        disabled={(childRecord.current > 0)} />

                                                </div>

                                                <div className=" ">
                                                    <ToggleButton
                                                        name="Status"
                                                        options={statusDropdown}
                                                        value={active}
                                                        setActive={setActive}
                                                        required={true}
                                                        readOnly={readOnly}
                                                        className="bg-gray-100 p-1 rounded-lg"
                                                        activeClass="bg-[#f1f1f0] shadow-sm text-blue-600"
                                                        inactiveClass="text-gray-500"
                                                    />
                                                </div>




                                            </div>


                                        </div>


                                    </div>
                                    <div className="lg:col-span-4 space-y-3 ">
                                        <div className="bg-white p-3 rounded-md border border-gray-200 h-[330px]">
                                            <h3 className="font-medium text-gray-800 mb-2 text-sm">Address  Details</h3>
                                            <div className="space-y-2">


                                                <div className="grid grid-cols-2 gap-2">

                                                    <div className="col-span-2">

                                                        <TextAreaNew name="Address"
                                                            inputClass="h-10" value={address}
                                                            setValue={setAddress} required={true}
                                                            readOnly={readOnly} d
                                                            isabled={(childRecord.current > 0)} />
                                                    </div>
                                                    <TextInputNew
                                                        name="Land Mark"
                                                        type="text"
                                                        value={landMark}

                                                        setValue={setlandMark}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        className="focus:ring-2 focus:ring-blue-100 w-10"
                                                    />
                                                    <DropdownInputNew
                                                        name="City/State Name"
                                                        options={dropDownListMergedObject(
                                                            id
                                                                ? cityList?.data
                                                                : cityList?.data?.filter((item) => item.active),
                                                            "name",
                                                            "id"
                                                        )}
                                                        country={country}
                                                        masterName="CITY MASTER"
                                                        // lastTab={activeTab}
                                                        value={city}
                                                        setValue={setCity}
                                                        required={true}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        className="focus:ring-2 focus:ring-blue-100"
                                                    />

                                                    <div className="col-span-2 flex flex-row gap-3">
                                                        <div className="w-24">

                                                            <TextInputNew
                                                                name="Pincode"
                                                                type="number"
                                                                value={pincode}
                                                                required={true}

                                                                setValue={setPincode}
                                                                readOnly={readOnly}
                                                                disabled={childRecord.current > 0}
                                                                className="focus:ring-2 focus:ring-blue-100 w-10"
                                                            />
                                                        </div>
                                                        <div className="w-64">
                                                            <TextInputNew
                                                                name={"Email"}
                                                                type="text"
                                                                value={email}

                                                                setValue={setEmail}
                                                                readOnly={readOnly}
                                                                disabled={childRecord.current > 0}
                                                                className="focus:ring-2 focus:ring-blue-100 w-10"
                                                            />
                                                            <div>


                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div>
                                                        <TextInputNew
                                                            name={"Contact Number"}
                                                            type="number"
                                                            value={contact}

                                                            setValue={setContact}
                                                            readOnly={readOnly}
                                                            disabled={childRecord.current > 0}
                                                            className="focus:ring-2 focus:ring-blue-100 w-10"
                                                        />
                                                    </div>





                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="lg:col-span-4 space-y-3">
                                        <div className="bg-white p-3 rounded-md border border-gray-200  h-[330px]">
                                            <h3 className="font-medium text-gray-800 mb-2 text-sm">Contact  Details</h3>
                                            <div className="space-y-2">



                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="col-span-2 flex flex-row gap-4 mt-2">
                                                        <div className="w-96">

                                                            <TextInputNew
                                                                name="Contact Person Name"
                                                                type="text"
                                                                value={contactPersonName}

                                                                setValue={setContactPersonName}
                                                                readOnly={readOnly}
                                                                disabled={childRecord.current > 0}
                                                                className="focus:ring-2 focus:ring-blue-100 w-10"
                                                            />
                                                        </div>
                                                        {/* <div className="relative inline-block">
                                                        <button
                                                            className="w-7 h-6 border border-green-500 rounded-md mt-6
                                            hover:bg-green-500 text-green-600 hover:text-white
                                            transition-colors flex items-center justify-center"
                                                            disabled={readOnly}
                                                            onClick={() => {
                                                                // openAddModal();
                                                                // setIsDropdownOpen(false);
                                                                // setEditingItem("new");
                                                                // setOpenModel(true);
                                                                setBranchForm(false)
                                                                setIsContactPerson(true)
                                                            }}
                                                            onMouseEnter={() => setTooltipVisible(true)}
                                                            onMouseLeave={() => setTooltipVisible(false)}
                                                            aria-label="Add supplier"
                                                        >
                                                            <FaPlus className="text-sm" />
                                                        </button>

                                                        {tooltipVisible && (
                                                            <div className="absolute z-10 top-full right-0 mt-1 w-48 bg-indigo-800 text-white text-xs rounded p-2 shadow-lg">
                                                                <div className="flex items-start">
                                                                    <FaInfoCircle className="flex-shrink-0 mt-0.5 mr-1" />
                                                                    <span>Click to add a new Contact Person</span>
                                                                </div>
                                                                <div className="absolute -top-1 right-3 w-2.5 h-2.5 bg-indigo-800 transform rotate-45"></div>
                                                            </div>
                                                        )}
                                                    </div> */}

                                                    </div>
                                                    <TextInputNew
                                                        name="Designation"
                                                        type="text"
                                                        value={designation}

                                                        setValue={setDesignation}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        className="focus:ring-2 focus:ring-blue-100 w-10"
                                                    />
                                                    <TextInputNew
                                                        name="Department"
                                                        type="text"
                                                        value={department}

                                                        setValue={setDepartment}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        className="focus:ring-2 focus:ring-blue-100 w-10"
                                                    />
                                                    <div className='col-span-2'>

                                                        <TextInputNew
                                                            name="Email"
                                                            type="text"
                                                            value={contactPersonEmail}

                                                            setValue={setContactPersonEmail}
                                                            readOnly={readOnly}
                                                            disabled={childRecord.current > 0}
                                                            className="focus:ring-2 focus:ring-blue-100 w-10"
                                                        />
                                                    </div>
                                                    <div className='col-span-1'>

                                                        <TextInputNew
                                                            name="Contact Number"
                                                            type="number"
                                                            value={contactNumber}
                                                            setValue={setContactNumber}

                                                            readOnly={readOnly}
                                                            disabled={childRecord.current > 0}
                                                            className="focus:ring-2 focus:ring-blue-100 w-10"
                                                        />
                                                    </div>
                                                    <div className='col-span-1'>
                                                        <TextInputNew
                                                            name="Alternative Contact Number"
                                                            type="number"
                                                            value={alterContactNumber}
                                                            setValue={setAlterContactNumber}

                                                            // readOnly={readOnly}
                                                            // disabled={childRecord.current > 0}
                                                            className="focus:ring-2 focus:ring-blue-100 w-10"
                                                        />
                                                    </div>







                                                </div>
                                            </div>
                                        </div>


                                    </div>



                                    <div className="lg:col-span-4 space-y-3">
                                        <div className="bg-white p-3 rounded-md border border-gray-200 h-[240px]">
                                            <h3 className="font-medium text-gray-800 mb-2 text-sm">Business Details</h3>
                                            <div className="space-y-2">

                                                <div className="grid grid-cols-2 gap-2">


                                                    {/* <DropdownInput
                                                    name="Currency"
                                                    options={dropDownListObject(
                                                        id
                                                            ? currencyList?.data ?? []
                                                            : currencyList?.data?.filter(
                                                                (item) => item.active
                                                            ) ?? [],
                                                        "name",
                                                        "id"
                                                    )}
                                                    // lastTab={activeTab}
                                                    masterName="CURRENCY MASTER"
                                                    value={currency}
                                                    setValue={setCurrency}
                                                    readOnly={readOnly}
                                                    disabled={childRecord.current > 0}
                                                    className="focus:ring-2 focus:ring-blue-100"
                                                /> */}

                                                    {/* <DropdownInput
                                                    name="PayTerm"
                                                    options={dropDownListObject(
                                                        id
                                                            ? payTermList?.data
                                                            : payTermList?.data?.filter((item) => item.active),
                                                        "name",
                                                        "id"
                                                    )}
                                                    value={payTermDay}
                                                    setValue={setPayTermDay}
                                                    // required={true}
                                                    readOnly={readOnly}
                                                    disabled={childRecord.current > 0}
                                                    className="focus:ring-2 focus:ring-blue-100"
                                                /> */}
                                                    <TextInputNew
                                                        name="Pan No"
                                                        type="pan_no"
                                                        value={panNo}
                                                        setValue={setPanNo}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        className="focus:ring-2 focus:ring-blue-100"
                                                    />
                                                    <TextInputNew
                                                        name="GST No"
                                                        type="text"
                                                        value={gstNo}
                                                        setValue={setGstNo}
                                                        readOnly={readOnly}
                                                        className="focus:ring-2 focus:ring-blue-100"
                                                    />
                                                    <TextInputNew
                                                        name="MSME CERTFICATE  No"
                                                        type="text"
                                                        value={msmeNo}
                                                        setValue={setMsmeNo}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        className="focus:ring-2 focus:ring-blue-100"
                                                    />
                                                    <TextInputNew
                                                        name="CIN No"
                                                        type="text"
                                                        value={cinNo}
                                                        setValue={setCinNo}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        className="focus:ring-2 focus:ring-blue-100"
                                                    />

                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="lg:col-span-4 space-y-3">
                                        <div className="bg-white p-3 rounded-md border border-gray-200 h-[240px]">
                                            <h3 className="font-medium text-gray-800 mb-2 text-sm">Bank  Details</h3>
                                            <div className="space-y-2">


                                                <TextInputNew
                                                    name="Bank Name"
                                                    type="text"
                                                    value={bankname}

                                                    setValue={setBankName}
                                                    readOnly={readOnly}
                                                    disabled={childRecord.current > 0}
                                                    className="focus:ring-2 focus:ring-blue-100 w-10"
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <TextInputNew
                                                        name="Branch Name"
                                                        type="text"
                                                        value={bankBranchName}

                                                        setValue={setBankBranchName}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        className="focus:ring-2 focus:ring-blue-100 w-10"
                                                    />
                                                    <TextInputNew
                                                        name="Account Number"
                                                        type="text"
                                                        value={accountNumber}

                                                        setValue={setAccountNumber}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        className="focus:ring-2 focus:ring-blue-100 w-10"
                                                    />
                                                    <TextInputNew
                                                        name="IFSC CODE"
                                                        type="text"
                                                        value={ifscCode}

                                                        setValue={setIfscCode}
                                                        readOnly={readOnly}
                                                        disabled={childRecord.current > 0}
                                                        className="focus:ring-2 focus:ring-blue-100 w-10"
                                                    />



                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="lg:col-span-4 space-y-3">
                                        <div className="bg-white p-3 rounded-md border border-gray-200  h-[240px]">
                                            <h3 className="font-medium text-gray-800 mb-2 text-sm">Attchments</h3>
                                            <div className="space-y-2">
                                                <div className="flex pt-4">
                                                    <button
                                                        className="relative w-20 h-7 bg-gray-800    text-white rounded-md shadow-md hover:shadow-xl hover:scale-105 
        transform transition-all duration-300 ease-in-out overflow-hidden flex items-center justify-center"
                                                        onClick={() => setFormReport(true)}
                                                    >
                                                        <span className="absolute inset-0 bg-white opacity-10 rounded-md"></span>
                                                        <Paperclip className="relative z-10 w-5 h-5" />
                                                    </button>
                                                </div>

                                            </div>
                                        </div>


                                    </div>

                                </div>
                            </div>


                        </div>


                    </Modal>
                )}
            </div>
            <Modal isOpen={formReport}
                onClose={() => setFormReport(false)} widthClass={"p-3 h-[70%] w-[70%]"}
            >
                <ArtDesignReport
                    // userRole={userRole}
                    setFormReport={setFormReport}
                    tableWidth="100%"
                    formReport={formReport}
                    setAttachments={setAttachments}
                    attachments={attachments}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                />
            </Modal>
        </>
    );
}
