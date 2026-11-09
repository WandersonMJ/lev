---
trigger: always_on
---

# Testes — L.E.V.

## Ferramentas
- **Vitest:** casos de uso e regras de domínio.
- **Playwright:** fluxos e2e no navegador.

## O que testar
| Camada | Tipo | Obrigatório? |
|---|---|---|
| `domain/` | Unitário (Vitest) | Sim, toda regra |
| `application/` | Unitário com repositório fake | Sim, todo caso de uso |
| `infra/` | Integração com Postgres de teste | Só queries complexas |
| Fluxos críticos | E2E (Playwright) | Sim |

## Fluxos e2e críticos (mínimo)
1. Inscrição completa de menor (com responsável + consentimentos).
2. Pagamento Stripe (modo teste) até inscrição `CONFIRMADA`.
3. Login por link mágico e acesso à área logada.
4. Membro não acessa dados de outra Iniciativa.
5. Lançamento de ponto e atualização do ranking.

## Convenções
- Arquivo de teste ao lado do código: `lancar-ponto.test.ts`.
- E2E em `apps/web/e2e/*.spec.ts`.
- Fakes de repositório em `modules/<dominio>/application/__fakes__/`.
- Nunca usar dados reais de pessoas em testes. Usar fábricas com dados fictícios.
- E2E roda contra banco descartável (Docker) e Stripe/Resend em modo teste.
- Seletores e2e por `id` ou `getByRole`, nunca por classe CSS.
