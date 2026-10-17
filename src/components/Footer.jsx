import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link to="/" className="text-xl font-extrabold text-[#493747]">
          Clay<span className="text-pink-500">Bloom</span> 🌸
        </Link>

        <p className="text-sm text-[#998590]">
          Un petit pas aujourd'hui, une grande création demain. Pour une personne avec une finesse spécial 💚💛
        </p>

        <p className="text-xs text-[#998590]">
          © {new Date().getFullYear()} ClayBloom
        </p>
      </div>
    </footer>
  )
}