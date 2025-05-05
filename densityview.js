class DensityView {
    constructor(data, con, w, h) 
    {
        this.con = con;
        this.size = {
            margin: 40,
            width: w - 80,
            height: h - 80
        };

        const container = con.root.append('div')
            .style('width', `${w}px`).style('height', `${h + 60}px`);

        // Slider
        const sliderDiv = container.append('div')
            .style('margin-bottom', '10px')
            .style('text-align', 'center');

        sliderDiv.append('label')
            .text('Min Rating: ')
            .style('margin-right', '6px');

        const slider = sliderDiv.append('input')
            .attr('type', 'range')
            .attr('min', 0)
            .attr('max', 3000)
            .attr('value', 0)
            .style('width', '300px')
            .on('input', function () {
                redraw(+this.value);
            });

        const svg = container.append('svg')
            .attr('width', w).attr('height', h)
            .append('g')
            .attr('transform', `translate(${this.size.margin},${this.size.margin})`);

        data.forEach(d => {
            d.avg_rating = (parseInt(d.white_rating) + parseInt(d.black_rating)) / 2;
        });

        const outcomes = Array.from(new Set(data.map(d => d.victory_status)));

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.avg_rating))
            .range([0, this.size.width]);

        const y = d3.scaleLinear()
            .range([this.size.height, 0]);

        const color = d3.scaleOrdinal()
            .domain(outcomes)
            .range(d3.schemeSet2);

        svg.append("g")
            .attr("transform", `translate(0, ${this.size.height})`)
            .attr("class", "x-axis")
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        const area = d3.area()
            .x(d => x((d.x0 + d.x1) / 2))
            .y0(this.size.height)
            .y1(d => y(d.length))
            .curve(d3.curveMonotoneX);

        // Legend
        const legend = svg.append('g')
            .attr('transform', `translate(${this.size.width - 100}, 10)`);

        outcomes.forEach((label, i) => {
            legend.append('rect')
                .attr('x', 0).attr('y', i * 20)
                .attr('width', 12).attr('height', 12)
                .attr('fill', color(label));

            legend.append('text')
                .attr('x', 18).attr('y', i * 20 + 10)
                .text(label)
                .attr('font-size', '12px')
                .attr('alignment-baseline', 'middle');
        });

        const areaGroup = svg.append("g");

        // Graph
        const histogram = d3.histogram()
            .value(d => d.avg_rating)
            .domain(x.domain())
            .thresholds(x.ticks(40));

        const redraw = (minRating) => {
            const filteredData = data.filter(d => d.avg_rating >= minRating);

            const binsByOutcome = {};
            outcomes.forEach(outcome => {
                const subset = filteredData.filter(d => d.victory_status === outcome);
                binsByOutcome[outcome] = histogram(subset);
            });

            const maxY = d3.max(Object.values(binsByOutcome).flat(), bin => bin.length);
            y.domain([0, maxY]);
            svg.select(".y-axis").transition().call(d3.axisLeft(y));

            areaGroup.selectAll("path").remove();

            outcomes.forEach(outcome => {
                areaGroup.append("path")
                    .datum(binsByOutcome[outcome])
                    .attr("fill", color(outcome))
                    .attr("opacity", 0.5)
                    .attr("stroke", color(outcome))
                    .attr("stroke-width", 1.5)
                    .attr("d", area);
            });
        };

        redraw(0);
    }
}
