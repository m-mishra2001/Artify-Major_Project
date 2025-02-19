import React, { useEffect, useState } from "react";
import { firebase } from "../firebase/config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { TextInput, Button } from "react-native-paper";
import graphics from "../assets/circleVector_1.png";
import { Avatar } from "react-native-paper";
import mime from "mime";
import {
  clear_all_errors,
  loggedArtist,
  update_artist_profile,
} from "../slices/user-artist-Slice/artistSlice";

const EditProfile = ({ navigation, route }) => {
  const { artist, status } = useSelector((state) => state.artist);
  const url = artist.image && artist.image.url;

  const [userAvatar, setUserAvatar] = useState(url);
  const [name, setName] = useState(artist && artist.name);
  const [phone, setPhone] = useState(artist && artist.phone);
  const [bio, setBio] = useState(artist && artist.bio);

  const dispatch = useDispatch();

  const profileUpdateHandler = async () => {
    const myForm = new FormData();

    myForm.append("name", name);
    myForm.append("number", phone);
    myForm.append("bio", bio);
    myForm.append("avatar", {
      uri: userAvatar,
      type: mime.getType(userAvatar),
      name: userAvatar.split("/").pop(),
    });

    await dispatch(update_artist_profile(myForm));
    dispatch(loggedArtist());
  };

  const handleImage = () => {
    navigation.navigate("camera", {
      updateProfile: true,
    });
  };

  useEffect(() => {
    if (status && status.type === "error") {
      Alert.alert(status.message);
      dispatch(clear_all_errors());
    }
    if (status && status.type === "idle") {
      Alert.alert(status.message);
    }
    if (route.params) {
      if (route.params.image) {
        setUserAvatar(route.params.image);
      }
    }
  }, [status, route]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 0 }}>
        <Image
          source={graphics}
          style={{ width: 200, height: 150, margin: 0 }}
        />

        <View
          style={{
            alignItems: "center",
            height: 100,
            margin: 0,
            padding: 0,
            width: "100%",
            position: "absolute",
          }}
        >
          <Text style={styles.headerText}>Edit Profile</Text>
        </View>

        <View style={styles.profileView}>
          <TouchableOpacity>
            <Avatar.Image
              size={100}
              source={{ uri: userAvatar ? userAvatar : null }}
              style={{ marginLeft: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImage}>
            <Text style={{ color: "#900" }}>Change Photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <TextInput
            label="Name"
            name="name"
            value={name}
            onChangeText={(name) => setName(name)}
            style={styles.loginInput}
            underlineColor="transparent"
          />
          <TextInput
            label="Email"
            name="email"
            value={artist && artist.email}
            style={styles.loginInput}
            underlineColor="transparent"
            disabled
          />
          <TextInput
            label="Contact number"
            name="number"
            value={phone}
            keyboardType="numeric"
            onChangeText={(phone) => setPhone(phone)}
            style={styles.loginInput}
            underlineColor="transparent"
          />
          <TextInput
            label="Bio"
            name="bio"
            value={bio}
            onChangeText={(bio) => setBio(bio)}
            style={styles.loginInput}
            underlineColor="transparent"
          />
          <Button
            mode="contained"
            buttonColor="#363488"
            textColor="white"
            labelStyle={{
              fontSize: 16,
              textTransform: "uppercase",
              letterSpacing: 1,
              textAlign: "center",
            }}
            style={styles.btn}
            onPress={profileUpdateHandler}
          >
            Edit Profile
          </Button>
          <View style={{ marginTop: 20, height: 80 }}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F8FE",
    padding: 0,
  },
  headerText: {
    // fontFamily: 'Poppins',
    fontWeight: "bold",
    fontSize: 25,
    lineHeight: 48,
    color: "#363488",
    // left: 49,
    top: 70,
  },
  profileView: {
    marginTop: 10,
    width: "100%",
    height: "auto",
    alignItems: "center",
  },
  //   ProfileName:{
  //   fontWeight:"bold",
  //   fontSize:22,
  //   textAlign:"center",
  //   marginTop:"auto",
  //   marginBottom:"auto",
  //  marginLeft:20,
  //   marginRight:"auto",
  //   color:"#363488",
  //   },

  footer: {
    width: "100%",
    height: "auto",
    marginTop: "10%",
    backgroundColor: "white",
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    padding: 5,
    paddingTop: 25,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loginInput: {
    margin: "6%",
    height: 65,
    width: "88%",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  btn: {
    height: 60,
    width: "88%",
    marginTop: 10,
    borderRadius: 8,
  },
});
export default EditProfile;
