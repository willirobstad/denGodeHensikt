import { FileBlob, PresentationFile } from '@oai/artifact-tool';
const p = await PresentationFile.importPptx(await FileBlob.load('C:/hobby/denGodeHensikt/my-spa/.codex-work/presentation-enhance/template-starter.pptx'));
const slide = p.slides.items[0];
const s = slide.shapes.items[1];
console.log('shape proto', Object.getOwnPropertyNames(Object.getPrototypeOf(s)));
console.log('shapes proto', Object.getOwnPropertyNames(Object.getPrototypeOf(slide.shapes)));
console.log('text proto', Object.getOwnPropertyNames(Object.getPrototypeOf(s.text)));
