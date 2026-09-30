# Card Templates Directory

Place any card background photos you want to use here!

For example:
- `public/card-templates/my_card_photo.png`
- `public/card-templates/custom_art.jpg`

Then reference them in `src/config/cardTemplates.ts`:
```ts
export const USER_CARD_TEMPLATES = [
  {
    id: 'my-custom-card',
    name: 'My Card Name',
    imageUrl: '/card-templates/my_card_photo.png',
    subtitle: 'Custom Photo Edition',
    badge: 'Custom',
    textColor: '#FFFFFF',
  },
];
```
They will automatically appear as selectable card templates in the studio!
