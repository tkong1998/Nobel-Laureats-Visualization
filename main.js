let categoryHistogram;
let yScale;
let yAxis;
let csvData;
let yearData;
let map;
let startYear;
let endYear;
let countryABBS = {};
let countryCode = {};
let yearDict = {};
const settings = {
    "chart": {
        "height": 1400,
        "width": 300
    },
    "rectangle": {
        "height": 15,
        "width": 25
    },
    "map": {
        "height": 700,
        "width": 700,
        "scale": 100
    }
};
function readData(data) {
    csvData = data;
    yearAxis = d3.select("#yearAxis");
    categoryHistogram = d3.select("#categoryBar");
    map = d3.select("#map").append("svg")
        .attr("width", settings.map.width)
        .attr("height", settings.map.height - 200);
    for (let i = 0; i < data.length; ++i) {
        csvData[i].intYear = parseInt(csvData[i].year);
    }
    yearData = d3.nest().key(function(d) { return d.intYear; }).entries(csvData);
    let queue1 = d3.queue();
    queue1.defer(d3.json, "world-110m.json")
        .defer(d3.json, "ISO-3166-Countries.json")
        .await(drawMap);
    initialChart(d3.select("#preference").property("value"), d3.select("#order").property("value"));
}


function initialChart(preference, order) {
    const yearList = csvData.map(function(d) { return d.intYear});
    const sortList = sortYear(yearList);
    startYear = sortList[0];
    endYear = sortList[1];
    // console.log("1",startYear);
    // console.log("2", endYear);
    yScale = d3.scaleLinear()
        .domain([sortList[0], sortList[1]])
        .range([0, settings.chart.height * 1.5]);

        for (let i = 0; i < yearData.length; ++i) {
            let entry = yearData[i].values;
            yearDict[yearData[i].key] = entry;
            entry = filterFunction(preference, order, entry);
            for (let j = 0; j < entry.length; ++j) {
                let detailInfo = entry[j];
                detailInfo.ID = j;
            }
        }
    yAxis = d3.svg.axis()
        .orient("center")
        .scale(yScale);
    //svg 
    histogramChart();
    timeline();

}

function timeline() {
    let uniqueList = yearData.map(function(d) { return d.key; });
    yearAxis.append("g")
        .selectAll(".year")
        .data(uniqueList)
        .enter()
        .append("text")
        .attr("x", 0)
        .attr("y", function(data) { return yScale(parseInt(data)) + 10; } )
        .attr("class", "year")
        .text(function(data) { return data; });
}

function drawMap(error, world, idSets) {
    for (let i = 0; i < idSets.length; ++i) {
        countryABBS[idSets[i].countrycode] = {
            "name": idSets[i].name,
            "alpha": idSets[i].alpha2
        };
        countryCode[idSets[i].alpha2] = idSets[i].name;
    }
    let projection = d3.geo.mercator();
    projection.scale(settings.map.scale);
    projection.translate([settings.map.width/2, settings.map.height/2]);
    let countries = map.append("g")
        .selectAll("world.path")
        .data(topojson.feature(world, world.objects.countries).features);
    countries.enter()
        .append("path")
        .attr("d", d3.geo.path().projection(projection))
        .attr("class", "country")
        .attr("id", function(d) {
            return d.id;
        })
        .on("mouseover", mapHandler)
        .on("mouseout", removeFromMapSection);
}

function histogramChart() {
    let cumulativeCategory = [];
    categoryHistogram.append("g")
        .selectAll(".person")
        .data(csvData)
        .enter()
        .append("rect")
        .attr("x", function(data) { return (data.ID* settings.rectangle.width); })
        .attr("y", function(data) { return yScale(data.intYear); })
        .attr("width", settings.rectangle.width)
        .attr("height", settings.rectangle.height)
        .attr("fill", function(data) { 
            // console.log(data.category);
            return categoryColor(data.category); 
        })
        .on("mouseover", categoryHandler)
        .on("mouseout", removeFromMapSection);
}


function onChangeHandler() {
    yearAxis.selectAll("text")
        .transition()
        .duration(100.0 * csvData.length / yearData.length)
        .delay(function(data, index) { return index * 8 * 6; })
        .attr("y", function(data) {
            const preference = d3.select("#preference").property("value");
            const order =  d3.select("#order").property("value");
            if (preference === "year" && order === "desc") {
                return yScale(endYear) - yScale(data) + 8;
            } else {
                return yScale(data) + 8;
            }
        });
    categoryHistogram.selectAll("rect")
        .transition()
        .duration(100)
        .delay(function(data, index) { return index * 8; })
        .attr("x", function(data) {
            const newEntry = filterFunction(d3.select("#preference").property("value"), d3.select("#order").property("value"), yearDict[data.intYear]);
            const newIndex = newEntry.indexOf(data);
            return (newIndex * settings.rectangle.width);
        })
        .attr("y", function(data) {
            const preference = d3.select("#preference").property("value");
            const order =  d3.select("#order").property("value");
            if (preference === "year" && order === "desc") {
                return yScale(endYear) - yScale(data.intYear);
            } else {
                return yScale(data.intYear);
            }

        });
}

function categoryHandler(data) {
    d3.select(this).classed("selected", true);
    let countryList = [];
    categoryHistogram.selectAll("rect").classed("linkCategoryMap", function(d) {
        if (data.category === d.category) {
            countryList.push(d.born_country_code);
        }
        return data.category === d.category;
    });
    
    d3.selectAll(".country").classed("selected", function(d) {
        if (countryABBS[d.id] != null) {
            return countryList.includes(countryABBS[d.id].alpha);
        }
        return false;
    });

    detailInfo = detailCategorySets(data.category);
    console.log("detailInfo", detailInfo);
    let genderdata = [];
    genderdata.push(detailInfo.gender.female);
    genderdata.push(detailInfo.gender.male);
    let alivedata = [];
    alivedata.push(detailInfo.alive.true);
    alivedata.push(detailInfo.alive.false);

    let sharedata =[];
    sharedata.push(detailInfo.share[1]);
    sharedata.push(detailInfo.share[2]);
    sharedata.push(detailInfo.share[3]);
    sharedata.push(detailInfo.share[4]);


    if (detailInfo.value != null && detailInfo.total > 0) {
        if (detailInfo.value === "physics") {
            d3.select("#info-total").text("From 1901 to 2015, " 
                + detailInfo.total + " Nobel Prize winners have made the most outstanding contributions for humankind in the field of physics.");
        } else if (detailInfo.value === "chemistry") {
            d3.select("#info-total").text("From 1901 to 2015, " 
                + detailInfo.total + " Laureates were awarded for outstanding contributions in chemistry.");
        } else if (detailInfo.value === "literature") {
            d3.select("#info-total").text("From 1901 to 2015, " 
                + detailInfo.total + " authors have made outstanding contributions in the field of literature. ");
        } else if (detailInfo.value === "medicine") {
            d3.select("#info-total").text("From 1901 to 2015, " 
                + detailInfo.total + " researchers were awarded for outstanding discoveries in the fields of life sciences and medicine. ");
        } else if (detailInfo.value === "peace") {
            d3.select("#info-total").text("From 1901 to 2015, " 
                + detailInfo.total + " winners are those who have done the most or the best work for fraternity between nations, for the abolition or reduction of standing armies and for the holding and promotion of peace congresses. ");
        } else if (detailInfo.value === "economics") {
            d3.select("#info-total").text("From 1901 to 2015, " 
                + detailInfo.total + "Laureates to researchers in the field of economic sciences, and generally regarded as the most prestigious award for that field. ");
        }

        drawPieChart("#genderPie", genderdata, detailInfo.total);
        drawPieChart("#alivePie", alivedata, detailInfo.total);
        drawPieChart("#sharePie", sharedata, detailInfo.total);
    }

}


function detailCategorySets(value) {
    let displayinfo = {
        "value": value,
        "total": 0,
        "alive": {
            "true": 0,
            "false": 0
        },
        "gender": {
            "male": 0,
            "female": 0
        },
        "share": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
        }
    };
    for (let i = 0; i < csvData.length; ++i) {
        if (csvData[i].category === value) {
            displayinfo.total +=1;
            displayinfo.gender[csvData[i].gender] +=1;
            displayinfo.share[csvData[i].share] +=1;
            displayinfo.alive[csvData[i].is_alive] +=1;
        }
    }
    // console.log("display", displayinfo);
    return displayinfo;
}



function detailInfoSets(value) {
    // console.log("value", value);
    let displayinfo = {
        "value": value,
        "name": "",
        "total": 0,
        "category": {
            "physics": 0,
            "chemistry": 0,
            "medicine": 0,
            "literature": 0,
            "peace": 0,
            "economics": 0
        },
        "alive": {
            "true": 0,
            "false": 0
        },
        "gender": {
            "male": 0,
            "female": 0
        },
        "share": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
        }
    };
    
    for (let i = 0; i < csvData.length; ++i) {
        if (csvData[i].born_country_code === value) {
            displayinfo.total +=1;
            displayinfo.name = csvData[i].born_country;
            displayinfo.gender[csvData[i].gender] +=1;
            displayinfo.category[csvData[i].category] +=1;
            displayinfo.alive[csvData[i].is_alive] +=1;
            displayinfo.share[csvData[i].share] += 1;
        }
    }
    // console.log("display", displayinfo);
    return displayinfo;
}

function drawPieChart(id, data1, total) {
    // console.log("pie", data1);
    const r = 50;
    pieColors = [];
    pieColors.push("#0fb9b1");
    pieColors.push("#fed330");
    pieColors.push("#48dbfb");
    pieColors.push("#c8d6e5");

    textList = [];
    var chartTitle;
    if (id == "#genderPie") {
        textList.push("female");
        textList.push("male");
        chartTitle = "Gender"
    } else if (id =="#alivePie"){
        textList.push("Alive");
        textList.push("Died");
        chartTitle = "Alive"
    } else {
        textList.push("1: ");
        textList.push("2: ");
        textList.push("3: ");
        textList.push("4: ");
        chartTitle = "Share"
    }

    let group = d3.select(id).append("g").attr("transform", "translate(70, 70)");
    let arc = d3.svg.arc()
        .innerRadius(20)
        .outerRadius(r);
    let pie = d3.layout.pie()
        .value(function(d) { return d; });
    let arcs = group.selectAll(".arc")
        .data(pie(data1))
        .enter()
        .append("g")
        .attr("class", "arc");
    arcs.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return pieColors[i]; });
    var titleSize = measure(chartTitle, "title");
        margin.top = titleSize.height + 20;
    arcs.append("text")
        .attr("x", 0 )
        .attr("y", - r - 5)
        .attr("class", "title")
        .style("text-anchor", "middle")
        .text(chartTitle);
    const g2 = group.selectAll('.arc2')
        .data(pie(data1))
        .enter()
        .append('g')
        .attr('class', 'arc');
    g2.append('text')
        .attr("text-anchor", "middle")
        .attr('transform', (d) => { return 'translate(' + arc.centroid(d) + ')' })
        .attr('dy', '.35em')
        .attr("display", function(d) { return d.value > 0 ? null : "none"; })  
        .text(function(d, i) { return textList[i] + " " + ((d.value/total) * 100).toFixed(0)  + "%"});
    // arcs.append("text")
    //     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; }) 
    //    .attr("dy", 5) 
    //    .attr("text-anchor", "middle") 
    //    .attr("display", function(d) { return d.value > 0 ? null : "none"; })  
    //    .text(function(d, i) { return textList[i] + " " + d.value.toFixed(0) + "%"});

}

function measure(text, classname) {
  if(!text || text.length === 0) return {height: 0, width: 0};

  var container = d3.select('body').append('svg').attr('class', classname);
  container.append('text').attr({x: -1000, y: -1000}).text(text);

  var bbox = container.node().getBBox();
  container.remove();

  return {height: bbox.height, width: bbox.width};
}
function mapHandler(data) {
    const countryCode = countryABBS[data.id].alpha;
    // console.log("hello", countryCode);
    d3.select(this).classed("selected", true);
    categoryHistogram.selectAll("rect").classed("linkMaptoData", function(d) {
        return countryCode === d.born_country_code;
    });
    detailInfo = detailInfoSets(countryCode);
    //pie chart 
    let genderdata = [];
    genderdata.push(detailInfo.gender.female);
    genderdata.push(detailInfo.gender.male);
    let alivedata = [];
    alivedata.push(detailInfo.alive.true);
    alivedata.push(detailInfo.alive.false);

    let sharedata =[];
    sharedata.push(detailInfo.share[1]);
    sharedata.push(detailInfo.share[2]);
    sharedata.push(detailInfo.share[3]);
    sharedata.push(detailInfo.share[4]);

    // console.log("share", sharedata);
    if (detailInfo.name != null && detailInfo.total > 0) {
        d3.select("#info-total").text("From 1901 to 2015, " 
       + detailInfo.total + " Nobel Prize winners were born in "
       + detailInfo.name + ". " 
       + detailInfo.category.physics + " for those who have made the most outstanding contributions for humankind in the field of physics. "
       + detailInfo.category.chemistry + " Laureates were awarded for outstanding contributions in chemistry. "
       + detailInfo.category.literature + " to authors for outstanding contributions in the field of literature. "
       + detailInfo.category.economics + " to researchers in the field of economic sciences, and generally regarded as the most prestigious award for that field. "
       + detailInfo.category.medicine + " were awarded for outstanding discoveries in the fields of life sciences and medicine. "
       + detailInfo.category.peace + " to those who have done the most or the best work for fraternity between nations, for the abolition or reduction of standing armies and for the holding and promotion of peace congresses. "
        );
    } else {
        d3.select("#info-total").text("Oops! No information available for this area.");
    }
    
    if (detailInfo.name != null && detailInfo.total != 0) {
        drawPieChart("#genderPie", genderdata, detailInfo.total);
        drawPieChart("#alivePie", alivedata, detailInfo.total);
        drawPieChart("#sharePie", sharedata, detailInfo.total);
    }
   
}

function removeFromMapSection() {
    d3.selectAll("rect").classed("selected", false);
    d3.selectAll("rect").classed("linkCategoryMap", false);
    d3.selectAll("rect").classed("linkMaptoData", false);
    d3.selectAll(".country").classed("selected", false);
    d3.selectAll(".arc").remove();
    d3.select("#info-total").text("");

}

function sortYear(yearList) {
    let endTime = 2020;
    let startTime = 1800;
    for (let i=0; i < yearList.length; ++i) {
        if (yearList[i] > startTime) {
            startTime = yearList[i];
        }
        if (yearList[i] < endTime) {
            endTime = yearList[i];
        }
    }
    return [endTime, startTime]

}

function filterFunction(preference, order, entry) {
    switch (preference) { 
        case "category":
            if (order === "asc") {
                return entry.sort(function(a, b) { return ('' + a.category).localeCompare('' + b.category); });
            } else {
                return entry.sort(function(a, b) { return ('' + b.category).localeCompare('' + a.category); });
            }
        default:
            return entry;
    }
}

function categoryColor(value) {
    switch (value) {
        case "physics":
            return "tomato";
        case "chemistry":
            return "indianred";
        case "peace":
            return "Indigo";
        case "medicine":
            return "Goldenrod";
        case "literature":
            return "YellowGreen";
        case "economics":
            return "DarkSlateGrey";
    }
}

