const randomScalingFactor = function() {
  return Math.round(Math.random() * 100);
};
const airtableEndpoint = "https://api.airtable.com/v0/appNAgYvH5QlWur0u/Table%201?api_key=keyuyGOiuYZmOzFeV";
['可以', '無法'].map((item) => {
  $("#" + item).click(function() {
    if (window.myPie) {
      window.myPie.destroy()
      $("#spinner").html("<div class='uil-default-css uk-align-center uk-height-max-medium' style='transform:scale(0.6);'><div style='top:230px;left:93px;width:10px;height:10px;background:#BDBDBD;-webkit-transform:rotate(0deg) translate(0,-60px);transform:rotate(0deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:230px;left:93px;width:10px;height:10px;background:#BDBDBD;-webkit-transform:rotate(30deg) translate(0,-60px);transform:rotate(30deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:230px;left:93px;width:10px;height:10px;background:#BDBDBD;-webkit-transform:rotate(60deg) translate(0,-60px);transform:rotate(60deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:230px;left:93px;width:10px;height:10px;background:#BDBDBD;-webkit-transform:rotate(90deg) translate(0,-60px);transform:rotate(90deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:230px;left:93px;width:10px;height:10px;background:#BDBDBD;-webkit-transform:rotate(120deg) translate(0,-60px);transform:rotate(120deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:230px;left:93px;width:10px;height:10px;background:#BDBDBD;-webkit-transform:rotate(150deg) translate(0,-60px);transform:rotate(150deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:230px;left:93px;width:10px;height:10px;background:#BDBDBD;-webkit-transform:rotate(180deg) translate(0,-60px);transform:rotate(180deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:230px;left:93px;width:10px;height:10px;background:#BDBDBD;-webkit-transform:rotate(210deg) translate(0,-60px);transform:rotate(210deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:230px;left:93px;width:10px;height:10px;background:#BDBDBD;-webkit-transform:rotate(240deg) translate(0,-60px);transform:rotate(240deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:230px;left:93px;width:10px;height:10px;background:#BDBDBD;-webkit-transform:rotate(270deg) translate(0,-60px);transform:rotate(270deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:230px;left:93px;width:10px;height:10px;background:#BDBDBD;-webkit-transform:rotate(300deg) translate(0,-60px);transform:rotate(300deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:230px;left:93px;width:10px;height:10px;background:#BDBDBD;-webkit-transform:rotate(330deg) translate(0,-60px);transform:rotate(330deg) translate(0,-60px);border-radius:10px;position:absolute;'></div></div>")
      $("#noLength").html('')
      $("#yesLength").html('')
      $("#totalLength").html('')
    }
    return axios.post(airtableEndpoint, {
        "fields": {
          Answer: item
        }
      })
      .then(() => {
        return reloadData()
      })
  });
})

function reloadData() {
  if (!loading) {
    loading = true
    totalElements = []
    return getNextData()
      .then((elements) => {
        loading = false
        return redraw(totalElements)
      })
  }
  return
}
const promiseArray = []
let totalElements = []
let loading = false

function getNextData(offset) {
  let url = airtableEndpoint
  if (offset) {
    url = airtableEndpoint + '&offset=' + offset
  }
  return axios.get(url)
    .then((data) => {
      totalElements = totalElements.concat(data.data.records)
      if (data.data.offset) {
        return getNextData(data.data.offset)
      } else {
        return totalElements
      }
    })
}

function redraw(elements) {
  const records = _.countBy(_.map(elements, (record) => record.fields.Answer));
  const ctx = document.getElementById("chart-area").getContext("2d");
  const noLength = records['無法']
  const yesLength = records['可以']
  const total = (noLength + yesLength)
  $("#noLength").html(Math.round(noLength / total * 100) + '%')
  $("#yesLength").html(Math.round(yesLength / total * 100) + '%')
  $("#totalLength").html('共' + total + '次投票')
  $("#spinner").html('')
  const config = {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [
          noLength,
          yesLength,
        ],
        backgroundColor: [
          '#e94043',
          '#66BB6A',
        ],
        // label: 'Dataset 1'
      }]
    },
    options: {
      responsive: false,
      tooltips: false
    }
  };
  window.myPie = new Chart(ctx, config);
}
window.onload = function() {
  return reloadData()
};