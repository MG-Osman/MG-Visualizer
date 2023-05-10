$(document).ready(function () {
  const chartTypeSelect = $("#chart-type");
  const chartTitleInput = $("#chart-title");
  const xAxisLabelInput = $("#x-axis-label");
  const yAxisLabelInput = $("#y-axis-label");
  const axisSettings = $("#axis-settings");
  const dataPointsContainer = $("#data-points");
  const addDataPointButton = $("#add-data-point");
  const createChartButton = $("#create-chart");
  const chartCanvas =$("#chart");

  let chart;

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getColors(length) {
    const colors = [];
    for (let i = 0; i < length; i++) {
      colors.push(getRandomColor());
    }
    return colors;
  }

  chartTypeSelect.on("change", function () {
    if (this.value === "pie") {
      axisSettings.addClass("d-none");
    } else {
      axisSettings.removeClass("d-none");
    }
  });

  addDataPointButton.on("click", function () {
    const dataPoint = $(`
      <div class="data-point">
        <input type="text" class="form-control form-control-sm" placeholder="Label">
        <input type="number" class="form-control form-control-sm" placeholder="Value">
        <button class="btn btn-danger btn-sm">Remove</button>
      </div>
    `);

    dataPoint.find("button").on("click", function () {
      dataPoint.remove();
    });

    dataPointsContainer.append(dataPoint);
  });

  createChartButton.on("click", function () {
    const chartType = chartTypeSelect.val();
    const chartTitle = chartTitleInput.val();
    const xAxisLabel = xAxisLabelInput.val();
    const yAxisLabel = yAxisLabelInput.val();

    const dataPoints = dataPointsContainer.find(".data-point");
    const labels = dataPoints.map(function () {
      return $(this).find("input[type='text']").val();
    }).get();
    const values = dataPoints.map(function () {
      return Number($(this).find("input[type='number']").val());
    }).get();

    if (chart) {
      chart.destroy();
    }

    const backgroundColors = getColors(labels.length);
    const borderColors = backgroundColors.map(color => color.replace(')', ', 1)').replace('(', 'a('));

    const chartConfiguration = {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: !!chartTitle,
            text: chartTitle
          }
        },
        scales: {
          x: {
            display: chartType !== 'pie',
            title: {
              display: !!xAxisLabel,
              text: xAxisLabel
            }
          },
          y: {
            display: chartType !== 'pie',
            title: {
              display: !!yAxisLabel,
              text: yAxisLabel
            },
            ticks: {
              beginAtZero: true
            }
          }
        }
      }
    };

    chart = new Chart(chartCanvas, chartConfiguration);
  });

  addDataPointButton.trigger("click");
});