import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import Communications from 'react-native-communications';

import { Card, CardSection } from './common';
import { itemIsClaimed, markAsTrouve } from '../actions';

class Item extends Component {
  state = {
    isViewed: false,
    isMyItem: false,
    estTrouve: false,
    isClaim: false
  };

  // PROBLEM:
  // I don't change the app state when I set isClaimed or isMyItem to true so the claim option stays valid smh

  componentDidMount(){
    // console.log('my item?', this.props.isMyItem, this.props.item);
    // this.props.isMyItem is sent from ItemList and GeneralItemList to understand what page the user is requesting (his or general)
    // this.state.isMyItem reflects whether the item is for this logged user

    const { currentUser } = firebase.auth();
    const uid = currentUser.uid;
    // console.log(this.props.item);
    try {
      // console.log('a7la Mo wala eh', this.props.item.claimers);
      // if(this.props.item.claimers[uid])
      // console.log('claimers', this.props.item.claimers[uid]);
      if(this.props.item.claimers[uid]){
          this.setState({
            isClaim: true
          });
          // this.state = {...this.state, isClaim: true};
          // setInterval(()=>{
          //   this.forceUpdate();
          //   console.log(this.state);
          // },2000);
          console.log("We changed the sa");
      }
    } catch(error) {
      console.log('not a claimer of this item.', error);
    }

    try {
      if(this.props.item.uid == uid){
        this.setState({
          isMyItem: true
        });
      }
    } catch(error) {
      console.log('not owner of this item.', error);
    }

    try {
      if(this.props.item.isTrouve == true){
        this.setState({
          estTrouve: true
        });
      }
    } catch(error) {
      console.log(error);
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.isClaimedItem)
      this.setState({ isClaimed: true });
    // if(nextProps.hasOwnProperty('isClaimed')){
    //   const { isClaimed } = nextProps;
    //   this.setState({ isClaimed: isClaimed });
    //   console.log("seeeeeeeeeeeeeeeeeeeeeee me, ", this.state.isClaimed);
    // }
    // console.log('?', nextProps.isClaimed);
    // if(nextProps["isClaimed"] != undefined){
    //     console.log('rece props:', nextProps);
    //     const { isClaimed } = nextProps;
    //   this.setState({ isClaimed: isClaimed });
    // }
  }

  componentWillUpdate(nextProps, nextState){
    nextProps.isClaimedItem? nextState.isClaimed = true : nextState.isClaimed = false;
  }

  renderCallFinder(){
    const { currentUser } = firebase.auth();

    // if(this.props.item.uid == currentUser.uid){
      return (
        <View style={{ flex: 3, alignSelf: 'flex-start' }}>
          <TouchableOpacity
            onPress={() => Communications.phonecall(this.props.item.phone, true)}
          >
            <Image style={{ marginLeft: 5, marginTop: 5, height: 15, width: 15 }}
                   source={{ uri: 'https://image.flaticon.com/icons/png/128/33/33962.png' }}
            />
          </TouchableOpacity>
        </View>
      );
    // }
  }

  renderContactDetails(){
    if(!this.props.isMyItem){
      return (
        <CardSection>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={ { flex: 1 }, styles.textContainerStyle }>
              <Image style={{ height: 50, width: 50 }} source={{ uri: this.props.item.pictureURL }}/>
            </View>
            <View style={ { flex: 3 }, styles.textContainerStyle }>
              <Text style={ styles.titleStyle }>
                { this.props.item.firstName + ' ' + this.props.item.lastName }
              </Text>
              <Text style={{ paddingLeft: 5 }}>{ this.props.item.phone + ' '}</Text>
            </View>
            { this.renderCallFinder() }
            { this.renderClaim() }
          </View>
        </CardSection>
      );
    }
  }

  renderClaim(){
    // console.log("claimedItem: ", this.props.isClaimedItem, "estTrouve: ", this.state.estTrouve, ", isMyItem: ", this.state.isMyItem, ", isClaimed: ", this.state.isClaimed);
    switch (this.state.estTrouve) {
      case true:
        return (
          <View style={{ flex: 1 }}>
            <Text style={{ paddingTop: 5, color: '#007aff',fontSize: 12 }}>Trouvé</Text>
          </View>
        );
        break;
      case false:
        if(this.state.isMyItem){
          return (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={ () => {
                  this.setState({ estTrouve: true });
                  markAsTrouve({ id: this.props.item.id });
                } }
              >
                <Text style={{ paddingTop: 5, textDecorationLine: 'underline', fontSize: 12 }}>Mark as Trouvé</Text>
              </TouchableOpacity>
            </View>
          );
        } else if(!this.state.isMyItem && this.props.item.isFound){ // !ismyItem
          // console.log(this.state.isClaimed , " BEEEEEEE");
          if(this.state.isClaim || this.props.isClaimedItem){
            // this.setState({ isClaimed: true }); max update depth exceeded
            return (
              <View style={{ flex: 1 }}>
                <Text style={{ paddingTop: 5, color: 'green', fontSize: 11 }}>Claimed</Text> 
              </View>
            );
          } else { // !isClaimed
            return (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={ () => {
                    // this.setState({ isClaimed: true });
                    Actions.claimItemReportForm({ secretQuestion: this.props.item.secretQuestion, image: this.props.item.image });
                  }}
                >
                  <Text style={{ paddingTop: 5, textDecorationLine: 'underline', fontSize: 12 }}>Claim</Text>
                </TouchableOpacity>
              </View>
            );
          }
        }
    }
  }

  renderItemPhoto(){
    if(this.props.item.isFound && this.state.isViewed){
      return (
        <CardSection>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            { this.renderShowOrHide('Hide Image') }
            <Image style={{ height: 300, width: null, flex: 1 }} source={{ uri: this.props.item.image }}/>
          </View>
        </CardSection>
      );
    } else if(this.props.item.isFound && !this.state.isViewed){
      return (
        <CardSection>
          { this.renderShowOrHide('Show Image') }
        </CardSection>
      );
    }
  }

  renderShowOrHide(text){
    return (
      <TouchableOpacity onPress={ this.onViewPress.bind(this) }>
        <Text style={{ textDecorationLine: 'underline', marginLeft: 5 }}>{ text }</Text>
      </TouchableOpacity>
    );
  }

  onViewPress(){
    this.setState((prevState) => ({ isViewed: !prevState.isViewed }));
  }

  render() {

    const { currentUser } = firebase.auth();
    const uid = currentUser.uid;
    // console.log(this.props.item);
    try {
      if(this.props.item.claimers[uid]){
          // this.setState({
          //   isClaim: true
          // });
          this.state.isClaim = true;
      }
    } catch(error) {
      // console.log('not a claimer of this item.', error);
    }

    return (
      <Card style={{ margin: 5 }}>
      { this.renderContactDetails() }

        <CardSection style={{ borderRadius: 2 }}>
            <View style={ styles.textContainerStyle, { flex: 2 } }>
              <Text style={ styles.titleStyle }>
                { this.props.item.description }
              </Text>
              <Text style={ styles.normalTextStyle }>
                { this.props.item.location }
              </Text>
          </View>

          <View style={ styles.textContainerStyle, { flex: 1 } }>
            <Text style={ styles.normalTextStyle }>
              { this.props.item.category }
            </Text>
            <Text style={ styles.normalTextStyle }>
              { this.props.item.date }
            </Text>
          </View>

        </CardSection>

        { this.renderItemPhoto() }
      </Card>
    );
  }
}

const styles = {
  titleStyle: {
    fontSize: 16,
    paddingLeft: 5,
    fontWeight: 'bold'
  },
  textContainerStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  normalTextStyle: {
    fontSize: 16,
    paddingLeft: 5
  }
};

export default Item;
