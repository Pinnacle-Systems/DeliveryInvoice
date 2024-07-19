import React, { useEffect, useState } from 'react';
import { useGetStockByIdQuery } from '../../../redux/services/StockService';
import { toast } from 'react-toastify';

const SalesPrice = ({ productId, poBillItems, setPoBillItems, index, readOnly,date, item,id }) => {
    const { data: singleProduct } = useGetStockByIdQuery({
        params: {
            productId,
            createdAt: id ? date : undefined,

        }
    }, { skip: !productId,id });


    const [salePrice, setSalePrice] = useState([]);

    useEffect(() => {
        if (singleProduct && singleProduct.data) {
            setSalePrice(singleProduct.data);
        }
    }, [singleProduct]);

    const handleInputChange = (value, index, field, stockQty) => {
        const newBlend = JSON.parse(JSON.stringify(poBillItems));
        newBlend[index][field] = value;

        if (field === "qty" && parseFloat(stockQty) < parseFloat(value)) {
            toast.info("Sales Qty cannot be more than Stock Qty", { position: 'top-center' });
            return;
        }

        setPoBillItems(newBlend);
    };

    let stockQty = salePrice.find(i => i.salePrice === poBillItems[index]?.salePrice)?.stockQty;
    stockQty = stockQty ? stockQty : 0;

    return (
        <>
            <td className='table-data'>
                <>
                    {stockQty}
                </>
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
        </>
    );
};

export default SalesPrice;
