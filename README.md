# WestCoast Education

En webbapplikation för WestCoast Education som hanterar kurser, bokningar och administration.

## Funktioner

- **Startsida** – Lista och filtrera kurser efter kategori och sökord
- **Kursdetaljer** – Visa kursinformation och boka kurs (kräver inloggning)
- **Login / Registrering** – Skapa konto och logga in
- **Adminpanel** – Lägg till kurser och se bokningar per kurs (kräver inloggning)

## Teknik

- Vanilla JavaScript med ES6-moduler
- RestDB som REST API (molndatabas)
- Modern responsiv CSS

## Kom igång

### 1. Klona repot

```bash
git clone https://github.com/DITT-NAMN/westcoast-education.git
cd westcoast-education
```

### 2. Konfigurera API

Kopiera exempelfilen och fyll i dina egna RestDB-uppgifter:

```bash
cp src/config.example.js src/config.js
```

Öppna `src/config.js` och fyll i:

```js
export const API_URL = 'https://din-databas.restdb.io/rest';
export const API_KEY = 'din-api-nyckel';
```

### 3. Öppna i webbläsaren

Öppna `index.html` via en lokal server, t.ex. **Live Server** i VSCode.

## Struktur

```
/
├── index.html        # Startsida
├── course.html       # Kursdetaljer + bokning
├── login.html        # Login / registrering
├── admin.html        # Adminpanel
└── src/
    ├── config.js     # API-konfiguration (ignoreras av git)
    ├── index.js
    ├── course.js
    ├── login.js
    ├── admin.js
    ├── css/
    │   └── style.css
    └── modules/
        ├── api.js       # Fetch-wrapper mot RestDB
        ├── auth.js      # Autentisering (localStorage)
        ├── courses.js   # Kurslogik
        ├── bookings.js  # Bokningslogik
        └── ui.js        # Gemensamma UI-hjälpfunktioner
```

## Notering

Lösenord lagras i klartext i databasen. I en produktionsmiljö skulle man använda bcrypt eller liknande för lösenordshashning.
