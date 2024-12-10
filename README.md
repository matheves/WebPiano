# Documentation de l'application Piano Web en JavaScript

## Introduction

L'application **Piano Web** est une simulation interactive d'un piano réalisée en JavaScript. Elle permet à l'utilisateur de jouer des notes en cliquant sur les touches du piano affichées dans une interface web. Ce projet est conçu pour offrir une expérience simple et accessible de piano en ligne, sans nécessiter d'installation de logiciel spécifique.

## Fonctionnalités

- Interface graphique représentant un piano avec des touches blanches et noires.
- Possibilité de jouer des notes en cliquant sur les touches avec la souris.
- Support du clavier : les touches du clavier physique sont mappées aux touches du piano.
- Affichage de la note jouée en temps réel.
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
    └── README.md # Documentation du projet


### 3. Ouverture du projet

Pour tester l'application localement :

1. Ouvrez le fichier `index.html` dans votre navigateur.

### 4. Serveur local (facultatif)

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

### Ajout de nouveaux sons

Les sons des touches sont généralement stockés sous forme de fichiers audio (par exemple, `.mp3` ou `.wav`). Si vous souhaitez ajouter ou modifier des sons, vous devez modifier la logique dans `script.js` pour charger de nouveaux fichiers sonores.

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
