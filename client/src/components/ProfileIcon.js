const ProfileIcon = ({ name, style }) => {
  // Ensure the name exists and grab the first letter
  const firstLetter = name?.charAt(0).toUpperCase() || 'N'  // Fallback to 'N' if no name is passed

  const getColorForLetter = (letter) => {
    if ('ABC'.includes(letter)) return '#00cc00'
    if ('DEF'.includes(letter)) return '#004d00'
    if ('GHI'.includes(letter)) return '#0000cc'
    if ('JKL'.includes(letter)) return '#003399'
    if ('MNO'.includes(letter)) return '#990000'
    if ('PQR'.includes(letter)) return '#6600ff'
    if ('STU'.includes(letter)) return '#662200'
    if ('VWXYZ'.includes(letter)) return '#993333'
    return '#0263c4' // fallback
  }

  const iconStyle = {
    backgroundColor: getColorForLetter(firstLetter),
    color: 'white',
    borderRadius: '50%',
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
  console.log(firstLetter)
  return (
    <div style={{ ...iconStyle, ...style }}>
      {firstLetter}
    </div>
  )
}

export default ProfileIcon
