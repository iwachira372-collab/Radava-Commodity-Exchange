import { Chart } from "react-google-charts";
import { getDataAdmin } from "../api/api"
import { useState, useEffect } from "react";
const ProductsChart = ()=>{
    const [data, setData] = useState([])
    useEffect(()=>{
        getDataAdmin('portfolio')
       .then(res=>{
        setData(p=>{
            const prt = [["Task", "Hours per Day"]]
            res.data?.map(pr=>(prt.push([pr.product,pr.qty])))
            console.log(prt)
            return prt
        })
       })
    },[])
   
    // const data = [
    //     ["Task", "Hours per Day"],
    //     ["Maize", 63],
    //     ["Rice", 13],
    //     ["Millet", 7],
    //     ["Sorghum", 17],
    //   ];
      const datadefault = [
        ["Produce", "Produce owned"],
        ["No data", 100],
        ["Maize", 0],
        ["Rice", 0],
        ["Millet", 0],
        ["Sorghum", 0],
      ];
      
      function drawChart() {
        if (data.length>0) {
            return <Chart
                chartType="PieChart"
                data={data}
                options={options}
                width={"100%"}
                height={"400px"}
                legendToggle
                />
        } else {
            return  <Chart
                chartType="PieChart"
                data={datadefault}
                width={"100%"}
                height={"400px"}
                legendToggle
                />
        }
      }
     const options = {
        title: "Portfolio Overview",
        titlePosition:'center',        
        legend:{position:'left',alignment:'center'},
      };
    return (
        <div className="chart" id="piechart">
           { drawChart()  } 
        </div>
    )
}

export default ProductsChart