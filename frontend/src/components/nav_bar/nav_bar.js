import React from "react";
import { Link } from 'react-router-dom';
// import SearchBar from '../search_bar/search_bar';
import SearchBarContainer from '../search_bar/search_bar_container';

class NavBar extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const navRight = this.props.session.isAuthenticated ?
            <div className="navbar-right">
                <Link to={"/sell"}><button>Sell</button></Link>
                <Link to={'/home'}><button onClick={this.props.logout}>Sign out</button></Link>
                <Link to ={'/profile'}><i className="fas fa-user"></i></Link>
            </div> :
            <div className="navbar-right">
                <Link to={'/login'}><button>Login</button></Link>
                <Link to={'/signup'}><button>Sign Up</button></Link>
            </div>

        const { posts } = this.props;
        
        return (
           
                <nav className="navbar">
                    <div className="navbar-left">
                        <Link style={{ textDecoration: 'none' }} to={'/home'}><h1>Barter</h1></Link>
                        <Link style={{ color: "white" }} to={"/posts"}><p>Browse All</p></Link>
                        <SearchBarContainer />
                    </div>
                    {navRight}
                </nav>
            
        )
    }
}

export default NavBar;