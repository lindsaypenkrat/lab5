    const margin = ({top: 50, right: 140, bottom: 20, left: 140});
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    let type = d3.select("#group-by").node().value;
    let sorter = 'ascend';
    

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


    let yUnit = plot.append('text')
        .attr('alignment-baseline', 'start')
        .attr("fill", "#eee3c8")
        .attr('x', -30)
        .attr('y', -10);


    plot.append("g")
        .attr("class", "axis x-axis")
        .attr("color", "#eee3c8")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);
    
    plot.append("g")
        .attr("class", "axis y-axis")
        .attr("color", "#eee3c8")
        .call(yAxis)
    

    function update(data,type,sorter){
        // update domains

        if (sorter == 'ascend') {
            data.sort((a, b) => a[type] - b[type]);
        } else {
            data.sort((a, b) => b[type] - a[type]);
        }

        xScale.domain(data.map(d=>d.company));
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
        bars
            .exit()
            .remove();
    
        // update axes and axis title
        yUnit
            .transition()
            .duration(500)
            .text(() => {
                    if (type == 'stores') {
                        return 'Stores';
                    } else {
                        return 'Billion USD';
                    }
                })
    }

    let data  = d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
        update(data,type,sorter); // simply call the update function with the supplied data
        
        d3.select('#group-by')
            .on('change', e => {
                type = e.target.value;
                update(data, type,sorter);
            });
        
        d3.select('#sorter')
            .on('click', e => {
                if (sorter == 'ascend'){
                    sorter = 'descend';
                }
                else {
                    sorter= 'ascend';
                }
                update(data, type, sorter);
            });

    });