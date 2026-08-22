# RÉSONANCE — Compilation APK directe Android

Le projet est configuré pour produire un APK installable directement sur un smartphone Android avec Expo EAS Build.

## Étape unique de mise en place

EAS Build exige un compte Expo (le plan gratuit suffit pour lancer des builds). Créez un compte sur expo.dev si nécessaire.

## Compilation

Dans le dossier du projet :

```bash
npm install
npx eas-cli@latest login
npm run build:apk
```

Au premier build, EAS peut demander de créer/lier le projet et de générer les identifiants de signature Android. Suivre les choix proposés pour laisser EAS les gérer.

À la fin du build, EAS fournit un lien vers l'artefact APK. Ouvrir ce lien sur le smartphone Android, télécharger le fichier `.apk`, puis l'installer.

## Profil utilisé

Le fichier `eas.json` contient un profil `preview` avec :

```json
{
  "distribution": "internal",
  "android": { "buildType": "apk" }
}
```

Cela produit un APK installable directement, contrairement au format AAB destiné au Play Store.
