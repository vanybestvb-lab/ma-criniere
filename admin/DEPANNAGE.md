# Dépannage

## EPERM lors de `npm run db:generate` (Windows)

**Erreur :** `EPERM: operation not permitted, rename ... query_engine-windows.dll.node`

Windows ou OneDrive verrouille le fichier. À faire **dans l’ordre** :

1. **Arrêter tout** : fermer le serveur (`Ctrl+C`), quitter Cursor/VS Code.
2. **Pause OneDrive** (si le projet est dans OneDrive) : clic droit sur l’icône OneDrive → « Pause la synchronisation » (2 h par ex.).
3. **Ouvrir PowerShell en administrateur** : clic droit sur PowerShell → « Exécuter en tant qu’administrateur ».
4. Aller dans le dossier admin et lancer la génération :
   ```bash
   cd C:\Users\vanyb\OneDrive\Documents\GitHub\ma-criniere\admin
   npm run db:generate
   ```
5. Si ça échoue encore, **déplacer le projet hors de OneDrive** (ex. `C:\dev\ma-criniere`), puis refaire `npm install` et `npm run db:generate` dans `admin/`.

Une fois `db:generate` terminé sans erreur, tu peux rouvrir Cursor et lancer `npm run dev`.
