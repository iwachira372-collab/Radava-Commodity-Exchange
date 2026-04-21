import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { getData } from '../api/api'
import { moneyFormat } from '../util/moneyFormat';
import moment from 'moment/moment';
import { AiOutlineFundView } from 'react-icons/ai';
import { Button } from '@mui/material';
import Modal from '../components/Modal';
import Receipt from '../components/Receipt';

const OrderHistory = ()=>{
  const [rows, setRows] = useState([])
    const columns = [
        { id: 'date', label: 'Date', minWidth: 170 },
        { id: 'product', label: 'Product', minWidth: 100 },
        {
          id: 'activity',
          label: 'Activity',
          minWidth: 170,
        //   format: (value) => value.toLocaleString('en-US'),
        },
        {
          id: 'quantity',
          label: 'Quantity',
          minWidth: 170,
        //   format: (value) => value.toLocaleString('en-US'),
        },
        {
          id: 'price',
          label: 'Price',
          minWidth: 170,
        //   format: (value) => value.toLocaleString('en-US'),
        },
        {
          id: 'total',
          label: 'Total',
          minWidth: 170,
          align: 'right',
          format: (value) => value.toFixed(2),
        },
        {
          id: 'status',
          label: 'Status',
          minWidth: 170
        },
        {
          id: 'tx',
          label: 'Receipt',
          minWidth: 170
        },
      ];
      
      function createData(name, code, population, size) {
        const density = population / size;
        return { name, code, population, size, density };
      }
      
      // const rows = [
      //   createData('India', 'IN', 1324171354, 3287263),
      // ];
      
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }
    const states = {
       0:'Pending',
       1:'Successful',
       2:'Failed',
       3:'Successful',
       4:'Processing Invoice',
    }
    const statescolor = {
       0:'red',
       1:'green',
       2:'red',
       3:'green',
       4:'gold'
    }
    useEffect(()=>{
       getData('order/orders')
       .then(res=>{
        if(res.data?.length){
          setRows(p=>{
            let rowData = []
            res.data.map((d)=>{
               rowData.push({
                date:moment(d.createdAt).format("MM/DD/YYYY h:mm a"),
                product:d.product_name,
                activity:d.type==0?'Buy':'Sell', 
                quantity:d.quantity,
                price:moneyFormat(d.price),
                quantity:d.quantity,
                total: moneyFormat(d.price*d.quantity),
                status:d.status,
                tx:d.tx
              })
            })
            return rowData  
          })
        }
       })
    },[])
    return (
        <>
       <Header logo={true}/>
       <Paper sx={{ width: '100%', overflow: 'hidden',margin:'20px', marginTop:'100px' }}>
       <h2 style={{margin:'20px',}}>My Trade History</h2>
      <TableContainer >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      let value = column.id=='status' ? states[row[column.id]] : row[column.id];
                      if(!value) value = 'N/A'
                      if(column.id=='tx' && value !='N/A') return (<a href = {'/receipt/'+value} target='_blank'>
                        {value?.slice(0, 6)+"..."+value?.slice(value.length-7, value.length-1)}
                      </a>)
                      return (
                        <TableCell key={column.id} align={column.align} style={{color:`${column.id=='status'?statescolor[row[column.id]]:''}`}}>
                          
                         {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </>
    )
}

export default OrderHistory