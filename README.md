# 📖 MyHealth backend

## Yleiskuvaus sovelluksesta

MyHealth on päiväkirjamainen sovellus, joka mahdollistaa käyttäjän päivittäisten merkintöjen tallentamisen,
muokkaamisen ja tarvittaessa poistamisen. Sovellus hyödyntää Node.js ja Express.js - pohjaista REST API:a, joka kommunikoi MySql- tietokannan kanssa. 
Käyttäjäautentikointi on toteutettu JWT-Tokenin avulla.

---

## 🗄️ Tietokannan kuvaus

Tietokanta koostuu kahdesta taulusta: `Users` ja `DiaryEntries`.

### **Users (Käyttäjät)**
Sisältää käyttäjien perustiedot ja käyttöoikeustason.

| Sarake      | Tyyppi         | Rajoitteet                          | Kuvaus                           |
|------------|--------------|--------------------------------|---------------------------------|
| user_id    | INT          | PRIMARY KEY, AUTO_INCREMENT  | Käyttäjän yksilöllinen tunniste |
| username   | VARCHAR(50)  | NOT NULL, UNIQUE             | Käyttäjätunnus                  |
| password   | VARCHAR(255) | NOT NULL                     | Salasanan hashattu arvo         |
| email      | VARCHAR(100) | NOT NULL, UNIQUE             | Käyttäjän sähköposti            |
| created_at | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Käyttäjän luontiaika |
| user_level | VARCHAR(10)  | DEFAULT 'regular'            | Käyttäjän taso (esim. "admin" tai "regular") |

---

### **DiaryEntries (Päiväkirjamerkinnät)**
Sisältää käyttäjän lisäämät päiväkirjamerkinnät.

| Sarake      | Tyyppi         | Rajoitteet                          | Kuvaus                           |
|------------|--------------|--------------------------------|---------------------------------|
| entry_id   | INT          | PRIMARY KEY, AUTO_INCREMENT  | Merkinnän yksilöllinen tunniste |
| user_id    | INT          | NOT NULL, FOREIGN KEY        | Viittaus käyttäjään (`Users.user_id`) |
| entry_date | DATE         | NOT NULL                     | Merkinnän päivämäärä            |
| mood       | VARCHAR(50)  |                               | Käyttäjän mieliala               |
| sleep_hours| INT          |                               | Nukutut tunnit                   |
| notes      | TEXT         |                               | Käyttäjän muistiinpanot          |
| created_at | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Merkinnän luontiaika |

---

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

| **Endpoint**               | **Kuvaus**                 | **Oikeudet**    |
|----------------------------|----------------------------|-----------------|
|   POST /api/entries        | Lisää uusi merkintä        | Vain käyttäjä   |
|   GET /api/entries         | Hae kaikki omat merkinnät  | Vain käyttäjä   |
|   PUT /api/entries/:id     | Muokkaa omaa merkintää     | Vain käyttäjä   |
|   DELETE /api/entries/:id  | Hae kaikki omat merkinnät  | Vain käyttäjä   |

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
