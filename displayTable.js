module.exports = function displayTable(array, numRowsPerGroup, columnType) {
   
    array.forEach(row => {
        for (let key in row) {
            if (typeof columnType[key] !== "undefined") {
                row[key] = row[key].toFixed(columnType[key]);
            }
        }
    });

    const columnWidths = {};

    const headers = Object.keys(columnType);
    headers.forEach(h => columnWidths[h] = h.length);

    array.forEach(row => {
        for (let key in row) {
            columnWidths[key] = Math.max(columnWidths[key], row[key].length);
        }
    });
    
    const output_header = headers.reduce((sum, value) => 
        sum + value + " ".repeat(columnWidths[value] - value.length + 2)

    , "").toUpperCase();

    let count = 0;

    array.forEach(row => {
        if (count % numRowsPerGroup === 0) {
            console.log(`${output_header}`.yellow.bold);
        }

        const output_row = headers.reduce((sum, value) => {
            const item = row[value];

            return sum + item + " ".repeat(columnWidths[value] - item.length + 2);

        }, "");

        console.log(output_row.white);

        count++;

        if (count % numRowsPerGroup === 0 || count === array.length) {
            console.log();
        }
    });
}