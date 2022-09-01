import {DBAuthor, DBTranslation, PrismaClient } from '@prisma/client';
import {Translation, TranslationType, isPersistedTranslation, PersistedTranslation} from 'model/dist/Translation';
import {Author, PersistedAuthor} from 'model/dist/Author';
import type {Language} from 'model/dist/Language';
import { z } from 'zod';

const prisma = new PrismaClient();
const idParser = z.number().int();

type ReadTranslation = DBTranslation & {
    initiatedBy: DBAuthor;
    lastUpdatedBy: DBAuthor | null;
}

const mapTranslation = (dbTranslation: ReadTranslation): PersistedTranslation => ({
    original: dbTranslation.original,
    from: dbTranslation.from as z.infer<typeof Language>,
    to: dbTranslation.to as z.infer<typeof Language>,
    type: dbTranslation.type as z.infer<typeof TranslationType>,
    id: dbTranslation.id,
    translation: dbTranslation.translation,
    initiatedBy: dbTranslation.initiatedBy,
    lastUpdatedBy: !!dbTranslation.lastUpdatedBy
        ? {
            name: dbTranslation.lastUpdatedBy.name,
            id: dbTranslation.lastUpdatedBy.id
        }
        : undefined
})

export const readAllTranslations = async () => {
    return prisma.dBTranslation.findMany()
}

export const getTranslationById = async (id: number) => {
    idParser.parse(id);
    const dbTranslation = await prisma.dBTranslation.findUnique({
        where: { id },
        include: {
            initiatedBy: true,
            lastUpdatedBy: true
        }
    });

    return (
        dbTranslation === null
            ? null
            : mapTranslation(dbTranslation)
    );
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
                original: translation.original,
                translation: translation.translation,
                initiatedById: translation.initiatedBy.id,
                from: translation.from,
                to: translation.to,
                lastUpdatedById: author.id,
                type: translation.type
            },
            where: {
                id: translation.id
            },
            include: {
                initiatedBy: true,
                lastUpdatedBy: true
            }
        })
    } else {
        return prisma.dBTranslation.create({
            data:{
                translation: translation.translation,
                type: translation.type as string,
                from: translation.from as string,
                to: translation.to as string,
                original: translation.original,
                initiatedBy: {
                    connect:{
                        id: author.id
                    }
                }
            },
            include: {
                initiatedBy: true,
                lastUpdatedBy: true
            }
        })
    } 
}

export const saveTranslation = async (translation: Translation, author: PersistedAuthor): Promise<PersistedTranslation> => {
    const dbTranslation =  await updateOrCreateTranslation(translation, author);
    return mapTranslation(dbTranslation);
}

export const disconnect = () => {
    return prisma.$disconnect();
}
