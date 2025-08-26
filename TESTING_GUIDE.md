# Guide de Test et Lancement du Plugin vnjikedx

## 🚀 Étapes pour Tester le Plugin

### 1. **Préparation de l'Environnement**

```bash
# Assurez-vous d'avoir SF CLI v2 installé
sf --version

# Vérifiez que vous êtes dans le répertoire du plugin
cd c:\Users\HP\Desktop\PRO\PROJETS\ProactivBuild\vnjikedx

# Construisez le plugin
npm run build
```

### 2. **Installation Locale pour Test**

```bash
# Liez le plugin localement pour test
sf plugins link .

# Vérifiez que le plugin est installé
sf plugins

# Vous devriez voir quelque chose comme :
# vnjikedx 0.0.3 (link) c:\Users\HP\Desktop\PRO\PROJETS\ProactivBuild\vnjikedx
```

### 3. **Test des Commandes**

#### **Vérification de l'aide**
```bash
# Aide générale du plugin
sf vnjike --help

# Aide spécifique pour backup
sf vnjike data backup --help

# Aide spécifique pour upsert
sf vnjike metadata label upsert --help
```

#### **Test avec une Org de Développement**

**Prérequis :** Vous devez avoir une org Salesforce connectée :
```bash
# Connectez-vous à une org si pas encore fait
sf org login web --alias mydevorg

# Listez vos orgs connectées
sf org list
```

**Test de la commande backup :**
```bash
# Créez un dossier de test
mkdir test-backup

# Testez la commande backup (ATTENTION: cela télécharge vraiment les données)
sf vnjike data backup --target-org mydevorg --target-directory "./test-backup"
```

**Test de la commande upsert :**
```bash
# Testez la création/mise à jour d'un label personnalisé
sf vnjike metadata label upsert --target-org mydevorg --target-label-name "TestLabel" --target-label-value "Valeur de test"

# Vérifiez dans Setup > Custom Labels que le label a été créé
```

### 4. **Debug en Cas de Problème**

```bash
# Mode debug pour voir plus de détails
sf vnjike data backup --target-org mydevorg --target-directory "./test-backup" --loglevel debug

# Ou avec des variables d'environnement
DEBUG=* sf vnjike data backup --target-org mydevorg --target-directory "./test-backup"
```

## 📦 Publication du Plugin

### 1. **Préparation pour la Publication**

```bash
# Vérifiez que tout compile sans erreur
npm run build

# Vérifiez les tests (s'ils existent)
npm test

# Vérifiez la qualité du code
npm run lint
```

### 2. **Publication sur NPM**

```bash
# Connectez-vous à NPM (première fois seulement)
npm login

# Publiez le plugin
npm publish

# Ou en mode public si c'est un package privé
npm publish --access public
```

### 3. **Installation Publique**

Une fois publié, les utilisateurs peuvent installer le plugin :

```bash
# Installation directe depuis NPM
sf plugins install vnjikedx

# Ou installation depuis GitHub
sf plugins install https://github.com/vanelus/vnjikedx
```

## 🛠️ Commandes Disponibles

### **Backup des Données**
```bash
sf vnjike data backup --target-org <alias|username> --target-directory <chemin>

# Exemple :
sf vnjike data backup --target-org prodorg --target-directory "C:/backups/$(date +%Y%m%d)"
```

### **Gestion des Labels Personnalisés**
```bash
sf vnjike metadata label upsert --target-org <alias|username> --target-label-name <nom> --target-label-value <valeur>

# Exemple :
sf vnjike metadata label upsert --target-org devorg --target-label-name "Error_Message" --target-label-value "Une erreur s'est produite"
```

## 🚨 Points d'Attention

### **Sécurité**
- ⚠️ La commande backup télécharge TOUTES les données de l'org
- ⚠️ Utilisez uniquement sur des orgs de test pour les premiers tests
- ⚠️ Assurez-vous d'avoir les permissions appropriées

### **Performance**
- ⏱️ Le backup peut prendre beaucoup de temps sur de grosses orgs
- 💾 Assurez-vous d'avoir suffisamment d'espace disque
- 🌐 Une connexion stable est recommandée

### **Compatibilité**
- ✅ Compatible avec SF CLI v2 uniquement
- ✅ Nécessite Node.js 18+
- ✅ Testé sur Windows, Linux et macOS

## 🐛 Dépannage

### **Erreur "Plugin not found"**
```bash
# Désinstallez et réinstallez
sf plugins uninstall vnjikedx
sf plugins install vnjikedx
```

### **Erreur de compilation TypeScript**
```bash
# Nettoyez et recompilez
npm run clean
npm run build
```

### **Problème de permissions**
```bash
# Vérifiez vos permissions d'org
sf org display --target-org myorg
```

## 📝 Tests de Validation

Avant de publier, vérifiez que :

- [ ] La compilation réussit sans erreur
- [ ] Les commandes d'aide fonctionnent
- [ ] Le backup fonctionne sur une org de test
- [ ] L'upsert de labels fonctionne
- [ ] Pas d'erreurs dans les logs
- [ ] La documentation est à jour

## 🎯 Prochaines Étapes

1. **Testez localement** avec `sf plugins link .`
2. **Validez sur une org de développement**
3. **Publiez sur NPM** avec `npm publish`
4. **Documentez** les nouvelles fonctionnalités
5. **Communiquez** la migration vers SF CLI v2
