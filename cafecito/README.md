# ☕ Kafecito

Aplicación para saber **quién le toca pagar el café** entre tres amigos, con cartas coleccionistas, login con Google y historial en Firebase Firestore.

---

## Estructura

```
src/
├── main.jsx
├── App.jsx               ← orquesta auth + squad + tabs
├── index.css             ← estilos globales + animaciones
├── constants.js          ← paletas, helpers, lógica de quién paga
├── firebase.js           ← config Firebase + Auth + Firestore
├── hooks/
│   ├── useAuth.js        ← login / logout / observer
│   └── useSquad.js       ← estado del squad, historial y pagos
└── components/
    ├── CupIcon.jsx
    ├── GoogleLogo.jsx
    ├── Chip.jsx
    ├── PlayerCard.jsx
    ├── LoginScreen.jsx
    ├── TabHoy.jsx
    └── TabHistorial.jsx
```

---

## Setup

```bash
npm install
npm run dev
```

Firebase ya está configurado con el proyecto **kafecitoapp**.

### Pasos pendientes en Firebase Console

1. **Authentication** → Sign-in method → habilitar proveedor **Google**
2. Agregar el dominio donde desplegues la app en *Authorized domains*
3. **Firestore Database** → crear base de datos en modo producción
4. Pegar estas reglas de seguridad:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /{col}/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Las colecciones se crean automáticamente:
- `cafe_users`  → perfil de cada miembro del squad
- `cafe_pagos`  → historial de pagos

---

## Cómo funciona el squad

Los **primeros 3 usuarios** que inician sesión con Google quedan registrados permanentemente. El cuarto en intentarlo verá un mensaje de "squad completo". Cada usuario recibe un slot (0-2) que determina su paleta de color: violeta · cyan · ámbar.

## Lógica de quién paga

Entre los asistentes seleccionados paga quien lleva **más tiempo sin pagar**. El algoritmo recorre el historial de atrás hacia adelante buscando el último pago de cada uno, y elige al que tiene el timestamp más antiguo (o 0 si nunca pagó).
