import React from 'react';
import NavBar from '../nav_bar/nav_bar_container'
import OfferItem from './offer_item'
import {createItem,fetchOfferItems,updateItem,deleteItem} from '../../util/item_api_util'
import { Image } from 'cloudinary-react'
import { deleteOffer, updateOffer } from '../../util/offer_api_util'
import { randomInt } from '../../util/number_api_util'

class PostShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 0,
            items: [],
            itemsToRender : [],
            editingOffer: {offer_description: "", cash: ""},
            editingOfferId: null,
            deleteItemQueue:[],
            offersData : [],
            text: "",
            modal: [false,null] 
        }
        this.handleOfferSubmit = this.handleOfferSubmit.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.addItem=this.addItem.bind(this);
        this.addItemtoState=this.addItemtoState.bind(this);
        this.handleAccept=this.handleAccept.bind(this);
        this.handleEditOffer = this.handleEditOffer.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
    }

    

    componentDidMount() {
        const id = this.props.match.params.postid;
        this.props.fetchPost(id).then(
            (post) => this.props.fetchPostOffers(post.post.data._id).then(
                (offers) => {
                    for (let i = 0; i < offers.offers.data.length;i++){
                        const offerData = offers.offers.data[i];
                        let offerItemsData={};
                        offerItemsData.userId = offerData.user;
                        offerItemsData.cash = offerData.price;
                        offerItemsData.offer_description = offerData.text;
                        offerItemsData.offerId = offerData._id
                        fetchOfferItems(offerItemsData.offerId).then(
                            (items)=>{
                                const itemsData = items.data;
                                let addItemsData = {};
                                for(let j = 0; j<itemsData.length ; j++){
                                    addItemsData[itemsData[j]._id] = itemsData[j]
                                }
                                offerItemsData['items'] = addItemsData
                            }
                        ).then(
                            () => this.setState({ offersData: [...this.state.offersData, offerItemsData] })
                        )
                    }   
                }
            )
        )
    }

    handleCreateOffer(bool) {
        return e => {
            e.preventDefault()
            if(!bool){
                this.setState({ modal: [bool, null], items: [], itemsToRender: [], editingOffer: { offer_description: "", cash: "" }, price: 0, text: "" })
            }
            else{
                this.setState({ modal: [bool, "createOffer"] })
            }
        }
    }

    addItemtoState(item,idx){
        let items = [...this.state.items];
        items[idx] = item;
        this.setState( { items } );
    }

    handleEditSubmit(e){
        e.preventDefault();
        this.setState({ modal: [false, null] })
        const updatedOffer = {
            id: this.state.editingOfferId,
            user: this.props.currentUser.id,
            text: this.state.text,
            receiver: this.props.post.data.userId,
            price: parseInt(this.state.price),
            postId: this.props.post.data._id
        }
        updateOffer(updatedOffer).then(
            (offer)=> {
                const offerData = offer.data;
                let offerWithItems = {
                    userId: this.props.currentUser.id,
                    cash: offerData.price,
                    offer_description: offerData.text,
                    offerId: offerData._id,
                    items: []
                };
                return offerWithItems
            }
        ).then(
            async (offerWithItems)=> {
                let offer = Object.assign({},offerWithItems)
                for(let i=0;i< this.state.items.length;i++){
                    const item = this.state.items[i];
                    if(item !== null){
                        const itemFormatted = {
                            userId: this.props.currentUser.id,
                            offerId: offerWithItems.offerId,
                            name: item.name,
                            description: item.description,
                            imageUrl: item.imageUrl
                        }
                        if (item.id) {
                            await updateItem(item.id, itemFormatted).then(
                                (item) => offer.items.push(item.data)
                            )
                        }
                        else {
                            await createItem(itemFormatted).then(
                                (item) => offer.items.push(item.data)
                            )
                        }
                    }
                }
                for(let i=0;i<this.state.deleteItemQueue.length;i++){
                    deleteItem(this.state.deleteItemQueue[i])
                }
                let offersDataCopy = [...this.state.offersData]
                for(let i=0;i<offersDataCopy.length;i++){
                    if (offersDataCopy[i].offerId === this.state.editingOfferId){
                        offersDataCopy[i] = offer;
                        break;
                    }
                }
                console.log(offersDataCopy)
                this.setState({ offersData: offersDataCopy })
            }
        )
    }

    handleOfferSubmit(e){
        e.preventDefault();
        this.setState({ modal: [false,null] })
        const offerFormatted = {
            user: this.props.currentUser.id,
            text: this.state.text,
            receiver: this.props.post.data.userId,
            price: parseInt(this.state.price),
            postId: this.props.post.data._id
        }
        this.props.createOffer(offerFormatted).then(
            offer => {
                const offerData = offer.offer.data;
                let offerWithItems = { 
                    userId: this.props.currentUser.id,
                    cash: offerData.price,
                    offer_description: offerData.text,
                    offerId: offerData._id,
                    items: []
                };
                return offerWithItems
            }
        ).then(
            async (offerWithItems) => {
                let offer = Object.assign({},offerWithItems)
                for (let i = 0; i < this.state.items.length; i++) {
                    const item = this.state.items[i];
                    if(item !== null){
                        const itemFormatted = {
                            userId: this.props.currentUser.id,
                            offerId: offerWithItems.offerId,
                            name: item.name,
                            description: item.description,
                            imageUrl: item.imageUrl
                        }
                        await createItem(itemFormatted).then(
                            (item) => {
                                offer.items.push(item.data)
                            }
                        )
                    }
                }
                this.setState({offersData: [...this.state.offersData, offer], items:[]})
            }
        ) 
    }

    async addItem(props,index){
        const idx = this.state.itemsToRender.length
        if(props._reactName === "onClick"){
            this.setState({ itemsToRender: [...this.state.itemsToRender, <OfferItem idx={idx} addItemtoState={this.addItemtoState} removeItem={this.removeItem}/>] })
        }
        else{
            const offerItem = <OfferItem idx={index} addItemtoState={this.addItemtoState} item={props} removeItem={this.removeItem} />
            this.setState({ itemsToRender: [...this.state.itemsToRender, offerItem] })
            return offerItem
        }
    }

    handleChange(field) {
        return e => {
            e.preventDefault();
            this.setState({ [field]: e.currentTarget.value })
        }
    }

    handleAccept(e){
        deleteOffer(e.target.id).then(
            (offer) => {
                const offersdata = [...this.state.offersData];
                for(let i=0;i<this.state.offersData.length;i++){
                    if(offersdata[i].offerId === offer.data._id){
                        offersdata.splice(i,1);
                    }
                }
                this.setState({offersData: offersdata})
            }
        )
    }

    removeItem(idx) {
        let items= [...this.state.items];
        let itemsToRender = [...this.state.itemsToRender]
        if(items[idx].id){
            this.setState({
                deleteItemQueue: [...this.state.deleteItemQueue, items[idx].id]
            })
        }
        items[idx]=null;
        itemsToRender[idx]=null;
        this.setState({
            items: items,
            itemsToRender: itemsToRender
        });
    }

    handleEditOffer(bool) {
        return e => {
            e.preventDefault();
            if (!bool) {
                this.setState({ modal: [bool, null], items: [], itemsToRender: [], editingOffer: { offer_description: "", cash: "" },price:0,text:""})
                return;
            }
            let editingOffer;
            for(let i =0 ; i< this.state.offersData.length;i++){
                if (e.target.id === this.state.offersData[i].offerId){
                    editingOffer = this.state.offersData[i]
                }
            }
            this.setState({ text: editingOffer.offer_description, price: editingOffer.cash, editingOfferId: editingOffer.offerId},
                async ()=>{
                    const itemsArr= Object.values(editingOffer.items)
                    for (let i = 0; i < itemsArr.length; i++){
                        await this.addItem(itemsArr[i],i)
                    }
                    this.setState({modal:[bool, "editingOffer"]})
                }
            )
        }
    }

    render() {
        if (!this.props.post){
            return null;
        }
        const ownPost = this.props.post.data.userId === this.props.currentUser.id;
        let offersDataRender = []
        for(let i=0;i<this.state.offersData.length;i++){
            const offer = this.state.offersData[i];
            const items=Object.values(offer.items)
            let itemsdiv=[];
            for(let j=0;j<Object.keys(offer.items).length;j++){
                let item = items[j]
                const itemRender=
                <div className="dimensions">
                    <div className="item-details">
                        <h4>Item: {item.name}</h4>
                        {/* <p>{item.description}</p> */}
                    </div>
                    <Image cloudName="dhdeqhzvx" publicId={`https://res.cloudinary.com/dhdeqhzvx/image/upload/v1632404523/${item.imageUrl}`} />
                </div>
                itemsdiv.push(itemRender)
            }
            const ownOffer = offer.userId === this.props.currentUser.id;
            let offerDiv =
                <div className="offer-post">
                    {/* <p>User: {offer.user}</p> */}
                    <h4>Description: {offer.offer_description}</h4>
                    <h4>Cash offered: ${offer.cash}</h4>
                    {itemsdiv}
                    {ownPost ? <div className="decision">
                        <button onClick={this.handleAccept} id={offer.offerId} className="accept">Accept</button>
                        <button onClick={this.handleAccept} id={offer.offerId} className="decline">Decline</button>
                    </div> : null
                    }
                    {ownOffer ? <div className="decision">
                            <button onClick={this.handleEditOffer(true)} id={offer.offerId} className="decline">Edit</button>
                            <button onClick={this.handleAccept} id={offer.offerId} className="accept">Delete</button>
                        </div> : null
                    }
                </div>
            offersDataRender.push(offerDiv)
        }
        console.log(this.state)
        const formType = this.state.modal[1];
        return (
            <div>
                <NavBar/>
                <div className="post-container">
                    <Image cloudName="dhdeqhzvx" publicId={`https://res.cloudinary.com/dhdeqhzvx/image/upload/v1632404523/${this.props.post.data.imageUrl}`} />
                        <div className="post-info">
                            <div className="corner">Product Details</div>
                            <div className="row-container">
                                <div className="post-row">
                                <h3>Category:</h3><p>{this.props.post.data.category}</p>
                                </div>
                                <div className="post-row">
                                    <h3>Name:</h3><p>{this.props.post.data.itemName}</p>
                                </div>
                                <div className="post-row">
                                    <h3>Price:</h3><p>${this.props.post.data.price}</p>
                                </div>
                                <div className="post-row">
                                    <h3>Description:</h3><p>{this.props.post.data.description}</p>
                                </div>
                                {ownPost ? null : 
                                    <div>
                                        <button onClick={this.handleCreateOffer(true)}>Make an Offer</button>
                                        <button>Buy Now</button>
                                    </div>
                                }
                                {offersDataRender}
                            </div>
                        </div>
                </div>
                <div className={`modal-container ${this.state.modal[0] ? 'display_modal' : 'hide_modal'}`}>
                    <div className="createOffer">
                        <div className="close" onClick={this.handleCreateOffer(false)}>
                            &times;
                        </div>
                        <form onSubmit={formType === "createOffer" ? this.handleOfferSubmit  : this.handleEditSubmit}>
                            {formType === "createOffer" ? <h1>Make An Offer</h1> : <h1>Edit Offer</h1> }
                            <div className="cash-offer">
                                <label> Offer Description
                                    {
                                        formType === "createOffer" ? <input onChange={this.handleChange('text')} type="text" />:
                                        <input onChange={this.handleChange('text')} type="text" value = {this.state.text}/>
                                    }
                                </label>
                                <label> Cash Offer
                                    {
                                        formType === "createOffer" ? <input onChange={this.handleChange('price')} type="number" placeholder="$0" /> :
                                            <input onChange={this.handleChange('price')} type="number" value={this.state.price} />
                                    }                                    
                                </label>
                            <p onClick={this.addItem}><i class="fas fa-plus"></i> Add An Item</p>
                            {this.state.itemsToRender}
                            </div>
                            {formType === "createOffer" ? <button>Create Offer</button> : <button>Edit Offer</button>}
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default PostShow;