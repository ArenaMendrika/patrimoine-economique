import { Link } from 'react-router-dom';

function Header() {
    return (
    <header className="p-2" style={{ backgroundColor: '#d8a62f' }}>
        <div className="d-flex">
        <div className="d-flex flex-row justify-content-around">
            <Link to="/patrimoine" className="btn"  style={{ fontSize: '1.5rem', color: 'white'}}>
                Patrimoine
            </Link>
            <Link to="/possession" className="btn"  style={{ fontSize: '1.5rem', color: 'white' }}>
                Possession
            </Link>
        </div>
        </div>
    </header>
    )
}

export default Header;