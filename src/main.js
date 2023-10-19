import fs from "fs";
import { createCanvas, loadImage } from "canvas";
import { format, rarity, supply, startIndex } from "./config.js";

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

const buildDir = `${process.env.PWD}/build`;
const layersDir = `${process.env.PWD}/layers`;

let genes = [];
let geneStrings = [];

String.prototype.hashCode = function () {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

const generateGenes = async () => {
  for (let index = 0; index<startIndex ; index++) {
    geneStrings.push(index);
    genes.push(index);
  }
  for (let index = startIndex; index < supply; index++) {
    let rarityValue = 1.0;
    let breed = rarity.Breed.Types[0];

    let random = Math.floor(Math.random() * 100);
    let bgIdx = random< 40? 0: (random< 50? 1: (random< 80? 2: 3))
    let background = rarity.Background.Types[bgIdx];

    random = Math.floor(Math.random() * 100);
    let skinIdx = random< 30? 0: (random< 33? 1: (random< 51? 2: (random< 55? 3: (random< 77? 4: (random< 92? 5: 6)))))
    let skin = rarity.Skin.Types[skinIdx];

    random = Math.floor(Math.random() * 100);
    let decorIdx = random< 30? 0: (random< 80? 1: (random< 85? 2: (random< 99? 3: 4) ) )
    let decor = rarity.Decor.Types[decorIdx];
    
    random = Math.floor(Math.random() * 100);
    let eyesIdx = random< 5 ? 0: (random<55 ? 1: (random< 56? 2: (random< 86? 3: 4)))
    let eyes = rarity.Eyes.Types[eyesIdx];

    random = Math.floor(Math.random() * 100);
    let headIdx = random< 14? 0: (random<64 ? 1:(random< 94 ? 2: (random< 95? 3: 4) ))
    let head = rarity.Head.Types[headIdx];

    random = Math.floor(Math.random() * 100);
    let fitIdx = random< 30? 0: (random< 55? 1: (random< 68? 2: (random< 88? 3: (random< 90? 4: (random< 94? 5: (random< 99? 6: 7))))))
    let fit = rarity.Fit.Types[fitIdx];

    random = Math.floor(Math.random() * 100);
    let noseIdx = random< 40 ? 0: (random< 41? 1: (random< 66? 2: (random< 84? 3: (random< 89? 4: 5))))
    let nose = rarity.Nose.Types[noseIdx];

    // let faceMark = "Nothing";
    // let faceMarkRand = Math.random() * rarity.Facemark.Sum;
    // let tempSum = 0;
    // for (let i = 0; i < rarity.Facemark.Types.length; i ++ ) {
    //   tempSum += rarity.Facemark[rarity.Facemark.Types[i]];
    //   if ( tempSum >= faceMarkRand){
    //     faceMark = rarity.Facemark.Types[i];
    //     rarityValue *= rarity.Facemark[rarity.Facemark.Types[i]] / rarity.Facemark.Sum;
    //     break;
    //   }
    // }

    // let hair = rarity.Hair.Types[Math.floor(Math.random() * rarity.Hair.Types.length)];

    // let lineart = rarity.Lineart.Types[0];
    
    // let mouth = rarity.Mouth.Types[Math.floor(Math.random() * rarity.Mouth.Types.length)];

    // let necklace = "Nothing";
    // let necklaceRand = Math.random() * rarity.Necklace.Sum;
    // tempSum = 0;
    // for (let i = 0; i < rarity.Necklace.Types.length; i ++ ) {
    //   tempSum += rarity.Necklace[rarity.Necklace.Types[i]];
    //   if ( tempSum >= necklaceRand){
    //     necklace = rarity.Necklace.Types[i];
    //     rarityValue *= rarity.Necklace[rarity.Necklace.Types[i]] / rarity.Necklace.Sum;
    //     break;
    //   }
    // }

    // let skincolor = rarity.Skincolor.Types[0];

    // let tattoobody = rarity.Tattoobody.Types[0];

    let geneString = breed + ":" + background + ":" + skin + ":" + decor + ":" + eyes + ":" + head + ":" + fit + ":" + nose;
    let hashCode = geneString.hashCode();

    if (geneStrings.includes(geneString))
      index--;
    else {
      geneStrings.push(geneString)
      genes.push({
        breed,
        background,
        skin,
        decor,
        eyes,
        head,
        fit,
        nose
      })
    }
  }
}

const drawLayer = async (index, pathName, _canvas, _ctx) => {
  const image = await loadImage(`${layersDir}/${pathName}.png`);
  _ctx.drawImage(
    image,
    0,
    0,
    format.width,
    format.height
  );
  fs.writeFileSync(
    `${buildDir}/${index}.png`,
    _canvas.toBuffer("image/png")
  );
};

const generateImage = async (index) => {
  const canvas = createCanvas(format.width, format.height);
  const ctx = canvas.getContext("2d");
  await drawLayer(index, "Breed/" + genes[index].breed, canvas, ctx);
  await drawLayer(index, "Background/" + genes[index].background, canvas, ctx);
  await drawLayer(index, "Skin/" + genes[index].skin, canvas, ctx);
  await drawLayer(index, "Decor/" + genes[index].decor, canvas, ctx);
  await drawLayer(index, "Eyes/" + genes[index].eyes, canvas, ctx);
  await drawLayer(index, "Head/" + genes[index].head, canvas, ctx);
  await drawLayer(index, "Fit/" + genes[index].fit, canvas, ctx);
  await drawLayer(index, "Nose/" + genes[index].nose, canvas, ctx);

  // if (genes[index].faceMark != "Nothing")
  //   await drawLayer(index, "Face mark/" + genes[index].faceMark, canvas, ctx);
  // if (genes[index].necklace != "Nothing")
  //   await drawLayer(index, "Necklace/" + genes[index].necklace, canvas, ctx);
};

const generateMetaData = async (index) => {
  fs.writeFileSync(
    `${buildDir}/${index}.json`,
    JSON.stringify({
      name: "BvB #" + (index),
      symbol: "BvB",
      description:
        "4,444 Bulls & Bears tear the market apart.",
      image: ""+(index) + ".png",
      seller_fee_basis_points: 444,
      edition: index,
      attributes: [
        {
          "trait_type": "Breed",
          "value": genes[index].breed
        },
        {
          "trait_type": "Background",
          "value": genes[index].background
        },
        {
          "trait_type": "Skin",
          "value": genes[index].skin
        },
        {
          "trait_type": "Decor",
          "value": genes[index].decor
        },
        {
          "trait_type": "Eyes",
          "value": genes[index].eyes
        },
        {
          "trait_type": "Head",
          "value": genes[index].head
        },
        {
          "trait_type": "Fit",
          "value": genes[index].fit
        },
        {
          "trait_type": "Nose",
          "value": genes[index].nose
        }
      ],
      properties: {
        files: [
          {
            "uri": ""+(index) + ".png",
            "type": "image/png"
          }
        ],
        category: "image",
        collection: {
          "name": "BvB",
          "family": "BvB"
        },
        creators: [
          {
            "address": "Ev3So2CZc3NWL2inJqnrdAfVC58E5R2mE4mqLfoTTL6A",
            "share": 100
          }
        ]
      },
      compiler: "Oracle"
    }, null, 2)
  );
};

export const cleanProject = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

export const generateNFTData = async () => {
  generateGenes()
  for (let i = startIndex; i < supply; i++) {
    let Promises = [];
    // for (let j = 0; j < 20; j++) {
      Promises.push(generateImage(i));
      Promises.push(generateMetaData(i));
    // }
    await Promise.all(Promises);
  }
}
