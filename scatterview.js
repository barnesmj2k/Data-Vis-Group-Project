class ScatterView {
    constructor(data, con, width, height) 
    {
        const margin = { top: 60, right: 40, bottom: 60, left: 60 };
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;

        const svg = con.root.append('div')
            .style('width', `${width}px`).style('height', `${height}px`)
            .append('svg')
            .attr('width', width).attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const openingStats = {};
        data.forEach(({ opening_name, winner }) => {
            if (!openingStats[opening_name]) openingStats[opening_name] = { w: 0, b: 0, d: 0, t: 0 };
            if (winner == 'white') openingStats[opening_name].w++;
            else if (winner == 'black') openingStats[opening_name].b++;
            else openingStats[opening_name].d++;
            openingStats[opening_name].t++;
        });

        const colorScale = d3.scaleLinear()
            .domain([-1, 0, 1])
            .range(['#1f77b4', '#aaaaaa', '#d62728']);

        const plotData = Object.entries(openingStats).map(([opening, { w, b, t }]) => 
        ({
            opening,
            whiteWinRate: w / t,
            blackWinRate: b / t,
            diff: (w - b) / t
        }));

        const xScale = d3.scaleLinear().domain([0, 1]).range([0, plotWidth]);
        const yScale = d3.scaleLinear().domain([0, 1]).range([plotHeight, 0]);

        svg.append('g')
            .attr('transform', `translate(0, ${plotHeight})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format(".0%")));

        svg.append('g')
            .call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")));

        svg.append('text')
            .attr('x', plotWidth / 2).attr('y', plotHeight + 40)
            .style('text-anchor', 'middle').text('White Win Rate');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -plotHeight / 2).attr('y', -40)
            .style('text-anchor', 'middle').text('Black Win Rate');

        // Tooltips
        const tooltip = svg.append('text')
            .attr('class', 'tooltip')
            .attr('x', 0).attr('y', -20)
            .attr('fill', 'black')
            .style('font-size', '12px')
            .style('visibility', 'hidden');

        // Points
        svg.selectAll('circle')
            .data(plotData).enter()
            .append('circle')
            .attr('cx', d => xScale(d.whiteWinRate))
            .attr('cy', d => yScale(d.blackWinRate))
            .attr('r', 4)
            .attr('fill', d => colorScale(d.diff))
            .attr('opacity', 0.8)
            .on('mouseover', (event, d) => 
            {
                const opening = d.opening.length > 30 ? d.opening.slice(0, 27) + '…' : d.opening;
                tooltip.text(`${opening} — W: ${(d.whiteWinRate * 100).toFixed(1)}%, B: ${(d.blackWinRate * 100).toFixed(1)}%`)
                    .style('visibility', 'visible');
            })
            .on('mouseout', () => tooltip.style('visibility', 'hidden'));

        // Legend
        const legend = svg.append('g')
            .attr('transform', `translate(${plotWidth - 150}, 10)`);

        const legendData = [
            { label: 'White Dominant', color: '#d62728' },
            { label: 'Draw/Balanced', color: '#aaaaaa' },
            { label: 'Black Dominant', color: '#1f77b4' }
        ];

        legend.selectAll('rect')
            .data(legendData).enter()
            .append('rect')
            .attr('x', 0).attr('y', (d, i) => i * 20)
            .attr('width', 14).attr('height', 14)
            .attr('fill', d => d.color);

        legend.selectAll('text')
            .data(legendData).enter()
            .append('text')
            .attr('x', 20).attr('y', (d, i) => i * 20 + 11)
            .text(d => d.label)
            .style('font-size', '12px')
            .attr('fill', 'black');
    }
}

