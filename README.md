# Documentation de l'application Piano Web en JavaScript

## Introduction

L'application **Piano Web** est une simulation interactive d'un piano réalisée en JavaScript. Elle permet à l'utilisateur de jouer des notes en cliquant sur les touches du piano affichées dans une interface web. Ce projet est conçu pour offrir une expérience simple et accessible de piano en ligne, sans nécessiter d'installation de logiciel spécifique.

## Fonctionnalités

- Interface graphique représentant un piano avec des touches blanches et noires.
- Possibilité de jouer des notes en cliquant sur les touches avec la souris.
- Support du clavier : les touches du clavier physique sont mappées aux touches du piano.
- Affichage de la note jouée en temps réel.
- **Jeu Guitar Hero** : Le joueur doit appuyer sur les touches au bon moment pour jouer une chanson.
- **Démo de la chanson canonInDHard** : Le joueur peut lancer la démo qui joue la chanson canonInDHard avec le piano de l'application.
- Compatible avec les navigateurs modernes.

## Prérequis

Avant de commencer à utiliser cette application, vous devez disposer de :

- Un navigateur web moderne (Chrome, Firefox, Safari, Edge, etc.)
- Une connexion Internet pour accéder à l'application (si elle est hébergée en ligne).

## Installation

### 1. Téléchargement

Si vous souhaitez héberger cette application localement sur votre machine, suivez ces étapes :

1. Clonez ou téléchargez ce projet à partir de son [dépôt GitHub](https://github.com/votre-utilisateur/piano-web) (remplacez par l'URL correcte de votre projet).
   
2. Extrayez le contenu du projet dans un dossier sur votre machine locale.

### 2. Structure du projet

Voici la structure de base du projet :

/piano-web 
    ├── index.html # Fichier HTML de l'interface 
    ├── style.css # Feuille de style pour l'interface 
    ├── script.js # Fichier JavaScript pour la logique de l'application 
    ├── game.js # Logique du jeu Guitar Hero
    ├── demo.js # Logique de la démo de la chanson canonInDHard
    └── README.md # Documentation du projet

### 3. Jeu Guitar Hero

Le jeu Guitar Hero ajouté permet au joueur de jouer une chanson en appuyant sur les bonnes touches de piano au bon moment. Voici comment fonctionne cette fonctionnalité :

#### 3.1 Mode Jeu

- Le joueur doit choisir une chanson dans une liste de chansons disponibles.
- Une barre défile avec des symboles représentant les notes qu'il doit jouer. Les symboles défilent de haut en bas.
- Le joueur doit appuyer sur la touche correspondante au moment où le symbole atteint la ligne d'action.
- Si le joueur appuie sur la touche au bon moment, la note est jouée. Sinon, il rate la note.

#### 3.2 Déroulement du jeu

1. **Sélection de la chanson** : Le joueur peut choisir une chanson parmi une liste de morceaux pré-chargés (par exemple, "Do, Ré, Mi", ou d'autres chansons populaires).
2. **Affichage des notes défilantes** : Les notes défilent depuis le haut de l'écran vers la ligne de jeu.
3. **Réponse en temps réel** : Lorsque les notes atteignent la ligne d'action, le joueur doit appuyer sur la touche correspondante du piano avant que la note n'atteigne cette ligne pour marquer un point.
4. **Scoring** : Le joueur reçoit des points en fonction de la précision avec laquelle il appuie sur les touches. Un score est affiché pendant et après la chanson.

#### 3.3 Interface de Jeu

L'interface de jeu affichera :

- **Une barre défilante** avec les notes à jouer.
- **Les touches du piano** correspondantes.
- **Le score actuel** et le temps restant.
- **Un bouton de démarrage** pour commencer la chanson.

### 4. Démo de la chanson canonInDHard

La démo de la chanson canonInDHard permet au joueur de jouer la chanson canonInDHard avec le piano de l'application.

#### 4.1 Interface de la démo

L'interface de la démo affichera :

- **Un bouton de démarrage** pour commencer la démo.
- **Un bouton d'arrêt** pour arrêter la démo.

### 4. Ouverture du projet

Pour tester l'application localement :

1. Ouvrez le fichier `index.html` dans votre navigateur.

### 5. Serveur local (facultatif)

Si vous souhaitez utiliser un serveur local pour exécuter le projet, vous pouvez utiliser un outil comme **vite** dans Visual Studio Code ou un autre serveur HTTP local.

## Utilisation

### 1. Interface graphique

L'interface est composée de touches de piano blanches et noires. Chaque touche correspond à une note spécifique.

- **Touches blanches** : Représentent les notes naturelles (Do, Ré, Mi, Fa, Sol, La, Si).
- **Touches noires** : Représentent les notes dièses et bémols (Do#, Ré#, Fa#, Sol#, La#).

### 2. Interactions

- **Cliquer sur les touches** : Vous pouvez jouer une note en cliquant sur une touche de piano avec votre souris.
- **Utilisation du clavier physique** : Les touches de votre clavier sont mappées aux touches du piano. Par exemple :
  - `Q` pour Do
  - `S` pour Ré
  - `D` pour Mi
  - `F` pour Fa
  - `G` pour Sol
  - `H` pour La
  - `J` pour Si
  - Les touches fléchées et d'autres peuvent être mappées à des touches noires.

### 3. Visualisation des notes jouées

Lorsque vous appuyez sur une touche, la note correspondante est jouée et affichée sur l'écran sous forme de texte. Par exemple, "Do" ou "Mi".

## Développement

Si vous souhaitez contribuer ou personnaliser l'application, voici quelques détails techniques :

### Structure du code

1. **`index.html`** : Contient la structure HTML de la page, y compris les éléments d'interface pour le piano.
2. **`style.css`** : Déclare les styles CSS pour l'interface (mise en forme des touches, couleurs, etc.).
3. **`script.js`** : Contient la logique JavaScript pour gérer les événements de clic sur les touches et la gestion du son.
4. **`game.js`** : Contient la logique du jeu Guitar Hero, y compris la gestion des notes défilantes et de la détection des entrées du joueur.

### Ajouter des fonctionnalités

Vous pouvez étendre cette application en ajoutant des fonctionnalités supplémentaires, comme :

- Un enregistreur de musique pour jouer des mélodies.
- La possibilité de jouer des accords ou des gammes.
- Des effets sonores spéciaux (réverbération, chorus, etc.).
- Une interface plus avancée avec des touches plus petites ou un clavier étendu.

## Contributions

Les contributions au projet sont les bienvenues ! Si vous avez des suggestions, des corrections de bugs ou des améliorations, vous pouvez :

1. Forker le projet.
2. Créer une nouvelle branche.
3. Soumettre une pull request avec vos changements.

## Auteurs

- [matheves](https://github.com/matheves) - Créateur et mainteneur de l'application.

## Remerciements

Merci à tous ceux qui ont contribué à ce projet, que ce soit par des retours d'expérience, des suggestions ou des pull requests.

---

*Cette documentation est susceptible d'être mise à jour régulièrement. Pour plus de détails, consultez le fichier `README.md` du projet.*
