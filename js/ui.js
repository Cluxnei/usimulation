export class Ui {
    constructor(simulation) {
        this.simulation = simulation;
        this.element = document.getElementById('ui');
    }

    update() {
        this.simulationBufferFillPercentage = this.simulation.getBufferFillPercentage();
    }

    render() {
        this.element.innerHTML = this.buildHtml();
    }

    buildHtml() {
        return `
            Buffer: ${this.percentage(this.simulationBufferFillPercentage)}%<br>
        `;
    }

    percentage(percentage) {
        return percentage < 100 ? `0${percentage}` : percentage;
    }
}