import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { loginUser } from '../services/authService'
import axios from 'axios'
import { useAuth } from '../context/useAuth'

export default function LoginPage() {
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
        const user = await loginUser({ email, password })
        setUser(user)
        
        setMessage(`Login realizado com sucesso! Bem-vindo(a), ${user.name}.`)
        setEmail('')
        setPassword('')
    } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
            setError('E-mail ou senha incorretos.')
            } else {
            setError('Não foi possível realizar o login. Tente novamente.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

  return (
    <main className="min-h-screen bg-[#171411] px-4 py-12 text-[#f5f0e8]">
      <div className="mx-auto w-full max-w-md">
        <Link
            to="/"
            search={{
                search: '',
                category: '',
                artist: '',
                sort: 'newest',
                page: 1,
            }}
            className="text-sm text-orange-400 transition hover:text-orange-300"
            >
            ← Voltar para a loja
        </Link>

        <div className="mt-10 rounded-xl border border-[#39312a] bg-[#211d19] p-8">
          <h1 className="text-3xl font-bold tracking-wide">KURIO</h1>

          <p className="mt-2 text-sm text-[#b8ada1]">
            Entre na sua conta para continuar.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                E-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-[#494038] bg-[#171411] px-4 py-3 outline-none transition focus:border-orange-400"
                placeholder="voce@exemplo.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Senha
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-[#494038] bg-[#171411] px-4 py-3 outline-none transition focus:border-orange-400"
                placeholder="Digite sua senha"
              />
            </div>
            {error && (
            <p role="alert" className="text-sm text-red-400">
                {error}
            </p>
            )}

            {message && (
            <p role="status" className="text-sm text-green-400">
                {message}
            </p>
            )}

            
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-orange-500 px-4 py-3 font-semibold text-[#171411] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-[#b8ada1]">
            Ainda não tem conta?{' '}
            <Link
              to="/cadastro"
              className="font-medium text-orange-400 hover:text-orange-300"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}