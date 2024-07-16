import React, { useEffect, useState, useRef, useCallback } from "react";
import secureLocalStorage from "react-secure-storage";
import {
    useGetEmployeeQuery,
    useGetEmployeeByIdQuery,
    useAddEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
} from "../../../redux/services/EmployeeMasterService";
import { useGetCountriesQuery } from "../../../redux/services/CountryMasterService";
import { useGetCityQuery } from "../../../redux/services/CityMasterService";
import LiveWebCam from "../LiveWebCam";
import FormHeader from "../FormHeader";
import FormReport from "../FormReportTemplate";
import { toast } from "react-toastify";
import { TextInput, DropdownInput, TextArea, CurrencyInput, DateInput, DisabledInput } from "../../../Inputs";
import ReportTemplate from "../ReportTemplate";
import { dropDownListObject, dropDownListMergedObject } from '../../../Utils/contructObject';
import Modal from "../../../UiComponents/Modal";
import { statusDropdown, employeeType, genderList, maritalStatusList, bloodList } from "../../../Utils/DropdownData";
import moment from "moment";
import { useGetEmployeeCategoryQuery } from "../../../redux/services/EmployeeCategoryMasterService";
import { viewBase64String } from '../../../Utils/helper';
import SingleImageFileUploadComponent from "../SingleImageUploadComponent";
import EmployeeLeavingForm from "./EmployeeLeavingForm";
import { useGetDepartmentQuery } from "../../../redux/services/DepartmentMasterService";
import EmployeeReport from "./Report";
import { useDispatch } from "react-redux";
import Loader from "../Loader";
const MODEL = "Employee Master";


export default function Form() {
    const [form, setForm] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);

    const [readOnly, setReadOnly] = useState(false);

    const [id, setId] = useState("");
    const [panNo, setPanNo] = useState("");
    const [name, setName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [dob, setDob] = useState("");
    const [chamberNo, setChamberNo] = useState("");
    const [localAddress, setlocalAddress] = useState("");
    const [localCity, setLocalCity] = useState("");
    const [localPincode, setLocalPincode] = useState("");
    const [mobile, setMobile] = useState("");
    const [degree, setDegree] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [salaryPerMonth, setSalaryPerMonth] = useState("");
    const [commissionCharges, setCommissionCharges] = useState("");
    const [gender, setGender] = useState("");
    const [regNo, setRegNo] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [permAddress, setPermAddress] = useState("");
    const [permCity, setPermCity] = useState("");
    const [permPincode, setPermPincode] = useState("")
    const [email, setEmail] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("");
    const [consultFee, setConsultFee] = useState("");
    const [accountNo, setAccountNo] = useState("");
    const [ifscNo, setIfscNo] = useState("");
    const [branchName, setbranchName] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [department, setDepartment] = useState("");
    const [employeeCategory, setEmployeeCategory] = useState();
    const [permanent, setPermanent] = useState("");
    const [active, setActive] = useState(true);

    const [branchPrefixCategory, setBranchPrefixCategory] = useState("");
    // Employee Leaving form fields
    const [leavingForm, setLeavingForm] = useState(false);

    const [leavingDate, setLeavingDate] = useState("");
    const [leavingReason, setLeavingReason] = useState("");
    const [canRejoin, setCanRejoin] = useState("");
    const [rejoinReason, setRejoinReason] = useState("");

    const [searchValue, setSearchValue] = useState("");
    const [image, setImage] = useState(null);

    const childRecord = useRef(0);
    const dispatch = useDispatch();


    const params = {
        companyId: secureLocalStorage.getItem(
            sessionStorage.getItem("sessionId") + "userCompanyId"
        ),
    };
    const { data: countriesList, isLoading: isCountryLoading, isFetching: isCountryFetching } =
        useGetCountriesQuery({ params });

    const { data: cityList, isLoading: cityLoading, isFetching: cityFetching } =
        useGetCityQuery({ params });

    const { data: employeeCategoryList } =
        useGetEmployeeCategoryQuery({ params });

    const { data: departmentList } =
        useGetDepartmentQuery({ params });
    const { data: allData, isLoading, isFetching } = useGetEmployeeQuery({ params, searchParams: searchValue });



    const isCurrentEmployeeDoctor = (employeeCategory) => employeeCategoryList.data.find((cat) => parseInt(cat.id) === parseInt(employeeCategory))?.name?.toUpperCase() === "DOCTOR";
    const {
        data: singleData,
        isFetching: isSingleFetching,
        isLoading: isSingleLoading,
    } = useGetEmployeeByIdQuery(id, { skip: !id });

    const [addData] = useAddEmployeeMutation();
    const [updateData] = useUpdateEmployeeMutation();
    const [removeData] = useDeleteEmployeeMutation();

    const syncFormWithDb = useCallback((data) => {
        if (id) setReadOnly(true);
        setPanNo(data?.panNo ? data?.panNo : "");
        setName(data?.name ? data?.name : "");
        setFatherName(data?.fatherName ? data?.fatherName : "");
        setDob(data?.dob ? moment.utc(data?.dob).format('YYYY-MM-DD') : "");
        setChamberNo(data?.chamberNo ? data?.chamberNo : "");
        setlocalAddress(data?.localAddress ? data?.localAddress : "");
        setLocalCity(data?.localCity?.id ? data?.localCity?.id : "");
        setLocalPincode(data?.localPincode ? data?.localPincode : "");
        setMobile(data?.mobile ? data?.mobile : "");
        setDegree(data?.degree ? data?.degree : "");
        setSpecialization(data?.specialization ? data?.specialization : "");
        setSalaryPerMonth(data?.salaryPerMonth ? data?.salaryPerMonth : "");
        setCommissionCharges(data?.commissionCharges ? data?.commissionCharges : "");
        setGender(data?.gender ? data?.gender : "");
        setRegNo(data?.regNo ? data?.regNo : "");
        setJoiningDate(data?.joiningDate ? moment.utc(data?.joiningDate).format('YYYY-MM-DD') : "");
        setPermAddress(data?.permAddress ? data?.permAddress : "");
        setPermCity(data?.permCity ? data?.permCity?.id : "");
        setPermPincode(data?.permPincode ? data?.permPincode : "");
        setEmail(data?.email ? data?.email : "");
        setMaritalStatus(data?.maritalStatus ? data?.maritalStatus : "");
        setConsultFee(data?.consultFee ? data?.consultFee : "");
        setAccountNo(data?.accountNo ? data?.accountNo : "");
        setIfscNo(data?.ifscNo ? data?.ifscNo : "");
        setbranchName(data?.branchName ? data?.branchName : "");
        setBloodGroup(data?.bloodGroup ? data?.bloodGroup : "");
        setDepartment(data?.departmentId ? data?.department?.id : "");
        setImage(data?.imageBase64 ? viewBase64String(data?.imageBase64) : null);
        setEmployeeCategory(data?.employeeCategoryId ? data?.employeeCategoryId : "");
        setPermanent(data?.permanent ? data?.permanent : "");
        setActive(data ? data.active : "");

        // Employee Leaving Form states
        setLeavingDate(data?.leavingDate ? data?.leavingDate : "");
        setLeavingReason(data?.leavingReason ? data?.leavingReason : "");
        setCanRejoin(data?.canRejoin ? data?.canRejoin : false);
        setRejoinReason(data?.rejoinReason ? data?.rejoinReason : "");
        secureLocalStorage.setItem(sessionStorage.getItem("sessionId") + "currentEmployeeSelected", data?.id);
    }, [id]);

    useEffect(() => {
        syncFormWithDb(singleData?.data);
    }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

    const data = {
        branchId: secureLocalStorage.getItem(sessionStorage.getItem("sessionId") + "currentBranchId"), panNo, name, fatherName, dob, chamberNo, localAddress, localCity, localPincode, mobile, degree, specialization, salaryPerMonth,
        commissionCharges, gender, joiningDate, permAddress, permCity, permPincode, email, maritalStatus, consultFee, accountNo,
        ifscNo, branchName, bloodGroup, ...department && { department }, employeeCategoryId: employeeCategory, permanent, active,
        id, leavingReason, leavingDate, canRejoin, rejoinReason
    }

    const validateData = (data) => {
        return data.name && data.joiningDate && data.fatherName && data.dob && data.gender && data.maritalStatus && data.bloodGroup &&
            data.panNo && data.email && data.mobile && data.degree && data.specialization &&
            data.localAddress && data.localCity && data.localPincode && data.employeeCategoryId && (isCurrentEmployeeDoctor(employeeCategory) ? data.department && data.chamberNo : true)

    }

    const handleSubmitCustom = async (callback, data, text) => {
        try {
            let returnData;
            const formData = new FormData()
            for (let key in data) {
                formData.append(key, data[key]);
            }
            if (image instanceof File) {
                formData.append("image", image);
            } else if (!image) {
                formData.append("isDeleteImage", true);
            }
            if (text === "Updated") {
                returnData = await callback({ id, body: formData }).unwrap();
            } else {
                returnData = await callback(formData).unwrap();
            }
            setId("")
            syncFormWithDb(undefined)
            toast.success(text + "Successfully");
            dispatch({
                type: `EmployeeCategoryMaster/invalidateTags`,
                payload: ['Employee Category'],
            });
            dispatch({
                type: `DepartmentMaster/invalidateTags`,
                payload: ['Department'],
            });
            dispatch({
                type: `CityMaster/invalidateTags`,
                payload: ['City/State Name'],
            });

        } catch (error) {
            console.log("handle");
        }
    };

    const saveData = () => {
        if (!validateData(data)) {
            toast.info("Please fill all required fields...!", { position: "top-center" })
            return
        }
        // if (!validateEmail(data.email)) {
        //     toast.info("Please enter proper email id!", { position: "top-center" })
        //     return
        // }
        // if (!validateMobile(data.mobile)) {
        //     toast.info("Please enter proper mobile number...!", { position: "top-center" })
        //     return
        // }
        // if (!validatePan(data.panNo)) {
        //     toast.info("Please enter proper pan number...!", { position: "top-center" })
        //     return
        // }
        // if (!validatePincode(data.localPincode)) {
        //     toast.info("Please enter proper local Pincode...!", { position: "top-center" })
        //     return
        // }
        // if (data.permPincode && !validatePincode(data.permPincode)) {
        //     toast.info("Please enter proper perm. Pincode...!", { position: "top-center" })
        //     return
        // }
        if (!JSON.parse(active)) {
            setLeavingForm(true);
        } else {
            if (id) {
                handleSubmitCustom(updateData, data, "Updated");
            } else {
                handleSubmitCustom(addData, data, "Added");
            }
        }
    }


    const deleteData = async () => {
        if (id) {
            if (!window.confirm("Are you sure to delete...?")) {
                return;
            }
            try {
                await removeData(id)
                setId("");
                dispatch({
                    type: `EmployeeCategoryMaster/invalidateTags`,
                    payload: ['Employee Category'],
                });
                dispatch({
                    type: `DepartmentMaster/invalidateTags`,
                    payload: ['Department'],
                });
                dispatch({
                    type: `cityMaster/invalidateTags`,
                    payload: ['City/State Name'],
                });
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
        setId("");
        setReadOnly(false);
        setForm(true);
        setSearchValue("");
    };

    function onDataClick(id) {
        setId(id);
        setForm(true);
    }
    const tableHeaders = ["Employee Id", "Name", "Employee Category"]
    const tableDataNames = ["dataObj.regNo", "dataObj.name", 'dataObj?.EmployeeCategory?.name']
    const submitLeavingForm = () => {
        console.log("sdfsdfsdfsdf")
        if (id) {
            console.log("called id")
            handleSubmitCustom(updateData, data, "Updated");
        } else {
            console.log("called no id")
            handleSubmitCustom(addData, data, "Added");
        }
        setLeavingForm(false);
    }

    if (!form)
        return (
            <EmployeeReport
                loading={
                    isLoading || isFetching
                }
                setForm={setForm}
                employees={allData?.data}
                onClick={onDataClick}
                onNew={onNew}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
        );
    if (!countriesList?.data || !employeeCategoryList?.data || !cityList?.data) return <Loader />

    return (
        <div
            onKeyDown={handleKeyDown}
            className="md:items-start md:justify-items-center grid h-full bg-theme"
        >
            <Modal isOpen={cameraOpen} onClose={() => setCameraOpen(false)}>
                <LiveWebCam picture={image} setPicture={setImage} onClose={() => setCameraOpen(false)} />
            </Modal>
            <Modal isOpen={leavingForm} onClose={() => setLeavingForm(false)}>
                <EmployeeLeavingForm leavingReason={leavingReason} setLeavingReason={setLeavingReason}
                    leavingDate={leavingDate} setLeavingDate={setLeavingDate}
                    canRejoin={canRejoin} setCanRejoin={setCanRejoin}
                    rejoinReason={rejoinReason} setRejoinReason={setRejoinReason}
                    onSubmit={submitLeavingForm} onClose={() => { setLeavingForm(false) }} />
            </Modal>
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
                // childRecord={childRecord.current}
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-x-2">
                    <div className="col-span-3 grid md:grid-cols-2 border h-[520px] overflow-auto">
                        <div className='col-span-3 grid md:grid-cols-2 border'>
                            <div className='mr-1 md:ml-2'>
                                <fieldset className='frame my-1'>
                                    <legend className='sub-heading'>Employee Category Info</legend>
                                    <div className='grid grid-cols-1 my-2'>
                                        <DropdownInput name="Employee Category" options={dropDownListObject(id ? employeeCategoryList.data : employeeCategoryList.data.filter(item => item.active), "name", "id")} value={employeeCategory} setValue={(value) => { setEmployeeCategory(value); if (!isCurrentEmployeeDoctor(value)) { setDepartment("") }; setChamberNo(""); }} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        {(branchPrefixCategory === "Specific")
                                            ?
                                            <DropdownInput name="Employee Type" options={employeeType} value={permanent} setValue={setPermanent} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                            :
                                            ""
                                        }
                                    </div>
                                </fieldset>
                                <fieldset className='frame my-1 flex'>
                                    <legend className='sub-heading'>Official Details</legend>
                                    <SingleImageFileUploadComponent setWebCam={setCameraOpen} disabled={readOnly} image={image} setImage={setImage} />
                                    <div className='flex flex-col justify-start gap-2 mt- flex-1'>
                                        {id ? <DisabledInput name="Employee Id" type={"text"} value={regNo} /> : ""}
                                        <TextInput name="Name" type="text" value={name} setValue={setName} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Chamber no" type="text" value={chamberNo} setValue={setChamberNo} readOnly={readOnly} required={isCurrentEmployeeDoctor(employeeCategory)} disabled={(childRecord.current > 0)} />
                                        <DropdownInput name="Department" options={dropDownListObject(id ? departmentList.data : departmentList.data.filter(item => item.active), "name", "id")} value={department} setValue={setDepartment} required={isCurrentEmployeeDoctor(employeeCategory)} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <DateInput name="Joining Date" value={joiningDate} setValue={setJoiningDate} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                    </div>
                                </fieldset>
                                <fieldset className='frame my-1'>
                                    <legend className='sub-heading'>Personal Details</legend>
                                    <div className='grid grid-cols-1 my-2'>
                                        <TextInput name="Father Name" type="text" value={fatherName} setValue={setFatherName} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <DateInput name="Date Of Birth" value={dob} setValue={setDob} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <DropdownInput name="Gender" options={genderList} value={gender} setValue={setGender} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <DropdownInput name="Marital Status" options={maritalStatusList} value={maritalStatus} setValue={setMaritalStatus} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <DropdownInput name="Blood Group" options={bloodList} value={bloodGroup} setValue={setBloodGroup} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Pan No" type="pan_no" value={panNo} setValue={setPanNo} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                    </div>
                                </fieldset>
                                <fieldset className='frame  my-1'>
                                    <legend className='sub-heading'>Payment</legend>
                                    <div className='grid grid-cols-1 my-2'>
                                        <CurrencyInput name="Consult Fee" value={consultFee} setValue={setConsultFee} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <CurrencyInput name="Salary/Month" value={salaryPerMonth} setValue={setSalaryPerMonth} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <CurrencyInput name="Commission charges" value={commissionCharges} setValue={setCommissionCharges} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                    </div>
                                </fieldset>
                                <fieldset className='frame my-1'>
                                    <legend className='sub-heading'>Perm. Address</legend>
                                    <div className='grid grid-cols-1 my-2'>
                                        <TextArea name="Perm. Address" value={permAddress} setValue={setPermAddress} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Pincode" type="number" value={permPincode} setValue={setPermPincode} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <DropdownInput name="City/State Name" options={dropDownListMergedObject(id ? cityList.data : cityList.data.filter(item => item.active), "name", "id")} value={permCity} setValue={setPermCity} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                    </div>
                                </fieldset>
                            </div>
                            <div className='mr-1'>
                                <fieldset className='frame my-1'>
                                    <legend className='sub-heading'>Contact Details</legend>
                                    <div className='grid grid-cols-1 my-2'>
                                        <TextInput name="Email Id" type="text" value={email} setValue={setEmail} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Mobile No" type="number" value={mobile} setValue={setMobile} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                    </div>
                                </fieldset>
                                <fieldset className='frame my-1'>
                                    <legend className='sub-heading'>Bank Details</legend>
                                    <div className='grid grid-cols-1 my-2'>
                                        <TextInput name="Account No" type="number" value={accountNo} setValue={setAccountNo} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="IFSC No" type="text" value={ifscNo} setValue={setIfscNo} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Branch Name" type="text" value={branchName} setValue={setbranchName} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                    </div>
                                </fieldset>
                                <fieldset className='frame my-1'>
                                    <legend className='sub-heading'>Education</legend>
                                    <div className='grid grid-cols-1 my-2'>
                                        <TextInput name="Degree" type="text" value={degree} setValue={setDegree} readOnly={readOnly} required={true} />
                                        <TextInput name="Specialization" type="text" value={specialization} setValue={setSpecialization} readOnly={readOnly} required={true} />
                                    </div>
                                </fieldset>
                                <fieldset className='frame my-1'>
                                    <legend className='sub-heading'>Local Address</legend>
                                    <div className='grid grid-cols-1 my-2'>
                                        <TextArea name="Local Address" value={localAddress} setValue={setlocalAddress} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <TextInput name="Pincode" type="number" value={localPincode} setValue={setLocalPincode} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                        <DropdownInput name="City/State Name" options={dropDownListMergedObject(id ? cityList.data : cityList.data.filter(item => item.active), "name", "id")} value={localCity} setValue={setLocalCity} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)} />
                                    </div>
                                </fieldset>
                                <fieldset className='frame my-1'>
                                    <legend className='sub-heading'>Employee Status</legend>
                                    <div className='grid grid-cols-1 my-2'>
                                        <DropdownInput name="Status" options={statusDropdown} value={active} setValue={setActive} readOnly={readOnly} disabled={(childRecord.current > 0)} />
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
