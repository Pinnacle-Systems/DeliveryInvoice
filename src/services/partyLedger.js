import prisma from "../models/getPrisma.js";
import moment from "moment"

export async function getPartyLedgerReport(partyId, startDate, endDate) {
    console.log(partyId,"partyId")
    const startDateFormatted = moment(startDate).format("YYYY-MM-DD");
    const endDateFormatted = moment(endDate).format("YYYY-MM-DD");
    const openingBalanceResults = await prisma.$queryRaw`
    select coalesce(sum(amount),0) as openingBalance from (select 'Sales' as type, docId as transId, createdAt as date, coalesce(netBillValue,0) as amount
from salesbill
where isOn = 1 and supplierId = ${partyId} and (DATE(createdAt) < ${startDateFormatted})
union
select 'Payment' as type, docId as transId, createdAt as date, 0 - coalesce(paidAmount,0)
from payment
where  partyid = ${partyId} and (DATE(createdAt) < ${startDateFormatted})) a
    `;

    const closingBalanceResults = await prisma.$queryRaw`
    select coalesce(sum(amount),0) as closingBalance from (select 'Sales' as type, docId as transId, createdAt as date, netBillValue as amount
from salesbill
where isOn = 1 and supplierId = ${partyId} and (DATE(createdAt) <= ${endDateFormatted})
union
select 'Payment' as type, docId as transId, createdAt as date, 0 - paidAmount 
from payment
where  partyid = ${partyId} and (DATE(createdAt) <= ${endDateFormatted})) a
    `;

    const data = await prisma.$queryRaw`
   select * from (select 'Sales' as type, docId as transId, createdAt as date, netBillValue as amount, '' as paymentType ,'' as paymentRefNo
from salesbill
where isOn = 1 and supplierId = ${partyId} and (DATE(createdAt) between ${startDateFormatted} and ${endDateFormatted})
union
select 'Payment' as type, docId as transId, createdAt as date, paidAmount,paymentMode as paymentType, paymentRefNo
from payment 
where partyid = ${partyId} and (DATE(createdAt) between ${startDateFormatted} and ${endDateFormatted})) a
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
        salesbill.isOn = 1
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