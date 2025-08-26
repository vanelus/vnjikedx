# Test du Plugin Modernisé

Ce document décrit comment tester le plugin vnjikedx modernisé pour SF CLI v2.

## Installation et Test

### 1. Installation locale du plugin

```bash
# Dans le répertoire du plugin
npm run build

# Installation locale pour test
sf plugins link .
```

### 2. Vérification des commandes

```bash
# Lister les plugins installés
sf plugins

# Voir l'aide des commandes
sf vnjike --help
sf vnjike data backup --help
sf vnjike metadata label upsert --help
```

### 3. Test des commandes

```bash
# Test de la commande backup (nécessite une org connectée)
sf vnjike data backup --target-org myorg@example.com --target-directory "./backup"

# Test de la commande upsert (nécessite une org connectée)
sf vnjike metadata label upsert --target-org myorg@example.com --target-label-name "TestLabel" --target-label-value "Test Value"
```

## Principales Modifications Apportées

### 1. **Structure des Commandes**
- ✅ Migration de `SfdxCommand` vers `SfCommand`
- ✅ Mise à jour des flags avec la nouvelle syntaxe
- ✅ Changement de `--targetusername` vers `--target-org`
- ✅ Mise à jour des exemples pour utiliser `sf` au lieu de `sfdx`

### 2. **Dépendances**
- ✅ `@salesforce/command` → `@salesforce/sf-plugins-core`
- ✅ `@oclif/core` mis à jour vers v3+
- ✅ `@salesforce/core` mis à jour vers v6+
- ✅ Node.js minimum requis: v18+

### 3. **Configuration TypeScript**
- ✅ Types ajoutés pour tous les paramètres
- ✅ Gestion d'erreurs améliorée
- ✅ Imports modernisés
- ✅ Configuration ESLint mise à jour

### 4. **Package.json**
- ✅ Changement du binaire de `sfdx` vers `sf`
- ✅ Structure des topics mise à jour
- ✅ Scripts de build modernisés

## Compatibilité

Le plugin est maintenant compatible avec:
- ✅ SF CLI v2
- ✅ Node.js 18+
- ✅ TypeScript 5+
- ✅ Nouvelles conventions de nommage des flags

## Migration des Utilisateurs

Les utilisateurs existants devront mettre à jour leurs scripts:

**Avant (SFDX CLI):**
```bash
sfdx vnjike:data:backup --targetusername myorg@example.com --targetdirectory "./backup"
```

**Après (SF CLI v2):**
```bash
sf vnjike data backup --target-org myorg@example.com --target-directory "./backup"
```
