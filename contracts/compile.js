const path = require('path');
const fs = require('fs');
const solc = require('solc');

function findImports(_path) {
    return {
        contents: fs.readFileSync(path.join(__dirname, './node_modules', _path)).toString()
    };
}

function compile(contractFile) {
    // const contractFile = 'MeterNft721.sol';
    const contractName = contractFile.split('.')[0];
    const contractFilePath = path.resolve(__dirname, contractFile);
    const source = fs.readFileSync(contractFilePath, 'UTF-8');

    var input = {
        language: 'Solidity',
        sources: {
            [contractFile]: {
                content: source
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    // var output = JSON.parse(solc.compile(JSON.stringify(input)));
    var output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
    fs.writeFileSync(path.resolve(__dirname, 'artifacts', `${contractName}.json`), JSON.stringify(output.contracts[contractFile][contractName]));
    const abi = output.contracts[contractFile][contractName].abi;
    const bytecode = output.contracts[contractFile][contractName].evm.bytecode.object;

    return { abi: abi, bytecode: bytecode };
}

module.exports = {
    compile: compile
};
