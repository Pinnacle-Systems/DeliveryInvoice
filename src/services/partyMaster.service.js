import { PrismaClient } from '@prisma/client'
import { NoRecordFound } from '../configs/Responses.js';
import { getPartyOverAllReport,getPartyLedgerReport,getPartyLedgerReportCus,getPartyPurchaseOverAllReport } from './partyLedger.js';

const prisma = new PrismaClient()


async function get(req) {
    const { companyId, active,isPartyOverAllReport,searchValue, partyId, startDate, endDate,isPartyLedgerReport,isPartyLedgerReportCus,isPartyPurchaseOverAllReport } = req.query
    if (isPartyLedgerReport) {
        const data = await getPartyLedgerReport(partyId, startDate, endDate)
        return { statusCode: 0, data };
    }
    if (isPartyLedgerReportCus) {
        const data = await getPartyLedgerReportCus(partyId, startDate, endDate)
        return { statusCode: 0, data };
    }
    if (isPartyOverAllReport) {
        const data = await getPartyOverAllReport(searchValue)
        return { statusCode: 0, data };

    }
    if(isPartyPurchaseOverAllReport){
        const data = await getPartyPurchaseOverAllReport(searchValue)
        return { statusCode: 0, data };
    }
    const data = await prisma.party.findMany({
        where: {
            companyId: companyId ? parseInt(companyId) : undefined,
            active: active ? Boolean(active) : undefined,
        },
        include: {
          
            PurchaseBillSupplier: {
                select: {
                    netBillValue: true,
                    supplierId: true
                }
            },
            SalesBillSupplier: {
                select: {
                    netBillValue: true,
                    supplierId: true,
                    isOn:true
                }
            },
            Payment: {
                select: {
                    paidAmount: true,
                    partyId: true,
                    paymentType: true,
                    discount: true
                }
            }
        }
       
    });
    return { statusCode: 0, data };
}

async function getOne(id) {
    const data = await prisma.party.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            City: {
                select: {
                    name: true,
                    state: true
                }
            },
            PurchaseBillSupplier: {
                select: {
                    ourPrice: true,
                    supplierId: true
                }
            },
            SalesBillSupplier: {
                select: {
                    netBillValue: true,
                    supplierId: true,
                    isOn:true
                }
            },
            Payment: {
                select: {
                    paidAmount: true,
                    partyId: true,
                    paymentType: true,
                    discount: true
                }
            }
        }
    });

    if (!data) return NoRecordFound("party");

    const totalPurchaseNetBillValue = data.PurchaseBillSupplier.reduce((acc, bill) => acc + (bill.ourPrice || 0), 0);
    const totalSalesNetBillValue = data.SalesBillSupplier.reduce((acc, bill) =>
        bill.isOn === true ? acc + (bill.netBillValue || 0) : acc, 0);
    
    const totalPaymentSalesBill = data.Payment.reduce((acc, payment) => 
        payment.paymentType === 'SALESBILL' ? acc + (payment.paidAmount || 0) : acc, 0);
    const totalDiscount = data.Payment.reduce((acc, payment) => acc + (payment.discount || 0), 0);
 

    const totalPaymentPurchaseBill = data.Payment.reduce((acc, payment) => 
        payment.paymentType === 'PURCHASEBILL' ? acc + (payment.paidAmount || 0) : acc, 0);

    const childRecord = data.PurchaseBillSupplier.length + data.SalesBillSupplier.length;

    return { 
        statusCode: 0, 
        data: { 
            ...data, 
            totalPurchaseNetBillValue, 
            totalSalesNetBillValue, 
            totalPaymentSalesBill, 
            totalPaymentPurchaseBill, 
            totalDiscount,
            childRecord 
        } 
    };
}



async function getSearch(req) {
    const { searchKey } = req.params
    const { companyId, active } = req.query
    const data = await prisma.party.findMany({
        where: {
            companyId: companyId ? parseInt(companyId) : undefined,
            active: active ? Boolean(active) : undefined,
            OR: [
                {
                    name: {
                        contains: searchKey,
                    },
                },
                {
                    code: {
                        contains: searchKey,
                    },
                },
            ],
        }
    })
    return { statusCode: 0, data: data };
}

async function create(body) {
    const { name, code, aliasName, displayName, address,isSupplier, isCustomer,
        cityId, pincode, panNo, tinNo, cstNo, cstDate,
        cinNo, faxNo, email, website, contactPersonName,contactMobile,
        gstNo, currencyId, costCode,soa,coa, 
        companyId, active, userId } = await body
    const data = await prisma.party.create(
        {
            data: {
                name, code, aliasName, displayName, address,isSupplier, isCustomer,
                cityId: cityId ? parseInt(cityId): undefined, pincode : pincode ? parseInt(pincode): undefined, 
                panNo, tinNo, cstNo, cstDate: cstDate ? new Date(cstDate) : undefined,
                cinNo, faxNo, email, website, contactPersonName,
                gstNo, currencyId: currencyId ? parseInt(currencyId): undefined, costCode, 
                createdById: userId ? parseInt(userId): undefined,
                companyId: parseInt(companyId), active,coa: coa? parseInt(coa):parseInt(0),soa : soa? parseInt(soa):parseInt(0),
                contactMobile: contactMobile ? parseInt(contactMobile) : undefined,
              
            }
        }
    )
    return { statusCode: 0, data };
}

async function update(id, body) {
    const { name, code, aliasName, displayName, address,isSupplier, isCustomer,
        cityId, pincode, panNo, tinNo, cstNo, cstDate,
        cinNo, faxNo, email, website, contactPersonName,contactMobile,
        gstNo,coa,soa,
        companyId, active, userId } = await body
        
    const dataFound = await prisma.party.findUnique({
        where: {
            id: parseInt(id)
        }
    })
    if (!dataFound) return NoRecordFound("party");
    const data = await prisma.party.update({
        where: {
            id: parseInt(id),
        },
        data: {
            name, code, aliasName, displayName, address,isSupplier, isCustomer,
            cityId: cityId ? parseInt(cityId): undefined, pincode : pincode ? parseInt(pincode): undefined, 
            panNo, tinNo, cstNo, cstDate: cstDate ? new Date(cstDate) : undefined,
            cinNo, faxNo, email, website, contactPersonName,
            gstNo, 
            createdById: userId ? parseInt(userId): undefined,
            companyId: parseInt(companyId), active,
            contactMobile: contactMobile ? parseInt(contactMobile) : undefined,coa: coa? parseInt(coa):parseInt(0),soa : soa? parseInt(soa): parseInt(0),
        }
    })
    return { statusCode: 0, data };
};

async function remove(id) {
    const data = await prisma.party.delete({
        where: {
            id: parseInt(id)
        },
    })
    return { statusCode: 0, data };
}

export {
    get,
    getOne,
    getSearch,
    create,
    update,
    remove
}
