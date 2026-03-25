import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Bot, LockKeyhole, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/context'
import { Button, Card } from '../components/ui'
import { LocaleSwitcher } from '../components/ui/LocaleSwitcher'

const LOGIN_USERNAME = 'admin'
const LOGIN_PASSWORD = 'admin'

export default function LoginPage({ onLogin, isAuthenticated }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { messages } = useI18n()
  const [username, setUsername] = useState(LOGIN_USERNAME)
  const [password, setPassword] = useState(LOGIN_PASSWORD)
  const [errorMessage, setErrorMessage] = useState('')

  const redirectTarget = useMemo(() => {
    if (location.state?.from?.pathname && location.state.from.pathname !== '/login') {
      return location.state.from.pathname
    }
    return '/'
  }, [location.state])

  if (isAuthenticated) {
    return <Navigate to={redirectTarget} replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      setErrorMessage(messages.login.requiredError)
      return
    }

    if (username.trim() !== LOGIN_USERNAME || password.trim() !== LOGIN_PASSWORD) {
      setErrorMessage(messages.login.invalidError)
      return
    }

    setErrorMessage('')
    onLogin()
    navigate(redirectTarget, { replace: true })
  }

  return (
    <section
      data-testid="login-page"
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.14),transparent_24%),linear-gradient(180deg,#05070b_0%,#06090f_48%,#040506_100%)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-10 right-[-6rem] h-80 w-80 rounded-full bg-accent-pink/10 blur-3xl" />

      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <LocaleSwitcher />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_460px]">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs text-primary sm:text-sm"
            >
              <Sparkles className="h-4 w-4" />
              {messages.login.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.06 }}
              className="mt-6 text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-[4.3rem]"
            >
              {messages.login.title}
              <span className="block bg-gradient-to-r from-primary via-orange-200 to-sky-300 bg-clip-text text-transparent">
                {messages.login.titleAccent}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-6 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg"
            >
              {messages.login.description}
            </motion.p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {messages.login.modules.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.16 + index * 0.06 }}
                >
                  <Card className="h-full rounded-[1.6rem] border-white/8 bg-black/25 p-5">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-lg font-semibold text-white">{item.title}</div>
                    <div className="mt-2 text-sm leading-7 text-gray-400">{item.desc}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
          >
            <Card className="rounded-[2rem] border-white/10 bg-[linear-gradient(180deg,rgba(8,12,20,0.94),rgba(5,8,14,0.9))] p-7 shadow-[0_28px_80px_rgba(0,0,0,0.5)] sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.3rem] bg-gradient-to-br from-primary via-orange-300 to-sky-300 shadow-[0_12px_30px_rgba(249,115,22,0.28)]">
                  <Bot className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-primary/70">Robot Figma</div>
                  <div className="mt-1 text-2xl font-semibold text-white">{messages.login.cardTitle}</div>
                </div>
              </div>

              <div className="mt-6 rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-sm text-gray-300">{messages.login.accountTitle}</div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-primary">{messages.login.accountUser}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-gray-300">{messages.login.accountPassword}</span>
                </div>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="login-username" className="mb-2 block text-sm font-medium text-gray-300">
                    {messages.login.usernameLabel}
                  </label>
                  <div className="flex items-center gap-3 rounded-[1.15rem] border border-white/10 bg-[#080d16] px-4 py-3 focus-within:border-primary/35">
                    <UserRound className="h-4 w-4 text-gray-500" />
                    <input
                      id="login-username"
                      data-testid="login-username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                      placeholder={messages.login.usernamePlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-gray-300">
                    {messages.login.passwordLabel}
                  </label>
                  <div className="flex items-center gap-3 rounded-[1.15rem] border border-white/10 bg-[#080d16] px-4 py-3 focus-within:border-primary/35">
                    <LockKeyhole className="h-4 w-4 text-gray-500" />
                    <input
                      id="login-password"
                      data-testid="login-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                      placeholder={messages.login.passwordPlaceholder}
                    />
                  </div>
                </div>

                {errorMessage ? (
                  <div className="rounded-[1rem] border border-status-danger/20 bg-status-danger/10 px-4 py-3 text-sm text-red-200">
                    {errorMessage}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full rounded-[1.15rem]"
                  data-testid="login-submit"
                >
                  <span className="inline-flex items-center gap-2">
                    {messages.login.submit}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </form>

              <div className="mt-6 rounded-[1.25rem] border border-white/8 bg-black/25 p-4">
                <div className="text-[11px] uppercase tracking-[0.26em] text-primary/70">{messages.login.accessScope}</div>
                <div className="mt-3 space-y-2 text-sm leading-7 text-gray-400">
                  {messages.login.accessItems.map((item) => (
                    <div key={item}>{item}</div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
