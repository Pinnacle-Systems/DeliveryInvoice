-- AlterTable
ALTER TABLE `deliverychallanitems` ADD COLUMN `sizeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `deliveryinvoiceitems` ADD COLUMN `sizeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `DeliveryChallanItems` ADD CONSTRAINT `DeliveryChallanItems_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `Size`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeliveryInvoiceItems` ADD CONSTRAINT `DeliveryInvoiceItems_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `Size`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
