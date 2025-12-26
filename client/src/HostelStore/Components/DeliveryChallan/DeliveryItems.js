import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VIEW } from "../../../icons";
import Modal from "../../../UiComponents/Modal";
import DynamicRenderer from "./DynamicComponent";

const DeliveryItems = ({
    id,
    transType,
    deliveryItems,
    setDeliveryItems,
    readOnly,
    params,
    isSupplierOutside,
    taxTypeId,
    greyFilter,
    poMaterial,
    hsnData,
    supplierId,

    styleList,
    styleItemList,
    yarnList,
    uomList,
    colorList,
    countsList,

}) => {


    const [currentSelectedIndex, setCurrentSelectedIndex] = useState("")
    const [contextMenu, setContextMenu] = useState(null);



    console.log(deliveryItems, "deliveryItems")
    useEffect(() => {
        if (deliveryItems?.length >= 3) return
        const defaultUomId = uomList?.data?.find(
            item => item.name == "PCS"
        )?.id;
        setDeliveryItems(prev => {
            let newArray = Array?.from({ length: 3 - prev?.length }, () => {
                return {
                    styleId: "",
                    styleItemId: "",
                    uomId: defaultUomId,
                    colorId: "",
                    noOfBox: "",
                    qty: "",





                }
            })
            return [...prev, ...newArray]
        }
        )
    }, [setDeliveryItems, deliveryItems])


    const handleInputChange = (value, index, field) => {



        const newBlend = structuredClone(deliveryItems);




        newBlend[index][field] = value;



        setDeliveryItems(newBlend);
    };



    const addNewRow = () => {
        const newRow = {
            yarnId: "",
            qty: "0",
            tax: "0",
            colorId: "",
            uomId: "",
            price: "0",
            discountValue: "0.00",
            noOfBags: 0,
            weightPerBag: 0,
        };
        setDeliveryItems([...deliveryItems, newRow]);
    };








    const handleDeleteRow = (index) => {
        setDeliveryItems(prev => {
            if (prev.length <= 1) return prev;
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleDeleteAllRows = () => {
        setDeliveryItems((prevRows) => {
            if (prevRows.length <= 1) return prevRows;
            return [prevRows[0]];
        });
    };


    const handleRightClick = (event, rowIndex, type) => {
        event.preventDefault();
        setContextMenu({
            mouseX: event.clientX,
            mouseY: event.clientY,
            rowId: rowIndex,
            type,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };



    const [openModel, setOpenModel] = useState(false);
    const [component, setComponenet] = useState("")
    const [dynamicForm, setDynamicForm] = useState(true);

    return (
        <>
            <Modal
                isOpen={openModel}
                onClose={() => setOpenModel(false)}
                widthClass="w-[90%] h-[90%] bg-gray-200"
            >
                <DynamicRenderer
                    componentName={component}
                    dynamicForm={dynamicForm}
                    setDynamicForm={setDynamicForm}
                    // editingItem={editingItem}
                    onCloseForm={() => setOpenModel(false)}
                />
            </Modal>
            <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm max-h-[200px] overflow-auto">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-bold text-slate-700">List Of  DeliveryItems</h2>
                    <button className="font-bold text-slate-700 bord"

                    >
                    </button>

                </div>
                <div className={` relative w-full overflow-y-auto py-1`}>
                    <table className="w-full border-collapse table-fixed">
                        <thead className="bg-gray-200 text-gray-900">
                            <tr>
                                <th
                                    className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                                >
                                    S.No
                                </th>
                                <th

                                    className={`w-80 px-4 py-2 text-center font-medium text-[13px] `}
                                >
                                    Style No<span className="text-red-500">*</span>
                                </th>
                                {/* <th

                                    className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                >
                                    Hsn<span className="text-red-500">*</span>
                                </th> */}
                                <th

                                    className={`w-52 px-4 py-2 text-center font-medium text-[13px] `}
                                >
                                    Item<span className="text-red-500">*</span>
                                </th>
                                <th

                                    className={`w-9 px-4 py-2 text-center font-medium text-[13px] `}
                                >
                                    Hsn
                                </th>
                                <th

                                    className={`w-52 px-4 py-2 text-center font-medium text-[13px] `}
                                >
                                    Color<span className="text-red-500">*</span>
                                </th>
                                <th

                                    className={`w-16 px-3 py-2 text-center font-medium text-[13px] `}
                                >
                                    No of Box
                                </th>
                                <th

                                    className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                                >
                                    UOM<span className="text-red-500">*</span>
                                </th>


                                <th

                                    className={`w-16 px-4 py-2 text-center font-medium text-[13px] `}
                                >
                                    Qty<span className="text-red-500">*</span>
                                </th>



                                <th

                                    className={`w-16 px-3 py-2 text-center font-medium text-[13px] `}
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {(deliveryItems ? deliveryItems : [])?.map((row, index) =>
                                <tr className="border border-blue-gray-200 cursor-pointer "
                                    onContextMenu={(e) => {
                                        if (!readOnly) {
                                            handleRightClick(e, index, "shiftTimeHrs");
                                        }
                                    }}
                                >
                                    <td className="w-12 border border-gray-300 text-[11px]  text-center p-0.5 ">{index + 1}</td>

                                    <td className="py-0.5 border border-gray-300 text-[11px]">
                                        <div className="flex items-center gap-1">
                                            <select
                                                onKeyDown={(e) => {
                                                    if (e.key === "Delete") {
                                                        handleInputChange("", index, "styleId");
                                                    }
                                                }}
                                                tabIndex={0}
                                                className="text-left w-full rounded py-1 table-data-input"
                                                value={row.styleId}
                                                onChange={(e) =>
                                                    handleInputChange(e.target.value, index, "styleId")
                                                }
                                                onBlur={(e) =>
                                                    handleInputChange(e.target.value, index, "styleId")
                                                }
                                                disabled={readOnly}
                                            >
                                                <option value=""></option>
                                                {(id
                                                    ? styleList?.data
                                                    : styleList?.data?.filter((item) => item.active)
                                                )?.map((blend) => (
                                                    <option value={blend.id} key={blend.id}>
                                                        {blend?.name}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Plus button */}
                                            {/* <button
                                                disabled={readOnly}

                                                type="button"
                                                className="px-2 py-1 border rounded text-xs font-bold hover:bg-gray-200"
                                                onClick={() => {
                                                    // setComponenet("StyleMaster")
                                                    setOpenModel(true);

                                                }}
                                            >
                                                +
                                            </button> */}
                                        </div>
                                    </td>

                                    <td className="py-0.5 border border-gray-300 text-[11px] ">
                                        <select
                                            onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "styleItemId") } }}
                                            tabIndex={"0"} className='text-left w-full rounded py-1 table-data-input'
                                            value={row.styleItemId}
                                            onChange={(e) => handleInputChange(e.target.value, index, "styleItemId")}
                                            onBlur={(e) => {
                                                handleInputChange((e.target.value), index, "styleItemId")
                                            }
                                            }
                                            disabled={!row.styleId || readOnly}

                                        >
                                            <option >
                                            </option>
                                            {(id ? styleItemList?.data : styleItemList?.data?.filter(item => item.active))?.map((blend) =>
                                                <option value={blend.id} key={blend.id}>
                                                    {blend?.name}
                                                </option>)}
                                        </select>
                                    </td>
                                    <td className="py-0.5 border border-gray-300 text-[11px] text-right">{row.styleItemId ? 9988 : ""}</td>
                                    <td className="py-0.5 border border-gray-300 text-[11px] ">
                                        <select
                                            onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "colorId") } }}
                                            tabIndex={"0"} className='text-left w-full rounded py-1 table-data-input'
                                            value={row.colorId}
                                            onChange={(e) => handleInputChange(e.target.value, index, "colorId")}
                                            onBlur={(e) => {
                                                handleInputChange((e.target.value), index, "colorId")
                                            }
                                            }
                                            disabled={!row.styleItemId || readOnly }


                                        >
                                            <option >
                                            </option>
                                            {(id ? colorList?.data : colorList?.data?.filter(item => item.active))?.map((blend) =>
                                                <option value={blend.id} key={blend.id}>
                                                    {blend?.name}
                                                </option>)}
                                        </select>
                                    </td>
                                    <td className=" border border-gray-300 text-right text-[11px] py-1.5 px-2 text-xs">
                                        <input
                                            className=" rounded px-1 ml-2 w-full py-0.5 text-xs focus:outline-none text-right"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={row?.noOfBox}
                                            disabled={!row.colorId || readOnly}



                                            onFocus={e => e.target.select()}

                                            onKeyDown={(e) => {
                                                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                                            }}

                                            placeHolder="0.000"

                                            onChange={(e) => {
                                                const numVal = parseFloat(e.target.value) || 0;
                                                const balanceQty = Math.max(0, (parseFloat(row?.requiredQty) || 0) - (parseFloat(row?.alreadyPoqty) || 0));

                                                handleInputChange(numVal, index, "noOfBox", row.requiredQty, balanceQty);


                                            }}
                                            onBlur={(e) => {
                                                const balanceQty = Math.max(0, (parseFloat(row?.requiredQty) || 0) - (parseFloat(row?.alreadyPoqty) || 0));
                                                const val = e.target.value;
                                                const formatted = e.target.value === "" ? "" : parseFloat(e.target.value).toFixed(3);
                                                e.target.value = formatted;
                                                handleInputChange(val === "" ? 0 : formatted, index, "noOfBox", row.requiredQty, balanceQty);
                                            }}

                                        />
                                    </td>









                                    <td className="w-12 border border-gray-300 text-[11px] py-0.5">
                                        <select
                                            onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "uomId") } }}
                                            className='text-left w-full rounded py-1 table-data-input'
                                            value={row.noOfBox ? row.uomId : ""}
                                            onChange={(e) => handleInputChange(e.target.value, index, "uomId")}
                                            onBlur={(e) => {
                                                handleInputChange((e.target.value), index, "uomId")
                                            }
                                            }
                                            disabled={!row.noOfBox || readOnly}

                                        >

                                            <option hidden>
                                            </option>
                                            {(id ? uomList?.data : uomList?.data?.filter(item => item.active))?.map((blend) =>
                                                <option value={blend.id} key={blend.id}>
                                                    {blend.name}
                                                </option>
                                            )}
                                        </select>
                                    </td>


                                    <td className=" border border-gray-300 text-right text-[11px] py-1.5 px-2 text-xs">
                                        <input
                                            className=" rounded px-1 ml-2 w-full py-0.5 text-xs focus:outline-none text-right"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={row?.qty}

                                            disabled={!row.uomId || readOnly}


                                            onFocus={e => e.target.select()}

                                            onKeyDown={(e) => {
                                                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                                            }}

                                            placeHolder="0.000"

                                            onChange={(e) => {
                                                const numVal = parseFloat(e.target.value) || 0;
                                                const balanceQty = Math.max(0, (parseFloat(row?.requiredQty) || 0) - (parseFloat(row?.alreadyPoqty) || 0));

                                                handleInputChange(numVal, index, "qty", row.requiredQty, balanceQty);


                                            }}
                                            onBlur={(e) => {
                                                const balanceQty = Math.max(0, (parseFloat(row?.requiredQty) || 0) - (parseFloat(row?.alreadyPoqty) || 0));
                                                const val = e.target.value;
                                                const formatted = e.target.value === "" ? "" : parseFloat(e.target.value).toFixed(3);
                                                e.target.value = formatted;
                                                handleInputChange(val === "" ? 0 : formatted, index, "qty", row.requiredQty, balanceQty);
                                            }}

                                        />
                                    </td>




                                    <td className="w-40 py-0.5 border border-gray-300 text-[11px] text-right">
                                        <input
                                            readOnly
                                            className="w-full bg-transparent focus:outline-none focus:border-transparent text-right pr-2"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addNewRow();
                                                }
                                            }}

                                        />
                                    </td>



                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {contextMenu && (
                    <div
                        style={{
                            position: "absolute",
                            top: `${contextMenu.mouseY - 50}px`,
                            left: `${contextMenu.mouseX - 30}px`,

                            // background: "gray",
                            boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
                            padding: "8px",
                            borderRadius: "4px",
                            zIndex: 1000,
                        }}
                        className="bg-gray-100"
                        onMouseLeave={handleCloseContextMenu} // Close when the mouse leaves
                    >
                        <div className="flex flex-col gap-1">
                            <button
                                className=" text-black text-[12px] text-left rounded px-1"
                                onClick={() => {
                                    handleDeleteRow(contextMenu.rowId);
                                    handleCloseContextMenu();
                                }}
                            >
                                Delete{" "}
                            </button>
                            <button
                                className=" text-black text-[12px] text-left rounded px-1"
                                onClick={() => {
                                    handleDeleteAllRows();
                                    handleCloseContextMenu();
                                }}
                            >
                                Delete All
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default DeliveryItems;
