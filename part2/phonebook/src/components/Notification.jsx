const Notification = ({ notification }) => {
  if (notification === null || notification.message === null) {
    return null
  }

  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

export default Notification