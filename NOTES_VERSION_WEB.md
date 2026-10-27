# Résonance — Atelier navigateur

Version : 0.1.2-web-preview. Statut : prototype de développement. Date : 27 octobre 2026.

Base : main, commit d39b879f4361e78a9a26eb70b018a3d75fc84969.

Cette étape ajoute les dépendances web Expo, une fenêtre de lecture centrée, un lancement Windows et le verrouillage npm. Elle corrige la pause du mouvement et retire les appels pause/resume vocaux incompatibles avec Android. Sur le web, la voix est activée par un clic explicite.

Le périmètre fonctionnel reste celui du MVP SOS. Les indicateurs CORPS/MENTAL/ÉLAN de l’accueil sont signalés comme des valeurs de démonstration ; le bouton « Retrouver mon calme » ouvre désormais le choix de l’intensité puis la séance respiratoire. Les autres modules ne sont pas développés. Cette version ne promet ni usage en arrière-plan, ni synchronisation ordinateur/téléphone, ni fonctionnement vocal hors connexion.

Aucune migration du SDK et aucune réparation du workflow APK ne font partie de cette étape.

## Vérifications effectuées

Le 27 octobre 2026 : compatibilité des dépendances validée par `expo install --check` ; export Metro web réussi ; export du bundle Android réussi (ceci n’est pas une compilation APK).

Essais automatisés Chromium sur l’export web : parcours SOS, chronomètre en pause/reprise, fin anticipée, enregistrement et persistance après rechargement, transition vers l’expiration après quatre secondes, mouvement figé pendant la pause et fin automatique avec une horloge simulée de cinq minutes. Aucun défaut JavaScript non intercepté observé sur ce parcours.

À vérifier humainement : qualité sonore et voix françaises sur Windows, séance réelle de cinq minutes, lancement du fichier Windows et comportement sur téléphone Android.

Le parcours automatisé a également réussi en ouvrant le fichier HTML autonome en mode fichier local dans Chromium. La voix audible et le lancement Windows restent à vérifier sur le poste utilisateur.

## Améliorations de la version 0.1.2

Le raccourci calme ouvre la séance existante après choix de l’intensité. Les notes avant/après ne sont plus préremplies et sont réinitialisées à chaque nouveau parcours. Le récapitulatif n’affirme plus que l’utilisateur a évité un comportement : il conserve uniquement les intensités déclarées et le fait d’avoir pris ce temps. Les anciens enregistrements sont conservés tels quels.

Le parcours Chromium local inclut le raccourci calme, le blocage tant qu’aucune intensité n’est choisie, la réinitialisation entre séances et la sélection valide de zéro sur dix.
