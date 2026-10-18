import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { registerUser } from '../services/authService'
import axios from 'axios'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
        setError('As senhas não coincidem.')
        return
    }

    setIsSubmitting(true)

    try {
        const user = await registerUser({
        name,
        email,
        password,
        })

        setMessage(`Conta criada com sucesso! Bem-vindo(a), ${user.name}.`)
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError('Este e-mail já está cadastrado.')
        } else {
        setError('Não foi possível criar a conta. Tente novamente.')
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
            Crie sua conta para começar sua coleção.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-md border border-[#494038] bg-[#171411] px-4 py-3 outline-none transition focus:border-orange-400"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
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
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-[#494038] bg-[#171411] px-4 py-3 outline-none transition focus:border-orange-400"
                placeholder="Mínimo de 6 caracteres"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-md border border-[#494038] bg-[#171411] px-4 py-3 outline-none transition focus:border-orange-400"
                placeholder="Digite a senha novamente"
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
                {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-[#b8ada1]">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-medium text-orange-400 hover:text-orange-300"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}