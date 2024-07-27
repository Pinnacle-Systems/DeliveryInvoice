import React, { useEffect, useState } from 'react';
import { useGetStockByIdQuery } from '../../../redux/services/StockService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from '../../../redux/features/opentabs';


const SalesPrice = ({ productId, poBillItems, setPoBillItems, index, readOnly, item, id,isOn }) => {
    const { data: singleProduct } = useGetStockByIdQuery({
        params: {
            productId,
            salesBillItemsId: id,isOn
        }
    }, { skip: !productId, id });
    const dispatch = useDispatch()
    const [salePrice, setSalePrice] = useState([]);

    useEffect(() => {
        if (singleProduct?.data) {
            setSalePrice(singleProduct.data);
        }
    }, [singleProduct]);

    const handleInputChange = (value, index, field, stockQty) => {
        const updatedItems = [...poBillItems];
        updatedItems[index][field] = value;

        if (field === "qty" && parseFloat(stockQty) < parseFloat(value)) {
            toast.info("Sales Qty cannot be more than Stock Qty", { position: 'top-center' });
            return;
        }

        setPoBillItems(updatedItems);
    };

    let stockQty = salePrice.find(i => i.salePrice === poBillItems[index]?.salePrice)?.stockQty || 0;

    const navigate = useNavigate();

    const handleButtonClick = () => {
       dispatch(push({id:32, name:'OPENING STOCK'}))
    };

    return (
        <>
            <td className='table-data'>
                {stockQty}
            </td>
            <td className="table-data w-44">
                <input
                    type="number"
                    className="text-right rounded py-1 px-1 w-full table-data-input"
                    onFocus={(e) => e.target.select()}
                    value={item.qty || ""}
                    disabled={readOnly}
                    onChange={(e) =>
                        handleInputChange(e.target.value, index, "qty", stockQty)
                    }
                    onBlur={(e) =>
                        handleInputChange(
                            parseFloat(e.target.value).toFixed(2),
                            index,
                            "qty",
                            stockQty
                        )
                    }
                />
            </td>
            <td className="table-data w-44">
                <input
                    type="number"
                    className="text-right rounded py-1 px-1 w-full table-data-input"
                    onFocus={(e) => e.target.select()}
                    value={item.price || ""}
                    disabled={readOnly}
                    onChange={(e) =>
                        handleInputChange(e.target.value, index, "price")
                    }
                    onBlur={(e) =>
                        handleInputChange(
                            parseFloat(e.target.value).toFixed(2),
                            index,
                            "price"
                        )
                    }
                />
            </td>
            <td className="table-data w-44">
                <input
                    type="number"
                    className="text-right rounded py-1 px-1 w-full table-data-input"
                    onFocus={(e) => e.target.select()}
                    value={
                        item.qty && item.price
                            ? (parseFloat(item.qty) * parseFloat(item.price)).toFixed(2)
                            : 0
                    }
                    disabled
                />
            </td>
            <td className="table-data w-44 flex items-center justify-center">
            <button
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-1 mt-2 px-4 border-b-4 border-emerald-700 hover:border-emerald-500 rounded"
                onClick={handleButtonClick}
            >
                Add Stock
            </button>
        </td>
        </>
    );
};

export default SalesPrice;
