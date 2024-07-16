import React, { useEffect, useState, useRef, useCallback } from "react";
import secureLocalStorage from "react-secure-storage";
import {
    useGetCityQuery,
    useGetCityByIdQuery,
    useAddCityMutation,
    useUpdateCityMutation,
    useDeleteCityMutation,
} from "../../../redux/services/CityMasterService";
import { useGetStateQuery } from "../../../redux/services/StateMasterService";

import FormHeader from "../FormHeader";
import FormReport from "../FormReportTemplate";
import { toast } from "react-toastify";
import { TextInput, CheckBox, DropdownInput, DisabledInput } from "../../../Inputs";
import ReportTemplate from "../ReportTemplate";
import { dropDownListObject } from '../../../Utils/contructObject';
import Loader from "../Loader";
import { useDispatch } from "react-redux";

const MODEL = "City Master";

export default function Form() {
    const [form, setForm] = useState(false);

    const [readOnly, setReadOnly] = useState(false);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [active, setActive] = useState(true);
    const [state, setState] = useState("")

    const [searchValue, setSearchValue] = useState("");

    const childRecord = useRef(0);
    const dispatch = useDispatch();

    const params = {
        companyId: secureLocalStorage.getItem(
            sessionStorage.getItem("sessionId") + "userCompanyId"
        ),
    };
    const { data: stateList, isLoading: isStateLoading, isFetching: isStateFetching } = useGetStateQuery({params}, {skip: !form});
    const { data: allData, isLoading, isFetching } = useGetCityQuery({ params, searchParams: searchValue });


    const {
        data: singleData,
        isFetching: isSingleFetching,
        isLoading: isSingleLoading,
    } = useGetCityByIdQuery(id, {skip: !id});

    const [addData] = useAddCityMutation();
    const [updateData] = useUpdateCityMutation();
    const [removeData] = useDeleteCityMutation();

    const syncFormWithDb = useCallback((data) => {
        if (id) setReadOnly(true);
        setName(data?.name ? data.name : "");
        setCode(data?.code ? data.code : "");
        setActive(id ? (data?.active ? data.active : false) : true);
        setState(data?.stateId ? data.stateId : "");
        childRecord.current = data?.childRecord ? data?.childRecord : 0;
    }, [id]);

    useEffect(() => {
        syncFormWithDb(singleData?.data);
    }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

    const data = {
        name, code, active, state, id
    };

    const validateData = (data) => {
        if (data.name && data.code) {
            return true;
        }
        return false;
    };

    const handleSubmitCustom = async (callback, data, text) => {
        try {
            let returnData = await callback(data).unwrap();
            setId(returnData.data.id)
            toast.success(text + "Successfully");
            dispatch({
                type: `StateMaster/invalidateTags`,
                payload: ['State'],
              });  
            
        } catch (error) {
            console.log("handle");
        }
    };

    const saveData = () => {
        if (!validateData(data)) {
            toast.info("Please fill all required fields...!", {
                position: "top-center",
            });
            return;
        }
        if (!window.confirm("Are you sure save the details ...?")) {
            return;
        }
        if (id) {
            handleSubmitCustom(updateData, data, "Updated");
        } else {
            handleSubmitCustom(addData, data, "Added");
        }
    };

    const deleteData = async () => {
        if (id) {
            if (!window.confirm("Are you sure to delete...?")) {
                return;
            }
            try {
                await removeData(id)
                setId("");
                dispatch({
                    type: `StateMaster/invalidateTags`,
                    payload: ['State'],
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
    const tableHeaders = ["City Name", "Code", "State", "Status"]
    const tableDataNames = ["dataObj.code", "dataObj.name", "dataObj.state.name", 'dataObj.active ? ACTIVE : INACTIVE']
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
    function countryFromState() {
        return state ? stateList.data.find(item => item.id === parseInt(state)).country?.name : ""
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
                    // childRecord={childRecord.current}
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-x-2 overflow-clip">
                    {isStateLoading || isStateFetching
                        ?
                        <Loader />
                        :
                        <div className="col-span-3 grid md:grid-cols-2 border overflow-auto">
                            <div className='col-span-3 grid md:grid-cols-2 border overflow-auto'>
                                <div className='mr-1 md:ml-2'>
                                    <fieldset className='frame my-1'>
                                        <legend className='sub-heading'>City Info</legend>
                                        <div className='grid grid-cols-1 my-2'>
                                            <TextInput name="City Name" type="text" value={name} setValue={setName} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)}/>
                                            <TextInput name="Code" type="text" value={code} setValue={setCode} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)}/>
                                            <DropdownInput name="State" options={dropDownListObject(id?stateList.data:stateList.data.filter(item=>item.active), "name", "id")} value={state} setValue={setState} required={true} readOnly={readOnly} disabled={(childRecord.current > 0)}/>
                                            <DisabledInput name="Country" type="text" value={countryFromState()} disabled={(childRecord.current > 0)}/>
                                            <CheckBox name="Active" readOnly={readOnly} value={active} setValue={setActive} />
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    }
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
