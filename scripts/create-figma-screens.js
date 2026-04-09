/**
 * Local utility: create frames in Figma via API.
 * Requires FIGMA_ACCESS_TOKEN (Personal Access Token) in the environment — never commit tokens.
 */
const Figma = require('figma-api');

const ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY || 'ohWsdMYDCBhnV1wfm1s5Kc';
const TARGET_PAGE_NAME = process.env.FIGMA_TARGET_PAGE || 'Blunno screen';

function requireToken() {
  if (!ACCESS_TOKEN || ACCESS_TOKEN.trim() === '') {
    console.error('Set FIGMA_ACCESS_TOKEN in your environment (see Figma account settings).');
    process.exit(1);
  }
}

const api = new Figma.Api({ personalAccessToken: ACCESS_TOKEN || '' });

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

async function createFramesOnPage(pageId, frames) {
  const nodes = frames.map(frame => ({
    type: 'FRAME',
    name: frame.name,
    visible: true,
    x: frame.x,
    y: frame.y,
    width: frame.width,
    height: frame.height,
    fills: [{
      type: 'SOLID',
      color: hexToRgb(frame.backgroundColor),
      opacity: 1,
    }],
  }));

  const response = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/nodes`, {
    method: 'POST',
    headers: {
      'X-Figma-Token': ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nodes }),
  });

  const data = await response.json();
  console.log('Созданы фреймы:', data);
  return data;
}

async function main() {
  requireToken();
  try {
    const file = await api.getFile(FILE_KEY);
    const canvases = file.document.children.filter((child) => child.type === 'CANVAS');
    const page =
      canvases.find((c) => c.name?.toLowerCase() === TARGET_PAGE_NAME.toLowerCase()) ||
      canvases[0] ||
      file.document.children[0];
    const pageId = page.id;

    const frames = [
      { name: 'Welcome', x: 0, y: 0, width: 375, height: 812, backgroundColor: '#0d081b' },
      { name: 'Choose Mode', x: 400, y: 0, width: 375, height: 812, backgroundColor: '#0d081b' },
      { name: 'SOS', x: 800, y: 0, width: 375, height: 812, backgroundColor: '#0d081b' },
    ];

    await createFramesOnPage(pageId, frames);
    console.log('✅ Фреймы созданы! Откройте Figma и проверьте.');
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    if (error.response) console.error('Ответ API:', error.response.data);
  }
}

main();
