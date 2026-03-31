import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { isLoggedIn, logout, currentUser } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const displayName = currentUser?.name?.trim() || 'User'
  const initials = useMemo(() => {
    return (
      displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('') || 'U'
    )
  }, [displayName])

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/login')
  }

  const goTo = (path) => {
    setOpen(false)
    navigate(path)
  }

  const renderIcon = () => {
    if (isLoggedIn) {
      return <div className="nav__avatar nav__avatar--user">{initials}</div>
    }
    return (
      <div className="nav__avatar nav__avatar--guest" aria-hidden="true">
        <span className="nav__avatar-person" />
      </div>
    )
  }

  const menuItems = isLoggedIn
    ? [
        { label: 'Dashboard', action: () => goTo('/') },
        { label: 'Tracker', action: () => goTo('/tracker') },
        { label: 'Logout', action: handleLogout }
      ]
    : [
        { label: 'Login', action: () => goTo('/login') },
        { label: 'Sign up', action: () => goTo('/signup') }
      ]

  return (
    <nav className="nav">
      <div className="nav__content">
        <Link to="/" className="nav__brand">
          ApplyTrail
        </Link>
        <div className="nav__profile" ref={menuRef}>
          <button
            type="button"
            className="nav__profile-btn"
            onClick={() => setOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {renderIcon()}
            {isLoggedIn && <span className="nav__profile-name">{displayName}</span>}
          </button>
          {open && (
            <div className="nav__menu" role="menu">
              {menuItems.map((item) => (
                <button key={item.label} className="nav__menu-item" onClick={item.action} role="menuitem">
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
