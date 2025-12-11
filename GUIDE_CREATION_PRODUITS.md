# Guide de Création et Modification des Produits - MAZIGHO STUDIO PHOTO

## Vue d'ensemble

MAZIGHO STUDIO PHOTO est une plateforme e-commerce complète pour la création de produits photo personnalisés. Ce guide explique comment créer, modifier et gérer les produits.

---

## 1. Architecture du Système

### Structure des Données

Le système est organisé en 4 niveaux :

```
Catégories (4 principales)
├── Photos
├── Livres Photos
├── Calendriers Photos
└── Cadeaux

    ↓

Sous-catégories (17 au total)
├── Photos: 10x15cm, 13x18cm, 20x25cm, 9x13cm, 18x24cm, 21x30cm(A4), 30x40cm
├── Livres: A5, A4, A3, Couverture souple, Couverture rigide
├── Calendriers: Mural, Bureau, Poche
└── Cadeaux: Mug, T-shirt, Coussin, Porte-clés, Tapis souris, Coque téléphone

    ↓

Produits (avec attributs)
├── Nom
├── Description
├── Prix
├── Image
└── Attributs (taille, couleur, matériau)

    ↓

Créations Personnalisées (Studio)
├── Images uploadées
├── Texte personnalisé
├── Filtres appliqués
└── Export PDF
```

---

## 2. Créer un Nouveau Produit

### Via la Base de Données (Admin)

1. **Accédez à la base de données** via le Management UI → Database panel
2. **Table `products`** - Insérez une nouvelle ligne :

```sql
INSERT INTO products (
  name, 
  description, 
  price, 
  image, 
  categoryId, 
  subcategoryId, 
  featured
) VALUES (
  'Photo 20x25cm Glossy',
  'Impression photo haute qualité 20x25cm finition glossy',
  15.99,
  'https://example.com/image.jpg',
  1,  -- categoryId (1=Photos)
  3,  -- subcategoryId (3=20x25cm)
  0   -- featured (0=non, 1=oui)
);
```

### Via l'API tRPC (Développeur)

Utilisez la procédure `products.create` :

```typescript
const createProductMutation = trpc.products.create.useMutation();

await createProductMutation.mutateAsync({
  name: 'Photo 20x25cm Glossy',
  description: 'Impression photo haute qualité 20x25cm finition glossy',
  price: 15.99,
  image: 'https://example.com/image.jpg',
  categoryId: 1,
  subcategoryId: 3,
  featured: false
});
```

---

## 3. Modifier un Produit Existant

### Via la Base de Données

1. **Ouvrez le Management UI → Database panel**
2. **Table `products`** - Modifiez la ligne correspondante
3. **Cliquez sur "Save"** pour appliquer les changements

Exemple de modification :

```sql
UPDATE products 
SET 
  price = 18.99,
  description = 'Nouvelle description',
  featured = 1
WHERE id = 5;
```

### Via l'API tRPC

```typescript
const updateProductMutation = trpc.products.update.useMutation();

await updateProductMutation.mutateAsync({
  productId: 5,
  data: {
    price: 18.99,
    description: 'Nouvelle description',
    featured: true
  }
});
```

---

## 4. Ajouter des Attributs de Produit

Les attributs (taille, couleur, matériau) sont stockés dans la table `productAttributes`.

### Exemple : Ajouter une couleur à un produit

```sql
INSERT INTO productAttributes (
  productId,
  attributeType,  -- 'color', 'size', 'material'
  attributeValue
) VALUES (
  5,
  'color',
  'Noir'
);
```

### Attributs Disponibles

| Type | Valeurs |
|------|---------|
| **size** | 10x15cm, 13x18cm, 20x25cm, 9x13cm, 18x24cm, 21x30cm, 30x40cm, A5, A4, A3 |
| **color** | Noir, Blanc, Bleu, Rouge, Vert, Jaune, Rose, Gris |
| **material** | Papier Glossy, Papier Matte, Papier Satin, Coton, Polyester, Céramique, Silicone |
| **finish** | Glossy, Matte, Satin |

---

## 5. Gérer les Catégories et Sous-catégories

### Voir les Catégories

```sql
SELECT * FROM categories;
```

Résultat :
```
id | name | description | image
1  | Photos | Impressions photographiques | ...
2  | Livres Photos | Livres photo personnalisés | ...
3  | Calendriers Photos | Calendriers avec vos photos | ...
4  | Cadeaux | Articles cadeaux personnalisés | ...
```

### Voir les Sous-catégories

```sql
SELECT * FROM subcategories WHERE categoryId = 1;
```

### Ajouter une Nouvelle Sous-catégorie

```sql
INSERT INTO subcategories (
  categoryId,
  name,
  description
) VALUES (
  1,
  '40x50cm',
  'Impression photo format 40x50cm'
);
```

---

## 6. Créer des Produits Personnalisés (Studio)

### Flux Utilisateur

1. **Cliquez sur "Commencer à créer"** sur la page d'accueil
2. **Sélectionnez un type de produit** :
   - Photos (formats disponibles)
   - Livres Photo (pages, couverture)
   - Calendriers (type, année)
   - Cadeaux (article, couleur)

3. **Uploadez vos images** depuis votre ordinateur
4. **Éditez dans le Studio** :
   - Déplacez et redimensionnez les images
   - Ajoutez du texte
   - Appliquez des filtres (luminosité, contraste, saturation)
   - Prévisualisez en temps réel

5. **Exportez en PDF** :
   - Qualité Standard (96 DPI) - pour l'écran
   - Qualité High (150 DPI) - pour le partage
   - Qualité Professional (300 DPI) - pour l'impression

### Outils d'Édition Disponibles

| Outil | Description |
|-------|-------------|
| **Ajouter Image** | Télécharger une image depuis votre ordinateur |
| **Ajouter Texte** | Insérer du texte personnalisé |
| **Déplacer** | Cliquer et glisser les éléments |
| **Redimensionner** | Utiliser les poignées d'angle |
| **Rotation** | Tourner les éléments |
| **Opacité** | Ajuster la transparence |
| **Filtres** | Luminosité, Contraste, Saturation, Teinte, Flou, Niveaux de gris, Sépia |
| **Présets** | B&W, Sepia, Vintage, Vibrant, Cool, Warm |

---

## 7. Gérer les Projets Sauvegardés

### Sauvegarder un Projet

1. **Dans le Studio**, cliquez sur **"Save"**
2. Le projet est automatiquement sauvegardé dans votre compte

### Charger un Projet Sauvegardé

1. **Accédez à votre compte** → Onglet "Mes Projets"
2. **Cliquez sur un projet** pour le charger dans l'éditeur
3. **Continuez l'édition** ou **exportez en PDF**

### Supprimer un Projet

```sql
DELETE FROM projects WHERE id = 5 AND userId = 123;
```

---

## 8. Gestion des Images S3

Toutes les images uploadées sont stockées sur S3 avec la structure :

```
s3://bucket/
├── users/{userId}/
│   ├── creations/{projectId}/
│   │   ├── image-1.jpg
│   │   ├── image-2.jpg
│   │   └── ...
│   └── projects/{projectId}/
│       └── preview.jpg
└── products/
    ├── category-1.jpg
    ├── product-1.jpg
    └── ...
```

---

## 9. Changer le Titre du Site

### Option 1 : Via Management UI (Recommandé)

1. **Ouvrez le Management UI**
2. **Allez à Settings → General**
3. **Modifiez le "Website name"** en "MAZIGHO STUDIO PHOTO"
4. **Cliquez "Save"**

### Option 2 : Via Variables d'Environnement

Modifiez la variable `VITE_APP_TITLE` :

```env
VITE_APP_TITLE=MAZIGHO STUDIO PHOTO
```

Puis redémarrez le serveur.

---

## 10. Dépannage des Erreurs 404

### Erreur : Page non trouvée

**Causes courantes :**
- Lien cassé dans le menu de navigation
- Route non définie dans `App.tsx`
- Paramètre d'URL manquant

**Solutions :**

1. **Vérifiez les routes** dans `/client/src/App.tsx`
2. **Testez les liens** en cliquant sur chaque menu
3. **Vérifiez les IDs** des catégories/produits dans la base de données

### Routes Disponibles

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/category/:id` | Produits par catégorie |
| `/category/:categoryId/subcategory/:subcategoryId` | Produits par sous-catégorie |
| `/product/:id` | Détail d'un produit |
| `/search` | Résultats de recherche |
| `/studio` | Studio de création |
| `/studio/editor/:projectId` | Éditeur de projet |
| `/create/photo` | Configurateur photos |
| `/create/book` | Configurateur livres |
| `/create/calendar` | Configurateur calendriers |
| `/create/gift` | Configurateur cadeaux |
| `/cart` | Panier |
| `/checkout` | Paiement |
| `/account` | Compte utilisateur |

---

## 11. Exemples Pratiques

### Créer une Série de Produits Photos

```sql
-- Insérer 5 produits photos de différents formats
INSERT INTO products (name, description, price, categoryId, subcategoryId, featured) VALUES
('Photo 10x15cm Glossy', 'Impression photo 10x15cm finition brillante', 5.99, 1, 1, 0),
('Photo 13x18cm Matte', 'Impression photo 13x18cm finition mate', 7.99, 1, 2, 0),
('Photo 20x25cm Satin', 'Impression photo 20x25cm finition satin', 12.99, 1, 3, 1),
('Photo 30x40cm Glossy', 'Grand format 30x40cm finition brillante', 24.99, 1, 7, 1),
('Photo A4 Matte', 'Format A4 (21x30cm) finition mate', 9.99, 1, 6, 0);
```

### Mettre à Jour les Prix

```sql
-- Augmenter tous les prix de 10%
UPDATE products 
SET price = price * 1.10 
WHERE categoryId = 1;
```

### Afficher les Produits Vedettes

```sql
SELECT * FROM products WHERE featured = 1 ORDER BY price DESC LIMIT 10;
```

---

## 12. Support et Aide

Pour toute question ou problème :

1. **Consultez les logs** du serveur
2. **Vérifiez la base de données** via Management UI
3. **Testez les procédures tRPC** via le navigateur (F12 → Console)
4. **Contactez le support** Manus

---

## Résumé des Commandes Principales

```sql
-- Voir tous les produits
SELECT * FROM products;

-- Voir les catégories
SELECT * FROM categories;

-- Voir les sous-catégories
SELECT * FROM subcategories;

-- Créer un produit
INSERT INTO products (...) VALUES (...);

-- Modifier un produit
UPDATE products SET ... WHERE id = ?;

-- Supprimer un produit
DELETE FROM products WHERE id = ?;

-- Voir les attributs d'un produit
SELECT * FROM productAttributes WHERE productId = ?;

-- Voir les projets d'un utilisateur
SELECT * FROM projects WHERE userId = ?;
```

---

**Dernière mise à jour :** Décembre 2025  
**Version :** 1.0  
**Plateforme :** MAZIGHO STUDIO PHOTO
