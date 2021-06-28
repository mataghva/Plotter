import * as d3 from 'd3';
import { validate, validateExPoints } from './validate'

const w = 500;
const h = 500;
const padding = 5;

let xDomainElement = document.getElementById("x-domain");
let xDomain = xDomainElement.value;
xDomainElement.addEventListener('input', (e) => {
    xDomain = e.target.value;
    updateData();
});

let yDomainElement = document.getElementById("y-domain");
let yDomain = yDomainElement.value;
yDomainElement.addEventListener('input', (e) => {
    yDomain = e.target.value;
    updateData();
});

let zeroCheckElement = document.getElementById("zeroCheck");
let excludeZero = zeroCheckElement.checked;
zeroCheckElement.addEventListener('click', (e) => {
    excludeZero = e.target.checked;
    updateData()
});

let negCheckElement = document.getElementById("negCheck");
let excludeNeg = negCheckElement.checked;
negCheckElement.addEventListener('click', (e) => {
    excludeNeg = e.target.checked;
    updateData()
});

let exPointsElement = document.getElementById("ex-points");
let exPoints = exPointsElement.value;
exPointsElement.addEventListener('input', (e) => {
    exPoints = e.target.value;
    exPointsArr = validateExPoints(exPoints);
    updateData();
});

let colorElement = document.getElementById("graph-color");
let graphColor = colorElement.value;
colorElement.addEventListener('input', (e) => {
    graphColor = e.target.value;
    updateData();
});

let exPointsArr = validateExPoints(exPoints);

let funcElement = document.getElementById("function");
let func = funcElement.value;
let validFunc;
funcElement.addEventListener('input', (e) => {
    func = e.target.value;
    validFunc = validate(func);
    if (validFunc.includes("log")) {
        zeroCheckElement.checked = true;
        excludeZero = true;
        negCheckElement.checked = true;
        excludeNeg = true;
    }
    updateData();
});

validFunc = validate(func);

let svg = d3.select("#graph").append("svg")
.attr("class", "svg")
.attr("width", w)
.attr("height", h);

let x;
let y;
let dataset = [];

let xScale = d3.scaleLinear()
       .domain([-xDomain, xDomain])
       .range([padding, w - padding]);

let yScale = d3.scaleLinear()
       .domain([-yDomain, yDomain])
       .range([h - padding, padding]);

for (let i = -200; i < 200; i++) {
    if (excludeZero && i === 0) continue;
    if (excludeNeg && i < 0) continue;
    x = (i/200) * xDomain;
    y = eval(validFunc);
    if (exPointsArr.includes(x)) continue;
    // if ((y > yDomain) || (y < -yDomain)) continue;
    dataset.push([x, y])
};

let xAxis = svg.append("g")
                .attr("transform", "translate(0," + (h/2) + ")")
                .call(d3.axisBottom(xScale));

let yAxis = svg.append("g")
                .attr("transform", "translate(" + (w/2) + ", 0)")
                .call(d3.axisLeft(yScale));

svg.append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", w)
    .attr("y", (h/2)-2)
    .text("x")

svg.append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "front")
    .attr("x", (w/2)+2)
    .attr("y", 12)
    .text("y")


var lineFunction = d3.line()
    .x((d) => d[0])
    .y((d) => d[1])
    // .curve(d3.curveCatmullRom.alpha(0.5));
    // .curve(d3.curveStep);
    // .curve(d3.curveCardinal.tension(0.5));
    // .curve(d3.curveLinear);
    .curve(d3.curveBasisOpen);


var lineData = [];
for (let i = 0; i < dataset.length; i++) {
    lineData.push([xScale(dataset[i][0]), yScale(dataset[i][1])]);
};
var lineGraph = svg.append("g")
                    .append("path")
                    .attr("d", lineFunction(lineData))
                    .attr("stroke-width", 3)
                    .attr("stroke", graphColor)
                    .attr("fill", "none");

function updateData() {

    xScale.domain([-xDomain, xDomain]);
    yScale.domain([-yDomain, yDomain]);
      
    xAxis.transition()
        .duration(750)
        .call(d3.axisBottom(xScale));

    yAxis.transition()
        .duration(750)
        .call(d3.axisLeft(yScale));   

    let newDataset = [];
    for (let i = -200; i < 200; i++) {
        if (excludeZero && i === 0) continue;
        if (excludeNeg && i < 0) continue;
        x = (i/200) * xDomain;
        y = eval(validFunc);
        if (exPointsArr.includes(x)) continue;
        // if ((y > yDomain) || (y < -yDomain)) continue;
        newDataset.push([x, y])
    };

    let newLineData = []
    for (let i = 0; i < newDataset.length; i++) {
            newLineData.push([xScale(newDataset[i][0]), yScale(newDataset[i][1])]);
    };
    lineGraph
        .transition()
        .duration(500)
        .attr("d", lineFunction(newLineData))
        .attr("stroke", graphColor);
};
