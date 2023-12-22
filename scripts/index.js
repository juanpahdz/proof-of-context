const fs = require('fs');
const readline = require('readline');
const stringSimilarity = require('string-similarity');

const database = JSON.parse(fs.readFileSync('db.json', 'utf8'));
const resultFilePath = 'resultado.json';

function findProductByAlias(alias) {
    for (const product of database) {
        if (product.aliases.includes(alias)) {
            return product.name;
        }
    }
    return null;
}

function suggestSimilarProducts(alias) {
    const aliasList = database.reduce((acc, product) => acc.concat(product.aliases), []);
    const similarities = stringSimilarity.findBestMatch(alias, aliasList);

    const suggestedProducts = similarities.ratings
        .filter(({ rating }) => rating > 0.7) // Puedes ajustar este umbral según tus necesidades
        .map(({ target }) => findProductByAlias(target));

    return suggestedProducts;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Ingrese el alias del producto: ', (alias) => {
    let result;

    try {
        result = JSON.parse(fs.readFileSync(resultFilePath, 'utf8'));
    } catch (error) {
        result = [];
    }

    const productName = findProductByAlias(alias);

    if (productName) {
        console.log(`El alias "${alias}" corresponde al producto: ${productName}`);
    } else {
        console.log(`No se encontró ningún producto con el alias "${alias}"`);

        const suggestedProducts = suggestSimilarProducts(alias);

        if (suggestedProducts.length > 0) {
            console.log('Productos sugeridos:');
            suggestedProducts.forEach((product) => {
                console.log(`- ${product}`);
                result.push({ input: alias, suggestedProduct: product });
            });
        } else {
            console.log('No se encontraron productos sugeridos.');
        }
    }

    // Guarda el resultado actualizado en el archivo JSON
    fs.writeFileSync(resultFilePath, JSON.stringify(result, null, 2), 'utf8');

    rl.close();
});
