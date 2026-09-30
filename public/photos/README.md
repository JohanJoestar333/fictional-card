# Local Photos Folder (`/public/photos/`)

Drop your custom card photos and background designs right into this folder!

### How to use your local photos:

1. Copy or save your image file here:
   `public/photos/my-card.png`

2. In **`src/config/cardTemplates.ts`**, reference it using the local path:
   ```typescript
   export const USER_CARD_TEMPLATES: UserTemplateConfig[] = [
     {
       id: 'my-custom-card-1',
       name: 'My Custom Card',
       imageUrl: '/photos/my-card.png', // <-- Local path to your photo!
       subtitle: 'Custom Edition',
       badge: 'Custom',
       textColor: '#FFFFFF',
     },
   ];
   ```

Any image placed in this folder is instantly accessible in the app via `/photos/your-image-name.png` (supports `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`).
