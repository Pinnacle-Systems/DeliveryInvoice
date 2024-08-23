// import prisma from "../../models/getPrisma";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default async function profitReport(startDateStartTime, endDateEndTime) {
    return await prisma.$queryRaw`
        SELECT 
            Product,
            Uom,
            Qty,
            FORMAT(purchaseAmount, 2) AS 'Purchase Amount',
            FORMAT(saleAmount, 2) AS 'Sale Amount',
            FORMAT(saleAmount - purchaseAmount, 2) AS Profit
        FROM (
            SELECT 
                product.name AS Product,
                uom.name AS Uom,
                SUM(salesbillitems.qty) AS Qty,
                ROUND(
                    (
                        SELECT SUM(subquery.purchaseAmount)
                        FROM (
                            SELECT 
                                d.product,
                                d.uom,
                                d.purchaseRate,
                                d.qty,
                                d.purchaseRate * d.qty AS purchaseAmount
                            FROM (
                                SELECT 
                                    product.name AS product,
                                    uom.name AS uom,
                                    salesbillitems.qty,
                                    (
                                        SELECT SUM(e.amount) / SUM(e.qty)
                                        FROM (
                                            SELECT 
                                                pobillitems.price * pobillitems.qty AS amount,
                                                pobillitems.qty
                                            FROM 
                                                pobillitems
                                            JOIN 
                                                purchasebill pb ON pb.id = pobillitems.purchaseBillId
                                            WHERE 
                                                pb.createdAt < sb.createdAt
                                                AND pobillitems.productId = salesbillitems.productId
                                        ) e
                                    ) AS purchaseRate
                                FROM
                                    salesbillitems
                                JOIN 
                                    salesbill sb ON sb.id = salesbillitems.salesbillid
                                LEFT JOIN 
                                    product ON product.id = salesbillitems.productId
                                LEFT JOIN 
                                    uom ON uom.id = salesbillitems.uomId
                                WHERE 
                                    sb.createdAt BETWEEN ${startDateStartTime} AND ${endDateEndTime}
                            ) d
                        ) subquery
                    ), 2
                ) AS purchaseAmount,
                ROUND(
                    SUM(salesbillitems.qty * salesbillitems.price), 2
                ) AS saleAmount
            FROM 
                salesbillitems
            LEFT JOIN 
                product ON product.id = salesbillitems.productId
            LEFT JOIN 
                uom ON uom.id = salesbillitems.uomId
            LEFT JOIN 
                salesbill sb ON sb.id = salesbillitems.salesbillid
            WHERE 
                sb.createdAt BETWEEN ${startDateStartTime} AND ${endDateEndTime}
            GROUP BY 
                salesbillitems.productId, product.name, salesbillitems.uomId, uom.name
        ) f
        ORDER BY 
            Product
    `;
}
