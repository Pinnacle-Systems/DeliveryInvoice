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
import { TextInput, DropdownInput, CheckBox, RadioButton, TextArea, DateInput, MultiSelectDropdown } from "../../../Inputs";
import ReportTemplate from "../../../Basic/components/ReportTemplate";
import { dropDownListObject, dropDownListMergedObject, multiSelectOption } from '../../../Utils/contructObject';
import moment from "moment";
import Modal from "../../../UiComponents/Modal";

import { Loader } from '../../../Basic/components';
import { useDispatch } from "react-redux";
import { findFromList } from "../../../Utils/helper";


const MODEL = "Party Master";


export default function Form() {
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
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [contactPersonName, setContactPersonName] = useState("");
    const [gstNo, setGstNo] = useState("");
    const [costCode, setCostCode] = useState("");
    const [contactMobile, setContactMobile] = useState('');
    const [cstDate, setCstDate] = useState("");
    const [email, setEmail] = useState("");
    const [isSupplier, setIsSupplier] = useState(true);
    const [isCustomer, setIsCustomer] = useState(true);
    const [active, setActive] = useState(true);

    const [searchValue, setSearchValue] = useState("");

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
        if (id) {
            setReadOnly(true);
        } else {
            setReadOnly(false);
        }
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
        setContactPersonName(data?.contactPersonName ? data?.contactPersonName : "");
        setGstNo(data?.gstNo ? data?.gstNo : "");
        setCostCode(data?.costCode ? data?.costCode : "");
        setCstDate(data?.cstDate ? moment.utc(data?.cstDate).format('YYYY-MM-DD') : "");
        setCode(data?.code ? data?.code : "");
        setPincode(data?.pincode ? data?.pincode : "");
        setWebsite(data?.website ? data?.website : "");
        setEmail(data?.email ? data?.email : "");
        setCity(data?.cityId ? data?.cityId : "");
        setIsCustomer((data?.isCustomer ? data.isCustomer : false));
        setIsSupplier((data?.isSupplier ? data.isSupplier : false));
        setActive(id ? (data?.active ? data.active : false) : true);
      
        setContactMobile((data?.contactMobile ? data.contactMobile : ''));
      
      
    }, [id]);

    useEffect(() => {
        syncFormWithDb(singleData?.data);
    }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

    const data = {
        name,isSupplier, isCustomer, code, aliasName, displayName, address, cityId: city, pincode, panNo, tinNo, cstNo, cstDate, cinNo,
        faxNo, email, website, contactPersonName, gstNo,  costCode,contactMobile,
        active, companyId,
      
        id, userId
    }

    const validateData = (data) => {
        return data.name 
      
    }

    const handleSubmitCustom = async (callback, data, text) => {
        try {
            let returnData;
            if (text === "Updated") {
                returnData = await callback({ id, body: data }).unwrap();
            } else {
                returnData = await callback(data).unwrap();
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
            toast.success(text + "Successfully");
        } catch (error) {
            console.log("handle");
        }
    };

   
    const saveData = () => {
        if (!validateData(data)) {
            toast.info("Please fill all required fields...!", { position: "top-center" })
            return
        }
      

        if (id) {
            handleSubmitCustom(updateData, data, "Updated");
        } else {
            handleSubmitCustom(addData, data, "Added");
        }
    }


    const deleteData = async () => {
        if (id) {
            if (!window.confirm("Are you sure to delete...?")) {
                return;
            }
            try {
                await removeData(id)
                dispatch({
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
                toast.success("Deleted Successfully");
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


    if (!form)
        return (
            <ReportTemplate
                heading={MODEL}
                tableHeaders={tableHeaders}
                tableDataNames={tableDataNames}
                loading={
                    isLoading || isFetching
                }
                setForm={setForm}
                data={allData?.data}
                onClick={onDataClick}
                onNew={onNew}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
        );

    
    if ( !cityList || cityFetching || cityLoading) {
        return <Loader />
    }

    return (
        <div
            onKeyDown={handleKeyDown}
            className="md:items-start md:justify-items-center grid h-full bg-theme"
        >
          
            <div className="flex flex-col frame w-full h-full">
                <FormHeader
                    onNew={onNew}
                    onClose={() => {
                        setForm(false);
                        setSearchValue("");
                    }}
                    model={MODEL}
                    saveData={saveData}
                    setReadOnly={setReadOnly}
                    deleteData={deleteData}

                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-x-2">
                    <div className="col-span-3 grid md:grid-cols-2 border h-[520px] overflow-auto">
                        <div className='col-span-3 grid md:grid-cols-2 border'>
                            <div className='mr-1 md:ml-2'>
                               
                                <fieldset className='frame my-1 flex'>
                                    <legend className='sub-heading'>Official Details</legend>
                                    <div className='flex flex-col justify-start gap-4 mt- flex-1'>
                                        <TextInput name="Party Code" type="text" value={code} setValue={setCode} readOnly={readOnly}  disabled={(childRecord.current > 0)} />
                                        <TextInput name="Party Name" type="text" value={name} 
                                        setValue={setName} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)}
                                          onBlur={(e) => {
                                              if(aliasName) return
                                              setAliasName(e.target.value)
                                            }
                                        } />
                                        <TextInput name="Alias Name" type="text"  value={aliasName} setValue={setAliasName} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextArea name="Address" value={address} setValue={setAddress} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <DropdownInput name="City/State Name" options={dropDownListMergedObject(id ? cityList.data : cityList.data.filter(item => item.active), "name", "id")} value={city} setValue={setCity} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Pan No" type="pan_no" value={panNo} setValue={setPanNo} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Pincode" type="number" value={pincode} setValue={setPincode} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <CheckBox name="Supplier" readOnly={readOnly} value={isSupplier} setValue={setIsSupplier} />
                                        <CheckBox name="Customer" readOnly={readOnly} value={isCustomer} setValue={setIsCustomer} />
                                    </div>
                                </fieldset>
                            </div>
                            <div className='mr-1'>
                                <fieldset className='frame my-1'>
                                    <legend className='sub-heading'>Contact Details</legend>
                                    <div className='grid grid-cols-1 gap-2 my-2'>
                                        <TextInput name="Email Id" type="text" value={email} setValue={setEmail} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Website" type="text" value={website} setValue={setWebsite} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Contact Person Name" type="text" value={contactPersonName} setValue={setContactPersonName} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Contact Mobile" type="text" value={contactMobile} setValue={setContactMobile} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="GST No" type="text" value={gstNo} setValue={setGstNo} readOnly={readOnly} />
                                      
                                        <TextInput name="Cost Code" type="text" value={costCode} setValue={setCostCode} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                    </div>
                                </fieldset>
                                <fieldset className='frame my-1'>
                                    <legend className='sub-heading'>Party Info</legend>
                                    <div className='grid grid-cols-1 gap-2 my-2'>
                                        <TextInput name="Tin No" type="text" value={tinNo} setValue={setTinNo} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <DateInput name="CST Date" value={cstDate} setValue={setCstDate} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="CST No" type="text" value={cstNo} setValue={setCstNo} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Cin No" type="text" value={cinNo} setValue={setCinNo} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Fax No" type="text" value={faxNo} setValue={setFaxNo} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <CheckBox name="Active" readOnly={readOnly} value={active} setValue={setActive} />
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="frame hidden md:block overflow-x-hidden">
                        <FormReport
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            setId={setId}
                            tableHeaders={tableHeaders}
                            tableDataNames={tableDataNames}
                            data={allData?.data}
                            loading={
                                isLoading || isFetching
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
