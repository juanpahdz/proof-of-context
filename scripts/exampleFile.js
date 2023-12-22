const fs = require("fs");
// Databases extraction
const db = JSON.parse(fs.readFileSync("../db/db3.json", "utf8"));
const products = JSON.parse(fs.readFileSync("../db/products.json", "utf8"));

// Utilities
function suggestProduct(userInput) {
  let bestMatch = null;
  let bestScore = 0;
  for (const product of products) {
    const score = calculateSimilarityScore(
      userInput.toLowerCase(),
      product.toLowerCase()
    );

    if (score > bestScore) {
      bestScore = score;
      bestMatch = product;
    }
  }
  return bestMatch;
}

function calculateSimilarityScore(userInput, product) {
  const distanceMatrix = Array.from(Array(userInput.length + 1), () =>
    Array(product.length + 1).fill(0)
  );

  for (let i = 0; i <= userInput.length; i++) {
    for (let j = 0; j <= product.length; j++) {
      if (i === 0) {
        distanceMatrix[i][j] = j;
      } else if (j === 0) {
        distanceMatrix[i][j] = i;
      } else {
        distanceMatrix[i][j] = Math.min(
          distanceMatrix[i - 1][j - 1] +
            (userInput[i - 1] !== product[j - 1] ? 1 : 0),
          distanceMatrix[i][j - 1] + 1,
          distanceMatrix[i - 1][j] + 1
        );
      }
    }
  }

  const totalDistance = distanceMatrix[userInput.length][product.length];
  const maxLength = Math.max(userInput.length, product.length);

  const score = (1 - totalDistance / maxLength) * 100;

  return score;
}

function extractProduct(userInput) {
  const input = userInput.toLowerCase();
  // Determinar la marca
  let br;
  let ref;
  for (const brand of db) {
    // Saber si el input contiene algún  alias de marca
    if (brand.aliases?.some((alias) => input.includes(alias.toLowerCase()))) {
      br = brand.marca;
      for (const model of brand.modelos) {
        // Saber si el input contiene algún alias del modelo
        if (
          input.includes(model.nombre.toLowerCase()) ||
          model.aliases?.some((alias) => input.includes(alias.toLowerCase()))
        ) {
          ref = model.nombre;
          break;
        }
      }
      break;
    }
  }
  if (!ref) return null;
  return {
    marca: br,
    modelo: ref,
  };
}

// Testing
const entradaUsuario = "KYO-TA3011I";
const product = extractProduct(entradaUsuario);
const pr = suggestProduct(entradaUsuario);
console.log("Producto encontrado:", product);
console.log("Producto sugerido:", pr);

// XER-EC7856 KIP-860 KON-BIZC250I KYO-M3550IDN
