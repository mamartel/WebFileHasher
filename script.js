function addResult(fileName, algorithm, value) {
    document.getElementById('results').insertRow(-1).innerHTML = `
    <td>${fileName}</td>
    <td>${algorithm}</td>
    <td>${value}</td>
    `
}

function getSelectedAlgorithms() {
    let algorithms = [];

    let inputs = document.getElementById('algorithms')
        .getElementsByTagName('input');

    for (const input of inputs) {
        if (input.checked)
            algorithms.push(input.value);
    }

    return algorithms;
}

async function hash(algorithm, data) {
    // From: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
    
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = new Uint8Array(hashBuffer); // An `ArrayBuffer` can't be directly manipulated
    
    let hashHex = "";
    for (const b of hashArray) {
        hashHex += b.toString(16).padStart('0', 2);
    }

    return hashHex;
}

function onFileInput() {
    let algorithms = getSelectedAlgorithms();
    let files = document.getElementById('files').files;
    for (const file of files) {
        let reader = new FileReader();
        reader.onload = (e) => {
            for (const algo of algorithms) {
                hash(algo, e.target.result)
                    .then((hash) => addResult(file.name, algo, hash));
            }
        };
        reader.readAsArrayBuffer(file);
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById('files')
        .addEventListener('input', onFileInput, false);
});
