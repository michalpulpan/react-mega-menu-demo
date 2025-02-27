import React, { useRef, useState, useEffect, RefObject } from 'react'
import PropTypes from 'prop-types'

// Components
import TopBar from './components/TopBar'
import Logo from './components/Logo'
import TopBarTitle from './components/TopBarTitle'
import Hamburger from './components/Hamburger'
import Nav from './components/Nav'
import MainList from './components/MainList'
import MegaList from './components/MegaList'
import MainNavItem from './components/MainNavItem'
import MainNavItemLink from './components/MainNavItemLink'
import NavItem from './components/NavItem'
import NavItemLink from './components/NavItemLink'
import NavList from './components/NavList'
import NavItemDescription from './components/NavItemDescription'

// State Machines
import { TMenuState, MenuStateMachine } from './utils/MenuStateMachine'

interface IMenu {
  logoImage: string
}

const Menu = ({ logoImage }: IMenu) => {
  const [megaTMenuState, setMegaTMenuState] = useState<TMenuState>('')
  const [subTMenuState, setSubTMenuState] = useState<TMenuState>('')
  const [subSubTMenuState, setSubSubTMenuState] = useState<TMenuState>('')
  const [activeMenus, setActiveMenus] = useState<string[]>([]) // array that captures the ids of active menus
  const [isMobile, setIsMobile] = useState(true) // array that captures the ids of active menus
  const wrapperRef = useRef<HTMLDivElement>(null) // used to detect clicks outside of component

  const viewportLarge = 1024

  const resetMenus = () => {
    // close all menus and empty activeMenus array
    setActiveMenus([])
    setSubTMenuState('closed')
    setSubSubTMenuState('closed')
  }

  const useOutsideAlerter = (ref: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      // Reset menu if clicked on outside of element
      const handleClickOutside = (e: MouseEvent | KeyboardEvent) => {
        if (
          ref.current &&
          e.target instanceof HTMLElement &&
          !ref.current.contains(e.target)
        ) {
          resetMenus()
        }
      }

      // Bind the event listener to both mouse and key events
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleClickOutside)
      return () => {
        // Unbind the event listener to clean up
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleClickOutside)
      }
    }, [ref])
  }

  const updateActiveMenus = (state: TMenuState, menuId: string) => {
    if (state === 'open') {
      // add menuId from activeMenus
      setActiveMenus([...activeMenus, menuId])
    } else if (state === 'closed') {
      // remove menuId from activeMenus
      setActiveMenus(activeMenus.filter((item) => item !== menuId))
    }
  }

  const toggleMegaMenu = (
    e: MouseEvent | KeyboardEvent | React.MouseEvent,
    menuId: string
  ) => {
    e.preventDefault()

    const nextState = MenuStateMachine(megaTMenuState)

    setMegaTMenuState(nextState)

    updateActiveMenus(nextState, menuId)

    if (megaTMenuState === 'open') {
      resetMenus()
    }
  }

  const toggleSubMenu = (
    e: MouseEvent | KeyboardEvent | React.MouseEvent | React.KeyboardEvent,
    menuId: string
  ) => {
    e.preventDefault()

    const nextState = MenuStateMachine(subTMenuState)

    setSubTMenuState(MenuStateMachine(subTMenuState))
    /*
      I haven't come up with single solution (yet) that takes care of
      opening and closing menus for both small and large screens, so for
      now I fork the logic based on viewport size.
      */
    if (!isMobile) {
      if (activeMenus.includes(menuId)) {
        // menu is already open, remove it from activeMenus to close it
        setActiveMenus([])
      } else {
        // menu is not yet active, add it to activeMenus to open it
        setActiveMenus([menuId])
      }
    } else {
      // remove menuId from activeMenus
      updateActiveMenus(nextState, menuId)
    }
  }

  const toggleSubSubMenu = (
    e: MouseEvent | KeyboardEvent | React.MouseEvent | React.KeyboardEvent,
    menuId: string
  ) => {
    e.preventDefault()

    const nextState = MenuStateMachine(subSubTMenuState)

    setSubSubTMenuState(MenuStateMachine(subSubTMenuState))

    updateActiveMenus(nextState, menuId)
  }

  useEffect(() => {
    if (window.innerWidth >= viewportLarge) {
      setIsMobile(false)
    } else {
      setIsMobile(true)
    }
  }, [activeMenus, isMobile])

  const doEscape = (e: KeyboardEvent | React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      resetMenus()
    }
  }

  const a11yClick = (e: KeyboardEvent | React.KeyboardEvent) => {
    const key = e.key || e.key
    if (key === ' ' || key === 'Enter') {
      return true
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', doEscape, false)

    return () => {
      document.removeEventListener('keydown', doEscape, false)
    }
  })

  useOutsideAlerter(wrapperRef) // create bindings for closing menu from outside events

  return (
    <div role="navigation" className="rmm__root" ref={wrapperRef}>
      <TopBar>
        {logoImage && (
          <Logo
            id="menuitem-logo"
            src={logoImage}
            alt="Your brand's logo"
            rel="home"
          />
        )}
        <TopBarTitle>Your Brand</TopBarTitle>
      </TopBar>
      <Hamburger
        label="Menu"
        state={megaTMenuState}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          toggleMegaMenu(e, 'nav-main')
        }
      />
      <Nav
        id="site-nav"
        activeState={megaTMenuState}
        ariaLabel="Main Navigation"
      >
        <MainList id="menubar-main" ariaLabel="Main Menu">
          <MainNavItem role="none" id="nav-home">
            <MainNavItemLink id="menuitem-home" role="menuitem" href="/">
              Home
            </MainNavItemLink>
          </MainNavItem>

          <MainNavItem id="nav-Mega-Menu" role="none" isChildren>
            <MainNavItemLink
              role="menuitem"
              id="menuitem-Mega-Menu"
              href="/?page=mega-menu"
              isForward
              isActive={!!activeMenus.includes('menu-Mega-Menu')}
              onClick={(e) => toggleSubMenu(e, 'menu-Mega-Menu')}
              // onMouseEnter={(e) => toggleSubMenu(e, 'menu-Mega-Menu')}
              onKeyDown={(e) =>
                a11yClick(e) && toggleSubMenu(e, 'menu-Mega-Menu')
              }
              ariaHaspopup="true"
              ariaControls="menu-Mega-Menu"
            >
              Mega Menu
            </MainNavItemLink>
            <MegaList
              id="menu-Mega-Menu"
              activeState={
                activeMenus.includes('menu-Mega-Menu') ? 'open' : 'closed'
              }
            >
              <NavItem id="nav-Mega-Menu-back" isHeading={true}>
                <NavItemLink
                  id="menuitem-Mega-Menu-back"
                  href="/?page=mega-menu"
                  onClick={(e) => toggleSubMenu(e, 'menu-Mega-Menu')}
                  onKeyDown={(e) =>
                    a11yClick(e) && toggleSubMenu(e, 'menu-Mega-Menu')
                  }
                  ariaControls="nav-main-Mega-Menu"
                  isBack
                >
                  Mega Menu
                </NavItemLink>
              </NavItem>
              <NavItem id="nav-Mega-Menu-Sub-menu-item-1" role="none">
                <NavItemLink
                  id="menuitem-Mega-Menu-Sub-menu-item-1"
                  role="menuitem"
                  href="/?page=sub-menu-item-1"
                  isHeading
                >
                  Sub menu item 1
                </NavItemLink>
                <NavItemDescription>
                  Single line description that accompanies link
                </NavItemDescription>
              </NavItem>
              <NavItem id="nav-Mega-Menu-Sub-menu-item-2" role="none">
                <NavItemLink
                  id="menuitem-Mega-Menu-Sub-menu-item-2"
                  role="menuitem"
                  href="/?page=sub-menu-item-2"
                  isHeading
                >
                  Sub menu item 2
                </NavItemLink>
                <NavItemDescription>
                  Double lined small description that accompanies link in the
                  React Mega Menu project
                </NavItemDescription>
              </NavItem>
              <NavItem id="nav-Mega-Menu-Sub-menu-item-3" role="none">
                <NavItemLink
                  id="menuitem-Mega-Menu-Sub-menu-item-3"
                  role="menuitem"
                  href="/?page=sub-menu-item-3"
                  isHeading
                  isForward
                  onClick={(e) =>
                    toggleSubSubMenu(e, 'menu-Mega-Menu-Sub-menu-item-3')
                  }
                  onKeyDown={(e) =>
                    a11yClick(e) &&
                    toggleSubSubMenu(e, 'menu-Mega-Menu-Sub-menu-item-3')
                  }
                  ariaHaspopup="true"
                  ariaControls="menu-Mega-Menu-Sub-menu-item-3"
                >
                  Sub menu item 3
                </NavItemLink>
                <NavItemDescription>
                  Three lined small description that accompanies link in the
                  React Mega Menu project. This maybe too much text? Who&lsquo;s
                  to say, really. We&lsquo;ll leave it to fate to decide.
                </NavItemDescription>
                <NavList
                  id="menu-Mega-Menu-Sub-menu-item-3"
                  role="menu"
                  isSub
                  isSubSub
                  activeState={
                    activeMenus.includes('menu-Mega-Menu-Sub-menu-item-3')
                      ? 'open'
                      : 'closed'
                  }
                  ariaLabelledby="menuitem-Mega-Menu-Sub-menu-item-3"
                >
                  <NavItem
                    id="nav-Mega-Menu-Sub-menu-item-3-back"
                    role="none"
                    isHeading
                  >
                    <NavItemLink
                      id="menuitem-Mega-Menu-Sub-menu-item-3-back"
                      role="menuitem"
                      href="/?page=sub-menu-item-3"
                      isBack
                      onClick={(e) =>
                        toggleSubSubMenu(e, 'menu-Mega-Menu-Sub-menu-item-3')
                      }
                      onKeyDown={(e) =>
                        a11yClick(e) &&
                        toggleSubSubMenu(e, 'menu-Mega-Menu-Sub-menu-item-3')
                      }
                      ariaHaspopup="true"
                      ariaControls="menu-Mega-Menu-Sub-menu-item-3"
                    >
                      Sub menu item 3
                    </NavItemLink>
                  </NavItem>
                  <NavItem id="nav-Mega-Menu-Sub-menu-item-3.1" role="none">
                    <NavItemLink
                      id="menuitem-Mega-Menu-Sub-menu-item-3.1"
                      role="menuitem"
                      href="/?page=sub-menu-item-3.1"
                    >
                      Sub menu item 3.1
                    </NavItemLink>
                    <NavItemDescription>
                      Single line description that accompanies link
                    </NavItemDescription>
                  </NavItem>
                  <NavItem id="nav-Mega-Menu-Sub-menu-item-3.2" role="none">
                    <NavItemLink
                      id="menuitem-Mega-Menu-Sub-menu-item-3.2"
                      role="menuitem"
                      href="/?page=sub-menu-item-3.2"
                    >
                      Sub menu item 3.2
                    </NavItemLink>
                    <NavItemDescription>
                      Double lined small description that accompanies link in
                      the React Mega Menu project
                    </NavItemDescription>
                  </NavItem>
                  <NavItem id="nav-Mega-Menu-Sub-menu-item-3.3" role="none">
                    <NavItemLink
                      id="menuitem-Mega-Menu-Sub-menu-item-3.3"
                      role="menuitem"
                      href="/?page=sub-menu-item-3.3"
                    >
                      Sub menu item 3.3
                    </NavItemLink>
                    <NavItemDescription>
                      Three lined small description that accompanies link in the
                      React Mega Menu project. This maybe too much text?
                      Who&lsquo;s to say, really. We&lsquo;ll leave it to fate
                      to decide.
                    </NavItemDescription>
                  </NavItem>
                </NavList>
              </NavItem>

              <NavItem id="nav-Mega-Menu-Sub-menu-item-4" role="none">
                <NavItemLink
                  id="menuitem-Mega-Menu-Sub-menu-item-4"
                  role="menuitem"
                  href="/?page=sub-menu-item-4"
                  isHeading
                  isForward
                  onClick={(e) =>
                    toggleSubSubMenu(e, 'menu-Mega-Menu-Sub-menu-item-4')
                  }
                  onKeyDown={(e) =>
                    a11yClick(e) &&
                    toggleSubSubMenu(e, 'menu-Mega-Menu-Sub-menu-item-4')
                  }
                  ariaHaspopup="true"
                  ariaControls="menu-Mega-Menu-Sub-menu-item-4"
                >
                  Sub menu item 4
                </NavItemLink>
                <NavItemDescription>
                  Three lined small description that accompanies link in the
                  React Mega Menu project. This maybe too much text? Who&lsqio;s
                  to say, really. We&lsquo;ll leave it to fate to decide.
                </NavItemDescription>
                <NavList
                  id="menu-Mega-Menu-Sub-menu-item-4"
                  role="menu"
                  isSub
                  isSubSub
                  activeState={
                    activeMenus.includes('menu-Mega-Menu-Sub-menu-item-4')
                      ? 'open'
                      : 'closed'
                  }
                  ariaLabelledby="menuitem-Mega-Menu-Sub-menu-item-4"
                >
                  <NavItem
                    id="nav-Mega-Menu-Sub-menu-item-4-back"
                    role="none"
                    isHeading
                  >
                    <NavItemLink
                      id="menuitem-Mega-Menu-Sub-menu-item-4-back"
                      role="menuitem"
                      href="/?page=sub-menu-item-4"
                      isBack
                      onClick={(e) =>
                        toggleSubSubMenu(e, 'menu-Mega-Menu-Sub-menu-item-4')
                      }
                      onKeyDown={(e) =>
                        a11yClick(e) &&
                        toggleSubSubMenu(e, 'menu-Mega-Menu-Sub-menu-item-4')
                      }
                      ariaHaspopup="true"
                      ariaControls="menu-Mega-Menu-Sub-menu-item-4"
                    >
                      Sub menu item 4
                    </NavItemLink>
                  </NavItem>
                  <NavItem id="nav-Mega-Menu-Sub-menu-item-4.1" role="none">
                    <NavItemLink
                      id="menuitem-Mega-Menu-Sub-menu-item-4.1"
                      role="menuitem"
                      href="/?page=sub-menu-item-4.1"
                    >
                      Sub menu item 4.1
                    </NavItemLink>
                  </NavItem>
                  <NavItem id="nav-Mega-Menu-Sub-menu-item-4.2" role="none">
                    <NavItemLink
                      id="menuitem-Mega-Menu-Sub-menu-item-4.2"
                      role="menuitem"
                      href="/?page=sub-menu-item-4.2"
                    >
                      Sub menu item 4.2
                    </NavItemLink>
                  </NavItem>
                  <NavItem id="nav-Mega-Menu-Sub-menu-item-4.3" role="none">
                    <NavItemLink
                      id="menuitem-Mega-Menu-Sub-menu-item-4.3"
                      role="menuitem"
                      href="/?page=sub-menu-item-4.3"
                    >
                      Sub menu item 4.3
                    </NavItemLink>
                  </NavItem>
                  <NavItem id="nav-Mega-Menu-Sub-menu-item-4.4" role="none">
                    <NavItemLink
                      id="menuitem-Mega-Menu-Sub-menu-item-4.4"
                      role="menuitem"
                      href="/?page=sub-menu-item-4.4"
                    >
                      Sub menu item 4.4
                    </NavItemLink>
                  </NavItem>
                  <NavItem id="nav-Mega-Menu-Sub-menu-item-4.5" role="none">
                    <NavItemLink
                      id="menuitem-Mega-Menu-Sub-menu-item-4.5"
                      role="menuitem"
                      href="/?page=sub-menu-item-4.5"
                    >
                      Sub menu item 4.5
                    </NavItemLink>
                  </NavItem>
                  <NavItem id="nav-Mega-Menu-Sub-menu-item-4.6" role="none">
                    <NavItemLink
                      id="menuitem-Mega-Menu-Sub-menu-item-4.6"
                      role="menuitem"
                      href="/?page=sub-menu-item-4.6"
                    >
                      Sub menu item 4.6
                    </NavItemLink>
                  </NavItem>
                </NavList>
              </NavItem>
            </MegaList>
          </MainNavItem>
          <MainNavItem id="nav-contact" role="none">
            <MainNavItemLink
              id="menuitem-contact"
              role="menuitem"
              href="/?page=contact"
            >
              Contact
            </MainNavItemLink>
          </MainNavItem>
        </MainList>
      </Nav>
    </div>
  )
}

export default Menu
