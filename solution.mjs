function add() {

    let result = 0;
    for (let value of arguments) {
        result += value;
    }
    return result;

}

function deserialize(content) {
    let rowName = "";
    let objArr = {};

    for (let keys = Object.keys(content), i = 0, end = keys.length; i < end; i++) {

        let key = keys[i],
            value = content[key];

        if (i == keys.length - 1) {
            objArr[key] = value;
        } else {

            let rowNameTmp = key.split("_");
            rowName = rowNameTmp[0].replace(/[0-9]/g, "");
            let prop = rowNameTmp[1];

            let index = key.match(/\d+/)[0];

            if (!objArr[rowName]) objArr[rowName] = [];
            if (!objArr[rowName][index]) objArr[rowName][index] = {};

            if (value instanceof Object) {
                let str = {};
                for (let [key, valueInside] of Object.entries(value)) {

                    let timeProp = key.split("_")[1];
                    let row2Name = key.split("_")[0].replace(/[0-9]/g, "");
                    let element = {};

                    if (!str[row2Name]) str[row2Name] = [];

                    const date = new Date(parseInt(valueInside.replace("t:", "")));

                    element[timeProp] = addExtraCero(date.getDate()) + "/" + addExtraCero(date.getMonth() + 1) + "/" + date.getFullYear();
                    str[row2Name].push(element);

                }
                value = str;
            }

            objArr[rowName][index][prop] = value;

        }

    }

    return objArr;
}


function listToObject(content) {

    let result = {};
    let arr = JSON.parse(JSON.stringify(content));

    for (let element of arr) {
        result[element.name] = element.value;
    }

    return result;
}

function objectToList(content) {

    let arr = [];
    let _content = JSON.parse(JSON.stringify(content));
    Object.keys(_content)
        .map(function (key) {
            arr.push({
                name: key,
                value: _content[key]
            });
        });

    return arr;
}

function serialize(content) {

    let arr = {};
    // names
    for (let row = content.row.length - 1; row >= 0; row--) {
        arr["row" + row + "_name"] = content.row[row].name;

    }
    // values
    for (let row = content.row.length - 1; row >= 0; row--) {
        arr["row" + row + "_value"] = content.row[row].value;
    }
    // hits
    for (let row = content.row.length - 1; row >= 0; row--) {
        if (content.row[row].hits !== undefined) {

            let hit = {};

            for (let [index, value] of content.row[row].hits.hit.entries()) {
                hit["hit" + index + "_time"] = value.time;

            }

            arr["row" + row + "_hits"] = hit;

        }
    }

    arr["total"] = content.row.length;
    return arr;
}

function addExtraCero(n) {
    return n < 10 ? "0" + n : n;
}

export { add, serialize, objectToList, deserialize, listToObject };