export function add() {

    let result = 0;
    for (let value of arguments) {
        result += value;
    }
    return result;

}

export function deserialize(content) {

    let total = content.total;
    let arr = {};
    let arrT = [];

    for (let row = 0; row < total; row++) {

        let obj = {};
        if (content["row" + row + "_hits"] !== undefined) {

            obj["hits"] = {};
            obj["hits"]["hit"] = [];

            for (let [key, value] of Object.entries(content["row" + row + "_hits"])) {
                const date = new Date(parseInt(value.replace("t:", "")));
                obj["hits"]["hit"].push({
                    time: addExtraCero(date.getDate()) + "/" + addExtraCero(date.getMonth() + 1) + "/" + date.getFullYear()
                });
            }
        }

        obj["name"] = content["row" + row + "_name"];
        obj["value"] = content["row" + row + "_value"];

        arrT.push(obj);
    }

    arr["row"] = arrT;
    arr["total"] = total;

    return arr;

}

export function listToObject(content) {

    let result = {};
    let arr = JSON.parse(JSON.stringify(content));

    for (let element of arr) {
        result[element.name] = element.value;
    }

    return result;
}

export function objectToList(content) {

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

export function serialize(content) {

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