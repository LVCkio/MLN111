import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Info,
  BookOpen,
  Layers,
  Book,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Bot,
} from "lucide-react";
import { NavLink as RouterNavLink } from "react-router-dom";
import endPoint from "@routes/routes";
import { useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

// Easing ngắn, mượt
const EASE = [0.2, 0, 0, 1];

// Cấu hình nav items với philosophy theme
const navItems = [
  { label: "Trang chủ", icon: Home, to: endPoint.HOMEPAGE },
  { label: "Giới thiệu", icon: Info, to: endPoint.ABOUT },
  {
    label: "Sách",
    icon: Book,
    to: "storybook",
  },
  { label: "Ôn tập", icon: Layers, to: endPoint.QUIZ },
  { label: "Phụ lục AI", icon: Bot, to: endPoint.AI_APPENDIX },
];

// Dropdown component
const EnhancedDropdown = ({ children, isOpen, onClose }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        event.stopPropagation(); //  chặn bubble sang slide
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 rounded-xl transition-all duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Dropdown Container */}
      <div
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2.5 w-80 z-50
          transition-all duration-500 ease-out origin-top
          ${isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
      >
        {/* Main dropdown card */}
        <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-slate-600/40 overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-300/5 via-transparent to-slate-800/20 pointer-events-none" />

          {/* Header */}
          <div className="relative px-4 py-2.5 border-b border-slate-600/40 bg-gradient-to-r from-slate-700/40 to-slate-800/40">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-amber-300/10 border border-amber-300/20">
                <BookOpen size={16} className="text-amber-300" />
              </div>
              <div>
                <h3 className="text-slate-100 font-semibold text-sm">
                  Mục lục
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Chọn chương để học
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative h-full">
            {children.map((item, i) => (
              <div
                key={i}
                className="group relative border-b border-slate-600/30 last:border-b-0 
          hover:bg-gradient-to-r hover:from-amber-300/8 hover:via-amber-300/4 hover:to-transparent 
          transition-all duration-300"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // ngăn click lan ra body → trigger slide
                    onClose();
                  }}
                  className="w-full text-left px-5 py-2.5 flex items-center gap-3
            hover:translate-x-0.5 transition-all duration-300"
                >
                  {/* Chapter number */}
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-md bg-slate-700 border border-slate-500 
              flex items-center justify-center text-[11px] font-bold text-slate-200 
              group-hover:bg-amber-300/10 group-hover:border-amber-300/30 
              group-hover:text-amber-100 transition-all duration-300"
                  >
                    {i + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-medium text-slate-100 
                group-hover:text-amber-200 transition-colors duration-300"
                    >
                      {item.label}
                    </h4>
                    {item.description && (
                      <p
                        className="text-xs text-slate-400 mt-0.5 
                  group-hover:text-slate-300 transition-colors duration-300"
                      >
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <ArrowRight
                    size={13}
                    className="flex-shrink-0 text-slate-400 
              group-hover:text-amber-400 group-hover:translate-x-0.5 
              transition-all duration-300"
                  />
                </button>

                {/* Hover effect line */}
                <div
                  className="absolute bottom-0 left-4 right-4 h-px 
            bg-gradient-to-r from-transparent via-amber-300/30 to-transparent 
            scale-x-0 group-hover:scale-x-100 
            transition-transform duration-500 origin-left"
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="relative px-4 py-2.5 bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-t border-slate-600/40">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center">
                <Book size={11} className="mr-1" />
                {children.length} chương
              </span>
              <span className="text-slate-400">Tín ngưỡng &amp; tôn giáo</span>
            </div>
          </div>
        </div>

        {/* Decorative arrow */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-7 border-r-7 border-b-7 border-transparent border-b-slate-900/95" />
      </div>
    </>
  );
};

const MobileNav = ({ isOpen, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ease-out ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/90 backdrop-blur-md
        transition-all duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`absolute right-0 top-0 h-full w-72 
        bg-gradient-to-b from-slate-900/95 via-slate-800/90 to-slate-900/95 
        backdrop-blur-xl border-l border-amber-200/10 shadow-2xl
        transform transition-all duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="relative pl-5 pr-2 py-4.5 border-b border-amber-200/20 bg-gradient-to-r from-slate-900/95 to-slate-900/90 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-400/5 pointer-events-none"></div>

          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-amber-100 text-xl font-semibold tracking-wide drop-shadow-md">
                CHỦ NGHĨA DUY VẬT BIỆN CHỨNG
              </h2>
              <p className="text-amber-200 text-sm italic font-[Georgia] mt-1.5 font-light drop-shadow-sm">
                Đa dạng, hòa hợp, thượng tôn pháp luật
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation(); // ngăn click lan ra body → trigger slide
                onClose();
              }}
              className="group p-2 rounded-xl hover:bg-amber-400/20 transition-all duration-300"
            >
              <X className="w-5 h-5 text-amber-100/90 group-hover:text-amber-200 transition-colors duration-300" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="h-[calc(100%-160px)] overflow-y-hidden py-4 px-2 space-y-2 custom-scrollbar">
          <nav className="flex flex-col space-y-1.5">
            {navItems.map((item, index) => {
              const isDropdown = !!item.children;
              const isOpenDrop = openDropdown === index;

              return (
                <div key={item.label ?? index}>
                  {/* Parent có con: dùng button để toggle, KHÔNG NavLink */}
                  {isDropdown ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(isOpenDrop ? null : index)
                        }
                        className="group flex w-full items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors text-slate-300 hover:text-amber-200 hover:bg-amber-400/8"
                        aria-expanded={isOpenDrop}
                        aria-controls={`m-dd-${index}`}
                      >
                        <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="font-serif tracking-wide">
                          {item.label}
                        </span>
                        <motion.span
                          initial={false}
                          animate={{ rotate: isOpenDrop ? 180 : 0 }}
                          transition={{ duration: 0.2, ease: EASE }}
                          className="ml-auto"
                        >
                          <ChevronDown
                            className={`w-4 h-4 ${isOpenDrop ? "text-amber-300" : "text-slate-400"
                              }`}
                          />
                        </motion.span>
                      </button>

                      {/* Dropdown children */}
                      <AnimatePresence initial={false}>
                        {isOpenDrop && (
                          <motion.div
                            id={`m-dd-${index}`}
                            key="dropdown"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: EASE }}
                            className="overflow-hidden will-change-[height,opacity]"
                            style={{ transform: "translateZ(0)" }}
                          >
                            <ul className="pl-2 py-1 space-y-1.5">
                              {item.children.map((child, i) => (
                                <li key={child.to ?? child.label ?? i}>
                                  <RouterNavLink
                                    to={child.to}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onClose();
                                    }}
                                    className="group block w-full text-left text-slate-300 hover:text-amber-200 transition-colors text-sm p-2 rounded-lg hover:bg-amber-400/8"
                                  >
                                    <div className="flex items-start gap-2.5">
                                      <div className="w-6 h-6 flex-shrink-0 rounded-md border border-slate-600 flex items-center justify-center text-xs font-semibold text-slate-400 group-hover:border-amber-300/40 group-hover:text-amber-100">
                                        {i + 1}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">
                                          {child.label}
                                        </div>
                                        {child.description && (
                                          <div className="text-xs text-slate-500 mt-0.5">
                                            {child.description}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </RouterNavLink>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    // Mục thường (không có con) → NavLink
                    <RouterNavLink
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) => {
                        const base =
                          "group flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors";
                        return isActive
                          ? `${base} bg-amber-400/10 text-amber-200`
                          : `${base} text-slate-300 hover:text-amber-200 hover:bg-amber-400/8`;
                      }}
                    >
                      <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span className="font-serif tracking-wide">
                        {item.label}
                      </span>
                    </RouterNavLink>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-300/20 to-transparent"></div>
          <p className="text-center text-xs text-amber-300/80 mt-3 italic font-[Georgia]">
            "Tôn trọng khác biệt, giữ vững đoàn kết"
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false); // mobile nav
  const [openDropdown, setOpenDropdown] = useState(null); // desktop dropdown
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isQuiz = location.pathname === endPoint.QUIZ;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let bgColor = "";

  if (isHome) {
    bgColor = scrolled ? "bg-black/30" : "bg-black/20";
  } else if (isQuiz) {
    bgColor = "bg-slate-900/60";
  } else {
    // các trang khác
    bgColor = scrolled ? "bg-black/30" : "bg-black/20";
  }

  return (
    <div className="">
      {/* Refined Desktop Header */}
      <header
        className={`fixed top-0 left-0 w-full z-40 backdrop-blur-md transition-colors duration-500 ease-out ${bgColor}`}
      >
        <div className="mx-auto pr-6 pl-8 py-1.5 flex items-center justify-between">
          {/* Sophisticated Logo */}
          <div className="group cursor-pointer">
            <a href="/">
              <h2
                className="text-amber-200/95 font-serif text-3xl font-bold tracking-wide 
      group-hover:text-amber-100 transition-all duration-300 hover:scale-105
      hover:drop-shadow-[0_0_2px_rgba(255,191,0,0.7)]"
              >
                CHỦ NGHĨA DUY VẬT BIỆN CHỨNG
              </h2>
            </a>
          </div>

          {/* Refined Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 bg-black/20 rounded-2xl px-1.5 py-1 backdrop-blur-sm">
            {navItems.map((item, index) => {
              const isDropdown = !!item.children;
              const isOpenDrop = openDropdown === index;

              return (
                <div key={index} className="relative">
                  <RouterNavLink
                    to={isDropdown ? "#" : item.to}
                    onClick={(e) => {
                      if (isDropdown) {
                        e.preventDefault();
                        setOpenDropdown(isOpenDrop ? null : index);
                      }
                    }}
                    className={({ isActive }) => {
                      const base =
                        "group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-400 ease-out overflow-hidden font-serif";

                      if (isDropdown) {
                        return `${base} text-slate-300 hover:text-amber-200`;
                      }

                      return isActive
                        ? `${base} bg-gradient-to-r from-amber-400/20 via-amber-300/15 to-amber-400/10 text-amber-100 shadow-inner`
                        : `${base} text-slate-300 hover:text-amber-200`;
                    }}
                  >
                    {/* Hover Background Effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-300/0 to-amber-400/0 
      group-hover:from-amber-400/10 group-hover:via-amber-300/8 group-hover:to-amber-400/5 
      transition-all duration-500 ease-out"
                    ></div>

                    {/* Flowing Underline */}

                    <div
                      className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-gradient-to-r from-amber-400 to-amber-600 
        group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out"
                    ></div>

                    <div className="relative z-10 flex items-center gap-2">
                      <item.icon
                        size={16}
                        className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                      />
                      <span className="tracking-wide">{item.label}</span>

                      {isDropdown && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 -ml-1 transition-all duration-300 ${isOpenDrop
                            ? "rotate-180 text-amber-300"
                            : "text-slate-400"
                            }`}
                        />
                      )}
                    </div>
                  </RouterNavLink>

                  {/* Dropdown */}
                  {isDropdown && (
                    <EnhancedDropdown
                      children={item.children}
                      isOpen={isOpenDrop}
                      onClose={() => setOpenDropdown(null)}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Elegant Mobile Menu Button */}
          <button
            className="lg:hidden group p-2.5 rounded-lg bg-black/20 backdrop-blur-sm 
            hover:bg-amber-400/10 transition-all duration-300 border border-gray-500/30 hover:border-amber-200/10"
            onClick={(e) => {
              e.stopPropagation(); // ngăn click lan ra body → trigger slide
              setIsOpen(true);
            }}
          >
            <Menu
              className="w-4.5 h-4.5 text-white   
            transition-all duration-300 group-hover:scale-110"
            />
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
