export default async function profitReport(startDateStartTime, endDateEndTime) {
    return await prisma.$queryRaw`
      SELECT 
    pr.id AS productId,
    pr.name AS productName,
    
    COALESCE(SUM(sbi.totalSaleQty), 0) AS totalSaleQty,
    COALESCE(SUM(sbi.totalSaleValue), 0) AS totalSales,
    COALESCE(SUM(pbi.totalQty), 0) AS totalPurchaseQty,
    COALESCE(SUM(pbi.totalPurchaseValue), 0) AS totalPurchases,
    COALESCE(SUM(sbi.totalSaleValue), 0) - COALESCE(SUM(pbi.totalPurchaseValue) , 0)- COALESCE(SUM(Obi.totalOpeningValue),0) AS profit,
    
    COALESCE(sbi.averageSalePrice, 0) AS averageSalePrice,
    COALESCE(pbi.averagePurchaseRate, 0) AS averagePurchaseRate,
    COALESCE(Obi.totalOpenQty, 0) AS totalOpenQty,
    COALESCE(Obi.totalOpeningValue, 0) AS totalOpeningValue
    
FROM 
    Product pr
LEFT JOIN (
    SELECT 
        sbi.productId,
        SUM(sbi.qty) AS totalSaleQty,
        SUM(sbi.price * sbi.qty) AS totalSaleValue,
        AVG(sbi.price) AS averageSalePrice
    FROM 
        SalesBillItems sbi
    JOIN SalesBill sb ON sb.id = sbi.salesbillId    
    WHERE
        sb.createdAt BETWEEN ${startDateStartTime} AND ${endDateEndTime}
    GROUP BY 
        sbi.productId
) sbi ON pr.id = sbi.productId
LEFT JOIN (
    SELECT 
        pbi.productId,
        SUM(pbi.qty) AS totalQty,
        SUM(pbi.price * pbi.qty) AS totalPurchaseValue,
        AVG(pbi.price) AS averagePurchaseRate
    FROM 
        PoBillItems pbi
    JOIN PurchaseBill pb ON pb.id = pbi.purchasebillId    
    WHERE
        pb.createdAt BETWEEN ${startDateStartTime} AND ${endDateEndTime}
    GROUP BY 
        pbi.productId
) pbi ON pr.id = pbi.productId
LEFT JOIN (
    SELECT 
        Obi.productId,
        SUM(Obi.qty) AS totalOpenQty,
        SUM(Obi.qty * pbi.price ) AS totalOpeningValue
    FROM 
        OpeningStockItems Obi
    JOIN OpeningStock Ob ON Ob.id = Obi.openingStockId
    JOIN pobillitems pbi ON pbi.productId = Obi.productId
      WHERE
        Ob.createdAt BETWEEN ${startDateStartTime} AND ${endDateEndTime}
    
    GROUP BY 
        Obi.productId
) Obi ON pr.id = Obi.productId
GROUP BY 
    pr.id, pr.name, sbi.averageSalePrice, pbi.averagePurchaseRate, Obi.totalOpenQty, Obi.totalOpeningValue;

    `;
}
