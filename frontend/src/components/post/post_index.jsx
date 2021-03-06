import React from 'react';
import NavBar from '../nav_bar/nav_bar_container';
import {Image} from 'cloudinary-react'
import { Link } from 'react-router-dom';

class PostIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = { posts: null};
    }

    render() {
        if(this.props.posts === null) {
            return <p>Null</p>;
        }
        const dir = this.props.action ? this.props.posts : this.props.posts.posts.data;
        return(
            <div className="post-index">
                <NavBar />
                <h1>All Listings</h1>
                <div className="posts-container">
                {
                    dir.map((post, idx) => (
                        <Link key ={idx} to={`/posts/${post._id}`}>
                            <div className="offer" >
                                <div className="item-description">
                                    <div className="block"> 
                                        <h3>Item: </h3><p key={idx}>{post.itemName}</p>
                                    </div>
                                    <div className="block"> 
                                        <h3>Category: </h3><p key={idx}>{post.category}</p>
                                    </div>
                                    <div className="block"> 
                                        <h3>Price: </h3><p key={idx}>${post.price}</p>
                                    </div>
                                    <div className="block"> 
                                        <h3>Description: </h3><p key={idx}>{post.description}</p>
                                    </div>
                                </div>
                                <div className="picture">
                                    <Image cloudName="dhdeqhzvx" publicId={`https://res.cloudinary.com/dhdeqhzvx/image/upload/v1632404523/${post.imageUrl}`} />
                                </div>
                            </div>
                        </Link>
                    ))
                }
                </div>
            </div>
        );
    }
}

export default PostIndex;