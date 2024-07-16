import { PrismaClient } from '@prisma/client'
import { NoRecordFound } from '../configs/Responses.js';

const prisma = new PrismaClient()


async function get(req) {
    const { companyId, active } = req.query
    const data = await prisma.party.findMany({
        where: {
            companyId: companyId ? parseInt(companyId) : undefined,
            active: active ? Boolean(active) : undefined,
        },
       
    });
    return { statusCode: 0, data };
}


async function getOne(id) {
    const childRecord = 0;
    const data = await prisma.party.findUnique({
        where: {
            id: parseInt(id)
        },
        include:{
           
            City: {
                select:{
                    name:true,
                    state: true
                }
            }
        }
    })
    if (!data) return NoRecordFound("party");
    return { statusCode: 0, data: { ...data, ...{ childRecord } } };
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
        gstNo, currencyId, costCode, 
      
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
                companyId: parseInt(companyId), active,
             
              
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
        gstNo,
     
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
            contactMobile: contactMobile ? parseInt(contactMobile) : undefined,
           
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
