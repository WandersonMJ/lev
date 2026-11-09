---
name: nova-feature
description: Roteiro e templates para criar uma funcionalidade no apps/web seguindo a hexagonal leve (domain, application, infra, actions). Use ao implementar inscrição, mural, pontuação ou qualquer escrita no banco.
---

# Nova feature (hexagonal leve)

Exemplo: lançar ponto para uma Iniciativa. Módulo: `apps/web/modules/pontuacao/`.

## Ordem de criação
1. `domain/` → regra pura
2. `application/portas.ts` → interface do repositório
3. `application/<caso-de-uso>.ts` → caso de uso
4. `infra/` → implementação Prisma da porta
5. `container.ts` → liga caso de uso + infra
6. `schemas.ts` → contrato Zod
7. `actions.ts` → Server Action
8. `app/.../page.tsx` + componente client do formulário
9. Teste do caso de uso com repositório fake
10. `npm run check-types` e `npm run lint` na raiz

## Templates

### domain/ponto.ts
```ts
export function validarValorPonto(valor: number, motivo: string) {
  if (valor === 0) return "Valor não pode ser zero";
  if (valor < 0 && motivo.trim().length < 10) return "Ponto negativo exige motivo detalhado";
  return null;
}
```

### application/portas.ts
```ts
export interface PontoRepositorio {
  iniciativaExiste(iniciativaId: string): Promise<boolean>;
  registrar(dados: NovoPonto): Promise<{ id: string }>;
}
export type NovoPonto = {
  iniciativaId: string; pessoaId?: string; autorId: string;
  valor: number; motivo: string;
};
```

### application/lancar-ponto.ts
```ts
import type { Resultado } from "@/modules/shared/resultado";
import type { Ator } from "@/modules/shared/ator";
import { validarValorPonto } from "../domain/ponto";
import type { NovoPonto, PontoRepositorio } from "./portas";

export function criarLancarPonto(deps: { repo: PontoRepositorio }) {
  return async (ator: Ator, input: Omit<NovoPonto, "autorId">): Promise<Resultado<{ id: string }>> => {
    if (!ator.podeLancarPonto) return { ok: false, erro: "SEM_PERMISSAO" };
    const invalido = validarValorPonto(input.valor, input.motivo);
    if (invalido) return { ok: false, erro: invalido };
    if (!(await deps.repo.iniciativaExiste(input.iniciativaId))) return { ok: false, erro: "INICIATIVA_NAO_ENCONTRADA" };
    return { ok: true, data: await deps.repo.registrar({ ...input, autorId: ator.pessoaId }) };
  };
}
```

### infra/ponto-repositorio-prisma.ts
```ts
import { db } from "@repo/database";
import type { PontoRepositorio } from "../application/portas";

export const pontoRepositorioPrisma: PontoRepositorio = {
  iniciativaExiste: async (id) => !!(await db.iniciativa.findUnique({ where: { id }, select: { id: true } })),
  registrar: (dados) => db.pontoLancamento.create({ data: dados, select: { id: true } }),
};
```

### container.ts
```ts
import { criarLancarPonto } from "./application/lancar-ponto";
import { pontoRepositorioPrisma } from "./infra/ponto-repositorio-prisma";

export const lancarPonto = criarLancarPonto({ repo: pontoRepositorioPrisma });
```

### schemas.ts
```ts
import { z } from "zod";
export const lancarPontoSchema = z.object({
  iniciativaId: z.string().cuid(),
  pessoaId: z.string().cuid().optional(),
  valor: z.number().int(),
  motivo: z.string().min(3),
});
```

### actions.ts
```ts
"use server";
import { revalidatePath } from "next/cache";
import { obterAtor } from "@/modules/shared/ator";
import { lancarPonto } from "./container";
import { lancarPontoSchema } from "./schemas";

export async function lancarPontoAction(input: unknown) {
  const ator = await obterAtor();                 // 1. sessão
  if (!ator) return { ok: false, erro: "NAO_AUTENTICADO" } as const;
  const parsed = lancarPontoSchema.safeParse(input); // 2. contrato
  if (!parsed.success) return { ok: false, erro: "DADOS_INVALIDOS" } as const;
  const res = await lancarPonto(ator, parsed.data);  // 3. caso de uso (permissão + regra)
  if (res.ok) revalidatePath("/iniciativas");
  return res;
}
```

## Rotas
- `app/(publico)/` → site aberto (apresentação, inscrição).
- `app/(area-logada)/` → exige sessão; layout faz a checagem.
- `app/(admin)/` → direção/equipe.
