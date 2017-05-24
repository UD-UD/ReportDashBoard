(function(){
    chartUtils.init().then(function(axisData){
        console.log(axisData);
        var dimensionList = document.querySelector('#dimention-list');
        var measureList = document.querySelector('#measure-list');
        for(var x_axis in axisData['xAxisLableName']){
            var li = document.createElement('li');
            li.setAttribute('class','dimention-class dimention');
            li.setAttribute('draggable','true');
            li.innerHTML=axisData['xAxisLableName'][x_axis];
            dimensionList.appendChild(li);
        }
         for(var y_axis in axisData['yAxisLableName']){
            var li = document.createElement('li');
            li.setAttribute('class','dimention-class measure');
            li.setAttribute('draggable','true');
            li.innerHTML=axisData['yAxisLableName'][y_axis];
            measureList.appendChild(li);
         }
    });

    var selectedDimension = document.querySelector('#selected-dimention-list');
    var seletedMeasure = document.querySelector('#selected-measure-list');

    var dimensionObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            updateChart();
        });    
    });

    var measurebserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            updateChart();
        });    
    });

    var config = { childList: true };

    dimensionObserver.observe(selectedDimension, config);
    measurebserver.observe(seletedMeasure, config);
    var selected =document.querySelector('#chart-select-bar');
    var chart = document.getElementById('chart-container');
    selected.addEventListener('change', updateChart, false);
    function updateChart(){
            var x_data =[];
            var y_data=[]

            for(var child in selectedDimension.childNodes){
                if(selectedDimension.childNodes[child].nodeType == 1){
                    x_data.push(selectedDimension.childNodes[child].textContent);
                }
            }

            for(var child in seletedMeasure.childNodes){
                if(seletedMeasure.childNodes[child].nodeType == 1){
                    y_data.push(seletedMeasure.childNodes[child].textContent);
                }
            }
            if(x_data.length > 0 && y_data.length > 0){
                chart.style.display='block';
                var typeOfchart =selected.options[selected.selectedIndex].value;
                console.log(typeOfchart);
                chartUtils.getChart(typeOfchart,x_data,y_data);
            }
            else{
                
                chart.style.display='none';
            }
    }
    
})();