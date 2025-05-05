class PieView {
    constructor(data, con, width, height) {
        this.fullData = data;
        this.con = con;
        this.width = width;
        this.height = height;
        con.color = d3.scaleOrdinal(["#e06767", "#88c3e3", "#f5f0c9"]);

        // Root container
        const root = con.root.append('div').style('display', 'flex').style('flex-direction', 'column').style('gap', '10px');

        // winner filter dropdown
        const select = root.append("select").attr("id", "winnerFilter");
        [
            { label: "All Results", value: "all" },
            { label: "White Wins", value: "white" },
            { label: "Black Wins", value: "black" },
            { label: "Draws", value: "draw" }
        ].forEach(option => {
            select.append("option")
                .attr("value", option.value)
                .text(option.label);
        });

        //chart and legend container
        this.svgContainer = root.append('div')
            .style('display', 'flex')
            .style('gap', '20px');

        this.svg = this.svgContainer
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        this.legend = this.svgContainer
            .append('div')
            .attr('class', 'legend')
            .style('display', 'flex')
            .style('flex-direction', 'column')
            .style('justify-content', 'center')
            .style('font-size', '14px');

        // Initial chart
        this.updateChart("all");

        // Hook up filter change
        select.on("change", (event) => {
            const winner = event.target.value;
            this.updateChart(winner);
        });
    }
    updateChart(winnerFilter) {
        const filtered = (winnerFilter === "all")
            ? this.fullData
            : this.fullData.filter(d => d.winner === winnerFilter);

        // Count wins by higher-rated vs lower-rated players
        let higherWins = 0;
        let lowerWins = 0;
        let draws = 0;

        filtered.forEach(d => {
            const whiteRating = +d.white_rating;
            const blackRating = +d.black_rating;
            const winner = d.winner;

            if (winner === "draw") {
                draws++;
            } else if (winner === "white" && whiteRating > blackRating) {
                higherWins++;
            } else if (winner === "white" && whiteRating < blackRating) {
                lowerWins++;
            } else if (winner === "black" && blackRating > whiteRating) {
                higherWins++;
            } else if (winner === "black" && blackRating < whiteRating) {
                lowerWins++;
            }
        });

        // Format data for pie chart
        const pieData = [
            { label: "Higher-rated Wins", value: higherWins },
            { label: "Lower-rated Wins", value: lowerWins },
            { label: "Draws", value: draws }
        ];

        // Create pie layout
        const pie = d3.pie().value(d => d.value)(pieData);
        const arc = d3.arc().innerRadius(0).outerRadius(Math.min(this.width, this.height) / 2 - 10);

        // Clear previous slices and legend
        this.svg.selectAll("*").remove();
        this.legend.selectAll("*").remove();

        // Draw pie slices
        this.svg.selectAll("path")
            .data(pie)
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => this.con.color(i))
            .attr("stroke", "black");

        // Legend
        this.legend.selectAll("div")
            .data(pieData)
            .enter()
            .append("div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("margin-bottom", "6px")
            .html((d, i) => `
                <div style="width: 12px; height: 12px; background:${this.con.color(i)}; margin-right: 8px;"></div>
                ${d.label}: ${d.value}
            `);
    }
}
