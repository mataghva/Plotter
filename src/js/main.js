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

let posCheckElement = document.getElementById("posCheck");
let excludePos = posCheckElement.checked;
posCheckElement.addEventListener('click', (e) => {
    excludePos = e.target.checked;
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
let errElement = document.getElementById("errMessage");
let [validFunc, errorMessage] = validate(func);
errElement.innerText = errorMessage;

funcElement.addEventListener('input', (e) => {
    func = e.target.value;
    [validFunc, errorMessage] = validate(func);
    errElement.innerText = errorMessage;
    // if (validFunc.includes("log")) {
    //     zeroCheckElement.checked = true;
    //     excludeZero = true;
    //     negCheckElement.checked = true;
    //     excludeNeg = true;
    // }
    updateData();
});

// validFunc = validate(func);

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

for (let i = -250; i < 250; i++) {
    x = (i/250) * xDomain;
    y = eval(validFunc);
    if (y >= (2 * yDomain) || 
        y <= -(2 * yDomain) ||
        (excludePos && i > 0) || 
        (excludeNeg && i < 0) ||
        (exPointsArr.includes(x)))
        {y = null};
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

let lineFunction = d3.line()
        .defined(function (d) {return d[1] !== null;})
    // .x((d) => d[0])
    // .y((d) => d[1])
    // .curve(d3.curveCatmullRom.alpha(0.5));
    // .curve(d3.curveStep);
    // .curve(d3.curveCardinal.tension(0.5));
    // .curve(d3.curveLinear);
    // .curve(d3.curveBasisOpen);


let lineData = [];
for (let i = 0; i < dataset.length; i++) {
    lineData.push([xScale(dataset[i][0]),
                    (dataset[i][1] === null) || isNaN(dataset[i][1]) ? null : yScale(dataset[i][1])]);
};
let lineGraph = svg.append("g")
                    .append("path")
                    .attr("d", lineFunction(lineData))
                    .attr("stroke-width", 2)
                    .attr("stroke", graphColor)
                    .attr("fill", "none");

let focus = svg
            .append("g")
            .append("circle")
            .style("fill", "red")
            .attr("stroke", "black")
            .attr("r", 4)
            .style("opacity", 0);

let bisect = d3.bisector(function(d) {return d[0]}).left;

let focusText = svg
                .append("g")

let focusTextX = focusText
                .append("text")
                .style("opacity", 0)
                .attr("class", "focusDataLabel")
                .attr("text-anchor", "left")
                .attr("alignment-baseline", "middle")

let focusTextY = focusText
                .append("text")
                .style("opacity", 0)
                .attr("class", "focusDataLabel")
                .attr("text-anchor", "left")
                .attr("alignment-baseline", "middle")

svg
    .append("rect")
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr("width", w)
    .attr("height", h)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);

function mouseover() {
    focus.style("opacity", 1)
    focusTextX.style("opacity", 1)
    focusTextY.style("opacity", 1)
};

function mousemove(event) {
    let x0 =xScale.invert(d3.pointer(event)[0]);
    let i = bisect(dataset, x0, 1);
    let selectedData = dataset[i];
    let xOffset = 10;
    let yOffset = 0;
    if (selectedData[1] === null ||
        yScale(selectedData[1]) < 0 ||
        yScale(selectedData[1]) > h) {
        focus.style("opacity", 0)
        focusTextX.style("opacity", 0)
        focusTextY.style("opacity", 0)
    } else {
        if (xScale(selectedData[0]) > w - 85) {xOffset = -70;};
        if (yScale(selectedData[1]) < 15) {yOffset = 10;};
        if (yScale(selectedData[1]) > h - 30) {yOffset = -30;};
        focus
            .style("opacity", 1)
            .attr("cx", (xScale(selectedData[0])))
            .attr("cy", (yScale(selectedData[1])));
        focusTextX
            .style("opacity", 1)
            .html("x: " + Math.round(selectedData[0] * 1000)/1000)
            .attr("x", xScale(selectedData[0]) + xOffset+ 10)
            .attr("y", yScale(selectedData[1]) + yOffset - 7);
        
        focusTextY
            .style("opacity", 1)
            .html("y: " + Math.round(selectedData[1] * 1000)/1000)
            .attr("x", xScale(selectedData[0]) + xOffset + 10)
            .attr("y", yScale(selectedData[1]) + yOffset + 8)
    }
    
}   

function mouseout() {
    focus.style("opacity", 0)
    focusTextX.style("opacity", 0)
    focusTextY.style("opacity", 0)
}




function updateData() {

    xScale.domain([-xDomain, xDomain]);
    yScale.domain([-yDomain, yDomain]);
      
    xAxis.transition()
        .duration(750)
        .call(d3.axisBottom(xScale));

    yAxis.transition()
        .duration(750)
        .call(d3.axisLeft(yScale));   

    dataset = [];
    for (let i = -200; i < 200; i++) {
        x = (i/200) * xDomain;
        y = eval(validFunc);
        if (y >= (2 * yDomain) || 
            y <= -(2 * yDomain) ||
            (excludePos && i > 0) || 
            (excludeNeg && i < 0) ||
            (exPointsArr.includes(x)))
            {y = null};
        dataset.push([x, y])
    };
    console.log("newDataSet   ", dataset)
    lineData = []
    for (let i = 0; i < dataset.length; i++) {
            lineData.push([xScale(dataset[i][0]), 
                            (dataset[i][1] === null) || isNaN(dataset[i][1]) ? null : yScale(dataset[i][1])]);
    };

    lineGraph
        .transition()
        .duration(500)
        .attr("d", lineFunction(lineData))
        .attr("stroke", graphColor);

};

