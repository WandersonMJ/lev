---
name: alterar-schema
description: Passo a passo para alterar o schema Prisma do L.E.V. (novas tabelas, campos, relações). Use sempre que for mexer em packages/database/prisma/schema.prisma.
---

# Alterar schema do banco

1. Confirme que o Postgres está no ar: `docker compose up -d` (na raiz `lev/`).
2. Edite `packages/database/prisma/schema.prisma` seguindo:
   - Modelos e campos em português, `camelCase` nos campos, `PascalCase` nos modelos.
   - Todo modelo principal tem `id String @id @default(cuid())`, `createdAt` e `updatedAt`.
   - Tabela de vínculo N:N usa chave composta `@@id([aId, bId])`.
   - Dado sensível em tabela separada (ver `FichaSaude`).
   - Comente regras de negócio não óbvias acima do campo.
3. Formate e valide: `npx prisma format` e `npx prisma validate` (em `packages/database`).
4. Aplique:
   - Enquanto não houver produção: `npm run push`.
   - Depois do primeiro deploy: `npx prisma migrate dev --name <descricao>` (nunca `push`).
5. Rode `npm run check-types` na raiz para achar código quebrado.
6. Se a mudança alterar regra de negócio, atualize o Vault (`consulta/Vault LEV`).
