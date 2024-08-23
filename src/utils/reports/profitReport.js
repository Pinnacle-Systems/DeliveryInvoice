// import prisma from "../../models/getPrisma";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default async function profitReport(startDateStartTime, endDateEndTime) {
    return await prisma.$queryRaw`
        SELECT 
            Product,
            Uom,
            Qty,
            FORMAT(purchaseRate, 2) AS 'Purchase Rate',
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
                        SELECT SUM(subquery.purchaseAmount) / SUM(subquery.qty)
                        FROM (
                            SELECT 
                                d.purchaseRate,
                                d.qty,
                                d.purchaseRate * d.qty AS purchaseAmount
                            FROM (
                                SELECT 
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
                                    ) AS purchaseRate,
                                    salesbillitems.qty
                                FROM
                                    salesbillitems
                                JOIN 
                                    salesbill sb ON sb.id = salesbillitems.salesbillid
                                WHERE 
                                    sb.createdAt BETWEEN ${startDateStartTime} AND ${endDateEndTime}
                                    AND salesbillitems.productId = product.id
                            ) d
                        ) subquery
                    ), 2
                ) AS purchaseRate,
                ROUND(
                    SUM(salesbillitems.qty * salesbillitems.price), 2
                ) AS saleAmount,
                ROUND(
                    (
                        SELECT SUM(subquery.purchaseAmount)
                        FROM (
                            SELECT 
                                d.qty,
                                d.purchaseRate * d.qty AS purchaseAmount
                            FROM (
                                SELECT 
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
                                    ) AS purchaseRate,
                                    salesbillitems.qty
                                FROM
                                    salesbillitems
                                JOIN 
                                    salesbill sb ON sb.id = salesbillitems.salesbillid
                                WHERE 
                                    sb.createdAt BETWEEN ${startDateStartTime} AND ${endDateEndTime}
                                    AND salesbillitems.productId = product.id
                            ) d
                        ) subquery
                    ), 2
                ) AS purchaseAmount
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

