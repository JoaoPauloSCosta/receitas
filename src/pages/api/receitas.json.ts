import type { APIRoute } from 'astro';
import { getAllRecipes } from '../../lib/recipes';

export const GET: APIRoute = async () => {
  const recipes = await getAllRecipes();

  const payload = recipes.map((recipe) => ({
    id: recipe.id,
    titulo: recipe.titulo,
    categoriaSlug: recipe.categoria.slug,
    categoriaLabel: recipe.categoria.label,
    categoriaColorAA: recipe.categoria.colorAA,
    resumo: recipe.resumo,
    imagem: recipe.imagem,
    porcoes: recipe.porcoes,
    tempoPreparo: recipe.tempoPreparo,
    tempoMinutos: recipe.tempoMinutos,
    dificuldade: recipe.dificuldade,
    destaque: recipe.destaque,
    tags: recipe.tags,
    plainBody: recipe.plainBody.slice(0, 600),
    url: `/receita/${recipe.id}`,
  }));

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
