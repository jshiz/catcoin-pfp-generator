export const attributesConfig = [
  {
    id: 'background',
    label: 'Background',
    zIndex: 10,
    items: [
      { id: 'bg_1', label: 'Midnight', color: '#18181c' },
      { id: 'bg_2', label: 'Cat Yellow', color: '#fad205' },
      { id: 'bg_3', label: 'Deep Blue', color: '#1e3a8a' },
      { id: 'bg_4', label: 'Emerald', color: '#065f46' },
      { id: 'bg_5', label: 'Purple Haze', color: '#581c87' },
      { id: 'bg_6', label: 'Crimson', color: '#991b1b' },
      { id: 'bg_7', label: 'Charcoal', color: '#374151' },
      { id: 'bg_8', label: 'Teal', color: '#115e59' },
      { id: 'bg_9', label: 'Burnt Orange', color: '#c2410c' },
      { id: 'bg_10', label: 'Hot Pink', color: '#be185d' },
    ]
  },
  {
    id: 'costume',
    label: 'Costume',
    zIndex: 75, // Covers accessories (70) but under Border (90)
    items: [
      { id: 'costume_1', label: 'None', type: 'none' },
      { id: 'costume_2', label: 'Batcat', src: '/assets/costumes/batcat.png', type: 'image' },
      { id: 'costume_3', label: 'Beetlecat', src: '/assets/costumes/beetlecat.png', type: 'image' },
      { id: 'costume_7', label: 'Catwoman', src: '/assets/costumes/catwoman.png', type: 'image' },
      { id: 'costume_4', label: 'Ghostface', src: '/assets/costumes/ghostfacemeow.png', type: 'image' },
      { id: 'costume_8', label: 'Gokuat', src: '/assets/costumes/gokuat.png', type: 'image' },
      { id: 'costume_9', label: 'Jason', src: '/assets/costumes/jason.png', type: 'image' },
      { id: 'costume_12', label: 'Kryptocat', src: '/assets/costumes/kryptocat.png', type: 'image' },
      { id: 'costume_5', label: 'Mad Catz', src: '/assets/costumes/madcatz.png', type: 'image' },
      { id: 'costume_6', label: 'Terminapur', src: '/assets/costumes/terminapur.png', type: 'image' },
      { id: 'costume_10', label: 'Turbocat', src: '/assets/costumes/turbocat.png', type: 'image' },
      { id: 'costume_11', label: 'Cybercat', src: '/assets/costumes/cybercat.png', type: 'image' },
    ]
  },
  {
    id: 'body',
    label: 'Body',
    zIndex: 20,
    items: [
      { id: 'body_none', label: 'None', type: 'none', hidden: true },
      { id: 'body_1', label: 'Basic', src: '/assets/body/basic.png', type: 'image' },
      { id: 'body_2', label: 'Black', src: '/assets/body/black.png', type: 'image' },
      { id: 'body_3', label: 'Cheetah', src: '/assets/body/cheetah.png', type: 'image' },
      { id: 'body_4', label: 'Chrome', src: '/assets/body/chrome.png', type: 'image' },
      { id: 'body_5', label: 'Ghost', src: '/assets/body/ghost.png', type: 'image' },
      { id: 'body_6', label: 'Gold', src: '/assets/body/gold.png', type: 'image' },
      { id: 'body_7', label: 'Rainbow', src: '/assets/body/rainbow.png', type: 'image' },
      { id: 'body_8', label: 'Tiger', src: '/assets/body/tiger.png', type: 'image' },
    ]
  },
  {
    id: 'eyes',
    label: 'Eyes',
    zIndex: 25,
    items: [
      { id: 'eyes_1', label: 'None', type: 'none' },
      { id: 'eyes_2', label: 'Green', src: '/assets/eyes/green.png', type: 'image' },
      { id: 'eyes_3', label: 'Red', src: '/assets/eyes/red.png', type: 'image' },
      { id: 'eyes_4', label: 'Teal', src: '/assets/eyes/teal.png', type: 'image' },
      { id: 'eyes_5', label: 'White', src: '/assets/eyes/white.png', type: 'image' },
      { id: 'eyes_6', label: 'Yellow', src: '/assets/eyes/yellow.png', type: 'image' },
    ]
  },
  {
    id: 'shirt',
    label: 'Shirt',
    zIndex: 60,
    items: [
      { id: 'shirt_1', label: 'None', type: 'none' },
      { id: 'shirt_2', label: 'Trucker', src: '/assets/shirt/trucker.png', type: 'image' },
      { id: 'shirt_3', label: 'Biker', src: '/assets/shirt/biker.png', type: 'image' },
      { id: 'shirt_4', label: 'Freddy', src: '/assets/shirt/freddy.png', type: 'image' },
    ]
  },
  {
    id: 'chain',
    label: 'Chain',
    zIndex: 70,
    items: [
      { id: 'chain_1', label: 'None', type: 'none' },
      { id: 'chain_2', label: 'Gold', src: '/assets/chain/gold.png', type: 'image' },
    ]
  },
  {
    id: 'glasses',
    label: 'Glasses',
    zIndex: 40,
    items: [
      { id: 'glasses_1', label: 'None', type: 'none' },
      { id: 'glasses_2', label: 'Old Skool', src: '/assets/glasses/old-skool.png', type: 'image' },
      { id: 'glasses_3', label: 'Reading', src: '/assets/glasses/reading.png', type: 'image' },
      { id: 'glasses_4', label: 'Ski', src: '/assets/glasses/ski.png', type: 'image' },
      { id: 'glasses_5', label: 'Rayban', src: '/assets/glasses/rayban.png', type: 'image' },
      { id: 'glasses_6', label: 'Neovision', src: '/assets/glasses/neovision.png', type: 'image' },
    ]
  },
  {
    id: 'hat',
    label: 'Hat',
    zIndex: 50,
    items: [
      { id: 'hat_1', label: 'None', type: 'none' },
      { id: 'hat_2', label: 'Army', src: '/assets/hat/army.png', type: 'image' },
      { id: 'hat_6', label: 'Beer', src: '/assets/hat/beer.png', type: 'image' },
      { id: 'hat_3', label: 'Cowboy', src: '/assets/hat/cowboy.png', type: 'image' },
      { id: 'hat_4', label: 'Crown', src: '/assets/hat/crown.png', type: 'image' },
      { id: 'hat_7', label: 'Police', src: '/assets/hat/police.png', type: 'image' },
      { id: 'hat_8', label: 'Taxi', src: '/assets/hat/taxi.png', type: 'image' },
      { id: 'hat_9', label: 'Top Hat', src: '/assets/hat/tophat.png', type: 'image' },
      { id: 'hat_10', label: 'Viking', src: '/assets/hat/viking.png', type: 'image' },
    ]
  },
  {
    id: 'mouth',
    label: 'Mouth',
    zIndex: 30,
    items: [
      { id: 'mouth_1', label: 'None', type: 'none' },
    ]
  },
  {
    id: 'border',
    label: 'Border',
    zIndex: 90,
    items: [
      { id: 'border_1', label: 'None', type: 'none' },
      { id: 'border_2', label: 'White', color: '#ffffff' },
      { id: 'border_3', label: 'Neon Yellow', color: '#fad205' },
      { id: 'border_4', label: 'Cyan', color: '#06b6d4' },
      { id: 'border_5', label: 'Electric Purple', color: '#a855f7' },
      { id: 'border_6', label: 'Lime Green', color: '#84cc16' },
      { id: 'border_7', label: 'Hot Pink', color: '#ec4899' },
      { id: 'border_8', label: 'Orange Juice', color: '#f97316' },
      { id: 'border_9', label: 'Red Alert', color: '#ef4444' },
      { id: 'border_10', label: 'Silver', color: '#9ca3af' },
      { id: 'border_11', label: 'Gold', color: '#fbbf24' },
    ]
  }
];
