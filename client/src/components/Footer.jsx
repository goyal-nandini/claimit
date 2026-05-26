import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#1E1B4B' }} className="text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/claimit-logo.png" alt="ClaimIt" className="h-20 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm text-indigo-200 leading-relaxed max-w-xs mb-5">
              A centralized campus lost & found platform helping students reconnect with their belongings.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://github.com/goyal-nandini"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-indigo-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                title="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/nandini-goyal29/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-indigo-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://x.com/nandini_goyal9"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-indigo-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                title="Twitter / X"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="mailto:nandinikartik1981@gmail.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-indigo-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                title="Email"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 4h20a1 1 0 011 1v14a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1zm10 7L3.5 6.5v11h17v-11L12 11zm0-2l8.5-4.5h-17L12 9z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links — only real routes */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Navigate</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link to="/" className="text-sm text-indigo-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/items" className="text-sm text-indigo-200 hover:text-white transition-colors">Lost & Found</Link></li>
              <li><Link to="/post-item" className="text-sm text-indigo-200 hover:text-white transition-colors">Report an Item</Link></li>
              <li><Link to="/my-posts" className="text-sm text-indigo-200 hover:text-white transition-colors">My Posts</Link></li>
              <li><Link to="/my-claims" className="text-sm text-indigo-200 hover:text-white transition-colors">My Claims</Link></li>
            </ul>
          </div>

          {/* Project info */}
          <div>
            <img
              src="https://plus.unsplash.com/premium_vector-1720891749159-82b9b2a383cd?q=80&w=1267&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Campus Lost and Found"
              className="w-100 object-contain rounded-2xl opacity-90"
            />
          </div>
          {/* <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">About</h4>
            <p className="text-sm text-indigo-200 leading-relaxed mb-3">
              ClaimIt is a full-stack MERN project built as part of a university portfolio.
            </p>
            <p className="text-sm text-indigo-200">
              Built with React, Node.js, MongoDB & Tailwind CSS.
            </p>
          </div> */}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-indigo-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-indigo-300">
            © {currentYear} ClaimIt. Built for campus communities.
          </p>
          <p className="text-xs text-indigo-400">
            Made with care and ☕ by Nandini Goyal.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;