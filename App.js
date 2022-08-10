import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capPhoto, setCapPhoto] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>Acesso negado!</Text>;
  }

  async function takePic() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapPhoto(data.uri);
      setOpen(true);
      console.log(data);
    }
  }

  async function savePic() {
    const asset = await MediaLibrary.createAssetAsync(capPhoto)
      .then(() => {
        alert("Foto salva com sucesso.");
      })
      .catch((error) => {
        console.log("err", error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={{ flex: 1 }} type={type} ref={camRef}>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        >
        </View>
      </Camera>

      <View style={styles.button}>
        <TouchableOpacity  onPress={takePic}>
          <Image style={{ width: 100, height: 100 }} source={require('./assets/botao_camera.png')} />
          {/* <FontAwesome name="camera" size={23} color="#FFF"></FontAwesome> */}
        </TouchableOpacity>

        <TouchableOpacity
          style={{ position: "absolute", right: 60 }}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          {/* <Text style={{ fontSize: 20, marginBottom: 13, color: "#fff" }}> */}
          <Image style={{ width: 40, height: 40 }} source={require("./assets/trocar.png")} />
          {/* </Text> */}
        </TouchableOpacity>
      </View>

      {capPhoto && (
        <Modal animationType="slide" transparent={false} visible={open}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: 'black',
              // margin: 20,
            }}
          >
            <Image
              style={{ width: "100%", height: 700, borderRadius: 5 }}
              source={{ uri: capPhoto }}
            ></Image>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly" }}>
              <View>
                <TouchableOpacity style={{ margin: 20, marginRight: 40 }} onPress={savePic}>
                  <Image style={{ width: 60, height: 60}} source={require('./assets/aceitar.png')} />
                  {/* <FontAwesome
                  name="upload"
                  size={50}
                  color="#121212"
                ></FontAwesome> */}
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  style={{ margin: 20, marginLeft: 40 }}
                  onPress={() => setOpen(false)}
                >
                  <Image style={{ width: 67, height: 60 }} source={require('./assets/recusar.png')} />
                  {/* <FontAwesome
                  name="window-close"
                  size={50}
                  color="#FF0000"
                ></FontAwesome> */}
                </TouchableOpacity>
              </View>


            </View>

          </View>


        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    // margin: 20,
    // borderRadius: 10,
    height: 150,
  },
});

