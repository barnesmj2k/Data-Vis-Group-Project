class Control {
    constructor(data) {
        const width = 1000;
        const height = 750;

        this.root = d3.select('body').append('div')
            .attr('id', 'root')
            .style('width', `${width}px`)
            .style('height', `${height}px`);

        this.color = d3.scaleOrdinal(d3.schemeCategory10);

        this.pieView = new PieView(data, this, width / 2 - 100, height / 2 - 100);
        this.lineView = new LineView(data, this, width / 2, height / 2);
        this.scatterView = new ScatterView(data, this, width / 2 - 100, height / 2 - 100);
        this.densityView = new DensityView(data, this, width, height / 2);
    }
    filterWinner(winner) {
        this.pieView.updateChart(winner);
        this.densityView.redraw(this.densityView.minRange, winner);
    }
}

