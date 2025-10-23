export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
});

export const usePathname = () => '/diary';

export const useSearchParams = () => new URLSearchParams();

export const useParams = () => ({});
