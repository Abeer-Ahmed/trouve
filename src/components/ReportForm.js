import React, { Component } from 'react';
import { View, Text, Picker, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Constants, ImagePicker, Permissions } from 'expo';
import firebase from 'firebase';
import uuidv5 from 'uuid/v5';
import DatePicker from 'react-native-datepicker';

import { Card, CardSection, Button, Input } from './common';
import { reportUpdate, reportCreate } from '../actions';

class ReportForm extends Component {
  state = {
    image: null,
    uploading: false,
    uploadingSuccessMsg: '',
    invalidData: true,
    category: 'Bags'
  };

  componentWillMount(){
    this.props.category = 'Bags';
  }

  componentWillReceiveProps(nextProps, nextState){
    console.log("receiving props: ", nextProps.isClaimedItem);
  }

  componentWillUpdate(nextProps, nextState){
    if(nextProps.isFound)
      nextState.invalidData = !(nextProps.description && nextState.category && nextProps.location && nextProps.date &&
                                nextProps.image && nextProps.secretQuestion);
    else
      nextState.invalidData = !(nextProps.description && nextState.category && nextProps.location && nextProps.date);
  }

  onButtonPress(){
    const { description, category, location, date, image, isFound, secretQuestion, isTrouve } = this.props;

    this.props.reportCreate({ description, category: category || 'Bags', location, date, image, isFound, secretQuestion, isTrouve }); // because the Picker's default is just visual
  }

  renderUploadingSuccessMsg(){
    return (
      <Text style={{ marginLeft: 10, color: 'green' }}>
        { this.state.uploadingSuccessMsg }
      </Text>
    );
  }

  renderImagePicker(){
    if(this.props.isFound){
      return (
        <CardSection>
          <View style={ styles.containerStyle }>
            <Text style={ styles.labelStyle }>Photo</Text>
            <View style={ styles.inputStyle }>

              <TouchableOpacity
                onPress={ this._takePhoto }
              >
                <Image style={ styles.iconStyle } source={{ uri: 'https://img.icons8.com/ios/1600/screenshot-filled.png' }}/>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginLeft: 10 }}
                onPress={ this._pickImage }
              >
                <Image style={ styles.iconStyle } source={{ uri: 'https://img.icons8.com/ios/1600/xlarge-icons-filled.png' }}/>
              </TouchableOpacity>

              { this.renderUploadingSuccessMsg() }

            </View>
          </View>
        </CardSection>

      );
    }
  }

  renderSecretQuestion(){
    if(this.props.isFound){
      return (
        <CardSection>
          <Input
            label='Secret Question'
            placeholder='e.g. what time is the primary alarm set to?'
            value={ this.props.secretQuestion }
            onChangeText={ text => this.props.reportUpdate({ prop: 'secretQuestion', value: text })  }
            multiline={ true }
            numberOfLines={ 4 }
            large
          />
        </CardSection>
      );
    }
  }

  _pickImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _takePhoto = async () => {
    await Permissions.askAsync(Permissions.CAMERA);

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };


  _handleImagePicked = async pickerResult => {
    // in case the user previously uploaded sth, we need to make sure success msg is null
    this.setState({ uploadingSuccessMsg: '' });

    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        console.log('uri: ', pickerResult.uri);
        uploadUrl = await uploadImageAsync(pickerResult.uri);

        // update application state with the image url
        this.props.reportUpdate({ prop: 'image', value: uploadUrl });

        // this is redundant but I'm not gonna remove it :')
        this.setState({ image: uploadUrl });

        // update successs msg
        this.setState({ uploadingSuccessMsg: 'successfully uploaded ✓' });
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ uploading: false });
    }
  };

  getCurrentDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd < 10) {
        dd = '0' + dd
    }

    if(mm < 10) {
        mm = '0' + mm
    }

    today = mm + '-' + dd + '-' + yyyy;

    return today;
  }

  render() {
    console.log("Found? ", this.props.isFound); // sent from ItemList
    console.log("claimed? ", this.props.isClaimedItem); // sent from ItemList

    return (
      <Card>
        <CardSection>
          <Input
            label='Description'
            placeholder='blue digital wristwatch'
            value={ this.props.description }
            onChangeText={ text => this.props.reportUpdate({ prop: 'description', value: text })  }
          />
        </CardSection>

        <CardSection>
          <Text style={ styles.pickerLabelStyle }>
            Category
          </Text>
          <Picker
            selectedValue={ this.props.category }
            onValueChange={ text => {
              this.props.reportUpdate({ prop: 'category', value: text });
              this.setState({ category: text });
            }}
            style={ styles.pickerStyle }
          >
            <Picker.Item label='Bags' value='Bags'/>
            <Picker.Item label='Clothing' value='Clothing'/>
            <Picker.Item label='Documents' value='Documents'/>
            <Picker.Item label='Electronics' value='Electronics'/>
            <Picker.Item label='Jewelry' value='Jewelry'/>
            <Picker.Item label='Personal (others)' value='Others'/>
          </Picker>
        </CardSection>

        <CardSection>
          <Input
            label='Location'
            placeholder='main building, floor 2'
            value={ this.props.location }
            onChangeText={ (text) => this.props.reportUpdate({ prop: 'location', value: text }) }
          />
        </CardSection>

        <CardSection>
          <Text style={ styles.dateLabelStyle }> Date </Text>
          <DatePicker
            style={{ width: 200 }}
            date={ this.state.date }
            mode="date"
            placeholder="select date"
            format="MM-DD-YYYY"
            minDate="01-01-2018"
            maxDate={ this.getCurrentDate() }
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={ false }
            customStyles={{
              dateInput: styles.dateInputStyle,
              placeholderText: styles.placeholderTextStyle,
              dateText: styles.placeholderTextStyle
            }}
            onDateChange={(date) => {{
              this.setState({ date: date });
              this.props.reportUpdate({ prop: 'date', value: date });
            }}}
          />
          {/*<Input
            label='Date'
            placeholder='10/10/2018'
            value={ this.props.date }
            onChangeText={(text) => this.props.reportUpdate({ prop: 'date', value: text })}
          />*/}
        </CardSection>

        { this.renderSecretQuestion() }

        { this.renderImagePicker() }

        <CardSection>
          <Button onPress={ () => Actions.pop() }>
            Cancel
          </Button>
          <Button disabled={ this.state.invalidData } onPress={ this.onButtonPress.bind(this) }>
            Save
          </Button>
        </CardSection>
      </Card>
    );
  }
}

const styles = {
  pickerLabelStyle: {
    fontSize: 18,
    paddingLeft: 23,
    alignSelf: 'center'
  },
  pickerStyle: {
    flex: 1,
    height: 40,
    marginLeft: 29,
    alignSelf: 'center'
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 25,
    flex: 1
  },
  dateLabelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    // flex: 1,
    alignSelf: 'center'
  },
  dateInputStyle: {
    borderWidth: 0,
    // flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 65
  },
  placeholderTextStyle: {
    fontSize: 18
  },
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputStyle: {
    paddingRight: 5,
    paddingLeft: 5,
    flex: 2,
    flexDirection: 'row'
  },
  iconStyle: {
    width: 20,
    height: 20
  }
};

async function uploadImageAsync(uri) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = firebase
    .storage()
    .ref()
    .child(uuidv5(uri, uuidv5.URL));

  const snapshot = await ref.put(blob);

   let downloadURL = await ref.getDownloadURL().then((url) => {
    console.log('url: ', url);
    return url;
  });

  return downloadURL;
}

const mapStateToProps = (state) => {
  const { description, date, location, category, image, secretQuestion, isTrouve } = state.report;

  return {
    description,
    date,
    location,
    category,
    image,
    secretQuestion,
    isTrouve
  };
};

export default connect(mapStateToProps, { reportUpdate, reportCreate })(ReportForm);
