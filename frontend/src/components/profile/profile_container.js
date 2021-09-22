import Profile from './profile'
import {connect} from 'react-redux'
import {fetchUserPosts} from '../../actions/post_actions'
import {fetchUserOffers} from '../../actions/offer_actions'

const mSTP = state =>(
    {
        posts: state.posts,
        offers: state.offers,
        user: state.session.user
    }
)

const mDTP = dispatch =>(
    {
        fetchUserPosts: (userId) => dispatch(fetchUserPosts(userId)),
        fetchUserOffers: (userId) => dispatch(fetchUserOffers(userId))
    }
)

export default connect(mSTP,mDTP)(Profile)
