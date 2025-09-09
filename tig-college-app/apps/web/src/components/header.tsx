""

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header
      className="bg-primary border-b border-red-600 px-6 py-4 flex items-center justify-between shadow-lg relative z-10 mt-4 ml-4 rounded-lg"
      style={{
        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
        backgroundColor: "rgb(230, 0, 0)",
      }}
    >
      <h1 className="text-2xl font-bold text-white">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="p-2 text-white hover:text-red-100 transition-colors duration-300">
          <i className="fa-solid fa-bell text-lg" />
        </button>

        {/* User Profile */}
        <button className="p-2 text-white hover:text-red-100 transition-colors duration-300">
          <i className="fa-solid fa-user-circle text-2xl" />
        </button>
      </div>
    </header>
  )
}