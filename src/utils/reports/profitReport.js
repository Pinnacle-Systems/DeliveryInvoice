// import prisma from "../../models/getPrisma";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function profitReport(startDateStartTime, endDateEndTime) {
    return await prisma.$queryRaw`
   select Product, Uom, Qty, FORMAT(purchaseAmount,2) as 'Purchase Amount', FORMAT(saleAmount,2) as 'Sale Amount', FORMAT(saleAmount - purchaseAmount, 2) as Profit from (SELECT 
    product.name AS Product,
    uom.name AS Uom,
    sum(qty) as Qty,
    sum(salePrice * qty) as saleAmount,
    ROUND((SELECT 
                    SUM(e.purchaseAmount)
                FROM
                    (SELECT 
                        d.product,
                            d.uom,
                            d.purchaseRate,
                            d.qty,
                            d.purchaseRate * qty AS purchaseAmount
                    FROM
                        (SELECT 
                        product.name AS product,
                            uom.name AS uom,
                            qty,
                            (SELECT 
                                    SUM(e.amount) / SUM(e.qty)
                                FROM
                                    (SELECT 
                                    pobillitems.price,
                                        pobillitems.qty,
                                        pobillitems.price * pobillitems.qty AS amount
                                FROM
                                    pobillitems
                                JOIN purchasebill pb ON pb.id = pobillitems.purchaseBillId
                                WHERE
                                    pb.createdAt < sb.createdAt
                                        AND pobillitems.productId = salesbillitems.productId
                                        AND pobillitems.uomId = salesbillitems.uomId) e) AS purchaseRate,
                            salePrice
                    FROM
                        salesbillitems
                    JOIN salesbill sb ON sb.id = salesbillitems.salesbillid
                    LEFT JOIN product ON product.id = salesbillitems.productId
                    LEFT JOIN uom ON uom.id = salesbillitems.uomId
                    WHERE
                        salesbillitems.productId = salesbillitemsout.productId
                            AND salesbillitems.uomid = salesbillitemsout.uomId
                            AND
                sb.createdAt BETWEEN ${startDateStartTime} AND ${endDateEndTime}
                            ) d) e),
            2) AS purchaseAmount
FROM
    salesbillitems salesbillitemsout
        LEFT JOIN
    product ON product.id = salesbillitemsout.productId
        LEFT JOIN
    uom ON uom.id = salesbillitemsout.uomId
    LEFT JOIN
    SalesBill salebill ON salebill.id = salesbillitemsout.salesBillId
    WHERE salebill.createdAt BETWEEN ${startDateStartTime} AND ${endDateEndTime}
GROUP BY salesbillitemsout.productId , product.name , salesbillitemsout.uomId , uom.name)f
    ORDER BY Product
    `
}