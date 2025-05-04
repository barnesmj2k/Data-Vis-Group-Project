class ScatterView
{
    constructor (data, con, width, height)
    {
        // Create SVG container
        const svg = con.root.append('div')
            .style('width', `${width}px`)
            .style('height', `${height}px`)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(50, 30)');

        const plotWidth = width - 70;
        const plotHeight = height - 60;

        // Example scales
        const xScale = d3.scaleLinear()
            .domain([0, 10])  // Placeholder
            .range([0, plotWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, 10])  // Placeholder
            .range([plotHeight, 0]);

        // Add X Axis
        svg.append('g')
            .attr('transform', `translate(0, ${plotHeight})`)
            .call(d3.axisBottom(xScale));

        // Add Y Axis
        svg.append('g')
            .call(d3.axisLeft(yScale));

        console.log(data);
    }
}