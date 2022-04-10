const { compile } = require('./compile');

const deploy = async (web3, contractFile, arguments = []) => {
    // compile
    console.log(`Compile contract ${contractFile}...`);
    const { abi, bytecode } = compile(contractFile);

    // deploy
    const accounts = await web3.eth.getAccounts();
    console.log(`Deploy contract ${contractFile}...`);
    const result = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode, arguments: arguments })
        .send({ gas: '4000000', gasPrice: '20000000000', from: accounts[0] });

    console.log(`Deployed to`, result.options.address);
};

module.exports = {
    deploy: deploy
};
