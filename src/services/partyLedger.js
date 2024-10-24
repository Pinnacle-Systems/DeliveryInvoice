import prisma from "../models/getPrisma.js";
import moment from "moment"

export async function getPartyLedgerReport(partyId, startDate, endDate) {
    console.log(partyId,"partyId")
    const startDateFormatted = moment(startDate).format("YYYY-MM-DD");
    const endDateFormatted = moment(endDate).format("YYYY-MM-DD");
    const openingBalanceResults = await prisma.$queryRaw`
    select coalesce(sum(amount),0) as openingBalance from (select 'Sales' as type, docId as transId, selectedDate as date, coalesce(netBillValue,0) as amount
from salesbill
where isOn = 1 and supplierId = ${partyId} and (DATE(selectedDate) < ${startDateFormatted})
union
select 'Payment' as type, docId as transId, cvv as date, 0 - coalesce(paidAmount,0)- discount
from payment
where  partyid = ${partyId} and paymentType = 'SALESBILL' and (DATE(cvv) < ${startDateFormatted})) a
    `;

    const closingBalanceResults = await prisma.$queryRaw`
    select coalesce(sum(amount),0) as closingBalance from (select 'Sales' as type, docId as transId, selectedDate as date, netBillValue as amount
from salesbill
where isOn = 1 and supplierId = ${partyId} and (DATE(selectedDate) <= ${endDateFormatted})
union
select 'Payment' as type, docId as transId, cvv as date, 0 - paidAmount -discount
from payment
where  partyid = ${partyId} and paymentType = 'SALESBILL' and (DATE(cvv) <= ${endDateFormatted})) a
    `;

    const data = await prisma.$queryRaw`
   select * from (select 'Sales' as type, docId as transId, selectedDate as date, netBillValue as amount, '' as paymentType ,'' as paymentRefNo
from salesbill
where isOn = 1 and supplierId = ${partyId} and (DATE(selectedDate) between ${startDateFormatted} and ${endDateFormatted})
union
select 'Payment' as type, docId as transId, cvv as date, paidAmount+ discount,paymentMode as paymentType, paymentRefNo
from payment 
where partyid = ${partyId} and paymentType = 'SALESBILL' and (DATE(cvv) between ${startDateFormatted} and ${endDateFormatted})) a
order by date;
    `;
    const partyDetails = await prisma.party.findUnique({
        where: {
            id: parseInt(partyId)
        },
        select: {
            name: true,
            coa: true
        }
    })
    console.log(typeof partyDetails.coa)
    return {
        openingBalance:parseFloat(openingBalanceResults[0]?.openingBalance)  + parseFloat(partyDetails.coa) ,
        closingBalance:parseFloat( closingBalanceResults[0]?.closingBalance) + parseFloat(partyDetails.coa),
        data,
        partyDetails
    }
}
export async function getPartyLedgerReportCus(partyId, startDate, endDate) {
    console.log(partyId,"partyIdsss")
    const startDateFormatted = moment(startDate).format("YYYY-MM-DD");
    const endDateFormatted = moment(endDate).format("YYYY-MM-DD");
    const openingBalanceResults = await prisma.$queryRaw`
    select coalesce(sum(amount),0) as openingBalance from (select 'Purchase' as type, docId as transId, selectedDate as date, coalesce(ourPrice,0) as amount
from purchasebill
where  supplierId = ${partyId} and (DATE(selectedDate) < ${startDateFormatted})
union
select 'Payment' as type, docId as transId, cvv as date, 0 - coalesce(paidAmount,0)
from payment
where  partyid = ${partyId} and paymentType = 'PURCHASEBILL' and (DATE(cvv) < ${startDateFormatted})) a
    `;

    const closingBalanceResults = await prisma.$queryRaw`
    select coalesce(sum(amount),0) as closingBalance from (select 'Purchase' as type, docId as transId, selectedDate as date, ourPrice as amount
from purchasebill
where supplierId = ${partyId} and (DATE(selectedDate) <= ${endDateFormatted})
union
select 'Payment' as type, docId as transId, cvv as date, 0 - paidAmount - discount
from payment
where  partyid = ${partyId} and paymentType = 'PURCHASEBILL' and (DATE(cvv) <= ${endDateFormatted})) a
    `;

    const data = await prisma.$queryRaw`
   select * from (select 'Purchase' as type, docId as transId, selectedDate as date, ourPrice as amount, '' as paymentType ,'' as paymentRefNo
from purchasebill
where supplierId = ${partyId} and (DATE(selectedDate) between ${startDateFormatted} and ${endDateFormatted})
union
select 'Payment' as type, docId as transId, cvv as date, paidAmount+ discount,paymentMode as paymentType, paymentRefNo
from payment 
where partyid = ${partyId} and paymentType = 'PURCHASEBILL' and (DATE(cvv) between ${startDateFormatted} and ${endDateFormatted})) a
order by date;
    `;
    const partyDetails = await prisma.party.findUnique({
        where: {
            id: parseInt(partyId)
        },
        select: {
            name: true,
            soa: true
        }
    })
    console.log(typeof partyDetails.coa)
    return {
        openingBalance:parseFloat(openingBalanceResults[0]?.openingBalance)  + parseFloat(partyDetails.soa) ,
        closingBalance:parseFloat( closingBalanceResults[0]?.closingBalance) + parseFloat(partyDetails.soa),
        data,
        partyDetails
    }
}


export async function getPartyOverAllReport(searchPartyName) {
    const sql = `SELECT 
    id, 
    name, 
    FORMAT(SUM(saleAmount), 2) AS saleAmount, 
    FORMAT(SUM(paymentAmount), 2) AS paymentAmount, 
    FORMAT(SUM(saleAmount) - SUM(paymentAmount), 2) AS balance
FROM (
    SELECT 
        party.id,
        party.name, 
        party.coa AS saleAmount, 
        0 AS paymentAmount 
    FROM 
        party
    where 
        isCustomer = '1'    

    UNION ALL

    SELECT 
        party.id, 
        party.name, 
        SUM(salesbill.netBillValue) AS saleAmount, 
        0 AS paymentAmount
    FROM 
        salesbill 
    JOIN 
        party 
    ON 
        party.id = salesbill.supplierId
    WHERE 
        salesbill.isOn = 1 AND isCustomer = 1
    GROUP BY 
        salesbill.supplierId, 
        party.name

    UNION ALL

    SELECT 
        party.id, 
        party.name, 
        0 AS saleAmount, 
        SUM(payment.paidAmount) AS paymentAmount
    FROM 
        payment 
    JOIN 
        party 
    ON 
        party.id = payment.partyId
        where paymentType = 'SALESBILL'
  
    GROUP BY 
        payment.partyId, 
        party.name
) a 
where a.name like '%${searchPartyName}%'
GROUP BY 
    id, 
    name
HAVING 
    SUM(saleAmount) > 0 OR SUM(paymentAmount) > 0 
ORDER BY 
    name
`
    return await prisma.$queryRawUnsafe(sql)
}
export async function getPartyPurchaseOverAllReport(searchPartyName) {
    const sql = `SELECT 
    id, 
    name, 
    FORMAT(SUM(purchaseAmount), 2) AS purchaseAmount, 
    FORMAT(SUM(paymentAmount), 2) AS paymentAmount, 
    FORMAT(SUM(purchaseAmount) - SUM(paymentAmount), 2) AS balance
FROM (
    SELECT 
        party.id,
        party.name, 
        party.soa AS purchaseAmount, 
        0 AS paymentAmount 
    FROM 
        party
         WHERE 
       isSupplier = 1
 

    UNION ALL

    SELECT 
        party.id, 
        party.name, 
        SUM(purchaseBill.netBillValue) AS purchaseAmount, 
        0 AS paymentAmount
    FROM 
        purchaseBill 
    JOIN 
        party 
    ON 
        party.id = purchaseBill.supplierId
   WHERE 
       isSupplier = 1
    GROUP BY 
        purchaseBill.supplierId, 
        party.name

    UNION ALL

    SELECT 
        party.id, 
        party.name, 
        0 AS purchaseAmount, 
        SUM(payment.paidAmount) AS paymentAmount
    FROM 
        payment 
    JOIN 
        party 
    ON 
        party.id = payment.partyId
        
        where paymentType = 'PURCHASEBILL'
         AND
       party.isSupplier = 1
  
    GROUP BY 
        payment.partyId, 
        party.name
) a 
where a.name like '%${searchPartyName}%'
GROUP BY 
    id, 
    name
HAVING 
    SUM(purchaseAmount) > 0 OR SUM(paymentAmount) > 0 
ORDER BY 
    name
`
    return await prisma.$queryRawUnsafe(sql)
}