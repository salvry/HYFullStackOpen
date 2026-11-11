import '../styles.css'
import { ErrorNotification, SuccessNotification } from './StyledComponents'

const Notification = ({ notification }) => {
  if(!notification){
    return null
  }
  if(notification.type==='error'){
    return(
      <ErrorNotification>{notification.message}</ErrorNotification>
    )
  }
  if(notification.type==='success'){
    return(
      <SuccessNotification>{notification.message}</SuccessNotification>
    )
  }
}

export default Notification