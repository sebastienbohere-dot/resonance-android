# RÉSONANCE — MVP Android V0.1

Prototype Expo / React Native de la première boucle fonctionnelle :

Accueil → SOS → choix de la situation → intensité avant → séance respiratoire 5 min + synthèse vocale → intensité après → preuve → retour accueil.

## Fonctions déjà incluses

- interface sombre Résonance ;
- choix du type de SOS ;
- échelle d'intensité 0–10 ;
- animation respiratoire 4 s inspiration / 6 s expiration ;
- vibrations aux changements de phase ;
- synthèse vocale française avec le script SOS ;
- mesure avant/après ;
- stockage local des « preuves » ;
- aucun compte utilisateur, aucun cloud.

## Tester sur Android

1. Installer Node.js sur l'ordinateur.
2. Installer l'application **Expo Go** sur le téléphone Android.
3. Dans ce dossier :

```bash
npm install
npm start
```

4. Scanner le QR code affiché avec Expo Go.

## Limites de cette V0.1

- Le moteur vocal utilise la synthèse vocale du téléphone : il sera remplacé par des audios professionnels ou une voix dédiée plus tard.
- Aucun fichier audio d'ambiance n'est encore fourni.
- Les autres modules (M'apaiser, Refuge, Sommeil, Douleur, Mon chemin) ne sont pas encore codés.
- Ce prototype n'est pas un dispositif médical et ne doit pas être présenté comme tel.
