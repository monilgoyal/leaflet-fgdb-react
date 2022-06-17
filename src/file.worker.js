import fgdb from 'fgdb'
onmessage = function({ data }) {
    const { convert } = data;
    if (convert) {
        const res = fgdb(convert)
        res.then(obj => {
            postMessage({
                result: obj
            });
        });
    } else {
        postMessage({ result: {} });
    }
};