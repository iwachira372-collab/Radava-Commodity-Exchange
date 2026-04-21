import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import { useForm } from "react-hook-form";
// add to wallet
const AddtoWallet = ()=>{
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data=>{
        navigate('/top-up-wallet/'+data.amount)
    }
    return (
        <>
        <Header logo={true}/>
        <div className="add-to-wallet">
         <h2>Add Money to Wallet</h2>
         <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="">How much do you want to add to wallet?</label>
            <input
              className = {`${errors.amount?'error':''}`}
              {...register("amount", { required: true})}
            type="number" placeholder="KES 20,000.00" />
            <button className="btn-success2" type="submit">Proceed</button>
         </form>
        </div>
        </>
    )
}

export default AddtoWallet