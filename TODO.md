# TODO - Corrections des erreurs WhatsApp Clone

## Étapes à effectuer:

- [ ] 1. Corriger types.tsx - Synchroniser RootTabParamList avec navigation/index.tsx
- [ ] 2. Corriger navigation/index.tsx - Importer StatusScreen correctement et organiser les composants
- [ ] 3. Corriger ChatComponent.tsx - Utiliser le bon type de navigation
- [ ] 4. Tester que l'application compile sans erreurs

## Problèmes identifiés:

1. **types.tsx**: RootTabParamList (Chats, Status, Calls) ne correspond pas à navigation (Discussion, PBO, Ticket)
2. **navigation/index.tsx**: StatusScreen non importé, double navigation avec App.tsx
3. **ChatComponent.tsx**: Navigation type devrait être plus spécifique

