---
description: Obrigatoriedade de testes para Server Actions
---

# Testes para Server Actions

Sempre que uma nova Server Action for criada ou uma Server Action existente for modificada, você DEVE obrigatoriamente criar ou atualizar o teste correspondente.

## Diretrizes
1. As Server Actions devem ser tratadas como casos de uso ou controladores de domínio.
2. Utilize o **Vitest** para criar os testes unitários.
3. Arquivo de teste deve ficar preferencialmente ao lado do arquivo da action (ex: `actions.test.ts`) ou na pasta `__tests__` correspondente.
4. Ao rodar ou sugerir uma Server Action, valide o fluxo de dados e retornos através do teste.
5. Em casos de mock de banco de dados (`Prisma`), use as ferramentas do Vitest ou abstrações adequadas para garantir que a action é testável.
