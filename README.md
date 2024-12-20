# Coderr Project

Das Coderr-Projekt ist eine Webanwendung, die es Nutzern ermöglicht, verschiedene Angebote zu verwalten, Bestellungen aufzugeben und Bewertungen zu schreiben. Es besteht aus einem **Frontend**, das mit JavaScript und CSS entwickelt wurde, und einem **Backend**, das Django verwendet.

## Inhaltsverzeichnis
1. [Überblick](#überblick)
2. [Features](#features)
3. [Technologien](#technologien)
4. [Installation](#installation)
    - [Frontend](#frontend)
    - [Backend](#backend)
5. [Benutzung](#benutzung)
6. [API-Endpunkte](#api-endpunkte)
7. [Hilfsfunktionen im Backend](#hilfsfunktionen-im-backend)
8. [Contributing](#contributing)
9. [Lizenz](#lizenz)

## Überblick

Das Coderr-Projekt kombiniert **Frontend** und **Backend**, um eine benutzerfreundliche Plattform für das Management von Angeboten und Bestellungen bereitzustellen. Kunden können sich registrieren, Angebote durchsuchen und Bewertungen abgeben. Anbieter können Angebote erstellen, verwalten und Statistiken einsehen.

## Features

- Benutzerregistrierung und Login
- Rollenbasierte Zugriffssteuerung (Kunde/Anbieter)
- Angebote erstellen, aktualisieren und löschen
- Bestellungen aufgeben
- Bewertungen erstellen, bearbeiten und löschen
- Profile erstellen und aktualisieren
- Filter- und Suchfunktionalität für Angebote
- Pagination für Angebote und Bestellungen
- API-gestützte Datenverwaltung
- Responsive Design für mobile und Desktop-Geräte

## Technologien

### Frontend:
- Vanilla JavaScript
- HTML5, CSS3

### Backend:
- [Django](https://www.djangoproject.com/)
- Django REST Framework für API
- SQLite für die lokale Datenbank

## Installation

### Frontend

1. Repository klonen:
   ```bash
   git clone https://github.com/Seldir193/coderr-frontend.git
   cd coderr-frontend
   ```
2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
3. Entwicklungsserver starten:
   ```bash
   npm start
   ```

### Backend

1. Repository klonen:
   ```bash
   git clone https://github.com/Seldir193/coderr-backend.git
   cd coderr-backend
   ```
2. Virtuelle Umgebung erstellen und aktivieren:
   ```bash
   python -m venv env
   source env/bin/activate  # Linux/macOS
   env\Scripts\activate     # Windows
   ```
3. Abhängigkeiten installieren:
   ```bash
   pip install -r requirements.txt
   ```
4. Datenbank migrieren:
   ```bash
   python manage.py migrate
   ```
5. Entwicklungsserver starten:
   ```bash
   python manage.py runserver
   ```

## Benutzung

- **Kunde**:
  - Kann sich registrieren, anmelden und Bestellungen aufgeben.
  - Bewertungen hinzufügen, bearbeiten und löschen.
- **Anbieter**:
  - Kann Angebote erstellen, bearbeiten und löschen.
  - Hat Zugriff auf Business-Profile und Statistiken.

## API-Endpunkte

Das Frontend kommuniziert mit den folgenden API-Endpunkten des Backends. Diese Endpunkte werden genutzt, um die Hauptfunktionen der Anwendung bereitzustellen.

### Authentifizierung
- **POST** `/registration/`  
  Registriert einen neuen Benutzer.

- **POST** `/login/`  
  Loggt einen Benutzer ein.

---

### Profile
- **GET** `/profile/<int:user_id>/`  
  Abrufen eines Benutzerprofils.

- **GET** `/profiles/business/`  
  Abrufen aller Business-Profile.

- **GET** `/profiles/business/<int:user_id>/`  
  Abrufen eines spezifischen Business-Profils.

- **GET** `/profiles/customer/`  
  Abrufen aller Kundenprofile.

- **GET** `/profiles/customer/<int:user_id>/`  
  Abrufen eines spezifischen Kundenprofils.

---

### Angebote
- **GET** `/offers/`  
  Alle Angebote abrufen.

- **POST** `/offers/`  
  Erstellt ein neues Angebot.

- **GET** `/offers/<int:id>/`  
  Details eines Angebots abrufen.

---

### Bestellungen
- **GET** `/orders/`  
  Abrufen aller Bestellungen.

- **POST** `/orders/`  
  Erstellt eine neue Bestellung.

- **GET** `/orders/<int:order_id>/`  
  Abrufen der Details einer Bestellung.

- **GET** `/order-count/<int:offer_id>/`  
  Anzahl der Bestellungen in Bearbeitung für ein Angebot.

- **GET** `/completed-order-count/<int:user_id>/`  
  Abrufen der abgeschlossenen Bestellungen eines Benutzers.

---

### Bewertungen
- **GET** `/reviews/`  
  Abrufen aller Bewertungen.

- **POST** `/reviews/`  
  Erstellt eine neue Bewertung.

- **GET** `/reviews/<int:pk>/`  
  Abrufen der Details einer Bewertung.

- **PUT** `/reviews/<int:pk>/`  
  Bearbeiten einer Bewertung.

- **DELETE** `/reviews/<int:pk>/`  
  Löschen einer Bewertung.

---

### Basisinformationen
- **GET** `/base-info/`  
  Abrufen der Basisinformationen der Anwendung.

---

### Benutzerbestellungen
- **GET** `/user/orders/`  
  Abrufen der Bestellungen eines Benutzers.

## Hilfsfunktionen im Backend

- **profile_helpers.py**: Hilfsfunktionen für Benutzerprofile (z. B. Datenvalidierung).
- **utils.py**: Allgemeine Hilfsfunktionen wie String- oder Datumsformatierung.
- **functions.py**: Geschäftsspezifische Logik, die in verschiedenen Views verwendet wird.

## Contributing

Beiträge sind willkommen! Erstelle einen Fork des Projekts, führe deine Änderungen durch und sende einen Pull-Request.

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Weitere Informationen findest du in der Datei [LICENSE](LICENSE).
