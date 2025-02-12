import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useWeb3 } from '../context/Web3Context'
import logo from './images/logo.jpg'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Header({ isLoggedIn }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { account, isConnected, disconnectWallet } = useWeb3()

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleNavigation = (href) => {
    setMobileMenuOpen(false)
    if (href === '#Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (href === '#About' || href === '#Values') {
      const section = document.getElementById(href.slice(1).toLowerCase())
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (href === '#Dashboard') {
      if (isLoggedIn || isConnected) {
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
    }
  }

  const navigation = [
    { name: 'Home', href: '#Home' },
    { name: 'About', href: '#About' },
    { name: 'Values', href: '#Values' },
    { name: 'Dashboard', href: '#Dashboard' },
  ]

  return (
    <header className="bg-[#1B1F3B] shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5 flex items-center">
            <p className="text-xl font-bold leading-7 text-[#6C63FF] tracking-wider">CrashChain</p>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#F5F5F5]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.href);
              }}
              className="text-sm font-semibold leading-6 text-[#F5F5F5] hover:text-[#FF6584] transition-colors duration-200"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
          {isConnected && (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-[#F5F5F5]">
                {formatAddress(account)}
              </span>
              <button
                onClick={disconnectWallet}
                className="text-sm font-medium text-red-600 bg-red-100 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
              >
                Disconnect
              </button>
            </div>
          )}
          {!isConnected && !isLoggedIn && (
            <a href="/login" className="text-sm font-semibold leading-6 text-[#F5F5F5] hover:text-[#FF6584] transition-colors duration-200">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-[#1B1F3B] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5 flex items-center">
              <img src={logo} alt="CrashChain Logo" className="h-10 mr-3" />
              <p className="text-xl font-bold leading-7 text-[#6C63FF]">CrashChain</p>
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-[#F5F5F5]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(item.href);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#F5F5F5] hover:bg-gray-50 transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                {isConnected ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-[#F5F5F5]">
                      {formatAddress(account)}
                    </p>
                    <button
                      onClick={disconnectWallet}
                      className="text-sm font-medium text-red-600 bg-red-100 px-3 py-2 rounded-lg hover:bg-red-200 w-full transition-colors duration-200"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : !isLoggedIn && (
                  <a
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#F5F5F5] hover:bg-gray-50 transition-colors duration-200"
                  >
                    Log in
                  </a>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}