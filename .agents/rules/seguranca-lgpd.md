---
trigger: always_on
---

# Segurança e LGPD — L.E.V.

O sistema guarda dados de **menores de idade** e **dados de saúde**. Segurança não é opcional.

## Autorização
- Server Action verifica **sessão** (`obterAtor()`); o **caso de uso** verifica **permissão**. Esconder botão não é segurança.
- Regras de permissão reutilizáveis em `apps/web/modules/shared/permissoes.ts` (ex: `podeVerFichaSaude(ator, inscricao)`).
- Acesso padrão é por vínculo: membro só vê dados da própria Iniciativa / Núcleo / Projeto.
- `PapelSistema.ADMIN` e `DIRETOR` são as únicas exceções globais.

## Dados sensíveis
- `FichaSaude`: só equipe de saúde/direção da edição. Nunca incluir em `include` genérico.
- Nunca retornar ao client objetos Prisma inteiros de `Pessoa`; usar `select` com campos necessários.
- Nunca logar e-mail, telefone, data de nascimento ou dados de saúde.

## Menores
- Inscrição de menor exige `responsavelId` + `Consentimento` (`AUTORIZACAO_RESPONSAVEL` e `ASSENTIMENTO_ADOLESCENTE`).
- Foto/imagem só é exibida se houver `USO_IMAGEM` não revogado.

## Exclusão
- Não deletar `Pessoa`: anonimizar e preencher `anonimizadoEm`.
- Consentimento revogado = preencher `revogadoEm`, nunca apagar o registro.

## Segredos
- Segredos só em `.env` (nunca commitados). Variáveis públicas apenas com prefixo `NEXT_PUBLIC_`.
