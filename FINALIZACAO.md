# Ajustes de aprovação e progresso

Arquivos alterados:
- `Back-End/src/main/java/com/tododia/Ingles/service/UserProgressService.java`: mantém o maior progresso já registrado.
- `front_end/src/pages/lesson/LessonPage.tsx`: mantém aprovações anteriores e utiliza o resultado persistido pelo backend.

## Para validar localmente

Backend: `cd Back-End` e `./mvnw compile` (Windows: `.\\mvnw.cmd compile`).
Frontend: `cd front_end`, `npm ci`, `npm run build`.

## Pendências para produção

- A API ainda aceita notas enviadas pelo cliente: implementar submissão de IDs de alternativas e cálculo de pontuação no servidor antes de usar em avaliações de confiança.
- Validar fluxo completo com conta de aluno nova, incluindo reprovação, nova tentativa, refresh e dashboard.
- Revisar tratamento de tentativas simultâneas e o histórico de notas.
- Não incluir segredos de ambiente no repositório.
