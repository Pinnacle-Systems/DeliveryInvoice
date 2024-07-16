import React, { useEffect, useState, useRef, useCallback } from "react";
import secureLocalStorage from "react-secure-storage";
import {
  useGetStateQuery,
  useGetStateByIdQuery,
  useAddStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
} from "../../../redux/services/StateMasterService";
import { useGetCountriesQuery } from "../../../redux/services/CountryMasterService";

import FormHeader from "../FormHeader";
import FormReport from "../FormReportTemplate";
import { toast } from "react-toastify";
import { TextInput, CheckBox, DropdownInput } from "../../../Inputs";
import ReportTemplate from "../ReportTemplate";
import { dropDownListObject } from '../../../Utils/contructObject';
import { useDispatch } from "react-redux";

const MODEL = "State Master";

export default function Form() {
  const [form, setForm] = useState(false);

  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [active, setActive] = useState(true);
  const [country, setCountry] = useState("");
  const [gstNo, setGstNo] = useState("");

  const [searchValue, setSearchValue] = useState("");

  const childRecord = useRef(0);
  const dispatch = useDispatch();

  const params = {
    companyId: secureLocalStorage.getItem(
      sessionStorage.getItem("sessionId") + "userCompanyId"
    ),
  };
  const { data: countriesList, isLoading: isCountryLoading, isFetching: isCountryFetching } =
    useGetCountriesQuery({ params });

  const { data: allData, isLoading, isFetching } = useGetStateQuery({ params, searchParams: searchValue });


  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetStateByIdQuery(id, { skip: !id });

  const [addData] = useAddStateMutation();
  const [updateData] = useUpdateStateMutation();
  const [removeData] = useDeleteStateMutation();

  const syncFormWithDb = useCallback((data) => {
    if (id) { setReadOnly(true); setActive(true) }
    setName(data?.name ? data.name : "");
    setCode(data?.code ? data.code : "");
    setActive(id ? (data?.active ? data.active : false) : true);
    setCountry(data?.countryId ? data.countryId : "");
    setGstNo(data?.gstNo ? data.gstNo : "");
    childRecord.current = data?.childRecord ? data?.childRecord : 0;
  }, [id]);

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    name, code, active, country, gstNo, id
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
      setId("")
      syncFormWithDb(undefined)
      toast.success(text + "Successfully");
      dispatch({
        type: `countryMaster/invalidateTags`,
        payload: ['Countries'],
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
          type: `countryMaster/invalidateTags`,
          payload: ['Countries'],
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
  const tableHeaders = [
    "Code", "Name", "Country", "Status"
  ]
  const tableDataNames = ["dataObj.code", "dataObj.name", "dataObj.country.name", 'dataObj.active ? ACTIVE : INACTIVE']

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
          childRecord={childRecord.current}
        />

        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-x-2 overflow-clip">

          <div className="col-span-3 grid md:grid-cols-2 border overflow-auto">
            <div className="mr-1 md:ml-2">
              <fieldset className="frame my-1">
                <legend className="sub-heading">State Info</legend>
                <div className="grid grid-cols-1 my-2">
                  <TextInput
                    name="State Name"
                    type="text"
                    value={name}
                    setValue={setName}
                    required={true}
                    readOnly={readOnly}
                    disabled={(childRecord.current > 0)}
                  />
                  <TextInput
                    name="Code"
                    type="text"
                    value={code}
                    setValue={setCode}
                    required={true}
                    readOnly={readOnly}
                    disabled={(childRecord.current > 0)}
                  />
                  <TextInput
                    name="GST No"
                    type="text"
                    value={gstNo}
                    setValue={setGstNo}
                    readOnly={readOnly}
                    disabled={(childRecord.current > 0)}
                  />
                  <DropdownInput
                    name="Country"
                    options={dropDownListObject(id ? countriesList.data : countriesList.data.filter(item => item.active), "name", "id")}
                    value={country}
                    setValue={setCountry}
                    required={true}
                    readOnly={readOnly}
                  />
                  <CheckBox
                    name="Active"
                    readOnly={readOnly}
                    value={active}
                    setValue={setActive}
                  />
                </div>
              </fieldset>
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
