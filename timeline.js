var margin = {top: 30, right: 20, bottom: 0, left: 5},
    width = 1075 - margin.left - margin.right,
    height = 140 - margin.top - margin.bottom;


d3.csv("./P5-datasets/nobel_laureates.csv", function (data) {
    for (var i = 0; i < data.length; i++) {
        data[i].share = Number(data[i].share); // convert "share" column to Number
        data[i].born = new Date(data[i].born); // convert "born" column to Date
        data[i].year = new Date(data[i].year);// convert "year" column to Date
        data[i].age = Number(data[i].age); // convert "age" column to Number
        data[i].died = new Date(data[i].died); // convert "died" column to Date
        data[i].is_alive = Boolean(data[i].is_alive === "TRUE"); // convert "is_alive" column to Boolean
    }

    var avgAge = d3.round(d3.mean(data, function (d) {
        return d.age;
    }));

    var sortByCategory = d3.nest()
        .key(function (d) {
            return d.category;
        })
        .entries(data);

    var sortByCountry = d3.nest()
        .key(function(d){
            return d.born_country;
        })
        .rollup(function(v){return v.length})
        .entries(data);

    console.log(sortByCountry)


    var chemistry = sortByCategory[0].values;
    var chemAvgAge = d3.round(d3.mean(chemistry, function (d) {
        return d.age;
    }));
    var literature = sortByCategory[1].values;
    var litAvgAge = d3.round(d3.mean(literature, function (d) {
        return d.age;
    }));
    var medicine = sortByCategory[2].values;
    var medAvgAge = d3.round(d3.mean(medicine, function (d) {
        return d.age;
    }));
    var peace = sortByCategory[3].values;
    var peaAvgAge = d3.round(d3.mean(peace, function (d) {
        return d.age;
    }));
    var physics = sortByCategory[4].values;
    var phyAvgAge = d3.round(d3.mean(physics, function (d) {
        return d.age;
    }));
    var economics = sortByCategory[5].values;
    var econAvgAge = d3.round(d3.mean(economics, function (d) {
        return d.age;
    }));

    // Define 'div' for tooltips
    var div = d3.select("#chart2")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Set the scale
    var x = d3.time.scale().range([0, width]).domain(d3.extent(data, function (d) {
        return d.year;
    }));
    var y = d3.scale.linear().range([height, 0]).domain([30, 90]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("top")
        .tickValues([new Date(1901, 0, 1),
            new Date(1930, 0, 1),
            new Date(1960, 0, 1),
            new Date(1990, 0, 1),
            new Date(2015, 0, 1)])
        .tickFormat(d3.time.format("%Y"))
        .tickSize(25);

    var xAxis2 = d3.svg.axis().scale(x)
        .orient("top")
        .tickValues([new Date(1910, 0, 1),
            new Date(1920, 0, 1),
            new Date(1940, 0, 1),
            new Date(1950, 0, 1),
            new Date(1970, 0, 1),
            new Date(1980, 0, 1),
            new Date(2000, 0, 1)])
        .tickFormat(d3.time.format("%Y"))
        .tickSize(15);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(0)
        .ticks(5)
        .tickFormat("");

    var partial_xAxis = d3.svg.axis().scale(x)
        .orient("top")
        .tickSize(-height * 8.45)
        .ticks(20)
        .tickFormat("");

    var partial_yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width)
        .ticks(5)
        .tickFormat("");

    // Define the line
    var valueline = d3.svg.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.age);
        });

    //Define the line for average age
    var avgLine = d3.svg.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(y(avgAge));
    //Define the line for average age for chemistry
    var chemAvgLine = d3.svg.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(y(chemAvgAge));
    //Define the line for average age for economics
    var econAvgLine = d3.svg.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(y(econAvgAge));
    //Define the line for average age for literature
    var litAvgLine = d3.svg.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(y(litAvgAge));
    //Define the line for average age for medicines
    var medAvgLine = d3.svg.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(y(medAvgAge));
    //Define the line for average age for peace
    var peaAvgLine = d3.svg.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(y(peaAvgAge));
    //Define the line for average age for physics
    var phyAvgLine = d3.svg.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(y(phyAvgAge));

    d3.select("#chart2")
        .append("div")
        .attr("class", "chemistry")
        .attr("id", "chemistry");

    d3.select("#chemistry")
        .append("svg")
        .attr("class", "textbox")
        .attr("id", "chem_text");

    d3.select("#chem_text")
        .append("text")
        .text("CHEMISTRY")
        .attr("class", "title_text")
        .attr("x", "175px")
        .attr("y", "50px")
        .on("click", function () {
        });

    d3.select("#chem_text")
        .append("text")
        .text("(" + avgAge + " years)")
        .attr("class", "text1")
        .attr("x", "175px")
        .attr("y", "85px");

    d3.select("#chem_text")
        .append("text")
        .text(chemAvgAge + " years")
        .attr("x", "175px")
        .attr("y", "100px")
        .style("stroke", "none");

    var chemistry_container = d3.select("#chemistry")
        .append("svg")
        .attr("class", "linebox")
        .attr("id", "chem_line")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the valueline path.
    chemistry_container.append("path")
        .attr("class", "dataLine")
        .attr("d", valueline(chemistry));

    // Add the X Axis
    chemistry_container.append("g")
        .call(xAxis)
        .attr("class", "x axis")
        .style("font-size", "24px")
        .style("stroke", "none")
        .style("fill", "black");

    chemistry_container.append("g")
        .call(xAxis2)
        .attr("class", "x axis")
        .style("stroke", "none")
        .style("fill", "grey");

    chemistry_container.append("g")
        .attr("class", "x axis")
        .call(partial_xAxis);
    // Add the Y Axis
    chemistry_container.append("g")
        .attr("class", "y axis")
        .call(partial_yAxis);
    chemistry_container.append("g")
        .call(yAxis);

    // Add the average age path by category.
    chemistry_container.append("path")
        .attr("class", "catLine")
        .attr("d", chemAvgLine(data));

    // Add the average age path.
    chemistry_container.append("path")
        .attr("class", "avgLine")
        .attr("d", avgLine(data, avgAge));

    // Gender Circles
    chemistry_container.selectAll("dot")
        .data(chemistry.filter(function(d){return d.gender == "female";}))
        .enter().append("circle")
        .attr("class", "circle2")
        .attr("cx", function (d) {
                return x(d.year);
        })
        .attr("cy", function (d) {
                return y(d.age);
        });

    // Add the scatterplot
    chemistry_container.selectAll("dot")
        .data(chemistry)
        .enter().append("circle")
        .attr("class", "circle1")
        .style("stroke", "white")
        .attr("cx", function (d) {
            return x(d.year);
        })
        .attr("cy", function (d) {
            return y(d.age);
        })
        .on("mouseover", function (d) {
            hoover(d);
        })
        .on("mouseleave", function (d) {
            leave(d);
        });

    d3.select("#chart2")
        .append("div")
        .attr("class", "economics")
        .attr("id", "economics");

    d3.select("#economics")
        .append("svg")
        .attr("class", "textbox")
        .attr("id", "econ_text");

    d3.select("#econ_text")
        .append("text")
        .text("ECONOMICS")
        .attr("class", "title_text")
        .attr("x", "175px")
        .attr("y", "50px")
        .on("click", function () {
        });

    d3.select("#econ_text")
        .append("text")
        .text(econAvgAge + " years")
        .attr("x", "175px")
        .attr("y", "78px")
        .style("stroke", "none");

    d3.select("#econ_text")
        .append("text")
        .text("(" + avgAge + " years)")
        .attr("class", "text1")
        .attr("x", "175px")
        .attr("y", "92px");

    var econ_container = d3.select("#economics")
        .append("svg")
        .attr("class", "linebox")
        .attr("id", "econ_line")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the valueline path.
    econ_container.append("path")
        .attr("class", "dataLine")
        .attr("d", valueline(economics));

    // Add the Y Axis
    econ_container.append("g")
        .attr("class", "y axis")
        .call(partial_yAxis);
    econ_container.append("g")
        .call(yAxis);

    // Add the average age path by category.
    econ_container.append("path")
        .attr("class", "catLine")
        .attr("d", econAvgLine(data));

    // Add the average age path.
    econ_container.append("path")
        .attr("class", "avgLine")
        .attr("d", avgLine(data, avgAge));

    // Gender Circles
    econ_container.selectAll("dot")
        .data(economics.filter(function(d){return d.gender == "female";}))
        .enter().append("circle")
        .attr("class", "circle2")
        .attr("cx", function (d) {
                return x(d.year);
        })
        .attr("cy", function (d) {
                return y(d.age);
        });

    // Add the scatterplot
    econ_container.selectAll("dot")
        .data(economics)
        .enter().append("circle")
        .style("stroke", "white")
        .attr("cx", function (d) {
            return x(d.year);
        })
        .attr("cy", function (d) {
            return y(d.age);
        })
        .on("mouseover", function (d) {
            hoover(d);
        })
        .on("mouseleave", function (d) {
            leave(d);
        });


    d3.select("#chart2")
        .append("div")
        .attr("class", "literature")
        .attr("id", "literature");

    d3.select("#literature")
        .append("svg")
        .attr("class", "textbox")
        .attr("id", "lit_text");

    d3.select("#lit_text")
        .append("text")
        .text("LITERATURE")
        .attr("class", "title_text")
        .attr("x", "175px")
        .attr("y", "50px");

    d3.select("#lit_text")
        .append("text")
        .text(litAvgAge + " years")
        .attr("x", "175px")
        .attr("y", "80px")
        .style("stroke", "none");

    d3.select("#lit_text")
        .append("text")
        .text("(" + avgAge + " years)")
        .attr("class", "text1")
        .attr("x", "175px")
        .attr("y", "95px");

    var literature_container = d3.select("#literature")
        .append("svg")
        .attr("class", "linebox")
        .attr("id", "lit_line")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the valueline path.
    literature_container.append("path")
        .attr("class", "dataLine")
        .attr("d", valueline(literature));
    // Add the Y Axis
    literature_container.append("g")
        .attr("class", "y axis")
        .call(partial_yAxis);
    literature_container.append("g")
        .call(yAxis);

    // Add the average age path by category.
    literature_container.append("path")
        .attr("class", "catLine")
        .attr("d", litAvgLine(data));

    // Add the average age path.
    literature_container.append("path")
        .attr("class", "avgLine")
        .attr("d", avgLine(data, avgAge));

    // Gender Circles
    literature_container.selectAll("dot")
        .data(literature.filter(function(d){return d.gender == "female";}))
        .enter().append("circle")
        .attr("class", "circle2")
        .attr("cx", function (d) {
            if (d.gender == "female"){
                return x(d.year);
            }
        })
        .attr("cy", function (d) {
            if (d.gender == "female") {
                return y(d.age);
            }
        });

    // Add the scatterplot
    literature_container.selectAll("dot")
        .data(literature)
        .enter().append("circle")
        .style("stroke", "white")
        .attr("cx", function (d) {
            return x(d.year);
        })
        .attr("cy", function (d) {
            return y(d.age);
        })
        .on("mouseover", function (d) {
            hoover(d);
        })
        .on("mouseleave", function (d) {
            leave(d);
        });

    d3.select("#chart2")
        .append("div")
        .attr("class", "medicine")
        .attr("id", "medicine");

    d3.select("#medicine")
        .append("svg")
        .attr("class", "textbox")
        .attr("id", "med_text");

    d3.select("#med_text")
        .append("text")
        .text("MEDICINE")
        .attr("class", "title_text")
        .attr("x", "175px")
        .attr("y", "50px");

    d3.select("#med_text")
        .append("text")
        .text("(" + avgAge + " years)")
        .attr("class", "text1")
        .attr("x", "175px")
        .attr("y", "85px");

    d3.select("#med_text")
        .append("text")
        .text(medAvgAge + " years")
        .attr("x", "175px")
        .attr("y", "100px")
        .style("stroke", "none");

    var medicines_container = d3.select("#medicine")
        .append("svg")
        .attr("class", "linebox")
        .attr("id", "lit_line")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the valueline path.
    medicines_container.append("path")
        .attr("class", "dataLine")
        .attr("d", valueline(medicine));

    // Add the Y Axis
    medicines_container.append("g")
        .attr("class", "y axis")
        .call(partial_yAxis);
    medicines_container.append("g")
        .call(yAxis);

    // Add the average age path by category.
    medicines_container.append("path")
        .attr("class", "catLine")
        .attr("d", medAvgLine(data));

    // Add the average age path.
    medicines_container.append("path")
        .attr("class", "avgLine")
        .attr("d", avgLine(data, avgAge));

    // Gender Circles
    medicines_container.selectAll("dot")
        .data(medicine.filter(function(d){return d.gender == "female";}))
        .enter().append("circle")
        .attr("class", "circle2")
        .attr("cx", function (d) {
            if (d.gender == "female"){
                return x(d.year);
            }
        })
        .attr("cy", function (d) {
            if (d.gender == "female") {
                return y(d.age);
            }
        });

    // Add the scatterplot
    medicines_container.selectAll("dot")
        .data(medicine)
        .enter().append("circle")
        .style("stroke", "white")
        .attr("cx", function (d) {
            return x(d.year);
        })
        .attr("cy", function (d) {
            return y(d.age);
        })
        .on("mouseover", function (d) {
            hoover(d);
        })
        .on("mouseleave", function (d) {
            leave(d);
        });

    d3.select("#chart2")
        .append("div")
        .attr("class", "peace")
        .attr("id", "peace");

    d3.select("#peace")
        .append("svg")
        .attr("class", "textbox")
        .attr("id", "pea_text");

    d3.select("#pea_text")
        .append("text")
        .text("PEACE")
        .attr("class", "title_text")
        .attr("x", "175px")
        .attr("y", "50px");

    d3.select("#pea_text")
        .append("text")
        .text(peaAvgAge + " years")
        .attr("x", "175px")
        .attr("y", "85px")
        .style("stroke", "none");

    d3.select("#pea_text")
        .append("text")
        .text("(" + avgAge + " years)")
        .attr("class", "text1")
        .attr("x", "175px")
        .attr("y", "100px");

    var peace_container = d3.select("#peace")
        .append("svg")
        .attr("class", "linebox")
        .attr("id", "lit_line")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the valueline path.
    peace_container.append("path")
        .attr("class", "dataLine")
        .attr("d", valueline(peace));

    // Add the Y Axis
    peace_container.append("g")
        .attr("class", "y axis")
        .call(partial_yAxis);
    peace_container.append("g")
        .call(yAxis);

    // Add the average age path by category.
    peace_container.append("path")
        .attr("d", peaAvgLine(data))
        .attr("class", "catLine");

    // Add the average age path.
    peace_container.append("path")
        .attr("class", "avgLine")
        .attr("d", avgLine(data, avgAge));

    // Gender Circles
    peace_container.selectAll("dot")
        .data(peace.filter(function(d){return d.gender == "female";}))
        .enter().append("circle")
        .attr("class", "circle2")
        .attr("cx", function (d) {
                return x(d.year);
        })
        .attr("cy", function (d) {
                return y(d.age);
        });

    // Add the scatterplot
    peace_container.selectAll("dot")
        .data(peace)
        .enter().append("circle")
        .style("stroke", "white")
        .attr("cx", function (d) {
            return x(d.year);
        })
        .attr("cy", function (d) {
            return y(d.age);
        })
        .on("mouseover", function (d) {
            hoover(d);
        })
        .on("mouseleave", function (d) {
            leave(d);
        });

    d3.select("#chart2")
        .append("div")
        .attr("class", "physics")
        .attr("id", "physics");

    d3.select("#physics")
        .append("svg")
        .attr("class", "textbox")
        .attr("id", "phy_text");

    d3.select("#phy_text")
        .append("text")
        .text("PHYSICS")
        .attr("class", "title_text")
        .attr("x", "175px")
        .attr("y", "50px");

    d3.select("#phy_text")
        .append("text")
        .text("(" + avgAge + " years)")
        .attr("class", "text1")
        .attr("x", "175px")
        .attr("y", "88px");

    d3.select("#phy_text")
        .append("text")
        .text(phyAvgAge + " years")
        .attr("x", "175px")
        .attr("y", "102px")
        .style("stroke", "none");

    var physics_container = d3.select("#physics")
        .append("svg")
        .attr("class", "linebox")
        .attr("id", "lit_line")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the valueline path.
    physics_container.append("path")
        .attr("class", "dataLine")
        .attr("d", valueline(physics));

    // Add the Y Axis
    physics_container.append("g")
        .attr("class", "y axis")
        .call(partial_yAxis);
    physics_container.append("g")
        .call(yAxis);

    // Add the average age path by category.
    physics_container.append("path")
        .attr("d", phyAvgLine(data))
        .attr("class", "catLine");

    // Add the average age path.
    physics_container.append("path")
        .attr("class", "avgLine")
        .attr("d", avgLine(data, avgAge));


    // Gender Circles
    physics_container.selectAll("dot")
        .data(physics.filter(function(d){return d.gender == "female";}))
        .enter().append("circle")
        .attr("class", "circle2")
        .attr("cx", function (d) {
            if (d.gender == "female"){
                return x(d.year);
            }
        })
        .attr("cy", function (d) {
            if (d.gender == "female") {
                return y(d.age);
            }
        });

    // Add the scatterplot
    physics_container.selectAll("dot")
        .data(physics)
        .enter().append("circle")
        .style("stroke", "white")
        .attr("cx", function (d) {
            return x(d.year);
        })
        .attr("cy", function (d) {
            return y(d.age);
        })
        .on("mouseover", function (d) {
            hoover(d);
        })
        .on("mouseleave", function (d) {
            leave(d);
        });

    function showInfo(d) {
        var textString = "<strong>Name: </strong>" + d.firstname + " " + d.surname + "<br/>" +
            "<strong>Gender: </strong>" + d.gender + "<br/>" +
            "<strong>Country of Birth: </strong>" + d.born_country + "<br/>" +
            "<strong>Year of Birth: </strong>" + d.born.getFullYear() + "<br/>" +
            "<strong>Year of Award: </strong>" + d.year.getFullYear() + "<br/>" +
            "<strong>Share: </strong>" + d.share + "<br/>" +
            "<strong>Age of Award: </strong>" + d.age + "<br/>";

        if (d.affiliation != "none") {
            textString += "<strong>Affiliation: </strong>" + d.affiliation + "<br/>"
        }
        console.log(d.is_alive)
        if (d.is_alive== "false") {
            textString += "<strong>Year of Death: </strong>" + d.died.getFullYear() + "<br/>"
        }
        if (d.motivation) {
            textString += "<strong>Motivation: </strong>" + d.motivation + "<br/>"
        }
        div.html(textString)
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    }

    function leave(d) {
        div.transition()
            .style("opacity", 0);
    }

    function hoover(d) {
        leave(d);
        div.transition()
            .style("opacity", .9);
        showInfo(d);
    }
});

