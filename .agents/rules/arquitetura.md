---
trigger: always_on
---

# Arquitetura — L.E.V.

## Decisões fechadas
- **Back-end:** TypeScript dentro do Next.js (Server Actions). Sem API separada por enquanto.
- **Arquitetura:** hexagonal leve (camadas por módulo de domínio).
- **Contratos:** Zod na entrada + interfaces TypeScript (portas) para repositórios/serviços.
- **Inversão de dependência:** injeção por parâmetro/fábrica. Sem container de DI.

## Stack
- Monorepo Turborepo + npm workspaces. Node >= 24.
- `apps/web`: Next.js 16 (App Router) + React 19 + TypeScript.
- `packages/database`: Prisma + PostgreSQL (Docker local).
- `packages/ui`: componentes compartilhados.
- **Login:** Auth.js com link mágico por e-mail + Google. Sem senha.
- **E-mail:** Resend (link mágico, confirmações, lembretes).
- **Pagamento:** Stripe Checkout + webhook (`app/api/webhooks/stripe/route.ts`).
- **Arquivos:** S3-compatível (MinIO no mesmo servidor). Acesso só via porta `ArmazenamentoArquivos`.
- **Hospedagem (provisório):** VPS Hostinger com Docker Compose (Next + Postgres + MinIO + proxy HTTPS).
- **Testes:** Vitest (unitário) + Playwright (e2e). Ver `testes.md`.

## Serviços externos = sempre atrás de porta
Stripe, Resend, storage e Auth nunca são chamados direto de `application/`.
Cada um tem interface em `application/portas.ts` e implementação em `infra/`.
Assim dá para trocar Hostinger/MinIO por outra nuvem sem tocar em regra de negócio.

## Estrutura
```
apps/web/
  app/                      # rotas e páginas (só UI, sem regra de negócio)
  modules/
    <dominio>/              # ex: inscricoes, iniciativas, pontuacao
      domain/               # entidades, regras puras, erros de domínio
      application/          # casos de uso + portas (interfaces)
      infra/                # adaptadores: repositórios Prisma, storage
      actions.ts            # Server Actions (adaptador de entrada)
      schemas.ts            # contratos Zod de entrada
      container.ts          # monta casos de uso com os adaptadores reais
    shared/                 # Resultado, erros base, sessão/ator, utilitários
```

## Regra de dependência (obrigatória)
| Camada | Pode importar |
|---|---|
| `domain` | nada externo (nem Prisma, nem Next, nem Zod) |
| `application` | `domain`, `shared` |
| `infra` | `application`, `domain`, `@repo/database` |
| `actions.ts` / `app/` | `container`, `schemas`, `shared` |

- `application` **nunca** importa `@repo/database` nem `next/*`. Fala só com portas.
- Um módulo não importa a `infra` de outro módulo. Se precisar, expõe um caso de uso.

## Escrita vs leitura
- **Escrita** (criar, alterar, pontuar): sempre por caso de uso.
- **Leitura simples** (listas, telas): pode usar `infra/queries.ts` direto no Server Component. Sem caso de uso só para repassar dados.
- Leitura com regra (ex: ranking, permissão por vínculo) vira caso de uso.

## Contratos
- Entrada externa → schema Zod em `schemas.ts` → caso de uso recebe dado já tipado.
- Caso de uso retorna `Resultado<T>` (`{ ok: true, data }` | `{ ok: false, erro }`). Não lança erro de regra de negócio.
- Portas nomeadas pelo papel: `InscricaoRepositorio`, `ArmazenamentoArquivos`.

## Acesso a dados
- Importar sempre `import { db } from "@repo/database"`, **só dentro de `infra/`**.
- Proibido importar `@repo/database` em arquivo `"use client"`.
- Sempre `select` explícito nas queries.

## Nomenclatura
- Domínio em **português**, igual ao schema (`Pessoa`, `Inscricao`, `Iniciativa`).
- Código técnico em inglês (`getUser`, `handleSubmit`, `isLoading`).
- Casos de uso: verbo no infinitivo (`inscreverParticipante`, `lancarPonto`).
- Arquivos: `kebab-case.ts`. Componentes: `PascalCase.tsx`.

## Padrões gerais
- Server Component por padrão; `"use client"` só quando precisar de estado/eventos.
- Sem `any`.
- Casos de uso são testáveis com repositório fake (sem banco).
- Antes de mexer em Turborepo, siga o `AGENTS.md` da raiz.
