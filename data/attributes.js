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
      // Gradient Backgrounds
      {
        id: 'bg_grad_1', label: 'Sunset Drive',
        color: 'linear-gradient(to bottom, #f97316, #ec4899, #8b5cf6)',
        canvasGradient: {
          type: 'linear', x0: 0, y0: 0, x1: 0, y1: 512,
          stops: [[0, '#f97316'], [0.5, '#ec4899'], [1, '#8b5cf6']]
        }
      },
      {
        id: 'bg_grad_2', label: 'Ocean Breeze',
        color: 'linear-gradient(to bottom right, #06b6d4, #3b82f6, #1e3a8a)',
        canvasGradient: {
          type: 'linear', x0: 0, y0: 0, x1: 512, y1: 512,
          stops: [[0, '#06b6d4'], [0.5, '#3b82f6'], [1, '#1e3a8a']]
        }
      },
      {
        id: 'bg_grad_3', label: 'Neon Cyber',
        color: 'linear-gradient(135deg, #18181c, #4c1d95, #c026d3)',
        canvasGradient: {
          type: 'linear', x0: 0, y0: 0, x1: 512, y1: 512,
          stops: [[0, '#18181c'], [0.5, '#4c1d95'], [1, '#c026d3']]
        }
      },
      {
        id: 'bg_grad_4', label: 'Golden Hour',
        color: 'radial-gradient(circle at center, #facc15, #ca8a04, #854d0e)',
        canvasGradient: {
          type: 'radial', x0: 256, y0: 256, r0: 0, x1: 256, y1: 256, r1: 360,
          stops: [[0, '#facc15'], [0.5, '#ca8a04'], [1, '#854d0e']]
        }
      },
      {
        id: 'bg_grad_5', label: 'Forest Mist',
        color: 'linear-gradient(to top, #022c22, #047857, #34d399)',
        canvasGradient: {
          type: 'linear', x0: 0, y0: 512, x1: 0, y1: 0,
          stops: [[0, '#022c22'], [0.5, '#047857'], [1, '#34d399']]
        }
      },
      {
        id: 'bg_grad_6', label: 'Cotton Candy',
        color: 'linear-gradient(to right, #f472b6, #e879f9, #a78bfa)',
        canvasGradient: {
          type: 'linear', x0: 0, y0: 0, x1: 512, y1: 0,
          stops: [[0, '#f472b6'], [0.5, '#e879f9'], [1, '#a78bfa']]
        }
      },
      {
        id: 'bg_grad_7', label: 'Midnight City',
        color: 'linear-gradient(to bottom, #000000, #1e1b4b, #312e81)',
        canvasGradient: {
          type: 'linear', x0: 0, y0: 0, x1: 0, y1: 512,
          stops: [[0, '#000000'], [0.4, '#1e1b4b'], [1, '#312e81']]
        }
      },
      {
        id: 'bg_grad_8', label: 'Lava Flow',
        color: 'radial-gradient(circle at top left, #ef4444, #991b1b, #450a0a)',
        canvasGradient: {
          type: 'radial', x0: 0, y0: 0, r0: 0, x1: 256, y1: 256, r1: 724,
          stops: [[0, '#ef4444'], [0.4, '#991b1b'], [1, '#450a0a']]
        }
      },
      { id: 'bg_custom', label: 'Custom', type: 'custom' },
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
      { id: 'body_9', label: 'Camo', src: '/assets/body/camo.png', type: 'image' },
      { id: 'body_3', label: 'Cheetah', src: '/assets/body/cheetah.png', type: 'image' },
      { id: 'body_4', label: 'Chrome', src: '/assets/body/chrome.png', type: 'image' },
      { id: 'body_5', label: 'Ghost', src: '/assets/body/ghost.png', type: 'image' },
      { id: 'body_6', label: 'Gold', src: '/assets/body/gold.png', type: 'image' },
      { id: 'body_7', label: 'Rainbow', src: '/assets/body/rainbow.png', type: 'image' },
      { id: 'body_8', label: 'Tiger', src: '/assets/body/tiger.png', type: 'image' },
      { id: 'body_10', label: 'Alien', src: '/assets/body/alien.png', type: 'image' },
      { id: 'body_11', label: 'Robot', src: '/assets/body/robot.png', type: 'image' },
      { id: 'body_12', label: 'Zombie', src: '/assets/body/zombie.png', type: 'image' },
    ]
  },
  {
    id: 'vibe',
    label: 'Vibe',
    zIndex: 100, // Top level overlay effect
    items: [
      { id: 'vibe_none', label: 'None', type: 'none', value: 'none' },
      { id: 'vibe_noir', label: 'Noir', value: 'grayscale(1) contrast(1.2)' },
      { id: 'vibe_retro', label: 'Retro', value: 'sepia(0.8) contrast(1.1) brightness(0.9)' },
      { id: 'vibe_matrix', label: 'Matrix', value: 'hue-rotate(90deg) saturate(2) brightness(0.8)' },
      { id: 'vibe_neon', label: 'Vibrant', value: 'saturate(2.5) contrast(1.2)' },
      { id: 'vibe_dreamy', label: 'Dreamy', value: 'brightness(1.1) saturate(1.2) blur(0.5px)' },
      { id: 'vibe_8bit', label: '8-Bit', value: 'url(#pixelate)' }, // We'll need SVG filter for this or simulated
      { id: 'vibe_ghostly', label: 'Ghostly', value: 'opacity(0.8) brightness(1.5) saturate(0.5)' },
      { id: 'vibe_rainbow', label: 'Rainbow', value: 'hue-rotate(360deg)' }, // Animate? No static hue shift 
      { id: 'vibe_glitch', label: 'Glitch', value: 'contrast(1.5) hue-rotate(200deg)' },
      { id: 'vibe_faded', label: 'Faded', value: 'opacity(0.7) grayscale(0.2) brightness(1.1)' },
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
      { id: 'shirt_5', label: 'Snowy', src: '/assets/shirt/snowy.png', type: 'image' },
      { id: 'shirt_6', label: 'Sweater', src: '/assets/shirt/sweater.png', type: 'image' },
      { id: 'shirt_7', label: 'Balenciaga', src: '/assets/shirt/balenciaga.png', type: 'image' },
      { id: 'shirt_8', label: 'Champion', src: '/assets/shirt/champion.png', type: 'image' },
      { id: 'shirt_9', label: 'Hilfiger', src: '/assets/shirt/hilfiger.png', type: 'image' },
      { id: 'shirt_10', label: 'JNCO', src: '/assets/shirt/jnco.png', type: 'image' },
      { id: 'shirt_11', label: 'Thrasher', src: '/assets/shirt/thrasher.png', type: 'image' },
      { id: 'shirt_12', label: 'Zodiac', src: '/assets/shirt/zodiac.png', type: 'image' },
      { id: 'shirt_13', label: 'SWAT', src: '/assets/shirt/swat.png', type: 'image' },
    ]
  },
  {
    id: 'chain',
    label: 'Chain',
    zIndex: 70,
    items: [
      { id: 'chain_1', label: 'None', type: 'none' },
      { id: 'chain_2', label: 'Gold', src: '/assets/chain/gold.png', type: 'image' },
      { id: 'chain_3', label: 'Cross', src: '/assets/chain/cross.png', type: 'image' },
      { id: 'chain_4', label: 'Money', src: '/assets/chain/money.png', type: 'image' },
      { id: 'chain_5', label: 'Chains', src: '/assets/chain/chains.png', type: 'image' },
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
      { id: 'hat_13', label: 'Catcoin', src: '/assets/hat/catcoin.png', type: 'image' },
      { id: 'hat_14', label: 'Claw', src: '/assets/hat/claw.png', type: 'image' },
      { id: 'hat_6', label: 'Beer', src: '/assets/hat/beer.png', type: 'image' },
      { id: 'hat_3', label: 'Cowboy', src: '/assets/hat/cowboy.png', type: 'image' },
      { id: 'hat_4', label: 'Crown', src: '/assets/hat/crown.png', type: 'image' },
      { id: 'hat_7', label: 'Police', src: '/assets/hat/police.png', type: 'image' },
      { id: 'hat_11', label: 'Red Hat', src: '/assets/hat/red-hat.png', type: 'image' },
      { id: 'hat_8', label: 'Taxi', src: '/assets/hat/taxi.png', type: 'image' },
      { id: 'hat_9', label: 'Top Hat', src: '/assets/hat/tophat.png', type: 'image' },
      { id: 'hat_10', label: 'Viking', src: '/assets/hat/viking.png', type: 'image' },
      { id: 'hat_12', label: 'White Hat', src: '/assets/hat/white-hat.png', type: 'image' },
    ]
  },
  {
    id: 'mouth',
    label: 'Mouth',
    zIndex: 65,
    items: [
      { id: 'mouth_1', label: 'None', type: 'none' },
      { id: 'mouth_2', label: 'Fish', src: '/assets/mouth/fish.png', type: 'image' },
      { id: 'mouth_3', label: 'Tongue', src: '/assets/mouth/tongue.png', type: 'image' },
      { id: 'mouth_4', label: 'Crazy', src: '/assets/mouth/crazy.png', type: 'image' },
      { id: 'mouth_5', label: 'Vamp', src: '/assets/mouth/vamp.png', type: 'image' },
    ]
  },
  {
    id: 'border_color',
    label: 'Border Color',
    zIndex: 90,
    items: [
      { id: 'border_color_none', label: 'None', type: 'none' },
      { id: 'border_c_white', label: 'White', color: '#ffffff' },
      { id: 'border_c_yellow', label: 'Cat Yellow', color: '#fad205' },
      { id: 'border_c_cyan', label: 'Cyan', color: '#06b6d4' },
      { id: 'border_c_purple', label: 'Purple', color: '#a855f7' },
      { id: 'border_c_lime', label: 'Lime', color: '#84cc16' },
      { id: 'border_c_pink', label: 'Hot Pink', color: '#ec4899' },
      { id: 'border_c_orange', label: 'Orange', color: '#f97316' },
      { id: 'border_c_red', label: 'Red', color: '#ef4444' },
      { id: 'border_c_silver', label: 'Silver', color: '#9ca3af' },
      { id: 'border_c_gold', label: 'Gold', color: '#fbbf24' },
      { id: 'border_c_black', label: 'Black', color: '#000000' },
    ]
  },
  {
    id: 'border_style',
    label: 'Border Pattern',
    zIndex: 91, // Virtual z-index, affects ordering in UI
    items: [
      { id: 'border_s_solid', label: 'Solid', value: 'solid' },
      { id: 'border_s_dashed', label: 'Dashed', value: 'dashed' },
      { id: 'border_s_dotted', label: 'Dotted', value: 'dotted' },
      { id: 'border_s_double', label: 'Double', value: 'double' },
      { id: 'border_s_neon', label: 'Neon Glow', value: 'neon' },
      { id: 'border_s_ridge', label: 'Ridge', value: 'ridge' },
      { id: 'border_s_inset', label: 'Inset', value: 'inset' },
      { id: 'border_s_groove', label: 'Groove', value: 'groove' },
    ]
  },
  {
    id: 'border_width',
    label: 'Border Size',
    zIndex: 92, // Virtual z-index
    items: [
      { id: 'border_w_sm', label: 'Small', value: 5 },
      { id: 'border_w_md', label: 'Medium', value: 10 },
      { id: 'border_w_lg', label: 'Large', value: 18 },
      { id: 'border_w_xl', label: 'Chonky', value: 30 },
    ]
  },
  {
    id: 'speech',
    label: 'Speech',
    zIndex: 95, // Above everything, balanced with border
    items: [
      { id: 'speech_none', label: 'None', type: 'none' },
      { id: 'speech_gm', label: 'GM', text: 'GM ☀️', emoji: '☀️' },
      { id: 'speech_wagmi', label: 'WAGMI', text: 'WAGMI! 🚀', emoji: '🚀' },
      { id: 'speech_catcoin', label: 'Catcoin', text: '$catcoin to the moon!', emoji: '💎' },
      { id: 'speech_meow', label: 'Meow', text: 'Meow! 🐱', emoji: '🐱' },
      { id: 'speech_hodl', label: 'HODL', text: 'HODL 💎', emoji: '🏦' },
      { id: 'speech_moon', label: 'Moon', text: 'Soon Moon 🌑', emoji: '🌑' },
      { id: 'speech_yolo', label: 'YOLO', text: 'YOLO 🎰', emoji: '🎰' },
      { id: 'speech_vibing', label: 'Vibing', text: 'Just Vibing 🌊', emoji: '🌊' },
      { id: 'speech_rekt', label: 'REKT', text: 'Not REKT! ✅', emoji: '✅' },
      { id: 'speech_alpha', label: 'Alpha', text: 'Pure Alpha 🧠', emoji: '🧠' },
    ]
  }
];
