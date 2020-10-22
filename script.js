    const margin = ({top: 50, right: 140, bottom: 20, left: 140});
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    let type = d3.select("#group-by").node().value;

    const plot = d3.select('.chart').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    const xScale = d3
        .scaleBand()
        .rangeRound([0,width]) 
        .paddingInner(0.1)


    const yScale = d3
        .scaleLinear()
        .range([height,0]);

    const xAxis = d3.axisBottom()
        .scale(xScale)


    const yAxis = d3.axisLeft()
        .scale(yScale)


    plot.append("g")
        .attr("class", "axis x-axis")
        .attr("color", "#eee3c8")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);
    
    plot.append("g")
        .attr("class", "axis y-axis")
        .attr("color", "#eee3c8")
        .call(yAxis)


    plot.append("text")
        .attr("class", "y-axis-title")
        .attr('x', -60)
        .attr('y', -10)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "#eee3c8")
        .attr('text-anchor', 'start')
        .text("Stores");
    

    function update(data,type){
        // update domains
        xScale.domain(data.map(d=>d.company))
        yScale.domain([0, d3.max(data,d=>d[type])]);
    
        // update bars
        let bars = plot.selectAll('rect')
            .data(data, d => {return d.company; });
        bars
            .enter()
            .append('rect')
            .merge(bars)
            .transition()
            .duration(1000)
            .attr('class', 'barsGraphed')
            .attr('height',d => (height - yScale(d[type]))) 
            .attr('width', xScale.bandwidth())
            .attr('x', d=>xScale(d.company))
            .attr('y', d=>yScale(d[type])) 
            .attr('fill', '#eee3c8');
    
        // update axes and axis title
    
    }

    let data  = d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
        update(data,type); // simply call the update function with the supplied data
        
        d3.select('#group-by')
            .on('change', e => {
                type = e.target.value;
                update(data, type);
            });

    });