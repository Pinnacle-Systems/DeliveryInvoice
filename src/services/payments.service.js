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
    let newDocId = `${branchObj.branchCode}/${shortCode}/Pay/1`
    if (lastObject) {
        newDocId = `${branchObj.branchCode}/${shortCode}/Pay/${parseInt(lastObject.docId.split("/").at(-1)) + 1}`
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
    const { branchId,
        amount,
        paymentMode,
        paymentRefNo,
        partyId,
        finYearId, userId } = await body
    let finYearDate = await getFinYearStartTimeEndTime(finYearId);
    const shortCode = finYearDate ? getYearShortCodeForFinYear(finYearDate?.startTime, finYearDate?.endTime) : "";
    let newDocId = finYearDate ? (await getNextDocId(branchId, shortCode, finYearDate?.startTime, finYearDate?.endTime)) : "";
    await prisma.$transaction(async (tx) => {
        data = await tx.payment.create(
            {
                data: {
                    docId: newDocId,
                    partyId: parseInt(partyId),
                    branchId: parseInt(branchId),
                    paymentMode,
                    paymentRefNo,
                    amount: parseFloat(amount),
                    createdById: parseInt(userId)
                }
            })
    })
    return { statusCode: 0, data };
}



async function update(id, body) {
    let data
    const {
        amount,
        paymentMode,
        partyId,
        paymentRefNo,
        userId } = await body
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
                partyId: parseInt(partyId),
                paymentMode,
                paymentRefNo,
                amount: parseFloat(amount),
                updatedById: parseInt(userId)
            },
        })
    })
    return { statusCode: 0, data };
};

async function remove(id) {
    const data = await prisma.payment.update({
        where: {
            id: parseInt(id)
        },
        data: {
            isDeleted: true
        }
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