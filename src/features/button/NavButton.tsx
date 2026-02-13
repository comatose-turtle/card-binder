import { NavLink, useLocation, useNavigate } from "react-router";
import { MouseEventHandler, useCallback } from "react";

interface NavButtonProps {
  to: string,
  returnTo: string,
  children: React.ReactNode
}

export function NavButton({ to, returnTo, children } : NavButtonProps) {
  const location = useLocation();
  const isActuallyActive = to == location.pathname + location.search;
  const navigate = useNavigate();
  const onClick : MouseEventHandler<HTMLAnchorElement> = useCallback((e) => {
    navigate(returnTo);
    e.preventDefault();
  }, [navigate, returnTo]);
  const className = useCallback(({ isActive } : {isActive:boolean, isPending:boolean}) => {
    return (isActive && isActuallyActive ? "active" : "");
  }, [isActuallyActive]);

  const navProps = {
    to,
    onClick: isActuallyActive ? onClick : undefined,
    className
  }

  return (
    <NavLink {...navProps}>
      <button>{children}</button>
    </NavLink>
  );
}