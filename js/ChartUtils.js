var ChartFactory = function(){

    this.chartfactory = function(type,data){
        
        var JsonDataSource = {};
            JsonDataSource.chart = {
                caption: data.chartDescription['caption'],
                subCaption: data.chartDescription['subCaption'],
                xAxisname: data.chartDescription['xAxisname'],
                yAxisName: data.chartDescription['yAxisName'],
                theme: data.chartDescription['theme'] 
            }
            JsonDataSource.categories = [];
            JsonDataSource.categories = data.categories;
            JsonDataSource.dataset = data.dataset;
            var JsonData = JSON.stringify(JsonDataSource);
        if(type === 'barChart'){
            return new FusionCharts({
                            type: 'msbar2d',
                             renderAt: data.chartDescription['renderAt'],
                            width: data.chartDescription['width'],
                            height: data.chartDescription['height'],
                            dataFormat: data.chartDescription['dataFormat'],
                            dataSource: JsonDataSource
                        });
        }
        else if(type === 'columnChart'){
               return new FusionCharts({
                            type: 'mscolumn2d',
                             renderAt: data.chartDescription['renderAt'],
                            width: data.chartDescription['width'],
                            height: data.chartDescription['height'],
                            dataFormat: data.chartDescription['dataFormat'],
                            dataSource: JsonDataSource
                        });
        }
        else if(type === 'pieChart'){
            var pieData = formatDataForPie(data);
            return new FusionCharts({
                type: 'multilevelpie',
                renderAt: data.chartDescription['renderAt'],
                width: data.chartDescription['width'],
                height: data.chartDescription['height'],
                dataFormat: data.chartDescription['dataFormat'],
                dataSource: {
                    chart: {
                            caption: data.chartDescription['caption'],
                            subCaption: data.chartDescription['subCaption'],
                            showPlotBorder: "1",
                            piefillalpha: "60",
                            pieborderthickness: "2",
                            hoverfillcolor: "#CCCCCC",
                            piebordercolor: "#FFFFFF",
                            numberprefix: "$",
                            plottooltext: "$label, $$valueK",// $percentValue",
                            theme: "fint"
                        },
                    category: [
                            {
                                "label":  data.chartDescription['caption'],
                                "color": "#ffffff",
                                //"value": "150",
                                "category":pieData
                            }]
                        } 
                    });
        }
    }

    function formatDataForPie(data){
        var pieCategories = data.categories;
        var pieSet = data.dataset;
        var finalPieData = [];
        var catagoryPointer = 0;
        for(var index in pieCategories[0].category){
                var pieDataset =[];
                for(var id in pieSet){
                    pieDataset.push({
                        'label': pieSet[id]['seriesname'],
                        'color': "#33ccff",
                        'value': pieSet[id]['data'][index]['value']
                    });
                }
                finalPieData.push({
                    'label': pieCategories[0].category[index]['label'],
                    'color': "#f8bd19",
                    'category':pieDataset
                });
                catagoryPointer++;
        }

        return finalPieData;
        
    }
}

var chartProperties = {
        type: '',
        renderAt: 'chart-container',
        width: '650',
        height: '400',
        dataFormat: 'json',
        caption: "Quarterly Revenue",
        subCaption: "Harry's SuperMart",
        xAxisname: "Dimensions",
        yAxisName: "Revenues (In USD)",
        theme: "fint"
};

var chartUtils = (function(){

    const dataSourcePath = "https://api.github.com/users/mralexgray/repos";
    var formattedData ={};
    var unFormaterData ={};
    var charProperties = chartProperties;
    function getDataSet(){
        return new Promise(function(resolve,reject){
            /*var xhr = new XMLHttpRequest();
            xhr.open('GET',dataSourcePath);
            xhr.onload = function (response){
                if(xhr.status == 200){
                    resolve(xhr.response);
                }
                else
                {
                    reject(Error(xhr.statusText));
                }
            }
            xhr.onerror = function(){
                reject(Error("Network error"));
            }

            xhr.send();*/
            resolve(testData);
        });
    }

    function init(){
        return getDataSet()
                .then(function(data){
                         formattedData.chartDataSource  = {};
                         formattedData.xAxisLableName = [];
                        formattedData.yAxisLableName = [];
                        //unFormaterData = JSON.parse(data);  // <- change this to data when serving via resp api data calls
                       unFormaterData = testData;
                       formattedData.chartDescription = {
                            caption : charProperties.caption,
                            subCaption : charProperties.subCaption,
                            xAxisname : charProperties.xAxisname,
                            yAxisName : charProperties.yAxisName,
                            theme : charProperties.theme,
                            type: "",
                            renderAt: charProperties.renderAt,
                            width: charProperties.width,
                            height: charProperties.height,
                            dataFormat: charProperties.dataFormat
                        }
                        for(var description in unFormaterData){
                            formattedData.xAxisLableName.push(description);
                            for(var value in unFormaterData[description]){
                                if(formattedData.yAxisLableName[value] === undefined){
                                    formattedData.yAxisLableName.push(Object.keys(unFormaterData[description][value])[0]);
                                }
                            }
                        }
                    })
                .catch(function (error){console.log(error)});
    }

    function prepareChartData(xData,YData){
        var category = [];
        var dataset = [];
        for(var xkey in xData){
            category.push({ 'label' : xData[xkey] });
        }

        for(var ykey in YData){
            var data = [];
            for(var zkey in xData ){
                if (unFormaterData[xData[zkey]] !== undefined) {
                    for (var id in unFormaterData[xData[zkey]]) {
                        if (unFormaterData[xData[zkey]][id].hasOwnProperty(YData[ykey])) {
                            data.push({
                                'value': unFormaterData[xData[zkey]][id][YData[ykey]]
                            });
                        }
                    }
                }
            }
            dataset.push({ 
                'seriesname': YData[ykey],
                 'initiallyhidden': "",
                 'data' : data
            });
        }
        formattedData.categories=[];
        formattedData.categories.push({'category' :category});
        formattedData.dataset = dataset;
    }

    function getChartByType(type,x_data,y_data){
      
            var factory = new ChartFactory();
            console.log("init complete");
            prepareChartData(x_data,y_data);
            var k = factory.chartfactory(type,formattedData);
            k.render();
            console.log(k);
            return k;
    }

    return {
        getChart : function(type,x_data,y_data){
            return getChartByType(type,x_data,y_data);
        },
        init :async function(){
            var axisData ={};
            await init().then(function(){
                axisData = {
                    'xAxisLableName' : formattedData.xAxisLableName,
                    'yAxisLableName' : formattedData.yAxisLableName
                }
            });
            return axisData;
        }
    }
    
})();

var testData = {
    "Brand" : [
        { "Revenue" : "1000" },
        { "Review" : "1200" },
        { "Retail" :"1500"},
        { "Sales" : "8000"},
        { "Order" :"6000"}
        ],
     "Catagory" : [
        { "Revenue" : "3000" },
        { "Review" : "1500" },
        { "Retail" :"1800"},
        { "Sales" : "8300"},
        { "Order" :"6200"}
        ],
     "BestSellers" : [
        { "Revenue" : "2000" },
        { "Review" : "1600" },
        { "Retail" :"1800"},
        { "Sales" : "8600"},
        { "Order" :"5000"}
        ],
     "PoorPerformers" : [
        { "Revenue" : "9000" },
        { "Review" : "12000" },
        { "Retail" :"1300"},
        { "Sales" : "800"},
        { "Order" :"6500"}
        ]
};

    
   

