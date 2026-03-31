import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoggedIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const fromPath = location.state?.from || '/'

  useEffect(() => {
    if (isLoggedIn) {
      navigate(fromPath, { replace: true })
    }
  }, [isLoggedIn, fromPath, navigate])

  const isInvalid = useMemo(() => !email.trim() || !password.trim(), [email, password])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (isInvalid) {
      setError('Please fill in both fields.')
      return
    }
    const result = login(email, password)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate(fromPath, { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">Welcome back</p>
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Access your dashboard and tracker.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="primary fullwidth auth-submit" type="submit" disabled={isInvalid}>
            Login
          </button>
        </form>

        <p className="auth-footer">
          No account yet? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
