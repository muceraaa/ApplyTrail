import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { isLoggedIn, logout, currentUser } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `nav__link ${isActive ? 'nav__link--active' : ''}`

  const displayName = currentUser?.name?.trim() || 'User'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'U'

  return (
    <nav className="nav">
      <div className="nav__content">
        <Link to="/" className="nav__brand">
          ApplyTrail
        </Link>
        <div className="nav__actions">
          {!isLoggedIn && (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className="nav__cta">
                Sign up
              </NavLink>
            </>
          )}
          {isLoggedIn && (
            <>
              <NavLink to="/" className={linkClass}>
                Dashboard
              </NavLink>
              <div className="nav__user" title={displayName}>
                <div className="nav__avatar">{initials}</div>
              </div>
              <button className="nav__cta nav__logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
