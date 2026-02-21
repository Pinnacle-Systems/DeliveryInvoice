import { PrismaClient } from '@prisma/client'
import { NoRecordFound } from '../configs/Responses.js';

const prisma = new PrismaClient()


async function get(req) {
    const { companyId, active } = req.query
    const data = await prisma.Process.findMany({
        where: {
            active: active ? Boolean(active) : undefined,
        }
    });
    return { statusCode: 0, data };
}


async function getOne(id) {
    const childRecord = 0;
    const data = await prisma.Process.findUnique({
        where: {
            id: parseInt(id)
        }
    })
    if (!data) return NoRecordFound("size");
    return { statusCode: 0, data: {...data, ...{childRecord}} };
}

async function getSearch(req) {
    const { searchKey } = req.params
    const { companyId, active, } = req.query
    const data = await prisma.Process.findMany({
        where: {
            active: active ? Boolean(active) : undefined,
            OR: [
                {
                    name: {
                        contains: searchKey,
                    },
                }
            ],
        }
    })
    return { statusCode: 0, data: data };
}

async function create(body) {
    console.log(body,'body');
    
    const { name, companyId, active, accessory } = await body
    const data = await prisma.Process.create(
        {
            data: {
                name, active, 
            }
        }
    )
    return { statusCode: 0, data };
}

async function update(id, body) {
    const { name, active, accessory } = await body
    const dataFound = await prisma.Process.findUnique({
        where: {
            id: parseInt(id)
        }
    })
    if (!dataFound) return NoRecordFound("size");
    const data = await prisma.Process.update({
        where: {
            id: parseInt(id),
        },
        data:
        {
            name, active, 
        },
    })
    return { statusCode: 0, data };
};

async function remove(id) {
    const data = await prisma.size.delete({
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
