export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest dark:bg-dark-surface border-t border-outline-variant/10 mt-auto">
      <div className="flex justify-center items-center px-8 py-xl w-full max-w-container-max mx-auto">
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          © {new Date().getFullYear()} TubeFetch AI. High-utility precision.
        </p>
      </div>
    </footer>
  );
}
