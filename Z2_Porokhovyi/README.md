OBEDOVÉ MENU V OKOLÍ FEI

Autor: Nikita Porokhovyi
Predmet: WEBTE1
Zadanie: 2


POPIS PROJEKTU

Klientska webová aplikácia zobrazuje obedové menu troch
reštaurácií: Eat & Meet, Naše Hospoda a FiitFood.

Používateľ môže vybrať pracovný deň alebo celý týždeň,
zobraziť alebo skryť jednotlivé reštaurácie, aktualizovať
menu a vymazať uloženú cache.

V pracovný deň sa predvolene vyberie aktuálny deň.
Cez víkend sa vyberie pondelok.

Aplikácia je vytvorená pomocou HTML, CSS a JavaScriptu.
Nevyžaduje databázu ani zostavenie projektu.


SPUSTENIE

Projekt je potrebné spustiť cez HTTP server.

Spustenie vo Visual Studio Code:
1. Otvorte priečinok projektu.
2. Použite rozšírenie Live Server.
3. Spustite index.html cez Open with Live Server.

Alternatívne spustenie pomocou Pythonu:
1. V termináli otvorte priečinok projektu.
2. Spustite príkaz:
   python3 -m http.server 8000
3. V prehliadači otvorte:
   http://localhost:8000/

Pri priamom otvorení cez file:// nemusí načítanie pomocou
fetch fungovať.

Internetové pripojenie je potrebné na načítanie knižníc
Bootstrap a jQuery z CDN.


ŠTRUKTÚRA PROJEKTU

index.html       - štruktúra stránky a informácie o projekte
css/styles.css   - vlastné štýly, farby a pripojenie písma
js/script.js     - načítanie, spracovanie a zobrazenie menu
source/          - lokálne HTML kópie jedálnych lístkov
font/            - súbory písma Outfit a licencia OFL.txt
img/             - ikona stránky
README.md        - dokumentácia projektu


ZDROJE ÚDAJOV

Eat & Meet
https://eatandmeet.sk/tyzdenne-menu
Lokálny súbor: source/J1_eatandmeat.html

Naše Hospoda
https://www.nasehospoda-karloveska.sk/
Lokálny súbor: source/J2_nasehospoda.html

FiitFood
http://www.freefood.sk/menu/#fiit-food
Lokálny súbor: source/J3_freefood.html


SPRACOVANIE ÚDAJOV

Aplikácia načítava lokálne HTML kópie pomocou fetch.
DOMParser prevedie načítaný text na dokument.

Každá reštaurácia má vlastné funkcie na získanie jedál
a zostavenie týždenného menu, pretože zdrojové stránky
majú odlišnú HTML štruktúru.

Pri jedlách sa spracúva kategória, názov, cena a dostupné
alergény. Dátum sa pridáva tam, kde ho parser získava
zo zdroja. Hmotnosť a ďalšie označenia môžu zostať
súčasťou názvu jedla.

Alergény sa oddeľujú od názvu podľa formátu jednotlivých
zdrojov. Ceny sa zachovávajú ako text zo zdrojovej stránky.

Výstupné elementy sa vytvárajú pomocou DOM metód.
Text sa nastavuje cez textContent alebo jQuery .text().
Zdrojové HTML sa nevkladá priamo do stránky.


ZOBRAZENIE MENU

Každá reštaurácia má samostatnú kartu s názvom a odkazom
na pôvodnú stránku, stavovou správou a časom aktualizácie.

Používateľ môže zobraziť jednotlivé pracovné dni alebo
celý týždeň. Prepnutie dňa používa údaje uložené v pamäti
a nevyvoláva nové načítanie súborov.

Filtre menia viditeľnosť kariet bez odstránenia ich údajov.
Polievky sú vizuálne odlíšené zeleným pozadím.
Rozloženie stránky a jedál sa prispôsobuje šírke obrazovky.


CACHE A AKTUALIZÁCIA

Spracované menu sa ukladá do localStorage pod kľúčmi:
- j1-menu-cache
- j2-menu-cache
- j3-menu-cache

Každý záznam obsahuje menu a čas uloženia timeUpdate
vo formáte ISO.

Cache sa používa iba počas rovnakého miestneho
kalendárneho dňa.

Tlačidlo Aktualizovať menu obíde cache, načíta lokálne
HTML súbory a uloží nový výsledok.

Tlačidlo Vymazať cache odstráni uložené záznamy.
Aktuálne zobrazené menu zostane na stránke.


NAČÍTAVANIE A CHYBY

Reštaurácie sa načítavajú nezávisle.
Na dokončenie všetkých načítavaní sa čaká pomocou
Promise.allSettled.

Počas spoločného načítavania sú tlačidlá aktualizácie
a vymazania cache zablokované.

Chyba jednej reštaurácie nebráni zobrazeniu ostatných.
Pri chybe sa zobrazí správa a vymaže sa obsah príslušnej
karty, čas aktualizácie a údaje reštaurácie v pamäti.

Uložená cache v localStorage sa pri chybe načítania
automaticky neodstraňuje.


POUŽITÉ KNIŽNICE

Bootstrap 5.3.8
https://getbootstrap.com/

Použitie:
- responzívne rozloženie ovládacích prvkov,
- tlačidlá a formulárové prvky,
- navigácia,
- pomocné triedy pre karty, text a odstupy.

jQuery 3.7.1
https://jquery.com/

Použitie:
- obsluha udalostí,
- nastavenie viditeľnosti kariet,
- zmena stavových správ,
- blokovanie tlačidiel počas načítavania.

Vlastné CSS upravuje farby, hlavičku, stavové správy
a rozloženie jedál pomocou CSS Grid.


PÍSMO A LICENCIA

Použité písmo: Outfit
Formát: lokálne súbory WOFF2
Použité hrúbky: 400, 500, 600 a 700

Copyright 2021 The Outfit Project Authors.
https://github.com/Outfitio/Outfit-Fonts

Písmo je dostupné pod licenciou SIL Open Font License 1.1.
Úplné znenie licencie sa nachádza v súbore font/OFL.txt.


POUŽITIE AI

Pri tvorbe projektu bol použitý ChatGPT na vysvetľovanie
JavaScriptu, HTML, CSS, regulárnych výrazov a knižníc.

AI bola použitá aj na návrhy a generovanie častí kódu,
pomoc pri hľadaní chýb a prípravu dokumentácie.

Projekt bol postupne skladaný a upravovaný autorom.


OBMEDZENIA

Aplikácia používa lokálne HTML kópie, nie živé stránky
reštaurácií. Tlačidlo aktualizácie znovu načíta tieto
súbory, ale nesťahuje aktuálnu ponuku z internetu.

Na zmenu ponuky je potrebné nahradiť príslušné HTML kópie.
Proxy server v tejto verzii nie je implementovaný.

Selektory a rozpoznávanie údajov sú prispôsobené uloženým
HTML kópiám. Zmena štruktúry zdrojov môže vyžadovať
úpravu parserov.

Chýbajúci údaj o alergénoch neznamená, že jedlo alergény
neobsahuje. Presné informácie o jedlách, alergénoch
a podmienkach cien poskytuje príslušná reštaurácia.