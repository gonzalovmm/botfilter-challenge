# Botfilter Challenge – Nimble Gravity

Mini aplicación en React que:

- Obtiene candidato por email
- Lista posiciones abiertas desde API
- Permite postular enviando repoUrl
- Maneja estados de carga y error
- Incluye tests unitarios

---

## Stack

- React + TypeScript
- Vite
- Fetch API
- Vitest + Testing Library

---

## Instalación

```bash
npm install
npm run dev
```

La aplicación se ejecuta en:

```
http://localhost:5173
```

---

## Tests

Para ejecutar los tests:

```bash
npm test
```

Los tests cubren:

- Validación de email en ChallengePage
- Validación de formato de repoUrl en JobItem
- Llamado correcto al servicio applyToJob
- Manejo de errores en UI

---

## Arquitectura

Estructura organizada por responsabilidades:

```
src/
  api/         → Cliente HTTP genérico con manejo centralizado de errores
  services/    → Acceso a API (candidate, jobs, application)
  components/  → Componentes UI reutilizables
  pages/       → Pantallas principales
  types/       → Definiciones TypeScript
```

Decisiones técnicas:

- Cliente HTTP reutilizable (`fetchJson`)
- Manejo centralizado de errores HTTP
- Tipado fuerte de respuestas y payloads
- Separación clara entre lógica de red y UI
- Validaciones de inputs antes de enviar requests

---

## Nota

Se incluye `applicationId` en el payload del POST ya que la API devuelve error 400 si no se envía, aunque no esté explicitado en la consigna.
