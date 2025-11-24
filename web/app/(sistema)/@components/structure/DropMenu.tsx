import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { GoChevronDown } from "react-icons/go";
// Definimos el tipo de las opciones, que pueden tener subopciones
type Option = {
  label: string;
  route: string;
};

type MenuCategory = {
  title: string;
  icon: ReactNode;
  options?: Option[];
  route?: string;
};

interface DropdownMenuProps {
  menuItems: MenuCategory[];
  ocultarSideBar?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  menuItems,
  ocultarSideBar,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (title: string) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  const [submenuHeight, setSubmenuHeight] = useState(0);
  const submenuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (openMenu && submenuRef.current) {
      setSubmenuHeight(submenuRef.current.scrollHeight);
    } else {
      setSubmenuHeight(0);
    }
  }, [openMenu]);

  return (
    <div className="space-y-2 overflow-hidden">
      {menuItems.map((menuItem, idx) => {
        const isOpen = openMenu === menuItem.title;
        const hasSubmenu = Array.isArray(menuItem.options);

        return (
          <div key={idx} className="relative">
            {hasSubmenu ? (
              <button
                type="button"
                onClick={() => toggleMenu(menuItem.title)}
                className="flex items-center justify-between w-full px-3 py-2 space-x-2 bg-transparent rounded-md outline-none min-h-10 text-white-main hover:bg-secondary-800"
              >
                <div
                  className={`flex items-center  w-full ${
                    ocultarSideBar ? "gap-0 justify-center" : "gap-2"
                  }`}
                >
                  <span className="text-primary-main">{menuItem.icon}</span>
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{
                      opacity: ocultarSideBar ? 0 : 1,
                      display: ocultarSideBar ? "none" : "block",
                    }}
                    exit={{ opacity: 1 }}
                    className="line-clamp-1"
                  >
                    {menuItem.title}
                  </motion.span>
                </div>
                {!ocultarSideBar && (

                <span
                  className={`ml-auto transform transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <GoChevronDown />
                </span>
                )}
              </button>
            ) : (
              <Link
                href={`/sistema/${menuItem.route}` || "/sistema"}
                className="flex items-center w-full px-3 py-2 space-x-2 bg-transparent rounded-md text-white-main hover:bg-secondary-800"
              >
                <span className="text-primary-main">{menuItem.icon}</span>
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: ocultarSideBar ? 0 : 1,
                    display: ocultarSideBar ? "none" : "block",
                  }}
                  exit={{ opacity: 1 }}
                  className="line-clamp-1"
                >
                  {menuItem.title}
                </motion.span>
              </Link>
            )}

            <AnimatePresence initial={false}>
              {hasSubmenu && isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: submenuHeight - 19 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 100,
                    damping: 25,
                  }}
                  className="absolute left-6 top-10 w-[1px] bg-primary-main"
                />
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {hasSubmenu && isOpen && (
                <motion.div
                  ref={submenuRef}
                  className="space-y-1 overflow-hidden"
                  initial={{ opacity: 0, maxHeight: 0 }}
                  animate={{ opacity: 1, maxHeight: submenuHeight }}
                  exit={{ opacity: 0, maxHeight: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 100,
                    damping: 25,
                  }}
                >
                  {menuItem.options?.map((option, i) => (
                    <motion.div
                      key={i}
                      className="pl-7"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.2,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }}
                    >
                      <Link
                        href={`/sistema/${option.route}`}
                        className="flex relative before:absolute before:w-[14px] before:right-[93%] before:top-0 before:bottom-0 before:my-auto before:h-[1px] before:bg-primary-main items-center px-4 py-2 space-x-2 rounded-md text-white-200 hover:text-white-main"
                      >
                        <span>{option.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default DropdownMenu;
