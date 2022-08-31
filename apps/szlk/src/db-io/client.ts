import {PrismaClient } from '@prisma/client';
import {Translation, isPersistedTranslation} from 'model/dist/Translation';
import {Author, PersistedAuthor} from 'model/dist/Author';
import { z } from 'zod';

const prisma = new PrismaClient();
const idParser = z.number().int();

export const readAllTranslations = async () => {
    return prisma.dBTranslation.findMany()
}

export const getTranslationById = async (id: number) => {
    idParser.parse(id);
    return prisma.dBTranslation.findUnique({
        where: { id }
    })
}

export const getAuthorById = async (id: number) => {
    idParser.parse(id);
    return await prisma.dBAuthor.findUnique({
        where: { id }
    });
}

export const createAuthor = async (author: Author): Promise<PersistedAuthor> =>
    await prisma.dBAuthor.create({
        data:{
            name: author.name
        },
        select:{
            id: true,
            name: true
        }
    });

const updateOrCreateTranslation = async (translation: Translation, author: PersistedAuthor) => {
    if(isPersistedTranslation(translation)){
        return prisma.dBTranslation.update({
            data:{
                original: translation.origin.main,
                translation: translation.translation,
                initiatedById: translation.initiatedBy.id,
                from: translation.from,
                to: translation.to,
                lastUpdatedById: author.id,
                type: translation.type
            },
            where: {
                id: translation.id
            }
        })
    } else {
        return prisma.dBTranslation.create({
            data:{
                translation: translation.translation,
                type: translation.type as string,
                from: translation.from as string,
                to: translation.to as string,
                original: translation.origin.main,
                initiatedBy: {
                    connect:{
                        id: author.id
                    }
                }
            }
        })
    } 
}

export const saveTranslation = async (translation: Translation, author: PersistedAuthor) => {
    return await updateOrCreateTranslation(translation, author);
}

export const disconnect = () => {
    return prisma.$disconnect();
}
