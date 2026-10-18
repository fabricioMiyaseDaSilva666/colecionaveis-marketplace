import { Link } from '@tanstack/react-router'
import { useAuth } from '../context/useAuth'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
      <Link
        to="/"
        search={{
          search: '',
          category: '',
          artist: '',
          sort: 'newest',
          page: 1,
        }}
        className="text-2xl font-bold tracking-widest text-white"
      >
        KURIO
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-white">
              Olá, {user.name}
            </span>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Sair
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black hover:bg-orange-400"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  )
}