
const mathFuncs = ["asin(", "sinh(", "sin(", "acos(", "cosh(", "cos(", "atan(", "tanh(", "tan(", "log(", "log10(", "exp(", "abs("];

function validate (func) {
        let validFunc;
        let reg;
        RegExp.quote = function(str) {
            return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        };
        func = func.toLowerCase().replace(/math.|delete|drop|copy|format/g, "");
        for (let i = 0; i < mathFuncs.length; i++) {
            reg = new RegExp(RegExp.quote(mathFuncs[i]), "g");
            func = func.replace(reg, `Math.${mathFuncs[i].toUpperCase()}`);
        };
    validFunc = func.toLowerCase().replace(/math/g, "Math")
    return validFunc;
};

function validateExPoints(exPoints) {
    let validExPoints = exPoints.replace(/[A-Za-z!@$%^&*+=_()]/g, "");
    validExPoints = validExPoints.replace(/\s|\s\s/g, "");
    validExPoints = validExPoints.replace(/,,,,|,,,|,,/g, ",");
    if (validExPoints !== "") {
    let tempArr = validExPoints.split(",");
    let validExPointsArr = tempArr.map((ele) => Number(ele));
    return validExPointsArr;
    } else {return []};
}

export {validate, validateExPoints};
