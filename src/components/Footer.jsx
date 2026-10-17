import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-white dark:border-[#3d2f47] dark:bg-[#2b2438]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link to="/" className="text-xl font-extrabold text-[#493747] dark:text-[#f7e8ef]">
          Clay<span className="text-pink-500 dark:text-pink-400">Bloom</span> 🌸
        </Link>

        <p className="text-sm text-[#998590] dark:text-[#c4b5c2]">
          Un petit pas aujourd'hui, une grande création demain. Pour une personne avec une finesse spécial 💚💛
        </p>

        <p className="text-xs text-[#998590] dark:text-[#c4b5c2]">
          © {new Date().getFullYear()} ClayBloom
        </p>
      </div>
    </footer>
  )
}