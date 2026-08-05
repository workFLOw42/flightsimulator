// Konvertiert ein FMS DirectX-.x-Textmodell in three.js-JSON (BufferGeometry-Daten).
// Aufruf: node convert_x.js "Pfad/zu/Modell.x" ausgabe.json
const fs = require('fs');

const inPath = process.argv[2];
const outPath = process.argv[3];
let txt = fs.readFileSync(inPath, 'latin1');

// Zahlen-Token-Helfer: liest den Datenstrom als Folge von Zahlen/Trennern.
// Wir zerlegen jeden echten "Mesh {"-Block (nicht die "template Mesh").
function findMeshBlocks(s) {
  const blocks = [];
  // Nach "Mesh" MUSS Whitespace oder "{" folgen — sonst matcht MeshMaterialList/
  // MeshNormals/MeshTextureCoords fälschlich als eigenes Mesh.
  const re = /(^|\n)[ \t]*Mesh([ \t]+[A-Za-z0-9_]+)?[ \t]*\{/g;
  let m;
  const starts = [];
  while ((m = re.exec(s)) !== null) {
    // "template Mesh" ausschließen
    const pre = s.slice(Math.max(0, m.index - 12), m.index + m[0].length);
    if (/template/.test(pre)) continue;
    starts.push(m.index + m[0].length);
  }
  // jeden Block bis zur schließenden Klammer per Klammerzählung
  for (const st of starts) {
    let depth = 1, i = st;
    while (i < s.length && depth > 0) {
      const ch = s[i];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      i++;
    }
    blocks.push(s.slice(st, i - 1));
  }
  return blocks;
}

// liest aus einem Mesh-Block: vertices[], faces[] (trianguliert), uvs[]
function parseMesh(block) {
  // Vertices
  // Format: nVertices; dann Zeilen "x;y;z;,"
  const nvMatch = block.match(/\s*(\d+)\s*;/);
  if (!nvMatch) return null;
  let idx = nvMatch.index + nvMatch[0].length;
  const nV = parseInt(nvMatch[1], 10);

  const verts = [];
  // Vektoren: je "f;f;f;," (Komma/Semikolon getrennt)
  const vecRe = /(-?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*;\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*;\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*;\s*,?/g;
  vecRe.lastIndex = idx;
  for (let k = 0; k < nV; k++) {
    const mm = vecRe.exec(block);
    if (!mm) break;
    verts.push([parseFloat(mm[1]), parseFloat(mm[2]), parseFloat(mm[3])]);
  }
  idx = vecRe.lastIndex;

  // nFaces
  const rest = block.slice(idx);
  const nfMatch = rest.match(/\s*(\d+)\s*;/);
  if (!nfMatch) return { verts, faces: [], uvs: [] };
  const nF = parseInt(nfMatch[1], 10);
  let fidx = idx + nfMatch.index + nfMatch[0].length;

  const faces = [];
  // Face: "count;i,i,...;," -> triangulieren (fan)
  const faceRe = /(\d+)\s*;\s*([\d,\s]+?)\s*;\s*,?/g;
  faceRe.lastIndex = fidx;
  for (let k = 0; k < nF; k++) {
    const mm = faceRe.exec(block);
    if (!mm) break;
    const cnt = parseInt(mm[1], 10);
    const ids = mm[2].split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
    // Fan-Triangulierung
    for (let t = 1; t < cnt - 1; t++) {
      faces.push([ids[0], ids[t], ids[t + 1]]);
    }
  }

  // TexCoords
  const uvs = new Array(nV).fill(null);
  const tcBlock = block.match(/MeshTextureCoords\s*\{([\s\S]*?)\}/);
  if (tcBlock) {
    const tc = tcBlock[1];
    const ncM = tc.match(/\s*(\d+)\s*;/);
    if (ncM) {
      const uvRe = /(-?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*;\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*;\s*,?/g;
      uvRe.lastIndex = ncM.index + ncM[0].length;
      const nC = parseInt(ncM[1], 10);
      for (let k = 0; k < nC; k++) {
        const mm = uvRe.exec(tc);
        if (!mm) break;
        uvs[k] = [parseFloat(mm[1]), parseFloat(mm[2])];
      }
    }
  }
  return { verts, faces, uvs };
}

const blocks = findMeshBlocks(txt);
// Alle Meshes zu einer Geometrie mergen
const position = [], uv = [], index = [];
let base = 0;
let stats = [];
for (const b of blocks) {
  const mesh = parseMesh(b);
  if (!mesh || mesh.verts.length === 0) continue;
  for (const v of mesh.verts) position.push(v[0], v[1], v[2]);
  for (let i = 0; i < mesh.verts.length; i++) {
    const t = mesh.uvs[i] || [0, 0];
    uv.push(t[0], 1 - t[1]); // V spiegeln (BMP-Konvention)
  }
  for (const f of mesh.faces) index.push(base + f[0], base + f[1], base + f[2]);
  stats.push({ verts: mesh.verts.length, tris: mesh.faces.length });
  base += mesh.verts.length;
}

const out = { position, uv, index };
fs.writeFileSync(outPath, JSON.stringify(out));
console.log('Meshes:', blocks.length, '| gemergt:', JSON.stringify(stats));
console.log('Vertices gesamt:', position.length / 3, '| Dreiecke:', index.length / 3);
// Bounding-Box zur Orientierungshilfe
let mn = [1e9,1e9,1e9], mx = [-1e9,-1e9,-1e9];
for (let i = 0; i < position.length; i += 3) {
  for (let a = 0; a < 3; a++) { mn[a] = Math.min(mn[a], position[i+a]); mx[a] = Math.max(mx[a], position[i+a]); }
}
console.log('BBox min:', mn.map(x=>x.toFixed(2)), 'max:', mx.map(x=>x.toFixed(2)));
console.log('Spannweite X:', (mx[0]-mn[0]).toFixed(2), 'Y:', (mx[1]-mn[1]).toFixed(2), 'Z:', (mx[2]-mn[2]).toFixed(2));
