import prisma from '../models/getPrisma.js';
import { NoRecordFound } from '../configs/Responses.js';
import { getDateFromDateTime, getYearShortCodeForFinYear } from '../utils/helper.js';
import { getTableRecordWithId } from '../utils/helperQueries.js';
import { getFinYearStartTimeEndTime } from '../utils/finYearHelper.js';


async function getNextDocId(branchId, shortCode, startTime, endTime) {
    let lastObject = await prisma.payment.findFirst({
        where: {
            branchId: parseInt(branchId),
            AND: [
                {
                    createdAt: {
                        gte: startTime

                    }
                },
                {
                    createdAt: {
                        lte: endTime
                    }
                }
            ],
        },
        orderBy: {
            id: 'desc'
        }
    });
    const branchObj = await getTableRecordWithId(branchId, "branch")
    let newDocId = `${branchObj.branchCode}/${24}/Pay/1`
    if (lastObject) {
        newDocId = `${branchObj.branchCode}/${24}/Pay/${parseInt(lastObject.docId.split("/").at(-1)) + 1}`
    }
    return newDocId
}

function manualFilterSearchData(searchBillDate, searchMobileNo, data) {
    return data.filter(item =>
        (searchBillDate ? String(getDateFromDateTime(item.createdAt)).includes(searchBillDate) : true)
        && (searchMobileNo ? String(item.contactMobile).includes(searchMobileNo) : true)
    )
}

async function get(req) {
    const { active, branchId, pagination, pageNumber, dataPerPage, searchDocId, searchBillDate, searchCustomerName, searchMobileNo, finYearId } = req.query
   console.log(finYearId,"finyearId")
    let data = await prisma.payment.findMany({
        where: {
            active: active ? Boolean(active) : undefined,
            docId: Boolean(searchDocId) ?
                {
                    contains: searchDocId
                }
                : undefined,
            Party: {
                name: Boolean(searchCustomerName) ? {
                    contains: searchCustomerName
                } : undefined
            },
            isDeleted: false,
        },
        include: {
            Party: {
                select: {
                    name: true
                }
            }
        }
    });
    data = manualFilterSearchData(searchBillDate, searchMobileNo, data)
    const totalCount = data.length
    if (pagination) {
        data = data.slice(((pageNumber - 1) * parseInt(dataPerPage)), pageNumber * dataPerPage)
    }
    let finYearDate = await getFinYearStartTimeEndTime(finYearId);
    const shortCode = finYearDate ? getYearShortCodeForFinYear(finYearDate?.startTime, finYearDate?.endTime) : "";
    let newDocId = finYearDate ? (await getNextDocId(branchId, shortCode, finYearDate?.startTime, finYearDate?.endTime)) : "";
    return { statusCode: 0, nextDocId: newDocId, data, totalCount };
}
async function getOne(id) {
    const childRecord = 0;
    const data = await prisma.payment.findUnique({
        where: {
            id: parseInt(id)
        },
    })
    if (!data) return NoRecordFound("purchaseBill");
    return { statusCode: 0, data: { ...data, ...{ childRecord } } };
}


async function getSearch(req) {
    const { searchKey } = req.params
    const { companyId, active } = req.query
    const data = await prisma.payment.findMany({
        where: {
            companyId: companyId ? parseInt(companyId) : undefined,
            active: active ? Boolean(active) : undefined,
            OR: [
                {
                    name: {
                        contains: searchKey,
                    },
                },
            ],
        }
    })
    return { statusCode: 0, data: data };
}



async function create(body) {
    let data;
    try {
        const { branchId, id, paymentMode, cvv, paymentType, paidAmount,discount,paymentRefNo, supplierId, userId,finYearId,totalBillAmount } = body;

        let finYearDate = await getFinYearStartTimeEndTime(finYearId);
        const shortCode = finYearDate ? getYearShortCodeForFinYear(finYearDate?.startTime, finYearDate?.endTime) : "";
        let newDocId = finYearDate ? (await getNextDocId(branchId, shortCode, finYearDate?.startTime, finYearDate?.endTime)) : "";

        await prisma.$transaction(async (tx) => {
            data = await tx.payment.create({
                data: {
                    docId: newDocId,
                    partyId: parseInt(supplierId),
                    branchId: parseInt(branchId),
                    paymentMode,
                    paidAmount: parseFloat(paidAmount),
                    discount: parseFloat(discount),
                    paymentRefNo: paymentRefNo,
                    createdById: parseInt(userId),
                    cvv: cvv ? new Date(cvv) : undefined,
                    paymentType,
                    totalBillAmount
                }
            });
        });

        return { statusCode: 0, data };
    } catch (error) {
        console.error("Error creating payment:", error);
        return { statusCode: 1, error: error.message || "An error occurred while creating the payment" };
    }
}



async function update(id, body) {
    let data
    const {
        branchId, paymentMode, cvv, paymentType, paidAmount,discount, supplierId, userId, paymentRefNo, partyId, finYearId } = await body
    const dataFound = await prisma.payment.findUnique({
        where: {
            id: parseInt(id)
        }
    })
    if (!dataFound) return NoRecordFound("payment");
    await prisma.$transaction(async (tx) => {
        data = await tx.payment.update({
            where: {
                id: parseInt(id),
            },
            data: {
                    partyId: parseInt(supplierId),
                    branchId: parseInt(branchId),
                    paymentMode,
                    paidAmount: parseFloat(paidAmount),
                    discount: parseFloat(discount),
                    createdById: parseInt(userId),
                    cvv: cvv ? new Date(cvv) : undefined,
                    paymentType
            },
        })
    })
    return { statusCode: 0, data };
};

async function remove(id) {
    const data = await prisma.payment.delete({
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