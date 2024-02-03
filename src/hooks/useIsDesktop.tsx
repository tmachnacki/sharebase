import { useMediaQuery } from "./useMediaQuery"; 

const useIsDesktop = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return { isDesktop }
}

export { useIsDesktop }