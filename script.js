let data  = d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
    console.log(data);


    const margin = ({top: 50, right: 140, bottom: 20, left: 140});
    const width = 800 - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;

    let plot = d3.select('.chart').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.company))
        .rangeRound([0,width]) 
        .paddingInner(0.1)


    const yScale = d3
        .scaleLinear()
        .domain([d3.min(data, d => d.stores) , d3.max(data, d => d.stores)])
        .range([height,0]);

    plot.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'buildings')
        .attr('height',10) //dynamic element, change
        .attr('width', xScale.bandwidth())
        .attr('x', d=>xScale(d.company))
        .attr('y', 10) //dynamic element, change
        .attr('fill', 'skyblue') 

    const xAxis = d3.axisBottom()
        .scale(xScale)


    const yAxis = d3.axisLeft()
        .scale(yScale)


    plot.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);
    
    plot.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)


    plot.append("text")
        .attr('x', -60)
        .attr('y', -10)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "#F3F3F3")
        .attr('text-anchor', 'start')
        .text("Stores");
    }); 