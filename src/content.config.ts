import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const receitas = defineCollection({
  loader: glob({
    base: './receitas',
    pattern: ['**/*.md', '!README.md', '!_*.md'],
  }),
  schema: z.object({
    titulo: z.string(),
    categoria: z.string().default('geral'),
    resumo: z.string().optional(),
    imagem: z.string().optional(),
    imagemAlt: z.string().optional(),
    porcoes: z.string().optional(),
    tempoPreparo: z.string().optional(),
    tempoMinutos: z.number().int().positive().optional(),
    dificuldade: z.enum(['Fácil', 'Médio', 'Difícil']).optional(),
    destaque: z.boolean().default(false),
    publicadoEm: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    ingredientes: z.array(z.string()).optional(),
    preparo: z.array(z.string()).optional(),
  }),
});

export const collections = { receitas };
