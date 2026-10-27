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

## Essayer immédiatement sur ordinateur

Le livrable `Resonance_PC.html` est un aperçu précompilé : télécharger le fichier et l’ouvrir avec Chrome ou Edge, sans Node.js. Cliquer sur SOS pour commencer, puis sur « Activer la voix » dans la séance. Garder le même fichier et le même navigateur pour retrouver l’historique ; le stockage des fichiers locaux dépend du navigateur. La voix dépend du système et du navigateur, et son fonctionnement hors connexion n’est pas garanti.

Pour reconstruire cet aperçu à partir des sources : `npm ci`, puis `npm run export:pc`. Le fichier est créé dans `dist/Resonance_PC.html`. Pour modifier et développer le projet, utiliser l’atelier ci-dessous.

## Atelier de développement sur ordinateur

La version navigateur sert à développer le même prototype que la version Android. Elle ne demande ni compte Expo, ni APK, ni installation d’Expo Go.

Sous Windows, installer Node.js 22 LTS, extraire le dossier du projet, puis ouvrir `Lancer_Resonance_Windows.bat`. Le premier lancement installe les dépendances ; les suivants ouvrent le serveur web. Garder la fenêtre de commande ouverte pendant les essais.

Autre méthode, dans le dossier du projet :

```bash
npm ci
npm run web
```

Ouvrir l’adresse locale affichée si le navigateur ne s’ouvre pas automatiquement. Arrêter le serveur avec Ctrl+C. Le navigateur est notre atelier principal ; Android reste la destination et doit être testé régulièrement.

Sur ordinateur, cliquer sur « Activer la voix » pendant la séance. La voix française dépend des voix installées et du navigateur. Les vibrations ne sont pas simulées. La pause fige le temps et le mouvement ; elle interrompt la phrase en cours, qui ne reprend pas au milieu d’un mot. Le guidage reprend aux prochaines phrases prévues.

Les intensités avant et après doivent être choisies explicitement à chaque séance. Le bouton « Retrouver mon calme » mène à la même respiration guidée, sans passer par le choix d’un type de SOS. Les jauges d’accueil sont un aperçu de démonstration, pas une mesure de ton état.

Les preuves sont conservées dans le stockage du navigateur pour l’adresse utilisée. Elles ne sont pas synchronisées avec le téléphone et peuvent être effacées avec les données du navigateur. Garder l’onglet visible pendant la séance : le fonctionnement en arrière-plan et écran éteint n’est pas validé.

## Tester sur Android

Utiliser une version Android d’Expo Go compatible avec SDK 53 (https://expo.dev/go?platform=android&device=true&sdkVersion=53), puis lancer `npm start` et scanner le QR code. Le téléphone doit pouvoir joindre le serveur de développement de l’ordinateur. Les tests Android ne sont pas remplacés par les essais web.

## Fabriquer un APK autonome

La procédure EAS `preview` figure dans [BUILD_APK.md](BUILD_APK.md). Elle est distincte d’Expo Go et du navigateur. Le workflow GitHub Actions actuel est vide : il ne constitue pas un parcours de compilation utilisable.

## Vérification avant livraison

```bash
npx expo install --check
npm run export:web
```

Vérifier dans le navigateur : parcours SOS, intensités avant/après, respiration 4/6 secondes, pause et reprise du temps et du mouvement, voix activée par clic, fin anticipée, enregistrement et persistance après rechargement. Tester aussi une séance complète de cinq minutes, puis vérifier voix, vibrations et interruptions sur Android.

## Limites de cette V0.1

- Le moteur vocal utilise la synthèse vocale du téléphone : il sera remplacé par des audios professionnels ou une voix dédiée plus tard.
- Aucun fichier audio d'ambiance n'est encore fourni.
- Les autres modules (M'apaiser, Refuge, Sommeil, Douleur, Mon chemin) ne sont pas encore codés.
- Ce prototype n'est pas un dispositif médical et ne doit pas être présenté comme tel.
