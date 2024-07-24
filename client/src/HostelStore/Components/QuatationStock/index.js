// src/components/ProductTable.js
import React, { useState } from 'react';
import { useGetStockQuery } from '../../../redux/services/StockService';
import secureLocalStorage from 'react-secure-storage';

const QuatationStock = () => {
  const [filterText, setFilterText] = useState('');
  const params = { companyId: secureLocalStorage.getItem(sessionStorage.getItem("sessionId") + "userCompanyId") }

  const branchId = secureLocalStorage.getItem(
    sessionStorage.getItem("sessionId") + "currentBranchId"
  );

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const { data: stockList } = useGetStockQuery({ params: { branchId } }); 
  const QuatationStock = stockList?.QuatationStock || [];
  console.log(QuatationStock,"stockList")

  const filteredStockList = stockList?.data.filter(product =>
    product.Product.toLowerCase().includes(filterText.toLowerCase())
  );
  console.log(filteredStockList,"filter")

  return (
    <div className="container mx-auto mt-5 px-4">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 md:mb-0">Product Inventory</h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Filter products..."
            value={filterText}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="w-6 h-6 ml-2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-emerald-700 text-white tracking-wider uppercase border-b border-gray-300">
            <tr>
              <th className="py-3 px-4 text-left ">Product</th>
              <th className="py-3 px-4 text-left ">Stock Qty</th>
              <th className="py-3 px-4 text-left ">Quotation Qty</th>
              <th className="py-3 px-4 text-left ">Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredStockList?.length > 0 ? (
              filteredStockList.map((product, index) => (
                <tr key={index} className="hover:bg-emerald-300 bg-amber-100 transition-colors">
                  <td className="py-3 px-4 border-b border-gray-200">{product.Product}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{product._sum.qty}</td>
                  <td className="py-3 px-4 border-b border-gray-200"> </td>
                  <td className="py-3 px-4 border-b border-gray-200">{product.balance}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-4 border-b border-gray-200 text-center text-gray-500">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuatationStock;
