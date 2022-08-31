import {z} from 'zod';

export const German = 'de';
export const Turkish = 'tr';

export const Language = z.enum([German, Turkish]);

