import React from 'react'
import secureLocalStorage from 'react-secure-storage';

import { findFromList, getDateFromDateTime } from '../../../Utils/helper';
import moment from 'moment';
import { useGetProductQuery } from '../../../redux/services/ProductMasterService';


export default function   Form({ poBillItems, innerRef, date, name,id, contactMobile,  docId }) {
  const currTime = new Date().toLocaleTimeString();


  const branchId = secureLocalStorage.getItem(
    sessionStorage.getItem("sessionId") + "currentBranchId"
  )



  const params = { companyId: secureLocalStorage.getItem(sessionStorage.getItem("sessionId") + "userCompanyId") }

  const { data: productList } =
  useGetProductQuery({ params });

  
  function getTotal(field1, field2) {
    const total = poBillItems.reduce((accumulator, current) => {

      return accumulator + parseFloat(current[field1] && current[field2] ? current[field1] * current[field2] : 0)
    }, 0)
    return parseFloat(total)
  }

  return (
    <div className=" w-full  small-print" id='poPrint' ref={innerRef}>
      <h1 className='text-center text-2xl font-semibold mt-3'>CASH BILL</h1>

      <hr className="border-t-2 border-dashed border-gray-600 w-full " />

      <div className=' text-center   text-sm mt-1 pl-2  grid grid-cols-2 w-45'>
        <div className=' text-start py-2 text-sm'>
          <span className="font-bold col-span-1">Bill.No</span>
          <span>:</span>
          <span className='col-span-2'> {docId} </span>
        </div>
        <div className=' text-start py-2 text-sm'>
          <span className="font-bold col-span-1">Bill.Date</span>
          <span>:</span>
          <span className='col-span-2'>{moment(date).format("DD-MM-YYYY")}</span>
        </div>
        <div className=' text-start py-2 text-sm'>
          <span className="font-bold col-span-1">Time</span>
          <span>:</span>
          <span className='col-span-2'>{currTime}</span>
        </div>
        <div className=' text-start py-2 text-sm'>
          <span className="font-bold col-span-1">Sl.Name</span>
          <span>: </span>
          <span className='col-span-2'>{name}</span>
        </div>
      </div>
      <div class="flex items-center">
        <hr className="border-t-2 border-dashed border-gray-600 w-full " />

      </div>
      <div className='w-full  grid  p-1'>
        <table className="print  text-sm table-auto  w-full ">
          <thead className='bg-blue-200 top-0'>
            <tr className='border-none bor'>
              <th className=" table-data text-sm  w-6 text-center p-0.5">S.no</th>



              <th className=" table-data w-96 text-sm text-left p-2">Product Name</th>


              <th className="table-data text-sm  w-24 p-2">Qty</th>

              <th className="table-data  text-sm w-20 p-2">Rate</th>



              <th className="table-data text-sm w-20 p-0.5">Amount</th>



            </tr>
          </thead>
          <tr className="border-b-2 border-dashed border-gray-600 p-3"></tr>
          <tbody className='overflow-y-auto h-full w-full '>


            {(poBillItems ? poBillItems.filter(item => item?.Product?.name || item?.productId) : []).map((item, index) =>
              <tr key={index} className="w-full table-row bor ">
                <td className="table-data text-sm w-6 text-center px-1 py-3">
                  {index + 1}
                </td>
                <td className="table-data text-sm  text-left px-1 p-2">
                  {id ? item?.Product?.name :findFromList(item?.productId,productList?.data,"name")}
                </td>
                <td className="table-data text-sm  text-center px-1 p-2">
                  {item?.qty}
                </td>
                <td className="table-data text-sm text-center px-1 p-2">
                  {item.salePrice}
                </td>
                <td className="table-data text-sm text-center px-1 p-2">
                  {item.salePrice * item.qty}
                </td>
              </tr>
            )}

            <tr className="border-b-2 border-dashed border-gray-600 "></tr>
            <tr className='bg-blue-200   font-bold bor '>
              <td className="table-data text-lg text-center w-10 font-bold p-3" colSpan={4}>Total</td>
              <td className="table-data text-lg  text-center pr-1">{getTotal("qty", "salePrice").toFixed(2)}</td>
            </tr>

          </tbody>
        </table>
      </div>

    </div >
  )
}

