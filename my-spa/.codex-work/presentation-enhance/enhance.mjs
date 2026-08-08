import fs from 'node:fs/promises';
import { FileBlob, PresentationFile } from '@oai/artifact-tool';

const build = 'C:/hobby/denGodeHensikt/my-spa/.codex-work/presentation-enhance';
const input = `${build}/template-starter.pptx`;
const output = 'C:/hobby/denGodeHensikt/my-spa/DEN GODE HENSIKT - professional.pptx';
const renderDir = `${build}/final-render`;

const C = {
  navy: '#102A43',
  navy2: '#183B56',
  teal: '#0B7285',
  gold: '#D6A84B',
  ink: '#243B53',
  muted: '#526D82',
  paper: '#F6F4EE',
  white: '#FFFFFF',
  line: '#D9E2EC',
};

const p = await PresentationFile.importPptx(await FileBlob.load(input));

function byName(slide, suffix) {
  return slide.shapes.items.find(x => x.name?.includes(suffix));
}

function styleTitle(shape, position = { left: 58, top: 38, width: 844, height: 64 }) {
  shape.position = position;
  shape.fill = 'none';
  shape.line = { style: 'solid', fill: 'none', width: 0 };
  shape.text.style = {
    typeface: 'Aptos Display', fontSize: 46, bold: true, color: C.navy,
    alignment: 'left', verticalAlignment: 'middle',
    insets: { left: 0, right: 0, top: 0, bottom: 0 }, autoFit: 'shrinkText'
  };
}

function styleBody(shape, position, fontSize = 21) {
  shape.position = position;
  shape.fill = C.white;
  shape.line = { style: 'solid', fill: C.line, width: 1 };
  shape.borderRadius = 14;
  shape.shadow = { type: 'outer', color: '#102A4320', blur: 10, distance: 2, angle: 45 };
  shape.text.style = {
    typeface: 'Aptos', fontSize, color: C.ink,
    alignment: 'left', verticalAlignment: 'top',
    insets: { left: 24, right: 24, top: 20, bottom: 18 },
    autoFit: 'shrinkText', lineSpacing: 1.12
  };
}

function addChrome(slide, number, section = 'DEN GODE HENSIKT') {
  const bar = slide.shapes.add({
    geometry: 'rect', name: `accent-${number}`,
    position: { left: 0, top: 0, width: 12, height: 540 },
    fill: C.teal, line: { style: 'solid', fill: 'none', width: 0 }
  });
  bar.sendToBack();
  const rule = slide.shapes.add({
    geometry: 'rect', name: `rule-${number}`,
    position: { left: 58, top: 108, width: 68, height: 4 },
    fill: C.gold, line: { style: 'solid', fill: 'none', width: 0 }
  });
  const label = slide.shapes.add({
    geometry: 'textbox', name: `footer-${number}`,
    position: { left: 58, top: 510, width: 844, height: 18 },
    fill: 'none', line: { style: 'solid', fill: 'none', width: 0 }
  });
  label.text = `${section}    ·    ${String(number).padStart(2, '0')}`;
  label.text.style = { typeface: 'Aptos', fontSize: 11, bold: true, color: C.muted, alignment: 'right', insets: { left: 0, right: 0, top: 0, bottom: 0 } };
}

for (const slide of p.slides.items) slide.background.fill = C.paper;

// 1 — opening
{
  const s = p.slides.items[0];
  const title = byName(s, ';54;');
  const subtitle = byName(s, ';55;');
  if (subtitle) subtitle.delete();
  s.background.fill = C.navy;
  title.position = { left: 74, top: 184, width: 812, height: 124 };
  title.fill = 'none';
  title.text.style = { typeface: 'Aptos Display', fontSize: 62, bold: true, color: C.white, alignment: 'center', verticalAlignment: 'middle', insets: { left: 0, right: 0, top: 0, bottom: 0 }, autoFit: 'shrinkText' };
  const line = s.shapes.add({ geometry: 'rect', position: { left: 390, top: 324, width: 180, height: 5 }, fill: C.gold, line: { style: 'solid', fill: 'none', width: 0 } });
}

// 2 — concept overview
{
  const s = p.slides.items[1];
  styleTitle(byName(s, ';61;'));
  styleBody(byName(s, ';60;'), { left: 58, top: 136, width: 410, height: 330 }, 23);
  const img = s.images.items[0];
  img.frame = { left: 510, top: 154, width: 392, height: 270 };
  img.geometry = 'roundRect'; img.borderRadius = 16; img.lockAspectRatio = false;
  addChrome(s, 2, 'DEL 1 · KONSEPTET');
}

// 3 — membership, dense reading slide
{
  const s = p.slides.items[2];
  styleTitle(byName(s, ';67;'));
  styleBody(byName(s, ';68;'), { left: 58, top: 134, width: 844, height: 354 }, 17);
  addChrome(s, 3, 'DEL 1 · KONSEPTET');
}

// 4 — purpose
{
  const s = p.slides.items[3];
  styleTitle(byName(s, ';73;'));
  styleBody(byName(s, ';74;'), { left: 58, top: 136, width: 844, height: 332 }, 21);
  addChrome(s, 4, 'DEL 1 · KONSEPTET');
}

// 5 — example 1
{
  const s = p.slides.items[4];
  styleTitle(byName(s, ';79;'));
  styleBody(byName(s, ';80;'), { left: 58, top: 132, width: 558, height: 360 }, 16.5);
  const img = s.images.items[0];
  img.frame = { left: 646, top: 132, width: 256, height: 360 };
  img.geometry = 'roundRect'; img.borderRadius = 16; img.lockAspectRatio = false;
  addChrome(s, 5, 'DEL 1 · EKSEMPLER');
}

// 6 — example 2
{
  const s = p.slides.items[5];
  styleTitle(byName(s, ';86;'));
  styleBody(byName(s, ';87;'), { left: 58, top: 136, width: 520, height: 330 }, 19);
  const img = s.images.items[0];
  img.frame = { left: 620, top: 136, width: 282, height: 330 };
  img.geometry = 'roundRect'; img.borderRadius = 16; img.lockAspectRatio = false;
  addChrome(s, 6, 'DEL 1 · EKSEMPLER');
}

// 7 — demo link
{
  const s = p.slides.items[6];
  styleTitle(byName(s, ';93;'));
  const body = byName(s, ';94;');
  body.position = { left: 150, top: 220, width: 660, height: 92 };
  body.fill = C.teal; body.line = { style: 'solid', fill: C.teal, width: 1 }; body.borderRadius = 18;
  body.shadow = { type: 'outer', color: '#102A4330', blur: 12, distance: 3, angle: 45 };
  body.text.style = { typeface: 'Aptos', fontSize: 24, bold: true, color: C.white, alignment: 'center', verticalAlignment: 'middle', insets: { left: 20, right: 20, top: 12, bottom: 12 }, autoFit: 'shrinkText' };
  addChrome(s, 7, 'DEL 1 · DEMO');
}

// 8 — section divider
{
  const s = p.slides.items[7];
  const title = byName(s, ';99;');
  const subtitle = byName(s, ';100;');
  if (subtitle) subtitle.delete();
  s.background.fill = C.teal;
  title.position = { left: 74, top: 174, width: 812, height: 150 };
  title.fill = 'none';
  title.text.style = { typeface: 'Aptos Display', fontSize: 56, bold: true, color: C.white, alignment: 'center', verticalAlignment: 'middle', insets: { left: 0, right: 0, top: 0, bottom: 0 }, autoFit: 'shrinkText' };
  s.shapes.add({ geometry: 'rect', position: { left: 390, top: 342, width: 180, height: 5 }, fill: C.gold, line: { style: 'solid', fill: 'none', width: 0 } });
}

// 9 — risk / proposal
{
  const s = p.slides.items[8];
  styleTitle(byName(s, ';105;'));
  styleBody(byName(s, ';106;'), { left: 128, top: 148, width: 704, height: 292 }, 25);
  addChrome(s, 9, 'DEL 2 · BESLUTNINGER');
}

// 10 — roles
{
  const s = p.slides.items[9];
  styleTitle(byName(s, ';111;'));
  styleBody(byName(s, ';112;'), { left: 160, top: 166, width: 640, height: 246 }, 29);
  addChrome(s, 10, 'DEL 2 · ORGANISERING');
}

// 11 — ownership
{
  const s = p.slides.items[10];
  styleTitle(byName(s, ';117;'));
  styleBody(byName(s, ';118;'), { left: 100, top: 160, width: 760, height: 250 }, 25);
  addChrome(s, 11, 'DEL 2 · EIERSKAP');
}

// 12 — next steps
{
  const s = p.slides.items[11];
  styleTitle(byName(s, ';123;'));
  styleBody(byName(s, ';124;'), { left: 96, top: 138, width: 768, height: 340 }, 21);
  addChrome(s, 12, 'DEL 2 · NESTE STEG');
}

await fs.mkdir(renderDir, { recursive: true });
for (const [i, slide] of p.slides.items.entries()) {
  const png = await p.export({ slide, format: 'png', scale: 1.5 });
  await fs.writeFile(`${renderDir}/slide-${String(i + 1).padStart(2, '0')}.png`, new Uint8Array(await png.arrayBuffer()));
  const layout = await slide.export({ format: 'layout' });
  await fs.writeFile(`${renderDir}/slide-${String(i + 1).padStart(2, '0')}.layout.json`, await layout.text());
}
const montage = await p.export({ format: 'png', montage: true, scale: 0.8 });
await fs.writeFile(`${build}/final-montage.png`, new Uint8Array(await montage.arrayBuffer()));
const pptx = await PresentationFile.exportPptx(p);
await pptx.save(output);
console.log(output);
