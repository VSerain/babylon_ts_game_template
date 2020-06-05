# Template TS GAME
A template for easy start a 3d webGl game with BabylonJS and TypeScript

For install : 
 1. `npm install -g webpack webpack-cli http-server`
 2. `npm install`

For dev 
 1. `npm run watch`
 2. Go to http://localhost:3066
 3. You can dev :) Good luck !

# Fonctionement Global

Le but est simplifier le demarage d'un jeu 3d 

Pour celà l'architecture est séparer en 5 grosse parties :

    1. La partie player qui gere les deplacement, les collision ext...
    2. La partie scenery (Scene ou Décors) qui gère tous les objects de la scene qui non pas d'interaction avec le joueur par exemple : un mur, une table ! (On peut activer ou non la colission / gravité sur chaque objet)
    3. La partie objects qui gère les objects interactif du jeu comme un bouton ou un coffre
    4. La partie entities gère toute les enité qui peuve ce deplacé et interagire avec le joueur mais aussi avec les objects ! On retrouvera la dedans toute la gestion des enemies par exemple
    5. Le Loader qui permet de charger les assets et de les injecter dans les autre partie

Dans l'export de la scene via blender / maya nous pouvon donner des type a chaque mesh pour les lié avec une class qui gerrera la mesh pendans la partie !

En gros si tu donne le type ground à une mesh alors dans le code elle sera lier a la class ground qui elle active la collision avec ça mesh

Les different types actuel :

Pour la partie scenery:

    - ground // Indique que la mesh est un sol et active la collision avec celle ci !
    - object-physics // Indique que la mesh est un object qui reponds au lois de la physic (collision + gravité)
    - object-collisions // Indique que la mesh na pas de physic mais que le joueur ne peut pas la traverser (collision activée)

Pour la partie player:
    - player-camera // Indique le point de depart du joueur

Les types peuvent prendre des parametre optionnel :

object-physics :   
    - mass : number // Defini la mass de l'object
    - restitution: number // Defini la force de restitution d'un choque (rebondisement)

object-collisions :   
    - restitution: number // Defini la force de restitution d'un choque (rebondisement)


Voila ! 

ps:    
Dans blender (surment dans maya) pour definir les type et les parametres il faut les ajouter dans custom property

Par exemple pour definir un object-physics il faut ajouter une custom property avec comme nom `type` et comme valeur `object-physics`, pour les parametres c'est la même chose, ajoute une custom property avec comme nom `mass` et en valeur le nombre que tu veux !
