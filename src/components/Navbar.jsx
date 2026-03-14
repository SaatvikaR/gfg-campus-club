import { Link, useLocation } from "react-router-dom"
import "./Navbar.css"

function Navbar() {
  const location = useLocation()

  const links = [
    { path: "/",          label: "Home"      },
    { path: "/about",     label: "About"     },
    { path: "/events",    label: "Events"    },
    { path: "/resources", label: "Resources" },
    { path: "/community", label: "Community" },
    { path: "/blog",      label: "Blog"      },
    { path: "/contact",   label: "Contact"   },
    
  ]

  return (
    <nav className="navbar">
      {links.map(link => (
        <Link
          key={link.path}
          to={link.path}
          className={
            location.pathname === link.path
              ? "nav-link active"
              : link.path === "/ai"
              ? "nav-link nav-ai"
              : "nav-link"
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export default Navbar