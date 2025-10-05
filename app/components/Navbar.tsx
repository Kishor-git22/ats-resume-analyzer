import { Link, useLocation, useNavigate } from 'react-router';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="navbar flex items-center justify-between max-md:flex-col text-center gap-4 ">
      <Link to="/">
        <p className="text-2xl max-md:text-xl font-bold text-gradient">ATS RESUME ANALYZER</p>
      </Link>

      <div className="flex items-center gap-4">
        {location.pathname === '/upload' ? (
          <button onClick={() => navigate(-1)} className="primary-button w-fit">
            ← Back
          </button>
        ) : (
          <Link to="/upload" className="primary-button w-fit">
            Upload Your Resume
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
