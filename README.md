# 📖 MyHealth backend

## Autentikointi ja kirjautuminen

### **Käyttäjän autentikointi**
- Käyttäjät voivat kirjautua sisään (**POST** `/api/auth/login`) ja saada **JWT-tokenin**.  
- Kaikki suojatut reitit vaativat tämän tokenin. 

### **JWT Tokenin käyttö**
Kaikki suojatut reitit vaativat **Authorizationin**:
```http
Authorization: Bearer <JWT_TOKEN>
```
Esimerkkipyyntö:
```http
GET /api/entries
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5c...
```

---

## Suojatut reitit

| **Endpoint**              | **Kuvaus**                 | **Oikeudet**    |
|---------------------------|----------------------------|-----------------|
|   POST /api/entries       | Lisää uusi merkintä        | Vain käyttäjä   |
|   GET /api/entries        | Hae kaikki omat merkinnät  | Vain käyttäjä   |

---

## APIn toiminta

### **Kirjautuminen**
```
Käyttäjä                  API Server              Tietokanta
 |                        |                        |
 | --- Kirjautuminen ---> |                        |
 |                        | --- Check User ------->|
 |                        |<-- Käyttäjä löytyi ----|
 |<---- JWT Token ------- |                        |
```

### **Suojatun reitin tarkistus**
```
Käyttäjä           API Server                           Tietokanta
 |                 |                                     |
 | --- Pyyntö  --->|                                     |
 |                 | ----------  Tarkista JWT  --------> |
 |                 |<---------- Token voimassa --------- |
 |                 | --- Hae käyttäjän omat merkinnät -->|
 |                 |<------ Merkinnät palautettu ------- |
 |<-- Vastaus ---- |                                     |
```

---

## Muuta
- **Node.js** + **Express.js** REST API
- **JWT** käyttäjän autentikointia varten
- **bcrypt** salasanan hashaukseen
- **MySQL** tietokanta.
