import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const navigate = useNavigate()
  const { signup, isLoggedIn } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true })
    }
  }, [isLoggedIn, navigate])

  const updateField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const { name, email, password, confirm } = form

  const isInvalid = useMemo(() => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) return true
    if (password !== confirm) return true
    return false
  }, [name, email, password, confirm])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      setError('All fields are required.')
      return
    }
    if (password !== confirm) {
      setError('Passwords must match.')
      return
    }
    signup({ name, email, password })
    navigate('/', { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">Create account</p>
        <h1 className="auth-title">Sign up</h1>
        <p className="auth-subtitle">Start tracking your applications faster.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={updateField('name')}
              placeholder="Amani Kariuki"
              required
            />
          </label>

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={updateField('email')}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={updateField('password')}
              placeholder="********"
              required
            />
          </label>

          <label className="auth-field">
            <span>Confirm password</span>
            <input
              type="password"
              value={confirm}
              onChange={updateField('confirm')}
              placeholder="********"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="primary fullwidth auth-submit" type="submit" disabled={isInvalid}>
            Create account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
