import style from './PopUp.module.css'

const PopUp = ({children, status, color}) => {


    if(status)
    return (
    <>
        <div className={style.popup} style={{backgroundColor:color}}>
            {children}
        </div>
    </>
  )
}

export default PopUp
