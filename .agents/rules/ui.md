---
trigger: glob
globs: apps/**/*.tsx, packages/ui/**/*.tsx
---

# UI — L.E.V.

- Estilo com **Tailwind CSS v4**. Evitar CSS solto; se precisar, CSS Module ao lado do componente.
- Cores, fontes e espaçamentos vêm dos tokens do tema (`@theme`), nunca valores mágicos repetidos.
- Componente reutilizável (botão, input, modal, card) mora em `packages/ui` e é importado de `@repo/ui`.
- Componentes pequenos e focados; página só compõe componentes.
- Acessibilidade: `label` em todo input, `alt` em toda imagem, foco visível, contraste AA.
- Mobile first: o público (adolescentes e pais) acessa principalmente pelo celular.
- Todo elemento interativo tem `id` único e descritivo.
- Textos da interface em português do Brasil.
