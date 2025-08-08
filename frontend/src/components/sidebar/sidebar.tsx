"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { PanelLeftIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"

// You'll need to create these utility functions and components
import { cn } from "../../lib/utils"
import { Button } from "./ui/Button"
import {TooltipProvider} from "./ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)

    return () => {
      window.removeEventListener("resize", checkDevice)
    }
  }, [])

  return isMobile
}

interface SidebarProviderProps {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  animate?: boolean
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  animate,
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open],
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openMobile) {
        setOpenMobile(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [openMobile])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn("group/sidebar-wrapper flex min-h-screen w-full", className)}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

function DesktopSidebar({ className, children, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-white dark:bg-gray-900 w-[280px] shrink-0 border-r border-gray-200 dark:border-gray-800",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

function MobileSidebar({ className, children, ...props }: React.ComponentProps<"div">) {
  const { openMobile, setOpenMobile } = useSidebar()

  return (
    <>
      {/* Mobile Header with Menu Button */}
        <div className="h-16 px-4 flex flex-row md:hidden items-center justify-between bg-white dark:bg-gray-900 w-full border-b border-gray-200 dark:border-gray-800">
    <div className="flex justify-start">
        <button
            onClick={() => setOpenMobile(!openMobile)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        </button>
    </div>
</div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {openMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[999] md:hidden"
              onClick={() => setOpenMobile(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 z-[1000] flex flex-col shadow-xl md:hidden",
                className,
              )}
            >
              {/* Close Button */}
              <div className="flex justify-end items-center p-4 border-b border-gray-200 dark:border-gray-800">
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setOpenMobile(false)}
                >
                  <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface SidebarProps {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}

function SidebarComponent({ children, open, setOpen, animate }: SidebarProps) {
  return (
    <SidebarProvider open={open} onOpenChange={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  )
}

function SidebarBody({ className, children, ...props }: Omit<React.ComponentProps<typeof motion.div>, 'children'> & { children: React.ReactNode }) {
  return (
    <>
      <DesktopSidebar className={className} {...props}>
        {children}
      </DesktopSidebar>
      <MobileSidebar className={className}>
        {children}
      </MobileSidebar>
    </>
  )
}

interface SidebarLinkProps {
  link: {
    href: string
    label: string
    icon: React.ReactNode
    isActive?: boolean
  }
  className?: string
}

function SidebarLink({ link, className }: SidebarLinkProps) {
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
        link.isActive
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
        className,
      )}
    >
      <span className="flex-shrink-0">{link.icon}</span>
      <span className="truncate">{link.label}</span>
    </a>
  )
}

interface SidebarSectionProps {
  title?: string
  children: React.ReactNode
  className?: string
}

function SidebarSection({ title, children, className }: SidebarSectionProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {title && (
        <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export {
  SidebarComponent as Sidebar,
  SidebarProvider,
  SidebarBody,
  SidebarLink,
  SidebarSection,
  SidebarTrigger,
  useSidebar,
}