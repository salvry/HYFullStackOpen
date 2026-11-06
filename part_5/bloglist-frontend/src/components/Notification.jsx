import '../styles.css'

const Notification = ({ notification }) => {
  if(!notification){
    return null
  }
  return(
    <div className={notification.type==='success'?'success-notification':'error-notification'}>{notification.message}</div>
  )
}

export default Notification